/// <reference path="../src/types/@garmin__fitsdk.d.ts" />

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { Encoder, Profile } from "@garmin/fitsdk";
import TrackSwap, {
  buildHealthDocumentFromMessages,
  detectFITKinds,
} from "../src/index.js";

function profileField(messageName, fieldName) {
  const profile = Profile;
  const message = Object.values(profile.messages).find(
    (candidate) => candidate.name === messageName,
  );
  return Object.values(message?.fields ?? {}).find(
    (field) => field.name === fieldName,
  );
}

test("health normalization assumptions match the Garmin FIT Profile", () => {
  assert.equal(
    profileField("napEvent", "startTimezoneOffset")?.units,
    "minutes",
  );
  assert.equal(profileField("napEvent", "endTimezoneOffset")?.units, "minutes");
  assert.equal(profileField("respirationRate", "respirationRate")?.scale, 100);
  assert.equal(profileField("monitoring", "distance")?.scale, 100);
  assert.equal(profileField("monitoring", "activeTime")?.scale, 1000);
  assert.equal(profileField("monitoring", "ascent")?.scale, 1000);
  assert.equal(profileField("monitoring", "descent")?.scale, 1000);
  assert.equal(
    profileField("hsaWristTemperatureData", "value")?.scale,
    1000,
  );
});

test("classifies health-only and mixed FIT messages by content", () => {
  assert.deepEqual(
    detectFITKinds({
      fileIdMesgs: [{ type: "monitoringB" }],
      monitoringMesgs: [{ heartRate: 60 }],
    }),
    ["health"],
  );
  assert.deepEqual(
    detectFITKinds({
      fileIdMesgs: [{ type: "activity" }],
      activityMesgs: [{}],
      sessionMesgs: [{}],
      stressLevelMesgs: [{}],
    }),
    ["activity", "health"],
  );
  assert.deepEqual(
    detectFITKinds({
      activityMesgs: [{}],
      sessionMesgs: [{}],
      timestampCorrelationMesgs: [{}],
    }),
    ["activity"],
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
        respirationRate: -1,
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
      (warning) => warning.code === "GARMIN_HEALTH_ACCUMULATOR_ROLLOVER",
    ),
  );
});

test("carries monitoring identity across messages that omit repeated fields", () => {
  const document = buildHealthDocumentFromMessages({
    monitoringMesgs: [
      {
        timestamp: new Date("2026-07-17T18:00:00.000Z"),
        deviceIndex: 2,
        activityType: "walking",
        intensity: "active",
        steps: 100,
      },
      {
        timestamp: new Date("2026-07-17T18:05:00.000Z"),
        steps: 160,
      },
    ],
  });

  assert.deepEqual(
    document.intervals.map(
      ({ metric, value, activityType, intensity, startTime, endTime }) => ({
        metric,
        value,
        activityType,
        intensity,
        startTime,
        endTime,
      }),
    ),
    [
      {
        metric: "steps",
        value: 60,
        activityType: "walking",
        intensity: "active",
        startTime: new Date("2026-07-17T18:00:00.000Z"),
        endTime: new Date("2026-07-17T18:05:00.000Z"),
      },
    ],
  );
});

test("normalizes FIT local time and reconstructs monitoring timestamp16", () => {
  const document = buildHealthDocumentFromMessages({
    timestampCorrelationMesgs: [
      {
        timestamp: new Date("2026-07-10T18:33:09.000Z"),
        // FIT local_date_time seconds: 2026-07-11 02:33:09 (UTC+8).
        localTimestamp: 1_152_671_589,
      },
    ],
    monitoringMesgs: [
      {
        timestamp: new Date("2026-02-22T16:00:00.000Z"),
        heartRate: 70,
      },
      { timestamp16: 56_980, heartRate: 75 },
      { timestamp16: 57_940, heartRate: 0 },
    ],
  });

  assert.deepEqual(document.timezone.offsets, [
    {
      at: new Date("2026-07-10T18:33:09.000Z"),
      offsetSeconds: 28_800,
    },
  ]);
  assert.equal(document.timezone.strategy, "timestamp_correlation");
  assert.deepEqual(
    document.points.map(({ timestamp, value, status }) => ({
      timestamp,
      value,
      status,
    })),
    [
      {
        timestamp: new Date("2026-02-22T16:00:00.000Z"),
        value: 70,
        status: "valid",
      },
      {
        timestamp: new Date("2026-02-22T16:11:00.000Z"),
        value: 75,
        status: "valid",
      },
      {
        timestamp: new Date("2026-02-22T16:27:00.000Z"),
        value: undefined,
        status: "gap",
      },
    ],
  );
});

