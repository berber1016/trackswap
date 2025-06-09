import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import {
  GpxExtensionsv3Mapping,
  TrackPointExtensionv1Mapping,
} from "./extensions/index.js";
import {
  GPX11Type,
  TrkType,
  RteType,
  WptType,
  TrksegType,
  MetadataType,
  LinkType,
  PersonType,
  CopyrightType,
  BoundsType,
} from "./types.js";
import { ExtensionsType } from "../types.js";

// 配置 dayjs UTC 插件
dayjs.extend(utc);

/**
 * GPX 编码器 - 将 GPX11Type 数据编码为 GPX XML 格式
 */
export class GPXEncoder {
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
   * 编码 GPX 数据为 Buffer
   */
  async encode(gpxData: GPX11Type): Promise<Buffer> {
    const xmlContent = this.buildGPXXML(gpxData);
    return Buffer.from(xmlContent, "utf-8");
  }

  /**
   * 编码 GPX 数据为 XML 字符串
   */
  encodeToString(gpxData: GPX11Type): string {
    return this.buildGPXXML(gpxData);
  }

  // ==================== 核心构建方法 ====================

  /**
   * 构建完整的 GPX XML
   */
  private buildGPXXML(gpxData: GPX11Type): string {
    const header = this.buildXMLHeader();
    const content = this.buildGPXContent(gpxData);
    const footer = "</gpx>";

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
  private buildXMLHeader(): string {
    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<gpx creator="https://gpxonline.net" version="1.1"',
      '     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
      '     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd',
      "                        http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd",
      "                        http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd",
      "                        http://www.garmin.com/xmlschemas/PowerExtension/v1 http://www.garmin.com/xmlschemas/PowerExtensionv1.xsd",
      '                        http://www.topografix.com/GPX/gpx_style/0/2 http://www.topografix.com/GPX/gpx_style/0/2/gpx_style.xsd"',
      '     xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1"',
      '     xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3"',
      '     xmlns:gpxpx="http://www.garmin.com/xmlschemas/PowerExtension/v1"',
      '     xmlns:gpx_style="http://www.topografix.com/GPX/gpx_style/0/2"',
      '     xmlns="http://www.topografix.com/GPX/1/1">',
    ].join("\n");
  }

  /**
   * 构建 GPX 内容
   */
  private buildGPXContent(gpxData: GPX11Type): string {
    const {
      metadata,
      wpt: waypoints = [],
      rte: routes = [],
      trk: tracks = [],
    } = gpxData;
    const parts: string[] = [];

    // 按标准 GPX 顺序构建内容
    if (metadata) {
      parts.push(this.buildMetadata(metadata));
    }

    waypoints.forEach((wpt) => {
      parts.push(this.buildWaypoint(wpt, "wpt"));
    });

    routes.forEach((route) => {
      parts.push(this.buildRoute(route));
    });

    tracks.forEach((track) => {
      parts.push(this.buildTrack(track));
    });

    return parts.join("\n");
  }

  // ==================== 元数据构建 ====================

  /**
   * 构建 metadata 元素
   */
  private buildMetadata(metadata: MetadataType): string {
    const parts: string[] = ["<metadata>"];

    this.addOptionalElement(parts, "name", metadata.name);
    this.addOptionalElement(parts, "desc", metadata.desc);

    if (metadata.author) {
      parts.push(this.buildAuthor(metadata.author));
    }

    if (metadata.copyright) {
      parts.push(this.buildCopyright(metadata.copyright));
    }

    if (metadata.link) {
      this.addLinks(parts, metadata.link);
    }

    if (metadata.time) {
      parts.push(this.buildTimeElement(metadata.time));
    }

    this.addOptionalElement(parts, "keywords", metadata.keywords);

    if (metadata.bounds) {
      parts.push(this.buildBounds(metadata.bounds));
    }

    if (metadata.extensions) {
      parts.push(this.buildExtensions(metadata.extensions));
    }

    parts.push("</metadata>");
    return parts.join("\n  ");
  }

  /**
   * 构建 author 元素
   */
  private buildAuthor(author: PersonType): string {
    const parts: string[] = ["<author>"];

    this.addOptionalElement(parts, "name", author.name);

    if (author.email) {
      parts.push(
        `<email id="${this.escapeXML(
          author.email.id || ""
        )}" domain="${this.escapeXML(author.email.domain || "")}"/>`
      );
    }

    if (author.link) {
      parts.push(this.buildLink(author.link));
    }

    parts.push("</author>");
    return parts.join("\n    ");
  }

  /**
   * 构建 copyright 元素
   */
  private buildCopyright(copyright: CopyrightType): string {
    const parts: string[] = [
      `<copyright author="${this.escapeXML(copyright.author || "")}">`,
    ];

    this.addOptionalElement(parts, "year", copyright.year);
    this.addOptionalElement(parts, "license", copyright.license);

    parts.push("</copyright>");
    return parts.join("\n    ");
  }

