import {
  IFITMessageConverter,
  IFITStructurePlugin,
  IFITMiddlewarePlugin,
} from "./base.js";
import { FITFileType, FITContext } from "./types.js";
import {
  ParseProcessor,
  ExtractProcessor,
  StructureProcessor,
  CompleteProcessor,
  IFITPipelineProcessor,
  FITPipelineStage,
} from "./processor.js";
import {
  SessionStructurePlugin,
  CourseStructurePlugin,
  FileHeaderPlugin,
} from "./plugins.js";

/**
 * FIT decoder - follows GPX style plugin architecture
 */
export class FITDecoder {
  private converterPlugins = new Map<string, IFITMessageConverter[]>();
  private registeredPlugins = new Set<string>(); // Track registered plugin names
  private structurePlugins: IFITStructurePlugin[] = [];
  private middlewarePlugins: IFITMiddlewarePlugin[] = [];
  private processors: IFITPipelineProcessor[] = []; // Fixed core processors
  private initialized = false;
  private defaultPluginsRegistered = false;

  constructor() {
    this.initializePipeline();
  }

  /**
   * Initialize pipeline - register fixed core processors
   */
  private initializePipeline(): void {
    // Fixed core processors, not modifiable by users
    this.processors = [
      new ParseProcessor(),
      new ExtractProcessor((messageType: string) =>
        this.getConverters(messageType)
      ),
      new StructureProcessor(() => this.structurePlugins),
      new CompleteProcessor(),
    ];

    console.log(
      "🔧 FIT core pipeline processors initialized (fixed and not modifiable)"
    );
  }

  /**
   * Auto-register default plugins
   */
  private async registerDefaultPlugins(): Promise<void> {
    if (this.defaultPluginsRegistered) return;

    const defaultStructurePlugins = [
      new FileHeaderPlugin(),
      new SessionStructurePlugin(),
      new CourseStructurePlugin(),
    ];

    for (const plugin of defaultStructurePlugins) {
      this.addStructurePlugin(plugin);
      this.registeredPlugins.add(plugin.name);
    }

    this.defaultPluginsRegistered = true;
    console.log(
      "✅ Default FIT structure plugins auto-registered (FileHeader, Session, Course, etc.)"
    );
  }

  /**
   * Add converter for specific message type, sorted by priority
   */
  private addConverterForMessageType(
    messageType: string,
    converter: IFITMessageConverter
  ): void {
    if (!this.converterPlugins.has(messageType)) {
      this.converterPlugins.set(messageType, []);
    }

    const converters = this.converterPlugins.get(messageType)!;
    converters.push(converter);

    // Sort by priority (lower number = higher priority)
    converters.sort((a, b) => (a.priority || 100) - (b.priority || 100));
  }

  /**
   * Add structure plugin
   */
  private addStructurePlugin(plugin: IFITStructurePlugin): void {
    this.structurePlugins.push(plugin);
    // Sort by priority
    this.structurePlugins.sort(
      (a, b) => (a.priority || 100) - (b.priority || 100)
    );
  }

  /**
   * Register message converter plugin
   */
  async registerMessageConverter(plugin: IFITMessageConverter): Promise<void> {
    // Check if plugin is already registered
    if (this.registeredPlugins.has(plugin.name)) {
      throw new Error(`Message converter plugin ${plugin.name} already exists`);
    }

    // Register supported message types
    plugin.supportedMessageTypes.forEach((messageType) => {
      this.addConverterForMessageType(messageType, plugin);
    });
    this.registeredPlugins.add(plugin.name);

    // Show priority information
    const priorityInfo =
      plugin.priority !== undefined ? ` (priority: ${plugin.priority})` : "";
    console.log(
      `📦 Registered FIT message converter: ${
        plugin.name
      }${priorityInfo}, supported message types: ${plugin.supportedMessageTypes.join(
        ", "
      )}`
    );

    // Show converter priority order for message types
    plugin.supportedMessageTypes.forEach((messageType) => {
      const converters = this.converterPlugins.get(messageType) || [];
      const converterNames = converters.map(
        (c) => `${c.name}(${c.priority || 100})`
      );
      console.log(
        `   📋 Message type "${messageType}" converter priority: ${converterNames.join(
          " > "
        )}`
      );
    });
  }

  /**
   * Register structure plugin
   */
  async registerStructurePlugin(plugin: IFITStructurePlugin): Promise<void> {
    if (this.registeredPlugins.has(plugin.name)) {
      throw new Error(`Structure plugin ${plugin.name} already exists`);
    }

    this.addStructurePlugin(plugin);
    this.registeredPlugins.add(plugin.name);

    const priorityInfo =
      plugin.priority !== undefined ? ` (priority: ${plugin.priority})` : "";
    console.log(
      `🏗️ Registered FIT structure plugin: ${plugin.name}${priorityInfo}`
    );
  }

