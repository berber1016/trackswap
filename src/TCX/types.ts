import { ExtensionsType, Token, TokenAST } from "../types.js";
import { IProcessingContext } from "../core/base.js";

/**
 * TCX 文件类型
 */
export interface TCXFileType {
  version?: string;
  creator?: string;
  xmlns?: string;
  "xmlns:gte"?: string;
  "xmlns:xsi"?: string;
  "xsi:schemaLocation"?: string;
  Folders?: FolderType;
  Activities?: ActivityListType;
  Workouts?: WorkoutListType;
  Courses?: CourseListType;
  Author?: AbstractSourceType;
  Extensions?: any;
  // other attribute
  [key: string]: any | undefined;
}

export interface FolderType {
  History?: HistoryType;
  // TODO: 暂不处理
  Workouts?: WorkoutListType;
  // TODO: 暂不处理
  Courses?: any;
}

export interface WorkoutListType {
  // TODO: 暂不处理
  Workout?: WorkoutType[];
}

export interface WorkoutType {
  Name?: string;
  Step?: AbstractStepType;
  ScheduledOn?: string;
  Notes?: string;
  Creator?: AbstractSourceType;
  Extensions?: ExtensionsType;
}

export interface AbstractSourceType {
  Name?: string;
}

export interface AbstractStepType {
  StepId?: string;
}

export interface CourseListType {
  // TODO: 暂不处理
  Course?: CourseType[];
}

export interface CourseType {
  Name?: string;
  Lap?: CourseLapType[];
  Track?: TrackType[];
  Notes?: string;
  CoursePoint?: CoursePointType[];
  Creator?: AbstractSourceType;
  Extensions?: ExtensionsType;
}

export interface CoursePointType {
  Name?: string;
  Time?: number;
  Position?: PositionType;
  AltitudeMeters?: number;
  PointType?: string;
  Notes?: string;
  Extensions?: ExtensionsType;
}

export interface CourseLapType {
  TotalTimeSeconds?: number;
  DistanceMeters?: number;
  BeginPosition?: PositionType;
  BeginAltitudeMeters?: number;
  EndPosition?: PositionType;
  EndAltitudeMeters?: number;
  AverageHeartRateBpm?: number;
  MaximumHeartRateBpm?: number;
  Intensity?: IntensityType;
  Cadence?: CadenceType;
  Extensions?: ExtensionsType;
}

export interface HistoryType {
  Running?: HistoryFolderType;
  Biking?: HistoryFolderType;
  Other?: HistoryFolderType;
  MultiSport?: HistoryFolderType;
  Extensions?: ExtensionsType;
}

export interface HistoryFolderType {
  Folder?: HistoryFolderType;
  ActivityRef?: ActivityRefType;
  Week?: WeekType;
  Notes?: string;
  Extensions?: any;
}

export interface ActivityRefType {
  Id: string;
}

export interface WeekType {
  Notes?: string;
  StartDay?: string;
}

export interface ActivityListType {
  Activity?: ActivityType[];
  MultiSportSession?: MultiSportSessionType[];
}

export interface ActivityType {
  Sport?: "Other" | "Running" | "Biking";
  Id: string;
  Lap: ActivityLapType[];
  Notes?: string;
  Training?: any;
  Creator?: any;
  Extensions?: any;
}

export interface TrainingType {
  QuickWorkoutResults?: QuickWorkoutType;
  Plan?: PlanType;
  // attributes
  VirtualPartner: boolean;
}

export interface QuickWorkoutType {
  TotalTimeSeconds: number;
  DistanceMeters: number;
}

export interface PlanType {
  Name?: string;
  Extensions?: any;
  Type: "Workout" | "Course";
  IntervalWorkout: boolean;
}

export interface ActivityLapType {
  TotalTimeSeconds?: number;
  DistanceMeters?: number;
  MaximumSpeed?: number;
  Calories?: number;
  Heartratebpm?: number;
  AverageHeartRateBpm?: number;
  MaximumHeartRateBpm?: number;
  Intensity?: IntensityType;
  Cadence?: CadenceType;
  TriggerMethod?: TriggerMethodType;
  Track?: TrackType[];
  Notes?: string;
  Extensions?: any;
}

export type TriggerMethodType =
  // Manual（手动触发） Time（时间触发）Distance（距离触发） Location（位置触发）
  "Manual" | "Distance" | "Location" | "Time" | "HeartRate";
/**
 * Active（高强度）
 * Resting（低强度）
 */
export type IntensityType = "Active" | "Resting";

export interface CadenceType {
  Low: number;
  High: number;
}

export interface HeartRateInBeatsPerMinuteType {
  Value: number;
}

export interface MultiSportSessionType {
  Id?: string;
  FirstSport?: FirstSportType;
  NextSport?: NextSportType[];
  Notes?: string;
}

export interface FirstSportType {
  Activity?: ActivityType;
}
/**
 * Each sport contains an optional transition and a run.
 */
export interface NextSportType {
  Transition?: ActivityLapType;
  Activity?: ActivityType;
}

export interface TrackType {
  Trackpoint?: TrackpointType[];
}
export interface TrackpointType {
  Time?: string;
  Position?: PositionType;
  AltitudeMeters?: number;
  DistanceMeters?: number;
  HeartRateBpm?: number;
  Cadence?: CadenceType;
  SensorState?: "Present" | "Absent";
  Extensions?: any;
}

export interface PositionType {
  LatitudeDegrees?: string;
  LongitudeDegrees?: string;
}

// ============ 上下文和处理相关类型 ============

/**
 * TCX 解码上下文
 */
export interface TCXContext extends IProcessingContext {
  // IProcessingContext 已经包含了 metadata、errors、warnings、stats 等基础字段
  // 这里添加 TCX 特定的字段
  rawData?: Buffer;
  xmlContent?: string;
  tokens?: Token[];
  ast?: TokenAST;
  result?: TCXFileType;
  // TCX 特定的性能统计
  performance: {
    startTime: number;
    tokenizeTime?: number;
    astTime?: number;
    convertTime?: number;
    endTime?: number;
  };
}
