import {
  IPlugin,
  IConverterPlugin,
  IMiddlewarePlugin,
  BaseConverter,
  BaseMiddleware,
} from "../core/base.js";
import { TCXContext, TCXFileType } from "./types.js";

// ============ TCX Specific Interface Definitions ============

/**
 * TCX plugin interface (inherits generic plugin interface)
 */
export interface ITCXPlugin extends IPlugin<TCXContext> {}

/**
 * TCX converter plugin interface (inherits generic converter interface)
 */
export interface ITCXConverterPlugin extends IConverterPlugin<TCXContext> {}

/**
 * TCX middleware plugin interface (inherits generic middleware interface)
 */
export interface ITCXMiddlewarePlugin
  extends IMiddlewarePlugin<TCXContext, TCXFileType> {}

// ============ TCX Specific Base Classes ============

/**
 * TCX base converter abstract class (inherits generic base converter)
 */
export abstract class BaseTCXConverter
  extends BaseConverter<TCXContext>
  implements ITCXConverterPlugin
{
  // TCX specific utility methods can be added here

  /**
   * Parse TCX heart rate value
   */
  protected parseHeartRate(
    value: string | number | undefined
  ): number | undefined {
    const hr = this.parseFloat(value);
    if (typeof hr === "undefined") {
      return undefined;
    }
    return hr > 0 && hr < 300 ? hr : undefined; // Reasonable heart rate range
  }

  /**
   * Parse TCX time format (ISO 8601)
   */
  protected parseTCXTime(value: string | undefined): Date | undefined {
    if (!value) return undefined;
    // TCX uses ISO 8601 format
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  }

  /**
   * Parse TCX distance value (meters)
   */
  protected parseDistance(
    value: string | number | undefined
  ): number | undefined {
    const distance = this.parseFloat(value);
    if (typeof distance === "undefined") {
      return undefined;
    }
    return distance > 0 ? distance : undefined;
  }

  /**
   * Parse TCX speed value (m/s)
   */
  protected parseSpeed(value: string | number | undefined): number | undefined {
    const speed = this.parseFloat(value);
    if (typeof speed === "undefined") {
      return undefined;
    }
    return speed >= 0 ? speed : undefined;
  }

  /**
   * Parse TCX altitude value (meters)
   */
  protected parseAltitude(
    value: string | number | undefined
  ): number | undefined {
    return this.parseFloat(value);
  }

  /**
   * Parse TCX coordinate value (latitude/longitude)
   */
  protected parseCoordinate(
    value: string | number | undefined
  ): number | undefined {
    const coord = this.parseFloat(value);
    return coord !== 0 ? coord : undefined;
  }
}

/**
 * TCX base middleware abstract class (inherits generic base middleware)
 */
export abstract class BaseTCXMiddleware
  extends BaseMiddleware<TCXContext, TCXFileType>
  implements ITCXMiddlewarePlugin
{
  // TCX specific middleware logic can be added here

  async onError(error: Error, context: TCXContext): Promise<void> {
    console.error(`TCX middleware ${this.name} processing error:`, error);
    context.warnings.push(`Middleware ${this.name} error: ${error.message}`);
  }
}
