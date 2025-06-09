import {
  IPlugin,
  IConverterPlugin,
  IMiddlewarePlugin,
  BaseConverter,
  BaseMiddleware,
} from "../core/base.js";
import { TCXContext, TCXFileType } from "./types.js";

// ============ TCX 特定接口定义 ============

/**
 * TCX 插件接口（继承通用插件接口）
 */
export interface ITCXPlugin extends IPlugin<TCXContext> {}

/**
 * TCX 转换器插件接口（继承通用转换器接口）
 */
export interface ITCXConverterPlugin extends IConverterPlugin<TCXContext> {}

/**
 * TCX 中间件插件接口（继承通用中间件接口）
 */
export interface ITCXMiddlewarePlugin
  extends IMiddlewarePlugin<TCXContext, TCXFileType> {}

// ============ TCX 特定基础类 ============

/**
 * TCX 基础转换器抽象类（继承通用基础转换器）
 */
export abstract class BaseTCXConverter
  extends BaseConverter<TCXContext>
  implements ITCXConverterPlugin
{
  // TCX 特定的工具方法可以在这里添加

  /**
   * 解析 TCX 心率值
   */
  protected parseHeartRate(
    value: string | number | undefined
  ): number | undefined {
    const hr = this.parseFloat(value);
    return hr > 0 && hr < 300 ? hr : undefined; // 合理的心率范围
  }

  /**
   * 解析 TCX 时间格式（ISO 8601）
   */
  protected parseTCXTime(value: string | undefined): Date | undefined {
    if (!value) return undefined;
    // TCX 使用 ISO 8601 格式
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  }

  /**
   * 解析 TCX 距离值（米）
   */
  protected parseDistance(
    value: string | number | undefined
  ): number | undefined {
    const distance = this.parseFloat(value);
    return distance >= 0 ? distance : undefined;
  }

  /**
   * 解析 TCX 速度值（m/s）
   */
  protected parseSpeed(value: string | number | undefined): number | undefined {
    const speed = this.parseFloat(value);
    return speed >= 0 ? speed : undefined;
  }

  /**
   * 解析 TCX 海拔值（米）
   */
  protected parseAltitude(
    value: string | number | undefined
  ): number | undefined {
    return this.parseFloat(value);
  }

  /**
   * 解析 TCX 坐标值（纬度/经度）
   */
  protected parseCoordinate(
    value: string | number | undefined
  ): number | undefined {
    const coord = this.parseFloat(value);
    return coord !== 0 ? coord : undefined;
  }
}

/**
 * TCX 基础中间件抽象类（继承通用基础中间件）
 */
export abstract class BaseTCXMiddleware
  extends BaseMiddleware<TCXContext, TCXFileType>
  implements ITCXMiddlewarePlugin
{
  // TCX 特定的中间件逻辑可以在这里添加

  async onError(error: Error, context: TCXContext): Promise<void> {
    console.error(`TCX中间件 ${this.name} 处理错误:`, error);
    context.warnings.push(`中间件 ${this.name} 错误: ${error.message}`);
  }
}
