import {
  LapMesgType,
  RecordMesgType,
  SessionMesgType,
  UserProfileMesgType,
} from "./FIT/types.js";
import { IntensityType, TriggerMethodType } from "./TCX/types.js";

export interface Token {
  type: "open" | "close" | "text";
  tag: string;
  attributes?: AttributeType;
  value?: string | number;
}

export interface TokenAST {
  tag: string;
  attributes?: AttributeType;
  children?: TokenAST[];
  value?: string | number;
}

export interface AttributeType {
  [key: string]: string;
}

/**
 * The latitude of the point. Decimal degrees, WGS84 datum.
 * @type {number} -90.0 <= value <= 90.0
 */
export type LatitudeType = number;
/**
 * The longitude of the point. Decimal degrees, WGS84 datum.
 * @type {number} -180.0 <= value < 180.0
 */
export type LongitudeType = number;

/**
 * Used for bearing, heading, course. Units are decimal degrees, true (not magnetic).
 * @type {number} 0.0 <= value < 360.0

 */
export type DegreesType = number;

export interface ExtensionsType {
  [key: string]: string | number | undefined | ExtensionsType;
}

export interface SportFileType {
  metadata?: {
    originType: "GPX" | "FIT" | "TCX" | "HIJSON";
    fileName?: string;
    fileType?: string;
    creator?: string;
    date?: string;
  };
  points?: SportPointType[];
  routes?: SportRouteSegType[];
  tracks?: SportTrackType[];

  __fit__UserProfileMesgs?: UserProfileMesgType[];
}

export interface SportPointType {
  lat: LatitudeType;
  lon: LongitudeType;
  ele?: number;
  time?: number;
  heart?: number;
  // fit attribute
  distance?: number;
  accumulatedPower?: number;
  speed?: number;
  power?: number;
  cadence?: number;
  temperature?: number;
  enhancedAltitude?: number;
  enhancedSpeed?: number;
  __fit__RecordMesgType?: RecordMesgType;

  // ================== GPX Additional Properties ===============
  /**
   * Magnetic variation (in degrees) at the point
   */
  magvar?: DegreesType;
  geoidheight?: number;
  /**
   * The GPS name of the waypoint. This field will be transferred to and from the GPS. GPX does not place restrictions on the length of this field or the characters contained in it. It is up to the receiving application to validate the field before sending it to the GPS.
   */
  name?: string;
  /**
   * GPS waypoint comment. Sent to GPS as comment.
   */
  cmt?: string;
  /**
   * A text description of the element. Holds additional information about the element intended for the user, not the GPS.
   */
  desc?: string;
  /**
   * Source of data. Included to give user some idea of reliability and accuracy of data. "Garmin eTrex", "USGS quad Boston North", e.g.
   */
  src?: string;
  /**
   * Text of GPS symbol name. For interchange with other programs, use the exact spelling of the symbol as displayed on the GPS. If the GPS abbreviates words, spell them out.
   */
  sym?: string;
  /**
   * Type (classification) of the waypoint.
   */
  type?: string;
  /**
   * Number of satellites used to calculate the GPX fix.
   */
  sat?: string;
  /**
   * Horizontal dilution of precision.
   */
  hdop?: number;
  /**
   * Vertical dilution of precision.
   */
  vdop?: number;
  /**
   * Position dilution of precision.
   */
  pdop?: number;
  /**
   * Number of seconds since last DGPS update.
   */
  ageofdgpsdata?: number;
  /**
   * ID of DGPS station used in differential correction.
   */
  dgpsid?: DegreesType;
  turn?: number;
  extensions?: ExtensionsType;
}

// track & session(fit) & Activity(tcx)
export interface SportTrackType {
  name?: string;
  // Sport type
  sport?: string;
  trackseg?: SportRouteSegType[];
  extensions?: ExtensionsType;
  startTime?: number;
  startLat?: LatitudeType;
  startLon?: LongitudeType;
  duration?: number;
  distance?: number;
  endTime?: number;
  endLat?: LatitudeType;
  endLon?: LongitudeType;
  __fit__sessionMesgType?: SessionMesgType;
}

/**
 * Segments & fit(lap) & tcx(lap)
 */
export interface SportRouteSegType {
  name?: string;
  sport?: string;
  points?: SportPointType[];
  /**
   * Duration mapping tcx:Lap:TotalTimeSeconds
   */
  duration?: number;
  /**
   * Exercise distance
   */
  distance?: number;
  /**
   * Start time
   */
  startTime?: number;
  /**
   * End time
   */
  endTime?: number;
  /**
   * Average heart rate per minute
   */
  avgHeartRateBpm?: number;
  /**
   * Maximum heart rate per minute
   */
  maxHeartRateBpm?: number;
  /**
   * Average speed m/s
   */
  avgSpeed?: number;
  /**
   * Maximum speed m/s
   */
  maxSpeed?: number;
  /**
   * Average cadence per minute
   */
  avgCadenceBpm?: number;
  /**
   * Maximum cadence per minute
   */
  maxCadenceBpm?: number;
  /**
   * Average power
   */
  avgPower?: number;
  /**
   * Maximum power
   */
  maxPower?: number;
  /**
   * Average temperature
   */
  avgTemperature?: number;
  /**
   * Maximum temperature
   */
  maxTemperature?: number;
  /**
   * Average altitude
   */
  avgAltitude?: number;
  /**
   * Maximum altitude
   */
  maxEnhancedAltitude?: number;
  /**
   * Ascent
   */
  totalAscent?: number;
  /**
   * Descent
   */
  totalDescent?: number;
  /**
   * Calories
   */
  calories?: number;
  // Below are tcx exclusive fields, all data from tcx
  __tcx__Intensity?: IntensityType;
  __tcx__TriggerMethod?: TriggerMethodType;
  __tcx__Notes?: string;
  __tcx__Extensions?: any;

  __fit__lapMesgType?: LapMesgType;
}
