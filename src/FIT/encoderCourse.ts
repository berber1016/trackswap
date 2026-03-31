import { Encoder } from "@garmin/fitsdk";
import { CoursePoint as CoursePointType } from "./types/course_point.js";
import { Event } from "./types/event.js";
import { EventType } from "./types/event_type.js";
import { FITFile } from "./types/file.js";
import { MesgNum } from "./types/mesg_num.js";
import { Sport, SubSport } from "./types/message_index_type.js";

/**
 * 路线轨迹点（用于生成 record 消息）。
 * 默认输入经纬度为「度」，内部会转换为 FIT semicircles。
 */
export interface CourseRecordPoint {
  /** 轨迹点时间（Date 或 FIT 时间戳/Unix 时间戳）。 */
  timestamp: Date | number;
  /** 纬度（默认按度处理，范围通常 -90~90）。 */
  latitude: number;
  /** 经度（默认按度处理，范围通常 -180~180）。 */
  longitude: number;
  /** 距离（单位 m，可选）。 */
  distance?: number;
  /** 海拔（单位 m，可选）。 */
  altitude?: number;
  /** 速度（单位 m/s，可选）。 */
  speed?: number;
}

/**
 * 路线拐点（用于生成 course_point 消息）。
 */
export interface CourseCuePoint {
  /** 拐点时间。 */
  timestamp: Date | number;
  /** 拐点纬度（默认按度处理）。 */
  latitude: number;
  /** 拐点经度（默认按度处理）。 */
  longitude: number;
  /** 拐点类型（左转/右转/补给点等），默认 GENERIC。 */
  type?: CoursePointType;
  /** 拐点名称。 */
  name?: string;
  /** 拐点对应路线距离（单位 m，可选）。 */
  distance?: number;
  /** 是否收藏点。 */
  favorite?: boolean;
}

/**
 * 课程计划（业务模型）。
 */
export interface CoursePlan {
  /** 路线名称。 */
  name: string;
  /** 运动类型，默认 CYCLING。 */
  sport?: Sport;
  /** 子运动类型，默认 GENERIC。 */
  subSport?: SubSport;
  /** 路线轨迹点（至少 1 个）。 */
  records: CourseRecordPoint[];
  /** 路线拐点列表（可选）。 */
  coursePoints?: CourseCuePoint[];
  /** file_id.manufacturer，可选，默认 development。 */
  manufacturer?: string | number;
  /** file_id.product，可选，默认 1。 */
  product?: number;
  /** file_id.serialNumber，可选，默认 1。 */
  serialNumber?: number;
  /** file_id.timeCreated，可选，默认首个 record.timestamp。 */
  timeCreated?: Date | number;
}

/**
 * 中间消息结构，统一喂给 Garmin Encoder.onMesg()。
 */
export interface FitMesg {
  /** FIT 消息号。 */
  mesgNum: MesgNum;
  /** 消息体。 */
  data: Record<string, unknown>;
}

interface NormalizedCourseRecordPoint
  extends Omit<CourseRecordPoint, "latitude" | "longitude"> {
  positionLat: number;
  positionLong: number;
}

interface NormalizedCourseCuePoint
  extends Omit<CourseCuePoint, "latitude" | "longitude" | "type"> {
  positionLat: number;
  positionLong: number;
  type: CoursePointType;
}

interface NormalizedCoursePlan
  extends Omit<CoursePlan, "records" | "coursePoints" | "sport" | "subSport"> {
  sport: Sport;
  subSport: SubSport;
  records: NormalizedCourseRecordPoint[];
  coursePoints: NormalizedCourseCuePoint[];
  manufacturer: string | number;
  product: number;
  serialNumber: number;
  timeCreated: Date | number;
}

const DEFAULT_MANUFACTURER = "development";
const DEFAULT_PRODUCT = 1;
const DEFAULT_SERIAL_NUMBER = 1;

function ensureFinite(value: number, fieldName: string): void {
  if (!Number.isFinite(value)) {
    throw new Error(`${fieldName} must be a finite number.`);
  }
}

/**
 * 经纬度转 semicircles：
 * - 若值在常见经纬度范围内，按度数转换
 * - 若超出范围，认为调用方已传入 semicircles
 */
function toSemicircles(value: number, fieldName: string): number {
  ensureFinite(value, fieldName);
  if (Math.abs(value) <= 180) {
    return Math.round((value * 0x80000000) / 180);
  }
  return Math.round(value);
}