test("bounds repeated diagnostic warnings while retaining their total count", () => {
  const document = buildHealthDocumentFromMessages({
    monitoringMesgs: Array.from({ length: 12 }, (_, index) => ({
      heartRate: 60 + index,
    })),
  });

  assert.equal(
    document.diagnostics.warningCounts.GARMIN_HEALTH_NO_TIMESTAMP,
    12,
  );
  assert.equal(
    document.diagnostics.warnings.filter(
      ({ code }) => code === "GARMIN_HEALTH_NO_TIMESTAMP",
    ).length,
    5,
  );
});

test("infers timezone offsets from monitoring local time", () => {
  const document = buildHealthDocumentFromMessages({
    monitoringInfoMesgs: [
      {
        timestamp: new Date("2026-02-27T16:00:00.000Z"),
        localTimestamp: 1_141_171_200,
      },
    ],
  });

  assert.equal(document.timezone.strategy, "inferred");
  assert.deepEqual(document.timezone.offsets, [
    {
      at: new Date("2026-02-27T16:00:00.000Z"),
      offsetSeconds: 28_800,
    },
  ]);
});

test("keeps ascent and descent monitoring deltas instead of differencing them", () => {
  const document = buildHealthDocumentFromMessages({
    monitoringMesgs: [
      { timestamp: new Date("2026-02-22T16:00:00.000Z") },
      { timestamp16: 56_980, ascent: 2.442 },
      { timestamp16: 57_040, ascent: 2.018, descent: 3.237 },
    ],
  });

  assert.deepEqual(
    document.intervals.map(({ metric, startTime, endTime, value }) => ({
      metric,
      startTime,
      endTime,
      value,
    })),
    [
      {
        metric: "ascent_m",
        startTime: new Date("2026-02-22T16:00:00.000Z"),
        endTime: new Date("2026-02-22T16:11:00.000Z"),
        value: 2.442,
      },
      {
        metric: "ascent_m",
        startTime: new Date("2026-02-22T16:11:00.000Z"),
        endTime: new Date("2026-02-22T16:12:00.000Z"),
        value: 2.018,
      },
      {
        metric: "descent_m",
        startTime: new Date("2026-02-22T16:11:00.000Z"),
        endTime: new Date("2026-02-22T16:12:00.000Z"),
        value: 3.237,
      },
    ],
  );
  assert.equal(
    document.diagnostics.warnings.some(
      ({ code }) => code === "GARMIN_HEALTH_ACCUMULATOR_RESET",
    ),
    false,
  );
});

test("converts moderate and vigorous activity minute deltas to seconds", () => {
  const document = buildHealthDocumentFromMessages({
    monitoringMesgs: [
      { timestamp: new Date("2026-02-22T16:00:00.000Z") },
      {
        timestamp16: 56_980,
        moderateActivityMinutes: 2,
        vigorousActivityMinutes: 3,
      },
    ],
  });

  assert.deepEqual(
    document.intervals.map(({ metric, startTime, endTime, value, unit }) => ({
      metric,
      startTime,
      endTime,
      value,
      unit,
    })),
    [
      {
        metric: "vigorous_activity_time_s",
        startTime: new Date("2026-02-22T16:08:00.000Z"),
        endTime: new Date("2026-02-22T16:11:00.000Z"),
        value: 180,
        unit: "s",
      },
      {
        metric: "moderate_activity_time_s",
        startTime: new Date("2026-02-22T16:09:00.000Z"),
        endTime: new Date("2026-02-22T16:11:00.000Z"),
        value: 120,
        unit: "s",
      },
    ],
  );
});

