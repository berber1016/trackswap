import { IPlugin, IProcessingContext, BaseConverter } from "../core/base.js";
import { FITContext, FITDecoderMesgs, FITFileType } from "./types.js";

// ============ FIT 特定接口定义 ============

/**
 * FIT 消息转换器插件接口
 */
export interface IFITMessageConverter extends IPlugin<FITContext> {
  /** 支持的消息类型 */
  supportedMessageTypes: string[];
  /** 转换消息 */
  convertMessages(messages: any[], context: FITContext): any;
  /** 是否支持该消息类型 */
  supports(messageType: string): boolean;
  /** 优先级 */
  priority?: number;
}

/**
 * FIT 数据结构化插件接口
 */
export interface IFITStructurePlugin extends IPlugin<FITContext> {
  /** 结构化数据 */
  structureData(
    messages: FITDecoderMesgs,
    context: FITContext
  ): Partial<FITFileType>;
  /** 优先级 */
  priority?: number;
}

/**
 * FIT 中间件插件接口
 */
export interface IFITMiddlewarePlugin extends IPlugin<FITContext> {
  /** 优先级 */
  priority?: number;
  /** 在解析阶段执行 */
  onParse?(buffer: Buffer, context: FITContext): Promise<Buffer> | Buffer;
  /** 在消息提取阶段执行 */
  onExtractMessages?(
    messages: FITDecoderMesgs,
    context: FITContext
  ): Promise<FITDecoderMesgs> | FITDecoderMesgs;
  /** 在数据结构化阶段执行 */
  onStructure?(
    result: Partial<FITFileType>,
    context: FITContext
  ): Promise<Partial<FITFileType>> | Partial<FITFileType>;
  /** 在完成阶段执行 */
  onComplete?(
    result: FITFileType,
    context: FITContext
  ): Promise<FITFileType> | FITFileType;
  /** 错误处理 */
  onError?(error: Error, context: FITContext): Promise<void> | void;
}

// ============ 基础工具类 ============

/**
 * FIT 消息转换器基类
 */
export abstract class BaseFITMessageConverter implements IFITMessageConverter {
  abstract name: string;
  abstract supportedMessageTypes: string[];
  version = "1.0.0";
  priority = 100;

  abstract convertMessages(messages: any[], context: FITContext): any;

  supports(messageType: string): boolean {
    return this.supportedMessageTypes.includes(messageType);
  }

  async initialize(context: FITContext): Promise<void> {
    context.metadata.set(`plugin:${this.name}:initialized`, true);
  }

  async destroy(context: FITContext): Promise<void> {
    context.metadata.delete(`plugin:${this.name}:initialized`);
  }

  async validate(context: FITContext): Promise<boolean> {
    return true;
  }

  // ============ FIT 特定工具方法 ============

  protected parseTimestamp(timestamp: string | undefined): Date | undefined {
    if (!timestamp) return undefined;
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? undefined : date;
  }

  protected calculateDuration(startTime?: string, endTime?: string): number {
    if (!startTime || !endTime) return 0;
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    return Math.max(0, (end - start) / 1000); // 返回秒数
  }

  protected filterMessagesByTimeRange(
    messages: any[],
    startTime: string,
    endTime: string,
    tolerance: number = 2000 // 默认2秒容错
  ): any[] {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    return messages.filter((message) => {
      if (!message.timestamp) return false;
      const messageTime = new Date(message.timestamp).getTime();
      return messageTime >= start - tolerance && messageTime <= end + tolerance;
    });
  }

  protected groupMessagesByLap(
    records: any[],
    laps: any[]
  ): Array<{ lap: any; records: any[] }> {
    return laps.map((lap) => {
      const lapRecords = this.filterMessagesByTimeRange(
        records,
        lap.startTime,
        lap.timestamp
      );
      return { lap, records: lapRecords };
    });
  }
}

/**
 * FIT 数据结构化插件基类
 */
export abstract class BaseFITStructurePlugin implements IFITStructurePlugin {
  abstract name: string;
  version = "1.0.0";
  priority = 100;

  abstract structureData(
    messages: FITDecoderMesgs,
    context: FITContext
  ): Partial<FITFileType>;

  async initialize(context: FITContext): Promise<void> {
    context.metadata.set(`plugin:${this.name}:initialized`, true);
  }

  async destroy(context: FITContext): Promise<void> {
    context.metadata.delete(`plugin:${this.name}:initialized`);
  }

  async validate(context: FITContext): Promise<boolean> {
    return true;
  }
}

/**
 * FIT 中间件基类
 */
export abstract class BaseFITMiddleware implements IFITMiddlewarePlugin {
  abstract name: string;
  version = "1.0.0";
  description = "";
  priority = 100;

  async initialize(context: FITContext): Promise<void> {}
  async destroy(context: FITContext): Promise<void> {}
  async validate(context: FITContext): Promise<boolean> {
    return true;
  }

  async onParse(buffer: Buffer, context: FITContext): Promise<Buffer> {
    return buffer;
  }

  async onExtractMessages(
    messages: FITDecoderMesgs,
    context: FITContext
  ): Promise<FITDecoderMesgs> {
    return messages;
  }

  async onStructure(
    result: Partial<FITFileType>,
    context: FITContext
  ): Promise<Partial<FITFileType>> {
    return result;
  }

  async onComplete(
    result: FITFileType,
    context: FITContext
  ): Promise<FITFileType> {
    return result;
  }

  async onError(error: Error, context: FITContext): Promise<void> {
    console.error(`FIT中间件 ${this.name} 处理错误:`, error);
  }
}
