import { BaseActivityConverter, ActivityContext } from "./base.js";
import { FileType, TokenAST } from "../types.js";
import { ActivityType, ActivityRecordType, ActivityLapType } from "../types.js";
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
 * GPX to Activity converter
 */
export class GPXToActivityConverter extends BaseActivityConverter {
  name = "gpx-to-activity-converter";
  supportedTags = ["gpx"];

  convert(ast: TokenAST, context: ActivityContext): FileType | undefined {
    if (context.sourceFormat !== "gpx") return undefined;

    const gpx = context.sourceData as GPX11Type;
    return this.convertGPX(gpx);
  }

  private convertGPX(gpx: GPX11Type): FileType {
    const obj: FileType = {
      metadata: {
        originType: "GPX",
        fileType: "gpx",
      },
      activities: [],
    };

    if (gpx.wpt) {
      obj.points = this.convertWpts2Points(gpx.wpt);
    }

    // Convert tracks
    if (gpx.trk) {
      obj.activities = gpx.trk.map((track, trackIndex) => ({
        index: trackIndex,
        name: track.name,
        laps:
          track.trkseg?.map((seg, segIndex) => ({
            index: segIndex,
            name: track.name,
            records: seg.trkpt ? this.convertWpts2Points(seg.trkpt) : [],
          })) || [],
      }));
    }

    // Convert routes
    if (gpx.rte) {
      obj.routes = gpx.rte.map((route, index) => ({
        index,
        name: route.name,
        records: route.rtept ? this.convertWpts2Points(route.rtept) : [],
      }));
    }

    return obj;
  }

  protected convertPoint(
    point: WptType,
    idx?: number
  ): ActivityRecordType | undefined {
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
      index: idx || 0,
      lat: point.lat,
      lon: point.lon,
      altitude: point.ele,
      heart_rate: point?.heartRate,
      speed: point?.speed,
      power: point?.power,
      cadence: point?.cadence,
      timestamp: this.convertTime(point.time),
      ...gpxExtensions,
    };
  }

  private convertWpts2Points(wpts: WptType[]): ActivityRecordType[] {
    const points: ActivityRecordType[] = [];
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
        const point = this.convertPoint(wpt, i);
        if (point) points.push(point);
      }
    }
    return points;
  }

  private convertGPXExtensions = (extensions: any): Record<string, any> => {
    let res: Record<string, any> = {};
    Object.entries(extensions).forEach(([key, value]) => {
      if (typeof value !== "undefined" && value !== "undefined") {
        const resultKey =
          (convertGPXExtensionsMapping as Record<string, string>)[key] || key;
        res[resultKey] = this.autoNumber(value);
      }
    });
    return res;
  };

  private autoNumber(val: any) {
    if (typeof val === "string" && val.trim() !== "" && !isNaN(val as any)) {
      return Number(val);
    }
    return val;
  }
}

// ============ FIT Converter ============

/**
 * FIT to ActivityType converter
 */
export class FITToActivityConverter extends BaseActivityConverter {
  name = "fit-to-activity-converter";
  supportedTags = ["fit"];

  convert(ast: TokenAST, context: ActivityContext): FileType | undefined {
    if (context.sourceFormat !== "fit") return undefined;

    const fit = context.sourceData as FITFileType;
    return this.convertFIT(fit);
  }

