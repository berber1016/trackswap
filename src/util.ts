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
 * Convert Semicircles from FIT files to decimal latitude/longitude
 * @param {number} semicircles - Position data in FIT files (latitude or longitude)
 * @returns {number} Converted decimal format (degrees)
 */
export const semicirclesToDegrees = (semicircles: number) => {
  return semicircles * (180 / Math.pow(2, 31));
};
