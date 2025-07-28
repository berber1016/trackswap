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

// Configure dayjs UTC plugin
dayjs.extend(utc);

/**
 * GPX encoder - encodes GPX11Type data to GPX XML format
 */
export class GPXEncoder {
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
   * Encode GPX data to Buffer
   */
  async encode(gpxData: GPX11Type): Promise<Buffer> {
    const xmlContent = this.buildGPXXML(gpxData);
    return Buffer.from(xmlContent, "utf-8");
  }

  /**
   * Encode GPX data to XML string
   */
  encodeToString(gpxData: GPX11Type): string {
    return this.buildGPXXML(gpxData);
  }

  // ==================== Core Build Methods ====================

  /**
   * Build complete GPX XML
   */
  private buildGPXXML(gpxData: GPX11Type): string {
    const header = this.buildXMLHeader();
    const content = this.buildGPXContent(gpxData);
    const footer = "</gpx>";

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
   * Build GPX content
   */
  private buildGPXContent(gpxData: GPX11Type): string {
    const {
      metadata,
      wpt: waypoints = [],
      rte: routes = [],
      trk: tracks = [],
    } = gpxData;
    const parts: string[] = [];

    // Build content in standard GPX order
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

  // ==================== Metadata Building ====================

  /**
   * Build metadata element
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
   * Build author element
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
   * Build copyright element
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
   * Build bounds element
   */
  private buildBounds(bounds: BoundsType): string {
    // Ensure numeric values are safely converted to strings and escaped
    const minlat = this.escapeXMLAttribute((bounds.minlat || 0).toString());
    const minlon = this.escapeXMLAttribute((bounds.minlon || 0).toString());
    const maxlat = this.escapeXMLAttribute((bounds.maxlat || 0).toString());
    const maxlon = this.escapeXMLAttribute((bounds.maxlon || 0).toString());

    return `<bounds minlat="${minlat}" minlon="${minlon}" maxlat="${maxlat}" maxlon="${maxlon}"/>`;
  }

  // ==================== Waypoint Building ====================

  /**
   * Build waypoint element
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

    // Basic attributes
    this.addOptionalElement(
      parts,
      "ele",
      point.ele?.toString(),
      this.formatElevation
    );

    if (point.time) {
      parts.push(this.buildTimeElement(point.time));
    }

    // Add speed and course information
    this.addOptionalElement(parts, "speed", point.speed?.toString());
    this.addOptionalElement(parts, "course", point.course?.toString());

    // GPX standard attributes
    this.addStandardWaypointElements(parts, point);

    // Extension attributes
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
   * Add standard waypoint elements
   */
  private addStandardWaypointElements(parts: string[], point: WptType): void {
    // Add elements in GPX standard order
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

  // ==================== Route Building ====================

  /**
   * Build rte element
   */
  private buildRoute(route: RteType): string {
    const parts: string[] = ["<rte>"];

    this.addRouteTrackCommonElements(parts, route);

    // Route points
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

  // ==================== Track Building ====================

  /**
   * Build track element
   */
  private buildTrack(track: TrkType): string {
    const parts: string[] = ["<trk>"];

    this.addRouteTrackCommonElements(parts, track);

    // Track segments
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
   * Build track segment element
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
   * Add common elements for route and track
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

  // ==================== Extension Processing ====================

  /**
   * Process point extension attributes
   */
  private processPointExtensions(
    point: WptType,
    extensions: ExtensionsType
  ): ExtensionsType {
    const result: ExtensionsType = {};

    // 定义扩展结构模板
    const extensionStructures = {
      "gpxtpx:TrackPointExtension": {
        "gpxtpx:hr": "heartRate",
        "gpxtpx:cad": "cadence",
        "gpxtpx:speed": "speed",
        "gpxtpx:atemp": "temperature",
        "gpxtpx:wtemp": "wtemp",
        "gpxtpx:temp": "temperature",
      },
      "gpxpx:PowerExtension": {
        "gpxpx:PowerInWatts": "power",
      },
      "gpxx:GpxExtensions": {
        "gpxx:Temperature": "temperature",
        "gpxx:Depth": "depth",
      },
    };

    // 为每个扩展结构收集数据
    Object.entries(extensionStructures).forEach(
      ([extensionName, fieldMappings]) => {
        const extensionData: Record<string, any> = {};
        let hasData = false;

        // 遍历字段映射
        Object.entries(fieldMappings).forEach(
          ([extensionField, pointField]) => {
            let value = undefined;

            // 策略1: 直接从 point 字段获取
            if ((point as any)[pointField] !== undefined) {
              value = (point as any)[pointField];
            }
            // 策略2: 从扁平化的 extensions 中查找（完全匹配或 :field 结尾）
            else if (extensions) {
              // 完全匹配
              if (extensions[extensionField] !== undefined) {
                value = extensions[extensionField];
              }
              // :field 结尾匹配
              else {
                const fieldName = extensionField.split(":").pop(); // 获取 : 后面的部分
                Object.entries(extensions).forEach(([key, val]) => {
                  if (key.endsWith(`:${fieldName}`) && val !== undefined) {
                    value = val;
                  }
                });
              }
            }

            if (value !== undefined) {
              extensionData[extensionField] = value;
              hasData = true;
            }
          }
        );

        // 如果有数据，添加到结果中
        if (hasData) {
          result[extensionName] = extensionData;
        }
      }
    );

    return result;
  }

  /**
   * Build TrackPoint extension
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
   * Build Power extension
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
   * Build GPX extensions
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
   * Build extensions element
   */
  private buildExtensions(extensions: ExtensionsType): string {
    const content = this.buildExtensionContent(extensions);
    return content ? `<extensions>${content}</extensions>` : "";
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
   * Build link element
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
   * Add multiple link elements
   */
  private addLinks(parts: string[], links: LinkType | LinkType[]): void {
    const linkArray = Array.isArray(links) ? links : [links];
    linkArray.forEach((link) => {
      parts.push(this.buildLink(link));
    });
  }

  /**
   * Build time element
   */
  private buildTimeElement(time: Date | string): string {
    // If it's a string and already in correct ISO format, use it directly
    if (typeof time === "string") {
      // Check if it's already in standard ISO 8601 format
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z?$/.test(time)) {
        return `<time>${time}</time>`;
      }
    }

    // For Date objects or other format strings, use dayjs processing
    // Generate UTC time format without milliseconds, consistent with original GPX file format
    const timeStr = dayjs(time).utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
    return `<time>${timeStr}</time>`;
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
   * Format elevation
   */
  private formatElevation = (elevation: string): string => {
    const num = parseFloat(elevation);
    return isNaN(num) ? elevation : this.roundTo(num, 2).toString();
  };

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
  encoder(node: GPX11Type): Promise<Buffer> {
    return this.encode(node);
  }
}

export default {
  GPXEncoder,
};
