import { BaseFITStructurePlugin } from "./base.js";
import type { FITContext } from "./types.js";

/** High-level content categories detected in a decoded FIT file. */
export type FITPrimaryKind =
  | 'activity'
  | 'health'
  | 'workout'
  | 'course'
  | 'device'
  | 'unknown';

/**
 * Canonical metric identifiers emitted by the Health IR.
 *
 * Stable built-in identifiers include their physical unit where ambiguity
 * would otherwise be likely (for example `_bpm`, `_m`, `_s`, and `_kcal`).
 * Unstandardized values must use the `vendor:` namespace.
 *
 * Unit conventions:
 * - heart/respiration rates: beats or breaths per minute;
 * - distance/ascent/descent: metres;
 * - activity durations: seconds;
 * - energy: kilocalories;
 * - SpO2: percent;
 * - HRV RMSSD: milliseconds;
 * - temperature and temperature deviations: degrees Celsius;
 * - stress and Body Battery values: vendor-defined scores.
 */
export type HealthMetricCode =
  | 'heart_rate_bpm'
  | 'resting_heart_rate_bpm'
  | 'resting_heart_rate_7_day_bpm'
  | 'steps'
  | 'distance_m'
  | 'active_time_s'
  | 'moderate_activity_time_s'
  | 'vigorous_activity_time_s'
  | 'active_energy_kcal'
  | 'total_energy_kcal'
  | 'stress_level'
  | 'respiration_rate_bpm'
  | 'spo2_percent'
  | 'body_battery_level'
  | 'body_battery_charged'
  | 'body_battery_drained'
  | 'hrv_rmssd_ms'
  | 'temperature_c'
  | 'wrist_temperature_c'
  | 'skin_temperature_deviation_c'
  | 'skin_temperature_7_day_deviation_c'
  | 'skin_temperature_nightly_c'
  | 'ascent_m'
  | 'descent_m'
  | `vendor:${string}`;

/**
 * Measurement usability independently of the numeric value.
 *
 * Only `valid` values are safe to use in ordinary physiological aggregates.
 * Other statuses are retained as observation and data-quality facts. When a
 * FIT sentinel produces a non-valid status, `value` is normally omitted and
 * the decoded sentinel may be retained in `attributes.rawValue` for audit.
 *
 * Status meanings:
 * - `valid`: usable measurement;
 * - `invalid`: malformed, impossible, or explicitly invalid source value;
 * - `off_wrist`: wearable contact was absent;
 * - `motion`: motion prevented a reliable measurement;
 * - `low_confidence`: a value exists but source confidence is insufficient;
 * - `not_enough_data`: the source could not collect enough evidence;
 * - `recovering`: the source algorithm is still establishing a baseline;
 * - `unidentified`: the source reported an unclassified state;
 * - `gap`: expected sample was absent or represented by a blank sentinel;
 * - `unknown`: source status could not be normalized safely.
 */
export type HealthValueStatus =
  | 'valid'
  | 'invalid'
  | 'off_wrist'
  | 'motion'
  | 'low_confidence'
  | 'not_enough_data'
  | 'recovering'
  | 'unidentified'
  | 'gap'
  | 'unknown';

/** Pointer back to the decoded FIT message and field that produced a value. */
export type HealthMessagePointerV1 = {
  /** Garmin FIT SDK message collection name, such as `monitoringMesgs`. */
  messageName: string;
  /** Zero-based index within the message collection. */
  messageIndex: number;
  /** Source field name when the normalized value came from one field. */
  fieldName?: string;
  /** Whether `fieldName` refers to a FIT developer field. */
  developerField?: boolean;
};

/** A point-in-time health measurement or measurement-status observation. */
export type HealthPointV1 = {
  /** Canonical metric identifier. */
  metric: HealthMetricCode;
  /** Absolute observation instant. Serialized as an ISO 8601 UTC timestamp. */
  timestamp: Date;
  /**
   * Local wall-clock timestamp without a zone suffix.
   *
   * Interpret it together with `offsetSeconds`; it is not another instant.
   */
  localTimestamp?: string;
  /** UTC offset at `timestamp`, in seconds (for example `28800` is UTC+08:00). */
  offsetSeconds?: number;
  /**
   * Normalized numeric value in `unit`.
   *
   * Usually absent when `status !== 'valid'`; never interpret an absent value
   * or `attributes.rawValue` as a physiological measurement.
   */
  value?: number;
  /** Unit of `value`, such as `bpm`, `breaths/min`, `percent`, or `score`. */
  unit: string;
  /** Measurement usability and, for non-valid samples, the missing-data reason. */
  status: HealthValueStatus;
  /** Source-provided confidence when available; its scale is metric-specific. */
  quality?: number;
  /** Statistical meaning of this point in the source file. */
  aggregation?: 'instant' | 'mean' | 'min' | 'max' | 'sum' | 'latest';
  /** FIT source location for audit and deterministic identity. */
  source: HealthMessagePointerV1;
  /**
   * Additional source metadata. For non-valid samples, `rawValue` may contain
   * the original FIT sentinel solely for diagnostics and round-trip audit.
   */
  attributes?: Record<string, string | number | boolean | null>;
};

/** A health value or state covering the half-open range `[startTime, endTime)`. */
export type HealthIntervalV1 = {
  /** Canonical metric identifier. */
  metric: HealthMetricCode;
  /** Absolute inclusive start instant. */
  startTime: Date;
  /** Absolute exclusive end instant. */
  endTime: Date;
  /** Local wall-clock start without a zone suffix; pair with `offsetSeconds`. */
  localStartTime?: string;
  /** UTC offset at `startTime`, in seconds. */
  offsetSeconds?: number;
  /** Normalized interval value; absent when no usable numeric value exists. */
  value?: number;
  /** Unit of `value`. */
  unit: string;
  /** Measurement usability for the interval. */
  status: HealthValueStatus;
  /** Source activity classification when the FIT message provides one. */
  activityType?: string;
  /** Source intensity classification when the FIT message provides one. */
  intensity?: string;
  /** FIT source location for audit and deterministic event identity. */
  source: HealthMessagePointerV1;
  /** Additional normalized or source-specific metadata. */
  attributes?: Record<string, string | number | boolean | null>;
};

/** A non-sampled aggregate or device/window summary from the FIT file. */
export type HealthSummaryV1 = {
  /** Semantic category of the summary. */
  summaryType:
    | 'daily'
    | 'sleep'
    | 'hrv_status'
    | 'monitoring_window'
    | 'device';
  /** Stable source-derived identifier suitable for idempotent upsert. */
  externalId: string;
  /** Source-local calendar date in `YYYY-MM-DD` form, when defined. */
  calendarDate?: string;
  /** Absolute start instant of the summarized range, when defined. */
  startTime?: Date;
  /** Absolute end instant of the summarized range, when defined. */
  endTime?: Date;
  /** UTC offset associated with the summary, in seconds. */
  offsetSeconds?: number;
  /** Named summary values; keys are summary-type specific. */
  metrics: Record<string, number | string | boolean | null>;
  /** FIT source location. */
  source: HealthMessagePointerV1;
};

/** One staged portion of a sleep or other health session. */
export type HealthSessionSegmentV1 = {
  /** Normalized segment stage or a vendor-namespaced extension. */
  segmentType:
    | 'awake'
    | 'light'
    | 'deep'
    | 'rem'
    | 'unmeasurable'
    | 'sleeping'
    | `vendor:${string}`;
  /** Absolute inclusive start instant. */
  startTime: Date;
  /** Absolute exclusive end instant. */
  endTime: Date;
  /** Segment usability. */
  status: HealthValueStatus;
  /** FIT source location. */
  source: HealthMessagePointerV1;
};

