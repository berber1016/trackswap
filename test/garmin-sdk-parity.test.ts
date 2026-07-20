/// <reference path="../src/types/@garmin__fitsdk.d.ts" />

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { Decoder, Stream } from "@garmin/fitsdk";
import TrackSwap, {
  type ActivityLapType,
  type ActivityRecordType,
  type ActivityType,
  type TrackDocument,
} from "../src/index.js";

type GarminMessage = Record<string, unknown>;
type GarminMessages = Record<string, GarminMessage[] | undefined>;

function iso(value: unknown): string | undefined {
  if (value == null) return undefined;
  const date = new Date(value as string | number | Date);
  return Number.isFinite(date.valueOf()) ? date.toISOString() : undefined;
}

function messageCounts(messages: GarminMessages): Record<string, number> {
  return Object.fromEntries(
    Object.entries(messages)
      .filter(([, rows]) => Array.isArray(rows) && rows.length > 0)
      .map(([name, rows]) => [name, rows?.length ?? 0])
  );
}

function projectSession(session: GarminMessage | ActivityType | undefined) {
  return {
    timestamp: iso(session?.timestamp),
    startTime: iso(session?.startTime),
    sport: session?.sport,
    subSport: session?.subSport,
    totalElapsedTime: session?.totalElapsedTime,
    totalTimerTime: session?.totalTimerTime,
    totalDistance: session?.totalDistance,
    totalCalories: session?.totalCalories,
    avgHeartRate: session?.avgHeartRate,
    maxHeartRate: session?.maxHeartRate,
    avgPower: session?.avgPower,
    maxPower: session?.maxPower,
  };
}

function projectLap(lap: GarminMessage | ActivityLapType) {
  return {
    messageIndex: lap.messageIndex,
    timestamp: iso(lap.timestamp),
    startTime: iso(lap.startTime),
    totalElapsedTime: lap.totalElapsedTime,
    totalTimerTime: lap.totalTimerTime,
    totalDistance: lap.totalDistance,
    totalCalories: lap.totalCalories,
    avgHeartRate: lap.avgHeartRate,
    maxHeartRate: lap.maxHeartRate,
    avgPower: lap.avgPower,
    maxPower: lap.maxPower,
  };
}

function projectRecord(record: GarminMessage | ActivityRecordType) {
  return {
    timestamp: iso(record.timestamp),
    distance: record.distance,
    altitude: record.altitude,
    enhancedAltitude: record.enhancedAltitude,
    speed: record.speed,
    enhancedSpeed: record.enhancedSpeed,
    heartRate: record.heartRate,
    cadence: record.cadence,
    power: record.power,
  };
}

function projectGarmin(messages: GarminMessages) {
  const session = messages.sessionMesgs?.[0];
  const firstLapIndex = Number(session?.firstLapIndex ?? 0);
  const numLaps = Number(session?.numLaps ?? messages.lapMesgs?.length ?? 0);
  const laps = (messages.lapMesgs ?? []).filter((lap) => {
    const messageIndex = Number(lap.messageIndex);
    return (
      messageIndex >= firstLapIndex &&
      messageIndex < firstLapIndex + numLaps
    );
  });

  return {
    messageCounts: messageCounts(messages),
    metadata: {
      fileType: messages.fileIdMesgs?.[0]?.type,
      manufacturer: messages.fileIdMesgs?.[0]?.manufacturer,
      product: messages.fileIdMesgs?.[0]?.garminProduct,
      serialNumber: String(messages.fileIdMesgs?.[0]?.serialNumber),
      createdAt: iso(messages.fileIdMesgs?.[0]?.timeCreated),
      softwareVersion: messages.fileCreatorMesgs?.[0]?.softwareVersion,
    },
    session: projectSession(session),
    laps: laps.map(projectLap),
    records: (messages.recordMesgs ?? []).map(projectRecord),
  };
}

function projectTrackSwap(document: TrackDocument) {
  const activity = document.facets.activity?.activities?.[0];
  const laps = activity?.laps ?? [];
  return {
    messageCounts: document.diagnostics.fit?.messageCounts,
    metadata: {
      fileType: document.metadata.fileType,
      manufacturer: document.metadata.manufacturer,
      product: document.metadata.product,
      serialNumber: document.metadata.serialNumber,
      createdAt: iso(document.metadata.createdAt),
      softwareVersion: document.metadata.softwareVersion,
    },
    session: projectSession(activity),
    laps: laps.map(projectLap),
    records: laps.flatMap((lap) => lap.records ?? []).map(projectRecord),
  };
}

test("matches Garmin FIT SDK output after stable JSON projection", async () => {
  const input = readFileSync("test_file/0401.fit");
  const stream = Stream.fromBuffer(input);
  assert.equal(Decoder.isFIT(stream), true);
  const official = new Decoder(stream).read();
  assert.deepEqual(official.errors, []);

  const trackSwap = new TrackSwap();
  try {
    const document = await trackSwap.decode(input, { format: "fit" });
    assert.deepEqual(document.kinds, ["activity"]);
    assert.deepEqual(
      projectTrackSwap(document),
      projectGarmin(official.messages as GarminMessages)
    );
  } finally {
    await trackSwap.dispose();
  }
});
