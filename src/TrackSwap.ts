import { GPXDecoder, GPXEncoder } from "./GPX/index.js";
import { GPX11Type } from "./GPX/types.js";
import { FITDecoder, FITEncoder } from "./FIT/index.js";
import { FITFileType } from "./FIT/types.js";
import { TCXDecoder, TCXEncoder } from "./TCX/index.js";
import { TCXFileType } from "./TCX/types.js";
import { ActivityProcessor } from "./activity/processor.js";
import { FileType } from "./types.js";
import {
  ExtensionManager,
  TrackSwapExtension,
  BaseMetricsExtension,
} from "./activity/extensions/extensions.js";

/**
 * Multi-format track exchange processing class
 * Provides parsing and encoding functionality for GPX, FIT, TCX files
 */
export class TrackSwap {
  private gpxDecoder: GPXDecoder;
  private gpxEncoder: GPXEncoder;
  private fitDecoder: FITDecoder;
  private fitEncoder: FITEncoder;
  private tcxDecoder: TCXDecoder;
  private tcxEncoder: TCXEncoder;
  private activityProcessor: ActivityProcessor;
  private extensionManager: ExtensionManager;

  constructor() {
    this.gpxDecoder = new GPXDecoder();
    this.gpxEncoder = new GPXEncoder();
    this.fitDecoder = new FITDecoder();
    this.fitEncoder = new FITEncoder();
    this.tcxDecoder = new TCXDecoder();
    this.tcxEncoder = new TCXEncoder();
    this.activityProcessor = new ActivityProcessor();
    this.extensionManager = new ExtensionManager();

    // 基础指标聚合已在 ExtensionManager 构造函数中默认注册
  }

  // ==================== GPX Functions ====================

  /**
   * Parse GPX file Buffer to GPX object
   */
  async parseGPX(buffer: Buffer): Promise<GPX11Type | undefined> {
    try {
      return await this.gpxDecoder.parserByBuffer(buffer);
    } catch (error) {
      console.error("GPX parsing failed:", error);
      throw new Error(`GPX parsing failed: ${(error as Error).message}`);
    }
  }

  /**
   * Parse GPX file string to GPX object
   */
  async parseGPXString(xmlString: string): Promise<GPX11Type | undefined> {
    const buffer = Buffer.from(xmlString, "utf-8");
    return this.parseGPX(buffer);
  }

  /**
   * Encode GPX object to Buffer
   */
  async encodeGPX(gpxData: GPX11Type): Promise<Buffer> {
    try {
      return await this.gpxEncoder.encode(gpxData);
    } catch (error) {
      console.error("GPX encoding failed:", error);
      throw new Error(`GPX encoding failed: ${(error as Error).message}`);
    }
  }

  /**
   * Encode GPX object to XML string
   */
  encodeGPXString(gpxData: GPX11Type): string {
    try {
      return this.gpxEncoder.encodeToString(gpxData);
    } catch (error) {
      console.error("GPX encoding failed:", error);
      throw new Error(`GPX encoding failed: ${(error as Error).message}`);
    }
  }

  // ==================== FIT Functions ====================

  /**
   * Parse FIT file Buffer to FIT object
   */
  async parseFIT(buffer: Buffer): Promise<FITFileType> {
    try {
      return await this.fitDecoder.parseByBuffer(buffer);
    } catch (error) {
      console.error("FIT parsing failed:", error);
      throw new Error(`FIT parsing failed: ${(error as Error).message}`);
    }
  }

  /**
   * Encode FIT object to Buffer (Activity file)
   */
  async encodeFIT(fitData: FITFileType): Promise<Buffer> {
    try {
      return await this.fitEncoder.encode(fitData);
    } catch (error) {
      console.error("FIT encoding failed:", error);
      throw new Error(`FIT encoding failed: ${(error as Error).message}`);
    }
  }

  /**
   * Encode FIT object to Course file Buffer
   */
  async encodeFITCourse(fitData: FITFileType): Promise<Buffer> {
    try {
      return await this.fitEncoder.encodeCourse(fitData);
    } catch (error) {
      console.error("FIT Course encoding failed:", error);
      throw new Error(
        `FIT Course encoding failed: ${(error as Error).message}`
      );
    }
  }

  // ==================== TCX Functions ====================

  /**
   * Parse TCX file string to TCX object
   */
  async parseTCXString(xmlString: string): Promise<TCXFileType> {
    const buffer = Buffer.from(xmlString, "utf-8");
    return this.parseTCX(buffer);
  }

  /**
   * Parse TCX file Buffer to TCX object
   */
  async parseTCX(buffer: Buffer): Promise<TCXFileType> {
    try {
      const result = await this.tcxDecoder.parseByBuffer(buffer);
      if (!result) {
        throw new Error("TCX parsing result is empty");
      }
      return result;
    } catch (error) {
      console.error("TCX parsing failed:", error);
      throw new Error(`TCX parsing failed: ${(error as Error).message}`);
    }
  }

