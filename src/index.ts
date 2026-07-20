export { TrackSwap } from "./TrackSwap.js";
export { TrackSwap as default } from "./TrackSwap.js";

export type {
  CourseEncodeOptions,
  BuiltInTrackFormat,
  DecodeOptions,
  EncodeOptions,
  TrackDocument,
  TrackDocumentDiagnostics,
  TrackDocumentFacets,
  TrackDocumentKind,
  TrackDocumentMetadata,
  TrackFormat,
  TrackInput,
  TrackSourceMetadata,
  TrackSwapOptions,
  TranscodeOptions,
} from "./document.js";
export {
  TrackSwapError,
  type TrackSwapErrorCode,
} from "./errors.js";
export type {
  AdapterDecodeResult,
  FITCourseAdapter,
  TrackFormatAdapter,
} from "./core/format-adapter.js";

export type {
  ActivityLapType,
  ActivityLengthType,
  ActivityRecordType,
  ActivityType,
  FileType,
  UserProfileType,
} from "./types.js";
export {
  FIT_SEMICIRCLE_INVALID_SINT32,
  normalizeFitSemicircleToDegrees,
  semicirclesToDegrees,
} from "./util.js";

export {
  buildHealthDocumentFromMessages,
  detectFITKinds,
  TRACKSWAP_HEALTH_PARSER_VERSION,
} from "./FIT/health.js";
export type {
  FITDiagnosticWarningV1,
  FITDiagnosticsV1,
  FITDocumentParseOptions,
  FITMessages,
  FITPrimaryKind,
  HealthDocumentV1,
  HealthIntervalV1,
  HealthMessagePointerV1,
  HealthMetricCode,
  HealthPointV1,
  HealthSessionSegmentV1,
  HealthSessionV1,
  HealthSummaryV1,
  HealthValueStatus,
} from "./FIT/health.js";