function normalizeCoursePlan(plan: CoursePlan): NormalizedCoursePlan {
  if (!plan.name || plan.name.trim().length === 0) {
    throw new Error("Course name is required.");
  }
  if (!Array.isArray(plan.records) || plan.records.length === 0) {
    throw new Error("Course must contain at least one record point.");
  }

  const records: NormalizedCourseRecordPoint[] = plan.records.map(
    (record, index) => {
      if (record == null) {
        throw new Error(`Course record #${index + 1} is missing.`);
      }
      if (record.timestamp == null) {
        throw new Error(`Course record #${index + 1} is missing timestamp.`);
      }

      return {
        ...record,
        positionLat: toSemicircles(
          record.latitude,
          `records[${index}].latitude`,
        ),
        positionLong: toSemicircles(
          record.longitude,
          `records[${index}].longitude`,
        ),
      };
    },
  );

  const coursePoints: NormalizedCourseCuePoint[] = (
    plan.coursePoints ?? []
  ).map((point, index) => {
    if (point == null) {
      throw new Error(`Course point #${index + 1} is missing.`);
    }
    if (point.timestamp == null) {
      throw new Error(`Course point #${index + 1} is missing timestamp.`);
    }

    return {
      ...point,
      type: point.type ?? CoursePointType.GENERIC,
      positionLat: toSemicircles(
        point.latitude,
        `coursePoints[${index}].latitude`,
      ),
      positionLong: toSemicircles(
        point.longitude,
        `coursePoints[${index}].longitude`,
      ),
    };
  });

  return {
    ...plan,
    sport: plan.sport ?? Sport.CYCLING,
    subSport: plan.subSport ?? SubSport.GENERIC,
    records,
    coursePoints,
    manufacturer: plan.manufacturer ?? DEFAULT_MANUFACTURER,
    product: plan.product ?? DEFAULT_PRODUCT,
    serialNumber: plan.serialNumber ?? DEFAULT_SERIAL_NUMBER,
    timeCreated: plan.timeCreated ?? records[0].timestamp,
  };
}

/**
 * 课程映射：
 * FILE_ID(course) + COURSE + LAP + EVENT(start/stop_all) + RECORD[] + COURSE_POINT[]。
 */
export function buildCourseMesgs(plan: CoursePlan): FitMesg[] {
  const normalized = normalizeCoursePlan(plan);
  const firstRecord = normalized.records[0];
  const lastRecord = normalized.records[normalized.records.length - 1];
  const startTimestamp = firstRecord.timestamp;
  const endTimestamp = lastRecord.timestamp;

  const mesgs: FitMesg[] = [
    {
      mesgNum: MesgNum.FILE_ID,
      data: {
        type: FITFile.COURSE,
        manufacturer: normalized.manufacturer,
        product: normalized.product,
        serialNumber: normalized.serialNumber,
        timeCreated: normalized.timeCreated,
      },
    },
    {
      mesgNum: MesgNum.COURSE,
      data: {
        name: normalized.name,
        sport: normalized.sport,
        subSport: normalized.subSport,
      },
    },
    {
      mesgNum: MesgNum.LAP,
      data: {
        startTime: startTimestamp,
        timestamp: endTimestamp,
        startPositionLat: firstRecord.positionLat,
        startPositionLong: firstRecord.positionLong,
        endPositionLat: lastRecord.positionLat,
        endPositionLong: lastRecord.positionLong,
        totalDistance: lastRecord.distance,
      },
    },
    {
      mesgNum: MesgNum.EVENT,
      data: {
        timestamp: startTimestamp,
        event: Event.TIMER,
        eventType: EventType.START,
      },
    },
  ];

  normalized.records.forEach((record) => {
    mesgs.push({
      mesgNum: MesgNum.RECORD,
      data: {
        timestamp: record.timestamp,
        positionLat: record.positionLat,
        positionLong: record.positionLong,
        distance: record.distance,
        altitude: record.altitude,
        speed: record.speed,
      },
    });
  });

  normalized.coursePoints.forEach((point, index) => {
    mesgs.push({
      mesgNum: MesgNum.COURSE_POINT,
      data: {
        messageIndex: index,
        timestamp: point.timestamp,
        positionLat: point.positionLat,
        positionLong: point.positionLong,
        distance: point.distance,
        type: point.type,
        name: point.name,
        favorite: point.favorite,
      },
    });
  });

  mesgs.push({
    mesgNum: MesgNum.EVENT,
    data: {
      timestamp: endTimestamp,
      event: Event.TIMER,
      eventType: EventType.STOP_ALL,
    },
  });

  return mesgs;
}

/**
 * 编码入口：
 * 先映射消息，再写入 Garmin Encoder，最后 close() 输出 FIT 字节。
 */
export function encodeCourse(plan: CoursePlan): Uint8Array {
  const encoder = new Encoder();
  const mesgs = buildCourseMesgs(plan);

  mesgs.forEach((mesg) => {
    encoder.onMesg(mesg.mesgNum, mesg.data);
  });

  return encoder.close();
}
