import { TRACKSWAP_HEALTH_PARSER_VERSION } from "../FIT/health.js";
import { buildCoursePlanFromActivity } from "../FIT/course-plan.js";
import { FITDecoder } from "../FIT/decoder.js";
import { FITEncoder } from "../FIT/encoder.js";
import { encodeCourse } from "../FIT/encoderCourse.js";
import type { FITFileType } from "../FIT/types.js";
import { GPXDecoder } from "../GPX/decoder.js";
import { GPXEncoder } from "../GPX/encoder.js";
import type { GPX11Type } from "../GPX/types.js";
import { TCXDecoder } from "../TCX/decoder.js";
import { TCXEncoder } from "../TCX/encoder.js";
import type { TCXFileType } from "../TCX/types.js";
import { ActivityProcessor } from "../activity/processor.js";
import type {
  AdapterDecodeResult,
  FITCourseAdapter,
  TrackFormatAdapter,
} from "./format-adapter.js";
import type {
  DecodeOptions,
  TrackDocumentKind,
  TrackFormat,
} from "../document.js";
import type { FileType } from "../types.js";

const FIT_SIGNATURE_OFFSET = 8;
const FIT_SIGNATURE = ".FIT";

function xmlPrefix(input: Buffer): string {
  return input
    .toString("utf8", 0, Math.min(input.length, 4096))
    .replace(/^\uFEFF/, "");
}

export function detectBuiltInFormat(input: Buffer): TrackFormat | undefined {
  if (
    input.length >= 12 &&
    input.toString("ascii", FIT_SIGNATURE_OFFSET, FIT_SIGNATURE_OFFSET + 4) ===
      FIT_SIGNATURE
  ) {
    return "fit";
  }
  const prefix = xmlPrefix(input);
  if (/<gpx\b/i.test(prefix)) return "gpx";
  if (/<TrainingCenterDatabase\b/i.test(prefix)) {
    return "tcx";
  }
  return undefined;
}

abstract class BuiltInAdapter<TNative> implements TrackFormatAdapter<TNative> {
  abstract readonly format: TrackFormat;
  protected readonly activities: ActivityProcessor;

  constructor(activities: ActivityProcessor) {
    this.activities = activities;
  }

  matches(input: Buffer): boolean {
    return detectBuiltInFormat(input) === this.format;
  }

  abstract decode(
    input: Buffer,
    options: DecodeOptions
  ): Promise<AdapterDecodeResult<TNative>>;

  abstract encodeActivity(activity: FileType): Promise<Buffer>;
}

export class FITAdapter
  extends BuiltInAdapter<FITFileType>
  implements FITCourseAdapter
{
  readonly format = "fit" as const;
  private decoder?: FITDecoder;
  private encoder?: FITEncoder;

  private getDecoder(): FITDecoder {
    return (this.decoder ??= new FITDecoder());
  }

  private getEncoder(): FITEncoder {
    return (this.encoder ??= new FITEncoder());
  }

  async decode(
    input: Buffer,
    options: DecodeOptions
  ): Promise<AdapterDecodeResult<FITFileType>> {
    const native = await this.getDecoder().parseByBuffer(input, {
      userData: { fitDocumentOptions: options.fit ?? {} },
    });
    if (!native) throw new Error("FIT decoder returned an empty result");

    const kinds =
      native.fitDocumentMetadata?.detectedKinds ?? (["unknown"] as const);
    const activity = kinds.includes("activity")
      ? await this.activities.convertToActivity(native, "fit")
      : undefined;
    const fitDiagnostics = native.healthDocument?.diagnostics ?? {
      parserVersion: TRACKSWAP_HEALTH_PARSER_VERSION,
      messageCounts: native.fitDocumentMetadata?.messageCounts ?? {},
      recognizedMessageCounts: {},
      unknownMessageCounts: {},
      invalidValueCounts: {},
      warnings: [],
    };
    const fileId = native.fileIdMesgs?.[0];
    const fileIdRecord = fileId as
      | (Record<string, unknown> & NonNullable<typeof fileId>)
      | undefined;
    const fileCreator = native.fileCreatorMesgs?.[0];

    return {
      kinds: [...kinds],
      facets: { activity, health: native.healthDocument },
      native,
      metadata: {
        fileType: fileId?.type,
        manufacturer: fileId?.manufacturer,
        product: fileId?.garminProduct ?? fileId?.product,
        productName:
          typeof fileIdRecord?.productName === "string"
            ? fileIdRecord.productName
            : undefined,
        serialNumber:
          fileId?.serialNumber === undefined
            ? undefined
            : String(fileId.serialNumber),
        createdAt: fileId?.timeCreated
          ? new Date(fileId.timeCreated)
          : undefined,
        softwareVersion: fileCreator?.softwareVersion,
      },
      fitDiagnostics,
      warnings: fitDiagnostics.warnings.map((warning) => warning.message),
    };
  }

  async encodeActivity(activity: FileType): Promise<Buffer> {
    const native = (await this.activities.encodeActivity(
      activity,
      "fit"
    )) as FITFileType;
    return this.getEncoder().encode(native);
  }

  async encodeCourse(activity: FileType): Promise<Buffer> {
    return Buffer.from(encodeCourse(buildCoursePlanFromActivity(activity)));
  }

  async dispose(): Promise<void> {
    await this.decoder?.destroy();
  }
}

