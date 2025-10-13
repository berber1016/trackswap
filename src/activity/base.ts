import {
  IPlugin,
  IConverterPlugin,
  IMiddlewarePlugin,
  BaseConverter,
  BaseMiddleware,
  IProcessingContext,
} from "../core/base.js";
import {
  ActivityType,
  ActivityRecordType,
  ActivityLapType,
  TokenAST,
  FileType,
} from "../types.js";
import dayjs from "dayjs";

// ============ Activity Specific Interface Definitions ============

/**
 * Activity processing context
 */
export interface ActivityContext extends IProcessingContext {
  /** Original data type */
  sourceFormat: string;
  /** Original data */
  sourceData: any;
  /** Conversion result */
  result?: FileType;
  /** Activity-specific performance statistics */
  performance: {
    startTime: number;
    convertTime?: number;
    endTime?: number;
  };
}

/**
 * Activity encoding context
 */
export interface ActivityEncodingContext extends IProcessingContext {
  /** Target format */
  targetFormat: string;
  /** Encoding result */
  result?: any;
  /** Activity encoding specific performance statistics */
  performance: {
    startTime: number;
    encodeTime?: number;
    endTime?: number;
  };
}

/**
 * Activity plugin interface (inherits from generic plugin interface)
 */
export interface IActivityPlugin extends IPlugin {
  // Activity-specific plugin methods can be added here
}

/**
 * Activity converter plugin interface (inherits from generic converter interface)
 */
export interface IActivityConverterPlugin extends IConverterPlugin {
  convert(ast: TokenAST, context: ActivityContext): FileType | undefined;
}

/**
 * Activity middleware plugin interface (inherits from generic middleware interface)
 */
export interface IActivityMiddlewarePlugin extends IMiddlewarePlugin {
  process(context: ActivityContext): Promise<void>;
}

/**
 * Activity encoder plugin interface
 */
export interface IActivityEncoderPlugin
  extends IPlugin<ActivityEncodingContext> {
  /** Encoding method */
  encode(file: FileType, context: ActivityEncodingContext): any | undefined;
  /** Whether it supports the format */
  supports(format: string): boolean;
  /** Priority (the smaller the higher the priority) */
  priority?: number;
}

// ============ Activity Specific Base Classes ============

/**
 * Activity base converter abstract class (inherits from generic base converter)
 */
export abstract class BaseActivityConverter
  extends BaseConverter<ActivityContext>
  implements IActivityConverterPlugin
{
  // Activity specific tool methods

  /**
   * Convert point array
   */
  protected convertPoints(points: any[]): ActivityRecordType[] {
    return points
      .map((point) => this.convertPoint(point))
      .filter((point): point is ActivityRecordType => point !== undefined);
  }

  /**
   * Convert single point
   */
  protected abstract convertPoint(point: any): ActivityRecordType | undefined;

  /**
   * Convert time to timestamp using dayjs
   */
  protected convertTime(
    time: Date | string | number | undefined
  ): number | undefined {
    if (!time) return undefined;

    if (typeof time === "number") return time;

    // Use dayjs for consistent time handling
    const dayjsTime = dayjs(time);
    return dayjsTime.isValid() ? dayjsTime.valueOf() : undefined;
  }
}

/**
 * Activity base encoder abstract class
 */
export abstract class BaseActivityEncoder implements IActivityEncoderPlugin {
  abstract name: string;
  abstract supportedTags: string[];
  version = "1.0.0";
  priority = 100;

  abstract encode(
    file: FileType,
    context: ActivityEncodingContext
  ): any | undefined;

  supports(format: string): boolean {
    return this.supportedTags.includes(format);
  }

  async initialize(context: ActivityEncodingContext): Promise<void> {
    context.metadata.set(`plugin:${this.name}:initialized`, true);
  }

  async destroy(context: ActivityEncodingContext): Promise<void> {
    context.metadata.delete(`plugin:${this.name}:initialized`);
  }

  async validate(context: ActivityEncodingContext): Promise<boolean> {
    return true;
  }

  // ============ Encoding tool methods ============

  protected convertTimeToDate(time: number | undefined): Date {
    return time ? new Date(time) : new Date();
  }

  protected convertTimeToString(time: number | undefined): string {
    return this.convertTimeToDate(time).toISOString();
  }

  protected ensureValidCoordinates(lat: number, lon: number): boolean {
    return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
  }

  protected round(value: number, precision: number = 6): number {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  }
}

/**
 * Activity base middleware abstract class (inherits from generic base middleware)
 */
export abstract class BaseActivityMiddleware
  extends BaseMiddleware<ActivityContext, ActivityType>
  implements IActivityMiddlewarePlugin
{
  // Activity specific middleware logic

  abstract process(context: ActivityContext): Promise<void>;

  async onError(error: Error, context: ActivityContext): Promise<void> {
    console.error(`Activity middleware ${this.name} processing error:`, error);
    context.warnings.push(`Middleware ${this.name} error: ${error.message}`);
  }

  /**
   * Validate ActivityType data
   */
  protected validateActivityFile(file: FileType): boolean {
    // Basic validation logic
    if (!file.metadata) return false;
    if (file.routes) {
      for (const route of file.routes) {
        if (!this.validateRoute(route)) return false;
      }
    }

    if (file.points) {
      for (const point of file.points) {
        if (!this.validatePoint(point)) return false;
      }
    }
    if (file.activities) {
      for (const activity of file.activities) {
        if (!this.validateActivity(activity)) return false;
      }
    }

    return true;
  }

  protected validateActivity(activity: ActivityType): boolean {
    return !!(
      activity &&
      typeof activity.index === "undefined" &&
      activity.laps &&
      activity.laps.length > 0
    );
  }

  protected validateRoute(route: ActivityLapType): boolean {
    return !!(route.records && route.records.length > 0);
  }
  /**
   * 仅判断有没有 timestamp
   * @param point 
   * @returns 
   */
  protected validatePoint(point: ActivityRecordType): boolean {
    return !!point.timestamp;
  }
}
