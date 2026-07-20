import { Sport, SubSport } from "./types/message_index_type.js";
import type { CoursePlan } from "./encoderCourse.js";
import type { ActivityRecordType, FileType } from "../types.js";

function enumValue<T extends Record<string, string | number>>(
  enumType: T,
  raw?: string
): number | undefined {
  if (!raw) return undefined;
  const normalized = raw
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();

  for (const key of Object.keys(enumType)) {
    if (!Number.isNaN(Number(key)) || key.toUpperCase() !== normalized) {
      continue;
    }
    const value = enumType[key as keyof T];
    return typeof value === "number" ? value : undefined;
  }
  return undefined;
}

function courseName(file: FileType): string {
  const fileName = file.metadata?.fileName?.trim();
  if (fileName) return fileName;
  const originType = file.metadata?.originType;
  return originType ? `${originType.toLowerCase()}-course` : "course";
}

export function buildCoursePlanFromActivity(file: FileType): CoursePlan {
  const activity = file.activities?.[0];
  const sourceRecords: ActivityRecordType[] = [
    ...(file.activities?.flatMap((item) => item.laps ?? []) ?? []).flatMap(
      (lap) => lap.records ?? []
    ),
    ...(file.routes?.flatMap((route) => route.records ?? []) ?? []),
    ...(file.points ?? []),
  ];
  const records = sourceRecords
    .filter(
      (
        record
      ): record is ActivityRecordType & {
        timestamp: Date;
        positionLat: number;
        positionLong: number;
      } =>
        record.timestamp != null &&
        record.positionLat != null &&
        record.positionLong != null
    )
    .sort(
      (left, right) =>
        new Date(left.timestamp).getTime() -
        new Date(right.timestamp).getTime()
    )
    .map((record) => ({
      timestamp: record.timestamp,
      latitude: record.positionLat,
      longitude: record.positionLong,
      distance: record.distance,
      altitude: record.enhancedAltitude ?? record.altitude,
      speed: record.enhancedSpeed ?? record.speed,
    }));

  if (records.length === 0) {
    throw new Error(
      "Cannot build a FIT course without timestamped coordinates"
    );
  }

  return {
    name: courseName(file),
    sport: enumValue(Sport, activity?.sport) ?? Sport.CYCLING,
    subSport: enumValue(SubSport, activity?.subSport) ?? SubSport.GENERIC,
    records,
    timeCreated: records[0].timestamp,
  };
}
