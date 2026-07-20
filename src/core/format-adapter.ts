import type {
  DecodeOptions,
  TrackDocumentFacets,
  TrackDocumentKind,
  TrackDocumentMetadata,
  TrackFormat,
} from "../document.js";
import type { FITDiagnosticsV1 } from "../FIT/health.js";
import type { FileType } from "../types.js";

export interface AdapterDecodeResult<TNative = unknown> {
  kinds: TrackDocumentKind[];
  facets: TrackDocumentFacets;
  metadata?: TrackDocumentMetadata;
  native: TNative;
  warnings?: string[];
  fitDiagnostics?: FITDiagnosticsV1;
}

export interface TrackFormatAdapter<TNative = unknown> {
  readonly format: TrackFormat;
  matches(input: Buffer): boolean;
  decode(
    input: Buffer,
    options: DecodeOptions
  ): Promise<AdapterDecodeResult<TNative>>;
  encodeActivity(activity: FileType): Promise<Buffer>;
  dispose?(): Promise<void> | void;
}

export interface FITCourseAdapter extends TrackFormatAdapter {
  readonly format: "fit";
  encodeCourse(activity: FileType): Promise<Buffer>;
}

export function isFITCourseAdapter(
  adapter: TrackFormatAdapter
): adapter is FITCourseAdapter {
  return adapter.format === "fit" && "encodeCourse" in adapter;
}
