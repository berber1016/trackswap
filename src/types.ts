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
 * activity type
 *
 * 对应 gpx 的 trk ， fit 的 sessions, tcx 的 Activity
 */
export interface ActivityType {
  /**
   * 活动索引
   */
  index: number;
  /**
   * 活动名称
   */
  name?: string;
  /**
   * 活动类型
   */
  sport_type?: string;
  /**
   * 活动描述
   */
  description?: string;
  /**
   * 活动时间戳
   */
  timestamp?: number;
  /**
   * 开始时间(时间戳)
   */
  start_time?: number;
  /**
   * 结束时间(时间戳)
   */
  end_time?: number;
  /**
   * 开始纬度
   */
  start_lat?: LatitudeType;
  /**
   * 开始经度
   */
  start_lon?: LongitudeType;
  /**
   * 结束纬度
   */
  end_lat?: LatitudeType;
  /**
   * 结束经度
   */
  end_lon?: LongitudeType;
  /**
   * 总计时时间（不包括暂停时间）
   */
  total_timer_time?: number;
  /**
   * 总经过时间（包括暂停时间）
   */
  total_elapsed_time?: number;
  /**
   * 总距离
   */
  total_distance?: number;
  /**
   * 总上升高度
   */
  total_ascent?: number;
  /**
   * 总下降高度
   */
  total_descent?: number;

  /**
   * 总周期数（如踏频、划桨次数等）
   */
  total_cycles?: number;
  /**
   * 总功（焦耳）
   */
  total_work?: number;
  /**
   * 总划桨/踏步次数
   */
  total_strokes?: number;
  /**
   * 平均速度（m/s）
   */
  avg_speed?: number;
  /**
   * 最大速度（m/s）
   */
  max_speed?: number;
  /**
   * 平均功率（W）
   */
  avg_power?: number;
  /**
   * 最大功率（W）
   */
  max_power?: number;
  /**
   * 标准化功率
   */
  normalized_power?: number;
  /**
   * 阈值功率（W）
   */
  threshold_power?: number;
  /**
   * 平均踏频（次/分）
   */
  avg_cadence?: number;
  /**
   * 最大踏频（次/分）
   */
  max_cadence?: number;
  /**
   * 平均心率（次/分）
   */
  avg_heart_rate?: number;
  /**
   * 最大心率（次/分）
   */
  max_heart_rate?: number;
  /**
   * 训练压力评分
   */
  TTS?: number;
  /**
   * 强度因子
   */
  IF?: number;
  /**
   * 总消耗卡路里
   */
  total_calories?: number;
  /**
   * 总脂肪消耗卡路里
   */
  total_fat_calories?: number;

  laps?: ActivityLapType[];
}

export interface ActivityRecordType {
  /**
   * 记录索引
   */
  index: number;
  /**
   * 纬度
   */
  lat: LatitudeType;
  /**
   * 经度
   */
  lon: LongitudeType;
  /**
   * 海拔
   */
  altitude?: number;
  /**
   * 时间
   */
  timestamp?: number;
  /**
   * 心率
   */
  heart_rate?: number;
  /**
   * 距离
   */
  distance?: number;
  /**
   * 累计功率
   */
  accumulated_power?: number;
  /**
   * 速度
   */
  speed?: number;
  /**
   * 功率
   */
  power?: number;
  /**
   * 踏频
   */
  cadence?: number;
  /**
   * 温度
   */
  temperature?: number;
  /**
   * 增强海拔
   */
  enhanced_altitude?: number;
  /**
   * 增强速度
   */
  enhanced_speed?: number;

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

/**
 * Segments & fit(lap) & tcx(lap)
 */
export interface ActivityLapType {
  /**
   * 活动索引
   */
  index: number;
  /**
   * 活动名称
   */
  name?: string;
  /**
   * 活动类型
   */
  sport_type?: string;
  /**
   * 活动描述
   */
  description?: string;
  /**
   * 活动时间戳
   */
  timestamp?: number;
  /**
   * 开始时间(时间戳)
   */
  start_time?: number;
  /**
   * 结束时间(时间戳)
   */
  end_time?: number;
  /**
   * 开始纬度
   */
  start_lat?: LatitudeType;
  /**
   * 开始经度
   */
  start_lon?: LongitudeType;
  /**
   * 结束纬度
   */
  end_lat?: LatitudeType;
  /**
   * 结束经度
   */
  end_lon?: LongitudeType;
  /**
   * 总计时时间（不包括暂停时间）
   */
  total_timer_time?: number;
  /**
   * 总经过时间（包括暂停时间）
   */
  total_elapsed_time?: number;
  /**
   * 总距离
   */
  total_distance?: number;
  /**
   * 总上升高度
   */
  total_ascent?: number;
  /**
   * 总下降高度
   */
  total_descent?: number;

  /**
   * 总周期数（如踏频、划桨次数等）
   */
  total_cycles?: number;
  /**
   * 总功（焦耳）
   */
  total_work?: number;
  /**
   * 总划桨/踏步次数
   */
  total_strokes?: number;
  /**
   * 平均速度（m/s）
   */
  avg_speed?: number;
  /**
   * 最大速度（m/s）
   */
  max_speed?: number;
  /**
   * 平均功率（W）
   */
  avg_power?: number;
  /**
   * 最大功率（W）
   */
  max_power?: number;
  /**
   * 标准化功率
   */
  normalized_power?: number;
  /**
   * 阈值功率（W）
   */
  threshold_power?: number;
  /**
   * 平均踏频（次/分）
   */
  avg_cadence?: number;
  /**
   * 最大踏频（次/分）
   */
  max_cadence?: number;
  /**
   * 平均心率
   */
  avg_heart_rate?: number;
  /**
   * 平均心率
   */
  max_heart_rate?: number;
  /**
   * 训练压力评分
   */
  TTS?: number;
  /**
   * 强度因子
   */
  IF?: number;
  /**
   * 总消耗卡路里
   */
  total_calories?: number;
  /**
   * 总脂肪消耗卡路里
   */
  total_fat_calories?: number;
  /**
   * 记录点
   */
  records?: ActivityRecordType[];

  /**
   * Active (high intensity)
   * Resting (low intensity)
   */
  intensity?: IntensityType;
}