  /**
   * Encode TCX object to Buffer
   */
  async encodeTCX(tcxData: TCXFileType): Promise<Buffer> {
    try {
      return await this.tcxEncoder.encode(tcxData);
    } catch (error) {
      console.error("TCX encoding failed:", error);
      throw new Error(`TCX encoding failed: ${(error as Error).message}`);
    }
  }

  /**
   * Encode TCX object to XML string
   */
  async encodeTCXString(tcxData: TCXFileType): Promise<string> {
    try {
      return await this.tcxEncoder.encodeToString(tcxData);
    } catch (error) {
      console.error("TCX encoding failed:", error);
      throw new Error(`TCX encoding failed: ${(error as Error).message}`);
    }
  }

  // ==================== Unified Format Conversion ====================

  /**
   * Convert GPX data to unified Activity format
   */
  async convertGPXToActivity(gpxData: GPX11Type): Promise<FileType> {
    return await this.activityProcessor.convertToActivity(gpxData, "gpx");
  }

  /**
   * Convert FIT data to unified Activity format
   */
  async convertFITToActivity(fitData: FITFileType): Promise<FileType> {
    return await this.activityProcessor.convertToActivity(fitData, "fit");
  }

  /**
   * Convert TCX data to unified Activity format
   */
  async convertTCXToActivity(tcxData: TCXFileType): Promise<FileType> {
    return await this.activityProcessor.convertToActivity(tcxData, "tcx");
  }

  /**
   * Convert FileType to GPX format
   */
  async convertActivityToGPX(file: FileType): Promise<GPX11Type> {
    return (await this.activityProcessor.encodeActivity(
      file,
      "gpx"
    )) as GPX11Type;
  }

  /**
   * Convert Activity to FIT format
   */
  async convertActivityToFIT(file: FileType): Promise<FITFileType> {
    return (await this.activityProcessor.encodeActivity(
      file,
      "fit"
    )) as FITFileType;
  }

  /**
   * Convert Activity to TCX format
   */
  async convertActivityToTCX(file: FileType): Promise<TCXFileType> {
    return (await this.activityProcessor.encodeActivity(
      file,
      "tcx"
    )) as TCXFileType;
  }

  /**
   * Generic file format conversion method
   * @param sourceFile Source file Buffer
   * @param targetType Target file format
   * @param sourceType Source file format (optional, auto-detect if not provided)
   * @returns Converted file Buffer
   */
  async convertFile(
    sourceFile: Buffer,
    targetType: "gpx" | "fit" | "tcx",
    sourceType?: "gpx" | "fit" | "tcx"
  ): Promise<Buffer> {
    try {
      // If source format is not provided, auto-detect
      const detectedSourceType = sourceType || this.detectFormat(sourceFile);

      if (detectedSourceType === "unknown") {
        throw new Error(
          "Unable to recognize source file format, please specify sourceType parameter"
        );
      }

      // If source format and target format are the same, return directly
      if (detectedSourceType === targetType) {
        return sourceFile;
      }

      // 1. Parse source file
      let sourceData: GPX11Type | FITFileType | TCXFileType;
      switch (detectedSourceType) {
        case "gpx":
          const gpxResult = await this.parseGPX(sourceFile);
          if (!gpxResult) {
            throw new Error("GPX file parsing failed");
          }
          sourceData = gpxResult;
          break;
        case "fit":
          sourceData = await this.parseFIT(sourceFile);
          break;
        case "tcx":
          sourceData = await this.parseTCX(sourceFile);
          break;
        default:
          throw new Error(
            `Unsupported source file format: ${detectedSourceType}`
          );
      }

      // 2. Convert to unified Activity format
      let file: FileType;
      switch (detectedSourceType) {
        case "gpx":
          file = await this.convertGPXToActivity(sourceData as GPX11Type);
          break;
        case "fit":
          file = await this.convertFITToActivity(sourceData as FITFileType);
          break;
        case "tcx":
          file = await this.convertTCXToActivity(sourceData as TCXFileType);
          break;
        default:
          throw new Error(
            `Unsupported source file format conversion: ${detectedSourceType}`
          );
      }

      // 3. Encode to target format
      switch (targetType) {
        case "gpx":
          const gpxData = await this.convertActivityToGPX(file);
          return await this.encodeGPX(gpxData);
        case "fit":
          const fitData = await this.convertActivityToFIT(file);
          return await this.encodeFIT(fitData);
        case "tcx":
          const tcxData = await this.convertActivityToTCX(file);
          return await this.encodeTCX(tcxData);
        default:
          throw new Error(`Unsupported target file format: ${targetType}`);
      }
    } catch (error) {
      console.error(`File format conversion failed:`, error);
      const sourceTypeStr = sourceType || "auto-detect";
      throw new Error(
        `${sourceTypeStr} to ${targetType.toUpperCase()} failed: ${
          (error as Error).message
        }`
      );
    }
  }

