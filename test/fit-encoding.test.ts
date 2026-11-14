/// <reference path="../src/types/@garmin__fitsdk.d.ts" />

import assert from "node:assert/strict";
import test from "node:test";
import { Decoder, Profile, Stream } from "@garmin/fitsdk";
import TrackSwap, {
  type ActivityRecordType,
  type FileType,
} from "../src/index.js";

const at = (seconds: number) => new Date(Date.UTC(2026, 0, 1, 0, 0, seconds));

function activity(distances: number[], speeds?: number[]): FileType {
  const records: ActivityRecordType[] = distances.map((distance, index) => ({
    index,
    lapIndex: 0,
    timestamp: at(index),
    distance,
    ...(speeds ? { speed: speeds[index] } : {}),
    heartRate: 120 + index,
    power: 200 + index,
  }));
  return {
    activities: [
      {
        index: 0,
        sport: "running",
        startTime: at(0),
        timestamp: at(records.length - 1),
        totalElapsedTime: records.length - 1,
        totalTimerTime: records.length - 1,
        totalDistance: distances.at(-1),
        laps: [
          {
            index: 0,
            startTime: at(0),
            timestamp: at(records.length - 1),
            totalElapsedTime: records.length - 1,
            totalTimerTime: records.length - 1,
            totalDistance: distances.at(-1),
            records,
            lengths: [],
          },
        ],
      },
    ],
  };
}

function closeTo(
  actual: unknown,
  expected: number,
  tolerance: number,
  label: string
) {
  assert.equal(typeof actual, "number", `${label} must be present`);
  assert.ok(
    Math.abs((actual as number) - expected) <= tolerance,
    `${label}: expected ${expected}, received ${actual}`
  );
}

function official(buffer: Buffer) {
  const decoded = new Decoder(Stream.fromBuffer(buffer)).read();
  assert.deepEqual(
    decoded.errors,
    [],
    "The FIT must also pass the independent Garmin decoder"
  );
  return decoded.messages;
}

test("encodes record, lap and session distances in metres using the official FIT scale", async () => {
  assert.equal(Profile.messages[20].fields[5].scale, 100);
  const distances = [0, 0.01, 0.123, 100, 12345.678, 42_949_672.94];
  const swap = new TrackSwap();
  try {
    const buffer = await swap.encodeActivity(activity(distances), {
      format: "fit",
    });
    const messages = official(buffer);
    assert.equal(messages.recordMesgs.length, distances.length);
    distances.forEach((distance, index) =>
      closeTo(
        messages.recordMesgs[index].distance,
        distance,
        0.0051,
        `record ${index} distance`
      )
    );
    closeTo(
      messages.lapMesgs[0].totalDistance,
      distances.at(-1)!,
      0.0051,
      "lap distance"
    );
    closeTo(
      messages.sessionMesgs[0].totalDistance,
      distances.at(-1)!,
      0.0051,
      "session distance"
    );
    assert.deepEqual(
      messages.recordMesgs.map((r: { heartRate: number }) => r.heartRate),
      distances.map((_, i) => 120 + i)
    );
  } finally {
    await swap.dispose();
  }
});

test("encodes zero, fractional and maximum valid base speeds in metres per second", async () => {
  assert.equal(Number(Profile.messages[20].fields[6].scale), 1000);
  const speeds = [0, 0.001, 0.1234, 1.1, 4.5678, 65.534];
  const swap = new TrackSwap();
  try {
    const buffer = await swap.encodeActivity(
      activity(
        speeds.map((_, i) => i * 100),
        speeds
      ),
      { format: "fit" }
    );
    const messages = official(buffer);
    speeds.forEach((speed, index) =>
      closeTo(
        messages.recordMesgs[index].speed ??
          messages.recordMesgs[index].enhancedSpeed,
        speed,
        0.00051,
        `record ${index} speed`
      )
    );
    assert.deepEqual(
      messages.recordMesgs.map((r: { power: number }) => r.power),
      speeds.map((_, i) => 200 + i)
    );
  } finally {
    await swap.dispose();
  }
});

