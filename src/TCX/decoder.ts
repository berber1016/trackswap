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
} from "./converters.js";
import {
  AstGenerateProcessor,
  CompleteProcessor,
  ConvertProcessor,
  IPipelineProcessor,
  TokenizeProcessor,
  PipelineStage,
} from "./processor.js";
import { TCXContext, TCXFileType } from "./types.js";

/**
 * https://www8.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd
 */
export class TCXDecoder {
  private converterPlugins = new Map<string, ITCXConverterPlugin[]>();
  private registeredPlugins = new Set<string>(); // 跟踪已注册的插件名
  private middlewarePlugins: ITCXMiddlewarePlugin[] = [];
  private processors: IPipelineProcessor[] = []; // 固定的核心处理器
  private initialized = false;
  private defaultConvertersRegistered = false;

  constructor() {
    this.initializePipeline();
  }

  /**
   * 初始化流水线 - 注册固定的核心处理器
   */
  private initializePipeline(): void {
    // 固定的核心处理器，不允许用户修改
    this.processors = [
      new TokenizeProcessor(),
      new AstGenerateProcessor(),
      new ConvertProcessor((tag: string) => this.getConverter(tag)),
      new CompleteProcessor(),
    ];

    console.log("🔧 TCX核心流水线处理器已初始化 (固定不可修改)");
  }

  /**
   * 自动注册默认转换器 - 处理标准TCX标签
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
    ];

    for (const converter of defaultConverters) {
      // 内部注册，不显示日志避免干扰
      converter.supportedTags?.forEach((tag) => {
        this.addConverterForTag(tag, converter);
      });
      this.registeredPlugins.add(converter.name);
    }

    this.defaultConvertersRegistered = true;
    console.log("✅ 默认TCX转换器已自动注册 (Activities, Position, Track等)");
  }

  /**
   * 为指定标签添加转换器，按优先级排序
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

    // 按优先级排序（数字越小优先级越高）
    converters.sort((a, b) => (a.priority || 100) - (b.priority || 100));
  }

  /**
   * 注册转换器插件
   */
  async registerConverter(plugin: ITCXConverterPlugin): Promise<void> {
    // 检查插件是否已注册
    if (this.registeredPlugins.has(plugin.name)) {
      throw new Error(`转换器插件 ${plugin.name} 已存在`);
    }

    // 注册支持的标签（允许多个转换器处理同一标签）
    plugin.supportedTags?.forEach((tag) => {
      this.addConverterForTag(tag, plugin);
    });
    this.registeredPlugins.add(plugin.name);

    // 显示优先级信息
    const priorityInfo =
      plugin.priority !== undefined ? ` (优先级: ${plugin.priority})` : "";
    console.log(
      `📦 已注册自定义TCX转换器: ${
        plugin.name
      }${priorityInfo}, 支持标签: ${plugin.supportedTags?.join(", ")}`
    );

    // 显示标签的转换器优先级顺序
    plugin.supportedTags?.forEach((tag) => {
      const converters = this.converterPlugins.get(tag) || [];
      const converterNames = converters.map(
        (c) => `${c.name}(${c.priority || 100})`
      );
      console.log(
        `   📋 标签 "${tag}" 转换器优先级: ${converterNames.join(" > ")}`
      );
    });
  }

  /**
   * 注册中间件插件 - 真正的扩展点
   */
  async registerMiddleware(plugin: ITCXMiddlewarePlugin): Promise<void> {
    const existingIndex = this.middlewarePlugins.findIndex(
      (p) => p.name === plugin.name
    );
    if (existingIndex !== -1) {
      this.middlewarePlugins[existingIndex] = plugin;
      console.log(`🔄 已更新TCX中间件: ${plugin.name}`);
    } else {
      this.middlewarePlugins.push(plugin);
      console.log(`🔌 已注册TCX中间件: ${plugin.name}`);
    }

    // 显示中间件支持的钩子
    const hooks = [];
    if (plugin.onTokenize) hooks.push("onTokenize");
    if (plugin.onAstGenerate) hooks.push("onAstGenerate");
    if (plugin.onConvert) hooks.push("onConvert");
    if (plugin.onComplete) hooks.push("onComplete");
    if (plugin.onError) hooks.push("onError");

    if (hooks.length > 0) {
      console.log(`   🎣 支持的钩子: ${hooks.join(", ")}`);
    }
  }