/** A bounded health session such as sleep, a nap, or a health snapshot. */
export type HealthSessionV1 = {
  /** Normalized session category or a vendor-namespaced extension. */
  sessionType: 'sleep' | 'nap' | 'health_snapshot' | `vendor:${string}`;
  /** Stable source-derived identifier suitable for idempotent upsert. */
  externalId: string;
  /** Absolute inclusive session start instant. */
  startTime: Date;
  /** Absolute exclusive session end instant. */
  endTime: Date;
  /** UTC offset at `startTime`, in seconds; this is not a duration. */
  startOffsetSeconds?: number;
  /** UTC offset at `endTime`, in seconds; may differ across a DST transition. */
  endOffsetSeconds?: number;
  /** Source-local session date in `YYYY-MM-DD` form. */
  calendarDate?: string;
  /** Source tombstone indicating that a previously emitted session was deleted. */
  deleted?: boolean;
  /** Ordered session stages; may be empty when the source only supplies bounds. */
  segments: HealthSessionSegmentV1[];
  /** Session-level values whose keys depend on `sessionType`. */
  metrics: Record<string, number | string | boolean | null>;
  /** FIT source location. */
  source: HealthMessagePointerV1;
  /** Additional source metadata, such as automatic/manual origin or update time. */
  attributes?: Record<string, string | number | boolean | null>;
};

/** A recoverable parser warning with an optional FIT source pointer. */
export type FITDiagnosticWarningV1 = {
  /** Stable machine-readable warning code. */
  code: string;
  /** Human-readable diagnostic message. */
  message: string;
  /** FIT source location when the warning belongs to one message or field. */
  source?: HealthMessagePointerV1;
};

/** Parse coverage, invalid-value counts, and bounded warning diagnostics. */
export type FITDiagnosticsV1 = {
  /** Garmin FIT SDK profile version used for decoding. */
  sdkProfileVersion?: string;
  /** TrackSwap Health IR parser version that produced this document. */
  parserVersion: string;
  /** Total decoded message count keyed by Garmin SDK message collection name. */
  messageCounts: Record<string, number>;
  /** Counts for message collections recognized by the Health IR parser. */
  recognizedMessageCounts: Record<string, number>;
  /** Counts for decoded collections not recognized by the Health IR parser. */
  unknownMessageCounts: Record<string, number>;
  /** Non-valid sample counts keyed as `<metric>:<status>`. */
  invalidValueCounts: Record<string, number>;
  /** Complete warning count by code, including warnings omitted from `warnings`. */
  warningCounts: Record<string, number>;
  /**
   * Bounded warning examples. Repeated warnings are sampled to avoid unbounded
   * diagnostic payloads; use `warningCounts` for their full cardinality.
   */
  warnings: FITDiagnosticWarningV1[];
  /** Raw unknown messages, present only when explicitly requested. */
  unknownMessages?: Record<string, unknown[]>;
};

/** Canonical, provider-neutral Health Intermediate Representation (Health IR). */
export type HealthDocumentV1 = {
  /** Health IR schema version. */
  schemaVersion: '1';
  /** Earliest absolute instant observed in the health content. */
  observedStart?: Date;
  /** Latest absolute instant observed in the health content. */
  observedEnd?: Date;
  /** Timezone evidence used to derive local wall-clock fields and dates. */
  timezone: {
    /**
     * Provenance of the selected offsets: explicit FIT offset, timestamp
     * correlation, conservative inference, or no usable timezone evidence.
     */
    strategy:
      | 'explicit_offset'
      | 'timestamp_correlation'
      | 'inferred'
      | 'unknown';
    /**
     * Chronological UTC-offset anchors. Each offset applies from `at` until the
     * next anchor; `offsetSeconds` is seconds east of UTC.
     */
    offsets: Array<{ at: Date; offsetSeconds: number }>;
  };
  /** Point-in-time measurements and non-valid measurement-status observations. */
  points: HealthPointV1[];
  /** Duration-based values and states. */
  intervals: HealthIntervalV1[];
  /** Aggregate source summaries that should not be treated as sampled series. */
  summaries: HealthSummaryV1[];
  /** Bounded sessions such as sleep, naps, and health snapshots. */
  sessions: HealthSessionV1[];
  /** Parser version, coverage, invalid values, and warning diagnostics. */
  diagnostics: FITDiagnosticsV1;
};

/** Options controlling FIT document normalization and diagnostic retention. */
export type FITDocumentParseOptions = {
  /** Retain decoded message collections not recognized by the Health parser. */
  includeUnknownMessages?: boolean;
  /** Retain FIT developer fields when supported by the decoder. */
  includeDeveloperFields?: boolean;
  /** Fail on recoverable parse problems instead of returning diagnostics. */
  strict?: boolean;
  /** Health-specific normalization options. */
  health?: {
    /**
     * Reconstruct intervals/deltas from cumulative monitoring counters.
     * Defaults to enabled.
     */
    reconstructIntervals?: boolean;
    /**
     * Also retain raw cumulative counter points when interval reconstruction is
     * enabled. Defaults to disabled to prevent accidental double counting.
     */
    retainCumulativeValues?: boolean;
  };
};

/** Garmin FIT SDK message collections keyed by their plural message name. */
export type FITMessages = Record<string, unknown[] | undefined>;

/** Decoder environment metadata recorded in Health IR diagnostics. */
export type FITHealthBuildEnvironment = {
  /** Garmin FIT SDK profile version used to decode `messages`. */
  sdkProfileVersion?: string;
};

/** Parser revision embedded in `HealthDocumentV1.diagnostics.parserVersion`. */
export const TRACKSWAP_HEALTH_PARSER_VERSION = "trackswap-health-ir-v1";

const HEALTH_MESSAGE_NAMES = new Set([
  'timestampCorrelationMesgs',
  'monitoringInfoMesgs',
  'monitoringMesgs',
  'monitoringHrDataMesgs',
  'stressLevelMesgs',
  'respirationRateMesgs',
  'spo2DataMesgs',
  'hrvStatusSummaryMesgs',
  'hrvValueMesgs',
  'sleepLevelMesgs',
  'sleepAssessmentMesgs',
  'napEventMesgs',
  'hsaStepDataMesgs',
  'hsaSpo2DataMesgs',
  'hsaStressDataMesgs',
  'hsaRespirationDataMesgs',
  'hsaHeartRateDataMesgs',
  'hsaBodyBatteryDataMesgs',
  'hsaWristTemperatureDataMesgs',
  'skinTempOvernightMesgs',
  'sleepDisruptionSeverityPeriodMesgs',
  'sleepDisruptionOvernightSeverityMesgs',
]);

// Timestamp correlation provides timezone context to both activity and health
// files, so it is recognized but is not health evidence on its own.
const HEALTH_CLASSIFICATION_MESSAGE_NAMES = new Set(
  [...HEALTH_MESSAGE_NAMES].filter(
    (messageName) => messageName !== 'timestampCorrelationMesgs',
  ),
);

const KNOWN_NON_HEALTH_MESSAGE_NAMES = new Set([
  'fileIdMesgs',
  'fileCreatorMesgs',
  'deviceInfoMesgs',
  'deviceSettingsMesgs',
  'softwareMesgs',
  'ohrSettingsMesgs',
  'eventMesgs',
  'activityMesgs',
  'sessionMesgs',
  'lapMesgs',
  'recordMesgs',
  'lengthMesgs',
  'courseMesgs',
  'coursePointMesgs',
  'workoutMesgs',
  'workoutStepMesgs',
  'trainingFileMesgs',
]);

