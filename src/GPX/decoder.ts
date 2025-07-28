import { ExtensionsType, TokenAST } from "../types.js";
import { IGPXConverterPlugin, IGPXMiddlewarePlugin } from "./base.js";
import {
  BoundsConverter,
  CopyrightConverter,
  EmailConverter,
  ExtensionsConverter,
  LinkConverter,
  MetadataConverter,
  PersonConverter,
  RteConverter,
  TrkConverter,
  TrksegConverter,
  WptConverter,
} from "./converters.js";
import {
  AstGenerateProcessor,
  CompleteProcessor,
  ConvertProcessor,
  IPipelineProcessor,
  TokenizeProcessor,
  PipelineStage,
} from "./processor.js";
import { DecoderContext, GPX11Type } from "./types.js";

// ============ Main Decoder Class ============

/**
 * GPX decoder main class
 */
export class GPXDecoder {
  private converterPlugins = new Map<string, IGPXConverterPlugin[]>();
  private registeredPlugins = new Set<string>(); // Track registered plugin names
  private middlewarePlugins: IGPXMiddlewarePlugin[] = [];
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
      "🔧 Core pipeline processors initialized (fixed and not modifiable)"
    );
  }

  /**
   * Auto-register default converters - handle standard GPX tags
   */
  private async registerDefaultConverters(): Promise<void> {
    if (this.defaultConvertersRegistered) return;

    const defaultConverters = [
      new WptConverter(),
      new RteConverter(),
      new TrkConverter(),
      new TrksegConverter(),
      new LinkConverter(),
      new MetadataConverter(),
      new PersonConverter(),
      new EmailConverter(),
      new CopyrightConverter(),
      new BoundsConverter(),
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
      "✅ Default GPX converters auto-registered (wpt, rte, trk, metadata, etc.)"
    );
  }

  /**
   * Add converter for specified tag, sorted by priority
   */
  private addConverterForTag(
    tag: string,
    converter: IGPXConverterPlugin
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
  async registerConverter(plugin: IGPXConverterPlugin): Promise<void> {
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
      `📦 Registered custom converter: ${
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
  async registerMiddleware(plugin: IGPXMiddlewarePlugin): Promise<void> {
    const existingIndex = this.middlewarePlugins.findIndex(
      (p) => p.name === plugin.name
    );
    if (existingIndex !== -1) {
      this.middlewarePlugins[existingIndex] = plugin;
      console.log(`🔄 Updated middleware: ${plugin.name}`);
    } else {
      this.middlewarePlugins.push(plugin);
      console.log(`🔌 Registered middleware: ${plugin.name}`);
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
  getConverter(tag: string): IGPXConverterPlugin | undefined {
    const converters = this.converterPlugins.get(tag);
    return converters && converters.length > 0 ? converters[0] : undefined;
  }

  /**
   * Get all converters for specified tag (sorted by priority)
   */
  getAllConverters(tag: string): IGPXConverterPlugin[] {
    return this.converterPlugins.get(tag) || [];
  }

  /**
   * Remove converter
   */
  unregisterConverter(pluginName: string): void {
    // Find plugin instance
    let pluginToRemove: IGPXConverterPlugin | undefined;

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
      console.warn(`Converter plugin ${pluginName} does not exist`);
      return;
    }

    this.registeredPlugins.delete(pluginName);
    console.log(`🗑️ Removed converter: ${pluginName}`);
  }

  /**
   * Remove middleware
   */
  unregisterMiddleware(name: string): void {
    const index = this.middlewarePlugins.findIndex((p) => p.name === name);
    if (index !== -1) {
      this.middlewarePlugins.splice(index, 1);
      console.log(`🗑️ Removed middleware: ${name}`);
    } else {
      console.warn(`Middleware ${name} does not exist`);
    }
  }

  /**
   * List all registered converter tags
   */
  listConverters(): string[] {
    return Array.from(this.converterPlugins.keys());
  }

  /**
   * List all registered converter plugins
   */
  listConverterPlugins(): string[] {
    return Array.from(this.registeredPlugins);
  }

  /**
   * List all registered middleware
   */
  listMiddlewares(): string[] {
    return this.middlewarePlugins.map((p) => p.name);
  }

  /**
   * List core processors (read-only)
   */
  listProcessors(): string[] {
    return this.processors.map((p) => p.constructor.name);
  }

  /**
   * Get converter details for tag (including priority information)
   */
  getConverterDetails(
    tag?: string
  ): Record<string, Array<{ name: string; priority: number }>> {
    const result: Record<
      string,
      Array<{ name: string; priority: number }>
    > = {};

    if (tag) {
      const converters = this.converterPlugins.get(tag);
      if (converters) {
        result[tag] = converters.map((c) => ({
          name: c.name,
          priority: c.priority || 100,
        }));
      }
    } else {
      for (const [tagName, converters] of this.converterPlugins) {
        result[tagName] = converters.map((c) => ({
          name: c.name,
          priority: c.priority || 100,
        }));
      }
    }

    return result;
  }

  /**
   * Get middleware details (including supported hooks)
   */
  getMiddlewareDetails(): Array<{ name: string; hooks: string[] }> {
    return this.middlewarePlugins.map((plugin) => {
      const hooks = [];
      if (plugin.onTokenize) hooks.push("onTokenize");
      if (plugin.onAstGenerate) hooks.push("onAstGenerate");
      if (plugin.onConvert) hooks.push("onConvert");
      if (plugin.onComplete) hooks.push("onComplete");
      if (plugin.onError) hooks.push("onError");

      return {
        name: plugin.name,
        hooks,
      };
    });
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
        console.error(`Plugin ${plugin.name} initialization failed:`, error);
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
        console.error(`Plugin ${plugin.name} destruction failed:`, error);
      }
    }

    this.initialized = false;
  }

  /**
   * Create decode context
   */
  private createContext(): DecoderContext {
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
    hookName: keyof IGPXMiddlewarePlugin,
    data: T,
    context: DecoderContext
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
  async parserByBuffer(buffer: Buffer): Promise<GPX11Type | undefined> {
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
            case PipelineStage.TOKENIZE:
              if (context.tokens) {
                context.tokens = await this.executeMiddlewareHook(
                  "onTokenize",
                  context.tokens,
                  context
                );
              }
              break;

            case PipelineStage.AST_GENERATE:
              if (context.ast) {
                context.ast = await this.executeMiddlewareHook(
                  "onAstGenerate",
                  context.ast,
                  context
                );
              }
              break;

            case PipelineStage.CONVERT:
              if (context.result) {
                context.result = await this.executeMiddlewareHook(
                  "onConvert",
                  context.result,
                  context
                );
              }
              break;

            case PipelineStage.COMPLETE:
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
            `Pipeline stage ${processor.stage} processing failed:`,
            error
          );
        }
      }

      return context.result;
    } catch (error) {
      console.error("GPX parsing failed:", error);
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
}

export default {
  GPXDecoder,
};
