import {
  DegreesType,
  ExtensionsType,
  LatitudeType,
  LongitudeType,
  Token,
  TokenAST,
} from "../types.js";
import { IProcessingContext } from "../core/base.js";

/**
 * Two lat/lon pairs defining the extent of an element.
 */
export interface BoundsType {
  minlat?: LatitudeType;
  minlon?: LongitudeType;
  maxlat?: LatitudeType;
  maxlon?: LongitudeType;
}

export interface PersonType {
  name?: string;
  email?: EmailType;
  link?: LinkType;
}

export interface CopyrightType {
  author?: string;
  year?: string;
  license?: string;
}

export interface EmailType {
  id?: string;
  domain?: string;
}

/**
 * Type of GPS fix. none means GPS had no fix. To signify "the fix info is unknown, leave out fixType entirely. pps = military signal used
 */
type FixType = "none" | "2d" | "3d" | "dgps" | "pps" | string;
export type LinkType = {
  /**
   * URL of hyperlink.
   */
  href?: string;
  /**
   * Text of hyperlink.
   */
  text?: string;
  /**
   * Mime type of content (image/jpeg)
   */
  type?: string;
};

// ================  base type end ================

/**
 * GPX 1.1 version type
 */
export interface GPX11Type {
  version?: string;
  creator?: string;
  xmlns?: string;
  // 'xmlns:xsi'?: string;
  "xmlns:gte"?: string;
  "xmlns:xsi"?: string;
  "xsi:schemaLocation"?: string;
  // Metadata about the file.
  metadata?: MetadataType;
  // A list of waypoints.
  wpt?: WptType[];
  // A list of routes.
  rte?: RteType[];
  // A list of tracks.
  trk?: TrkType[];
  extensions?: any;
  // other attribute
  [key: string]: any | undefined;
}

export interface MetadataType {
  name?: string;
  desc?: string;
  /**
   * The person or organization who created the GPX file.
   */
  author?: PersonType;
  copyright?: CopyrightType;
  link?: LinkType[];
  time?: Date;
  keywords?: string;
  bounds?: BoundsType;
  extensions?: ExtensionsType;
  [key: string]: any;
}

/**
 * A list of waypoints.
 */
export interface WptType {
  lat: LatitudeType;
  lon: LongitudeType;
  /**
   * Elevation (in meters) of the point.
   */
  ele?: number;
  /**
   * Creation/modification timestamp for element. Date and time in are in Univeral Coordinated Time (UTC), not local time! Conforms to ISO 8601 specification for date/time representation. Fractional seconds are allowed for millisecond timing in tracklogs.
   */
  time?: Date;
  /**
   * Instantaneous speed at the point (meters per second)
   */
  speed?: number;
  /**
   * Instantaneous course at the point (degrees, true north)
   */
  course?: number;
  /**
   * Magnetic variation (in degrees) at the point
   */
  magvar?: DegreesType;
  /**
   * Height (in meters) of geoid (mean sea level) above WGS84 earth ellipsoid. As defined in NMEA GGA message.
   */
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
   * Link to additional information about the waypoint.
   */
  link?: LinkType[];
  /**
   * Text of GPS symbol name. For interchange with other programs, use the exact spelling of the symbol as displayed on the GPS. If the GPS abbreviates words, spell them out.
   */
  sym?: string;
  /**
   * Type (classification) of the waypoint.
   */
  type?: string;
  fix?: FixType;
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
  /**
   * You can add extend GPX by adding your own elements from another schema here.
   */
  extensions?: ExtensionsType;
}

/**
 * A list of route points.
 */
type RteptType = WptType;

export interface RteType {
  /**
   * GPS name of route.
   */
  name?: string;
  /**
   * GPS comment for route.
   */
  cmt?: string;
  /**
   * Text description of route for user. Not sent to GPS.
   */
  desc?: string;
  /**
   * Source of data. Included to give user some idea of reliability and accuracy of data.
   */
  src?: string;
  /**
   * Links to external information about the route.
   */
  link?: LinkType[];
  /**
   * GPS route number.
   */
  number?: number;
  /**
   * Type (classification) of route.
   */
  type?: string;
  extensions?: ExtensionsType;
  rtept?: RteptType[];
}

export interface TrkType {
  name?: string;
  cmt?: string;
  desc?: string;
  src?: string;
  link?: LinkType[];
  number?: number;
  type?: string;
  extensions?: ExtensionsType;
  trkseg?: TrksegType[];
}

export interface TrksegType {
  trkpt?: WptType[];
  extensions?: ExtensionsType;
}

// 避免循环引用，直接定义需要的接口
export interface DecoderContext extends IProcessingContext {
  rawData?: Buffer;
  xmlContent?: string;
  tokens?: Token[];
  ast?: TokenAST;
  result?: GPX11Type;
  // IProcessingContext 已经包含了 metadata、errors、warnings、stats
  // 这里添加 GPX 特定的性能统计
  performance: {
    startTime: number;
    tokenizeTime?: number;
    astTime?: number;
    convertTime?: number;
    endTime?: number;
  };
}
