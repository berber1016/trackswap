export const convertGPXExtensionsMapping = {
  // heartRate
  heartrate: "heartRate",
  "gpxtpx:hr": "heartRate",
  "ns3:hr": "heartRate",
  "gpxdata:hr": "heartRate",
  // cadence
  "gpxdata:cadence": "cadence",
  "gpxtpx:cad": "cadence",
  "ns3:cad": "cadence",
  cadence: "cadence",
  // speed
  "gpxtpx:speed": "speed",
  "ns3:speed": "speed",
  speed: "speed",
  // power
  power: "power",
  "gpxdata:power": "power",
  "gpxpx:PowerInWatts": "power",
  PowerInWatts: "power",
  // other
  "gpxtpx:temp": "temperature",
  "gpxtpx:wtemp": "wtemp",
  "gpxtpx:atemp": "atemp",
  "gpxx:Temperature": "temperature",
  "gpxx:Depth": "depth",
};

/**
 * Convert semicircles (FIT wire/SDK units, scale 1 in Garmin JS profile) to decimal degrees.
 * @garmin/fitsdk decoder applies scale/offset per field; record position fields remain semicircles (units string), not pre-converted degrees.
 */
export const semicirclesToDegrees = (semicircles: number) => {
  return semicircles * (180 / Math.pow(2, 31));
};

/** FIT sint32 semicircle field: invalid when all bits set (Garmin profile). */
export const FIT_SEMICIRCLE_INVALID_SINT32 = 2147483647; // 0x7fffffff

/**
 * Raw FIT semicircle from SDK (scale 1 "semicircles" units) → decimal degrees.
 * Treats FIT invalid sentinel as absent. Preserves 0° (equator / prime meridian).
 */
export function normalizeFitSemicircleToDegrees(
  raw: unknown,
  precision = 6
): number | undefined {
  if (raw === undefined || raw === null) return undefined;
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n)) return undefined;
  if (n === FIT_SEMICIRCLE_INVALID_SINT32) return undefined;
  const deg = semicirclesToDegrees(n);
  const factor = Math.pow(10, precision);
  return Math.round(deg * factor) / factor;
}
