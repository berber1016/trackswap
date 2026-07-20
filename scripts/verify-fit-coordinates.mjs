/**
 * Regression: FIT semicircle → degrees and invalid sentinel.
 * Run: node scripts/verify-fit-coordinates.mjs (after npm run build:dev)
 */
import assert from "node:assert/strict";
import {
  normalizeFitSemicircleToDegrees,
  FIT_SEMICIRCLE_INVALID_SINT32,
  semicirclesToDegrees,
} from "../dist/index.js";

const sc = Math.round((40 * 2 ** 31) / 180);
const deg = normalizeFitSemicircleToDegrees(sc);
assert.ok(deg != null, "40° semicircle should produce a degree value");
assert.ok(Math.abs(deg - 40) < 1e-5, `expected ~40, got ${deg}`);

assert.equal(
  normalizeFitSemicircleToDegrees(0),
  0,
  "equator / prime meridian (0 semicircles) must be 0°"
);

assert.equal(
  normalizeFitSemicircleToDegrees(FIT_SEMICIRCLE_INVALID_SINT32),
  undefined,
  "FIT invalid sint32 sentinel should map to undefined"
);

// @garmin/fitsdk record position field uses scale 1 "semicircles"; decoder does not pre-convert to degrees.
const sdkStyleRaw = 477000000;
const fromSdk = semicirclesToDegrees(sdkStyleRaw);
assert.ok(
  Math.abs(fromSdk) < 90,
  "sample semicircle magnitude should decode to a plausible latitude"
);

console.log("verify-fit-coordinates: OK");
