import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import TrackSwap, {
  TrackSwapError,
  type AdapterDecodeResult,
  type DecodeOptions,
  type FileType,
  type TrackFormatAdapter,
} from "../src/index.js";

const minimalGPX = Buffer.from(
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<gpx version="1.1" creator="trackswap-test" ',
    'xmlns="http://www.topografix.com/GPX/1/1">',
    '<trk><name>Morning Run</name><trkseg>',
    '<trkpt lat="31.2304" lon="121.4737">',
    '<ele>5</ele><time>2026-07-18T00:00:00.000Z</time></trkpt>',
    '<trkpt lat="31.2305" lon="121.4738">',
    '<ele>6</ele><time>2026-07-18T00:00:10.000Z</time></trkpt>',
    '</trkseg></trk></gpx>',
  ].join("")
);

const minimalGPXRoute = Buffer.from(
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<gpx version="1.1" creator="trackswap-test" ',
    'xmlns="http://www.topografix.com/GPX/1/1">',
    '<rte><name>City Route</name>',
    '<rtept lat="31.2304" lon="121.4737">',
    '<time>2026-07-18T01:00:00.000Z</time></rtept>',
    '<rtept lat="31.2305" lon="121.4738">',
    '<time>2026-07-18T01:00:10.000Z</time></rtept>',
    '</rte></gpx>',
  ].join("")
);

test("detects built-in formats without leaking native data by default", async () => {
  const trackSwap = new TrackSwap();
  try {
    assert.equal(trackSwap.detect(minimalGPX), "gpx");
    assert.equal(trackSwap.detect(readFileSync("test_file/0401.fit")), "fit");

    const document = await trackSwap.decode(minimalGPX);
    assert.equal(document.schemaVersion, "2");
    assert.equal(document.format, "gpx");
    assert.equal(document.source.byteLength, minimalGPX.byteLength);
    assert.equal(document.native, undefined);
    assert.ok(document.facets.activity);

    const withNative = await trackSwap.decode(minimalGPX, {
      includeNative: true,
    });
    assert.ok(withNative.native);
  } finally {
    await trackSwap.dispose();
  }
});

test("transcodes through the canonical activity facet", async () => {
  const trackSwap = new TrackSwap();
  try {
    const tcx = await trackSwap.transcode(minimalGPX, { format: "tcx" });
    const xml = tcx.toString("utf8");
    assert.doesNotMatch(xml, /Invalid Date/);
    assert.match(xml, /<Activity Sport="Other">/);
    assert.match(
      xml,
      /<Lap StartTime="2026-07-18T00:00:00\.000Z">/
    );
    assert.equal(trackSwap.detect(tcx), "tcx");
    const decoded = await trackSwap.decodeActivity(tcx);
    assert.equal(decoded.activities?.[0]?.sport, "other");
    assert.equal(decoded.activities?.[0]?.laps?.[0]?.records?.length, 2);
  } finally {
    await trackSwap.dispose();
  }
});

test("preserves GPX route points in the canonical route facet", async () => {
  const trackSwap = new TrackSwap();
  try {
    const decoded = await trackSwap.decodeActivity(minimalGPXRoute);
    assert.equal(decoded.routes?.length, 1);
    assert.equal(decoded.routes?.[0]?.routeName, "City Route");
    assert.equal(decoded.routes?.[0]?.records?.length, 2);

    const tcx = await trackSwap.transcode(minimalGPXRoute, { format: "tcx" });
    const roundTrip = await trackSwap.decodeActivity(tcx);
    assert.equal(roundTrip.routes?.[0]?.routeName, "City Route");
    assert.equal(roundTrip.routes?.[0]?.records?.length, 2);
  } finally {
    await trackSwap.dispose();
  }
});

test("does not invent timestamps for untimed GPX waypoints", async () => {
  const trackSwap = new TrackSwap();
  try {
    const input = Buffer.from(
      '<gpx version="1.1" creator="trackswap-test"><wpt lat="1" lon="2"/></gpx>'
    );
    const decoded = await trackSwap.decodeActivity(input);
    assert.equal(decoded.points?.length, 1);
    assert.equal(decoded.points?.[0]?.timestamp, undefined);
  } finally {
    await trackSwap.dispose();
  }
});

test("uses typed errors for unknown formats and disposed instances", async () => {
  const trackSwap = new TrackSwap();
  assert.throws(
    () => trackSwap.detect(Buffer.from("not a track document")),
    (error: unknown) =>
      error instanceof TrackSwapError && error.code === "FORMAT_UNKNOWN"
  );
  await trackSwap.dispose();
  await assert.rejects(
    () => trackSwap.decode(minimalGPX),
    (error: unknown) =>
      error instanceof TrackSwapError && error.code === "DISPOSED"
  );
});

test("wraps explicit-format parser failures without returning partial data", async () => {
  const trackSwap = new TrackSwap();
  try {
    await assert.rejects(
      () =>
        trackSwap.decode(Buffer.from("<not-gpx/>"), {
          format: "gpx",
        }),
      (error: unknown) =>
        error instanceof TrackSwapError &&
        error.code === "DECODE_FAILED" &&
        error.format === "gpx"
    );
  } finally {
    await trackSwap.dispose();
  }
});

test("appends custom formats to the built-in registry", async () => {
  const adapter: TrackFormatAdapter = {
    format: "custom",
    matches: (input) => input.toString("utf8") === "custom-document",
    decode: async () => ({
      kinds: ["route"],
      facets: {},
      native: { custom: true },
    }),
    encodeActivity: async () => Buffer.from("custom-document"),
  };
  const trackSwap = new TrackSwap({ adapters: [adapter] });
  try {
    const input = Buffer.from("custom-document");
    assert.equal(trackSwap.detect(input), "custom");
    const document = await trackSwap.decode(input, { includeNative: true });
    assert.equal(document.format, "custom");
    assert.deepEqual(document.native, { custom: true });
  } finally {
    await trackSwap.dispose();
  }
});

test("rejects duplicate format adapters at construction time", () => {
  class StubAdapter implements TrackFormatAdapter {
    readonly format = "gpx" as const;
    matches(): boolean {
      return true;
    }
    async decode(
      _input: Buffer,
      _options: DecodeOptions
    ): Promise<AdapterDecodeResult> {
      return { kinds: ["unknown"], facets: {}, native: {} };
    }
    async encodeActivity(_activity: FileType): Promise<Buffer> {
      return Buffer.alloc(0);
    }
  }

  assert.throws(
    () =>
      new TrackSwap({
        adapters: [new StubAdapter(), new StubAdapter()],
        includeBuiltInAdapters: false,
      }),
    (error: unknown) =>
      error instanceof TrackSwapError && error.code === "ADAPTER_CONFLICT"
  );
});