  /**
   * 构建 bounds 元素
   */
  private buildBounds(bounds: BoundsType): string {
    // 确保数值安全转换为字符串并转义
    const minlat = this.escapeXMLAttribute((bounds.minlat || 0).toString());
    const minlon = this.escapeXMLAttribute((bounds.minlon || 0).toString());
    const maxlat = this.escapeXMLAttribute((bounds.maxlat || 0).toString());
    const maxlon = this.escapeXMLAttribute((bounds.maxlon || 0).toString());

    return `<bounds minlat="${minlat}" minlon="${minlon}" maxlat="${maxlat}" maxlon="${maxlon}"/>`;
  }

  // ==================== 航路点构建 ====================

  /**
   * 构建航路点元素
   */
  private buildWaypoint(
    point: WptType,
    tagName: "wpt" | "trkpt" | "rtept"
  ): string {
    if (!this.isValidCoordinate(point.lat, point.lon)) {
      return "";
    }

    const parts: string[] = [
      `<${tagName} lat="${this.escapeXMLAttribute(
        this.formatCoordinate(point.lat)
      )}" lon="${this.escapeXMLAttribute(this.formatCoordinate(point.lon))}">`,
    ];

    // 基础属性
    this.addOptionalElement(
      parts,
      "ele",
      point.ele?.toString(),
      this.formatElevation
    );

    if (point.time) {
      parts.push(this.buildTimeElement(point.time));
    }

    // 添加速度和航向信息
    this.addOptionalElement(parts, "speed", point.speed?.toString());
    this.addOptionalElement(parts, "course", point.course?.toString());

    // GPX 标准属性
    this.addStandardWaypointElements(parts, point);

    // 扩展属性
    if (point.extensions) {
      const processedExtensions = this.processPointExtensions(
        point,
        point.extensions
      );
      if (Object.keys(processedExtensions).length > 0) {
        parts.push(this.buildExtensions(processedExtensions));
      }
    }

    parts.push(`</${tagName}>`);
    return parts.join("\n    ");
  }

  /**
   * 添加标准航路点元素
   */
  private addStandardWaypointElements(parts: string[], point: WptType): void {
    // 按 GPX 标准顺序添加元素
    this.addOptionalElement(parts, "magvar", point.magvar?.toString());
    this.addOptionalElement(
      parts,
      "geoidheight",
      point.geoidheight?.toString()
    );
    this.addOptionalElement(parts, "name", point.name);
    this.addOptionalElement(parts, "cmt", point.cmt);
    this.addOptionalElement(parts, "desc", point.desc);
    this.addOptionalElement(parts, "src", point.src);

    if (point.link) {
      this.addLinks(parts, point.link);
    }

    this.addOptionalElement(parts, "sym", point.sym);
    this.addOptionalElement(parts, "type", point.type);
    this.addOptionalElement(parts, "fix", point.fix);
    this.addOptionalElement(parts, "sat", point.sat);
    this.addOptionalElement(parts, "hdop", point.hdop?.toString());
    this.addOptionalElement(parts, "vdop", point.vdop?.toString());
    this.addOptionalElement(parts, "pdop", point.pdop?.toString());
    this.addOptionalElement(
      parts,
      "ageofdgpsdata",
      point.ageofdgpsdata?.toString()
    );
    this.addOptionalElement(parts, "dgpsid", point.dgpsid?.toString());
  }

  // ==================== 路线构建 ====================

  /**
   * 构建 rte 元素
   */
  private buildRoute(route: RteType): string {
    const parts: string[] = ["<rte>"];

    this.addRouteTrackCommonElements(parts, route);

    // 路线点
    if (route.rtept) {
      route.rtept?.forEach((point) => {
        parts.push(this.buildWaypoint(point, "rtept"));
      });
    }

    if (route.extensions) {
      parts.push(this.buildExtensions(route.extensions));
    }

    parts.push("</rte>");
    return parts.join("\n  ");
  }

  // ==================== 轨迹构建 ====================

  /**
   * 构建轨迹元素
   */
  private buildTrack(track: TrkType): string {
    const parts: string[] = ["<trk>"];

    this.addRouteTrackCommonElements(parts, track);

    // 轨迹段
    if (track.trkseg) {
      track.trkseg.forEach((segment) => {
        parts.push(this.buildTrackSegment(segment));
      });
    }

    if (track.extensions) {
      parts.push(this.buildExtensions(track.extensions));
    }

    parts.push("</trk>");
    return parts.join("\n  ");
  }

  /**
   * 构建轨迹段元素
   */
  private buildTrackSegment(segment: TrksegType): string {
    const parts: string[] = ["<trkseg>"];

    if (segment.trkpt) {
      segment.trkpt.forEach((point) => {
        parts.push(this.buildWaypoint(point, "trkpt"));
      });
    }

    if (segment.extensions) {
      parts.push(this.buildExtensions(segment.extensions));
    }

    parts.push("</trkseg>");
    return parts.join("\n    ");
  }

