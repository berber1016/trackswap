# TrackSwap

TrackSwap is a Node.js and TypeScript toolkit for activity, route and health data. It decodes FIT, GPX and TCX into one document model while keeping protocol-specific parsing and encoding behind format adapters.

## Install

~~~bash
npm install trackswap
~~~

Node.js 18 or newer is required.

## Core model

~~~ts
import TrackSwap from "trackswap";

const trackSwap = new TrackSwap();

try {
  const document = await trackSwap.decode(buffer);

  console.log(document.format);
  console.log(document.kinds);
  console.log(document.facets.activity);
  console.log(document.facets.health);
  console.log(document.metadata);
} finally {
  await trackSwap.dispose();
}
~~~

Native protocol objects are omitted by default. Include them only for protocol-level debugging:

~~~ts
const document = await trackSwap.decode(buffer, {
  format: "fit",
  includeNative: true,
  fit: {
    includeUnknownMessages: true,
  },
});
~~~

## Activity decoding and conversion

~~~ts
const activity = await trackSwap.decodeActivity(input);

const gpx = await trackSwap.encodeActivity(activity, { format: "gpx" });
const fit = await trackSwap.encodeActivity(activity, { format: "fit" });
const tcx = await trackSwap.encodeActivity(activity, { format: "tcx" });

const converted = await trackSwap.transcode(input, {
  sourceFormat: "gpx",
  format: "tcx",
});

const course = await trackSwap.encodeCourse(input);
~~~

## FIT health data

A FIT file is decoded once. Activity and health data are returned as facets of the same `TrackDocument`. The health facet is a stable intermediate representation rather than a copy of Garmin Connect JSON:

- `points` for heart rate, stress, respiration, pulse ox, Body Battery, HRV and temperature;
- `intervals` for steps, distance, calories and accumulated activity;
- `sessions` for sleep, naps and Health Snapshot;
- `summaries` for daily, sleep and device summaries;
- `diagnostics` for SDK profile information, invalid values, unknown messages and warnings.

~~~ts
const document = await trackSwap.decode(fitBuffer, {
  fit: {
    includeDeveloperFields: true,
    health: {
      reconstructIntervals: true,
      retainCumulativeValues: false,
    },
  },
});
~~~

## Errors

Public operations throw `TrackSwapError` with stable error codes:

~~~ts
import { TrackSwapError } from "trackswap";

try {
  await trackSwap.decode(input);
} catch (error) {
  if (error instanceof TrackSwapError) {
    console.error(error.code, error.format, error.cause);
  }
}
~~~

Codes include `FORMAT_UNKNOWN`, `FORMAT_UNSUPPORTED`, `DECODE_FAILED`, `ACTIVITY_NOT_FOUND`, `ENCODE_FAILED`, `ADAPTER_CONFLICT` and `DISPOSED`.

## Custom adapters

Formats are extended through one explicit boundary without exposing TrackSwap internals:

~~~ts
import TrackSwap, { type TrackFormatAdapter } from "trackswap";

const adapter: TrackFormatAdapter = {
  format: "geojson",
  matches: (input) => input.includes(Buffer.from('"FeatureCollection"')),
  decode: async (input, options) => ({
    kinds: ["route"],
    facets: { activity: myDecode(input, options) },
    native: {},
  }),
  encodeActivity: async (activity) => myEncode(activity),
};

const trackSwap = new TrackSwap({ adapters: [adapter] });
~~~

Custom adapters are appended to FIT, GPX and TCX by default. Only one adapter may be registered per format; duplicate registrations fail with `ADAPTER_CONFLICT`. Set `includeBuiltInAdapters: false` for tests or a fully custom runtime.

## Public API

| Method | Purpose |
| --- | --- |
| `detect(input)` | Detect FIT, GPX or TCX |
| `decode(input, options?)` | Return a normalized `TrackDocument` |
| `decodeActivity(input, options?)` | Decode and require an activity facet |
| `encodeActivity(activity, options)` | Encode normalized activity data |
| `transcode(input, options)` | Convert through the normalized activity model |
| `encodeCourse(inputOrActivity, options?)` | Generate a FIT Course |
| `dispose()` | Dispose decoders created by this instance |

## Design

- the façade orchestrates and contains no protocol logic;
- adapters own detection, native decoding and encoding;
- normalized activity and health facets are the only interchange boundary;
- decoders are created lazily;
- core parsing stages fail fast instead of returning partial documents;
- native objects are opt-in so applications do not couple to internals.

## License

MIT
