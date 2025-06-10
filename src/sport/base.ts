import {
  IPlugin,
  IConverterPlugin,
  IMiddlewarePlugin,
  BaseConverter,
  BaseMiddleware,
  IProcessingContext,
} from "../core/base.js";
import {
  SportFileType,
  SportPointType,
  SportRouteSegType,
  SportTrackType,
  TokenAST,
} from "../types.js";

// ============ Sport Specific Interface Definitions ============

/**
 * Sport processing context
 */
export interface SportContext extends IProcessingContext {
  /** Original data type */
  sourceFormat: string;
  /** Original data */
  sourceData: any;
  /** Conversion result */
  result?: SportFileType;
  /** Sport-specific performance statistics */
  performance: {
    startTime: number;
    convertTime?: number;
    endTime?: number;
  };
}

/**
 * Sport encoding context
 */
export interface SportEncodingContext extends IProcessingContext {
  /** Target format */
  targetFormat: string;
  /** Encoding result */
  result?: any;
  /** Sport encoding specific performance statistics */
  performance: {
    startTime: number;
    encodeTime?: number;
    endTime?: number;
  };
}

/**
 * Sport plugin interface (inherits from generic plugin interface)
 */
export interface ISportPlugin extends IPlugin {
  // Sport-specific plugin methods can be added here
}

/**
 * Sport converter plugin interface (inherits from generic converter interface)
 */
export interface ISportConverterPlugin extends IConverterPlugin {
  convert(ast: TokenAST, context: SportContext): SportFileType | undefined;
}

/**
 * Sport middleware plugin interface (inherits from generic middleware interface)
 */
export interface ISportMiddlewarePlugin extends IMiddlewarePlugin {
  process(context: SportContext): Promise<void>;
}

/**
 * Sport encoder plugin interface
 */
export interface ISportEncoderPlugin extends IPlugin<SportEncodingContext> {
  /** Encoding method */
  encode(
    sportData: SportFileType,
    context: SportEncodingContext
  ): any | undefined;
  /** Whether it supports the format */
  supports(format: string): boolean;
  /** Priority (the smaller the higher the priority) */
  priority?: number;
}

// ============ Sport Specific Base Classes ============

/**
 * Sport base converter abstract class (inherits from generic base converter)
 */
export abstract class BaseSportConverter
  extends BaseConverter<SportContext>
  implements ISportConverterPlugin
{
  // Sport specific tool methods

  /**
   * Convert point array
   */
  protected convertPoints(points: any[]): SportPointType[] {
    return points
      .map((point) => this.convertPoint(point))
      .filter((point): point is SportPointType => point !== undefined);
  }

  /**
   * Convert single point
   */
  protected abstract convertPoint(point: any): SportPointType | undefined;

  /**
   * Convert time to timestamp
   */
  protected convertTime(
    time: Date | string | number | undefined
  ): number | undefined {
    if (!time) return undefined;

    if (typeof time === "number") return time;
    if (time instanceof Date) return time.getTime();
    if (typeof time === "string") {
      const date = new Date(time);
      return isNaN(date.getTime()) ? undefined : date.getTime();
    }
    return undefined;
  }

  /**
   * Calculate distance statistics
   */
  protected calculateDistance(points: SportPointType[]): number | undefined {
    if (points.length < 2) return undefined;

    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];

      // Use Haversine formula for distance calculation (simplified version)
      const R = 6371e3; // Earth radius (meters)
      const φ1 = (prev.lat * Math.PI) / 180;
      const φ2 = (curr.lat * Math.PI) / 180;
      const Δφ = ((curr.lat - prev.lat) * Math.PI) / 180;
      const Δλ = ((curr.lon - prev.lon) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      totalDistance += R * c;
    }

    return totalDistance;
  }

  /**
   * Calculate duration
   */
  protected calculateDuration(points: SportPointType[]): number | undefined {
    if (points.length < 2) return undefined;

    const firstTime = points[0]?.time;
    const lastTime = points[points.length - 1]?.time;

    if (!firstTime || !lastTime) return undefined;

    return Math.round((lastTime - firstTime) / 1000); // seconds
  }
}

/**
 * Sport base encoder abstract class
 */
export abstract class BaseSportEncoder implements ISportEncoderPlugin {
  abstract name: string;
  abstract supportedTags: string[];
  version = "1.0.0";
  priority = 100;

  abstract encode(
    sportData: SportFileType,
    context: SportEncodingContext
  ): any | undefined;

  supports(format: string): boolean {
    return this.supportedTags.includes(format);
  }

  async initialize(context: SportEncodingContext): Promise<void> {
    context.metadata.set(`plugin:${this.name}:initialized`, true);
  }

  async destroy(context: SportEncodingContext): Promise<void> {
    context.metadata.delete(`plugin:${this.name}:initialized`);
  }

  async validate(context: SportEncodingContext): Promise<boolean> {
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
 * Sport base middleware abstract class (inherits from generic base middleware)
 */
export abstract class BaseSportMiddleware
  extends BaseMiddleware<SportContext, SportFileType>
  implements ISportMiddlewarePlugin
{
  // Sport specific middleware logic

  abstract process(context: SportContext): Promise<void>;

  async onError(error: Error, context: SportContext): Promise<void> {
    console.error(`Sport middleware ${this.name} processing error:`, error);
    context.warnings.push(`Middleware ${this.name} error: ${error.message}`);
  }

  /**
   * Validate SportFileType data
   */
  protected validateSportFile(sportFile: SportFileType): boolean {
    // Basic validation logic
    if (!sportFile.metadata) return false;

    // Validate tracks
    if (sportFile.tracks) {
      for (const track of sportFile.tracks) {
        if (!this.validateTrack(track)) return false;
      }
    }

    // Validate routes
    if (sportFile.routes) {
      for (const route of sportFile.routes) {
        if (!this.validateRoute(route)) return false;
      }
    }

    // Validate points
    if (sportFile.points) {
      for (const point of sportFile.points) {
        if (!this.validatePoint(point)) return false;
      }
    }

    return true;
  }

  protected validateTrack(track: SportTrackType): boolean {
    return !!(track.trackseg && track.trackseg.length > 0);
  }

  protected validateRoute(route: SportRouteSegType): boolean {
    return !!(route.points && route.points.length > 0);
  }

  protected validatePoint(point: SportPointType): boolean {
    return !!(
      point.lat &&
      point.lon &&
      point.lat >= -90 &&
      point.lat <= 90 &&
      point.lon >= -180 &&
      point.lon <= 180
    );
  }
}
