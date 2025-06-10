// ============ Base Infrastructure ============
export * from "./base.js";

// ============ Converters ============
export * from "./converters.js";

// ============ Encoders ============
export * from "./encoders.js";

// ============ Processors ============
export * from "./processor.js";

import {
  GPXToSportConverter,
  FITToSportConverter,
  TCXToSportConverter,
} from "./converters.js";

import {
  SportToGPXEncoder,
  SportToFITEncoder,
  SportToTCXEncoder,
} from "./encoders.js";

import { SportProcessor } from "./processor.js";

export default {
  // Converters
  GPXToSportConverter,
  FITToSportConverter,
  TCXToSportConverter,

  // Encoders
  SportToGPXEncoder,
  SportToFITEncoder,
  SportToTCXEncoder,

  // Processors
  SportProcessor,
};
