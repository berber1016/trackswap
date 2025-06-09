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
 * FIT 解码器 - 遵循 GPX 风格的插件架构
 */
export class FITDecoder {
  private converterPlugins = new Map<string, IFITMessageConverter[]>();
  private registeredPlugins = new Set<string>(); // 跟踪已注册的插件名
  private structurePlugins: IFITStructurePlugin[] = [];
  private middlewarePlugins: IFITMiddlewarePlugin[] = [];
  private processors: IFITPipelineProcessor[] = []; // 固定的核心处理器
  private initialized = false;
  private defaultPluginsRegistered = false;

  constructor() {
    this.initializePipeline();
  }

  /**
   * 初始化流水线 - 注册固定的核心处理器
   */
  private initializePipeline(): void {
    // 固定的核心处理器，不允许用户修改
    this.processors = [
      new ParseProcessor(),
      new ExtractProcessor((messageType: string) =>
        this.getConverters(messageType)
      ),
      new StructureProcessor(() => this.structurePlugins),
      new CompleteProcessor(),
    ];

    console.log("🔧 FIT核心流水线处理器已初始化 (固定不可修改)");
  }

  /**
   * 自动注册默认插件
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
      "✅ 默认FIT结构化插件已自动注册 (FileHeader, Session, Course等)"
    );
  }

  /**
   * 为指定消息类型添加转换器，按优先级排序
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

    // 按优先级排序（数字越小优先级越高）
    converters.sort((a, b) => (a.priority || 100) - (b.priority || 100));
  }

  /**
   * 添加结构化插件
   */
  private addStructurePlugin(plugin: IFITStructurePlugin): void {
    this.structurePlugins.push(plugin);
    // 按优先级排序
    this.structurePlugins.sort(
      (a, b) => (a.priority || 100) - (b.priority || 100)
    );
  }

  /**
   * 注册消息转换器插件
   */
  async registerMessageConverter(plugin: IFITMessageConverter): Promise<void> {
    // 检查插件是否已注册
    if (this.registeredPlugins.has(plugin.name)) {
      throw new Error(`消息转换器插件 ${plugin.name} 已存在`);
    }

    // 注册支持的消息类型
    plugin.supportedMessageTypes.forEach((messageType) => {
      this.addConverterForMessageType(messageType, plugin);
    });
    this.registeredPlugins.add(plugin.name);

    // 显示优先级信息
    const priorityInfo =
      plugin.priority !== undefined ? ` (优先级: ${plugin.priority})` : "";
    console.log(
      `📦 已注册FIT消息转换器: ${
        plugin.name
      }${priorityInfo}, 支持消息类型: ${plugin.supportedMessageTypes.join(
        ", "
      )}`
    );

    // 显示消息类型的转换器优先级顺序
    plugin.supportedMessageTypes.forEach((messageType) => {
      const converters = this.converterPlugins.get(messageType) || [];
      const converterNames = converters.map(
        (c) => `${c.name}(${c.priority || 100})`
      );
      console.log(
        `   📋 消息类型 "${messageType}" 转换器优先级: ${converterNames.join(
          " > "
        )}`
      );
    });
  }

  /**
   * 注册结构化插件
   */
  async registerStructurePlugin(plugin: IFITStructurePlugin): Promise<void> {
    if (this.registeredPlugins.has(plugin.name)) {
      throw new Error(`结构化插件 ${plugin.name} 已存在`);
    }

    this.addStructurePlugin(plugin);
    this.registeredPlugins.add(plugin.name);

    const priorityInfo =
      plugin.priority !== undefined ? ` (优先级: ${plugin.priority})` : "";
    console.log(`🏗️ 已注册FIT结构化插件: ${plugin.name}${priorityInfo}`);
  }

  /**
   * 注册中间件插件
   */
  async registerMiddleware(plugin: IFITMiddlewarePlugin): Promise<void> {
    const existingIndex = this.middlewarePlugins.findIndex(
      (p) => p.name === plugin.name
    );
    if (existingIndex !== -1) {
      this.middlewarePlugins[existingIndex] = plugin;
      console.log(`🔄 已更新FIT中间件: ${plugin.name}`);
    } else {
      this.middlewarePlugins.push(plugin);
      // 按优先级排序
      this.middlewarePlugins.sort(
        (a, b) => (a.priority || 100) - (b.priority || 100)
      );
      console.log(`🔌 已注册FIT中间件: ${plugin.name}`);
    }

    // 显示中间件支持的钩子
    const hooks = [];
    if (plugin.onParse) hooks.push("onParse");
    if (plugin.onExtractMessages) hooks.push("onExtractMessages");
    if (plugin.onStructure) hooks.push("onStructure");
    if (plugin.onComplete) hooks.push("onComplete");
    if (plugin.onError) hooks.push("onError");

    if (hooks.length > 0) {
      console.log(`   🎣 支持的钩子: ${hooks.join(", ")}`);
    }
  }

