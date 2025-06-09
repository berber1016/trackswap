import { GPXDecoder } from "./decoder.js";
import { GPXEncoder } from "./encoder.js";
import { registerDefaultMiddlewares } from "./middleware.js";
import { PipelineStage } from "./processor.js";
export { GPXDecoder, GPXEncoder, registerDefaultMiddlewares, PipelineStage };

export default {
  GPXDecoder,
  GPXEncoder,
  registerDefaultMiddlewares,
  PipelineStage,
};
