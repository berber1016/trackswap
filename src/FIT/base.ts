import { IPlugin, IProcessingContext, BaseConverter } from "../core/base.js";
import { FITContext, FITDecoderMesgs, FITFileType } from "./types.js";

// ============ FIT Specific Interface Definitions ============

/**
 * FIT message converter plugin interface
 */
export interface IFITMessageConverter extends IPlugin<FITContext> {
  /** Supported message types */
  supportedMessageTypes: string[];
  /** Convert messages */
  convertMessages(messages: any[], context: FITContext): any;
  /** Whether it supports the message type */
  supports(messageType: string): boolean;
  /** Priority */
  priority?: number;
}

/**
 * FIT data structuring plugin interface
 */
export interface IFITStructurePlugin extends IPlugin<FITContext> {
  /** Structure data */
  structureData(
    messages: FITDecoderMesgs,
    context: FITContext
  ): Partial<FITFileType>;
  /** Priority */
  priority?: number;
}

/**
 * FIT middleware plugin interface
 */
export interface IFITMiddlewarePlugin extends IPlugin<FITContext> {
  /** Priority */
  priority?: number;
  /** Execute during parse stage */
  onParse?(buffer: Buffer, context: FITContext): Promise<Buffer> | Buffer;
  /** Execute during message extraction stage */
  onExtractMessages?(
    messages: FITDecoderMesgs,
    context: FITContext
  ): Promise<FITDecoderMesgs> | FITDecoderMesgs;
  /** Execute during data structuring stage */
  onStructure?(
    result: Partial<FITFileType>,
    context: FITContext
  ): Promise<Partial<FITFileType>> | Partial<FITFileType>;
  /** Execute during completion stage */
  onComplete?(
    result: FITFileType,
    context: FITContext
  ): Promise<FITFileType> | FITFileType;
  /** Error handling */
  onError?(error: Error, context: FITContext): Promise<void> | void;
}

// ============ Base Utility Classes ============

/**
 * FIT message converter base class
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

  // ============ FIT Specific Utility Methods ============

  protected parseTimestamp(timestamp: string | undefined): Date | undefined {
    if (!timestamp) return undefined;
    const date = new Date(timestamp);
    return isNaN(date.getTime()) ? undefined : date;
  }

  protected calculateDuration(startTime?: string, endTime?: string): number {
    if (!startTime || !endTime) return 0;
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    return Math.max(0, (end - start) / 1000); // Return seconds
  }

  protected filterMessagesByTimeRange(
    messages: any[],
    startTime: string,
    endTime: string,
    tolerance: number = 2000 // Default 2 second tolerance
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
 * FIT data structuring plugin base class
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
 * FIT middleware base class
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
    console.error(`FIT middleware ${this.name} processing error:`, error);
  }
}