test("classifies decoded Garmin stress and respiration sentinel values", () => {
  const timestamp = new Date("2026-02-27T16:01:00.000Z");
  const document = buildHealthDocumentFromMessages({
    stressLevelMesgs: [-1, -2, -3, -4, -16, 0, 101, 35].map((stressLevelValue) => ({
      stressLevelTime: timestamp,
      stressLevelValue,
    })),
    respirationRateMesgs: [-1, -2, -3, 0, 101, 14.5].map((respirationRate) => ({
      timestamp,
      respirationRate,
    })),
  });

  assert.deepEqual(
    document.points
      .filter((point) => point.metric === "stress_level")
      .map(({ value, status }) => ({ value, status })),
    [
      { value: undefined, status: "off_wrist" },
      { value: undefined, status: "motion" },
      { value: undefined, status: "not_enough_data" },
      { value: undefined, status: "recovering" },
      { value: undefined, status: "gap" },
      { value: undefined, status: "invalid" },
      { value: undefined, status: "invalid" },
      { value: 35, status: "valid" },
    ],
  );
  assert.deepEqual(
    document.points
      .filter((point) => point.metric === "respiration_rate_bpm")
      .map(({ value, status }) => ({ value, status })),
    [
      { value: undefined, status: "off_wrist" },
      { value: undefined, status: "motion" },
      { value: undefined, status: "invalid" },
      { value: undefined, status: "invalid" },
      { value: undefined, status: "invalid" },
      { value: 14.5, status: "valid" },
    ],
  );
});

test("rejects implausible timezone correlations and bounded health values", () => {
  const timestamp = new Date("2026-07-10T18:33:09.000Z");
  const document = buildHealthDocumentFromMessages({
    timestampCorrelationMesgs: [
      {
        timestamp,
        localTimestamp: 0,
      },
    ],
    spo2DataMesgs: [
      { timestamp, readingSpo2: 0, readingConfidence: 100 },
      { timestamp, readingSpo2: 98, readingConfidence: 0 },
    ],
    hrvValueMesgs: [{ timestamp, value: 0 }],
    hsaBodyBatteryDataMesgs: [
      {
        timestamp,
        processingInterval: 60,
        level: [-16, -1, 0, 100, 101],
        charged: [-16],
      },
    ],
  });

  assert.equal(document.timezone.strategy, "unknown");
  assert.deepEqual(document.timezone.offsets, []);
  assert.ok(
    document.diagnostics.warnings.some(
      ({ code }) => code === "GARMIN_HEALTH_INVALID_TIMEZONE_OFFSET",
    ),
  );
  assert.deepEqual(
    document.points.map(({ metric, value, status }) => ({
      metric,
      value,
      status,
    })),
    [
      { metric: "spo2_percent", value: undefined, status: "invalid" },
      { metric: "spo2_percent", value: 98, status: "low_confidence" },
      { metric: "hrv_rmssd_ms", value: undefined, status: "invalid" },
      { metric: "body_battery_level", value: undefined, status: "gap" },
      { metric: "body_battery_charged", value: -16, status: "valid" },
      { metric: "body_battery_level", value: undefined, status: "invalid" },
      { metric: "body_battery_level", value: 0, status: "valid" },
      { metric: "body_battery_level", value: 100, status: "valid" },
      { metric: "body_battery_level", value: undefined, status: "invalid" },
    ],
  );
});

test("normalizes FIT nap timezone offsets from minutes to seconds", () => {
  const document = buildHealthDocumentFromMessages({
    napEventMesgs: [
      {
        messageIndex: 0,
        startTime: new Date("2026-07-17T18:00:00.000Z"),
        endTime: new Date("2026-07-17T18:30:00.000Z"),
        startTimezoneOffset: 480,
        endTimezoneOffset: 480,
        source: "automatic",
      },
    ],
  });

  const nap = document.sessions[0];
  assert.equal(document.timezone.strategy, "explicit_offset");
  assert.equal(nap?.startOffsetSeconds, 28_800);
  assert.equal(nap?.endOffsetSeconds, 28_800);
  assert.equal(nap?.calendarDate, "2026-07-18");
});

