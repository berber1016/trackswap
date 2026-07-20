import type {
  CourseEncodeOptions,
  DecodeOptions,
  EncodeOptions,
  TrackDocument,
  TrackFormat,
  TrackInput,
  TrackSwapOptions,
  TranscodeOptions,
} from "./document.js";
import { asTrackSwapError, TrackSwapError } from "./errors.js";
import { createBuiltInAdapters } from "./core/builtin-adapters.js";
import {
  isFITCourseAdapter,
  type TrackFormatAdapter,
} from "./core/format-adapter.js";
import { FormatRegistry } from "./core/format-registry.js";
import type { FileType } from "./types.js";

function toBuffer(input: TrackInput): Buffer {
  if (typeof input === "string") return Buffer.from(input, "utf8");
  if (Buffer.isBuffer(input)) return input;
  return Buffer.from(input.buffer, input.byteOffset, input.byteLength);
}

function isTrackInput(input: TrackInput | FileType): input is TrackInput {
  return (
    typeof input === "string" ||
    Buffer.isBuffer(input) ||
    input instanceof Uint8Array
  );
}

/**
 * Stateless facade for decoding, encoding and transcoding track documents.
 * Format-specific behavior lives in adapters; this class only orchestrates them.
 */
export class TrackSwap {
  private readonly registry: FormatRegistry;
  private disposed = false;

  constructor(options: TrackSwapOptions = {}) {
    const builtInAdapters =
      options.includeBuiltInAdapters === false
        ? []
        : createBuiltInAdapters().adapters;
    const adapters: readonly TrackFormatAdapter[] = [
      ...builtInAdapters,
      ...(options.adapters ?? []),
    ];
    this.registry = new FormatRegistry(adapters);
  }

  detect(input: TrackInput): TrackFormat {
    this.assertActive();
    return this.registry.detect(toBuffer(input));
  }

  async decode<TNative = unknown>(
    input: TrackInput,
    options: DecodeOptions = {}
  ): Promise<TrackDocument<TNative>> {
    this.assertActive();
    const buffer = toBuffer(input);
    const format = options.format ?? this.registry.detect(buffer);
    const adapter = this.registry.get(format);
    const startedAt = Date.now();

    try {
      const decoded = await adapter.decode(buffer, options);
      return {
        schemaVersion: "2",
        format,
        kinds: [...new Set(decoded.kinds)],
        source: { byteLength: buffer.byteLength },
        metadata: decoded.metadata ?? {},
        facets: decoded.facets,
        ...(options.includeNative
          ? { native: decoded.native as TNative }
          : {}),
        diagnostics: {
          durationMs: Date.now() - startedAt,
          warnings: decoded.warnings ?? [],
          fit: decoded.fitDiagnostics,
        },
      };
    } catch (error) {
      throw asTrackSwapError(
        error,
        "DECODE_FAILED",
        `Failed to decode ${format.toUpperCase()}`,
        format
      );
    }
  }

  async decodeActivity(
    input: TrackInput,
    options: DecodeOptions = {}
  ): Promise<FileType> {
    const document = await this.decode(input, options);
    if (!document.facets.activity) {
      throw new TrackSwapError(
        "ACTIVITY_NOT_FOUND",
        `The ${document.format.toUpperCase()} document has no activity facet`,
        { format: document.format }
      );
    }
    return document.facets.activity;
  }

  async encodeActivity(
    activity: FileType,
    options: EncodeOptions
  ): Promise<Buffer> {
    this.assertActive();
    try {
      return await this.registry.get(options.format).encodeActivity(activity);
    } catch (error) {
      throw asTrackSwapError(
        error,
        "ENCODE_FAILED",
        `Failed to encode ${options.format.toUpperCase()}`,
        options.format
      );
    }
  }

  async transcode(
    input: TrackInput,
    options: TranscodeOptions
  ): Promise<Buffer> {
    this.assertActive();
    const buffer = toBuffer(input);
    const sourceFormat = options.sourceFormat ?? this.registry.detect(buffer);
    if (sourceFormat === options.format) return Buffer.from(buffer);
    const activity = await this.decodeActivity(buffer, { format: sourceFormat });
    return this.encodeActivity(activity, { format: options.format });
  }

  async encodeCourse(
    source: TrackInput | FileType,
    options: CourseEncodeOptions = {}
  ): Promise<Buffer> {
    this.assertActive();
    const activity = isTrackInput(source)
      ? await this.decodeActivity(source, { format: options.sourceFormat })
      : source;
    const adapter = this.registry.get("fit");
    if (!isFITCourseAdapter(adapter)) {
      throw new TrackSwapError(
        "FORMAT_UNSUPPORTED",
        "The registered FIT adapter does not support course encoding",
        { format: "fit" }
      );
    }
    try {
      return await adapter.encodeCourse(activity);
    } catch (error) {
      throw asTrackSwapError(
        error,
        "ENCODE_FAILED",
        "Failed to encode FIT course",
        "fit"
      );
    }
  }

  async dispose(): Promise<void> {
    if (this.disposed) return;
    this.disposed = true;
    await this.registry.dispose();
  }

  private assertActive(): void {
    if (this.disposed) {
      throw new TrackSwapError("DISPOSED", "TrackSwap instance is disposed");
    }
  }
}

export default TrackSwap;
