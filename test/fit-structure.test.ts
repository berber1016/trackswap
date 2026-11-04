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