test("assigns an exclusive midnight session end to the occupied local day", () => {
  const document = buildHealthDocumentFromMessages({
    napEventMesgs: [
      {
        messageIndex: 0,
        startTime: new Date("2026-07-17T15:30:00.000Z"),
        endTime: new Date("2026-07-17T16:00:00.000Z"),
        startTimezoneOffset: 480,
        endTimezoneOffset: 480,
      },
    ],
  });

  assert.equal(document.sessions[0]?.calendarDate, "2026-07-17");
});

test("expands Garmin HSA sample buffers into canonical health values", () => {
  const timestamp = new Date("2026-07-18T00:00:00.000Z");
  const document = buildHealthDocumentFromMessages({
    hsaStepDataMesgs: [
      { timestamp, processingInterval: 60, steps: [12, 18] },
      { timestamp, processingInterval: 0xffef, steps: [999] },
    ],
    hsaSpo2DataMesgs: [
      {
        timestamp,
        processingInterval: 60,
        readingSpo2: [98, 97, 240],
        confidence: [100, 0, 100],
      },
    ],
    hsaStressDataMesgs: [
      {
        timestamp,
        processingInterval: 60,
        stressLevel: [0, 42, -1, -2, -3, -4, -5, -16],
      },
    ],
    hsaRespirationDataMesgs: [
      {
        timestamp,
        processingInterval: 60,
        respirationRate: [14.5, 255, 254, 253, 252, 2.4],
      },
    ],
    hsaHeartRateDataMesgs: [
      {
        timestamp,
        processingInterval: 60,
        status: 0,
        heartRate: [72, 0],
      },
      {
        timestamp: new Date(timestamp.valueOf() + 120_000),
        processingInterval: 60,
        status: 1,
        heartRate: [74],
      },
    ],
    hsaWristTemperatureDataMesgs: [
      { timestamp, processingInterval: 60, value: [33.125, 33.25] },
    ],
    sleepDisruptionSeverityPeriodMesgs: [
      { timestamp, messageIndex: 4, severity: "medium" },
    ],
    sleepDisruptionOvernightSeverityMesgs: [
      { timestamp, severity: "low" },
    ],
  });

  assert.deepEqual(detectFITKinds({ hsaStepDataMesgs: [{}] }), ["health"]);
  assert.deepEqual(
    document.intervals.map(({ metric, startTime, endTime, value }) => ({
      metric,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      value,
    })),
    [
      {
        metric: "steps",
        startTime: "2026-07-18T00:00:00.000Z",
        endTime: "2026-07-18T00:01:00.000Z",
        value: 12,
      },
      {
        metric: "steps",
        startTime: "2026-07-18T00:01:00.000Z",
        endTime: "2026-07-18T00:02:00.000Z",
        value: 18,
      },
    ],
  );
  assert.deepEqual(
    document.points
      .filter(({ source }) => source.messageName === "hsaSpo2DataMesgs")
      .map(({ value, status }) => ({ value, status })),
    [
      { value: 98, status: "valid" },
      { value: 97, status: "low_confidence" },
      { value: undefined, status: "invalid" },
    ],
  );
  assert.deepEqual(
    document.points
      .filter(({ source }) => source.messageName === "hsaStressDataMesgs")
      .map(({ value, status }) => ({ value, status })),
    [
      { value: 0, status: "valid" },
      { value: 42, status: "valid" },
      { value: undefined, status: "off_wrist" },
      { value: undefined, status: "motion" },
      { value: undefined, status: "not_enough_data" },
      { value: undefined, status: "recovering" },
      { value: undefined, status: "unidentified" },
      { value: undefined, status: "gap" },
    ],
  );
  assert.deepEqual(
    document.points
      .filter(
        ({ source }) => source.messageName === "hsaRespirationDataMesgs",
      )
      .map(({ value, status }) => ({ value, status })),
    [
      { value: 14.5, status: "valid" },
      { value: undefined, status: "invalid" },
      { value: undefined, status: "motion" },
      { value: undefined, status: "off_wrist" },
      { value: undefined, status: "not_enough_data" },
      { value: undefined, status: "gap" },
    ],
  );
  assert.deepEqual(
    document.points
      .filter(({ source }) => source.messageName === "hsaHeartRateDataMesgs")
      .map(({ value, status }) => ({ value, status })),
    [
      { value: 72, status: "low_confidence" },
      { value: undefined, status: "gap" },
      { value: 74, status: "valid" },
    ],
  );
  assert.deepEqual(
    document.points
      .filter(
        ({ source }) =>
          source.messageName === "hsaWristTemperatureDataMesgs",
      )
      .map(({ timestamp: pointTimestamp, value, status }) => ({
        timestamp: pointTimestamp.toISOString(),
        value,
        status,
      })),
    [
      {
        timestamp: "2026-07-18T00:00:00.000Z",
        value: 33.125,
        status: "valid",
      },
      {
        timestamp: "2026-07-18T00:01:00.000Z",
        value: 33.25,
        status: "valid",
      },
    ],
  );
  assert.deepEqual(
    document.summaries.map(({ summaryType, metrics }) => ({
      summaryType,
      metrics,
    })),
    [
      { summaryType: "sleep", metrics: { severity: "medium" } },
      { summaryType: "sleep", metrics: { severity: "low" } },
    ],
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
    assert.match(document.diagnostics.fit?.sdkProfileVersion ?? "", /^21\./);
    assert.equal(
      document.facets.health?.points.find(
        (point) => point.metric === "stress_level",
      )?.value,
      42,
    );
    assert.equal(
      document.facets.health?.points.find(
        (point) => point.metric === "respiration_rate_bpm",
      )?.value,
      14.5,
    );
  } finally {
    await trackSwap.dispose();
  }
});