function tcx(gps: boolean) {
  return Buffer.from(
    `<TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2"><Activities><Activity Sport="Running"><Id>${at(0).toISOString()}</Id><Lap StartTime="${at(0).toISOString()}"><TotalTimeSeconds>20</TotalTimeSeconds><DistanceMeters>200</DistanceMeters><Track>${[0, 1, 2].map((i) => `<Trackpoint><Time>${at(i * 10).toISOString()}</Time>${gps ? `<Position><LatitudeDegrees>${31.2 + i * 0.0001}</LatitudeDegrees><LongitudeDegrees>121.4</LongitudeDegrees></Position>` : ""}<DistanceMeters>${i * 100}</DistanceMeters></Trackpoint>`).join("")}</Track></Lap></Activity></Activities></TrainingCenterDatabase>`
  );
}

const gpx = Buffer.from(
  `<gpx version="1.1" creator="synthetic-test" xmlns="http://www.topografix.com/GPX/1/1"><trk><type>running</type><trkseg>${[0, 1, 2].map((i) => `<trkpt lat="${31.2 + i * 0.0001}" lon="121.4"><time>${at(i * 10).toISOString()}</time></trkpt>`).join("")}</trkseg></trk></gpx>`
);

for (const [name, input] of [
  ["TCX with GPS", tcx(true)],
  ["indoor TCX", tcx(false)],
  ["GPX with derived distance and speed", gpx],
] as const) {
  test(`${name} preserves record metrics and lap/session distances through FIT`, async () => {
    const swap = new TrackSwap();
    try {
      const source = await swap.decodeActivity(input);
      const buffer = await swap.encodeActivity(source, { format: "fit" });
      const messages = official(buffer);
      const reread = await swap.decodeActivity(buffer, { format: "fit" });
      const before = source.activities![0].laps.flatMap((l) => l.records);
      const after = reread.activities![0].laps.flatMap((l) => l.records);
      assert.equal(after.length, before.length);
      assert.equal(messages.recordMesgs.length, before.length);
      before.forEach((record, index) => {
        for (const [key, tolerance] of [
          ["distance", 0.0051],
          ["speed", 0.00051],
        ] as const) {
          const expected = record[key];
          if (expected !== undefined) {
            closeTo(
              after[index][key],
              expected,
              tolerance,
              `round-trip record ${index} ${key}`
            );
            closeTo(
              messages.recordMesgs[index][key],
              expected,
              tolerance,
              `Garmin record ${index} ${key}`
            );
          }
        }
        assert.equal(
          after[index].timestamp!.getTime(),
          record.timestamp!.getTime()
        );
        if (record.positionLat !== undefined) {
          closeTo(
            after[index].positionLat,
            record.positionLat,
            0.000001,
            `record ${index} latitude`
          );
          closeTo(
            after[index].positionLong,
            record.positionLong!,
            0.000001,
            `record ${index} longitude`
          );
        }
      });
      closeTo(
        messages.lapMesgs[0].totalDistance,
        source.activities![0].laps[0].totalDistance!,
        0.0051,
        "lap distance"
      );
      closeTo(
        messages.sessionMesgs[0].totalDistance,
        source.activities![0].totalDistance!,
        0.0051,
        "session distance"
      );
    } finally {
      await swap.dispose();
    }
  });
}

test("the separate FIT course encoder also preserves physical distance and speed units", async () => {
  const swap = new TrackSwap();
  try {
    const source = await swap.decodeActivity(gpx);
    const before = source.activities![0].laps.flatMap((l) => l.records);
    const messages = official(await swap.encodeCourse(source));
    assert.equal(messages.recordMesgs.length, before.length);
    before.forEach((record, index) => {
      if (record.distance !== undefined)
        closeTo(
          messages.recordMesgs[index].distance,
          record.distance,
          0.0051,
          "course distance"
        );
      if (record.speed !== undefined)
        closeTo(
          messages.recordMesgs[index].speed,
          record.speed,
          0.00051,
          "course speed"
        );
    });
  } finally {
    await swap.dispose();
  }
});
