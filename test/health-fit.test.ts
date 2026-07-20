/// <reference path="../src/types/@garmin__fitsdk.d.ts" />

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { Encoder, Profile } from "@garmin/fitsdk";
import TrackSwap, {
  buildHealthDocumentFromMessages,
  detectFITKinds,
} from "../src/index.js";

test("classifies health-only and mixed FIT messages by content", () => {
  assert.deepEqual(
    detectFITKinds({
      fileIdMesgs: [{ type: "monitoringB" }],
      monitoringMesgs: [{ heartRate: 60 }],
    }),
    ["health"]
  );
  assert.deepEqual(
    detectFITKinds({
      fileIdMesgs: [{ type: "activity" }],
      activityMesgs: [{}],
      sessionMesgs: [{}],
      stressLevelMesgs: [{}],
    }),
    ["activity", "health"]
  );
  assert.deepEqual(
    detectFITKinds({
      activityMesgs: [{}],
      sessionMesgs: [{}],
      timestampCorrelationMesgs: [{}],
    }),
    ["activity"]
  );
});

test("maps sentinel values, accumulator rollover and local sleep date", () => {
  const document = buildHealthDocumentFromMessages({
    timestampCorrelationMesgs: [
      {
        timestamp: new Date("2026-07-17T16:00:00.000Z"),
        localTimestamp: new Date("2026-07-18T00:00:00.000Z"),
      },
    ],
    monitoringMesgs: [
      {
        timestamp: new Date("2026-07-17T18:00:00.000Z"),
        activityType: "walking",
        activeCalories: 65_530,
      },
      {
        timestamp: new Date("2026-07-17T18:05:00.000Z"),
        activityType: "walking",
        activeCalories: 12,
      },
    ],
    respirationRateMesgs: [
      {
        timestamp: new Date("2026-07-17T18:00:00.000Z"),
        respirationRate: -100,
      },
    ],
    sleepLevelMesgs: [
      {
        timestamp: new Date("2026-07-17T18:00:00.000Z"),
        sleepLevel: "light",
      },
      {
        timestamp: new Date("2026-07-17T20:00:00.000Z"),
        sleepLevel: "deep",
      },
      {
        timestamp: new Date("2026-07-17T22:00:00.000Z"),
        sleepLevel: "awake",
      },
    ],
  });

  assert.equal(document.intervals[0]?.value, 18);
  assert.equal(document.points[0]?.status, "off_wrist");
  assert.equal(document.points[0]?.value, undefined);
  assert.equal(document.sessions[0]?.calendarDate, "2026-07-18");
  assert.equal(document.sessions[0]?.endOffsetSeconds, 28_800);
  assert.ok(
    document.diagnostics.warnings.some(
      (warning) => warning.code === "GARMIN_HEALTH_ACCUMULATOR_ROLLOVER"
    )
  );
});

test("decode exposes a real Garmin health FIT through the unified API", async () => {
  const timestamp = new Date("2026-07-18T00:00:00.000Z");
  const encoder = new Encoder();
  encoder.onMesg(Profile.MesgNum.FILE_ID, {
    manufacturer: "development",
    product: 1,
    timeCreated: timestamp,
    type: "monitoringB",
  });
  encoder.onMesg(Profile.MesgNum.STRESS_LEVEL, {
    stressLevelTime: timestamp,
    stressLevelValue: 42,
  });
  encoder.onMesg(Profile.MesgNum.RESPIRATION_RATE, {
    timestamp,
    respirationRate: 14.5,
  });

  const trackSwap = new TrackSwap();
  try {
    const document = await trackSwap.decode(Buffer.from(encoder.close()));
    assert.equal(document.kinds[0], "health");
    assert.deepEqual(document.kinds, ["health"]);
    assert.match(
      document.diagnostics.fit?.sdkProfileVersion ?? "",
      /^21\./
    );
    assert.equal(
      document.facets.health?.points.find(
        (point) => point.metric === "stress_level"
      )?.value,
      42
    );
    assert.equal(
      document.facets.health?.points.find(
        (point) => point.metric === "respiration_rate_bpm"
      )?.value,
      14.5
    );
  } finally {
    await trackSwap.dispose();
  }
});

test("decodes activity and document facets from the same public model", async () => {
  const buffer = readFileSync("test_file/0401.fit");
  const trackSwap = new TrackSwap();
  try {
    const activity = await trackSwap.decodeActivity(buffer, { format: "fit" });
    const document = await trackSwap.decode(buffer);
    assert.ok((activity.activities?.length ?? 0) > 0);
    assert.ok(document.kinds.includes("activity"));
    assert.equal(
      document.facets.activity?.activities?.length,
      activity.activities?.length
    );
  } finally {
    await trackSwap.dispose();
  }
});