  /**
   * 添加路线和轨迹的公共元素
   */
  private addRouteTrackCommonElements(
    parts: string[],
    item: RteType | TrkType
  ): void {
    this.addOptionalElement(parts, "name", item.name);
    this.addOptionalElement(parts, "cmt", item.cmt);
    this.addOptionalElement(parts, "desc", item.desc);
    this.addOptionalElement(parts, "src", item.src);

    if (item.link) {
      this.addLinks(parts, item.link);
    }

    this.addOptionalElement(parts, "number", item.number?.toString());
    this.addOptionalElement(parts, "type", item.type);
  }

  // ==================== 扩展处理 ====================

  /**
   * 处理点的扩展属性
   */
  private processPointExtensions(
    point: WptType,
    extensions: ExtensionsType
  ): ExtensionsType {
    const result = this.deepClone(extensions);

    // 处理各种扩展
    const trackPointExt = this.buildTrackPointExtension(point, extensions);
    if (Object.keys(trackPointExt).length > 0) {
      result["gpxtpx:TrackPointExtension"] = trackPointExt;
    }

    const powerExt = this.buildPowerExtension(point, extensions);
    if (Object.keys(powerExt).length > 0) {
      result["gpxpx:PowerExtension"] = powerExt;
    }

    const gpxExt = this.buildGpxExtensions(point, extensions);
    if (Object.keys(gpxExt).length > 0) {
      result["gpxx:GpxExtensions"] = gpxExt;
    }

    return result;
  }

  /**
   * 构建 TrackPoint 扩展
   */
  private buildTrackPointExtension(
    point: WptType,
    extensions: ExtensionsType
  ): Record<string, any> {
    const result = this.deepClone(
      extensions["gpxtpx:TrackPointExtension"] || {}
    ) as Record<string, any>;

    const mappingKeys = Object.keys(TrackPointExtensionv1Mapping);
    Object.keys(point)
      .filter((key) => mappingKeys.includes(key))
      .forEach((key) => {
        const mappedKey = (
          TrackPointExtensionv1Mapping as Record<string, string>
        )[key];
        if (mappedKey && (point as any)[key] !== undefined) {
          result[`gpxtpx:${mappedKey}`] = (point as any)[key];
        }
      });

    return result;
  }

  /**
   * 构建 Power 扩展
   */
  private buildPowerExtension(
    point: WptType,
    extensions: ExtensionsType
  ): Record<string, any> {
    return this.deepClone(extensions["gpxpx:PowerExtension"] || {}) as Record<
      string,
      any
    >;
  }

  /**
   * 构建 GPX 扩展
   */
  private buildGpxExtensions(
    point: WptType,
    extensions: ExtensionsType
  ): Record<string, any> {
    const result = this.deepClone(
      extensions["gpxx:GpxExtensions"] || {}
    ) as Record<string, any>;

    const mappingKeys = Object.keys(GpxExtensionsv3Mapping);
    Object.keys(point)
      .filter((key) => mappingKeys.includes(key))
      .forEach((key) => {
        const mappedKey = (GpxExtensionsv3Mapping as Record<string, string>)[
          key
        ];
        if (mappedKey && (point as any)[key] !== undefined) {
          result[`gpxx:${mappedKey}`] = (point as any)[key];
        }
      });

    return result;
  }

  /**
   * 构建扩展元素
   */
  private buildExtensions(extensions: ExtensionsType): string {
    const content = this.buildExtensionContent(extensions);
    return content ? `<extensions>${content}</extensions>` : "";
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
   * 构建 link 元素
   */
  private buildLink(link: LinkType): string {
    const parts: string[] = [
      `<link href="${this.escapeXMLAttribute(link.href || "")}">`,
    ];

    this.addOptionalElement(parts, "text", link.text);
    this.addOptionalElement(parts, "type", link.type);

    parts.push("</link>");
    return parts.join("");
  }

  /**
   * 添加多个 link 元素
   */
  private addLinks(parts: string[], links: LinkType | LinkType[]): void {
    const linkArray = Array.isArray(links) ? links : [links];
    linkArray.forEach((link) => {
      parts.push(this.buildLink(link));
    });
  }

  /**
   * 构建时间元素
   */
  private buildTimeElement(time: Date | string): string {
    // 如果是字符串且已经是正确的ISO格式，直接使用
    if (typeof time === "string") {
      // 检查是否已经是标准的ISO 8601格式
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z?$/.test(time)) {
        return `<time>${time}</time>`;
      }
    }

    // 对于Date对象或其他格式的字符串，使用dayjs处理
    // 生成不带毫秒的UTC时间格式，与原始GPX文件格式保持一致
    const timeStr = dayjs(time).utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
    return `<time>${timeStr}</time>`;
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
   * 格式化高程
   */
  private formatElevation = (elevation: string): string => {
    const num = parseFloat(elevation);
    return isNaN(num) ? elevation : this.roundTo(num, 2).toString();
  };

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
  encoder(node: GPX11Type): Promise<Buffer> {
    return this.encode(node);
  }
}

export default {
  GPXEncoder,
};
