import { ExtensionsType, TokenAST } from "../types.js";
import { ITCXConverterPlugin, ITCXMiddlewarePlugin } from "./base.js";
import {
  PositionConverter,
  TrackpointConverter,
  TrackConverter,
  ActivityLapConverter,
  ActivityConverter,
  ActivityListConverter,
  MultiActivitySessionConverter,
  AbstractSourceConverter,
  ExtensionsConverter,
} from "./converters.js";
import {
  AstGenerateProcessor,
  CompleteProcessor,
  ConvertProcessor,
  IPipelineProcessor,
  TokenizeProcessor,
  TCXPipelineStage,
} from "./processor.js";
import { TCXContext, TCXFileType } from "./types.js";

/**
 * https://www8.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd
 */
export class TCXDecoder {
  private converterPlugins = new Map<string, ITCXConverterPlugin[]>();
  private registeredPlugins = new Set<string>(); // Track registered plugin names
  private middlewarePlugins: ITCXMiddlewarePlugin[] = [];
  private processors: IPipelineProcessor[] = []; // Fixed core processors
  private initialized = false;
  private defaultConvertersRegistered = false;

  constructor() {
    this.initializePipeline();
  }

  /**
   * Initialize pipeline - register fixed core processors
   */
  private initializePipeline(): void {
    // Fixed core processors, not modifiable by users
    this.processors = [
      new TokenizeProcessor(),
      new AstGenerateProcessor(),
      new ConvertProcessor((tag: string) => this.getConverter(tag)),
      new CompleteProcessor(),
    ];

  }

  /**
   * Auto-register default converters - handle standard TCX tags
   */
  private async registerDefaultConverters(): Promise<void> {
    if (this.defaultConvertersRegistered) return;

    const defaultConverters = [
      new PositionConverter(),
      new TrackpointConverter(),
      new TrackConverter(),
      new ActivityLapConverter(),
      new ActivityConverter(),
      new ActivityListConverter(),
      new MultiActivitySessionConverter(),
      new AbstractSourceConverter(),
      new ExtensionsConverter(),
    ];

    for (const converter of defaultConverters) {
      // Internal registration, no logs to avoid interference
      converter.supportedTags?.forEach((tag) => {
        this.addConverterForTag(tag, converter);
      });
      this.registeredPlugins.add(converter.name);
    }

    this.defaultConvertersRegistered = true;
  }

  /**
   * Add converter for specified tag, sorted by priority
   */
  private addConverterForTag(
    tag: string,
    converter: ITCXConverterPlugin
  ): void {
    if (!this.converterPlugins.has(tag)) {
      this.converterPlugins.set(tag, []);
    }

    const converters = this.converterPlugins.get(tag)!;
    converters.push(converter);

    // Sort by priority (lower number = higher priority)
    converters.sort((a, b) => (a.priority || 100) - (b.priority || 100));
  }

  /**
   * Register converter plugin
   */
  async registerConverter(plugin: ITCXConverterPlugin): Promise<void> {
    // Check if plugin is already registered
    if (this.registeredPlugins.has(plugin.name)) {
      throw new Error(`Converter plugin ${plugin.name} already exists`);
    }

    // Register supported tags (allow multiple converters to handle the same tag)
    plugin.supportedTags?.forEach((tag) => {
      this.addConverterForTag(tag, plugin);
    });
    this.registeredPlugins.add(plugin.name);

  }

  /**
   * Register middleware plugin - the real extension point
   */
  async registerMiddleware(plugin: ITCXMiddlewarePlugin): Promise<void> {
    const existingIndex = this.middlewarePlugins.findIndex(
      (p) => p.name === plugin.name
    );
    if (existingIndex !== -1) {
      this.middlewarePlugins[existingIndex] = plugin;
    } else {
      this.middlewarePlugins.push(plugin);
    }
  }

  /**
   * Get converter (returns highest priority one)
   */
  getConverter(tag: string): ITCXConverterPlugin | undefined {
    const converters = this.converterPlugins.get(tag);
    return converters && converters.length > 0 ? converters[0] : undefined;
  }

  /**
   * Get all converters for specified tag (sorted by priority)
   */
  getAllConverters(tag: string): ITCXConverterPlugin[] {
    return this.converterPlugins.get(tag) || [];
  }

  /**
   * Remove converter
   */
  unregisterConverter(pluginName: string): void {
    // Find plugin instance
    let pluginToRemove: ITCXConverterPlugin | undefined;

    for (const [tag, converters] of this.converterPlugins) {
      const index = converters.findIndex(
        (plugin) => plugin.name === pluginName
      );
      if (index !== -1) {
        pluginToRemove = converters[index];
        converters.splice(index, 1);

        // If no converters left for this tag, delete the entire entry
        if (converters.length === 0) {
          this.converterPlugins.delete(tag);
        }
      }
    }

    if (!pluginToRemove) {
      return;
    }

    this.registeredPlugins.delete(pluginName);
  }

