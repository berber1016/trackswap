import { BaseActivityEncoder, ActivityEncodingContext } from "./base.js";
import {
  ActivityType,
  ActivityRecordType,
  ActivityLapType,
  FileType,
} from "../types.js";
import {
  GPX11Type,
  TrkType,
  TrksegType,
  WptType,
  RteType,
} from "../GPX/types.js";
import {
  FITFileType,
  SessionMesgType,
  LapMesgType,
  RecordMesgType,
} from "../FIT/types.js";
import {
  TCXFileType,
  ActivityType as TCXActivityType,
  ActivityLapType as TCXActivityLapType,
  TrackType,
  TrackpointType,
  CourseType,
} from "../TCX/types.js";
import dayjs from "dayjs";

/**
 * Convert degrees to semicircles (for FIT format)
 */
function degreesToSemicircles(degrees: number): number {
  return Math.round(degrees * (Math.pow(2, 31) / 180));
}

// ============ GPX Encoder ============

/**
 * ActivityType to GPX encoder
 */
export class ActivityToGPXEncoder extends BaseActivityEncoder {
  name = "activity-to-gpx-encoder";
  supportedTags = ["gpx"];

  encode(
    file: FileType,
    context: ActivityEncodingContext
  ): GPX11Type | undefined {
    if (context.targetFormat !== "gpx") return undefined;
    if (!file?.activities?.length) return undefined;

    const firstActivity = file.activities?.[0]; // Use first activity

    const gpx: GPX11Type = {
      version: "1.1",
      creator: "TrackSwap",
      metadata: {
        name: firstActivity.name || "Unnamed Activity",
        desc: firstActivity.description,
        time: firstActivity.timestamp
          ? this.convertTimeToDate(firstActivity.timestamp)
          : undefined,
      },
    };

    // Convert waypoints
    if (file.points?.length) {
      gpx.wpt = this.convertRecords2Wpts(file.points);
    }

    // Convert routes
    if (file.routes?.length) {
      gpx.rte = file.routes.map((route) => this.convertRoute2GPXRoute(route));
    }

    // Convert tracks
    if (file.activities?.length) {
      gpx.trk = file.activities.map((activity) =>
        this.convertActivity2GPXTrack(activity)
      );
    }

    return gpx;
  }

  /**
   * 将 ActivityPoint 转为 GPX 的 WPT Type 与 GPX1.1 映射
   * @param points
   * @return gpx
   */
  private convertRecords2Wpts(points: ActivityRecordType[]): WptType[] {
    return points
      ?.filter((v) => !!v.lat && !!v.lon)
      .map((point) => ({
        lat: point.lat,
        lon: point.lon,
        ele: point?.altitude,
        time: point?.timestamp
          ? this.convertTimeToDate(point.timestamp)
          : undefined,
        speed: point?.speed,
        hdop: point?.hdop,
        vdop: point?.vdop,
        pdop: point?.pdop,
        extensions: this.extractGPXExtensions(point),
      }));
  }

  private convertRoute2GPXRoute(route: ActivityLapType): RteType {
    return {
      name: route?.name,
      desc: route?.description,
      rtept: route.records ? this.convertRecords2Wpts(route.records) : [],
    };
  }
  /**
   * 转换 ActivityType 到 GPX TrkType
   * @param track
   * @returns
   */
  private convertActivity2GPXTrack(activity: ActivityType): TrkType {
    return {
      name: activity?.name,
      // extensions
      trkseg:
        activity.laps?.map((lap) => ({
          trkpt: lap?.records?.length
            ? this.convertRecords2Wpts(lap.records)
            : [],
        })) || [],
    };
  }
  /**
   *
   * @param point
   * @returns
   */
  private extractGPXExtensions(point: ActivityRecordType): any {
    const extensions: any = {};

    // Extract TrackPointExtension data
    const trackPointData: any = {};
    if (typeof point?.heart_rate != "undefined") {
      trackPointData["gpxtpx:hr"] = point.heart_rate;
    }
    if (typeof point?.cadence != "undefined") {
      trackPointData["gpxtpx:cad"] = point.cadence;
    }
    if (typeof point?.temperature != "undefined") {
      trackPointData["gpxtpx:atemp"] = point.temperature;
    }

    if (Object.keys(trackPointData).length > 0) {
      extensions["gpxtpx:TrackPointExtension"] = trackPointData;
    }
    if (typeof point?.power != "undefined") {
      extensions["gpxpx:PowerExtension"] = {
        "gpxpx:PowerInWatts": point.power,
      };
    }

    return Object.keys(extensions).length > 0 ? extensions : undefined;
  }
}