  private convertFIT(fit: FITFileType): FileType {
    const obj: FileType = {
      metadata: {
        originType: "FIT",
        fileType: "fit",
      },
      activities: [],
    };

    if (fit.sessionMesgs?.length) {
      obj.activities = fit.sessionMesgs.map((sessionMesg, index) => ({
        index,
        name: sessionMesg.event,
        sport_type: sessionMesg.sport,
        description: sessionMesg.subActivity,
        timestamp: sessionMesg.timestamp
          ? dayjs(sessionMesg.timestamp).valueOf()
          : undefined,
        start_time: sessionMesg.startTime
          ? dayjs(sessionMesg.startTime).valueOf()
          : undefined,
        start_lat: sessionMesg.startPositionLat,
        start_lon: sessionMesg.startPositionLong,
        total_timer_time: sessionMesg.totalTimerTime,
        total_elapsed_time: sessionMesg.totalElapsedTime,
        total_distance: sessionMesg.totalDistance,
        total_ascent: sessionMesg.totalAscent,
        total_descent: sessionMesg.totalDescent,
        total_cycles: sessionMesg.totalCycles,
        total_work: sessionMesg.totalWork,
        total_strokes: sessionMesg.totalStrokes,
        avg_speed: sessionMesg.avgSpeed || sessionMesg.enhancedAvgSpeed,
        max_speed: sessionMesg.maxSpeed || sessionMesg.enhancedMaxSpeed,
        avg_power: sessionMesg.avgPower,
        max_power: sessionMesg.maxPower,
        normalized_power: sessionMesg.normalizedPower,
        threshold_power: sessionMesg.thresholdPower,
        avg_cadence: sessionMesg.avgCadence,
        max_cadence: sessionMesg.maxCadence,
        TTS: sessionMesg.trainingStressScore,
        IF: sessionMesg.intensityFactor,
        total_calories: sessionMesg.totalCalories,
        total_fat_calories: sessionMesg.totalFatCalories,
        laps: this.convertFITLap2Trackseg(sessionMesg?.lapMesgs),
      }));
    } else if (fit.courseMesgs?.length) {
      obj.routes = fit.courseMesgs.map((courseMesg, index) => ({
        index,
        name: courseMesg.event,
        records: this.convertLap2Points(courseMesg?.lapMesgs),
      }));
    }
    return obj;
  }

  protected convertPoint(
    point: RecordMesgType,
    idx?: number
  ): ActivityRecordType | undefined {
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
      speed,
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
      index: idx || 0,
      lat: round(semicirclesToDegrees(Number(positionLat)), 6),
      lon: round(semicirclesToDegrees(Number(positionLong)), 6),
      altitude: altitude || enhancedAltitude,
      distance: distance,
      speed: speed || enhancedSpeed,
      heart_rate: heartRate,
      power: power,
      cadence: cadence,
      temperature: temperature,
      timestamp: timestamp ? dayjs(timestamp).valueOf() : undefined,
      ...rest,
    };
  }

  private convertFITLap2Trackseg(laps?: LapMesgType[]): ActivityLapType[] {
    const routeSeg: ActivityLapType[] = [];
    if (!laps?.length) return [];

    for (const lap of laps) {
      const points =
        lap?.recordMesgs
          ?.map((record, idx) => this.convertPoint(record, idx))
          .filter(
            (point): point is ActivityRecordType => point !== undefined
          ) || [];
      routeSeg.push({
        index: routeSeg.length,
        name: lap.event,
        sport_type: lap.sport,
        timestamp: lap.timestamp ? dayjs(lap.timestamp).valueOf() : undefined,
        start_time: lap.startTime ? dayjs(lap.startTime).valueOf() : undefined,
        end_time:
          lap.startTime && lap.totalElapsedTime
            ? dayjs(lap.startTime).add(lap.totalElapsedTime, "second").valueOf()
            : undefined,
        start_lat: lap.startPositionLat,
        start_lon: lap.startPositionLong,
        end_lat: lap.endPositionLat,
        end_lon: lap.endPositionLong,
        total_timer_time: lap.totalTimerTime,
        total_elapsed_time: lap.totalElapsedTime,
        total_distance: lap.totalDistance,
        total_ascent: lap.totalAscent,
        total_descent: lap.totalDescent,
        total_cycles: lap.totalCycles,
        total_work: lap.totalWork,
        total_strokes: lap.totalStrokes,
        avg_speed: lap.avgSpeed || lap.enhancedAvgSpeed,
        max_speed: lap.maxSpeed || lap.enhancedMaxSpeed,
        avg_power: lap.avgPower,
        max_power: lap.maxPower,
        normalized_power: lap.normalizedPower,
        avg_cadence: lap.avgCadence,
        max_cadence: lap.maxCadence,
        total_calories: lap.totalCalories,
        total_fat_calories: lap.totalFatCalories,
        records: points,
      });
    }
    return routeSeg;
  }

  private convertLap2Points(laps?: LapMesgType[]): ActivityRecordType[] {
    let res: ActivityRecordType[] = [];
    if (!laps?.length) return [];

    for (const lap of laps) {
      const points =
        lap.recordMesgs
          ?.map((record, idx) => this.convertPoint(record, idx))
          .filter(
            (point): point is ActivityRecordType => point !== undefined
          ) || [];
      if (points.length) {
        res = [...res, ...points];
      }
    }
    return res;
  }
}