  /**
   * 获取消息类型转换器（返回优先级最高的）
   */
  getConverter(messageType: string): IFITMessageConverter | undefined {
    const converters = this.converterPlugins.get(messageType);
    return converters && converters.length > 0 ? converters[0] : undefined;
  }

  /**
   * 获取指定消息类型的所有转换器（按优先级排序）
   */
  getConverters(messageType: string): IFITMessageConverter[] {
    return this.converterPlugins.get(messageType) || [];
  }

  /**
   * 移除插件
   */
  unregisterPlugin(pluginName: string): boolean {
    if (!this.registeredPlugins.has(pluginName)) {
      console.warn(`FIT插件 ${pluginName} 不存在`);
      return false;
    }

    // 从消息转换器中移除
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

    // 从结构化插件中移除
    const structureIndex = this.structurePlugins.findIndex(
      (plugin) => plugin.name === pluginName
    );
    if (structureIndex !== -1) {
      this.structurePlugins.splice(structureIndex, 1);
    }

    // 从中间件中移除
    const middlewareIndex = this.middlewarePlugins.findIndex(
      (plugin) => plugin.name === pluginName
    );
    if (middlewareIndex !== -1) {
      this.middlewarePlugins.splice(middlewareIndex, 1);
    }

    this.registeredPlugins.delete(pluginName);
    console.log(`🗑️ 已移除FIT插件: ${pluginName}`);
    return true;
  }

  /**
   * 初始化解码器
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    // 首先注册默认插件
    await this.registerDefaultPlugins();

    const context = this.createContext();

    // 初始化所有插件
    const allPlugins = [
      ...Array.from(this.converterPlugins.values()).flat(),
      ...this.structurePlugins,
      ...this.middlewarePlugins,
    ];

    for (const plugin of allPlugins) {
      try {
        await plugin.initialize?.(context);
      } catch (error) {
        console.error(`FIT插件 ${plugin.name} 初始化失败:`, error);
      }
    }

    this.initialized = true;
  }

  /**
   * 销毁解码器
   */
  async destroy(): Promise<void> {
    if (!this.initialized) return;

    const context = this.createContext();

    // 销毁所有插件
    const allPlugins = [
      ...Array.from(this.converterPlugins.values()).flat(),
      ...this.structurePlugins,
      ...this.middlewarePlugins,
    ];

    for (const plugin of allPlugins) {
      try {
        await plugin.destroy?.(context);
      } catch (error) {
        console.error(`FIT插件 ${plugin.name} 销毁失败:`, error);
      }
    }

    this.initialized = false;
  }

  /**
   * 创建解码上下文
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
   * 执行中间件钩子
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
   * 主解析方法 - 固定的流水线 + 灵活的中间件
   */
  async parseByBuffer(
    buffer: Buffer,
    options: {
      skipValidation?: boolean;
      enableStats?: boolean;
      userData?: Record<string, any>;
    } = {}
  ): Promise<FITFileType> {
    await this.initialize();

    let context = this.createContext();
    context.rawData = buffer;
    context.userData = options.userData;
    // 在上下文中传递解码器实例引用
    context.metadata.set("decoder", this);

    try {
      // 固定的流水线阶段顺序执行
      for (const processor of this.processors) {
        try {
          // 1. 执行核心处理器
          context = await processor.process(context);

          // 2. 根据阶段执行对应的中间件钩子
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

          // 执行错误处理中间件
          for (const middleware of this.middlewarePlugins) {
            await middleware.onError?.(error as Error, context);
          }

          console.error(`FIT流水线阶段 ${processor.stage} 处理失败:`, error);
        }
      }

      return context.result || ({} as FITFileType);
    } catch (error) {
      console.error("FIT解析失败:", error);
      throw error;
    }
  }
}

export default {
  FITDecoder,
};
