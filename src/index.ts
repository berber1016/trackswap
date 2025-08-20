export * from "./types.js";
export { FITDecoder, FITEncoder } from "./FIT/index.js";
export {
  GPXDecoder,
  GPXEncoder,
  registerDefaultMiddlewares,
  PipelineStage,
} from "./GPX/index.js";
export { TCXDecoder, TCXEncoder } from "./TCX/index.js";

export { TrackSwap } from "./TrackSwap.js";

import { TrackSwap } from "./TrackSwap.js";

export default TrackSwap;
