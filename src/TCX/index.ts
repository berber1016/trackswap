// ============ 核心类和接口 ============

import { TCXDecoder } from "./decoder.js";
import { TCXEncoder } from "./encoder.js";

export { TCXDecoder } from "./decoder.js";
export { TCXEncoder } from "./encoder.js";
export { TCXFileType, TCXContext } from "./types.js";
export {
  AstGenerateProcessor,
  CompleteProcessor,
  ConvertProcessor,
  IPipelineProcessor,
  TokenizeProcessor,
  PipelineStage,
} from "./processor.js";

// ============ 基础架构 ============
export * from "./base.js";

// ============ 转换器 ============
export * from "./converters.js";

export default { TCXDecoder, TCXEncoder };
