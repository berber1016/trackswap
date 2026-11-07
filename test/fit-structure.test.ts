import assert from "node:assert/strict";
import test from "node:test";
import { SessionStructurePlugin } from "../src/FIT/plugins.js";
import { StructureProcessor } from "../src/FIT/processor.js";
import type { FITContext, FITDecoderMesgs } from "../src/FIT/types.js";
import { assertFITActivityRecordParity } from "../src/core/builtin-adapters.js";

function context(rawMessages: FITDecoderMesgs): FITContext {
  return {
    rawMessages,
    metadata: new Map(),
    errors: [],
    warnings: [],
    stats: {
      startTime: Date.now(),
      processedTokens: 0,
      convertedElements: 0,
    },
    performance: { startTime: Date.now() },
  };
}

test("preserves native message families and assigns records when laps are absent", async () => {
  const firstStart = new Date("2026-11-03T09:00:00.000Z");
  const secondStart = new Date("2026-11-03T10:00:00.000Z");
  const rawMessages: FITDecoderMesgs = {
    activityMesgs: [{ event: "activity", numSessions: 2 }],
    sportMesgs: [{ sport: "running" }],
    sessionMesgs: [
      {
        timestamp: new Date("2026-11-03T09:30:00.000Z"),
        event: "session",
        eventType: "stop",
        startTime: firstStart,
        sport: "running",
        totalElapsedTime: 1800,
        totalTimerTime: 1750,
        totalDistance: 5000,
      },
      {
        timestamp: new Date("2026-11-03T10:30:00.000Z"),
        event: "session",
        eventType: "stop",
        startTime: secondStart,
        sport: "running",
        totalElapsedTime: 1800,
        totalTimerTime: 1700,
        totalDistance: 4500,
      },
    ],
    recordMesgs: [
      {
        timestamp: new Date("2026-11-03T08:59:59.000Z"),
        distance: 0,
        heartRate: 118,
      },
      { timestamp: firstStart, distance: 0, heartRate: 120 },
      {
        timestamp: new Date("2026-11-03T09:30:01.000Z"),
        distance: 5000,
        heartRate: 160,
      },
      { timestamp: secondStart, distance: 0, heartRate: 125 },
      {
        timestamp: new Date("2026-11-03T10:30:02.000Z"),
        distance: 4500,
        heartRate: 155,
      },
    ],
    setMesgs: [
      {
        messageIndex: 0,
        startTime: firstStart,
        duration: 30,
        repetitions: 10,
        setType: "active",
        category: ["squat"],
      },
      {
        messageIndex: 1,
        startTime: new Date("2026-11-03T09:00:30.000Z"),
        duration: 90,
        setType: "rest",
      },
      {
        messageIndex: 2,
        startTime: secondStart,
        duration: 40,
        repetitions: 8,
        setType: "active",
        category: ["deadlift"],
        categorySubtype: [25],
      },
    ],
  };
  const ctx = context(rawMessages);
  await new StructureProcessor(() => [new SessionStructurePlugin()]).process(
    ctx,
  );

  assert.deepEqual(ctx.result?.activityMesgs, rawMessages.activityMesgs);
  assert.deepEqual(ctx.result?.sportMesgs, rawMessages.sportMesgs);
  assert.deepEqual(ctx.result?.recordMesgs, rawMessages.recordMesgs);
  assert.deepEqual(ctx.result?.setMesgs, rawMessages.setMesgs);
  assert.equal(ctx.result?.sessionMesgs?.length, 2);
  assert.equal(ctx.result?.sessionMesgs?.[0]?.lapMesgs?.length, 1);
  assert.equal(ctx.result?.sessionMesgs?.[1]?.lapMesgs?.length, 1);
  assert.deepEqual(
    ctx.result?.sessionMesgs?.[0]?.lapMesgs?.[0]?.recordMesgs,
    rawMessages.recordMesgs?.slice(0, 3),
  );
  assert.deepEqual(
    ctx.result?.sessionMesgs?.[1]?.lapMesgs?.[0]?.recordMesgs,
    rawMessages.recordMesgs?.slice(3),
  );
  assert.deepEqual(
    ctx.result?.sessionMesgs?.[0]?.setMesgs,
    rawMessages.setMesgs?.slice(0, 2),
  );
  assert.deepEqual(
    ctx.result?.sessionMesgs?.[1]?.setMesgs,
    rawMessages.setMesgs?.slice(2),
  );
  assert.equal(ctx.metadata.get("fit-synthetic-lap-count"), 2);
  assert.equal(ctx.metadata.get("fit-unassigned-record-count"), undefined);
});

