import { GPXDecoder, GPXEncoder } from "./GPX/index.js";
import { GPX11Type } from "./GPX/types.js";

/**
 * GPX轨迹交换处理类
 * 提供GPX文件的解析和编码功能
 */
export class TrackSwap {
  private decoder: GPXDecoder;
  private encoder: GPXEncoder;

  constructor() {
    this.decoder = new GPXDecoder();
    this.encoder = new GPXEncoder();
  }

  // ==================== 解析功能 ====================

  /**
   * 解析GPX文件Buffer为GPX对象
   */
  async parseGPX(buffer: Buffer): Promise<GPX11Type | undefined> {
    try {
      return await this.decoder.parserByBuffer(buffer);
    } catch (error) {
      console.error("GPX解析失败:", error);
      throw new Error(`GPX解析失败: ${(error as Error).message}`);
    }
  }

  /**
   * 解析GPX文件字符串为GPX对象
   */
  async parseGPXString(xmlString: string): Promise<GPX11Type | undefined> {
    const buffer = Buffer.from(xmlString, "utf-8");
    return this.parseGPX(buffer);
  }

  // ==================== 编码功能 ====================

  /**
   * 编码GPX对象为Buffer
   */
  async encodeGPX(gpxData: GPX11Type): Promise<Buffer> {
    try {
      return await this.encoder.encode(gpxData);
    } catch (error) {
      console.error("GPX编码失败:", error);
      throw new Error(`GPX编码失败: ${(error as Error).message}`);
    }
  }

  /**
   * 编码GPX对象为XML字符串
   */
  encodeGPXString(gpxData: GPX11Type): string {
    try {
      return this.encoder.encodeToString(gpxData);
    } catch (error) {
      console.error("GPX编码失败:", error);
      throw new Error(`GPX编码失败: ${(error as Error).message}`);
    }
  }

  // ==================== 实例管理 ====================

  /**
   * 获取解码器实例
   */
  getDecoder(): GPXDecoder {
    return this.decoder;
  }

  /**
   * 获取编码器实例
   */
  getEncoder(): GPXEncoder {
    return this.encoder;
  }

  /**
   * 销毁实例，清理资源
   */
  async destroy(): Promise<void> {
    await this.decoder.destroy();
  }

  // ==================== 向后兼容 ====================

  /**
   * @deprecated 使用 encodeGPX() 替代
   */
  async encoderGPX(gpx: GPX11Type): Promise<Buffer> {
    return this.encodeGPX(gpx);
  }
}

// 默认导出
export default { TrackSwap };