// ============ TCX Converter ============

/**
 * TCX to ActivityType converter
 */
export class TCXToActivityConverter extends BaseActivityConverter {
  name = "tcx-to-activity-converter";
  supportedTags = ["tcx"];

  convert(ast: TokenAST, context: ActivityContext): FileType | undefined {
    if (context.sourceFormat !== "tcx") return undefined;

    const tcx = context.sourceData as TCXFileType;
    return this.convertTCX(tcx);
  }

  private convertTCX(tcx: TCXFileType): FileType {
    const obj: FileType = {
      metadata: {
        originType: "TCX",
        fileType: "tcx",
      },
      activities: [],
    };

    if (tcx.Activities?.Activity?.length) {
      obj.activities = tcx.Activities.Activity.map((activity, index) => ({
        index,
        name: activity.Id,
        start_time: activity.Id ? dayjs(activity.Id).valueOf() : undefined,
        sport_type: activity.Activity,
        laps: this.convertLap2Trackseg(activity.Lap),
      }));
    }

    if (tcx.Courses?.Course?.length) {
      obj.routes = [];
      for (const course of tcx.Courses.Course) {
        const tracks = course.Track || [];
        for (const track of tracks) {
          obj.routes.push({
            index: obj.routes.length,
            name: course.Name || "",
            records: this.convertTCXTrack(track),
          });
        }
      }
    }

    return obj;
  }

  protected convertPoint(
    point: TrackpointType,
    idx?: number
  ): ActivityRecordType | undefined {
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
      index: idx || 0,
      lat: Number(Position.LatitudeDegrees),
      lon: Number(Position.LongitudeDegrees),
      timestamp: Time ? dayjs(Time).valueOf() : undefined,
      distance: DistanceMeters,
      altitude: AltitudeMeters,
    };
  }

  private convertLap2Trackseg(laps: any[]): ActivityLapType[] {
    const routeSeg: ActivityLapType[] = [];
    for (const lap of laps) {
      if (lap.Track) {
        for (const track of lap.Track) {
          if (track.Trackpoint) {
            const points = track.Trackpoint.map(
              (trackpoint: TrackpointType, idx: number) =>
                this.convertPoint(trackpoint, idx)
            ).filter(
              (
                point: ActivityRecordType | undefined
              ): point is ActivityRecordType => point !== undefined
            );

            const seg: ActivityLapType = {
              index: routeSeg.length,
              total_elapsed_time: lap.TotalTimeSeconds,
              total_distance: lap.DistanceMeters,
              start_time: points?.[0]?.timestamp,
              end_time: points?.[points.length - 1]?.timestamp,

              max_speed: lap.MaximumSpeed,
              total_calories: lap.Calories,
              avg_cadence: lap?.Cadence?.Low,
              max_cadence: lap?.Cadence?.High,
              records: points,
            };
            routeSeg.push(seg);
          }
        }
      }
    }
    return routeSeg;
  }

  private convertTCXTrack(track: any): ActivityRecordType[] {
    if (!track.Trackpoint) return [];

    return track.Trackpoint.map((trackpoint: TrackpointType, idx: number) =>
      this.convertPoint(trackpoint, idx)
    ).filter(
      (point: ActivityRecordType | undefined): point is ActivityRecordType =>
        point !== undefined
    );
  }
}