test("keeps declared laps authoritative", async () => {
  const start = new Date("2026-11-03T09:00:00.000Z");
  const rawMessages: FITDecoderMesgs = {
    sessionMesgs: [
      {
        timestamp: new Date("2026-11-03T09:10:00.000Z"),
        event: "session",
        eventType: "stop",
        startTime: start,
        totalElapsedTime: 600,
      },
    ],
    lapMesgs: [
      {
        messageIndex: 7,
        startTime: start,
        timestamp: new Date("2026-11-03T09:10:00.000Z"),
        totalElapsedTime: 600,
      },
    ],
    recordMesgs: [
      { timestamp: start, distance: 0 },
      { timestamp: new Date("2026-11-03T09:09:59.000Z"), distance: 1000 },
    ],
  };
  const ctx = context(rawMessages);
  await new StructureProcessor(() => [new SessionStructurePlugin()]).process(
    ctx,
  );

  assert.equal(ctx.result?.sessionMesgs?.[0]?.lapMesgs?.length, 1);
  assert.equal(ctx.result?.sessionMesgs?.[0]?.lapMesgs?.[0]?.messageIndex, 7);
  assert.equal(ctx.metadata.get("fit-synthetic-lap-count"), undefined);
});

test("rejects a canonical FIT activity that drops decoded records", () => {
  assert.throws(
    () =>
      assertFITActivityRecordParity(
        {
          recordMesgs: [
            { timestamp: new Date("2026-11-03T09:00:00.000Z") },
            { timestamp: new Date("2026-11-03T09:00:01.000Z") },
          ],
        },
        {
          metadata: { originType: "FIT", fileType: "fit" },
          activities: [
            {
              index: 0,
              laps: [
                {
                  index: 0,
                  records: [
                    {
                      index: 0,
                      lapIndex: 0,
                      timestamp: new Date("2026-11-03T09:00:00.000Z"),
                    },
                  ],
                  lengths: [],
                },
              ],
            },
          ],
        },
      ),
    (error: unknown) =>
      error instanceof Error &&
      "code" in error &&
      error.code === "FIT_ACTIVITY_DATA_LOSS",
  );
});

test("preserves leading and trailing records with declared laps", async () => {
  const at = (second: number) => new Date(Date.UTC(2026, 0, 1, 0, 0, second));
  const records = [-1, 0, 9, 10, 19, 24].map((second, i) => ({
    timestamp: at(second), power: 200 + i, cadence: 80, distance: i * 5,
  }));
  const raw: FITDecoderMesgs = {
    sessionMesgs: [{ startTime: at(0), timestamp: at(20), totalElapsedTime: 20 }],
    lapMesgs: [
      { messageIndex: 0, startTime: at(0), timestamp: at(10), totalElapsedTime: 10 },
      { messageIndex: 1, startTime: at(10), timestamp: at(20), totalElapsedTime: 10 },
    ],
    recordMesgs: records,
  };
  const ctx = context(raw);
  const result = new SessionStructurePlugin().structureData(raw, ctx);
  const laps = result.sessionMesgs?.[0].lapMesgs ?? [];
  assert.equal(laps.length, 2);
  assert.deepEqual(laps[0].recordMesgs, records.slice(0, 3));
  assert.deepEqual(laps[1].recordMesgs, records.slice(3));
  assert.deepEqual(raw.recordMesgs, records);
});

test("falls back to session times when declared lap indices select only a partial set", () => {
  const at = (second: number) => new Date(Date.UTC(2026, 0, 1, 0, 0, second));
  const raw: FITDecoderMesgs = {
    sessionMesgs: [{ startTime: at(0), timestamp: at(30), totalElapsedTime: 30, firstLapIndex: 0, numLaps: 3 }],
    lapMesgs: [1, 2, 3].map((index) => ({messageIndex: index, startTime: at((index - 1) * 10), timestamp: at(index * 10), totalElapsedTime: 10})),
    recordMesgs: [0, 10, 20].map((second) => ({ timestamp: at(second), power: 200 })),
  };
  const result = new SessionStructurePlugin().structureData(raw, context(raw));
  assert.deepEqual(result.sessionMesgs?.[0].lapMesgs?.map(lap => lap.messageIndex), [1, 2, 3]);
  assert.deepEqual(result.sessionMesgs?.[0].lapMesgs?.flatMap(lap => lap.recordMesgs ?? []), raw.recordMesgs);
});

