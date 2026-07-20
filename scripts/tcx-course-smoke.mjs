/**
 * Smoke: TCX Courses → FileType.routes → TCX Courses XML round-trip shape.
 * Run: npm run build:dev && node scripts/tcx-course-smoke.mjs
 */
import assert from "node:assert/strict";
import TrackSwap from "../dist/index.js";

const tcxXml = `<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase version="1.0"
  xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Courses>
    <Course>
      <Name>SmokeCourse</Name>
      <Track>
        <Trackpoint>
          <Time>2020-01-01T12:00:00Z</Time>
          <Position>
            <LatitudeDegrees>40.000000</LatitudeDegrees>
            <LongitudeDegrees>-105.000000</LongitudeDegrees>
          </Position>
        </Trackpoint>
        <Trackpoint>
          <Time>2020-01-01T12:01:00Z</Time>
          <Position>
            <LatitudeDegrees>40.001000</LatitudeDegrees>
            <LongitudeDegrees>-105.001000</LongitudeDegrees>
          </Position>
        </Trackpoint>
      </Track>
    </Course>
  </Courses>
</TrainingCenterDatabase>`;

const ts = new TrackSwap();
const buf = Buffer.from(tcxXml, "utf8");

const file = await ts.decodeActivity(buf, { format: "tcx" });
assert.equal(file.routes?.length, 1, "one Course → one route");
assert.ok(
  (file.routes[0].records?.length ?? 0) >= 2,
  "course trackpoints become records"
);

const encoded = await ts.encodeActivity(file, { format: "tcx" });
const outStr = encoded.toString("utf8");
assert.match(outStr, /<Courses>/);
assert.match(outStr, /SmokeCourse/);

console.log("tcx-course-smoke: OK");
