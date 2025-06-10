import { BaseSportEncoder, SportEncodingContext } from "./base.js";
import {
  SportFileType,
  SportPointType,
  SportRouteSegType,
  SportTrackType,
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
  ActivityType,
  ActivityLapType,
  TrackType,
  TrackpointType,
  CourseType,
} from "../TCX/types.js";

/**
 * Convert degrees to semicircles (for FIT format)
 */
function degreesToSemicircles(degrees: number): number {
  return Math.round(degrees * (Math.pow(2, 31) / 180));
}

// ============ GPX Encoder ============

/**
 * SportFileType to GPX encoder
 */
export class SportToGPXEncoder extends BaseSportEncoder {
  name = "sport-to-gpx-encoder";
  supportedTags = ["gpx"];

  encode(
    sportData: SportFileType,
    context: SportEncodingContext
  ): GPX11Type | undefined {
    if (context.targetFormat !== "gpx") return undefined;

    const gpx: GPX11Type = {
      version: "1.1",
      creator: sportData.metadata?.creator || "TrackSwap",
    };

    // Convert waypoints
    if (sportData.points?.length) {
      gpx.wpt = this.convertPoints2Wpts(sportData.points);
    }

    // Convert routes
    if (sportData.routes?.length) {
      gpx.rte = sportData.routes.map((route) =>
        this.convertRoute2GPXRoute(route)
      );
    }

    // Convert tracks
    if (sportData.tracks?.length) {
      gpx.trk = sportData.tracks.map((track) =>
        this.convertTrack2GPXTrack(track)
      );
    }

    return gpx;
  }

  private convertPoints2Wpts(points: SportPointType[]): WptType[] {
    return points.map((point) => ({
      lat: point.lat,
      lon: point.lon,
      ele: point.ele,
      time: point.time ? this.convertTimeToDate(point.time) : undefined,
      speed: point.speed,
      magvar: point.magvar,
      extensions: this.extractGPXExtensions(point),
    }));
  }

  private convertRoute2GPXRoute(route: SportRouteSegType): RteType {
    return {
      name: route.name,
      rtept: route.points ? this.convertPoints2Wpts(route.points) : [],
    };
  }

  private convertTrack2GPXTrack(track: SportTrackType): TrkType {
    return {
      name: track.name,
      trkseg:
        track.trackseg?.map((seg) => ({
          trkpt: seg.points ? this.convertPoints2Wpts(seg.points) : [],
        })) || [],
    };
  }

  private extractGPXExtensions(point: SportPointType): any {
    const extensions: any = {};

    // Extract heart rate data
    if (point.heart) {
      extensions["gpxtpx:hr"] = point.heart;
    }

    // Extract cadence data
    if (point.cadence) {
      extensions["gpxtpx:cad"] = point.cadence;
    }

    // Extract temperature data
    if (point.temperature) {
      extensions["gpxtpx:atemp"] = point.temperature;
    }

    return Object.keys(extensions).length > 0 ? extensions : undefined;
  }
}

// ============ FIT Encoder ============

/**
 * SportFileType to FIT encoder
 */
export class SportToFITEncoder extends BaseSportEncoder {
  name = "sport-to-fit-encoder";
  supportedTags = ["fit"];

  encode(
    sportData: SportFileType,
    context: SportEncodingContext
  ): FITFileType | undefined {
    if (context.targetFormat !== "fit") return undefined;

    const fit: FITFileType = {};

    // Convert tracks to sessionMesgs
    if (sportData.tracks?.length) {
      fit.sessionMesgs = sportData.tracks.map((track) =>
        this.convertTrack2FITSession(track)
      );
    }

    // Convert routes to courseMesgs (currently using any[] type)
    if (sportData.routes?.length) {
      fit.courseMesgs = sportData.routes.map((route) =>
        this.convertRoute2FITCourse(route)
      );
    }

    return fit;
  }

  private convertTrack2FITSession(track: SportTrackType): SessionMesgType {
    const session: SessionMesgType = {
      event: track.name || "session",
      sport: track.sport || "generic",
      startTime: track.startTime
        ? this.convertTimeToString(track.startTime)
        : this.convertTimeToString(undefined),
      totalDistance: track.distance,
      totalElapsedTime: track.duration,
      lapMesgs: track.trackseg?.map((seg) => this.convertSeg2FITLap(seg)) || [],
    };

    return session;
  }

  private convertSeg2FITLap(seg: SportRouteSegType): LapMesgType {
    const lap: LapMesgType = {
      startTime: seg.startTime
        ? this.convertTimeToString(seg.startTime)
        : this.convertTimeToString(undefined),
      totalElapsedTime: seg.duration,
      totalDistance: seg.distance,
      avgSpeed: seg.avgSpeed,
      maxSpeed: seg.maxSpeed,
      avgCadence: seg.avgCadenceBpm,
      maxCadence: seg.maxCadenceBpm,
      avgPower: seg.avgPower,
      maxPower: seg.maxPower,
      totalAscent: seg.totalAscent,
      totalDescent: seg.totalDescent,
      totalCalories: seg.calories,
      recordMesgs:
        seg.points?.map((point) => this.convertPoint2FITRecord(point)) || [],
    };

    return lap;
  }

