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
    if (
      !file?.activities?.length &&
      !file?.routes?.length &&
      !file?.points?.length
    ) {
      return undefined;
    }

    const metaTime =
      file.activities?.[0]?.timestamp ??
      file.routes?.[0]?.records?.[0]?.timestamp ??
      file.points?.[0]?.timestamp ??
      new Date();

    const omittedNoCoords = this.countRecordsMissingGpxCoordinates(file);

    const gpx: GPX11Type = {
      version: "1.1",
      creator: "TrackSwap",
      metadata: {
        time: metaTime,
        ...(omittedNoCoords > 0
          ? {
              desc: `TrackSwap: omitted ${omittedNoCoords} trackpoint(s) without valid latitude/longitude.`,
            }
          : {}),
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

    // Convert tracks（无 Activity 时可为空）
    if (file.activities?.length) {
      gpx.trk = file.activities.map((activity) =>
        this.convertActivity2GPXTrack(activity)
      );
    }

    return gpx;
  }

  /** GPX trkpt/wpt/rtept require finite coordinates in range. */
  private hasValidGpxCoordinates(point: ActivityRecordType): boolean {
    const lat = point.positionLat;
    const lon = point.positionLong;
    return (
      typeof lat === "number" &&
      typeof lon === "number" &&
      Number.isFinite(lat) &&
      Number.isFinite(lon) &&
      lat >= -90 &&
      lat <= 90 &&
      lon >= -180 &&
      lon <= 180
    );
  }

  /** Count sample rows that have time but no usable lat/lon for GPX geometry. */
  private countRecordsMissingGpxCoordinates(file: FileType): number {
    let n = 0;
    const tally = (records?: ActivityRecordType[]) => {
      for (const r of records ?? []) {
        if (r?.timestamp == null) continue;
        if (!this.hasValidGpxCoordinates(r)) n++;
      }
    };
    tally(file.points);
    for (const act of file.activities ?? []) {
      for (const lap of act.laps ?? []) {
        tally(lap.records);
      }
    }
    for (const route of file.routes ?? []) {
      tally(route.records);
    }
    return n;
  }

  /**
   * 将 ActivityPoint 转为 GPX 的 WPT Type 与 GPX1.1 映射
   * @param points
   * @return gpx
   */
  private convertRecords2Wpts(points: ActivityRecordType[]): WptType[] {
    return (
      points
        ?.filter((v) => v.timestamp)
        ?.filter((v) => this.hasValidGpxCoordinates(v))
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
        })) ?? []
    );
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

    if (file?.activities?.length) {
      const fit: FITFileType = {};
      fit.sessionMesgs = file.activities.map((activity) =>
        this.convertActivity2FITSession(activity)
      );
      return fit;
    }

    if (file?.routes?.length) {
      const fit: FITFileType = {};
      fit.sessionMesgs = [this.convertRoutesToSyntheticSession(file.routes)];
      return fit;
    }

    return undefined;
  }

  /**
   * 仅含路线（无 session 活动）时，合成单 session + 多 lap，供活动型 FIT 编码器写入。
   */
  private convertRoutesToSyntheticSession(
    routes: ActivityLapType[]
  ): SessionMesgType {
    const lapMesgs = routes.map((lap) => this.convertLap2FITLap(lap));
    const all = routes.flatMap((r) => r.records ?? []);
    const withTime = all
      .filter(
        (r): r is ActivityRecordType & { timestamp: Date } =>
          r.timestamp != null
      )
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    const start = withTime[0]?.timestamp ?? new Date();
    const end = withTime[withTime.length - 1]?.timestamp ?? start;
    const firstCoord = withTime.find(
      (r) =>
        r.positionLat != null &&
        r.positionLong != null &&
        Number.isFinite(r.positionLat) &&
        Number.isFinite(r.positionLong)
    );
    return {
      messageIndex: 0,
      timestamp: end,
      event: "session",
      eventType: "stop",
      startTime: start,
      startPositionLat: firstCoord?.positionLat,
      startPositionLong: firstCoord?.positionLong,
      sport: "generic",
      subSport: "generic",
      lapMesgs,
    };
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
    const hasActivities = !!file?.activities?.length;
    const hasRoutes = !!file?.routes?.length;
    if (!hasActivities && !hasRoutes) return undefined;

    const tcx: TCXFileType = {
      version: "1.0",
      Author: {
        Name: "TrackSwap",
      },
    };

    if (hasActivities) {
      tcx.Activities = {
        Activity: file.activities!.map((activity) =>
          this.convertActivity2TCXActivity(activity)
        ),
      };
    }

    if (hasRoutes) {
      tcx.Courses = {
        Course: file.routes!.map((route, index) =>
          this.convertRouteToTCXCourse(route, index)
        ),
      };
    }

    return tcx;
  }

  private convertActivity2TCXActivity(activity: ActivityType): TCXActivityType {
    if (!activity.laps?.length) {
      throw new Error("Cannot encode a TCX activity without laps");
    }
    let sport: "Other" | "Running" | "Biking" = "Other";
    const normalizedSport = activity.sport?.toLowerCase();
    if (normalizedSport === "running") sport = "Running";
    if (normalizedSport === "biking" || normalizedSport === "cycling") {
      sport = "Biking";
    }
    const id = this.validTimestamp(
      activity.startTime ??
        activity.laps[0]?.startTime ??
        activity.laps[0]?.records?.[0]?.timestamp
    );

    return {
      Id: id,
      Sport: sport,
      Lap: activity.laps.map((lap) => this.convertLap2TCXLap(lap)),
    };
  }

  private convertLap2TCXLap(lap: ActivityLapType): TCXActivityLapType {
    const startTime = this.validTimestamp(
      lap.startTime ?? lap.records?.[0]?.timestamp
    );
    const tcxLap: TCXActivityLapType = {
      StartTime: startTime,
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
      Time: this.validTimestamp(point.timestamp),
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

  private validTimestamp(value: Date | string | number | undefined): string {
    const timestamp = dayjs(value);
    if (!value || !timestamp.isValid()) {
      throw new Error("Cannot encode TCX data without valid timestamps");
    }
    return timestamp.toISOString();
  }

  private convertRouteToTCXCourse(
    route: ActivityLapType,
    index: number
  ): CourseType {
    return {
      Name: route.routeName ?? `Course_${index}`,
      Track: route.records ? [this.convertRecords2TCXTrack(route.records)] : [],
    };
  }
}
