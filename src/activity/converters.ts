import { BaseActivityConverter, ActivityContext } from "./base.js";
import { ActivityLengthType, FileType, TokenAST } from "../types.js";
import { ActivityType, ActivityRecordType, ActivityLapType } from "../types.js";
import {
  GPX11Type,
  RteType,
  TrksegType,
  TrkType,
  WptType,
} from "../GPX/types.js";
import {
  FITFileType,
  RecordMesgType,
  LapMesgType,
  SessionMesgType,
} from "../FIT/types.js";
import {
  ActivityType as TCXActivityType,
  ActivityLapType as TCXActivityLapType,
  TCXFileType,
  TrackpointType,
  CourseType,
  CoursePointType,
  TrackType,
} from "../TCX/types.js";
import {
  normalizeFitSemicircleToDegrees,
  convertGPXExtensionsMapping,
} from "../util.js";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { MetricsAggregator } from "./metrics/MetricsCalculator.js";

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
      obj.activities = gpx.trk.map((trk, index) =>
        this.convertTrk2Activity(trk, index)
      );
    }

    // Convert routes
    if (gpx.rte) {
      obj.routes = gpx.rte.map((route, index) =>
        this.convertRoute2Lap(route, index)
      );
    }
    return obj;
  }

  /**
   * 将 Wpt 转为 ActivityRecordType
   * @param point
   * @param idx
   * @returns
   */
  protected convertPoint(
    point: WptType,
    idx?: number,
    lapIdx?: number
  ): ActivityRecordType {
    const { extensions } = point;
    const gpxExtensions = extensions
      ? this.convertGPXExtensions(extensions)
      : {};
    return {
      lapIndex: lapIdx || 0,
      index: idx || 0,
      positionLat: point?.lat,
      positionLong: point?.lon,
      altitude: point?.ele,
      heartRate: point?.heartRate,
      speed: point?.speed,
      power: point?.power,
      cadence: point?.cadence,
      timestamp: point.time ? dayjs(point.time).toDate() : undefined,
      ...gpxExtensions,
    };
  }
  /**
   * 将 trk 转为 Activity
   * @param trk
   * @param idx
   * @returns
   */
  private convertTrk2Activity(trk: TrkType, idx: number): ActivityType {
    const laps =
      trk.trkseg?.map((trkseg, segIdx) =>
        this.convertTrackSeg2Lap(trkseg, segIdx)
      ) || [];
    // 聚合数据
    const aggregatedData = new MetricsAggregator().calculateLapAggMetrics(
      laps
    ) as SessionMesgType;

    return {
      index: idx,
      messageIndex: idx,
      laps: laps,
      ...aggregatedData,
    };
  }
  /**
   * 将 trkseg 转为 lap
   * @param seg
   * @param idx
   * @returns
   */
  private convertTrackSeg2Lap(seg: TrksegType, idx: number): ActivityLapType {
    return this.convertPoints2Lap(seg.trkpt ?? [], idx);
  }

  private convertRoute2Lap(route: RteType, idx: number): ActivityLapType {
    return this.convertPoints2Lap(route.rtept ?? [], idx, route.name);
  }

  private convertPoints2Lap(
    sourcePoints: WptType[],
    idx: number,
    routeName?: string
  ): ActivityLapType {
    const points = sourcePoints
      .filter((point) => point.time)
      .map((point, pointIndex) =>
        this.convertPoint(point, pointIndex, idx)
      );

    const metricsAggregator = new MetricsAggregator();
    const aggregatedData = metricsAggregator.calculateRecordsAggMetrics(points);

    return {
      index: idx,
      messageIndex: idx,
      routeName,
      ...aggregatedData,
      records: aggregatedData?.records || [],
      lengths: [],
    };
  }
  /**
   * 将 GPX 的 wpt[] 转为 ActivityRecordType 数组
   * @param wpts
   * @returns
   */
  private convertWpts2Points(wpts: WptType[]): ActivityRecordType[] {
    const points: ActivityRecordType[] = [];
    for (let i = 0; i < wpts.length; i++) {
      const point = this.convertPoint(wpts[i], i);
      if (point) points.push(point);
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
        ...sessionMesg,
        // 对坐标进行转换
        startPositionLat: normalizeFitSemicircleToDegrees(
          sessionMesg?.startPositionLat
        ),
        startPositionLong: normalizeFitSemicircleToDegrees(
          sessionMesg?.startPositionLong
        ),
        endPositionLat: normalizeFitSemicircleToDegrees(
          sessionMesg?.endPositionLat
        ),
        endPositionLong: normalizeFitSemicircleToDegrees(
          sessionMesg?.endPositionLong
        ),
        laps: this.convertFITLap2Trackseg(sessionMesg?.lapMesgs),
      }));
    } else if (fit.courseMesgs?.length) {
      obj.routes = fit.courseMesgs.map((courseMesg, index) => ({
        index,
        ...courseMesg,
        records: this.convertLap2Points(courseMesg?.lapMesgs),
      }));
    }
    return obj;
  }
  /**
   * 将 FIT 的 recordMesg 转为 ActivityRecordType
   * @param point
   * @param idx
   * @returns
   */
  protected convertPoint(
    point: RecordMesgType,
    idx?: number,
    lapIdx?: number
  ): ActivityRecordType | undefined {
    const {
      positionLong,
      positionLat,
      altitude,
      enhancedAltitude,
      enhancedSpeed,
      speed,
      ...rest
    } = point;

    const rawLat =
      positionLat ?? (point as RecordMesgType & { position_lat?: number }).position_lat;
    const rawLong =
      positionLong ??
      (point as RecordMesgType & { position_long?: number }).position_long;

    return {
      lapIndex: lapIdx || 0,
      index: idx || 0,
      positionLat: normalizeFitSemicircleToDegrees(rawLat),
      positionLong: normalizeFitSemicircleToDegrees(rawLong),
      altitude,
      enhancedAltitude,
      speed,
      enhancedSpeed,
      ...rest,
    };
  }
  /**
   *
   * @param laps
   * @returns
   */
  private convertFITLap2Trackseg(laps?: LapMesgType[]): ActivityLapType[] {
    const routeSeg: ActivityLapType[] = [];
    if (!laps?.length) return [];
    for (let i = 0; i < laps.length; i++) {
      const lap = laps[i];
      const records =
        lap?.recordMesgs
          ?.map((record, idx) => this.convertPoint(record, idx, i))
          .filter((point) => point !== undefined) || [];
      const lengthMesgs: ActivityLengthType[] =
        lap?.lengthMesgs?.map((length, idx) => ({
          ...length,
          index: idx,
        })) || [];

      routeSeg.push({
        index: i,
        ...lap,
        // 对坐标数据进行转换
        startPositionLat: normalizeFitSemicircleToDegrees(lap?.startPositionLat),
        startPositionLong: normalizeFitSemicircleToDegrees(
          lap?.startPositionLong
        ),
        endPositionLat: normalizeFitSemicircleToDegrees(lap?.endPositionLat),
        endPositionLong: normalizeFitSemicircleToDegrees(lap?.endPositionLong),
        records: records,
        lengths: lengthMesgs,
      });
    }
    return routeSeg;
  }

  private convertLap2Points(laps?: LapMesgType[]): ActivityRecordType[] {
    let res: ActivityRecordType[] = [];
    if (!laps?.length) return [];

    for (let i = 0; i < laps.length; i++) {
      const lap = laps[i];
      const points =
        lap.recordMesgs
          ?.map((record, idx) => this.convertPoint(record, idx, i))
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
      obj.activities = tcx.Activities.Activity.map((activity, index) =>
        this.convertTCXActivityToActivity(activity, index)
      );
    }

    const rawCourses = tcx.Courses?.Course;
    const courseList: CourseType[] =
      rawCourses == null
        ? []
        : Array.isArray(rawCourses)
          ? rawCourses
          : [rawCourses];
    if (courseList.length) {
      obj.routes = courseList.map((course, idx) =>
        this.convertTCXCourseToRoute(course, idx)
      );
    }
    return obj;
  }

  /**
   * TCX Course → FileType.routes（每条 Course 对应一条 route lap）
   */
  private convertTCXCourseToRoute(
    course: CourseType,
    idx: number
  ): ActivityLapType {
    const records: ActivityRecordType[] = [];
    let ptIdx = 0;

    const asTrackArray = (
      t: TrackType | TrackType[] | undefined
    ): TrackType[] => {
      if (t == null) return [];
      return Array.isArray(t) ? t : [t];
    };

    const pushTracks = (tracks?: TrackType[]) => {
      for (const tr of tracks ?? []) {
        for (const tp of tr.Trackpoint ?? []) {
          if (tp == null || tp.Time === undefined) continue;
          records.push(this.convertPoint(tp, ptIdx++, idx));
        }
      }
    };

    pushTracks(asTrackArray(course.Track as TrackType | TrackType[] | undefined));
    const laps = course.Lap == null ? [] : Array.isArray(course.Lap) ? course.Lap : [course.Lap];
    for (const lap of laps) {
      const lapExt = lap as TCXActivityLapType & { Track?: TrackType | TrackType[] };
      pushTracks(asTrackArray(lapExt.Track));
    }

    let seq = records.length;
    const baseCue: Dayjs =
      records[0]?.timestamp != null
        ? dayjs(records[0].timestamp)
        : dayjs("2000-01-01T00:00:00Z");

    const coursePoints =
      course.CoursePoint == null
        ? []
        : Array.isArray(course.CoursePoint)
          ? course.CoursePoint
          : [course.CoursePoint];
    for (const cp of coursePoints) {
      const rec = this.convertTCXCoursePointToRecord(cp, seq++, idx, baseCue);
      if (rec) records.push(rec);
    }

    const metricsAggregator = new MetricsAggregator();
    const aggregatedData =
      records.length > 0
        ? metricsAggregator.calculateRecordsAggMetrics(records)
        : { records };

    return {
      index: idx,
      messageIndex: idx,
      routeName: course.Name,
      ...aggregatedData,
      records: aggregatedData?.records ?? records,
      lengths: [],
    } as ActivityLapType;
  }

  private convertTCXCoursePointToRecord(
    cp: CoursePointType,
    ptIdx: number,
    lapIdx: number,
    baseTime: Dayjs
  ): ActivityRecordType | undefined {
    const lat = cp.Position?.LatitudeDegrees
      ? Number(cp.Position.LatitudeDegrees)
      : undefined;
    const lon = cp.Position?.LongitudeDegrees
      ? Number(cp.Position.LongitudeDegrees)
      : undefined;
    if (
      lat == null &&
      lon == null &&
      cp.AltitudeMeters == null
    ) {
      return undefined;
    }
    const t =
      typeof cp.Time === "number" && Number.isFinite(cp.Time)
        ? baseTime.add(cp.Time, "second").toDate()
        : baseTime.add(ptIdx, "second").toDate();
    return {
      lapIndex: lapIdx,
      index: ptIdx,
      positionLat: lat,
      positionLong: lon,
      altitude: cp.AltitudeMeters,
      timestamp: t,
    };
  }

  /**
   * 将 tcx 的 activity 转为 ActivityType
   * @param activity
   */
  private convertTCXActivityToActivity(
    activity: TCXActivityType,
    idx: number
  ): ActivityType {
    const laps =
      activity.Lap?.map((lap, segIdx) => this.convertTCXLap2Lap(lap, segIdx)) ||
      [];
    // 聚合数据
    const aggregatedData = new MetricsAggregator().calculateLapAggMetrics(
      laps
    ) as SessionMesgType;
    return {
      index: idx,
      messageIndex: idx,
      sport: activity.Sport?.toLowerCase(),
      laps: laps,
      ...aggregatedData,
    };
  }

  /**
   * 将 TCX Lap 转为 ActivityLapType
   * @param lap
   * @param idx
   * @returns
   */
  private convertTCXLap2Lap(
    lap: TCXActivityLapType,
    idx: number
  ): ActivityLapType {
    // 将 track point 提取出来
    const allPoints = lap?.Track?.flatMap((track) => track.Trackpoint) || [];
    const points =
      allPoints
        ?.filter(
          (point: TrackpointType | undefined): point is TrackpointType =>
            point !== undefined && point.Time !== undefined
        )
        .map((point: TrackpointType, ptIdx: number) =>
          this.convertPoint(point, ptIdx)
        ) || [];

    const metricsAggregator = new MetricsAggregator();
    const aggregatedData = metricsAggregator.calculateRecordsAggMetrics(points);
    return {
      index: idx,
      messageIndex: idx,
      ...aggregatedData,
      records: aggregatedData?.records || [],
      lengths: [],
    };
  }

  protected convertPoint(
    point: TrackpointType,
    idx?: number,
    lapIdx?: number
  ): ActivityRecordType {
    const { Position, Time, DistanceMeters, AltitudeMeters } = point;

    return {
      lapIndex: lapIdx || 0,
      index: idx || 0,
      positionLat: Position?.LatitudeDegrees
        ? Number(Position!.LatitudeDegrees)
        : undefined,
      positionLong: Position?.LongitudeDegrees
        ? Number(Position!.LongitudeDegrees)
        : undefined,
      timestamp: dayjs(Time).toDate(),
      distance: DistanceMeters,
      altitude: AltitudeMeters,
    };
  }
}