  /**
   * Register middleware plugin
   */
  async registerMiddleware(plugin: IFITMiddlewarePlugin): Promise<void> {
    const existingIndex = this.middlewarePlugins.findIndex(
      (p) => p.name === plugin.name
    );
    if (existingIndex !== -1) {
      this.middlewarePlugins[existingIndex] = plugin;
      console.log(`🔄 Updated FIT middleware: ${plugin.name}`);
    } else {
      this.middlewarePlugins.push(plugin);
      // Sort by priority
      this.middlewarePlugins.sort(
        (a, b) => (a.priority || 100) - (b.priority || 100)
      );
      console.log(`🔌 Registered FIT middleware: ${plugin.name}`);
    }

    // Show supported hooks for middleware
    const hooks = [];
    if (plugin.onParse) hooks.push("onParse");
    if (plugin.onExtractMessages) hooks.push("onExtractMessages");
    if (plugin.onStructure) hooks.push("onStructure");
    if (plugin.onComplete) hooks.push("onComplete");
    if (plugin.onError) hooks.push("onError");

    if (hooks.length > 0) {
      console.log(`   🎣 Supported hooks: ${hooks.join(", ")}`);
    }
  }

  /**
   * Get message type converter (returns highest priority one)
   */
  getConverter(messageType: string): IFITMessageConverter | undefined {
    const converters = this.converterPlugins.get(messageType);
    return converters && converters.length > 0 ? converters[0] : undefined;
  }

  /**
   * Get all converters for specified message type (sorted by priority)
   */
  getConverters(messageType: string): IFITMessageConverter[] {
    return this.converterPlugins.get(messageType) || [];
  }

  /**
   * Remove plugin
   */
  unregisterPlugin(pluginName: string): boolean {
    if (!this.registeredPlugins.has(pluginName)) {
      console.warn(`FIT plugin ${pluginName} does not exist`);
      return false;
    }

    // Remove from message converters
    for (const [messageType, converters] of this.converterPlugins) {
      const index = converters.findIndex(
        (plugin) => plugin.name === pluginName
      );
      if (index !== -1) {
        converters.splice(index, 1);
        if (converters.length === 0) {
          this.converterPlugins.delete(messageType);
        }
      }
    }

    // Remove from structure plugins
    const structureIndex = this.structurePlugins.findIndex(
      (plugin) => plugin.name === pluginName
    );
    if (structureIndex !== -1) {
      this.structurePlugins.splice(structureIndex, 1);
    }

    // Remove from middleware
    const middlewareIndex = this.middlewarePlugins.findIndex(
      (plugin) => plugin.name === pluginName
    );
    if (middlewareIndex !== -1) {
      this.middlewarePlugins.splice(middlewareIndex, 1);
    }

    this.registeredPlugins.delete(pluginName);
    console.log(`🗑️ Removed FIT plugin: ${pluginName}`);
    return true;
  }

  /**
   * Initialize decoder
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Register default plugins first
    await this.registerDefaultPlugins();

    const context = this.createContext();

    // Initialize all plugins
    const allPlugins = [
      ...Array.from(this.converterPlugins.values()).flat(),
      ...this.structurePlugins,
      ...this.middlewarePlugins,
    ];

    for (const plugin of allPlugins) {
      try {
        await plugin.initialize?.(context);
      } catch (error) {
        console.error(
          `FIT plugin ${plugin.name} initialization failed:`,
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
      ...this.structurePlugins,
      ...this.middlewarePlugins,
    ];

    for (const plugin of allPlugins) {
      try {
        await plugin.destroy?.(context);
      } catch (error) {
        console.error(`FIT plugin ${plugin.name} destruction failed:`, error);
      }
    }

    this.initialized = false;
  }

  /**
   * Create decode context
   */
  private createContext(): FITContext {
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
    hookName: keyof IFITMiddlewarePlugin,
    data: T,
    context: FITContext
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
  async parseByBuffer(
    buffer: Buffer,
    options: {
      skipValidation?: boolean;
      enableStats?: boolean;
      userData?: Record<string, any>;
    } = {}
  ): Promise<FITFileType | undefined> {
    await this.initialize();

    let context = this.createContext();
    context.rawData = buffer;
    context.userData = options.userData;
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
            case FITPipelineStage.PARSE:
              if (context.rawData) {
                context.rawData = await this.executeMiddlewareHook(
                  "onParse",
                  context.rawData,
                  context
                );
              }
              break;

            case FITPipelineStage.EXTRACT:
              if (context.rawMessages) {
                context.rawMessages = await this.executeMiddlewareHook(
                  "onExtractMessages",
                  context.rawMessages,
                  context
                );
              }
              break;

            case FITPipelineStage.STRUCTURE:
              if (context.result) {
                context.result = await this.executeMiddlewareHook(
                  "onStructure",
                  context.result,
                  context
                );
              }
              break;

            case FITPipelineStage.COMPLETE:
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
            `FIT pipeline stage ${processor.stage} processing failed:`,
            error
          );
        }
      }
      console.log("🎉 FIT parsing completed",context.result);
      return context.result;
    } catch (error) {
      console.error("FIT parsing failed:", error);
      throw error;
    }
  }
}

export default {
  FITDecoder,
};
