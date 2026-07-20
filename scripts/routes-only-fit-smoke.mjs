/**
 * Smoke: FileType with only routes → FIT session synthesis (activity FIT).
 * Run: npm run build:dev && node scripts/routes-only-fit-smoke.mjs
 */
import assert from "node:assert/strict";
import TrackSwap from "../dist/index.js";

const ts = new TrackSwap();
const file = {
  metadata: { originType: "TCX", fileType: "tcx" },
  activities: [],
  routes: [
    {
      index: 0,
      messageIndex: 0,
      records: [
        {
          lapIndex: 0,
          index: 0,
          positionLat: 48.85,
          positionLong: 2.35,
          timestamp: new Date("2020-01-01T12:00:00Z"),
        },
        {
          lapIndex: 0,
          index: 1,
          positionLat: 48.851,
          positionLong: 2.351,
          timestamp: new Date("2020-01-01T12:01:00Z"),
        },
      ],
      lengths: [],
    },
  ],
};

const buf = await ts.encodeActivity(file, { format: "fit" });
assert.ok(buf.length > 80, "FIT buffer non-trivial");
console.log("routes-only-fit-smoke: OK");
