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
  MultiSportSessionType,
  FirstSportType,
  NextSportType,
  AbstractSourceType,
  FolderType,
  HistoryType,
  WorkoutListType,
  CourseListType,
  HeartRateInBeatsPerMinuteType,
  CadenceType,
} from "./types.js";
import { ExtensionsType } from "../types.js";

// 配置 dayjs UTC 插件
dayjs.extend(utc);

/**
 * TCX 编码器 - 将 TCXFileType 数据编码为 TCX XML 格式
 */
export class TCXEncoder {
  private compact: boolean;

  /**
   * 构造函数
   * @param options 编码器选项
   */
  constructor(options: { compact?: boolean } = {}) {
    this.compact = options.compact ?? true;
  }

  // ==================== 公共接口 ====================

  /**
   * 编码 TCX 数据为 Buffer
   */
  async encode(tcxData: TCXFileType): Promise<Buffer> {
    const xmlContent = this.buildTCXXML(tcxData);
    return Buffer.from(xmlContent, "utf-8");
  }

  /**
   * 编码 TCX 数据为 XML 字符串
   */
  encodeToString(tcxData: TCXFileType): string {
    return this.buildTCXXML(tcxData);
  }

  // ==================== 核心构建方法 ====================

  /**
   * 构建完整的 TCX XML
   */
  private buildTCXXML(tcxData: TCXFileType): string {
    const header = this.buildXMLHeader(tcxData);
    const content = this.buildTCXContent(tcxData);
    const footer = "</TrainingCenterDatabase>";

    const xml = `${header}${content}\n${footer}`;

    // 如果启用压缩模式，则压缩XML
    return this.compact ? this.compressXML(xml) : xml;
  }

  /**
   * 压缩XML字符串，去掉多余的换行和空格
   */
  private compressXML(xml: string): string {
    return (
      xml
        // 去掉标签之间的换行和多余空格
        .replace(/>\s+</g, "><")
        // 去掉行首行尾的空白字符
        .replace(/^\s+|\s+$/gm, "")
        // 将多个连续空格替换为单个空格
        .replace(/\s+/g, " ")
        // 去掉整体的首尾空白
        .trim()
    );
  }