const CUMULATIVE_MONITORING_FIELDS: Array<{
  field: string;
  metric: HealthMetricCode;
  unit: string;
  rolloverModulus: number;
  rolloverBits: number;
}> = [
  {
    field: 'steps',
    metric: 'steps',
    unit: 'count',
    rolloverModulus: 2 ** 32,
    rolloverBits: 32,
  },
  {
    field: 'distance',
    metric: 'distance_m',
    unit: 'm',
    rolloverModulus: 2 ** 32 / 100,
    rolloverBits: 32,
  },
  {
    field: 'activeTime',
    metric: 'active_time_s',
    unit: 's',
    rolloverModulus: 2 ** 32 / 1000,
    rolloverBits: 32,
  },
  {
    field: 'activeCalories',
    metric: 'active_energy_kcal',
    unit: 'kcal',
    rolloverModulus: 2 ** 16,
    rolloverBits: 16,
  },
  {
    field: 'calories',
    metric: 'total_energy_kcal',
    unit: 'kcal',
    rolloverModulus: 2 ** 16,
    rolloverBits: 16,
  },
];

const DELTA_MONITORING_FIELDS: Array<{
  field: string;
  metric: HealthMetricCode;
  unit: string;
  multiplier?: number;
  intervalStrategy: 'previous_timestamp' | 'value_duration';
}> = [
  {
    field: 'ascent',
    metric: 'ascent_m',
    unit: 'm',
    intervalStrategy: 'previous_timestamp',
  },
  {
    field: 'descent',
    metric: 'descent_m',
    unit: 'm',
    intervalStrategy: 'previous_timestamp',
  },
  {
    field: 'moderateActivityMinutes',
    metric: 'moderate_activity_time_s',
    unit: 's',
    multiplier: 60,
    intervalStrategy: 'value_duration',
  },
  {
    field: 'vigorousActivityMinutes',
    metric: 'vigorous_activity_time_s',
    unit: 's',
    multiplier: 60,
    intervalStrategy: 'value_duration',
  },
];

const FIT_EPOCH_UNIX_SECONDS = 631_065_600;
const TIMESTAMP_16_MODULUS = 2 ** 16;
const MAX_TIMEZONE_OFFSET_SECONDS = 18 * 60 * 60;
const HSA_STEP_FILE_MARKERS = new Set([0xffef, 0xffee]);
const DIAGNOSTIC_WARNING_SAMPLE_LIMIT = 5;

function asObject(value: unknown): Record<string, any> {
  return value && typeof value === 'object'
    ? (value as Record<string, any>)
    : {};
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }
  if (typeof value !== 'string' || value.trim() === '') return undefined;
  const result = Number(value);
  return Number.isFinite(result) ? result : undefined;
}

function asDate(value: unknown): Date | undefined {
  if (value instanceof Date && Number.isFinite(value.valueOf())) return value;
  if (
    (typeof value !== 'string' && typeof value !== 'number') ||
    (typeof value === 'string' && value.trim() === '')
  ) {
    return undefined;
  }
  const result = new Date(value);
  return Number.isFinite(result.valueOf()) ? result : undefined;
}

function localTimestamp(value: unknown) {
  const date = fitLocalDateTime(value);
  return date?.toISOString().replace(/Z$/, '');
}

/** FIT local_date_time numbers use seconds from the FIT epoch. */
function fitLocalDateTime(value: unknown): Date | undefined {
  if (value instanceof Date && Number.isFinite(value.valueOf())) return value;
  if (typeof value === 'string' && !/^\s*[-+]?\d+(?:\.\d+)?\s*$/.test(value)) {
    return asDate(value);
  }
  const seconds = asNumber(value);
  if (seconds === undefined || seconds < 0) return undefined;
  return new Date((seconds + FIT_EPOCH_UNIX_SECONDS) * 1000);
}

function pointer(
  messageName: string,
  messageIndex: number,
  fieldName?: string,
): HealthMessagePointerV1 {
  return { messageName, messageIndex, fieldName };
}

function metricRecord(message: Record<string, any>, keys: string[]) {
  return Object.fromEntries(
    keys
      .map((key) => [key, message[key]] as const)
      .filter(([, value]) =>
        typeof value === 'number'
          ? Number.isFinite(value)
          : ['string', 'boolean'].includes(typeof value),
      ),
  ) as Record<string, number | string | boolean | null>;
}

function messageCounts(messages: FITMessages) {
  return Object.fromEntries(
    Object.entries(messages)
      .filter(([, value]) => Array.isArray(value) && value.length > 0)
      .map(([name, value]) => [name, value?.length ?? 0]),
  );
}

/**
 * Detects every high-level content kind represented by decoded FIT messages.
 *
 * The result may contain more than one kind for mixed-content files. It falls
 * back to `unknown` when no supported evidence is present.
 */
export function detectFITKinds(messages: FITMessages): FITPrimaryKind[] {
  const result: FITPrimaryKind[] = [];
  if (
    (messages.activityMesgs?.length ?? 0) > 0 ||
    (messages.sessionMesgs?.length ?? 0) > 0
  ) {
    result.push('activity');
  }
  if (
    [...HEALTH_CLASSIFICATION_MESSAGE_NAMES].some(
      (messageName) => (messages[messageName]?.length ?? 0) > 0,
    )
  ) {
    result.push('health');
  }
  if (
    (messages.workoutMesgs?.length ?? 0) > 0 ||
    (messages.workoutStepMesgs?.length ?? 0) > 0
  ) {
    result.push('workout');
  }
  if ((messages.courseMesgs?.length ?? 0) > 0) result.push('course');
  if (
    result.length === 0 &&
    ((messages.deviceInfoMesgs?.length ?? 0) > 0 ||
      (messages.fileIdMesgs?.length ?? 0) > 0)
  ) {
    result.push('device');
  }
  return result.length > 0 ? result : ['unknown'];
}

function sleepStage(value: unknown): HealthSessionSegmentV1['segmentType'] {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[_\s-]+/g, '');
  if (normalized.includes('awake')) return 'awake';
  if (normalized.includes('deep')) return 'deep';
  if (normalized.includes('light')) return 'light';
  if (normalized.includes('rem')) return 'rem';
  if (normalized.includes('unmeasurable')) return 'unmeasurable';
  if (normalized.includes('sleep')) return 'sleeping';
  return `vendor:${normalized || 'unknown'}`;
}

function calendarDateAtOffset(timestamp: Date, offsetSeconds = 0) {
  return new Date(timestamp.valueOf() + offsetSeconds * 1000)
    .toISOString()
    .slice(0, 10);
}

function sessionCalendarDateAtOffset(
  startTime: Date,
  endTime: Date,
  offsetSeconds = 0,
) {
  return calendarDateAtOffset(
    new Date(Math.max(startTime.valueOf(), endTime.valueOf() - 1)),
    offsetSeconds,
  );
}

function fitTimezoneOffsetMinutesToSeconds(value: unknown) {
  const offsetMinutes = asNumber(value);
  return offsetMinutes === undefined ? undefined : offsetMinutes * 60;
}

