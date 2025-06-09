/* global Blob */
import { Mesg } from "./mesg.js";
import { crc } from "./crc.js";
import {
  FITFileType,
  SessionMesgType,
  LapMesgType,
  RecordMesgType,
  EventMesgType,
  FileIdMesgType,
  ActivityMesgType,
} from "./types.js";
import dayjs from "dayjs";

const HEADER_LEN = 14;
const PROTOCOL_VERSION = 0x10; // 1.0
const PROFILE_VERSION = 2078; // 20.78
const MAGIC = 0x2e464954; // ".FIT"

/**
 * FIT 编码器选项
 */
export interface FITEncoderOptions {
  /** 是否启用紧凑模式 */
  compact?: boolean;
  /** 默认运动类型 */
  defaultSport?: string;
  /** 默认子运动类型 */
  defaultSubSport?: string;
}

/**
 * FIT 编码器 - 将 FITFileType 数据编码为 FIT 二进制格式
 */
export class FITEncoder {
  private localNum: Record<string, number> = {};
  private mesgDefn: any[] = [];
  private messages: any[] = [];
  private options: Required<FITEncoderOptions>;

  /**
   * 构造函数
   * @param options 编码器选项
   */
  constructor(options: FITEncoderOptions = {}) {
    this.options = {
      compact: options.compact ?? true,
      defaultSport: options.defaultSport ?? "cycling",
      defaultSubSport: options.defaultSubSport ?? "generic",
    };
  }

  // ==================== 公共接口 ====================

  /**
   * 编码 FIT 数据为 Buffer - Activity 文件类型
   */
  async encode(fitData: FITFileType): Promise<Buffer> {
    this.reset();
    this.buildFITContent(fitData, "activity");
    return Buffer.from(await this.blob.arrayBuffer());
  }

  /**
   * 编码 FIT 数据为 Buffer - Course 文件类型
   */
  async encodeCourse(fitData: FITFileType): Promise<Buffer> {
    this.reset();
    this.buildFITContent(fitData, "course");
    return Buffer.from(await this.blob.arrayBuffer());
  }

  /**
   * 编码 FIT 数据为 Blob
   */
  async encodeToBlob(
    fitData: FITFileType,
    fileType: "activity" | "course" = "activity"
  ): Promise<Blob> {
    this.reset();
    this.buildFITContent(fitData, fileType);
    return this.blob;
  }

  // ==================== 核心构建方法 ====================

  /**
   * 重置编码器状态
   */
  private reset(): void {
    this.localNum = {};
    this.mesgDefn = [];
    this.messages = [];
  }

  /**
   * 构建 FIT 文件内容
   */
  private buildFITContent(
    fitData: FITFileType,
    fileType: "activity" | "course"
  ): void {
    // 1. 写入文件ID（必须第一个）
    this.buildFileId(fitData, fileType);

    // 2. 根据文件类型构建不同的内容
    if (fileType === "course") {
      this.buildCourseContent(fitData);
    } else {
      this.buildActivityContent(fitData);
    }
  }

  /**
   * 构建 Activity 文件内容
   */
  private buildActivityContent(fitData: FITFileType): void {
    const sessions = fitData.sessionMesgs || [];

    if (sessions.length === 0) {
      throw new Error("Activity文件必须包含至少一个Session");
    }

    // 处理所有sessions
    let totalSessions = 0;
    const allEvents: EventMesgType[] = [];
    const allActivities: ActivityMesgType[] = [];

    for (const session of sessions) {
      // 构建session相关的events
      if (session.lapMesgs) {
        this.buildEventsFromLaps(session.lapMesgs, allEvents);
      }

      // 构建records
      if (session.lapMesgs) {
        for (const lap of session.lapMesgs) {
          if (lap.recordMesgs) {
            this.buildRecords(lap.recordMesgs);
          }
        }
      }

      // 构建laps
      if (session.lapMesgs) {
        this.buildLaps(session.lapMesgs);
      }

      // 构建session
      this.buildSession(session);
      totalSessions++;

      // 构建activity
      this.buildActivityFromSession(session, allActivities);
    }

    // 写入所有events
    allEvents.forEach((event) => this.buildEvent(event));

    // 写入所有activities
    allActivities.forEach((activity) => this.buildActivity(activity));
  }

