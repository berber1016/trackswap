import {
  ActivityContext,
  ActivityEncodingContext,
  IActivityConverterPlugin,
  IActivityEncoderPlugin,
} from "./base.js";
import { FileType } from "../types.js";
import { GPX11Type } from "../GPX/types.js";
import { FITFileType } from "../FIT/types.js";
import { TCXFileType } from "../TCX/types.js";
import {
  GPXToActivityConverter,
  FITToActivityConverter,
  TCXToActivityConverter,
} from "./converters.js";
import {
  ActivityToGPXEncoder,
  ActivityToFITEncoder,
  ActivityToTCXEncoder,
} from "./encoders.js";

/**
 * Activity processor
 * Responsible for managing conversion and encoding processes
 */
export class ActivityProcessor {
  private converters: Map<string, IActivityConverterPlugin> = new Map();
  private encoders: Map<string, IActivityEncoderPlugin> = new Map();

  constructor() {
    this.registerDefaultConverters();
    this.registerDefaultEncoders();
  }

  /**
   * Register default converters
   */
  private registerDefaultConverters(): void {
    this.registerConverter(new GPXToActivityConverter());
    this.registerConverter(new FITToActivityConverter());
    this.registerConverter(new TCXToActivityConverter());
  }

  /**
   * Register default encoders
   */
  private registerDefaultEncoders(): void {
    this.registerEncoder(new ActivityToGPXEncoder());
    this.registerEncoder(new ActivityToFITEncoder());
    this.registerEncoder(new ActivityToTCXEncoder());
  }

  /**
   * Register converter
   */
  registerConverter(converter: IActivityConverterPlugin): void {
    this.converters.set(converter.name, converter);
  }

  /**
   * Register encoder
   */
  registerEncoder(encoder: IActivityEncoderPlugin): void {
    this.encoders.set(encoder.name, encoder);
  }

  /**
   * Convert native format to FileType
   */
  async convertToActivity(
    sourceData: GPX11Type | FITFileType | TCXFileType,
    sourceFormat: "gpx" | "fit" | "tcx"
  ): Promise<FileType> {
    const context: ActivityContext = {
      metadata: new Map(),
      errors: [],
      warnings: [],
      stats: {
        startTime: Date.now(),
        processedTokens: 0,
        convertedElements: 0,
      },
      sourceFormat,
      sourceData,
      performance: {
        startTime: Date.now(),
      },
    };

    try {
      // Find suitable converter
      const converter = this.findConverter(sourceFormat);
      if (!converter) {
        throw new Error(`No converter found for format "${sourceFormat}"`);
      }

      // Execute conversion
      const startTime = Date.now();
      const result = converter.convert(sourceData as any, context);
      context.performance.convertTime = Date.now() - startTime;

      if (!result) {
        throw new Error(`Converter "${converter.name}" returned empty result`);
      }

      context.result = result;
      context.performance.endTime = Date.now();
      context.stats.endTime = Date.now();

      return result;
    } catch (error) {
      context.errors.push(error as Error);
      throw error;
    }
  }

  /**
   * Encode ActivityType to native format
   */
  async encodeActivity(
    file: FileType,
    targetFormat: "gpx" | "fit" | "tcx"
  ): Promise<GPX11Type | FITFileType | TCXFileType> {
    const context: ActivityEncodingContext = {
      metadata: new Map(),
      errors: [],
      warnings: [],
      stats: {
        startTime: Date.now(),
        processedTokens: 0,
        convertedElements: 0,
      },
      targetFormat,
      performance: {
        startTime: Date.now(),
      },
    };

    try {
      // Find suitable encoder
      const encoder = this.findEncoder(targetFormat);
      if (!encoder) {
        throw new Error(`No encoder found for format "${targetFormat}"`);
      }

      // Execute encoding
      const startTime = Date.now();
      const result = encoder.encode(file, context);
      context.performance.encodeTime = Date.now() - startTime;

      if (!result) {
        throw new Error(`Encoder "${encoder.name}" returned empty result`);
      }

      context.result = result;
      context.performance.endTime = Date.now();
      context.stats.endTime = Date.now();

      return result;
    } catch (error) {
      context.errors.push(error as Error);
      throw error;
    }
  }

  /**
   * Find converter
   */
  private findConverter(
    sourceFormat: string
  ): IActivityConverterPlugin | undefined {
    return Array.from(this.converters.values()).find((converter) =>
      converter.supportedTags?.includes(sourceFormat)
    );
  }

  /**
   * Find encoder
   */
  private findEncoder(
    targetFormat: string
  ): IActivityEncoderPlugin | undefined {
    return Array.from(this.encoders.values()).find((encoder) =>
      encoder.supportedTags?.includes(targetFormat)
    );
  }

  /**
   * Destroy processor, clean up resources
   */
  async destroy(): Promise<void> {
    this.converters.clear();
    this.encoders.clear();
  }
}
