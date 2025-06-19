import { BaseSportConverter, SportContext } from "./base.js";
import { TokenAST } from "../types.js";
import {
  SportFileType,
  SportPointType,
  SportRouteSegType,
  SportTrackType,
} from "../types.js";
import { GPX11Type, WptType } from "../GPX/types.js";
import { FITFileType, RecordMesgType, LapMesgType } from "../FIT/types.js";
import { TCXFileType, TrackpointType } from "../TCX/types.js";
import { semicirclesToDegrees, convertGPXExtensionsMapping } from "../util.js";
import dayjs from "dayjs";

/**
 * Simple mathematical rounding function
 */
function round(value: number, precision: number = 0): number {
  const factor = Math.pow(10, precision);
  return Math.round(value * factor) / factor;
}

// ============ GPX Converter ============

/**
 * GPX to SportFileType converter
 */
export class GPXToSportConverter extends BaseSportConverter {
  name = "gpx-to-sport-converter";
  supportedTags = ["gpx"];

  convert(ast: TokenAST, context: SportContext): SportFileType | undefined {
    if (context.sourceFormat !== "gpx") return undefined;

    const gpx = context.sourceData as GPX11Type;
    return this.convertGPX(gpx);
  }

  private convertGPX(gpx: GPX11Type): SportFileType {
    const obj: SportFileType = {
      metadata: {
        originType: "GPX",
        creator: gpx.creator,
        fileType: "gpx",
      },
    };

    if (gpx.wpt) {
      obj.points = this.convertWpts2Points(gpx.wpt);
    }

    // Convert tracks
    if (gpx.trk) {
      obj.tracks = gpx.trk.map((track) => ({
        name: track.name,
        trackseg:
          track.trkseg?.map((seg) => ({
            name: track.name,
            points: seg.trkpt ? this.convertWpts2Points(seg.trkpt) : [],
          })) || [],
      }));
    }

    // Convert routes
    if (gpx.rte) {
      obj.routes = gpx.rte.map((route) => ({
        name: route.name,
        points: route.rtept ? this.convertWpts2Points(route.rtept) : [],
      }));
    }

    return obj;
  }

  protected convertPoint(point: WptType): SportPointType | undefined {
    if (
      point.lat == null ||
      point.lon == null
      // || typeof point.lat !== "number"
      // || typeof point.lon !== "number"
    ) {
      return undefined;
    }

    const { extensions } = point;
    const gpxExtensions = extensions
      ? this.convertGPXExtensions(extensions)
      : {};

    return {
      lat: point.lat,
      lon: point.lon,
      ele: point.ele,
      time: this.convertTime(point.time),
      ...gpxExtensions,
    };
  }

  private convertWpts2Points(wpts: WptType[]): SportPointType[] {
    const points: SportPointType[] = [];
    for (let i = 0; i < wpts.length; i++) {
      const wpt = wpts[i];
      if (
        wpt.lat != null &&
        wpt.lon != null
        //
        // 增加容错，如果不是 number 类型也能进行转换
        //  && typeof wpt.lat === "number"
        // &&  typeof wpt.lon === "number"
      ) {
        const point = this.convertPoint(wpt);
        if (point) points.push(point);
      }
    }
    return points;
  }

  private convertGPXExtensions = (extensions: any): Record<string, any> => {
    let res: Record<string, any> = {};
    Object.entries(extensions).forEach(([key, value]) => {
      if (typeof value !== "string" && typeof value !== "number") {
        res = { ...res, ...this.convertGPXExtensions(value) };
      } else if (typeof value !== "undefined" && value !== "undefined") {
        const resultKey =
          (convertGPXExtensionsMapping as Record<string, string>)[key] || key;
        res[resultKey] = value;
      }
    });
    return res;
  };
}

// ============ FIT Converter ============

/**
 * FIT to SportFileType converter
 */
export class FITToSportConverter extends BaseSportConverter {
  name = "fit-to-sport-converter";
  supportedTags = ["fit"];

  convert(ast: TokenAST, context: SportContext): SportFileType | undefined {
    if (context.sourceFormat !== "fit") return undefined;

    const fit = context.sourceData as FITFileType;
    return this.convertFIT(fit);
  }

  private convertFIT(fit: FITFileType): SportFileType {
    const obj: SportFileType = {
      metadata: {
        originType: "FIT",
        fileType: "fit",
      },
    };

    if (fit.sessionMesgs?.length) {
      obj.tracks = [];
      for (const sessionMesg of fit.sessionMesgs) {
        obj.tracks.push({
          name: sessionMesg.event,
          startTime: sessionMesg.startTime
            ? dayjs(sessionMesg.startTime).valueOf()
            : undefined,
          distance: sessionMesg.totalDistance,
          duration: sessionMesg.totalElapsedTime,
          sport: sessionMesg.sport,
          trackseg: this.convertFITLap2Trackseg(sessionMesg?.lapMesgs),
          __fit__sessionMesgType: sessionMesg,
        });
      }
    } else if (fit.courseMesgs?.length) {
      obj.routes = [];
      for (const courseMesg of fit.courseMesgs) {
        obj.routes.push({
          name: courseMesg.event,
          points: this.convertLap2Points(courseMesg?.lapMesgs),
        });
      }
    }
    return obj;
  }