  /**
   * 构建 Course 文件内容
   */
  private buildCourseContent(fitData: FITFileType): void {
    // Course文件的特殊处理逻辑
    const sessions = fitData.sessionMesgs || [];

    if (sessions.length === 0) {
      throw new Error("Course文件必须包含轨迹数据");
    }

    const session = sessions[0]; // Course通常只有一个session

    // 写入course信息
    this.buildCourse({
      name: "course",
      sport: this.options.defaultSport,
    });

    // 构建events和records
    if (session.lapMesgs) {
      const allRecords: RecordMesgType[] = [];

      // 收集所有records
      for (const lap of session.lapMesgs) {
        if (lap.recordMesgs) {
          allRecords.push(...lap.recordMesgs);
        }
      }

      // 排序records（按时间戳或距离）
      allRecords.sort((a, b) => {
        if (a.timestamp && b.timestamp) {
          return (
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        }
        return (a.distance || 0) - (b.distance || 0);
      });

      // 构建course points和records
      const startRecord = allRecords[0];
      const endRecord = allRecords[allRecords.length - 1];

      // 开始事件
      if (startRecord.timestamp) {
        this.buildEvent({
          timestamp: startRecord.timestamp,
          event: "timer",
          eventType: "start",
          eventGroup: 0,
        });
      }

      // 写入所有records
      allRecords.forEach((record) => this.buildRecord(record));

      // 结束事件
      if (endRecord.timestamp) {
        this.buildEvent({
          timestamp: endRecord.timestamp,
          event: "timer",
          eventType: "stop_all",
          eventGroup: 0,
        });
      }

      // 写入lap
      if (session.lapMesgs[0]) {
        this.buildLap(session.lapMesgs[0]);
      }
    }
  }

  // ==================== 辅助构建方法 ====================

  /**
   * 构建文件ID
   */
  private buildFileId(
    fitData: FITFileType,
    fileType: "activity" | "course"
  ): void {
    const fileId = fitData.fileIdMesgs?.[0] || {};

    this.writeMesg("file_id", {
      type: fileType,
      time_created: fileId.timeCreated
        ? this.parseTimestamp(fileId.timeCreated)
        : Date.now(),
      manufacturer: fileId.manufacturer,
      product: fileId.product,
      serial_number: fileId.serialNumber,
    });
  }

  /**
   * 构建Session
   */
  private buildSession(session: SessionMesgType): void {
    this.writeMesg("session", {
      timestamp: session.timestamp
        ? this.parseTimestamp(session.timestamp)
        : undefined,
      start_time: session.startTime
        ? this.parseTimestamp(session.startTime)
        : undefined,
      total_elapsed_time: session.totalElapsedTime,
      total_timer_time: session.totalTimerTime,
      start_position_lat: this.convertToSemicircles(session.startPositionLat),
      start_position_long: this.convertToSemicircles(session.startPositionLong),
      total_distance: session.totalDistance,
      total_ascent: session.totalAscent,
      total_descent: session.totalDescent,
      sport: session.sport || this.options.defaultSport,
      sub_sport: session.subSport || this.options.defaultSubSport,
      first_lap_index: session.firstLapIndex || 0,
      num_laps: session.numLaps || session.lapMesgs?.length || 1,
    });
  }

  /**
   * 构建Laps
   */
  private buildLaps(laps: LapMesgType[]): void {
    laps.forEach((lap) => this.buildLap(lap));
  }

  /**
   * 构建单个Lap
   */
  private buildLap(lap: LapMesgType): void {
    this.writeMesg("lap", {
      timestamp: lap.timestamp ? this.parseTimestamp(lap.timestamp) : undefined,
      start_time: lap.startTime
        ? this.parseTimestamp(lap.startTime)
        : undefined,
      start_position_lat: this.convertToSemicircles(lap.startPositionLat),
      start_position_long: this.convertToSemicircles(lap.startPositionLong),
      end_position_lat: this.convertToSemicircles(lap.endPositionLat),
      end_position_long: this.convertToSemicircles(lap.endPositionLong),
      total_elapsed_time: lap.totalElapsedTime,
      total_timer_time: lap.totalTimerTime,
      total_distance: lap.totalDistance,
      total_ascent: lap.totalAscent,
      total_descent: lap.totalDescent,
    });
  }

  /**
   * 构建Records
   */
  private buildRecords(records: RecordMesgType[]): void {
    records.forEach((record) => this.buildRecord(record));
  }

  /**
   * 构建单个Record
   */
  private buildRecord(record: RecordMesgType): void {
    this.writeMesg("record", {
      timestamp: record.timestamp
        ? this.parseTimestamp(record.timestamp)
        : undefined,
      position_lat: this.convertToSemicircles(record.positionLat),
      position_long: this.convertToSemicircles(record.positionLong),
      altitude: record.enhancedAltitude || record.altitude,
      distance: record.distance,
      heart_rate: record.heartRate,
      cadence: record.cadence,
      speed: record.enhancedSpeed || record.speed,
      power: record.power,
    });
  }

  /**
   * 构建Event
   */
  private buildEvent(event: EventMesgType): void {
    this.writeMesg("event", {
      timestamp: event.timestamp
        ? this.parseTimestamp(event.timestamp)
        : undefined,
      event: event.event,
      event_type: event.eventType,
      event_group: event.eventGroup,
    });
  }

  /**
   * 构建Activity
   */
  private buildActivity(activity: ActivityMesgType): void {
    this.writeMesg("activity", {
      timestamp: activity.timestamp
        ? this.parseTimestamp(activity.timestamp)
        : undefined,
      total_timer_time: activity.totalTimerTime,
      num_sessions: activity.numSessions,
      type: activity.type,
      event: activity.event,
      event_type: activity.eventType,
      local_timestamp: activity.localTimestamp
        ? this.parseTimestamp(activity.localTimestamp)
        : undefined,
      event_group: activity.eventGroup,
    });
  }

  /**
   * 构建Course
   */
  private buildCourse(course: { name: string; sport: string }): void {
    this.writeMesg("course", {
      name: course.name,
      sport: course.sport,
    });
  }

  // ==================== 数据转换和验证方法 ====================

  /**
   * 从Laps构建Events
   */
  private buildEventsFromLaps(
    laps: LapMesgType[],
    events: EventMesgType[]
  ): void {
    laps.forEach((lap, index) => {
      // 开始事件
      if (lap.startTime) {
        events.push({
          timestamp: lap.startTime,
          event: "timer",
          eventType: "start",
          eventGroup: index,
        });
      }

      // 结束事件
      if (lap.timestamp) {
        events.push({
          timestamp: lap.timestamp,
          event: "timer",
          eventType: index === laps.length - 1 ? "stop_all" : "stop",
          eventGroup: index,
        });
      }
    });
  }

  /**
   * 从Session构建Activity
   */
  private buildActivityFromSession(
    session: SessionMesgType,
    activities: ActivityMesgType[]
  ): void {
    activities.push({
      timestamp: session.timestamp,
      totalTimerTime: session.totalTimerTime,
      numSessions: 1,
      type: session.sport || this.options.defaultSport,
      event: "activity",
      eventType: "stop",
      eventGroup: 0,
    });
  }

  /**
   * 解析时间戳
   */
  private parseTimestamp(timestamp: string | number): number {
    if (typeof timestamp === "number") {
      return timestamp;
    }

    const date = dayjs(timestamp);
    return date.valueOf();
  }

  /**
   * 转换坐标为半圆单位
   */
  private convertToSemicircles(coord?: number): number | undefined {
    if (coord === undefined || coord === null) return undefined;
    return Math.round((coord * 2 ** 31) / 180);
  }

  /**
   * 验证必要字段
   */
  private validateRequiredFields(fitData: FITFileType): void {
    if (!fitData.sessionMesgs || fitData.sessionMesgs.length === 0) {
      throw new Error("FIT文件必须包含至少一个Session");
    }
  }

  // ==================== 低级别消息写入方法 ====================

  /**
   * 写入消息
   */
  private writeMesg(mesgName: string, values: Record<string, any>): void {
    // 过滤掉undefined值
    const filteredValues = Object.fromEntries(
      Object.entries(values).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(filteredValues).length === 0) return;

    let localNum = this.localNum[mesgName];
    if (localNum === undefined) {
      localNum = this.localNum[mesgName] = Object.keys(this.localNum).length;
    }

    const mesg = new Mesg(localNum, mesgName, filteredValues);

    const mesgDefn = this.mesgDefn[localNum];
    if (!mesgDefn || !mesg.isSameDefn(mesgDefn)) {
      this.messages.push(mesg.defnRecord);
      this.mesgDefn[localNum] = mesg.mesgDefn;
    }
    this.messages.push(mesg.dataRecord);
  }

  // ==================== 文件生成属性 ====================

  /**
   * 获取Blob对象
   */
  get blob(): Blob {
    const content = [this.header, ...this.messages, this.trailer];
    return new Blob(content, { type: "application/octet-stream" });
  }

  /**
   * 获取数据长度
   */
  get dataLen(): number {
    return this.messages.reduce((len, message) => len + message.byteLength, 0);
  }

  /**
   * 获取数据CRC
   */
  get dataCrc(): number {
    return this.messages.reduce((dataCrc, message) => crc(message, dataCrc), 0);
  }

  /**
   * 获取文件头
   */
  get header(): ArrayBuffer {
    const dv = new DataView(new ArrayBuffer(HEADER_LEN));
    dv.setUint8(0, HEADER_LEN);
    dv.setUint8(1, PROTOCOL_VERSION);
    dv.setUint16(2, PROFILE_VERSION, true);
    dv.setUint32(4, this.dataLen, true);
    dv.setUint32(8, MAGIC);
    dv.setUint16(12, crc(dv.buffer.slice(0, 12)), true);

    return dv.buffer;
  }

  /**
   * 获取文件尾
   */
  get trailer(): ArrayBuffer {
    const dv = new DataView(new ArrayBuffer(2));
    dv.setUint16(0, this.dataCrc, true);

    return dv.buffer;
  }

  // ==================== 兼容性方法 (Deprecated) ====================

  /**
   * @deprecated 使用 encode() 替代
   */
  async encoder(fitData: FITFileType): Promise<Buffer> {
    console.warn("encoder() 方法已废弃，请使用 encode() 方法");
    return this.encode(fitData);
  }
}

export default {
  FITEncoder,
};
