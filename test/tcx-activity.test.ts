import assert from "node:assert/strict";
import test from "node:test";
import TrackSwap from "../src/index.js";

function tcx(laps: string, id = "2026-01-01T00:00:00Z") {
  return Buffer.from(
    `<TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2"><Activities><Activity Sport="Other"><Id>${id}</Id>${laps}</Activity></Activities></TrainingCenterDatabase>`,
  );
}

async function decode(input: Buffer) {
  const swap = new TrackSwap();
  try {
    return (await swap.decodeActivity(input)).activities![0];
  } finally {
    await swap.dispose();
  }
}

test("preserves indoor lap time and summary independently of GPS", async () => {
  const activity = await decode(
    tcx(`<Lap StartTime="2026-01-01T00:00:00Z">
    <TotalTimeSeconds>1200</TotalTimeSeconds><DistanceMeters>0</DistanceMeters><Calories>135</Calories>
    <AverageHeartRateBpm><Value>132</Value></AverageHeartRateBpm>
    <MaximumHeartRateBpm><Value>171</Value></MaximumHeartRateBpm>
    <Track><Trackpoint><Time>2026-01-01T00:00:01Z</Time><HeartRateBpm><Value>120</Value></HeartRateBpm></Trackpoint>
    <Trackpoint><Time>2026-01-01T00:19:59Z</Time><HeartRateBpm><Value>150</Value></HeartRateBpm></Trackpoint></Track>
    </Lap>`),
  );
  assert.equal(activity.startTime?.toISOString(), "2026-01-01T00:00:00.000Z");
  assert.equal(activity.totalElapsedTime, 1200);
  assert.equal(activity.totalTimerTime, 1200);
  assert.equal(activity.totalDistance, 0);
  assert.equal(activity.totalCalories, 135);
  assert.equal(activity.avgHeartRate, 132);
  assert.equal(activity.maxHeartRate, 171);
  assert.deepEqual(
    activity.laps[0].records.map((r) => r.heartRate),
    [120, 150],
  );
  assert.equal(activity.laps[0].records.length, 2);
});

test("preserves a valid summary-only TCX activity without inventing records", async () => {
  const activity = await decode(
    tcx(
      '<Lap StartTime="2026-01-01T00:00:00Z"><TotalTimeSeconds>5122</TotalTimeSeconds><DistanceMeters>0</DistanceMeters><Calories>100</Calories></Lap>',
    ),
  );
  assert.equal(activity.startTime?.toISOString(), "2026-01-01T00:00:00.000Z");
  assert.equal(activity.endTime?.toISOString(), "2026-01-01T01:25:22.000Z");
  assert.equal(activity.totalElapsedTime, 5122);
  assert.equal(activity.laps[0].records.length, 0);
});

test("falls back to record timestamps when lap summary timing is absent", async () => {
  const activity = await decode(
    tcx(
      "<Lap><Track><Trackpoint><Time>2026-01-01T00:00:10Z</Time></Trackpoint><Trackpoint><Time>2026-01-01T00:02:10Z</Time></Trackpoint></Track></Lap>",
      "invalid",
    ),
  );
  assert.equal(activity.startTime?.toISOString(), "2026-01-01T00:00:10.000Z");
  assert.equal(activity.totalElapsedTime, 120);
  assert.equal(activity.endTime?.toISOString(), "2026-01-01T00:02:10.000Z");
});

test("uses the activity Id only as a valid source-time fallback", async () => {
  const activity = await decode(
    tcx("<Lap><TotalTimeSeconds>30</TotalTimeSeconds></Lap>"),
  );
  assert.equal(activity.startTime?.toISOString(), "2026-01-01T00:00:00.000Z");
  assert.equal(activity.endTime?.toISOString(), "2026-01-01T00:00:30.000Z");
});

test("does not turn missing or invalid source times into the current date", async () => {
  const activity = await decode(
    tcx(
      '<Lap StartTime="invalid"><TotalTimeSeconds>30</TotalTimeSeconds></Lap>',
      "invalid",
    ),
  );
  assert.equal(activity.startTime, undefined);
  assert.equal(activity.endTime, undefined);
  assert.equal(activity.timestamp, undefined);
  const swap = new TrackSwap();
  try {
    await assert.rejects(
      swap.encodeActivity({ activities: [activity] }, { format: "fit" }),
      /valid timestamps/,
    );
  } finally {
    await swap.dispose();
  }
});