test("keeps boundary records in exactly one session and lap", () => {
  const at = (second: number) => new Date(Date.UTC(2026, 0, 1, 0, 0, second));
  const raw: FITDecoderMesgs = {
    sessionMesgs: [
      {startTime: at(0), timestamp: at(10), totalElapsedTime: 10, firstLapIndex: 0, numLaps: 1},
      {startTime: at(20), timestamp: at(30), totalElapsedTime: 10, firstLapIndex: 1, numLaps: 1},
    ],
    lapMesgs: [
      {messageIndex: 0, startTime: at(0), timestamp: at(10), totalElapsedTime: 10},
      {messageIndex: 1, startTime: at(20), timestamp: at(30), totalElapsedTime: 10},
    ],
    recordMesgs: [-1, 0, 15, 20, 35].map(second => ({timestamp: at(second), power: second + 200})),
  };
  const result = new SessionStructurePlugin().structureData(raw, context(raw));
  const sessions = result.sessionMesgs ?? [];
  assert.deepEqual(sessions[0].lapMesgs?.flatMap(l => l.recordMesgs ?? []), raw.recordMesgs?.slice(0,3));
  assert.deepEqual(sessions[1].lapMesgs?.flatMap(l => l.recordMesgs ?? []), raw.recordMesgs?.slice(3));
});

test("partitions records once when adjacent swim laps start in the same second", () => {
  const at = (second: number) => new Date(Date.UTC(2026, 0, 1, 0, 0, second));
  const raw: FITDecoderMesgs = {
    sessionMesgs: [
      {
        startTime: at(0),
        timestamp: at(0),
        totalElapsedTime: 25,
        firstLapIndex: 0,
        numLaps: 4,
        sport: "swimming",
      },
    ],
    lapMesgs: [0, 10, 10, 20].map((second, index) => ({
      messageIndex: index,
      startTime: at(second),
      timestamp: at(0),
      totalElapsedTime: index === 1 ? 0.388 : 10,
    })),
    recordMesgs: [-1, 0, 9, 10, 11, 19, 20, 25].map((second) => ({
      timestamp: at(second),
      heartRate: second + 100,
    })),
  };
  const result = new SessionStructurePlugin().structureData(raw, context(raw));
  const laps = result.sessionMesgs?.[0].lapMesgs ?? [];
  assert.equal(laps.length, 4);
  assert.deepEqual(
    laps.map((lap) => lap.messageIndex),
    [0, 1, 2, 3],
  );
  assert.deepEqual(laps[1].recordMesgs, []);
  assert.deepEqual(laps[2].recordMesgs, raw.recordMesgs?.slice(3, 6));
  assert.deepEqual(
    laps.flatMap((lap) => lap.recordMesgs ?? []),
    raw.recordMesgs,
  );
  for (let index = 0; index < laps.length; index++) {
    assert.equal(laps[index].startTime, raw.lapMesgs?.[index].startTime);
    assert.equal(laps[index].timestamp, raw.lapMesgs?.[index].timestamp);
    assert.equal(
      laps[index].totalElapsedTime,
      raw.lapMesgs?.[index].totalElapsedTime,
    );
  }
});

test("partitions records once when adjacent sessions share a rounded start time", () => {
  const at = (second: number) => new Date(Date.UTC(2026, 0, 1, 0, 0, second));
  const raw: FITDecoderMesgs = {
    sessionMesgs: [
      {
        startTime: at(0),
        timestamp: at(0),
        totalElapsedTime: 0.388,
        firstLapIndex: 0,
        numLaps: 1,
      },
      {
        startTime: at(0),
        timestamp: at(20),
        totalElapsedTime: 20,
        firstLapIndex: 1,
        numLaps: 1,
      },
    ],
    lapMesgs: [0, 1].map((index) => ({
      messageIndex: index,
      startTime: at(0),
      timestamp: at(20),
      totalElapsedTime: 20,
    })),
    recordMesgs: [-1, 0, 1, 19, 20].map((second) => ({
      timestamp: at(second),
      power: second + 200,
    })),
  };
  const result = new SessionStructurePlugin().structureData(raw, context(raw));
  const sessions = result.sessionMesgs ?? [];
  assert.equal(sessions.length, 2);
  assert.deepEqual(
    sessions[0].lapMesgs?.[0].recordMesgs,
    raw.recordMesgs?.slice(0, 1),
  );
  assert.deepEqual(
    sessions[1].lapMesgs?.[0].recordMesgs,
    raw.recordMesgs?.slice(1),
  );
  assert.deepEqual(
    sessions.flatMap(
      (session) =>
        session.lapMesgs?.flatMap((lap) => lap.recordMesgs ?? []) ?? [],
    ),
    raw.recordMesgs,
  );
});