  private convertPoint2FITRecord(point: SportPointType): RecordMesgType {
    return {
      timestamp: point.time
        ? this.convertTimeToString(point.time)
        : this.convertTimeToString(undefined),
      positionLat: degreesToSemicircles(point.lat),
      positionLong: degreesToSemicircles(point.lon),
      altitude: point.ele,
      speed: point.speed,
      power: point.power,
      heartRate: point.heart,
      cadence: point.cadence,
      temperature: point.temperature,
      distance: point.distance,
      enhancedSpeed: point.enhancedSpeed,
      enhancedAltitude: point.enhancedAltitude,
      accumulatedPower: point.accumulatedPower,
    };
  }

  private convertRoute2FITCourse(route: SportRouteSegType): any {
    return {
      event: route.name || "course",
      lapMesgs: route.points ? [this.convertPoints2FITLap(route.points)] : [],
    };
  }

  private convertPoints2FITLap(points: SportPointType[]): LapMesgType {
    // Calculate basic statistics
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];

    const startTime = firstPoint?.time
      ? this.convertTimeToString(firstPoint.time)
      : this.convertTimeToString(undefined);
    const totalElapsedTime =
      firstPoint?.time && lastPoint?.time
        ? Math.round((lastPoint.time - firstPoint.time) / 1000)
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
 * SportFileType to TCX encoder
 */
export class SportToTCXEncoder extends BaseSportEncoder {
  name = "sport-to-tcx-encoder";
  supportedTags = ["tcx"];

  encode(
    sportData: SportFileType,
    context: SportEncodingContext
  ): TCXFileType | undefined {
    if (context.targetFormat !== "tcx") return undefined;

    const tcx: TCXFileType = {
      Author: {
        Name: sportData.metadata?.creator || "TrackSwap",
      },
    };

    // Convert tracks to Activities
    if (sportData.tracks?.length) {
      tcx.Activities = {
        Activity: sportData.tracks.map((track) =>
          this.convertTrack2TCXActivity(track)
        ),
      };
    }

    // Convert routes to Courses
    if (sportData.routes?.length) {
      tcx.Courses = {
        Course: sportData.routes.map((route) =>
          this.convertRoute2TCXCourse(route)
        ),
      };
    }

    return tcx;
  }

  private convertTrack2TCXActivity(track: SportTrackType): ActivityType {
    // Ensure Sport field is the correct type
    let sport: "Other" | "Running" | "Biking" = "Other";
    if (track.sport === "Running" || track.sport === "Biking") {
      sport = track.sport;
    }

    return {
      Id: track.name || `Activity_${Date.now()}`,
      Sport: sport,
      Lap: track.trackseg?.map((seg) => this.convertSeg2TCXLap(seg)) || [],
    };
  }

  private convertSeg2TCXLap(seg: SportRouteSegType): ActivityLapType {
    const lap: ActivityLapType = {
      TotalTimeSeconds: seg.duration,
      DistanceMeters: seg.distance,
      MaximumSpeed: seg.maxSpeed,
      Calories: seg.calories,
      AverageHeartRateBpm: seg.avgHeartRateBpm,
      MaximumHeartRateBpm: seg.maxHeartRateBpm,
      Intensity: seg.__tcx__Intensity || "Active",
      TriggerMethod: seg.__tcx__TriggerMethod || "Manual",
      Track: seg.points ? [this.convertPoints2TCXTrack(seg.points)] : [],
    };

    // Add cadence information
    if (seg.avgCadenceBpm !== undefined || seg.maxCadenceBpm !== undefined) {
      lap.Cadence = {
        Low: seg.avgCadenceBpm || 0,
        High: seg.maxCadenceBpm || 0,
      };
    }

    return lap;
  }

  private convertPoints2TCXTrack(points: SportPointType[]): TrackType {
    return {
      Trackpoint: points.map((point) => this.convertPoint2TCXTrackpoint(point)),
    };
  }

  private convertPoint2TCXTrackpoint(point: SportPointType): TrackpointType {
    const trackpoint: TrackpointType = {
      Time: point.time
        ? this.convertTimeToString(point.time)
        : this.convertTimeToString(undefined),
      Position: {
        LatitudeDegrees: point.lat.toString(),
        LongitudeDegrees: point.lon.toString(),
      },
      AltitudeMeters: point.ele,
      DistanceMeters: point.distance,
    };

    // Handle heart rate data
    if (point.heart) {
      trackpoint.HeartRateBpm = point.heart;
    }

    return trackpoint;
  }

  private convertRoute2TCXCourse(route: SportRouteSegType): CourseType {
    return {
      Name: route.name || `Course_${Date.now()}`,
      Track: route.points ? [this.convertPoints2TCXTrack(route.points)] : [],
    };
  }
}
