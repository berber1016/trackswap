// 移除旧的 FITProcessor 类，所有内容都在上面的流水线处理器中实现了

import {
  IFITMessageConverter,
  IFITStructurePlugin,
  IFITMiddlewarePlugin,
} from "./base.js";
import { FITDecoderMesgs, FITFileType, FITContext } from "./types.js";

/**
 * FIT 流水线阶段
 */
export enum FITPipelineStage {
  PARSE = "parse",
  EXTRACT = "extract",
  STRUCTURE = "structure",
  COMPLETE = "complete",
}

// ============ FIT 流水线处理器实现 ============

/**
 * FIT 流水线处理器接口
 */
export interface IFITPipelineProcessor {
  stage: FITPipelineStage;
  process(context: FITContext): Promise<FITContext>;
}

/**
 * Parse处理器 - 解析二进制FIT数据为消息
 */
export class ParseProcessor implements IFITPipelineProcessor {
  stage = FITPipelineStage.PARSE;

  async process(context: FITContext): Promise<FITContext> {
    const startTime = Date.now();

    if (!context.rawData) {
      throw new Error("FIT 数据不能为空");
    }

    try {
      // 使用 FIT SDK 解析二进制数据
      const rawMessages = await this.parseWithFitSDK(context.rawData);
      context.rawMessages = rawMessages;

      context.performance.parseTime = Date.now() - startTime;
      console.log(
        `🔧 FIT 解析完成，包含消息类型: ${Object.keys(rawMessages).join(", ")}`
      );

      return context;
    } catch (error) {
      throw new Error(`FIT 解析失败: ${(error as Error).message}`);
    }
  }

  /**
   * 使用 FIT SDK 解析二进制数据
   */
  private async parseWithFitSDK(buffer: Buffer): Promise<FITDecoderMesgs> {
    const { Decoder, Stream } = await import("@garmin/fitsdk");

    const stream = Stream.fromBuffer(buffer);
    if (!Decoder.isFIT(stream)) {
      throw new Error("不是有效的 FIT 文件");
    }

    const decoder = new Decoder(stream);
    const { messages, errors } = decoder.read();

    if (errors && errors.length > 0) {
      console.warn("FIT 解析警告:", errors);
    }

    return messages as FITDecoderMesgs;
  }
}

/**
 * Extract处理器 - 提取和转换消息
 */
export class ExtractProcessor implements IFITPipelineProcessor {
  stage = FITPipelineStage.EXTRACT;

  constructor(
    private getConverters: (messageType: string) => IFITMessageConverter[]
  ) {}

  async process(context: FITContext): Promise<FITContext> {
    const startTime = Date.now();

    if (!context.rawMessages) {
      throw new Error("原始消息不能为空");
    }

    const extractedMessages: FITDecoderMesgs = {};

    // 遍历所有消息类型
    for (const [messageType, messages] of Object.entries(context.rawMessages)) {
      if (!Array.isArray(messages) || messages.length === 0) {
        extractedMessages[messageType] = messages;
        continue;
      }

      const converters = this.getConverters(messageType);

      if (converters.length === 0) {
        // 没有转换器，直接使用原始消息
        extractedMessages[messageType] = messages;
        console.log(`📋 消息类型 "${messageType}" 没有转换器，使用原始数据`);
      } else {
        // 使用优先级最高的转换器
        const converter = converters[0];
        try {
          const convertedMessages = converter.convertMessages(
            messages,
            context
          );
          extractedMessages[messageType] = convertedMessages;
          console.log(
            `✅ 消息类型 "${messageType}" 使用转换器 ${converter.name}`
          );
        } catch (error) {
          context.errors.push(error as Error);
          extractedMessages[messageType] = messages; // 回退到原始消息
          console.error(
            `❌ 转换器 ${converter.name} 处理 ${messageType} 时出错:`,
            error
          );
        }
      }
    }

    context.rawMessages = extractedMessages;
    context.performance.extractTime = Date.now() - startTime;

    return context;
  }
}

/**
 * Structure处理器 - 数据结构化
 */
export class StructureProcessor implements IFITPipelineProcessor {
  stage = FITPipelineStage.STRUCTURE;

  constructor(private getStructurePlugins: () => IFITStructurePlugin[]) {}

  async process(context: FITContext): Promise<FITContext> {
    const startTime = Date.now();

    if (!context.rawMessages) {
      throw new Error("消息数据不能为空");
    }

    let structuredResult: Partial<FITFileType> = {};

    // 应用所有结构化插件
    const plugins = this.getStructurePlugins();

    for (const plugin of plugins) {
      try {
        const pluginResult = plugin.structureData(context.rawMessages, context);
        structuredResult = { ...structuredResult, ...pluginResult };
        console.log(`🔧 结构化插件 ${plugin.name} 处理完成`);
      } catch (error) {
        context.errors.push(error as Error);
        console.error(`❌ 结构化插件 ${plugin.name} 出错:`, error);
      }
    }

    context.result = structuredResult as FITFileType;
    context.performance.structureTime = Date.now() - startTime;

    return context;
  }
}

/**
 * Complete处理器 - 最终处理和清理
 */
export class CompleteProcessor implements IFITPipelineProcessor {
  stage = FITPipelineStage.COMPLETE;

  async process(context: FITContext): Promise<FITContext> {
    context.performance.endTime = Date.now();

    // 记录性能指标
    const totalTime =
      context.performance.endTime - context.performance.startTime;
    context.metadata.set("performance", {
      totalTime,
      parseTime: context.performance.parseTime,
      extractTime: context.performance.extractTime,
      structureTime: context.performance.structureTime,
    });

    // 更新统计信息
    if (context.stats) {
      context.stats.endTime = Date.now();
      if (context.rawMessages) {
        context.stats.processedTokens = this.countTotalMessages(
          context.rawMessages
        );
      }
    }

    console.log(`✅ FIT 处理完成，总耗时: ${totalTime}ms`);

    return context;
  }

  /**
   * 计算消息总数
   */
  private countTotalMessages(messages: FITDecoderMesgs): number {
    let count = 0;
    Object.values(messages).forEach((messageArray) => {
      if (Array.isArray(messageArray)) {
        count += messageArray.length;
      }
    });
    return count;
  }
}
