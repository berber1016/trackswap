import {
  LapMesgType,
  LengthMesgType,
  RecordMesgType,
  SessionMesgType,
} from "./FIT/types.js";
import { IntensityType } from "./TCX/types.js";

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

/**
 * Parse File Type
 */
export interface FileType {
  // ========== file origin message ==========
  metadata?: {
    originType: "GPX" | "FIT" | "TCX" | "HIJSON";
    fileName?: string;
    fileType?: string;
  };
  /**
   * 描述 gpx points
   */
  points?: ActivityRecordType[];
  /**
   * 描述 gpx routes、 tcx course
   */
  routes?: ActivityLapType[];

  activities?: ActivityType[];
  userProfile?: UserProfileType;
}

export interface UserProfileType {
  // ========== user attribute ==========
  name?: string;
  weight?: number;
  gender?: string;
  age?: number;
  height?: number;
  language?: string;
  defaultMaxBikingHeartRate?: number;
  defaultMaxHeartRate?: number;
  // ========== setting ==========
  hrSetting?: string;
  speedSetting?: string;
  distSetting?: string;
  powerSetting?: string;
  activityClass?: number;
  positionSetting?: string;
  temperatureSetting?: string;
  elevSetting?: string;
  weightSetting?: string;
}

/**
 * Activity Type 直接继承自 FIT 的 session message，
 *
 * gpx -> trk
 * fit -> session
 * tcx -> Activity
 * 对应 gpx 的 trk ， fit 的 sessions, tcx 的 Activity
 */
export interface ActivityType extends SessionMesgType {
  /**
   * 活动索引
   */
  index: number;
  /**
   * 结束时间
   */
  endTime?: Date;
  laps?: ActivityLapType[];
}

/**
 * Activity Record Type 直接继承自 FIT 的 record message，
 * 将 其他文件类型的数据向 FIT 结构对齐
 */
export interface ActivityRecordType extends RecordMesgType {
  /**
   * 记录索引
   */
  index: number;
  // ================== GPX Additional Properties ===============
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
   * 转弯角度
   */
  turn?: number;

  /**
   * 记录描述
   */
  description?: number;
}

export interface ActivityLengthType extends LengthMesgType {
  // 记录索引
  index: number;
}
/**
 * Segments & fit(lap) & tcx(lap)
 */
export interface ActivityLapType extends LapMesgType {
  /**
   * 活动索引
   */
  index: number;
  /**
   * 结束时间
   */
  endTime?: Date;
  records: ActivityRecordType[];
  lengths: ActivityLengthType[];
}