test("decodes Garmin SDK HSA sentinel arrays from binary FIT", async () => {
  const timestamp = new Date("2026-07-18T00:00:00.000Z");
  const encoder = new Encoder();
  encoder.onMesg(Profile.MesgNum.FILE_ID, {
    manufacturer: "development",
    product: 1,
    timeCreated: timestamp,
    type: "monitoringB",
  });
  encoder.onMesg(Profile.MesgNum.HSA_RESPIRATION_DATA, {
    timestamp,
    processingInterval: 60,
    respirationRate: [255, 254, 253, 252, 2.4, 14.5],
  });
  encoder.onMesg(Profile.MesgNum.HSA_STRESS_DATA, {
    timestamp,
    processingInterval: 60,
    stressLevel: [0, 42, -1, -2, -3, -4, -5, -16],
  });

  const trackSwap = new TrackSwap();
  try {
    const document = await trackSwap.decode(Buffer.from(encoder.close()));
    assert.deepEqual(
      document.facets.health?.points
        .filter(({ metric }) => metric === "respiration_rate_bpm")
        .map(({ value, status }) => ({ value, status })),
      [
        { value: undefined, status: "invalid" },
        { value: undefined, status: "motion" },
        { value: undefined, status: "off_wrist" },
        { value: undefined, status: "not_enough_data" },
        { value: undefined, status: "gap" },
        { value: 14.5, status: "valid" },
      ],
    );
    assert.deepEqual(
      document.facets.health?.points
        .filter(({ metric }) => metric === "stress_level")
        .map(({ value, status }) => ({ value, status })),
      [
        { value: 0, status: "valid" },
        { value: 42, status: "valid" },
        { value: undefined, status: "off_wrist" },
        { value: undefined, status: "motion" },
        { value: undefined, status: "not_enough_data" },
        { value: undefined, status: "recovering" },
        { value: undefined, status: "unidentified" },
        { value: undefined, status: "gap" },
      ],
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
      activity.activities?.length,
    );
  } finally {
    await trackSwap.dispose();
  }
});
