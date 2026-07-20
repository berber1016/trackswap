// Removed old FITProcessor class, all content is implemented in the pipeline processors above

import {
  IFITMessageConverter,
  IFITStructurePlugin,
  IFITMiddlewarePlugin,
} from "./base.js";
import { FITDecoderMesgs, FITFileType, FITContext } from "./types.js";
import { fitDebugLog, fitDebugWarn } from "../fit-debug.js";

/**
 * FIT pipeline stages
 */
export enum FITPipelineStage {
  PARSE = "parse",
  EXTRACT = "extract",
  STRUCTURE = "structure",
  COMPLETE = "complete",
}

// ============ FIT Pipeline Processor Implementation ============

/**
 * FIT pipeline processor interface
 */
export interface IFITPipelineProcessor {
  stage: FITPipelineStage;
  process(context: FITContext): Promise<FITContext>;
}

/**
 * Parse processor - parses binary FIT data to messages
 */
export class ParseProcessor implements IFITPipelineProcessor {
  stage = FITPipelineStage.PARSE;

  async process(context: FITContext): Promise<FITContext> {
    const startTime = Date.now();

    if (!context.rawData) {
      throw new Error("FIT data cannot be empty");
    }

    try {
      // Parse binary data using FIT SDK
      const rawMessages = await this.parseWithFitSDK(
        context.rawData,
        context
      );
      context.rawMessages = rawMessages;
      fitDebugLog("🎉 FIT parsing raw messages:", rawMessages);
      context.performance.parseTime = Date.now() - startTime;
      fitDebugLog(
        `🔧 FIT parsing completed, contains message types: ${Object.keys(
          rawMessages
        ).join(", ")}`
      );

      return context;
    } catch (error) {
      throw new Error(`FIT parsing failed: ${(error as Error).message}`);
    }
  }

  /**
   * Parse binary data using FIT SDK
   */
  private async parseWithFitSDK(
    buffer: Buffer,
    context: FITContext
  ): Promise<FITDecoderMesgs> {
    const { Decoder, Profile, Stream } = await import("@garmin/fitsdk");
    const profileParts = [
      Profile.version?.major,
      Profile.version?.minor,
      Profile.version?.patch,
    ].filter((value) => value !== undefined);
    if (profileParts.length > 0) {
      context.metadata.set(
        "fit-sdk-profile-version",
        profileParts.join(".")
      );
    }

    const stream = Stream.fromBuffer(buffer);
    if (!Decoder.isFIT(stream)) {
      throw new Error("Not a valid FIT file");
    }

    const decoder = new Decoder(stream);
    const { messages, errors } = decoder.read();
    if (errors && errors.length > 0) {
      fitDebugWarn("FIT parsing warnings:", errors);
    }

    return messages as FITDecoderMesgs;
  }
}

function normalizeFitRecordRow(
  record: Record<string, unknown>
): Record<string, unknown> {
  const row = { ...record };
  if (row.position_lat != null && row.positionLat == null) {
    row.positionLat = row.position_lat;
  }
  if (row.position_long != null && row.positionLong == null) {
    row.positionLong = row.position_long;
  }
  return row;
}

/**
 * Extract processor - extracts and converts messages
 */
export class ExtractProcessor implements IFITPipelineProcessor {
  stage = FITPipelineStage.EXTRACT;

  constructor(
    private getConverters: (messageType: string) => IFITMessageConverter[]
  ) {}

  async process(context: FITContext): Promise<FITContext> {
    const startTime = Date.now();

    if (!context.rawMessages) {
      throw new Error("Raw messages cannot be empty");
    }

    const extractedMessages: FITDecoderMesgs = {};

    // Iterate through all message types
    for (const [messageType, messages] of Object.entries(context.rawMessages)) {
      if (!Array.isArray(messages) || messages.length === 0) {
        extractedMessages[messageType] = messages;
        continue;
      }

      const converters = this.getConverters(messageType);

      if (converters.length === 0) {
        extractedMessages[messageType] =
          messageType === "recordMesgs"
            ? (messages.map((m) =>
                normalizeFitRecordRow(m as Record<string, unknown>)
              ) as unknown as FITDecoderMesgs["recordMesgs"])
            : messages;
        fitDebugLog(
          `📋 Message type "${messageType}" has no converter, using raw data`
        );
      } else {
        // Use highest priority converter
        const converter = converters[0];
        try {
          const convertedMessages = converter.convertMessages(
            messages,
            context
          );
          extractedMessages[messageType] = convertedMessages;
          fitDebugLog(
            `✅ Message type "${messageType}" using converter ${converter.name}`
          );
        } catch (error) {
          context.errors.push(error as Error);
          extractedMessages[messageType] = messages; // Fallback to raw messages
          fitDebugWarn(
            `FIT converter "${converter.name}" failed for ${messageType}; raw messages were retained`,
            error
          );
        }
      }
    }

    context.rawMessages = extractedMessages;
    context.performance.extractTime = Date.now() - startTime;

    return context;
  }
}

/**
 * Structure processor - data structuring
 */
export class StructureProcessor implements IFITPipelineProcessor {
  stage = FITPipelineStage.STRUCTURE;

  constructor(private getStructurePlugins: () => IFITStructurePlugin[]) {}

  async process(context: FITContext): Promise<FITContext> {
    const startTime = Date.now();

    if (!context.rawMessages) {
      throw new Error("Message data cannot be empty");
    }

    let structuredResult: Partial<FITFileType> = {};

    // Apply all structure plugins
    const plugins = this.getStructurePlugins();

    for (const plugin of plugins) {
      try {
        const pluginResult = plugin.structureData(context.rawMessages, context);
        structuredResult = { ...structuredResult, ...pluginResult };
        fitDebugLog(`🔧 Structure plugin ${plugin.name} processing completed`);
      } catch (error) {
        context.errors.push(error as Error);
        throw new Error(
          `FIT structure plugin "${plugin.name}" failed: ${
            (error as Error).message
          }`
        );
      }
    }

    context.result = structuredResult as FITFileType;
    context.performance.structureTime = Date.now() - startTime;

    return context;
  }
}

/**
 * Complete processor - final processing and cleanup
 */
export class CompleteProcessor implements IFITPipelineProcessor {
  stage = FITPipelineStage.COMPLETE;

  async process(context: FITContext): Promise<FITContext> {
    context.performance.endTime = Date.now();

    // Record performance metrics
    const totalTime =
      context.performance.endTime - context.performance.startTime;
    context.metadata.set("performance", {
      totalTime,
      parseTime: context.performance.parseTime,
      extractTime: context.performance.extractTime,
      structureTime: context.performance.structureTime,
    });

    // Update statistics
    if (context.stats) {
      context.stats.endTime = Date.now();
      if (context.rawMessages) {
        context.stats.processedTokens = this.countTotalMessages(
          context.rawMessages
        );
      }
    }

    fitDebugLog(`✅ FIT processing completed, total time: ${totalTime}ms`);

    return context;
  }

  /**
   * Count total messages
   */
  private countTotalMessages(messages: FITDecoderMesgs): number {
    let count = 0;
    Object.values(messages).forEach((messageArray) => {
      if (Array.isArray(messageArray)) {
        count += messageArray.length;
      }
    });
    return count;
  }
}