  /**
   * Auto-detect file format
   */
  detectFormat(buffer: Buffer): "gpx" | "fit" | "tcx" | "unknown" {
    const content = buffer.toString("utf-8", 0, Math.min(1024, buffer.length));

    // FIT files start with a specific binary header
    if (buffer.length >= 12) {
      const header = buffer.toString("ascii", 8, 12);
      if (header === ".FIT") {
        return "fit";
      }
    }

    // XML based formats
    if (content.includes("<?xml")) {
      if (
        content.includes("<gpx") ||
        content.includes("http://www.topografix.com/GPX/")
      ) {
        return "gpx";
      }
      if (
        content.includes("<TrainingCenterDatabase") ||
        content.includes(
          "http://www.garmin.com/xmlschemas/TrainingCenterDatabase/"
        )
      ) {
        return "tcx";
      }
    }

    return "unknown";
  }

  /**
   * Unified file parsing method
   * @param buffer File Buffer
   * @param sourceType Source file format (optional, auto-detect if not provided)
   * @returns Parsed file object
   */
  async parseFile(
    buffer: Buffer,
    sourceType?: "gpx" | "fit" | "tcx"
  ): Promise<GPX11Type | FITFileType | TCXFileType> {
    const detectedSourceType = sourceType || this.detectFormat(buffer);

    if (detectedSourceType === "unknown") {
      throw new Error(
        "Unable to recognize file format, please specify sourceType parameter"
      );
    }

    switch (detectedSourceType) {
      case "gpx":
        const gpxResult = await this.parseGPX(buffer);
        if (!gpxResult) {
          throw new Error("GPX parsing failed");
        }
        return gpxResult;
      case "fit":
        return await this.parseFIT(buffer);
      case "tcx":
        return await this.parseTCX(buffer);
      default:
        throw new Error(`Unsupported file format: ${detectedSourceType}`);
    }
  }

  /**
   * Parse file and convert to Activity format
   * @param buffer File Buffer
   * @param sourceType Source file format (optional, auto-detect if not provided)
   * @returns FileType format data
   */
  async parseToActivity(
    buffer: Buffer,
    sourceType?: "gpx" | "fit" | "tcx"
  ): Promise<FileType> {
    const detectedSourceType = sourceType || this.detectFormat(buffer);

    if (detectedSourceType === "unknown") {
      throw new Error(
        "Unable to recognize file format, please specify sourceType parameter"
      );
    }

    switch (detectedSourceType) {
      case "gpx":
        const gpxData = await this.parseGPX(buffer);
        if (!gpxData) {
          throw new Error("GPX parsing failed");
        }
        return this.convertGPXToActivity(gpxData);
      case "fit":
        const fitData = await this.parseFIT(buffer);
        return this.convertFITToActivity(fitData);
      case "tcx":
        const tcxData = await this.parseTCX(buffer);
        return this.convertTCXToActivity(tcxData);
      default:
        throw new Error(`Unsupported file format: ${detectedSourceType}`);
    }
  }

  /**
   * Get Activity processor instance
   */
  getActivityProcessor(): ActivityProcessor {
    return this.activityProcessor;
  }

  // ==================== Instance Management ====================

  /**
   * Get GPX decoder instance
   */
  getGPXDecoder(): GPXDecoder {
    return this.gpxDecoder;
  }

  /**
   * Get GPX encoder instance
   */
  getGPXEncoder(): GPXEncoder {
    return this.gpxEncoder;
  }

  /**
   * Get FIT decoder instance
   */
  getFITDecoder(): FITDecoder {
    return this.fitDecoder;
  }

  /**
   * Get FIT encoder instance
   */
  getFITEncoder(): FITEncoder {
    return this.fitEncoder;
  }

  /**
   * Get TCX decoder instance
   */
  getTCXDecoder(): TCXDecoder {
    return this.tcxDecoder;
  }

  /**
   * Get TCX encoder instance
   */
  getTCXEncoder(): TCXEncoder {
    return this.tcxEncoder;
  }

  // ==================== Extension Functions ====================

  /**
   * 扩展 TrackSwap 功能
   * @param extension 要添加的扩展
   */
  extend(extension: TrackSwapExtension): TrackSwap {
    this.extensionManager.registerExtension(extension);
    return this;
  }

  /**
   * 移除扩展
   * @param extensionName 扩展名称
   */
  removeExtension(extensionName: string): TrackSwap {
    this.extensionManager.unregisterExtension(extensionName);
    return this;
  }

  /**
   * 获取已注册的扩展列表
   */
  getExtensions(): TrackSwapExtension[] {
    return this.extensionManager.getAllExtensions();
  }

  /**
   * 使用扩展处理活动数据
   */
  processWithExtensions(file: FileType): FileType {
    return this.extensionManager.processFile(file);
  }

  /**
   * Destroy instance, clean up resources
   */
  async destroy(): Promise<void> {
    await this.gpxDecoder.destroy();
    await this.fitDecoder.destroy();
    await this.tcxDecoder.destroy();
    await this.activityProcessor.destroy();
  }
}

// Default export
export default TrackSwap;
