import { IProcessingContext } from "../core/base.js";

/**
 * Session 对应 AbstractTrackType Lap 对应 RouteSegType Records 对应 RouteType 每个Record 对应 PointType
 */
export interface FITFileType {
  fileIdMesgs?: FileIdMesgType[];
  fileCreatorMesgs?: FileCreatorMesgType[];
  eventMesgs?: EventMesgType[];
  deviceInfoMesgs?: DeviceInfoMesgType[];
  deviceSettingsMesgs?: DeviceSettingsMesgType[];
  userProfileMesgs?: UserProfileMesgType[];
  sessionMesgs?: SessionMesgType[];
  courseMesgs?: any[];
}

export type FITDecoderMesgs = {
  fileIdMesgs?: FileIdMesgType[];
  fileCreatorMesgs?: FileCreatorMesgType[];
  eventMesgs?: EventMesgType[];
  deviceInfoMesgs?: DeviceInfoMesgType[];
  deviceSettingsMesgs?: DeviceSettingsMesgType[];
  userProfileMesgs?: UserProfileMesgType[];
  sessionMesgs?: Omit<SessionMesgType, "lapMesgs">[];
  lapMesgs?: Omit<SessionMesgType, "recordMesgs">[];
  recordMesgs?: RecordMesgType[];
  courseMesgs?: any[];
  // 索引签名，支持动态访问
  [key: string]: any[] | undefined;
};

export interface FileIdMesgType {
  serialNumber?: number;
  timeCreated?: string;
  manufacturer?: string;
  product?: number;
  type?: string;
  garminProduct?: string;
}

export interface FileCreatorMesgType {
  softwareVersion?: number;
}

export interface EventMesgType {
  timestamp?: string;
  data?: number;
  event?: string;
  eventType?: string;
  eventGroup?: number;
  timerTrigger?: string;
}

export interface DeviceInfoMesgType {
  timestamp?: string;
  serialNumber?: number;
  manufacturer?: string;
  product?: number;
  softwareVersion?: number;
  deviceIndex?: string;
  deviceType?: number;
  garminProduct?: string;
}

export interface DeviceSettingsMesgType {
  utcOffset?: number;
  timeOffset?: number;
  activeTimeZone?: number;
  timeMode?: string;
  timeZoneOffset?: number;
  backlightMode?: string;
}
/**
 * FIT userProfileMesg
 */
export interface UserProfileMesgType {
  friendlyName?: string;
  weight?: number;
  gender?: string;
  age?: number;
  height?: number;
  language?: string;
  elevSetting?: string;
  weightSetting?: string;
  defaultMaxBikingHeartRate?: number;
  defaultMaxHeartRate?: number;
  hrSetting?: string;
  speedSetting?: string;
  distSetting?: string;
  powerSetting?: string;
  activityClass?: number;
  positionSetting?: string;
  temperatureSetting?: string;
}

/**
 * FIT SessionMesg
 */
export interface SessionMesgType {
  /**
   * 时间
   */
  timestamp?: string;
  /**
   * 开始时间
   */
  startTime?: string;
  startPositionLat?: number;
  startPositionLong?: number;
  totalElapsedTime?: number;
  totalTimerTime?: number;
  totalDistance?: number;
  totalCycles?: number;
  necLat?: number;
  necLong?: number;
  swcLat?: number;
  swcLong?: number;
  totalWork?: number;
  messageIndex?: number;
  totalCalories?: number;
  totalFatCalories?: number;
  avgSpeed?: number;
  maxSpeed?: number;
  avgPower?: number;
  maxPower?: number;
  /**
   * 总爬升
   */
  totalAscent?: number;
  /**
   * 总下降
   */
  totalDescent?: number;
  firstLapIndex?: number;
  numLaps?: number;
  normalizedPower?: number;
  trainingStressScore?: number;
  intensityFactor?: number;
  thresholdPower?: number;
  event?: string;
  eventType?: string;
  sport?: string;
  subSport?: string;
  avgCadence?: number;
  maxCadence?: number;
  trigger?: number;
  totalStrokes?: number;
  enhancedAvgSpeed?: number;
  enhancedMaxSpeed?: number;
  lapMesgs?: LapMesgType[];
}

/**
 * FIT RecordMesg
 */
export interface RecordMesgType {
  timestamp?: string;
  positionLat?: number;
  positionLong?: number;
  altitude?: number;
  distance?: number;
  accumulatedPower?: number;
  speed?: number;
  power?: number;
  cadence?: number;
  heartRate?: number;
  temperature?: number;
  enhancedAltitude?: number;
  enhancedSpeed?: number;
  [key: string]: number | string | undefined | any;
}

/**
 * FIT 文件额外记录的数据 LapMesg
 */
export interface LapMesgType {
  timestamp?: string;
  startTime?: string;
  startPositionLat?: number;
  startPositionLong?: number;
  endPositionLat?: number;
  endPositionLong?: number;
  totalElapsedTime?: number;
  totalTimerTime?: number;
  totalDistance?: number;
  totalCycles?: number;
  totalWork?: number;
  messageIndex?: number;
  totalCalories?: number;
  totalFatCalories?: number;
  avgSpeed?: number;
  maxSpeed?: number;
  avgPower?: number;
  maxPower?: number;
  totalAscent?: number;
  totalDescent?: number;
  normalizedPower?: number;
  event?: string;
  eventType?: string;
  avgCadence?: number;
  maxCadence?: number;
  lapTrigger?: string;
  sport?: string;
  totalStrokes?: number;
  enhancedAvgSpeed?: number;
  enhancedMaxSpeed?: number;

  recordMesgs?: RecordMesgType[];
}

export interface ActivityMesgType {
  timestamp?: string;
  totalTimerTime?: number;
  numSessions?: number;
  type?: string;
  event?: string;
  eventType?: string;
  [key: string]: number | string | undefined | any;
}

/**
 * FIT 消息处理上下文
 */
export interface FITContext extends IProcessingContext {
  /** 原始二进制数据 */
  rawData?: Buffer;
  /** FIT SDK 解析的原始消息 */
  rawMessages?: FITDecoderMesgs;
  /** 最终结果 */
  result?: FITFileType;
  /** FIT 文件头信息 */
  fileHeader?: {
    type?: string;
    manufacturer?: string;
    product?: number;
  };
  /** FIT 特定的性能统计 */
  performance: {
    startTime: number;
    parseTime?: number;
    extractTime?: number;
    structureTime?: number;
    endTime?: number;
  };
}
