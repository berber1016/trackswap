export const convertGPXExtensionsMapping = {
  "gpxtpx:cad": "cadence",
  "gpxtpx:hr": "heartRate",
  "gpxtpx:temp": "temperature",
  "gpxtpx:wtemp": "wtemp",
  "gpxtpx:atemp": "atemp",
  "gpxx:Temperature": "temperature",
  "gpxx:Depth": "depth",
  "gpxpx:PowerInWatts": "power",
};

/**
 * Convert Semicircles from FIT files to decimal latitude/longitude
 * @param {number} semicircles - Position data in FIT files (latitude or longitude)
 * @returns {number} Converted decimal format (degrees)
 */
export const semicirclesToDegrees = (semicircles: number) => {
  return semicircles * (180 / Math.pow(2, 31));
};
