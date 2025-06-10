import { BaseFITMiddleware } from "./base.js";
import { FITDecoderMesgs, FITFileType, FITContext } from "./types.js";

// ============ Example Middleware ============

/**
 * Performance monitoring middleware
 */
export class PerformanceMiddleware extends BaseFITMiddleware {
  name = "performance-middleware";
  description = "Monitor FIT parsing performance";

  async onParse(buffer: Buffer, context: FITContext): Promise<Buffer> {
    console.log(`🔧 Starting FIT file parsing, size: ${buffer.length} bytes`);
    return buffer;
  }

  async onExtractMessages(
    messages: FITDecoderMesgs,
    context: FITContext
  ): Promise<FITDecoderMesgs> {
    const messageCount = this.countMessages(messages);
    console.log(
      `📋 Message extraction completed, contains ${messageCount} messages`
    );

    // Show message type statistics
    const messageTypes = Object.keys(messages).filter(
      (key) => Array.isArray(messages[key]) && messages[key]!.length > 0
    );
    console.log(`   Message types: ${messageTypes.join(", ")}`);

    return messages;
  }

  async onStructure(
    result: Partial<FITFileType>,
    context: FITContext
  ): Promise<Partial<FITFileType>> {
    const structureInfo = this.analyzeStructure(result);
    console.log(`🏗️ Data structuring completed: ${structureInfo}`);
    return result;
  }

  async onComplete(
    result: FITFileType,
    context: FITContext
  ): Promise<FITFileType> {
    const performance = context.metadata.get("performance");
    console.log("⚡ FIT parsing performance statistics:", performance);

    // Show final result statistics
    console.log(`✅ Parsing completed: ${this.getSummary(result)}`);
    return result;
  }

  async onError(error: Error, context: FITContext): Promise<void> {
    console.error(`❌ FIT parsing error: ${error.message}`);
    console.error(`   Error details:`, error.stack);
  }

  private countMessages(messages: FITDecoderMesgs): number {
    let count = 0;
    Object.values(messages).forEach((messageArray) => {
      if (Array.isArray(messageArray)) {
        count += messageArray.length;
      }
    });
    return count;
  }

  private analyzeStructure(result: Partial<FITFileType>): string {
    const parts: string[] = [];

    if (result.sessionMesgs?.length) {
      parts.push(`${result.sessionMesgs.length} sessions`);
    }
    if (result.fileIdMesgs?.length) {
      parts.push(`file ID`);
    }
    if (result.eventMesgs?.length) {
      parts.push(`${result.eventMesgs.length} events`);
    }

    return parts.join(", ") || "no structured data";
  }

  private getSummary(result: FITFileType): string {
    const parts: string[] = [];

    if (result.sessionMesgs?.length) {
      parts.push(`${result.sessionMesgs.length} sessions`);
    }
    if (result.fileIdMesgs?.length) {
      const fileId = result.fileIdMesgs[0];
      parts.push(`type:${fileId.type}, manufacturer:${fileId.manufacturer}`);
    }

    return parts.join(", ") || "empty result";
  }
}

/**
 * Data validation middleware
 */
export class ValidationMiddleware extends BaseFITMiddleware {
  name = "validation-middleware";
  description = "Validate FIT data integrity";

  async onComplete(
    result: FITFileType,
    context: FITContext
  ): Promise<FITFileType> {
    const errors = this.validateFIT(result);
    if (errors.length > 0) {
      console.warn("🚨 FIT validation found issues:", errors);
      context.metadata.set("validation-errors", errors);

      // Add validation errors to context
      errors.forEach((error) => context.warnings.push(error));
    } else {
      console.log("✅ FIT data validation passed");
    }
    return result;
  }

  private validateFIT(fit: FITFileType): string[] {
    const errors: string[] = [];

    // Validate file ID
    if (!fit.fileIdMesgs || fit.fileIdMesgs.length === 0) {
      errors.push("Missing file ID information");
    } else {
      const fileId = fit.fileIdMesgs[0];
      if (!fileId.type) {
        errors.push("File type not specified");
      }
      if (!fileId.manufacturer) {
        errors.push("Manufacturer information missing");
      }
    }

    // Validate session data
    if (fit.sessionMesgs && fit.sessionMesgs.length > 0) {
      fit.sessionMesgs.forEach((session, index) => {
        if (!session.startTime) {
          errors.push(`Session ${index + 1} missing start time`);
        }
        if (!session.timestamp) {
          errors.push(`Session ${index + 1} missing end time`);
        }
        if (session.totalTimerTime === undefined) {
          errors.push(`Session ${index + 1} missing timer time`);
        }
      });
    }

    return errors;
  }
}

/**
 * Data cleanup middleware
 */
export class DataCleanupMiddleware extends BaseFITMiddleware {
  name = "data-cleanup-middleware";
  description = "Clean and optimize FIT data";

  async onStructure(
    result: Partial<FITFileType>,
    context: FITContext
  ): Promise<Partial<FITFileType>> {
    // Clean empty arrays and invalid data
    return this.cleanupData(result);
  }

  private cleanupData(result: Partial<FITFileType>): Partial<FITFileType> {
    const cleaned = { ...result };

    // Remove empty arrays
    Object.keys(cleaned).forEach((key) => {
      const value = (cleaned as any)[key];
      if (Array.isArray(value) && value.length === 0) {
        delete (cleaned as any)[key];
      }
    });

    // Clean invalid values in session data
    if (cleaned.sessionMesgs) {
      cleaned.sessionMesgs = cleaned.sessionMesgs.filter(
        (session) => session.startTime && session.timestamp
      );
    }

    console.log("🧹 Data cleanup completed");
    return cleaned;
  }
}

/**
 * File information extraction middleware
 */
export class FileInfoMiddleware extends BaseFITMiddleware {
  name = "file-info-middleware";
  description = "Extract and display basic file information";

  async onExtractMessages(
    messages: FITDecoderMesgs,
    context: FITContext
  ): Promise<FITDecoderMesgs> {
    this.extractFileInfo(messages, context);
    return messages;
  }

  private extractFileInfo(
    messages: FITDecoderMesgs,
    context: FITContext
  ): void {
    if (messages.fileIdMesgs && messages.fileIdMesgs.length > 0) {
      const fileId = messages.fileIdMesgs[0];

      const fileInfo = {
        type: fileId.type,
        manufacturer: fileId.manufacturer,
        product: fileId.product,
        serialNumber: fileId.serialNumber,
        timeCreated: fileId.timeCreated,
      };

      context.metadata.set("file-info", fileInfo);

      console.log("📄 File information:", {
        type: fileInfo.type,
        manufacturer: fileInfo.manufacturer,
        product: fileInfo.product,
        serialNumber: fileInfo.serialNumber,
        createdTime: fileInfo.timeCreated,
      });
    }
  }
}

// ============ Default Middleware Registration Function ============

/**
 * Register all default middlewares
 */
export async function registerDefaultMiddlewares(decoder: any): Promise<void> {
  const middlewares = [
    new PerformanceMiddleware(),
    new ValidationMiddleware(),
    new DataCleanupMiddleware(),
    new FileInfoMiddleware(),
  ];

  for (const middleware of middlewares) {
    await decoder.registerMiddleware(middleware);
  }
}
