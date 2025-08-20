import { ExtensionsType, Token, TokenAST } from "../types.js";
import { IProcessingContext } from "../core/base.js";

/**
 * TCX file type
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
  // TODO: not implemented yet
  Workouts?: WorkoutListType;
  // TODO: not implemented yet
  Courses?: any;
}

export interface WorkoutListType {
  // TODO: not implemented yet
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
  // TODO: not implemented yet
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
  MultiActivity?: HistoryFolderType;
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
  MultiActivitySession?: MultiActivitySessionType[];
}

export interface ActivityType {
  Activity?: "Other" | "Running" | "Biking";
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
  // Manual (manual trigger) Time (time trigger) Distance (distance trigger) Location (location trigger)
  "Manual" | "Distance" | "Location" | "Time" | "HeartRate";
/**
 * Active (high intensity)
 * Resting (low intensity)
 */
export type IntensityType = "Active" | "Resting";

export interface CadenceType {
  Low: number;
  High: number;
}

export interface HeartRateInBeatsPerMinuteType {
  Value: number;
}

export interface MultiActivitySessionType {
  Id?: string;
  FirstActivity?: FirstActivityType;
  NextActivity?: NextActivityType[];
  Notes?: string;
}

export interface FirstActivityType {
  Activity?: ActivityType;
}
/**
 * Each sport contains an optional transition and a run.
 */
export interface NextActivityType {
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

/**
 * TCX processing context
 */
export interface TCXContext extends IProcessingContext {
  // IProcessingContext already includes basic fields like metadata, errors, warnings, stats, etc.
  // Here we add TCX-specific fields
  rawData?: Buffer;
  xmlContent?: string;
  tokens?: Token[];
  ast?: TokenAST;
  result?: TCXFileType;
  // TCX-specific performance statistics
  performance: {
    startTime: number;
    tokenizeTime?: number;
    astTime?: number;
    convertTime?: number;
    endTime?: number;
    processingTime?: number;
  };
}
