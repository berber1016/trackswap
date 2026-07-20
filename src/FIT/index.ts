// ============ Core Classes and Interfaces ============
export { FITDecoder } from "./decoder.js";
export { FITEncoder } from "./encoder.js";

// ============ Base Architecture ============
export {
  IFITMessageConverter,
  IFITStructurePlugin,
  IFITMiddlewarePlugin,
  BaseFITMessageConverter,
  BaseFITStructurePlugin,
  BaseFITMiddleware,
} from "./base.js";

// ============ Default Plugins ============
export {
  SessionStructurePlugin,
  CourseStructurePlugin,
  FileHeaderPlugin,
} from "./plugins.js";
export {
  HealthStructurePlugin,
  buildHealthDocumentFromMessages,
  detectFITKinds,
  TRACKSWAP_HEALTH_PARSER_VERSION,
} from "./health.js";
export type {
  FITDocumentParseOptions,
  FITPrimaryKind,
  FITDiagnosticsV1,
  HealthDocumentV1,
  HealthIntervalV1,
  HealthMetricCode,
  HealthPointV1,
  HealthSessionSegmentV1,
  HealthSessionV1,
  HealthSummaryV1,
  HealthValueStatus,
} from "./health.js";

// ============ Type Definitions ============
export * from "./types.js";
export {
  encodeCourse,
  buildCourseMesgs,
  type CoursePlan,
  type CourseRecordPoint,
  type CourseCuePoint,
  type FitMesg as CourseFitMesg,
} from "./encoderCourse.js";

// ============ Default Export ============
import { FITDecoder } from "./decoder.js";
import { FITEncoder } from "./encoder.js";

export default { FITDecoder, FITEncoder };
