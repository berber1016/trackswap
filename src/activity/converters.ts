import { BaseActivityConverter, ActivityContext } from "./base.js";
import { ActivityLengthType, FileType, TokenAST } from "../types.js";
import { ActivityType, ActivityRecordType, ActivityLapType } from "../types.js";
import { GPX11Type, TrksegType, TrkType, WptType } from "../GPX/types.js";
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
} from "../TCX/types.js";
import { semicirclesToDegrees, convertGPXExtensionsMapping } from "../util.js";
import dayjs from "dayjs";
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
      obj.routes = gpx.rte.map((rte, idx) => {
        return this.convertTrackSeg2Lap(rte, idx);
      });
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
      timestamp: dayjs(point.time).toDate(),
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
    const points =
      seg.trkpt
        ?.filter(
          (point: WptType | undefined) => point !== undefined && point.time
        )
        ?.map((trkpt: WptType, ptIdx: number) =>
          this.convertPoint(trkpt, ptIdx, idx)
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
        startPositionLat: sessionMesg?.startPositionLat
          ? round(semicirclesToDegrees(Number(sessionMesg.startPositionLat)), 6)
          : undefined,
        startPositionLong: sessionMesg?.startPositionLong
          ? round(
              semicirclesToDegrees(Number(sessionMesg.startPositionLong)),
              6
            )
          : undefined,
        endPositionLat: sessionMesg?.endPositionLat
          ? round(semicirclesToDegrees(Number(sessionMesg.endPositionLat)), 6)
          : undefined,
        endPositionLong: sessionMesg?.endPositionLong
          ? round(semicirclesToDegrees(Number(sessionMesg.endPositionLong)), 6)
          : undefined,
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

    return {
      lapIndex: lapIdx || 0,
      index: idx || 0,
      positionLat: positionLat
        ? round(semicirclesToDegrees(Number(positionLat)), 6)
        : undefined,
      positionLong: positionLong
        ? round(semicirclesToDegrees(Number(positionLong)), 6)
        : undefined,
      altitude: altitude || undefined,
      enhancedAltitude: enhancedAltitude || undefined,
      speed: speed || undefined,
      enhancedSpeed: enhancedSpeed || undefined,
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
        startPositionLat: lap?.startPositionLat
          ? round(semicirclesToDegrees(Number(lap.startPositionLat)), 6)
          : undefined,
        startPositionLong: lap?.startPositionLong
          ? round(semicirclesToDegrees(Number(lap.startPositionLong)), 6)
          : undefined,
        endPositionLat: lap?.endPositionLat
          ? round(semicirclesToDegrees(Number(lap.endPositionLat)), 6)
          : undefined,
        endPositionLong: lap?.endPositionLong
          ? round(semicirclesToDegrees(Number(lap.endPositionLong)), 6)
          : undefined,
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

    if (tcx.Courses?.Course?.length) {
      // TODO: 处理 Course
    }
    return obj;
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
