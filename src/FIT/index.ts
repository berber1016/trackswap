// ============ 核心类和接口 ============
export { FITDecoder } from "./decoder.js";
export { FITEncoder } from "./encoder.js";

// ============ 基础架构 ============
export {
  IFITMessageConverter,
  IFITStructurePlugin,
  IFITMiddlewarePlugin,
  BaseFITMessageConverter,
  BaseFITStructurePlugin,
  BaseFITMiddleware,
} from "./base.js";

// ============ 默认插件 ============
export {
  SessionStructurePlugin,
  CourseStructurePlugin,
  FileHeaderPlugin,
} from "./plugins.js";

// ============ 类型定义 ============
export * from "./types.js";

// ============ 默认导出 ============
import { FITDecoder } from "./decoder.js";
import { FITEncoder } from "./encoder.js";

export default { FITDecoder, FITEncoder };