export class GPXAdapter extends BuiltInAdapter<GPX11Type> {
  readonly format = "gpx" as const;
  private decoder?: GPXDecoder;
  private encoder?: GPXEncoder;

  private getDecoder(): GPXDecoder {
    return (this.decoder ??= new GPXDecoder());
  }

  private getEncoder(): GPXEncoder {
    return (this.encoder ??= new GPXEncoder());
  }

  async decode(
    input: Buffer
  ): Promise<AdapterDecodeResult<GPX11Type>> {
    const native = await this.getDecoder().parserByBuffer(input);
    if (!native) throw new Error("GPX decoder returned an empty result");
    const activity = await this.activities.convertToActivity(native, "gpx");
    const kinds: TrackDocumentKind[] = [];
    if (activity.activities?.length) kinds.push("activity");
    if (activity.routes?.length) kinds.push("route");
    if (activity.points?.length) kinds.push("waypoint");
    if (kinds.length === 0) kinds.push("unknown");
    return {
      kinds,
      facets: { activity },
      native,
      metadata: {
        title: native.metadata?.name,
        creator: native.creator,
        createdAt: native.metadata?.time,
      },
    };
  }

  async encodeActivity(activity: FileType): Promise<Buffer> {
    const native = (await this.activities.encodeActivity(
      activity,
      "gpx"
    )) as GPX11Type;
    return this.getEncoder().encode(native);
  }

  async dispose(): Promise<void> {
    await this.decoder?.destroy();
  }
}

export class TCXAdapter extends BuiltInAdapter<TCXFileType> {
  readonly format = "tcx" as const;
  private decoder?: TCXDecoder;
  private encoder?: TCXEncoder;

  private getDecoder(): TCXDecoder {
    return (this.decoder ??= new TCXDecoder());
  }

  private getEncoder(): TCXEncoder {
    return (this.encoder ??= new TCXEncoder());
  }

  async decode(
    input: Buffer
  ): Promise<AdapterDecodeResult<TCXFileType>> {
    const native = await this.getDecoder().parseByBuffer(input);
    if (!native) throw new Error("TCX decoder returned an empty result");
    const activity = await this.activities.convertToActivity(native, "tcx");
    const kinds: TrackDocumentKind[] = activity.activities?.length
      ? ["activity"]
      : activity.routes?.length
        ? ["course"]
        : ["unknown"];
    return {
      kinds,
      facets: { activity },
      native,
      metadata: {
        creator: native.Author?.Name ?? native.creator,
      },
    };
  }

  async encodeActivity(activity: FileType): Promise<Buffer> {
    const native = (await this.activities.encodeActivity(
      activity,
      "tcx"
    )) as TCXFileType;
    return this.getEncoder().encode(native);
  }

  async dispose(): Promise<void> {
    await this.decoder?.destroy();
  }
}

export function createBuiltInAdapters(): {
  adapters: TrackFormatAdapter[];
  activities: ActivityProcessor;
} {
  const activities = new ActivityProcessor();
  return {
    adapters: [
      new FITAdapter(activities),
      new GPXAdapter(activities),
      new TCXAdapter(activities),
    ],
    activities,
  };
}