  protected convertPoint(point: RecordMesgType): SportPointType | undefined {
    const {
      positionLong,
      positionLat,
      altitude,
      timestamp,
      heartRate,
      cadence,
      distance,
      power,
      enhancedAltitude,
      enhancedSpeed,
      temperature,
      ...rest
    } = point;

    if (
      positionLong == null ||
      positionLat == null
      // ||
      // typeof positionLong !== "number" ||
      // typeof positionLat !== "number"
    ) {
      return undefined;
    }

    return {
      lat: round(semicirclesToDegrees(Number(positionLat)), 6),
      lon: round(semicirclesToDegrees(Number(positionLong)), 6),
      ele: altitude,
      heart: heartRate,
      power: power,
      cadence: cadence,
      temperature: temperature,
      time: timestamp ? dayjs(timestamp).valueOf() : undefined,
      ...rest,
    };
  }

  private convertFITLap2Trackseg(laps?: LapMesgType[]): SportRouteSegType[] {
    const routeSeg: SportRouteSegType[] = [];
    if (!laps?.length) return [];

    for (const lap of laps) {
      const points =
        lap?.recordMesgs
          ?.map((record) => this.convertPoint(record))
          .filter((point): point is SportPointType => point !== undefined) ||
        [];
      routeSeg.push({
        points: points,
        duration: lap.totalElapsedTime,
        distance: lap.totalDistance,
        startTime: lap.startTime ? dayjs(lap.startTime).valueOf() : undefined,
        endTime:
          lap.startTime && lap.totalElapsedTime
            ? dayjs(lap.startTime).add(lap.totalElapsedTime, "second").valueOf()
            : undefined,
        avgSpeed: lap.avgSpeed,
        maxSpeed: lap.maxSpeed,
        avgCadenceBpm: lap.avgCadence,
        maxCadenceBpm: lap.maxCadence,
        avgPower: lap.avgPower,
        maxPower: lap.maxPower,
        totalAscent: lap.totalAscent,
        totalDescent: lap.totalDescent,
        calories: lap.totalCalories,
        __fit__lapMesgType: lap,
      });
    }
    return routeSeg;
  }

  private convertLap2Points(laps?: LapMesgType[]): SportPointType[] {
    let res: SportPointType[] = [];
    if (!laps?.length) return [];

    for (const lap of laps) {
      const points =
        lap.recordMesgs
          ?.map((record) => this.convertPoint(record))
          .filter((point): point is SportPointType => point !== undefined) ||
        [];
      if (points.length) {
        res = [...res, ...points];
      }
    }
    return res;
  }
}

// ============ TCX Converter ============

/**
 * TCX to SportFileType converter
 */
export class TCXToSportConverter extends BaseSportConverter {
  name = "tcx-to-sport-converter";
  supportedTags = ["tcx"];

  convert(ast: TokenAST, context: SportContext): SportFileType | undefined {
    if (context.sourceFormat !== "tcx") return undefined;

    const tcx = context.sourceData as TCXFileType;
    return this.convertTCX(tcx);
  }

  private convertTCX(tcx: TCXFileType): SportFileType {
    const obj: SportFileType = {
      metadata: {
        originType: "TCX",
        fileType: "tcx",
      },
    };

    if (tcx.Activities?.Activity?.length) {
      obj.tracks = [];
      for (const activity of tcx.Activities.Activity) {
        obj.tracks.push({
          name: activity.Id,
          sport: activity.Sport,
          trackseg: this.convertLap2Trackseg(activity.Lap),
        });
      }
    }

    if (tcx.Courses?.Course?.length) {
      obj.routes = [];
      for (const course of tcx.Courses.Course) {
        const tracks = course.Track || [];
        for (const track of tracks) {
          obj.routes.push({
            name: course.Name || "",
            points: this.convertTCXTrack(track),
          });
        }
      }
    }

    return obj;
  }

  protected convertPoint(point: TrackpointType): SportPointType | undefined {
    const { Position, Time, DistanceMeters, AltitudeMeters } = point;

    if (
      !Position?.LatitudeDegrees ||
      !Position?.LongitudeDegrees ||
      Position.LatitudeDegrees === "" ||
      Position.LongitudeDegrees === ""
    ) {
      return undefined;
    }

    return {
      lat: Number(Position.LatitudeDegrees),
      lon: Number(Position.LongitudeDegrees),
      time: Time ? dayjs(Time).valueOf() : undefined,
      distance: DistanceMeters,
      ele: AltitudeMeters,
    };
  }

  private convertLap2Trackseg(laps: any[]): SportRouteSegType[] {
    const routeSeg: SportRouteSegType[] = [];
    for (const lap of laps) {
      if (lap.Track) {
        for (const track of lap.Track) {
          if (track.Trackpoint) {
            const points = track.Trackpoint.map((trackpoint: TrackpointType) =>
              this.convertPoint(trackpoint)
            ).filter(
              (point: SportPointType | undefined): point is SportPointType =>
                point !== undefined
            );

            const seg: SportRouteSegType = {
              duration: lap.TotalTimeSeconds,
              distance: lap.DistanceMeters,
              startTime: points?.[0]?.time,
              endTime: points?.[points.length - 1]?.time,
              avgHeartRateBpm: lap?.AverageHeartRateBpm,
              maxHeartRateBpm: lap?.MaximumHeartRateBpm,
              maxSpeed: lap.MaximumSpeed,
              calories: lap.Calories,
              __tcx__Intensity: lap?.Intensity,
              __tcx__TriggerMethod: lap?.TriggerMethod,
              avgCadenceBpm: lap?.Cadence?.Low,
              maxCadenceBpm: lap?.Cadence?.High,
              points: points,
            };
            routeSeg.push(seg);
          }
        }
      }
    }
    return routeSeg;
  }

  private convertTCXTrack(track: any): SportPointType[] {
    if (!track.Trackpoint) return [];

    return track.Trackpoint.map((trackpoint: TrackpointType) =>
      this.convertPoint(trackpoint)
    ).filter(
      (point: SportPointType | undefined): point is SportPointType =>
        point !== undefined
    );
  }
}
