import {
  IPlugin as ICorePlugin,
  IConverterPlugin as ICoreConverterPlugin,
  IMiddlewarePlugin as ICoreMiddlewarePlugin,
  BaseConverter as CoreBaseConverter,
  BaseMiddleware as CoreBaseMiddleware,
} from "../core/base.js";
import { DecoderContext, GPX11Type } from "./types.js";

// ============ GPX 特定接口定义 ============

/**
 * GPX 插件接口（继承通用插件接口）
 */
export interface IGPXPlugin extends ICorePlugin<DecoderContext> {}

/**
 * GPX 转换器插件接口（继承通用转换器接口）
 */
export interface IGPXConverterPlugin
  extends ICoreConverterPlugin<DecoderContext> {}

/**
 * GPX 中间件插件接口（继承通用中间件接口）
 */
export interface IGPXMiddlewarePlugin
  extends ICoreMiddlewarePlugin<DecoderContext, GPX11Type> {}

// ============ GPX 特定基础类 ============

/**
 * GPX 基础转换器抽象类（继承通用基础转换器）
 */
export abstract class BaseGPXConverter
  extends CoreBaseConverter<DecoderContext>
  implements IGPXConverterPlugin
{
  // GPX 特定的工具方法可以在这里添加

  /**
   * 解析 GPX 坐标值（经纬度）
   */
  protected parseCoordinate(
    value: string | number | undefined
  ): number | undefined {
    const coord = this.parseFloat(value);
    return coord === 0 ? undefined : coord;
  }

  /**
   * 解析 GPX 时间格式
   */
  protected parseGPXTime(value: string | undefined): Date | undefined {
    if (!value) return undefined;
    // GPX 使用 ISO 8601 格式
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  }

  /**
   * 提取数值属性（GPX 常用的处理方式）
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
 * GPX 基础中间件抽象类（继承通用基础中间件）
 */
export abstract class BaseGPXMiddleware
  extends CoreBaseMiddleware<DecoderContext, GPX11Type>
  implements IGPXMiddlewarePlugin
{
  // GPX 特定的中间件逻辑可以在这里添加

  async onError(error: Error, context: DecoderContext): Promise<void> {
    console.error(`GPX中间件 ${this.name} 处理错误:`, error);
    context.warnings.push(`中间件 ${this.name} 错误: ${error.message}`);
  }
}

// ============ 向后兼容导出 ============

/**
 * @deprecated 使用 IGPXPlugin 替代
 */
export type IPlugin = IGPXPlugin;

/**
 * @deprecated 使用 IGPXConverterPlugin 替代
 */
export type IConverterPlugin = IGPXConverterPlugin;

/**
 * @deprecated 使用 IGPXMiddlewarePlugin 替代
 */
export type IMiddlewarePlugin = IGPXMiddlewarePlugin;

/**
 * @deprecated 使用 BaseGPXConverter 替代
 */
export const BaseConverter = BaseGPXConverter;

/**
 * @deprecated 使用 BaseGPXMiddleware 替代
 */
export const BaseMiddleware = BaseGPXMiddleware;
