import type { FITDiagnosticsV1, FITDocumentParseOptions, HealthDocumentV1 } from "./FIT/health.js";
import type { FileType } from "./types.js";

export type BuiltInTrackFormat = "fit" | "gpx" | "tcx";
export type TrackFormat = BuiltInTrackFormat | (string & {});

export type TrackDocumentKind =
  | "activity"
  | "health"
  | "course"
  | "route"
  | "waypoint"
  | "workout"
  | "device"
  | "unknown"
  | (string & {});

export type TrackInput = Buffer | Uint8Array | string;

export interface DecodeOptions {
  format?: TrackFormat;
  includeNative?: boolean;
  fit?: FITDocumentParseOptions;
}

export interface EncodeOptions {
  format: TrackFormat;
}

export interface TranscodeOptions extends EncodeOptions {
  sourceFormat?: TrackFormat;
}

export interface CourseEncodeOptions {
  sourceFormat?: TrackFormat;
}

export interface TrackSourceMetadata {
  byteLength: number;
}

export interface TrackDocumentMetadata {
  title?: string;
  creator?: string;
  createdAt?: Date;
  fileType?: string | number;
  manufacturer?: string | number;
  product?: string | number;
  productName?: string;
  serialNumber?: string;
  softwareVersion?: number;
}

export interface TrackDocumentDiagnostics {
  durationMs: number;
  warnings: string[];
  fit?: FITDiagnosticsV1;
}

export interface TrackDocumentFacets {
  activity?: FileType;
  health?: HealthDocumentV1;
}

export interface TrackDocument<TNative = unknown> {
  schemaVersion: "2";
  format: TrackFormat;
  kinds: TrackDocumentKind[];
  source: TrackSourceMetadata;
  metadata: TrackDocumentMetadata;
  facets: TrackDocumentFacets;
  native?: TNative;
  diagnostics: TrackDocumentDiagnostics;
}

export interface TrackSwapOptions {
  adapters?: readonly import("./core/format-adapter.js").TrackFormatAdapter[];
  includeBuiltInAdapters?: boolean;
}
