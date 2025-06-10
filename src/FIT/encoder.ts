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
 * FIT encoder options
 */
export interface FITEncoderOptions {
  /** Whether to enable compact mode */
  compact?: boolean;
  /** Default sport type */
  defaultSport?: string;
  /** Default sub sport type */
  defaultSubSport?: string;
}

/**
 * FIT encoder - encodes FITFileType data to FIT binary format
 */
export class FITEncoder {
  private localNum: Record<string, number> = {};
  private mesgDefn: any[] = [];
  private messages: any[] = [];
  private options: Required<FITEncoderOptions>;

  /**
   * Constructor
   * @param options Encoder options
   */
  constructor(options: FITEncoderOptions = {}) {
    this.options = {
      compact: options.compact ?? true,
      defaultSport: options.defaultSport ?? "cycling",
      defaultSubSport: options.defaultSubSport ?? "generic",
    };
  }

  // ==================== Public Interface ====================

  /**
   * Encode FIT data to Buffer - Activity file type
   */
  async encode(fitData: FITFileType): Promise<Buffer> {
    this.reset();
    this.buildFITContent(fitData, "activity");
    return Buffer.from(await this.blob.arrayBuffer());
  }

  /**
   * Encode FIT data to Buffer - Course file type
   */
  async encodeCourse(fitData: FITFileType): Promise<Buffer> {
    this.reset();
    this.buildFITContent(fitData, "course");
    return Buffer.from(await this.blob.arrayBuffer());
  }

  /**
   * Encode FIT data to Blob
   */
  async encodeToBlob(
    fitData: FITFileType,
    fileType: "activity" | "course" = "activity"
  ): Promise<Blob> {
    this.reset();
    this.buildFITContent(fitData, fileType);
    return this.blob;
  }

  // ==================== Core Build Methods ====================

  /**
   * Reset encoder state
   */
  private reset(): void {
    this.localNum = {};
    this.mesgDefn = [];
    this.messages = [];
  }

  /**
   * Build FIT file content
   */
  private buildFITContent(
    fitData: FITFileType,
    fileType: "activity" | "course"
  ): void {
    // 1. Write file ID (must be first)
    this.buildFileId(fitData, fileType);

    // 2. Build different content based on file type
    if (fileType === "course") {
      this.buildCourseContent(fitData);
    } else {
      this.buildActivityContent(fitData);
    }
  }

  /**
   * Build Activity file content
   */
  private buildActivityContent(fitData: FITFileType): void {
    const sessions = fitData.sessionMesgs || [];

    if (sessions.length === 0) {
      throw new Error("Activity file must contain at least one Session");
    }

    // Process all sessions
    let totalSessions = 0;
    const allEvents: EventMesgType[] = [];
    const allActivities: ActivityMesgType[] = [];

    for (const session of sessions) {
      // Build session-related events
      if (session.lapMesgs) {
        this.buildEventsFromLaps(session.lapMesgs, allEvents);
      }

      // Build records
      if (session.lapMesgs) {
        for (const lap of session.lapMesgs) {
          if (lap.recordMesgs) {
            this.buildRecords(lap.recordMesgs);
          }
        }
      }

      // Build laps
      if (session.lapMesgs) {
        this.buildLaps(session.lapMesgs);
      }

      // Build session
      this.buildSession(session);
      totalSessions++;

      // Build activity
      this.buildActivityFromSession(session, allActivities);
    }

    // Write all events
    allEvents.forEach((event) => this.buildEvent(event));

    // Write all activities
    allActivities.forEach((activity) => this.buildActivity(activity));
  }