function buildTimezoneContext(
  messages: FITMessages,
  onInvalidOffset: (source: HealthMessagePointerV1) => void,
) {
  type Candidate = {
    at: Date;
    offsetSeconds: number;
    priority: number;
    strategy: HealthDocumentV1['timezone']['strategy'];
    source: HealthMessagePointerV1;
  };
  const candidates: Candidate[] = [];
  const addLocalPair = (
    messageName: string,
    messageIndex: number,
    message: Record<string, any>,
    priority: number,
    strategy: Candidate['strategy'],
  ) => {
    const at = asDate(message.timestamp);
    const local = fitLocalDateTime(message.localTimestamp);
    if (!at || !local) return;
    const offsetSeconds = Math.round((local.valueOf() - at.valueOf()) / 1000);
    const source = pointer(messageName, messageIndex, 'localTimestamp');
    if (Math.abs(offsetSeconds) > MAX_TIMEZONE_OFFSET_SECONDS) {
      onInvalidOffset(source);
      return;
    }
    candidates.push({ at, offsetSeconds, priority, strategy, source });
  };

  (messages.timestampCorrelationMesgs ?? []).forEach((raw, messageIndex) => {
    addLocalPair(
      'timestampCorrelationMesgs',
      messageIndex,
      asObject(raw),
      3,
      'timestamp_correlation',
    );
  });
  for (const messageName of [
    'monitoringInfoMesgs',
    'monitoringMesgs',
    'skinTempOvernightMesgs',
  ]) {
    (messages[messageName] ?? []).forEach((raw, messageIndex) => {
      addLocalPair(messageName, messageIndex, asObject(raw), 1, 'inferred');
    });
  }
  (messages.napEventMesgs ?? []).forEach((raw, messageIndex) => {
    const message = asObject(raw);
    for (const [timeField, offsetField] of [
      ['startTime', 'startTimezoneOffset'],
      ['endTime', 'endTimezoneOffset'],
    ] as const) {
      const at = asDate(message[timeField]);
      const offsetSeconds = fitTimezoneOffsetMinutesToSeconds(
        message[offsetField],
      );
      if (!at || offsetSeconds === undefined) continue;
      const source = pointer('napEventMesgs', messageIndex, offsetField);
      if (Math.abs(offsetSeconds) > MAX_TIMEZONE_OFFSET_SECONDS) {
        onInvalidOffset(source);
        continue;
      }
      candidates.push({
        at,
        offsetSeconds,
        priority: 2,
        strategy: 'explicit_offset',
        source,
      });
    }
  });

  candidates.sort(
    (left, right) =>
      left.at.valueOf() - right.at.valueOf() || right.priority - left.priority,
  );
  const offsets = candidates
    .filter(
      (candidate, index) =>
        index === 0 ||
        candidate.at.valueOf() !== candidates[index - 1]!.at.valueOf(),
    )
    .map(({ at, offsetSeconds }) => ({ at, offsetSeconds }));
  const strategy =
    candidates.find(({ strategy }) => strategy === 'timestamp_correlation')
      ?.strategy ??
    candidates.find(({ strategy }) => strategy === 'explicit_offset')
      ?.strategy ??
    candidates.find(({ strategy }) => strategy === 'inferred')?.strategy ??
    'unknown';
  return { offsets, strategy };
}

function reconstructTimestamp16(
  timestamp16: unknown,
  previousTimestamp: Date | undefined,
) {
  const lowerBits = asNumber(timestamp16);
  if (
    !previousTimestamp ||
    !Number.isInteger(lowerBits) ||
    lowerBits! < 0 ||
    lowerBits! >= TIMESTAMP_16_MODULUS
  ) {
    return undefined;
  }
  const previousFitSeconds =
    Math.floor(previousTimestamp.valueOf() / 1000) - FIT_EPOCH_UNIX_SECONDS;
  let candidateFitSeconds =
    Math.floor(previousFitSeconds / TIMESTAMP_16_MODULUS) *
      TIMESTAMP_16_MODULUS +
    lowerBits!;
  if (candidateFitSeconds < previousFitSeconds) {
    candidateFitSeconds += TIMESTAMP_16_MODULUS;
  }
  return new Date((candidateFitSeconds + FIT_EPOCH_UNIX_SECONDS) * 1000);
}

function monitoringMessagesWithTimestamps(messages: FITMessages) {
  let previousTimestamp: Date | undefined;
  let currentDistinctTimestamp: Date | undefined;
  let priorDistinctTimestamp: Date | undefined;
  let currentActivityType: unknown;
  let currentIntensity: unknown;
  let currentDeviceIndex: unknown;
  return (messages.monitoringMesgs ?? []).map((raw) => {
    const message = asObject(raw);
    const explicitTimestamp = asDate(message.timestamp);
    const timestamp =
      explicitTimestamp ??
      reconstructTimestamp16(message.timestamp16, previousTimestamp);
    if (timestamp) previousTimestamp = timestamp;
    if (
      timestamp &&
      (!currentDistinctTimestamp || timestamp > currentDistinctTimestamp)
    ) {
      priorDistinctTimestamp = currentDistinctTimestamp;
      currentDistinctTimestamp = timestamp;
    }
    const intervalStartTime = priorDistinctTimestamp;
    if (message.activityType !== undefined) {
      currentActivityType = message.activityType;
    }
    if (message.deviceIndex !== undefined) {
      currentDeviceIndex = message.deviceIndex;
    }
    const messageIntensity = message.intensity ?? message.activityLevel;
    if (messageIntensity !== undefined) currentIntensity = messageIntensity;
    return {
      message,
      timestamp,
      intervalStartTime,
      deviceIndex: currentDeviceIndex,
      activityType: currentActivityType,
      intensity: currentIntensity,
    };
  });
}

function offsetSecondsAt(
  offsets: Array<{ at: Date; offsetSeconds: number }>,
  timestamp: Date,
) {
  let result: number | undefined;
  for (const entry of offsets) {
    if (entry.at > timestamp) break;
    result = entry.offsetSeconds;
  }
  return result ?? offsets[0]?.offsetSeconds;
}

function localTimestampAt(timestamp: Date, offsetSeconds?: number) {
  if (offsetSeconds === undefined) return undefined;
  return new Date(timestamp.valueOf() + offsetSeconds * 1000)
    .toISOString()
    .replace(/Z$/, '');
}

function accumulatorDelta(
  previous: number,
  current: number,
  rolloverModulus: number,
  rolloverBits: number,
) {
  if (current >= previous) return { value: current - previous };
  if (
    previous >= rolloverModulus * 0.75 &&
    previous < rolloverModulus &&
    current >= 0 &&
    current <= rolloverModulus * 0.25
  ) {
    return {
      value: rolloverModulus - previous + current,
      rolloverBits,
    };
  }
  return null;
}

function stressStatus(value: number): HealthValueStatus {
  if (value >= 1 && value <= 100) return 'valid';
  if (value === -1) return 'off_wrist';
  if (value === -2) return 'motion';
  if (value === -3) return 'not_enough_data';
  if (value === -4) return 'recovering';
  if (value === -5) return 'unidentified';
  if (value === -16) return 'gap';
  return value === 0 || value > 100 ? 'invalid' : 'unknown';
}

function hsaStressStatus(value: number): HealthValueStatus {
  if (value >= 0 && value <= 100) return 'valid';
  return stressStatus(value);
}

function hsaRespirationStatus(value: number): HealthValueStatus {
  if (value === 255) return 'invalid';
  if (value === 254) return 'motion';
  if (value === 253) return 'off_wrist';
  if (value === 252) return 'not_enough_data';
  // Profile 21.202 exposes the custom blank value (raw 240, scale 100) as 2.4.
  if (value === 2.4) return 'gap';
  return value >= 1 && value <= 100 ? 'valid' : 'invalid';
}

function hsaSampleTimestamp(
  timestamp: Date,
  processingIntervalSeconds: number,
  sequenceIndex: number,
) {
  return new Date(
    timestamp.valueOf() + processingIntervalSeconds * sequenceIndex * 1000,
  );
}

function compactDiagnosticWarnings(diagnostics: FITDiagnosticsV1) {
  const samples = new Map<string, FITDiagnosticWarningV1[]>();
  const counts: Record<string, number> = {};
  diagnostics.warnings.forEach((warning) => {
    counts[warning.code] = (counts[warning.code] ?? 0) + 1;
    const codeSamples = samples.get(warning.code) ?? [];
    if (codeSamples.length < DIAGNOSTIC_WARNING_SAMPLE_LIMIT) {
      codeSamples.push(warning);
      samples.set(warning.code, codeSamples);
    }
  });
  diagnostics.warningCounts = counts;
  diagnostics.warnings = [...samples.values()].flat();
}