  /**
   * 获取转换器（返回优先级最高的）
   */
  getConverter(tag: string): ITCXConverterPlugin | undefined {
    const converters = this.converterPlugins.get(tag);
    return converters && converters.length > 0 ? converters[0] : undefined;
  }

  /**
   * 获取指定标签的所有转换器（按优先级排序）
   */
  getAllConverters(tag: string): ITCXConverterPlugin[] {
    return this.converterPlugins.get(tag) || [];
  }

  /**
   * 移除转换器
   */
  unregisterConverter(pluginName: string): void {
    // 找到插件实例
    let pluginToRemove: ITCXConverterPlugin | undefined;

    for (const [tag, converters] of this.converterPlugins) {
      const index = converters.findIndex(
        (plugin) => plugin.name === pluginName
      );
      if (index !== -1) {
        pluginToRemove = converters[index];
        converters.splice(index, 1);

        // 如果该标签没有转换器了，删除整个条目
        if (converters.length === 0) {
          this.converterPlugins.delete(tag);
        }
      }
    }

    if (!pluginToRemove) {
      console.warn(`TCX转换器插件 ${pluginName} 不存在`);
      return;
    }

    this.registeredPlugins.delete(pluginName);
    console.log(`🗑️ 已移除TCX转换器: ${pluginName}`);
  }

  /**
   * 移除中间件
   */
  unregisterMiddleware(name: string): void {
    const index = this.middlewarePlugins.findIndex((p) => p.name === name);
    if (index !== -1) {
      this.middlewarePlugins.splice(index, 1);
      console.log(`🗑️ 已移除TCX中间件: ${name}`);
    } else {
      console.warn(`TCX中间件 ${name} 不存在`);
    }
  }

  /**
   * 初始化解码器
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    // 首先注册默认转换器
    await this.registerDefaultConverters();

    const context = this.createContext();

    // 初始化所有插件
    const allPlugins = [
      ...Array.from(this.converterPlugins.values()).flat(),
      ...this.middlewarePlugins,
    ];

    for (const plugin of allPlugins) {
      try {
        await plugin.initialize?.(context);
      } catch (error) {
        console.error(`TCX插件 ${plugin.name} 初始化失败:`, error);
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
      ...this.middlewarePlugins,
    ];

    for (const plugin of allPlugins) {
      try {
        await plugin.destroy?.(context);
      } catch (error) {
        console.error(`TCX插件 ${plugin.name} 销毁失败:`, error);
      }
    }

    this.initialized = false;
  }

  /**
   * 创建解码上下文
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
   * 执行中间件钩子
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
   * 主解析方法 - 固定的流水线 + 灵活的中间件
   */
  async parseByBuffer(buffer: Buffer): Promise<TCXFileType | undefined> {
    await this.initialize();

    let context = this.createContext();
    context.rawData = buffer;
    context.xmlContent = buffer.toString("utf-8");
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

          // 执行错误处理中间件
          for (const middleware of this.middlewarePlugins) {
            await middleware.onError?.(error as Error, context);
          }

          console.error(`TCX流水线阶段 ${processor.stage} 处理失败:`, error);
        }
      }

      return context.result;
    } catch (error) {
      console.error("TCX解析失败:", error);
      throw error;
    }
  }

  /**
   * 转换Extensions（向后兼容）
   */
  convertExtensions(extensionsAST: TokenAST): ExtensionsType {
    const extensions: ExtensionsType = {};
    const { attributes, tag, value } = extensionsAST;

    // 处理属性
    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        (extensions as any)[key] = value as string;
      });
    }

    // 如果有子节点，直接处理子节点，不再包装外层标签
    if (extensionsAST?.children?.length) {
      extensionsAST.children?.forEach((child: TokenAST) => {
        extensions[child.tag as keyof ExtensionsType] =
          this.convertExtensions(child);
      });
    } else if (value !== undefined) {
      // 如果没有子节点但有值，直接返回值
      return value as any;
    }

    return extensions;
  }

  // ==================== 向后兼容方法 ====================

  /**
   * @deprecated 使用 parseByBuffer 替代
   */
  async parserByBuffer(buffer: Buffer): Promise<TCXFileType | undefined> {
    return this.parseByBuffer(buffer);
  }

  /**
   * @deprecated 使用新的插件系统替代
   */
  async parseByString(xmlContent: string): Promise<TCXFileType | undefined> {
    const buffer = Buffer.from(xmlContent, "utf-8");
    return this.parseByBuffer(buffer);
  }
}

export default {
  TCXDecoder,
};