test("keeps lap indexes and aggregates multiple indoor laps", async () => {
  const activity = await decode(
    tcx(
      '<Lap StartTime="2026-01-01T00:00:00Z"><TotalTimeSeconds>60</TotalTimeSeconds><Calories>10</Calories><Track><Trackpoint><Time>2026-01-01T00:00:30Z</Time></Trackpoint></Track></Lap><Lap StartTime="2026-01-01T00:01:00Z"><TotalTimeSeconds>120</TotalTimeSeconds><Calories>20</Calories><Track><Trackpoint><Time>2026-01-01T00:02:00Z</Time></Trackpoint></Track></Lap>',
    ),
  );
  assert.equal(activity.totalElapsedTime, 180);
  assert.equal(activity.totalCalories, 30);
  assert.deepEqual(
    activity.laps.map((lap) => lap.records[0].lapIndex),
    [0, 1],
  );
  assert.equal(activity.endTime?.toISOString(), "2026-01-01T00:03:00.000Z");
});

test("derives heart-rate summaries from indoor records when summaries are absent", async () => {
  const activity = await decode(
    tcx(
      '<Lap StartTime="2026-01-01T00:00:00Z"><Track><Trackpoint><Time>2026-01-01T00:00:00Z</Time><HeartRateBpm><Value>100</Value></HeartRateBpm></Trackpoint><Trackpoint><Time>2026-01-01T00:01:00Z</Time><HeartRateBpm><Value>140</Value></HeartRateBpm></Trackpoint><Trackpoint><Time>2026-01-01T00:02:00Z</Time><HeartRateBpm><Value>120</Value></HeartRateBpm></Trackpoint></Track></Lap>',
    ),
  );
  assert.equal(activity.avgHeartRate, 120);
  assert.equal(activity.minHeartRate, 100);
  assert.equal(activity.maxHeartRate, 140);
  assert.equal(activity.totalElapsedTime, 120);
  assert.equal(activity.laps[0].records.length, 3);
});

test("round-trips a timed indoor TCX activity through FIT without adding GPS", async () => {
  const activity = await decode(
    tcx(
      '<Lap StartTime="2026-01-01T00:00:00Z"><TotalTimeSeconds>60</TotalTimeSeconds><DistanceMeters>0</DistanceMeters><Calories>10</Calories><Track><Trackpoint><Time>2026-01-01T00:00:00Z</Time><HeartRateBpm><Value>100</Value></HeartRateBpm></Trackpoint><Trackpoint><Time>2026-01-01T00:01:00Z</Time><HeartRateBpm><Value>120</Value></HeartRateBpm></Trackpoint></Track></Lap>',
    ),
  );
  const swap = new TrackSwap();
  try {
    const encoded = await swap.encodeActivity(
      { activities: [activity] },
      { format: "fit" },
    );
    const decoded = (await swap.decodeActivity(encoded)).activities![0];
    assert.equal(
      decoded.startTime?.toISOString(),
      activity.startTime?.toISOString(),
    );
    assert.equal(decoded.totalElapsedTime, 60);
    assert.equal(decoded.totalTimerTime, 60);
    assert.equal(decoded.totalCalories, 10);
    assert.equal(decoded.avgHeartRate, 110);
    assert.equal(decoded.maxHeartRate, 120);
    assert.equal(decoded.laps[0].totalCalories, 10);
    assert.equal(decoded.laps[0].avgHeartRate, 110);
    assert.equal(decoded.laps[0].maxHeartRate, 120);
    assert.deepEqual(
      decoded.laps[0].records.map((record) => record.heartRate),
      [100, 120],
    );
    assert.ok(
      decoded.laps[0].records.every(
        (record) => record.positionLat == null && record.positionLong == null,
      ),
    );
  } finally {
    await swap.dispose();
  }
});