function respirationStatus(value: number): HealthValueStatus {
  // The FIT field is scaled by 100. Garmin FIT SDK therefore exposes the
  // documented raw sentinels -100/-200/-300 as -1/-2/-3.
  if (value === -1) return 'off_wrist';
  if (value === -2) return 'motion';
  if (value === -3) return 'invalid';
  return value > 0 && value <= 100 ? 'valid' : 'invalid';
}

/**
 * Normalizes Garmin FIT SDK message collections into Health IR schema v1.
 *
 * Absolute timestamps are represented as `Date` values. Local wall-clock
 * fields never replace those instants and must be interpreted with their UTC
 * offset. Garmin sentinel values are mapped to `HealthValueStatus`; non-valid
 * sentinels are not emitted as physiological numeric values.
 *
 * @param messages Decoded Garmin FIT SDK message collections.
 * @param options Normalization and diagnostic-retention options.
 * @param environment Decoder metadata that affects diagnostics, not values.
 * @returns A deterministic, chronologically ordered Health IR document.
 */
export function buildHealthDocumentFromMessages(
  messages: FITMessages,
  options: FITDocumentParseOptions = {},
  environment: FITHealthBuildEnvironment = {},
): HealthDocumentV1 {
  const counts = messageCounts(messages);
  const recognizedMessageCounts = Object.fromEntries(
    Object.entries(counts).filter(([name]) => HEALTH_MESSAGE_NAMES.has(name)),
  );
  const unknownMessageCounts = Object.fromEntries(
    Object.entries(counts).filter(
      ([name]) =>
        !HEALTH_MESSAGE_NAMES.has(name) &&
        !KNOWN_NON_HEALTH_MESSAGE_NAMES.has(name),
    ),
  );
  const diagnostics: FITDiagnosticsV1 = {
    sdkProfileVersion: environment.sdkProfileVersion,
    parserVersion: TRACKSWAP_HEALTH_PARSER_VERSION,
    messageCounts: counts,
    recognizedMessageCounts,
    unknownMessageCounts,
    invalidValueCounts: {},
    warningCounts: {},
    warnings: [],
  };
  if (options.includeUnknownMessages) {
    diagnostics.unknownMessages = Object.fromEntries(
      Object.keys(unknownMessageCounts).map((name) => [
        name,
        messages[name] ?? [],
      ]),
    );
  }

  const points: HealthPointV1[] = [];
  const intervals: HealthIntervalV1[] = [];
  const summaries: HealthSummaryV1[] = [];
  const sessions: HealthSessionV1[] = [];
  const observedTimes: Date[] = [];
  const timezone = buildTimezoneContext(messages, (source) => {
    diagnostics.warnings.push({
      code: 'GARMIN_HEALTH_INVALID_TIMEZONE_OFFSET',
      message: 'Ignored an implausible FIT timezone offset',
      source,
    });
  });
  const { offsets } = timezone;

  const addPoint = (point: HealthPointV1) => {
    const offsetSeconds =
      point.offsetSeconds ?? offsetSecondsAt(offsets, point.timestamp);
    point.offsetSeconds = offsetSeconds;
    point.localTimestamp ??= localTimestampAt(point.timestamp, offsetSeconds);
    points.push(point);
    observedTimes.push(point.timestamp);
    if (point.status !== 'valid') {
      const key = `${point.metric}:${point.status}`;
      diagnostics.invalidValueCounts[key] =
        (diagnostics.invalidValueCounts[key] ?? 0) + 1;
    }
  };

  const monitoringState = new Map<string, { timestamp: Date; value: number }>();
  monitoringMessagesWithTimestamps(messages).forEach(
    (
      {
        message,
        timestamp,
        intervalStartTime,
        deviceIndex,
        activityType,
        intensity,
      },
      messageIndex,
    ) => {
      if (!timestamp) {
        diagnostics.warnings.push({
          code: 'GARMIN_HEALTH_NO_TIMESTAMP',
          message: 'Monitoring message has no valid timestamp',
          source: pointer('monitoringMesgs', messageIndex),
        });
        return;
      }
      observedTimes.push(timestamp);
      const heartRate = asNumber(message.heartRate);
      if (heartRate !== undefined) {
        const status = heartRate > 0 ? 'valid' : 'gap';
        addPoint({
          metric: 'heart_rate_bpm',
          timestamp,
          localTimestamp: localTimestamp(message.localTimestamp),
          value: status === 'valid' ? heartRate : undefined,
          unit: 'bpm',
          status,
          aggregation: 'instant',
          source: pointer('monitoringMesgs', messageIndex, 'heartRate'),
          attributes: status === 'valid' ? undefined : { rawValue: heartRate },
        });
      }
      const temperature = asNumber(message.temperature);
      if (temperature !== undefined) {
        addPoint({
          metric: 'temperature_c',
          timestamp,
          localTimestamp: localTimestamp(message.localTimestamp),
          value: temperature,
          unit: 'degC',
          status: 'valid',
          aggregation: 'mean',
          source: pointer('monitoringMesgs', messageIndex, 'temperature'),
        });
      }

      for (const definition of CUMULATIVE_MONITORING_FIELDS) {
        const value = asNumber(message[definition.field]);
        if (value === undefined) continue;
        const stateKey = [
          deviceIndex ?? 'device',
          activityType ?? 'activity',
          definition.field,
        ].join(':');
        const previous = monitoringState.get(stateKey);
        if (previous && timestamp > previous.timestamp) {
          const delta = accumulatorDelta(
            previous.value,
            value,
            definition.rolloverModulus,
            definition.rolloverBits,
          );
          if (delta) {
            if (delta.rolloverBits) {
              diagnostics.warnings.push({
                code: 'GARMIN_HEALTH_ACCUMULATOR_ROLLOVER',
                message: `${definition.field} accumulator rolled over at ${delta.rolloverBits} bits`,
                source: pointer(
                  'monitoringMesgs',
                  messageIndex,
                  definition.field,
                ),
              });
            }
            const offsetSeconds = offsetSecondsAt(offsets, previous.timestamp);
            intervals.push({
              metric: definition.metric,
              startTime: previous.timestamp,
              endTime: timestamp,
              localStartTime: localTimestampAt(
                previous.timestamp,
                offsetSeconds,
              ),
              offsetSeconds,
              value: delta.value,
              unit: definition.unit,
              status: 'valid',
              activityType:
                activityType === undefined ? undefined : String(activityType),
              intensity:
                intensity === undefined ? undefined : String(intensity),
              source: pointer(
                'monitoringMesgs',
                messageIndex,
                definition.field,
              ),
              attributes:
                options.health?.retainCumulativeValues === false
                  ? undefined
                  : { rawCumulativeValue: value },
            });
          } else {
            diagnostics.warnings.push({
              code: 'GARMIN_HEALTH_ACCUMULATOR_RESET',
              message: `${definition.field} accumulator decreased; a new accumulation window was started`,
              source: pointer(
                'monitoringMesgs',
                messageIndex,
                definition.field,
              ),
            });
          }
        }
        monitoringState.set(stateKey, { timestamp, value });
      }

      for (const definition of DELTA_MONITORING_FIELDS) {
        const sourceValue = asNumber(message[definition.field]);
        if (sourceValue === undefined || sourceValue < 0) continue;
        const value = sourceValue * (definition.multiplier ?? 1);
        const startTime =
          definition.intervalStrategy === 'value_duration'
            ? new Date(timestamp.valueOf() - value * 1000)
            : intervalStartTime;
        if (!startTime || startTime >= timestamp) continue;
        const offsetSeconds = offsetSecondsAt(offsets, startTime);
        observedTimes.push(startTime);
        intervals.push({
          metric: definition.metric,
          startTime,
          endTime: timestamp,
          localStartTime: localTimestampAt(startTime, offsetSeconds),
          offsetSeconds,
          value,
          unit: definition.unit,
          status: 'valid',
          activityType:
            activityType === undefined ? undefined : String(activityType),
          intensity: intensity === undefined ? undefined : String(intensity),
          source: pointer('monitoringMesgs', messageIndex, definition.field),
        });
      }
    },
  );

  (messages.monitoringHrDataMesgs ?? []).forEach((raw, messageIndex) => {
    const message = asObject(raw);
    const timestamp = asDate(message.timestamp);
    if (!timestamp) return;
    const fields: Array<{
      field: string;
      metric: HealthMetricCode;
    }> = [
      {
        field: 'currentDayRestingHeartRate',
        metric: 'resting_heart_rate_bpm',
      },
      {
        field: 'restingHeartRate',
        metric: 'resting_heart_rate_7_day_bpm',
      },
    ];
    fields.forEach(({ field, metric }) => {
      const value = asNumber(message[field]);
      if (value === undefined) return;
      const status = value > 0 ? 'valid' : 'invalid';
      addPoint({
        metric,
        timestamp,
        value: status === 'valid' ? value : undefined,
        unit: 'bpm',
        status,
        aggregation: 'latest',
        source: pointer('monitoringHrDataMesgs', messageIndex, field),
        attributes: status === 'valid' ? undefined : { rawValue: value },
      });
    });
  });

  (messages.stressLevelMesgs ?? []).forEach((raw, messageIndex) => {
    const message = asObject(raw);
    const timestamp = asDate(message.stressLevelTime);
    const value = asNumber(message.stressLevelValue);
    if (!timestamp || value === undefined) return;
    const status = stressStatus(value);
    addPoint({
      metric: 'stress_level',
      timestamp,
      value: status === 'valid' ? value : undefined,
      unit: 'score',
      status,
      aggregation: 'instant',
      source: pointer('stressLevelMesgs', messageIndex, 'stressLevelValue'),
      attributes: status === 'valid' ? undefined : { rawValue: value },
    });
  });

  (messages.respirationRateMesgs ?? []).forEach((raw, messageIndex) => {
    const message = asObject(raw);
    const timestamp = asDate(message.timestamp);
    const value = asNumber(message.respirationRate);
    if (!timestamp || value === undefined) return;
    const status = respirationStatus(value);
    addPoint({
      metric: 'respiration_rate_bpm',
      timestamp,
      value: status === 'valid' ? value : undefined,
      unit: 'breaths/min',
      status,
      aggregation: 'instant',
      source: pointer('respirationRateMesgs', messageIndex, 'respirationRate'),
      attributes: status === 'valid' ? undefined : { rawValue: value },
    });
  });

  (messages.spo2DataMesgs ?? []).forEach((raw, messageIndex) => {
    const message = asObject(raw);
    const timestamp = asDate(message.timestamp);
    const value = asNumber(message.readingSpo2);
    if (!timestamp || value === undefined) return;
    const confidence = asNumber(message.readingConfidence);
    const status =
      value <= 0 || value > 100
        ? 'invalid'
        : confidence !== undefined && confidence <= 0
          ? 'low_confidence'
          : 'valid';
    addPoint({
      metric: 'spo2_percent',
      timestamp,
      value: status === 'invalid' ? undefined : value,
      unit: 'percent',
      status,
      quality: confidence,
      aggregation: 'instant',
      source: pointer('spo2DataMesgs', messageIndex, 'readingSpo2'),
      attributes: {
        measurementMode:
          message.mode === undefined ? null : String(message.mode),
        ...(status === 'invalid' ? { rawValue: value } : {}),
      },
    });
  });

  (messages.hrvValueMesgs ?? []).forEach((raw, messageIndex) => {
    const message = asObject(raw);
    const timestamp = asDate(message.timestamp);
    const value = asNumber(message.value);
    if (!timestamp || value === undefined) return;
    const status = value > 0 ? 'valid' : 'invalid';
    addPoint({
      metric: 'hrv_rmssd_ms',
      timestamp,
      value: status === 'valid' ? value : undefined,
      unit: 'ms',
      status,
      aggregation: 'mean',
      source: pointer('hrvValueMesgs', messageIndex, 'value'),
      attributes: {
        windowSeconds: 300,
        ...(status === 'valid' ? {} : { rawValue: value }),
      },
    });
  });

  (messages.hrvStatusSummaryMesgs ?? []).forEach((raw, messageIndex) => {
    const message = asObject(raw);
    const timestamp = asDate(message.timestamp);
    summaries.push({
      summaryType: 'hrv_status',
      externalId: `fit:hrv-status:${timestamp?.toISOString() ?? messageIndex}`,
      startTime: timestamp,
      metrics: metricRecord(message, [
        'weeklyAverage',
        'lastNightAverage',
        'lastNight5MinHigh',
        'baselineLowUpper',
        'baselineBalancedLower',
        'baselineBalancedUpper',
        'status',
      ]),
      source: pointer('hrvStatusSummaryMesgs', messageIndex),
    });
    if (timestamp) observedTimes.push(timestamp);
  });

  (messages.monitoringInfoMesgs ?? []).forEach((raw, messageIndex) => {
    const message = asObject(raw);
    const timestamp = asDate(message.timestamp);
    summaries.push({
      summaryType: 'device',
      externalId: `fit:monitoring-info:${timestamp?.toISOString() ?? messageIndex}`,
      startTime: timestamp,
      offsetSeconds: timestamp
        ? offsetSecondsAt(offsets, timestamp)
        : undefined,
      metrics: metricRecord(message, [
        'restingMetabolicRate',
        'activityType',
        'cyclesToDistance',
        'cyclesToCalories',
      ]),
      source: pointer('monitoringInfoMesgs', messageIndex),
    });
    if (timestamp) observedTimes.push(timestamp);
  });

  (messages.skinTempOvernightMesgs ?? []).forEach((raw, messageIndex) => {
    const message = asObject(raw);
    const timestamp = asDate(message.timestamp);
    if (!timestamp) return;
    const definitions: Array<{
      field: string;
      metric: HealthMetricCode;
    }> = [
      {
        field: 'averageDeviation',
        metric: 'skin_temperature_deviation_c',
      },
      {
        field: 'average7DayDeviation',
        metric: 'skin_temperature_7_day_deviation_c',
      },
      { field: 'nightlyValue', metric: 'skin_temperature_nightly_c' },
    ];
    definitions.forEach(({ field, metric }) => {
      const value = asNumber(message[field]);
      if (value === undefined) return;
      addPoint({
        metric,
        timestamp,
        localTimestamp: localTimestamp(message.localTimestamp),
        value,
        unit: 'degC',
        status: 'valid',
        aggregation: 'mean',
        source: pointer('skinTempOvernightMesgs', messageIndex, field),
      });
    });
  });

  const sleepLevels = (messages.sleepLevelMesgs ?? [])
    .map((raw, messageIndex) => ({
      message: asObject(raw),
      messageIndex,
      timestamp: asDate(asObject(raw).timestamp),
    }))
    .filter(
      (entry): entry is typeof entry & { timestamp: Date } =>
        entry.timestamp !== undefined,
    )
    .sort((a, b) => a.timestamp.valueOf() - b.timestamp.valueOf());
  if (sleepLevels.length >= 2) {
    const assessment = asObject(messages.sleepAssessmentMesgs?.[0]);
    const segments: HealthSessionSegmentV1[] = [];
    for (let index = 0; index < sleepLevels.length - 1; index += 1) {
      const current = sleepLevels[index];
      const next = sleepLevels[index + 1];
      if (next.timestamp <= current.timestamp) continue;
      const segment: HealthSessionSegmentV1 = {
        segmentType: sleepStage(current.message.sleepLevel),
        startTime: current.timestamp,
        endTime: next.timestamp,
        status: 'valid',
        source: pointer('sleepLevelMesgs', current.messageIndex, 'sleepLevel'),
      };
      const previous = segments.at(-1);
      if (
        previous &&
        previous.segmentType === segment.segmentType &&
        previous.endTime.valueOf() === segment.startTime.valueOf()
      ) {
        previous.endTime = segment.endTime;
      } else {
        segments.push(segment);
      }
    }
    const startTime = sleepLevels[0].timestamp;
    const endTime = sleepLevels.at(-1)!.timestamp;
    observedTimes.push(startTime, endTime);
    const endOffsetSeconds = offsetSecondsAt(offsets, endTime);
    sessions.push({
      sessionType: 'sleep',
      externalId: `fit:sleep:${startTime.toISOString()}:${endTime.toISOString()}`,
      startTime,
      endTime,
      startOffsetSeconds: offsetSecondsAt(offsets, startTime),
      endOffsetSeconds,
      calendarDate: sessionCalendarDateAtOffset(
        startTime,
        endTime,
        endOffsetSeconds,
      ),
      segments,
      metrics: metricRecord(assessment, [
        'combinedAwakeScore',
        'awakeTimeScore',
        'awakeningsCountScore',
        'deepSleepScore',
        'sleepDurationScore',
        'lightSleepScore',
        'overallSleepScore',
        'sleepQualityScore',
        'sleepRecoveryScore',
        'remSleepScore',
        'sleepRestlessnessScore',
        'awakeningsCount',
        'interruptionsScore',
        'averageStressDuringSleep',
      ]),
      source: pointer('sleepLevelMesgs', sleepLevels[0].messageIndex),
      attributes: {
        calendarDateStrategy:
          endOffsetSeconds === undefined
            ? 'sleep_end_utc_fallback_date'
            : 'sleep_end_local_date',
      },
    });
  } else if (sleepLevels.length > 0) {
    diagnostics.warnings.push({
      code: 'GARMIN_HEALTH_SLEEP_BOUNDARY_INCOMPLETE',
      message: 'Sleep level data does not contain enough boundaries',
      source: pointer('sleepLevelMesgs', sleepLevels[0].messageIndex),
    });
  }

  for (const messageName of [
    'sleepDisruptionSeverityPeriodMesgs',
    'sleepDisruptionOvernightSeverityMesgs',
  ] as const) {
    (messages[messageName] ?? []).forEach((raw, messageIndex) => {
      const message = asObject(raw);
      const timestamp = asDate(message.timestamp);
      if (!timestamp || message.severity === undefined) return;
      observedTimes.push(timestamp);
      summaries.push({
        summaryType: 'sleep',
        externalId: `fit:${messageName}:${message.messageIndex ?? messageIndex}:${timestamp.toISOString()}`,
        startTime: timestamp,
        offsetSeconds: offsetSecondsAt(offsets, timestamp),
        metrics: { severity: String(message.severity) },
        source: pointer(messageName, messageIndex, 'severity'),
      });
    });
  }

  (messages.napEventMesgs ?? []).forEach((raw, messageIndex) => {
    const message = asObject(raw);
    const startTime = asDate(message.startTime);
    const endTime = asDate(message.endTime);
    const deleted = message.isDeleted === true;
    if (
      !startTime ||
      !endTime ||
      endTime < startTime ||
      (!deleted && endTime.valueOf() === startTime.valueOf())
    ) {
      return;
    }
    // FIT nap_event timezone offsets are encoded in minutes, while the health
    // document contract consistently exposes timezone offsets in seconds.
    const startOffsetSeconds = fitTimezoneOffsetMinutesToSeconds(
      message.startTimezoneOffset,
    );
    const endOffsetSeconds = fitTimezoneOffsetMinutesToSeconds(
      message.endTimezoneOffset,
    );
    observedTimes.push(startTime, endTime);
    sessions.push({
      sessionType: 'nap',
      externalId: `fit:nap:${message.messageIndex ?? messageIndex}:${startTime.toISOString()}`,
      startTime,
      endTime,
      startOffsetSeconds,
      endOffsetSeconds,
      calendarDate: sessionCalendarDateAtOffset(
        startTime,
        endTime,
        endOffsetSeconds ?? startOffsetSeconds,
      ),
      deleted,
      segments: [],
      metrics: {},
      source: pointer('napEventMesgs', messageIndex),
      attributes: {
        source: message.source === undefined ? null : String(message.source),
        feedback:
          message.feedback === undefined ? null : String(message.feedback),
        updateTimestamp: asDate(message.updateTimestamp)?.toISOString() ?? null,
      },
    });
  });

  (messages.hsaStepDataMesgs ?? []).forEach((raw, messageIndex) => {
    const message = asObject(raw);
    const timestamp = asDate(message.timestamp);
    const intervalSeconds = asNumber(message.processingInterval);
    const values = Array.isArray(message.steps) ? message.steps : [];
    if (
      !timestamp ||
      !intervalSeconds ||
      intervalSeconds <= 0 ||
      HSA_STEP_FILE_MARKERS.has(intervalSeconds)
    ) {
      return;
    }
    values.forEach((rawValue: unknown, sequenceIndex: number) => {
      const value = asNumber(rawValue);
      if (value === undefined || value < 0) return;
      const startTime = hsaSampleTimestamp(
        timestamp,
        intervalSeconds,
        sequenceIndex,
      );
      const endTime = new Date(startTime.valueOf() + intervalSeconds * 1000);
      const offsetSeconds = offsetSecondsAt(offsets, startTime);
      observedTimes.push(startTime, endTime);
      intervals.push({
        metric: 'steps',
        startTime,
        endTime,
        localStartTime: localTimestampAt(startTime, offsetSeconds),
        offsetSeconds,
        value,
        unit: 'count',
        status: 'valid',
        source: pointer('hsaStepDataMesgs', messageIndex, 'steps'),
        attributes: { sequenceIndex, intervalSeconds },
      });
    });
  });

  (messages.hsaSpo2DataMesgs ?? []).forEach((raw, messageIndex) => {
    const message = asObject(raw);
    const timestamp = asDate(message.timestamp);
    const intervalSeconds = asNumber(message.processingInterval);
    const values = Array.isArray(message.readingSpo2)
      ? message.readingSpo2
      : [];
    const confidenceValues = Array.isArray(message.confidence)
      ? message.confidence
      : [];
    if (!timestamp || !intervalSeconds || intervalSeconds <= 0) return;
    values.forEach((rawValue: unknown, sequenceIndex: number) => {
      const value = asNumber(rawValue);
      if (value === undefined) return;
      const quality = asNumber(confidenceValues[sequenceIndex]);
      const status: HealthValueStatus =
        value < 70 || value > 100 || value === 240
          ? 'invalid'
          : quality !== undefined && quality <= 0
            ? 'low_confidence'
            : 'valid';
      addPoint({
        metric: 'spo2_percent',
        timestamp: hsaSampleTimestamp(
          timestamp,
          intervalSeconds,
          sequenceIndex,
        ),
        value: status === 'invalid' ? undefined : value,
        unit: 'percent',
        status,
        quality,
        aggregation: 'instant',
        source: pointer('hsaSpo2DataMesgs', messageIndex, 'readingSpo2'),
        attributes: {
          sequenceIndex,
          intervalSeconds,
          ...(status === 'invalid' ? { rawValue: value } : {}),
        },
      });
    });
  });

  (messages.hsaStressDataMesgs ?? []).forEach((raw, messageIndex) => {
    const message = asObject(raw);
    const timestamp = asDate(message.timestamp);
    const intervalSeconds = asNumber(message.processingInterval);
    const values = Array.isArray(message.stressLevel)
      ? message.stressLevel
      : [];
    if (!timestamp || !intervalSeconds || intervalSeconds <= 0) return;
    values.forEach((rawValue: unknown, sequenceIndex: number) => {
      const value = asNumber(rawValue);
      if (value === undefined) return;
      const status = hsaStressStatus(value);
      addPoint({
        metric: 'stress_level',
        timestamp: hsaSampleTimestamp(
          timestamp,
          intervalSeconds,
          sequenceIndex,
        ),
        value: status === 'valid' ? value : undefined,
        unit: 'score',
        status,
        aggregation: 'instant',
        source: pointer('hsaStressDataMesgs', messageIndex, 'stressLevel'),
        attributes: {
          sequenceIndex,
          intervalSeconds,
          ...(status === 'valid' ? {} : { rawValue: value }),
        },
      });
    });
  });

  (messages.hsaRespirationDataMesgs ?? []).forEach((raw, messageIndex) => {
    const message = asObject(raw);
    const timestamp = asDate(message.timestamp);
    const intervalSeconds = asNumber(message.processingInterval);
    const values = Array.isArray(message.respirationRate)
      ? message.respirationRate
      : [];
    if (!timestamp || !intervalSeconds || intervalSeconds <= 0) return;
    values.forEach((rawValue: unknown, sequenceIndex: number) => {
      const value = asNumber(rawValue);
      if (value === undefined) return;
      const status = hsaRespirationStatus(value);
      addPoint({
        metric: 'respiration_rate_bpm',
        timestamp: hsaSampleTimestamp(
          timestamp,
          intervalSeconds,
          sequenceIndex,
        ),
        value: status === 'valid' ? value : undefined,
        unit: 'breaths/min',
        status,
        aggregation: 'instant',
        source: pointer(
          'hsaRespirationDataMesgs',
          messageIndex,
          'respirationRate',
        ),
        attributes: {
          sequenceIndex,
          intervalSeconds,
          ...(status === 'valid' ? {} : { rawValue: value }),
        },
      });
    });
  });

  (messages.hsaHeartRateDataMesgs ?? []).forEach((raw, messageIndex) => {
    const message = asObject(raw);
    const timestamp = asDate(message.timestamp);
    const intervalSeconds = asNumber(message.processingInterval);
    const values = Array.isArray(message.heartRate) ? message.heartRate : [];
    const measurementStatus = asNumber(message.status);
    if (!timestamp || !intervalSeconds || intervalSeconds <= 0) return;
    values.forEach((rawValue: unknown, sequenceIndex: number) => {
      const value = asNumber(rawValue);
      if (value === undefined) return;
      const status: HealthValueStatus =
        value === 0
          ? 'gap'
          : measurementStatus === 1
            ? 'valid'
            : measurementStatus === 0
              ? 'low_confidence'
              : 'unknown';
      addPoint({
        metric: 'heart_rate_bpm',
        timestamp: hsaSampleTimestamp(
          timestamp,
          intervalSeconds,
          sequenceIndex,
        ),
        value: status === 'gap' ? undefined : value,
        unit: 'bpm',
        status,
        aggregation: 'instant',
        source: pointer('hsaHeartRateDataMesgs', messageIndex, 'heartRate'),
        attributes: {
          sequenceIndex,
          intervalSeconds,
          measurementStatus: measurementStatus ?? null,
          ...(status === 'gap' ? { rawValue: value } : {}),
        },
      });
    });
  });

  (messages.hsaWristTemperatureDataMesgs ?? []).forEach(
    (raw, messageIndex) => {
      const message = asObject(raw);
      const timestamp = asDate(message.timestamp);
      const intervalSeconds = asNumber(message.processingInterval);
      const values = Array.isArray(message.value) ? message.value : [];
      if (!timestamp || !intervalSeconds || intervalSeconds <= 0) return;
      values.forEach((rawValue: unknown, sequenceIndex: number) => {
        const value = asNumber(rawValue);
        if (value === undefined) return;
        addPoint({
          metric: 'wrist_temperature_c',
          timestamp: hsaSampleTimestamp(
            timestamp,
            intervalSeconds,
            sequenceIndex,
          ),
          value,
          unit: 'degC',
          status: 'valid',
          aggregation: 'instant',
          source: pointer(
            'hsaWristTemperatureDataMesgs',
            messageIndex,
            'value',
          ),
          attributes: { sequenceIndex, intervalSeconds },
        });
      });
    },
  );

  (messages.hsaBodyBatteryDataMesgs ?? []).forEach((raw, messageIndex) => {
    const message = asObject(raw);
    const timestamp = asDate(message.timestamp);
    const intervalSeconds = asNumber(message.processingInterval) ?? 0;
    if (!timestamp || intervalSeconds <= 0) return;
    const arrays: Array<{
      field: string;
      metric: HealthMetricCode;
      unit: string;
    }> = [
      { field: 'level', metric: 'body_battery_level', unit: 'score' },
      { field: 'charged', metric: 'body_battery_charged', unit: 'score' },
      { field: 'uncharged', metric: 'body_battery_drained', unit: 'score' },
    ];
    arrays.forEach(({ field, metric, unit }) => {
      const values = Array.isArray(message[field]) ? message[field] : [];
      values.forEach((rawValue: unknown, index: number) => {
        const value = asNumber(rawValue);
        if (value === undefined) return;
        const status =
          field === 'level' && value === -16
            ? 'gap'
            : field === 'level' && (value < 0 || value > 100)
              ? 'invalid'
              : 'valid';
        addPoint({
          metric,
          timestamp: hsaSampleTimestamp(timestamp, intervalSeconds, index),
          value: status === 'valid' ? value : undefined,
          unit,
          status,
          aggregation: 'instant',
          source: pointer('hsaBodyBatteryDataMesgs', messageIndex, field),
          attributes: {
            sequenceIndex: index,
            intervalSeconds,
            ...(status === 'valid' ? {} : { rawValue: value }),
          },
        });
      });
    });
  });

  points.sort((a, b) => a.timestamp.valueOf() - b.timestamp.valueOf());
  intervals.sort((a, b) => a.startTime.valueOf() - b.startTime.valueOf());
  sessions.sort((a, b) => a.startTime.valueOf() - b.startTime.valueOf());
  observedTimes.sort((a, b) => a.valueOf() - b.valueOf());
  compactDiagnosticWarnings(diagnostics);

  return {
    schemaVersion: '1',
    observedStart: observedTimes[0],
    observedEnd: observedTimes.at(-1),
    timezone: {
      strategy: timezone.strategy,
      offsets,
    },
    points,
    intervals: options.health?.reconstructIntervals === false ? [] : intervals,
    summaries,
    sessions,
    diagnostics,
  };
}

/**
 * FIT structure plugin that attaches detected content kinds and a normalized
 * Health IR facet to TrackSwap's decoded FIT document.
 */
export class HealthStructurePlugin extends BaseFITStructurePlugin {
  /** Stable plugin identifier. */
  name = 'HealthStructurePlugin';
  /** Structure-plugin execution priority. */
  priority = 20;

  /** Builds the health facet and FIT document metadata for decoded messages. */
  structureData(
    messages: FITMessages,
    context: FITContext,
  ): Partial<import('./types.js').FITFileType> {
    const options =
      (context.userData?.fitDocumentOptions as
        | FITDocumentParseOptions
        | undefined) ?? {};
    const detectedKinds = detectFITKinds(messages);
    return {
      healthDocument: detectedKinds.includes('health')
        ? buildHealthDocumentFromMessages(messages, options, {
            sdkProfileVersion: context.metadata.get(
              'fit-sdk-profile-version',
            ) as string | undefined,
          })
        : undefined,
      fitDocumentMetadata: {
        detectedKinds,
        messageCounts: messageCounts(messages),
      },
    };
  }
}
