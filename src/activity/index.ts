// ============ Base Infrastructure ============
export * from "./base.js";

// ============ Converters ============
export * from "./converters.js";

// ============ Encoders ============
export * from "./encoders.js";

// ============ Processors ============
export * from "./processor.js";

import {
  GPXToActivityConverter,
  FITToActivityConverter,
  TCXToActivityConverter,
} from "./converters.js";

import {
  ActivityToGPXEncoder,
  ActivityToFITEncoder,
  ActivityToTCXEncoder,
} from "./encoders.js";

import { ActivityProcessor } from "./processor.js";


export default {
  // Converters
  GPXToActivityConverter,
  FITToActivityConverter,
  TCXToActivityConverter,

  // Encoders
  ActivityToGPXEncoder,
  ActivityToFITEncoder,
  ActivityToTCXEncoder,

  // Processors
  ActivityProcessor,
};
