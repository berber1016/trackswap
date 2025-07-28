import { ExtensionsType, TokenAST } from "../types.js";
import { ITCXConverterPlugin, ITCXMiddlewarePlugin } from "./base.js";
import {
  PositionConverter,
  TrackpointConverter,
  TrackConverter,
  ActivityLapConverter,
  ActivityConverter,
  ActivityListConverter,
  MultiSportSessionConverter,
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

    console.log(
      "🔧 TCX core pipeline processors initialized (fixed and not modifiable)"
    );
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
      new MultiSportSessionConverter(),
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
    console.log(
      "✅ Default TCX converters auto-registered (Activities, Position, Track, etc.)"
    );
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

    // Show priority information
    const priorityInfo =
      plugin.priority !== undefined ? ` (priority: ${plugin.priority})` : "";
    console.log(
      `📦 Registered custom TCX converter: ${
        plugin.name
      }${priorityInfo}, supported tags: ${plugin.supportedTags?.join(", ")}`
    );

    // Show converter priority order for tags
    plugin.supportedTags?.forEach((tag) => {
      const converters = this.converterPlugins.get(tag) || [];
      const converterNames = converters.map(
        (c) => `${c.name}(${c.priority || 100})`
      );
      console.log(
        `   📋 Tag "${tag}" converter priority: ${converterNames.join(" > ")}`
      );
    });
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
      console.log(`🔄 Updated TCX middleware: ${plugin.name}`);
    } else {
      this.middlewarePlugins.push(plugin);
      console.log(`🔌 Registered TCX middleware: ${plugin.name}`);
    }

    // Show supported hooks for middleware
    const hooks = [];
    if (plugin.onTokenize) hooks.push("onTokenize");
    if (plugin.onAstGenerate) hooks.push("onAstGenerate");
    if (plugin.onConvert) hooks.push("onConvert");
    if (plugin.onComplete) hooks.push("onComplete");
    if (plugin.onError) hooks.push("onError");

    if (hooks.length > 0) {
      console.log(`   🎣 Supported hooks: ${hooks.join(", ")}`);
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
      console.warn(`TCX converter plugin ${pluginName} does not exist`);
      return;
    }

    this.registeredPlugins.delete(pluginName);
    console.log(`🗑️ Removed TCX converter: ${pluginName}`);
  }

  /**
   * Remove middleware
   */
  unregisterMiddleware(name: string): void {
    const index = this.middlewarePlugins.findIndex((p) => p.name === name);
    if (index !== -1) {
      this.middlewarePlugins.splice(index, 1);
      console.log(`🗑️ Removed TCX middleware: ${name}`);
    } else {
      console.warn(`TCX middleware ${name} does not exist`);
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
      ...Array.from(this.converterPlugins.values()).flat(),
      ...this.middlewarePlugins,
    ];

    for (const plugin of allPlugins) {
      try {
        await plugin.initialize?.(context);
      } catch (error) {
        console.error(
          `TCX plugin ${plugin.name} initialization failed:`,
          error
        );
      }
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
      ...Array.from(this.converterPlugins.values()).flat(),
      ...this.middlewarePlugins,
    ];

    for (const plugin of allPlugins) {
      try {
        await plugin.destroy?.(context);
      } catch (error) {
        console.error(`TCX plugin ${plugin.name} destruction failed:`, error);
      }
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

    try {
      // Fixed pipeline stage sequential execution
      for (const processor of this.processors) {
        try {
          // 1. Execute core processor
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

          // Execute error handling middleware
          for (const middleware of this.middlewarePlugins) {
            await middleware.onError?.(error as Error, context);
          }

          console.error(
            `TCX pipeline stage ${processor.stage} processing failed:`,
            error
          );
        }
      }

      return context.result;
    } catch (error) {
      console.error("TCX parsing failed:", error);
      throw error;
    }
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