// ============ FIT Encoder ============

/**
 * ActivityType to FIT encoder
 */
export class ActivityToFITEncoder extends BaseActivityEncoder {
  name = "activity-to-fit-encoder";
  supportedTags = ["fit"];

  encode(
    file: FileType,
    context: ActivityEncodingContext
  ): FITFileType | undefined {
    if (context.targetFormat !== "fit") return undefined;
    if (!file?.activities?.length) return undefined;
    const fit: FITFileType = {};
    fit.courseMesgs = file.routes?.map((route) =>
      this.convertRoute2FITCourse(route)
    );
    // Convert activity to sessionMesg
    fit.sessionMesgs = file.activities?.map((activity) =>
      this.convertActivity2FITSession(activity)
    );

    return fit;
  }

  private convertActivity2FITSession(activity: ActivityType): SessionMesgType {
    const session: SessionMesgType = {
      event: activity?.name || "session",
      sport: activity?.sport_type || "generic",
      startTime: activity.start_time
        ? this.convertTimeToString(activity.start_time)
        : this.convertTimeToString(undefined),
      totalDistance: activity.total_distance,
      totalElapsedTime: activity.total_elapsed_time,
      avgSpeed: activity.avg_speed,
      maxSpeed: activity.max_speed,
      avgPower: activity.avg_power,
      maxPower: activity.max_power,
      totalAscent: activity.total_ascent,
      totalDescent: activity.total_descent,
      totalCalories: activity.total_calories,
      lapMesgs: activity.laps?.map((lap) => this.convertLap2FITLap(lap)) || [],
    };

    return session;
  }

  private convertLap2FITLap(lap: ActivityLapType): LapMesgType {
    const lapMesg: LapMesgType = {
      startTime: lap.start_time
        ? this.convertTimeToString(lap.start_time)
        : this.convertTimeToString(undefined),
      totalElapsedTime: lap.total_elapsed_time,
      totalDistance: lap.total_distance,
      avgSpeed: lap.avg_speed,
      maxSpeed: lap.max_speed,
      avgCadence: lap.avg_cadence,
      maxCadence: lap.max_cadence,
      avgPower: lap.avg_power,
      maxPower: lap.max_power,
      totalAscent: lap.total_ascent,
      totalDescent: lap.total_descent,
      totalCalories: lap.total_calories,
      recordMesgs:
        lap.records?.map((point) => this.convertPoint2FITRecord(point)) || [],
    };

    return lapMesg;
  }

  private convertPoint2FITRecord(point: ActivityRecordType): RecordMesgType {
    return {
      timestamp: point.timestamp
        ? this.convertTimeToString(point.timestamp)
        : this.convertTimeToString(undefined),
      positionLat: point.lat ? degreesToSemicircles(point.lat) : undefined,
      positionLong: point.lon ? degreesToSemicircles(point.lon) : undefined,
      altitude: point.altitude || point.enhanced_altitude,
      speed: point.speed,
      power: point.power,
      heartRate: point.heart_rate,
      cadence: point.cadence,
      temperature: point.temperature,
      distance: point.distance,
      enhancedSpeed: point.enhanced_speed,
      enhancedAltitude: point.enhanced_altitude,
      accumulatedPower: point.accumulated_power,
    };
  }

  private convertRoute2FITCourse(route: ActivityLapType): any {
    return {
      event: route.name || "course",
      lapMesgs: route.records ? [this.convertPoints2FITLap(route.records)] : [],
    };
  }

  private convertPoints2FITLap(points: ActivityRecordType[]): LapMesgType {
    // Calculate basic statistics
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];

