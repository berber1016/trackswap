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

// ============ Type Definitions ============
export * from "./types.js";

// ============ Default Export ============
import { FITDecoder } from "./decoder.js";
import { FITEncoder } from "./encoder.js";

export default { FITDecoder, FITEncoder };
