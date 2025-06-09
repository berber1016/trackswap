import { GPXDecoder, GPXEncoder } from "./GPX/index.js";
import { GPX11Type } from "./GPX/types.js";
import { FITDecoder, FITEncoder } from "./FIT/index.js";
import { FITFileType } from "./FIT/types.js";
import { TCXDecoder, TCXEncoder } from "./TCX/index.js";
import { TCXFileType } from "./TCX/types.js";

/**
 * 多格式轨迹交换处理类
 * 提供GPX、FIT、TCX文件的解析和编码功能
 */
export class TrackSwap {
  private gpxDecoder: GPXDecoder;
  private gpxEncoder: GPXEncoder;
  private fitDecoder: FITDecoder;
  private fitEncoder: FITEncoder;
  private tcxDecoder: TCXDecoder;
  private tcxEncoder: TCXEncoder;

  constructor() {
    this.gpxDecoder = new GPXDecoder();
    this.gpxEncoder = new GPXEncoder();
    this.fitDecoder = new FITDecoder();
    this.fitEncoder = new FITEncoder();
    this.tcxDecoder = new TCXDecoder();
    this.tcxEncoder = new TCXEncoder();
  }

  // ==================== GPX 功能 ====================

  /**
   * 解析GPX文件Buffer为GPX对象
   */
  async parseGPX(buffer: Buffer): Promise<GPX11Type | undefined> {
    try {
      return await this.gpxDecoder.parserByBuffer(buffer);
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

  /**
   * 编码GPX对象为Buffer
   */
  async encodeGPX(gpxData: GPX11Type): Promise<Buffer> {
    try {
      return await this.gpxEncoder.encode(gpxData);
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
      return this.gpxEncoder.encodeToString(gpxData);
    } catch (error) {
      console.error("GPX编码失败:", error);
      throw new Error(`GPX编码失败: ${(error as Error).message}`);
    }
  }

  // ==================== FIT 功能 ====================

  /**
   * 解析FIT文件Buffer为FIT对象
   */
  async parseFIT(buffer: Buffer): Promise<FITFileType> {
    try {
      return await this.fitDecoder.parseByBuffer(buffer);
    } catch (error) {
      console.error("FIT解析失败:", error);
      throw new Error(`FIT解析失败: ${(error as Error).message}`);
    }
  }

  /**
   * 编码FIT对象为Buffer (Activity文件)
   */
  async encodeFIT(fitData: FITFileType): Promise<Buffer> {
    try {
      return await this.fitEncoder.encode(fitData);
    } catch (error) {
      console.error("FIT编码失败:", error);
      throw new Error(`FIT编码失败: ${(error as Error).message}`);
    }
  }

  /**
   * 编码FIT对象为Course文件Buffer
   */
  async encodeFITCourse(fitData: FITFileType): Promise<Buffer> {
    try {
      return await this.fitEncoder.encodeCourse(fitData);
    } catch (error) {
      console.error("FIT Course编码失败:", error);
      throw new Error(`FIT Course编码失败: ${(error as Error).message}`);
    }
  }

  /**
   * 编码FIT对象为Blob
   */
  async encodeFITBlob(
    fitData: FITFileType,
    fileType: "activity" | "course" = "activity"
  ): Promise<Blob> {
    try {
      return await this.fitEncoder.encodeToBlob(fitData, fileType);
    } catch (error) {
      console.error("FIT Blob编码失败:", error);
      throw new Error(`FIT Blob编码失败: ${(error as Error).message}`);
    }
  }

  // ==================== TCX 功能 ====================

  /**
   * 解析TCX文件Buffer为TCX对象
   */
  async parseTCX(buffer: Buffer): Promise<TCXFileType> {
    try {
      const result = await this.tcxDecoder.parseByBuffer(buffer);
      if (!result) {
        throw new Error("TCX解析结果为空");
      }
      return result;
    } catch (error) {
      console.error("TCX解析失败:", error);
      throw new Error(`TCX解析失败: ${(error as Error).message}`);
    }
  }

  /**
   * 解析TCX文件字符串为TCX对象
   */
  async parseTCXString(xmlString: string): Promise<TCXFileType> {
    const buffer = Buffer.from(xmlString, "utf-8");
    return this.parseTCX(buffer);
  }

  /**
   * 编码TCX对象为Buffer
   */
  async encodeTCX(tcxData: TCXFileType): Promise<Buffer> {
    try {
      return await this.tcxEncoder.encode(tcxData);
    } catch (error) {
      console.error("TCX编码失败:", error);
      throw new Error(`TCX编码失败: ${(error as Error).message}`);
    }
  }

  /**
   * 编码TCX对象为XML字符串
   */
  async encodeTCXString(tcxData: TCXFileType): Promise<string> {
    try {
      return await this.tcxEncoder.encodeToString(tcxData);
    } catch (error) {
      console.error("TCX编码失败:", error);
      throw new Error(`TCX编码失败: ${(error as Error).message}`);
    }
  }

  // ==================== 实例管理 ====================

  /**
   * 获取GPX解码器实例
   */
  getGPXDecoder(): GPXDecoder {
    return this.gpxDecoder;
  }

  /**
   * 获取GPX编码器实例
   */
  getGPXEncoder(): GPXEncoder {
    return this.gpxEncoder;
  }

  /**
   * 获取FIT解码器实例
   */
  getFITDecoder(): FITDecoder {
    return this.fitDecoder;
  }

  /**
   * 获取FIT编码器实例
   */
  getFITEncoder(): FITEncoder {
    return this.fitEncoder;
  }

  /**
   * 获取TCX解码器实例
   */
  getTCXDecoder(): TCXDecoder {
    return this.tcxDecoder;
  }

  /**
   * 获取TCX编码器实例
   */
  getTCXEncoder(): TCXEncoder {
    return this.tcxEncoder;
  }

  /**
   * 销毁实例，清理资源
   */
  async destroy(): Promise<void> {
    await this.gpxDecoder.destroy();
    await this.fitDecoder.destroy();
    await this.tcxDecoder.destroy();
  }

  // ==================== 向后兼容 ====================

  /**
   * @deprecated 使用 getGPXDecoder() 替代
   */
  getDecoder(): GPXDecoder {
    return this.gpxDecoder;
  }

  /**
   * @deprecated 使用 getGPXEncoder() 替代
   */
  getEncoder(): GPXEncoder {
    return this.gpxEncoder;
  }

  /**
   * @deprecated 使用 encodeGPX() 替代
   */
  async encoderGPX(gpx: GPX11Type): Promise<Buffer> {
    return this.encodeGPX(gpx);
  }
}

// 默认导出
export default { TrackSwap };