  /**
   * Remove middleware
   */
  unregisterMiddleware(name: string): void {
    const index = this.middlewarePlugins.findIndex((p) => p.name === name);
    if (index !== -1) {
      this.middlewarePlugins.splice(index, 1);
    }
  }

  /**
   * Initialize decoder
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    // First register default converters
    await this.registerDefaultConverters();

    const context = this.createContext();

    // Initialize all plugins
    const allPlugins = [
      ...new Map(
        [
          ...Array.from(this.converterPlugins.values()).flat(),
          ...this.middlewarePlugins,
        ].map((plugin) => [plugin.name, plugin] as const)
      ).values(),
    ];

    for (const plugin of allPlugins) {
      await plugin.initialize?.(context);
    }

    this.initialized = true;
  }

  /**
   * Destroy decoder
   */
  async destroy(): Promise<void> {
    if (!this.initialized) return;

    const context = this.createContext();

    // Destroy all plugins
    const allPlugins = [
      ...new Map(
        [
          ...Array.from(this.converterPlugins.values()).flat(),
          ...this.middlewarePlugins,
        ].map((plugin) => [plugin.name, plugin] as const)
      ).values(),
    ];

    for (const plugin of allPlugins) {
      await plugin.destroy?.(context);
    }

    this.initialized = false;
  }

  /**
   * Create decode context
   */
  private createContext(): TCXContext {
    return {
      metadata: new Map(),
      errors: [],
      warnings: [],
      stats: {
        startTime: Date.now(),
        processedTokens: 0,
        convertedElements: 0,
      },
      performance: {
        startTime: Date.now(),
      },
    };
  }

  /**
   * Execute middleware hook
   */
  private async executeMiddlewareHook<T>(
    hookName: keyof ITCXMiddlewarePlugin,
    data: T,
    context: TCXContext
  ): Promise<T> {
    let result = data;

    for (const middleware of this.middlewarePlugins) {
      const hook = middleware[hookName] as Function;
      if (hook) {
        try {
          result = (await hook.call(middleware, result, context)) || result;
        } catch (error) {
          context.errors.push(error as Error);
          await middleware.onError?.(error as Error, context);
        }
      }
    }

    return result;
  }

  /**
   * Main parse method - fixed pipeline + flexible middleware
   */
  async parseByBuffer(buffer: Buffer): Promise<TCXFileType | undefined> {
    await this.initialize();

    let context = this.createContext();
    context.rawData = buffer;
    context.xmlContent = buffer.toString("utf-8");
    // Pass decoder instance reference in context
    context.metadata.set("decoder", this);

    for (const processor of this.processors) {
      try {
        context = await processor.process(context);

          // 2. Execute corresponding middleware hooks based on stage
        switch (processor.stage) {
            case TCXPipelineStage.TOKENIZE:
              if (context.tokens) {
                context.tokens = await this.executeMiddlewareHook(
                  "onTokenize",
                  context.tokens,
                  context
                );
              }
              break;

            case TCXPipelineStage.AST_GENERATE:
              if (context.ast) {
                context.ast = await this.executeMiddlewareHook(
                  "onAstGenerate",
                  context.ast,
                  context
                );
              }
              break;

            case TCXPipelineStage.CONVERT:
              if (context.result) {
                context.result = await this.executeMiddlewareHook(
                  "onConvert",
                  context.result,
                  context
                );
              }
              break;

            case TCXPipelineStage.COMPLETE:
              if (context.result) {
                context.result = await this.executeMiddlewareHook(
                  "onComplete",
                  context.result,
                  context
                );
              }
              break;
        }
      } catch (error) {
        context.errors.push(error as Error);
        for (const middleware of this.middlewarePlugins) {
          await middleware.onError?.(error as Error, context);
        }
        throw new Error(
          `TCX pipeline stage "${processor.stage}" failed: ${
            (error as Error).message
          }`
        );
      }
    }

    return context.result;
  }

  /**
   * Convert Extensions (backward compatibility)
   */
  convertExtensions(extensionsAST: TokenAST): ExtensionsType {
    const extensions: ExtensionsType = {};
    const { attributes, tag, value } = extensionsAST;

    // Process attributes
    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        (extensions as any)[key] = value as string;
      });
    }

    // If there are child nodes, process them directly without wrapping the outer tag
    if (extensionsAST?.children?.length) {
      extensionsAST.children?.forEach((child: TokenAST) => {
        extensions[child.tag as keyof ExtensionsType] =
          this.convertExtensions(child);
      });
    } else if (value !== undefined) {
      // If no child nodes but has value, return value directly
      return value as any;
    }

    return extensions;
  }

  // ==================== Backward Compatibility Methods ====================

  /**
   * @deprecated Use parseByBuffer instead
   */
  async parserByBuffer(buffer: Buffer): Promise<TCXFileType | undefined> {
    return this.parseByBuffer(buffer);
  }

  /**
   * @deprecated Use new plugin system instead
   */
  async parseByString(xmlContent: string): Promise<TCXFileType | undefined> {
    const buffer = Buffer.from(xmlContent, "utf-8");
    return this.parseByBuffer(buffer);
  }
}

export default {
  TCXDecoder,
};