  /**
   * Build Course file content
   */
  private buildCourseContent(fitData: FITFileType): void {
    // Course file special processing logic
    const sessions = fitData.sessionMesgs || [];

    if (sessions.length === 0) {
      throw new Error("Course file must contain track data");
    }

    const session = sessions[0]; // Course usually has only one session

    // Write course information
    this.buildCourse({
      name: "course",
      sport: this.options.defaultSport,
    });

    // Build events and records
    if (session.lapMesgs) {
      const allRecords: RecordMesgType[] = [];

      // Collect all records
      for (const lap of session.lapMesgs) {
        if (lap.recordMesgs) {
          allRecords.push(...lap.recordMesgs);
        }
      }

      // Sort records (by timestamp or distance)
      allRecords.sort((a, b) => {
        if (a.timestamp && b.timestamp) {
          return (
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        }
        return (a.distance || 0) - (b.distance || 0);
      });

      // Build course points and records
      const startRecord = allRecords[0];
      const endRecord = allRecords[allRecords.length - 1];

      // Start event
      if (startRecord.timestamp) {
        this.buildEvent({
          timestamp: startRecord.timestamp,
          event: "timer",
          eventType: "start",
          eventGroup: 0,
        });
      }

      // Write all records
      allRecords.forEach((record) => this.buildRecord(record));

      // End event
      if (endRecord.timestamp) {
        this.buildEvent({
          timestamp: endRecord.timestamp,
          event: "timer",
          eventType: "stop_all",
          eventGroup: 0,
        });
      }

      // Write lap
      if (session.lapMesgs[0]) {
        this.buildLap(session.lapMesgs[0]);
      }
    }
  }

  // ==================== Helper Build Methods ====================

  /**
   * Build file ID
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
   * Build Session
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
   * Build Laps
   */
  private buildLaps(laps: LapMesgType[]): void {
    laps.forEach((lap) => this.buildLap(lap));
  }

  /**
   * Build single Lap
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
   * Build Records
   */
  private buildRecords(records: RecordMesgType[]): void {
    records.forEach((record) => this.buildRecord(record));
  }

  /**
   * Build single Record
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
   * Build Event
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
   * Build Activity
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
   * Build Course
   */
  private buildCourse(course: { name: string; sport: string }): void {
    this.writeMesg("course", {
      name: course.name,
      sport: course.sport,
    });
  }

  // ==================== Data Conversion and Validation Methods ====================

  /**
   * Build Events from Laps
   */
  private buildEventsFromLaps(
    laps: LapMesgType[],
    events: EventMesgType[]
  ): void {
    laps.forEach((lap, index) => {
      // Start event
      if (lap.startTime) {
        events.push({
          timestamp: lap.startTime,
          event: "timer",
          eventType: "start",
          eventGroup: index,
        });
      }

      // End event
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
   * Build Activity from Session
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
   * Parse timestamp
   */
  private parseTimestamp(timestamp: string | number): number {
    if (typeof timestamp === "number") {
      return timestamp;
    }

    const date = dayjs(timestamp);
    return date.valueOf();
  }

  /**
   * Convert coordinates to semicircles
   */
  private convertToSemicircles(coord?: number): number | undefined {
    if (coord === undefined || coord === null) return undefined;
    return Math.round((coord * 2 ** 31) / 180);
  }

  /**
   * Validate required fields
   */
  private validateRequiredFields(fitData: FITFileType): void {
    if (!fitData.sessionMesgs || fitData.sessionMesgs.length === 0) {
      throw new Error("FIT file must contain at least one Session");
    }
  }

  // ==================== Low-level Message Writing Methods ====================

  /**
   * Write message
   */
  private writeMesg(mesgName: string, values: Record<string, any>): void {
    // Filter out undefined values
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

  // ==================== File Generation Properties ====================

  /**
   * Get Blob object
   */
  get blob(): Blob {
    const content = [this.header, ...this.messages, this.trailer];
    return new Blob(content, { type: "application/octet-stream" });
  }

  /**
   * Get data length
   */
  get dataLen(): number {
    return this.messages.reduce((len, message) => len + message.byteLength, 0);
  }

  /**
   * Get data CRC
   */
  get dataCrc(): number {
    return this.messages.reduce((dataCrc, message) => crc(message, dataCrc), 0);
  }

  /**
   * Get file header
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
   * Get file trailer
   */
  get trailer(): ArrayBuffer {
    const dv = new DataView(new ArrayBuffer(2));
    dv.setUint16(0, this.dataCrc, true);

    return dv.buffer;
  }

  // ==================== Compatibility Methods (Deprecated) ====================

  /**
   * @deprecated Use encode() instead
   */
  async encoder(fitData: FITFileType): Promise<Buffer> {
    console.warn("encoder() method is deprecated, please use encode() method");
    return this.encode(fitData);
  }
}

export default {
  FITEncoder,
};