  /**
   * 构建 XML 头部
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
   * 构建 TCX 内容
   */
  private buildTCXContent(tcxData: TCXFileType): string {
    const parts: string[] = [];

    // 按标准 TCX 顺序构建内容
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

  // ==================== 结构元素构建 ====================

  /**
   * 构建 Folders 元素
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
      // TODO: 处理 Courses
      console.warn("Courses in Folders 暂未实现");
    }

    parts.push("</Folders>");
    return parts.join("\n  ");
  }

  /**
   * 构建 History 元素
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

    if (history.MultiSport) {
      parts.push(
        `<MultiSport>${this.buildHistoryFolder(
          history.MultiSport
        )}</MultiSport>`
      );
    }

    if (history.Extensions) {
      parts.push(this.buildExtensions(history.Extensions));
    }

    parts.push("</History>");
    return parts.join("\n    ");
  }

  /**
   * 构建 HistoryFolder 元素
   */
  private buildHistoryFolder(folder: any): string {
    // TODO: 实现详细的 HistoryFolder 构建
    return "";
  }

  /**
   * 构建 Activities 元素
   */
  private buildActivities(activities: ActivityListType): string {
    const parts: string[] = ["<Activities>"];

    if (activities.Activity) {
      activities.Activity.forEach((activity) => {
        parts.push(this.buildActivity(activity));
      });
    }

    if (activities.MultiSportSession) {
      activities.MultiSportSession.forEach((session) => {
        parts.push(this.buildMultiSportSession(session));
      });
    }

    parts.push("</Activities>");
    return parts.join("\n  ");
  }

  /**
   * 构建单个 Activity 元素
   */
  private buildActivity(activity: ActivityType): string {
    const sport = activity.Sport || "Other";
    const parts: string[] = [`<Activity Sport="${sport}">`];

    // ID 是必需的
    parts.push(`<Id>${this.formatTime(activity.Id)}</Id>`);

    // Lap 是必需的
    if (activity.Lap && activity.Lap.length > 0) {
      activity.Lap.forEach((lap) => {
        parts.push(this.buildActivityLap(lap));
      });
    }

    // 可选元素
    this.addOptionalElement(parts, "Notes", activity.Notes);

    if (activity.Training) {
      // TODO: 实现 Training 元素
      console.warn("Activity Training 暂未实现");
    }

    if (activity.Creator) {
      // TODO: 实现 Creator 元素
      console.warn("Activity Creator 暂未实现");
    }

    if (activity.Extensions) {
      parts.push(this.buildExtensions(activity.Extensions));
    }

    parts.push("</Activity>");
    return parts.join("\n    ");
  }

  /**
   * 构建 ActivityLap 元素
   */
  private buildActivityLap(lap: ActivityLapType): string {
    const parts: string[] = ["<Lap>"];

    // 时间相关
    this.addOptionalNumericElement(
      parts,
      "TotalTimeSeconds",
      lap.TotalTimeSeconds
    );
    this.addOptionalNumericElement(parts, "DistanceMeters", lap.DistanceMeters);
    this.addOptionalNumericElement(parts, "MaximumSpeed", lap.MaximumSpeed);
    this.addOptionalNumericElement(parts, "Calories", lap.Calories);

    // 心率
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

    // 其他属性
    this.addOptionalElement(parts, "Intensity", lap.Intensity);

    if (lap.Cadence) {
      parts.push(this.buildCadence(lap.Cadence));
    }

    this.addOptionalElement(parts, "TriggerMethod", lap.TriggerMethod);

    // Track 数据
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
   * 构建 Track 元素
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
   * 构建 Trackpoint 元素
   */
  private buildTrackpoint(trackpoint: TrackpointType): string {
    const parts: string[] = ["<Trackpoint>"];

    // 时间（通常是必需的）
    if (trackpoint.Time) {
      parts.push(`<Time>${this.formatTime(trackpoint.Time)}</Time>`);
    }

    // 位置
    if (trackpoint.Position) {
      parts.push(this.buildPosition(trackpoint.Position));
    }

    // 数值属性
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

    // 心率
    if (trackpoint.HeartRateBpm) {
      parts.push(
        `<HeartRateBpm xsi:type="HeartRateInBeatsPerMinute_t"><Value>${trackpoint.HeartRateBpm}</Value></HeartRateBpm>`
      );
    }

    // 踏频
    if (trackpoint.Cadence) {
      parts.push(this.buildCadence(trackpoint.Cadence));
    }

    // 传感器状态
    this.addOptionalElement(parts, "SensorState", trackpoint.SensorState);

    // 扩展
    if (trackpoint.Extensions) {
      parts.push(this.buildExtensions(trackpoint.Extensions));
    }

    parts.push("</Trackpoint>");
    return parts.join("\n          ");
  }

  /**
   * 构建 Position 元素
   */
  private buildPosition(position: PositionType): string {
    const parts: string[] = ["<Position>"];

    if (position.LatitudeDegrees) {
      parts.push(
        `<LatitudeDegrees>${this.formatCoordinate(
          parseFloat(position.LatitudeDegrees)
        )}</LatitudeDegrees>`
      );
    }

    if (position.LongitudeDegrees) {
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
   * 构建 Cadence 元素
   */
  private buildCadence(cadence: CadenceType): string {
    return `<Cadence><Low>${cadence.Low}</Low><High>${cadence.High}</High></Cadence>`;
  }

  /**
   * 构建 MultiSportSession 元素
   */
  private buildMultiSportSession(session: MultiSportSessionType): string {
    const parts: string[] = ["<MultiSportSession>"];

    if (session.Id) {
      parts.push(`<Id>${this.formatTime(session.Id)}</Id>`);
    }

    if (session.FirstSport) {
      parts.push(this.buildFirstSport(session.FirstSport));
    }

    if (session.NextSport) {
      session.NextSport.forEach((nextSport) => {
        parts.push(this.buildNextSport(nextSport));
      });
    }

    this.addOptionalElement(parts, "Notes", session.Notes);

    parts.push("</MultiSportSession>");
    return parts.join("\n    ");
  }

  /**
   * 构建 FirstSport 元素
   */
  private buildFirstSport(firstSport: FirstSportType): string {
    const parts: string[] = ["<FirstSport>"];

    if (firstSport.Activity) {
      parts.push(this.buildActivity(firstSport.Activity));
    }

    parts.push("</FirstSport>");
    return parts.join("\n      ");
  }

  /**
   * 构建 NextSport 元素
   */
  private buildNextSport(nextSport: NextSportType): string {
    const parts: string[] = ["<NextSport>"];

    if (nextSport.Transition) {
      // Transition 使用 ActivityLap 结构
      parts.push(
        `<Transition>${this.buildActivityLap(
          nextSport.Transition
        )}</Transition>`
      );
    }

    if (nextSport.Activity) {
      parts.push(this.buildActivity(nextSport.Activity));
    }

    parts.push("</NextSport>");
    return parts.join("\n      ");
  }

  /**
   * 构建 Workouts 元素
   */
  private buildWorkouts(workouts: WorkoutListType): string {
    // TODO: 实现 Workouts 构建
    console.warn("Workouts 构建暂未实现");
    return "<Workouts></Workouts>";
  }

  /**
   * 构建 Courses 元素
   */
  private buildCourses(courses: CourseListType): string {
    // TODO: 实现 Courses 构建
    console.warn("Courses 构建暂未实现");
    return "<Courses></Courses>";
  }

  /**
   * 构建 Author 元素
   */
  private buildAuthor(author: AbstractSourceType): string {
    const parts: string[] = ["<Author>"];

    this.addOptionalElement(parts, "Name", author.Name);

    parts.push("</Author>");
    return parts.join("");
  }

  // ==================== 扩展处理 ====================

  /**
   * 构建扩展元素
   */
  private buildExtensions(extensions: ExtensionsType): string {
    const content = this.buildExtensionContent(extensions);
    return content ? `<Extensions>${content}</Extensions>` : "";
  }

  /**
   * 递归构建扩展内容
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

  // ==================== 辅助方法 ====================

  /**
   * 格式化时间
   */
  private formatTime(time: Date | string): string {
    // 如果是字符串且已经是正确的ISO格式，直接使用
    if (typeof time === "string") {
      // 检查是否已经是标准的ISO 8601格式
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(time)) {
        return time;
      }
    }

    // 对于Date对象或其他格式的字符串，使用dayjs处理
    return dayjs(time).utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
  }

  /**
   * 添加可选元素
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
   * 添加可选数值元素
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
   * 验证坐标有效性
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
   * 格式化坐标
   */
  private formatCoordinate(coord: number): string {
    return this.roundTo(coord, 6).toString();
  }

  /**
   * 数字四舍五入
   */
  private roundTo(num: number, precision: number): number {
    const factor = Math.pow(10, precision);
    return Math.round(num * factor) / factor;
  }

  /**
   * XML 转义
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
   * XML 属性值转义（专门用于属性值的安全转义）
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
   * 深度拷贝
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

  // ==================== 向后兼容 ====================

  /**
   * @deprecated 使用 encode() 替代
   */
  encoder(node: TCXFileType): Promise<Buffer> {
    return this.encode(node);
  }
}
