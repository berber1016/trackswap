import {
  IPlugin,
  IConverterPlugin,
  IMiddlewarePlugin,
  BaseConverter,
  BaseMiddleware,
} from "../core/base.js";
import { DecoderContext, GPX11Type } from "./types.js";

// ============ GPX Specific Interface Definitions ============

/**
 * GPX plugin interface (inherits generic plugin interface)
 */
export interface IGPXPlugin extends IPlugin<DecoderContext> {}

/**
 * GPX converter plugin interface (inherits generic converter interface)
 */
export interface IGPXConverterPlugin extends IConverterPlugin<DecoderContext> {}

/**
 * GPX middleware plugin interface (inherits generic middleware interface)
 */
export interface IGPXMiddlewarePlugin
  extends IMiddlewarePlugin<DecoderContext, GPX11Type> {}

// ============ GPX Specific Base Classes ============

/**
 * GPX base converter abstract class (inherits generic base converter)
 */
export abstract class BaseGPXConverter
  extends BaseConverter<DecoderContext>
  implements IGPXConverterPlugin
{
  // GPX specific utility methods can be added here

  /**
   * Parse GPX coordinate values (latitude/longitude)
   */
  protected parseCoordinate(
    value: string | number | undefined
  ): number | undefined {
    const coord = this.parseFloat(value);
    return coord === 0 ? undefined : coord;
  }

  /**
   * Parse GPX time format
   */
  protected parseGPXTime(value: string | undefined): Date | undefined {
    if (!value) return undefined;
    // GPX uses ISO 8601 format
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  }

  /**
   * Extract numeric attributes (common GPX processing approach)
   */
  protected extractNumericAttributes<U extends Record<string, any>>(
    ast: any,
    target: U,
    mapping: Record<string, keyof U>
  ): void {
    if (!ast.attributes) return;

    Object.entries(ast.attributes).forEach(([key, value]) => {
      const targetKey = mapping[key];
      if (targetKey && targetKey in target && typeof value !== "undefined") {
        (target as any)[targetKey] = this.parseFloat(value as string | number);
      }
    });
  }
}

/**
 * GPX base middleware abstract class (inherits generic base middleware)
 */
export abstract class BaseGPXMiddleware
  extends BaseMiddleware<DecoderContext, GPX11Type>
  implements IGPXMiddlewarePlugin
{
  // GPX specific middleware logic can be added here

  async onError(error: Error, context: DecoderContext): Promise<void> {
    console.error(`GPX middleware ${this.name} processing error:`, error);
    context.warnings.push(`Middleware ${this.name} error: ${error.message}`);
  }
}
