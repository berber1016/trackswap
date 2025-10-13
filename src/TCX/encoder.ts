import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import {
  TCXFileType,
  ActivityListType,
  ActivityType,
  ActivityLapType,
  TrackType,
  TrackpointType,
  PositionType,
  MultiActivitySessionType,
  FirstActivityType,
  NextActivityType,
  AbstractSourceType,
  FolderType,
  HistoryType,
  WorkoutListType,
  CourseListType,
  HeartRateInBeatsPerMinuteType,
  CadenceType,
} from "./types.js";
import { ExtensionsType } from "../types.js";

// Configure dayjs UTC plugin
dayjs.extend(utc);

/**
 * TCX encoder - encodes TCXFileType data to TCX XML format
 */
export class TCXEncoder {
  private compact: boolean;

  /**
   * Constructor
   * @param options Encoder options
   */
  constructor(options: { compact?: boolean } = {}) {
    this.compact = options.compact ?? true;
  }

  // ==================== Public Interface ====================

  /**
   * Encode TCX data to Buffer
   */
  async encode(tcxData: TCXFileType): Promise<Buffer> {
    const xmlContent = this.buildTCXXML(tcxData);
    return Buffer.from(xmlContent, "utf-8");
  }

  /**
   * Encode TCX data to XML string
   */
  encodeToString(tcxData: TCXFileType): string {
    return this.buildTCXXML(tcxData);
  }

  // ==================== Core Build Methods ====================

  /**
   * Build complete TCX XML
   */
  private buildTCXXML(tcxData: TCXFileType): string {
    const header = this.buildXMLHeader(tcxData);
    const content = this.buildTCXContent(tcxData);
    const footer = "</TrainingCenterDatabase>";

    const xml = `${header}${content}\n${footer}`;

    // If compact mode is enabled, compress XML
    return this.compact ? this.compressXML(xml) : xml;
  }

  /**
   * Compress XML string, remove redundant newlines and spaces
   */
  private compressXML(xml: string): string {
    return (
      xml
        // Remove newlines and extra spaces between tags
        .replace(/>\s+</g, "><")
        // Remove leading and trailing whitespace from lines
        .replace(/^\s+|\s+$/gm, "")
        // Replace multiple consecutive spaces with single space
        .replace(/\s+/g, " ")
        // Remove overall leading and trailing whitespace
        .trim()
    );
  }

