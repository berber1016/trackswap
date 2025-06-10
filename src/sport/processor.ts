import {
  SportContext,
  SportEncodingContext,
  ISportConverterPlugin,
  ISportEncoderPlugin,
} from "./base.js";
import { SportFileType } from "../types.js";
import { GPX11Type } from "../GPX/types.js";
import { FITFileType } from "../FIT/types.js";
import { TCXFileType } from "../TCX/types.js";
import {
  GPXToSportConverter,
  FITToSportConverter,
  TCXToSportConverter,
} from "./converters.js";
import {
  SportToGPXEncoder,
  SportToFITEncoder,
  SportToTCXEncoder,
} from "./encoders.js";

/**
 * Sport processor
 * Responsible for managing conversion and encoding processes
 */
export class SportProcessor {
  private converters: Map<string, ISportConverterPlugin> = new Map();
  private encoders: Map<string, ISportEncoderPlugin> = new Map();

  constructor() {
    this.registerDefaultConverters();
    this.registerDefaultEncoders();
  }

  /**
   * Register default converters
   */
  private registerDefaultConverters(): void {
    this.registerConverter(new GPXToSportConverter());
    this.registerConverter(new FITToSportConverter());
    this.registerConverter(new TCXToSportConverter());
  }

  /**
   * Register default encoders
   */
  private registerDefaultEncoders(): void {
    this.registerEncoder(new SportToGPXEncoder());
    this.registerEncoder(new SportToFITEncoder());
    this.registerEncoder(new SportToTCXEncoder());
  }

  /**
   * Register converter
   */
  registerConverter(converter: ISportConverterPlugin): void {
    this.converters.set(converter.name, converter);
  }

  /**
   * Register encoder
   */
  registerEncoder(encoder: ISportEncoderPlugin): void {
    this.encoders.set(encoder.name, encoder);
  }

  /**
   * Convert native format to SportFileType
   */
  async convertToSport(
    sourceData: GPX11Type | FITFileType | TCXFileType,
    sourceFormat: "gpx" | "fit" | "tcx"
  ): Promise<SportFileType> {
    const context: SportContext = {
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
      const result = converter.convert({} as any, context);
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
   * Encode SportFileType to native format
   */
  async encodeSport(
    sportData: SportFileType,
    targetFormat: "gpx" | "fit" | "tcx"
  ): Promise<GPX11Type | FITFileType | TCXFileType> {
    const context: SportEncodingContext = {
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
      const result = encoder.encode(sportData, context);
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
  ): ISportConverterPlugin | undefined {
    return Array.from(this.converters.values()).find((converter) =>
      converter.supportedTags?.includes(sourceFormat)
    );
  }

  /**
   * Find encoder
   */
  private findEncoder(targetFormat: string): ISportEncoderPlugin | undefined {
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
