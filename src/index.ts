export * from "./types.js";
export {
  FITDecoder,
  FITEncoder,
  encodeCourse,
  buildCourseMesgs,
  type CoursePlan,
  type CourseRecordPoint,
  type CourseCuePoint,
  type CourseFitMesg,
} from "./FIT/index.js";
export {
  GPXDecoder,
  GPXEncoder,
  registerDefaultMiddlewares,
  PipelineStage,
} from "./GPX/index.js";
export { TCXDecoder, TCXEncoder } from "./TCX/index.js";
export * from "./activity/index.js";

import { TrackSwap } from "./TrackSwap.js";

export { TrackSwap } from "./TrackSwap.js";

export default TrackSwap;
