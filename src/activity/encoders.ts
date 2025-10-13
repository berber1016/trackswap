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
        time: firstActivity.timestamp,
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
      ?.filter((v) => v.timestamp)
      .map((point) => ({
        lat: point?.positionLat,
        lon: point?.positionLong,
        ele: point?.altitude,
        time: point?.timestamp,
        speed: point?.speed,
        hdop: point?.hdop,
        vdop: point?.vdop,
        pdop: point?.pdop,
        extensions: this.extractGPXExtensions(point),
      }));
  }

  private convertRoute2GPXRoute(route: ActivityLapType): RteType {
    return {
      // name
      // description
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
      // extensions
      trkseg:  activity.laps?.map((lap) => {
      return {
        trkpt: lap.records ? this.convertRecords2Wpts(lap.records) : [],
      };
    }) || []
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
    if (typeof point?.heartRate != "undefined") {
      trackPointData["gpxtpx:hr"] = point.heartRate;
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
    // TODO: 解析 routes
    // fit.courseMesgs = file.routes?.map((route) =>
    //   this.convertRoute2FITCourse(route)
    // );
    // Convert activity to sessionMesg
    fit.sessionMesgs = file.activities?.map((activity) =>
      this.convertActivity2FITSession(activity)
    );

    return fit;
  }

  private convertActivity2FITSession(activity: ActivityType): SessionMesgType {
    const session: SessionMesgType = {
      ...activity,
      event: activity?.event || "session",
      sport: activity?.sport || "generic",

      lapMesgs: activity.laps?.map((lap) => this.convertLap2FITLap(lap)) || [],
    };

    return session;
  }

  private convertLap2FITLap(lap: ActivityLapType): LapMesgType {
    const lapMesg: LapMesgType = {
      startTime: lap.startTime,
      ...lap,
      recordMesgs: lap.records?.map((point) => this.convertPoint2FITRecord(point)) || [],
    };

    return lapMesg;
  }

  private convertPoint2FITRecord(point: ActivityRecordType): RecordMesgType {
    return point;
  }

  // private convertRoute2FITCourse(route: ActivityLapType): any {
  //   return {
  //     event: route.name || "course",
  //     lapMesgs: route.records ? [this.convertPoints2FITLap(route.records)] : [],
  //   };
  // }

  // private convertPoints2FITLap(points: ActivityRecordType[]): LapMesgType {
  //   // Calculate basic statistics
  //   const firstPoint = points[0];
  //   const lastPoint = points[points.length - 1];

  //   const startTime = firstPoint?.timestamp
  //     ? this.convertTimeToString(firstPoint.timestamp)
  //     : this.convertTimeToString(undefined);
  //   const totalElapsedTime =
  //     firstPoint?.timestamp && lastPoint?.timestamp
  //       ? Math.round((lastPoint.timestamp - firstPoint.timestamp) / 1000)
  //       : 0;

  //   // Calculate total distance (if points have distance information)
  //   const totalDistance = lastPoint?.distance || 0;

  //   return {
  //     startTime: startTime,
  //     totalElapsedTime: totalElapsedTime,
  //     totalDistance: totalDistance,
  //     recordMesgs: points.map((point) => this.convertPoint2FITRecord(point)),
  //   };
  // }
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
    if (activity.sport === "Running" || activity.sport === "Biking") {
      sport = activity.sport as "Running" | "Biking";
    }

    return {
      Id: `Activity_${Date.now()}`,
      Activity: sport,
      Lap: activity.laps?.map((lap) => this.convertLap2TCXLap(lap)) || [],
    };
  }

  private convertLap2TCXLap(lap: ActivityLapType): TCXActivityLapType {
    const tcxLap: TCXActivityLapType = {
      TotalTimeSeconds: lap.totalElapsedTime,
      DistanceMeters: lap.totalDistance,
      MaximumSpeed: lap.maxSpeed,
      Calories: lap.totalCalories,
      AverageHeartRateBpm: lap.avgHeartRate,
      MaximumHeartRateBpm: lap.maxHeartRate,
      Intensity: "Active",
      TriggerMethod: "Manual",
      Track: lap.records ? [this.convertRecords2TCXTrack(lap.records)] : [],
    };

    // Add cadence information
    if (lap.avgCadence !== undefined || lap.maxCadence !== undefined) {
      tcxLap.Cadence = {
        Low: lap.avgCadence || 0,
        High: lap.maxCadence || 0,
      };
    }

    return tcxLap;
  }

  /**
   * 将 ActivityPoint 转为 TCX TrackpointType
   * @param records 
   * @returns 
   */
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
      Time: dayjs(point.timestamp).toISOString(),
      Position: {
        LatitudeDegrees: point?.positionLat?.toString(),
        LongitudeDegrees: point?.positionLong?.toString(),
      },
      AltitudeMeters: point.altitude,
      DistanceMeters: point.distance,
    };

    // Handle heart rate data
    if (point.heartRate) {
      trackpoint.HeartRateBpm = point.heartRate;
    }

    // Handle cadence data
    if (point.cadence) {
      trackpoint.Cadence = {
        Low: point.cadence,
        High: point.cadence256 || point.cadence,
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
      Name: `Course_${Date.now()}`,
      Track: route.records ? [this.convertRecords2TCXTrack(route.records)] : [],
    };
  }
}