    const startTime = firstPoint?.timestamp
      ? this.convertTimeToString(firstPoint.timestamp)
      : this.convertTimeToString(undefined);
    const totalElapsedTime =
      firstPoint?.timestamp && lastPoint?.timestamp
        ? Math.round((lastPoint.timestamp - firstPoint.timestamp) / 1000)
        : 0;

    // Calculate total distance (if points have distance information)
    const totalDistance = lastPoint?.distance || 0;

    return {
      startTime: startTime,
      totalElapsedTime: totalElapsedTime,
      totalDistance: totalDistance,
      recordMesgs: points.map((point) => this.convertPoint2FITRecord(point)),
    };
  }
}

// ============ TCX Encoder ============

/**
 * ActivityType to TCX encoder
 */
export class ActivityToTCXEncoder extends BaseActivityEncoder {
  name = "sport-to-tcx-encoder";
  supportedTags = ["tcx"];

  encode(
    file: FileType,
    context: ActivityEncodingContext
  ): TCXFileType | undefined {
    if (context.targetFormat !== "tcx") return undefined;
    if (!file?.activities?.length) return undefined;

    const tcx: TCXFileType = {
      Author: {
        Name: "TrackSwap",
      },
    };

    // Convert activity to TCX Activity
    tcx.Activities = {
      Activity: file.activities.map((activity) =>
        this.convertActivity2TCXActivity(activity)
      ),
    };

    return tcx;
  }

  private convertActivity2TCXActivity(activity: ActivityType): TCXActivityType {
    // Ensure Activity field is the correct type
    let sport: "Other" | "Running" | "Biking" = "Other";
    if (activity.sport_type === "Running" || activity.sport_type === "Biking") {
      sport = activity.sport_type as "Running" | "Biking";
    }

    return {
      Id: activity.name || `Activity_${Date.now()}`,
      Activity: sport,
      Lap: activity.laps?.map((lap) => this.convertLap2TCXLap(lap)) || [],
    };
  }

  private convertLap2TCXLap(lap: ActivityLapType): TCXActivityLapType {
    const tcxLap: TCXActivityLapType = {
      TotalTimeSeconds: lap.total_elapsed_time,
      DistanceMeters: lap.total_distance,
      MaximumSpeed: lap.max_speed,
      Calories: lap.total_calories,
      AverageHeartRateBpm: lap.avg_heart_rate,
      MaximumHeartRateBpm: lap.max_heart_rate,
      Intensity: "Active",
      TriggerMethod: "Manual",
      Track: lap.records ? [this.convertRecords2TCXTrack(lap.records)] : [],
    };

    // Add cadence information
    if (lap.avg_cadence !== undefined || lap.max_cadence !== undefined) {
      tcxLap.Cadence = {
        Low: lap.avg_cadence || 0,
        High: lap.max_cadence || 0,
      };
    }

    return tcxLap;
  }

  private convertRecords2TCXTrack(records: ActivityRecordType[]): TrackType {
    return {
      Trackpoint: records.map((point) =>
        this.convertPoint2TCXTrackpoint(point)
      ),
    };
  }

  private convertPoint2TCXTrackpoint(
    point: ActivityRecordType
  ): TrackpointType {
    const trackpoint: TrackpointType = {
      Time: point.timestamp
        ? this.convertTimeToString(point.timestamp)
        : this.convertTimeToString(undefined),
      Position: {
        LatitudeDegrees: point.lat?.toString() || "0",
        LongitudeDegrees: point.lon?.toString() || "0",
      },
      AltitudeMeters: point.altitude || point.enhanced_altitude,
      DistanceMeters: point.distance,
    };

    // Handle heart rate data
    if (point.heart_rate) {
      trackpoint.HeartRateBpm = point.heart_rate;
    }

    // Handle cadence data
    if (point.cadence) {
      trackpoint.Cadence = {
        Low: point.cadence,
        High: point.cadence,
      };
    }

    // Handle power data
    if (point.power) {
      trackpoint.Extensions = {
        "ns3:TPX": {
          "ns3:Watts": point.power,
        },
      };
    }

    return trackpoint;
  }

  private convertRoute2TCXCourse(route: ActivityLapType): CourseType {
    return {
      Name: route.name || `Course_${Date.now()}`,
      Track: route.records ? [this.convertRecords2TCXTrack(route.records)] : [],
    };
  }
}
