// ============ Base Infrastructure ============
export * from "./base.js";

// ============ Converters ============
export * from "./converters.js";

// ============ Encoders ============
export * from "./encoders.js";

// ============ Processors ============
export * from "./processor.js";

// ============ Extensions ============
export * from "./extensions/extensions.js";

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
import {
  ExtensionManager,
  BaseMetricsExtension,
} from "./extensions/extensions.js";
import { SlopeExtension } from "./extensions/slope-extension.js";

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

  // Extensions
  ExtensionManager,
  BaseMetricsExtension,
  SlopeExtension,
};