  /**
   * Build XML header
   */
  private buildXMLHeader(tcxData: TCXFileType): string {
    const version = tcxData.version || "1.0";
    const creator = tcxData.creator || "trackswap";
    const xmlns =
      tcxData.xmlns ||
      "http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2";
    const xmlnsXsi =
      tcxData["xmlns:xsi"] || "http://www.w3.org/2001/XMLSchema-instance";
    const xsiSchemaLocation =
      tcxData["xsi:schemaLocation"] ||
      "http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2 http://www8.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd";

    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      `<TrainingCenterDatabase version="${this.escapeXMLAttribute(version)}"`,
      `                       creator="${this.escapeXMLAttribute(creator)}"`,
      `                       xmlns="${this.escapeXMLAttribute(xmlns)}"`,
      `                       xmlns:xsi="${this.escapeXMLAttribute(xmlnsXsi)}"`,
      `                       xsi:schemaLocation="${this.escapeXMLAttribute(
        xsiSchemaLocation
      )}">`,
    ].join("\n");
  }

  /**
   * Build TCX content
   */
  private buildTCXContent(tcxData: TCXFileType): string {
    const parts: string[] = [];

    // Build content in standard TCX order
    if (tcxData.Folders) {
      parts.push(this.buildFolders(tcxData.Folders));
    }

    if (tcxData.Activities) {
      parts.push(this.buildActivities(tcxData.Activities));
    }

    if (tcxData.Workouts) {
      parts.push(this.buildWorkouts(tcxData.Workouts));
    }

    if (tcxData.Courses) {
      parts.push(this.buildCourses(tcxData.Courses));
    }

    if (tcxData.Author) {
      parts.push(this.buildAuthor(tcxData.Author));
    }

    if (tcxData.Extensions) {
      parts.push(this.buildExtensions(tcxData.Extensions));
    }

    return parts.join("\n");
  }

  // ==================== Structure Element Building ====================

  /**
   * Build Folders element
   */
  private buildFolders(folders: FolderType): string {
    const parts: string[] = ["<Folders>"];

    if (folders.History) {
      parts.push(this.buildHistory(folders.History));
    }

    if (folders.Workouts) {
      parts.push(this.buildWorkouts(folders.Workouts));
    }

    if (folders.Courses) {
      // TODO: Handle Courses
      console.warn("Courses in Folders not yet implemented");
    }

    parts.push("</Folders>");
    return parts.join("\n  ");
  }

  /**
   * Build History element
   */
  private buildHistory(history: HistoryType): string {
    const parts: string[] = ["<History>"];

    if (history.Running) {
      parts.push(
        `<Running>${this.buildHistoryFolder(history.Running)}</Running>`
      );
    }

    if (history.Biking) {
      parts.push(`<Biking>${this.buildHistoryFolder(history.Biking)}</Biking>`);
    }

    if (history.Other) {
      parts.push(`<Other>${this.buildHistoryFolder(history.Other)}</Other>`);
    }

    if (history.MultiActivity) {
      parts.push(
        `<MultiActivity>${this.buildHistoryFolder(
          history.MultiActivity
        )}</MultiActivity>`
      );
    }

    if (history.Extensions) {
      parts.push(this.buildExtensions(history.Extensions));
    }

    parts.push("</History>");
    return parts.join("\n    ");
  }

  /**
   * Build HistoryFolder element
   */
  private buildHistoryFolder(folder: any): string {
    // TODO: Implement detailed HistoryFolder building
    return "";
  }

  /**
   * Build Activities element
   */
  private buildActivities(activities: ActivityListType): string {
    const parts: string[] = ["<Activities>"];

    if (activities.Activity) {
      activities.Activity.forEach((activity) => {
        parts.push(this.buildActivity(activity));
      });
    }

    if (activities.MultiActivitySession) {
      activities.MultiActivitySession.forEach((session) => {
        parts.push(this.buildMultiActivitySession(session));
      });
    }

    parts.push("</Activities>");
    return parts.join("\n  ");
  }

  /**
   * Build single Activity element
   */
  private buildActivity(activity: ActivityType): string {
    const sport = activity.Activity || "Other";
    const parts: string[] = [`<Activity Activity="${sport}">`];

    // ID is required
    parts.push(`<Id>${this.formatTime(activity.Id)}</Id>`);

    // Lap is required
    if (activity.Lap && activity.Lap.length > 0) {
      activity.Lap.forEach((lap) => {
        parts.push(this.buildActivityLap(lap));
      });
    }

    // Optional elements
    this.addOptionalElement(parts, "Notes", activity.Notes);

    if (activity.Training) {
      // TODO: Implement Training element
      console.warn("Activity Training not yet implemented");
    }

    if (activity.Creator) {
      // TODO: Implement Creator element
      console.warn("Activity Creator not yet implemented");
    }

    if (activity.Extensions) {
      parts.push(this.buildExtensions(activity.Extensions));
    }

    parts.push("</Activity>");
    return parts.join("\n    ");
  }

  /**
   * Build ActivityLap element
   */
  private buildActivityLap(lap: ActivityLapType): string {
    const parts: string[] = ["<Lap>"];

    // Time related
    this.addOptionalNumericElement(
      parts,
      "TotalTimeSeconds",
      lap.TotalTimeSeconds
    );
    this.addOptionalNumericElement(parts, "DistanceMeters", lap.DistanceMeters);
    this.addOptionalNumericElement(parts, "MaximumSpeed", lap.MaximumSpeed);
    this.addOptionalNumericElement(parts, "Calories", lap.Calories);

    // Heart rate
    if (lap.AverageHeartRateBpm) {
      parts.push(
        `<AverageHeartRateBpm xsi:type="HeartRateInBeatsPerMinute_t"><Value>${lap.AverageHeartRateBpm}</Value></AverageHeartRateBpm>`
      );
    }
    if (lap.MaximumHeartRateBpm) {
      parts.push(
        `<MaximumHeartRateBpm xsi:type="HeartRateInBeatsPerMinute_t"><Value>${lap.MaximumHeartRateBpm}</Value></MaximumHeartRateBpm>`
      );
    }

    // Other attributes
    this.addOptionalElement(parts, "Intensity", lap.Intensity);

    if (lap.Cadence) {
      parts.push(this.buildCadence(lap.Cadence));
    }

    this.addOptionalElement(parts, "TriggerMethod", lap.TriggerMethod);

    // Track data
    if (lap.Track) {
      lap.Track.forEach((track) => {
        parts.push(this.buildTrack(track));
      });
    }

    this.addOptionalElement(parts, "Notes", lap.Notes);

    if (lap.Extensions) {
      parts.push(this.buildExtensions(lap.Extensions));
    }

    parts.push("</Lap>");
    return parts.join("\n      ");
  }

  /**
   * Build Track element
   */
  private buildTrack(track: TrackType): string {
    const parts: string[] = ["<Track>"];

    if (track.Trackpoint) {
      track.Trackpoint.forEach((trackpoint) => {
        parts.push(this.buildTrackpoint(trackpoint));
      });
    }

    parts.push("</Track>");
    return parts.join("\n        ");
  }

  /**
   * Build Trackpoint element
   */
  private buildTrackpoint(trackpoint: TrackpointType): string {
    const parts: string[] = ["<Trackpoint>"];

    // Time (usually required)
    if (!trackpoint.Time) {
        return ""
    }
    parts.push(`<Time>${this.formatTime(trackpoint.Time)}</Time>`);

    // Position
    if (trackpoint.Position) {
      parts.push(this.buildPosition(trackpoint.Position));
    }

    // Numeric attributes
    this.addOptionalNumericElement(
      parts,
      "AltitudeMeters",
      trackpoint.AltitudeMeters
    );
    this.addOptionalNumericElement(
      parts,
      "DistanceMeters",
      trackpoint.DistanceMeters
    );

    // Heart rate
    if (trackpoint.HeartRateBpm) {
      parts.push(
        `<HeartRateBpm xsi:type="HeartRateInBeatsPerMinute_t"><Value>${trackpoint.HeartRateBpm}</Value></HeartRateBpm>`
      );
    }

    // Cadence
    if (trackpoint.Cadence) {
      parts.push(this.buildCadence(trackpoint.Cadence));
    }

    // Sensor state
    this.addOptionalElement(parts, "SensorState", trackpoint.SensorState);

    // Extensions
    if (trackpoint.Extensions) {
      parts.push(this.buildExtensions(trackpoint.Extensions));
    }

    parts.push("</Trackpoint>");
    return parts.join("\n          ");
  }

  /**
   * Build Position element
   */
  private buildPosition(position: PositionType): string {
    const parts: string[] = ["<Position>"];

    if (position?.LatitudeDegrees) {
      parts.push(
        `<LatitudeDegrees>${this.formatCoordinate(
          parseFloat(position.LatitudeDegrees)
        )}</LatitudeDegrees>`
      );
    }

    if (position?.LongitudeDegrees) {
      parts.push(
        `<LongitudeDegrees>${this.formatCoordinate(
          parseFloat(position.LongitudeDegrees)
        )}</LongitudeDegrees>`
      );
    }

    parts.push("</Position>");
    return parts.join("");
  }

  /**
   * Build Cadence element
   */
  private buildCadence(cadence: CadenceType): string {
    return `<Cadence><Low>${cadence.Low}</Low><High>${cadence.High}</High></Cadence>`;
  }

  /**
   * Build MultiActivitySession element
   */
  private buildMultiActivitySession(session: MultiActivitySessionType): string {
    const parts: string[] = ["<MultiActivitySession>"];

    if (session.Id) {
      parts.push(`<Id>${this.formatTime(session.Id)}</Id>`);
    }

    if (session.FirstActivity) {
      parts.push(this.buildFirstActivity(session.FirstActivity));
    }

    if (session.NextActivity) {
      session.NextActivity.forEach((nextActivity) => {
        parts.push(this.buildNextActivity(nextActivity));
      });
    }

    this.addOptionalElement(parts, "Notes", session.Notes);

    parts.push("</MultiActivitySession>");
    return parts.join("\n    ");
  }

  /**
   * Build FirstActivity element
   */
  private buildFirstActivity(firstActivity: FirstActivityType): string {
    const parts: string[] = ["<FirstActivity>"];

    if (firstActivity.Activity) {
      parts.push(this.buildActivity(firstActivity.Activity));
    }

    parts.push("</FirstActivity>");
    return parts.join("\n      ");
  }

  /**
   * Build NextActivity element
   */
  private buildNextActivity(nextActivity: NextActivityType): string {
    const parts: string[] = ["<NextActivity>"];

    if (nextActivity.Transition) {
      // Transition uses ActivityLap structure
      parts.push(
        `<Transition>${this.buildActivityLap(
          nextActivity.Transition
        )}</Transition>`
      );
    }

    if (nextActivity.Activity) {
      parts.push(this.buildActivity(nextActivity.Activity));
    }

    parts.push("</NextActivity>");
    return parts.join("\n      ");
  }

  /**
   * Build Workouts element
   */
  private buildWorkouts(workouts: WorkoutListType): string {
    // TODO: Implement Workouts building
    console.warn("Workouts building not yet implemented");
    return "<Workouts></Workouts>";
  }

  /**
   * Build Courses element
   */
  private buildCourses(courses: CourseListType): string {
    // TODO: Implement Courses building
    console.warn("Courses building not yet implemented");
    return "<Courses></Courses>";
  }

  /**
   * Build Author element
   */
  private buildAuthor(author: AbstractSourceType): string {
    const parts: string[] = ["<Author>"];

    this.addOptionalElement(parts, "Name", author.Name);

    parts.push("</Author>");
    return parts.join("");
  }

  // ==================== Extension Processing ====================

  /**
   * Build extensions element
   */
  private buildExtensions(extensions: ExtensionsType): string {
    const content = this.buildExtensionContent(extensions);
    return content ? `<Extensions>${content}</Extensions>` : "";
  }

  /**
   * Recursively build extension content
   */
  private buildExtensionContent(extension: ExtensionsType): string {
    return Object.entries(extension)
      .filter(([key]) => !key.startsWith("xmlns"))
      .map(([key, value]) => {
        if (value && typeof value === "object") {
          const content = this.buildExtensionContent(value as ExtensionsType);
          return `<${key}>${content}</${key}>`;
        } else if (value !== undefined && value !== null) {
          return `<${key}>${this.escapeXML(String(value))}</${key}>`;
        }
        return "";
      })
      .filter((content) => content)
      .join("");
  }

  // ==================== Helper Methods ====================

  /**
   * Format time
   */
  private formatTime(time: Date | string): string {
    // If it's a string and already in correct ISO format, use it directly
    if (typeof time === "string") {
      // Check if it's already in standard ISO 8601 format
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(time)) {
        return time;
      }
    }

    // For Date objects or other format strings, use dayjs processing
    return dayjs(time).utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
  }

  /**
   * Add optional element
   */
  private addOptionalElement(
    parts: string[],
    tagName: string,
    value: string | undefined,
    formatter?: (value: string) => string
  ): void {
    if (value !== undefined && value !== null && value !== "") {
      const formattedValue = formatter
        ? formatter(value)
        : this.escapeXML(value);
      parts.push(`<${tagName}>${formattedValue}</${tagName}>`);
    }
  }

  /**
   * Add optional numeric element
   */
  private addOptionalNumericElement(
    parts: string[],
    tagName: string,
    value: number | undefined
  ): void {
    if (value !== undefined && value !== null && !isNaN(value)) {
      parts.push(`<${tagName}>${value}</${tagName}>`);
    }
  }

  /**
   * Validate coordinate validity
   */
  private isValidCoordinate(lat: number, lon: number): boolean {
    return (
      lat !== undefined &&
      lat !== null &&
      lon !== undefined &&
      lon !== null &&
      !isNaN(lat) &&
      !isNaN(lon)
    );
  }

  /**
   * Format coordinate
   */
  private formatCoordinate(coord: number): string {
    return this.roundTo(coord, 6).toString();
  }

  /**
   * Round number
   */
  private roundTo(num: number, precision: number): number {
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
  }

  /**
   * XML escape
   */
  private escapeXML(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  /**
   * XML attribute value escape (specifically for safe escaping of attribute values)
   */
  private escapeXMLAttribute(text: string): string {
    if (typeof text !== "string") {
      return String(text || "");
    }
    return text
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\r/g, "&#13;")
      .replace(/\n/g, "&#10;")
      .replace(/\t/g, "&#9;");
  }

  /**
   * Deep clone
   */
  private deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime()) as T;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.deepClone(item)) as T;
    }

    const cloned = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = this.deepClone(obj[key]);
      }
    }
    return cloned;
  }

  // ==================== Backward Compatibility ====================

  /**
   * @deprecated Use encode() instead
   */
  encoder(node: TCXFileType): Promise<Buffer> {
    return this.encode(node);
  }
}
