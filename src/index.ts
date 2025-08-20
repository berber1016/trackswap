export * from "./types.js";
export { FITDecoder, FITEncoder } from "./FIT/index.js";
export {
  GPXDecoder,
  GPXEncoder,
  registerDefaultMiddlewares,
  PipelineStage,
} from "./GPX/index.js";
export { TCXDecoder, TCXEncoder } from "./TCX/index.js";
export * from "./activity/index.js";

// Export extension-related classes and interfaces
export {
  ExtensionManager,
  BaseMetricsExtension,
} from "./activity/extensions/extensions.js";
export { SlopeExtension } from "./activity/extensions/slope-extension.js";

import { TrackSwap } from "./TrackSwap.js";

export { TrackSwap } from "./TrackSwap.js";

export default TrackSwap;
