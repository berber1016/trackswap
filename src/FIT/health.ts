import { BaseFITStructurePlugin } from "./base.js";
import type { FITContext } from "./types.js";

export type FITPrimaryKind =
  | 'activity'
  | 'health'
  | 'workout'
  | 'course'
  | 'device'
  | 'unknown';

export type HealthMetricCode =
  | 'heart_rate_bpm'
  | 'resting_heart_rate_bpm'
  | 'resting_heart_rate_7_day_bpm'
  | 'steps'
  | 'distance_m'
  | 'active_time_s'
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
  | 'skin_temperature_deviation_c'
  | 'skin_temperature_7_day_deviation_c'
  | 'skin_temperature_nightly_c'
  | 'ascent_m'
  | 'descent_m'
  | `vendor:${string}`;

export type HealthValueStatus =
  | 'valid'
  | 'invalid'
  | 'off_wrist'
  | 'motion'
  | 'low_confidence'
  | 'gap'
  | 'unknown';

export type HealthMessagePointerV1 = {
  messageName: string;
  messageIndex: number;
  fieldName?: string;
  developerField?: boolean;
};

export type HealthPointV1 = {
  metric: HealthMetricCode;
  timestamp: Date;
  localTimestamp?: string;
  offsetSeconds?: number;
  value?: number;
  unit: string;
  status: HealthValueStatus;
  quality?: number;
  aggregation?: 'instant' | 'mean' | 'min' | 'max' | 'sum' | 'latest';
  source: HealthMessagePointerV1;
  attributes?: Record<string, string | number | boolean | null>;
};

export type HealthIntervalV1 = {
  metric: HealthMetricCode;
  startTime: Date;
  endTime: Date;
  localStartTime?: string;
  offsetSeconds?: number;
  value?: number;
  unit: string;
  status: HealthValueStatus;
  activityType?: string;
  intensity?: string;
  source: HealthMessagePointerV1;
  attributes?: Record<string, string | number | boolean | null>;
};

export type HealthSummaryV1 = {
  summaryType:
    | 'daily'
    | 'sleep'
    | 'hrv_status'
    | 'monitoring_window'
    | 'device';
  externalId: string;
  calendarDate?: string;
  startTime?: Date;
  endTime?: Date;
  offsetSeconds?: number;
  metrics: Record<string, number | string | boolean | null>;
  source: HealthMessagePointerV1;
};

export type HealthSessionSegmentV1 = {
  segmentType:
    | 'awake'
    | 'light'
    | 'deep'
    | 'rem'
    | 'unmeasurable'
    | 'sleeping'
    | `vendor:${string}`;
  startTime: Date;
  endTime: Date;
  status: HealthValueStatus;
  source: HealthMessagePointerV1;
};

export type HealthSessionV1 = {
  sessionType: 'sleep' | 'nap' | 'health_snapshot' | `vendor:${string}`;
  externalId: string;
  startTime: Date;
  endTime: Date;
  startOffsetSeconds?: number;
  endOffsetSeconds?: number;
  calendarDate?: string;
  deleted?: boolean;
  segments: HealthSessionSegmentV1[];
  metrics: Record<string, number | string | boolean | null>;
  source: HealthMessagePointerV1;
  attributes?: Record<string, string | number | boolean | null>;
};

export type FITDiagnosticWarningV1 = {
  code: string;
  message: string;
  source?: HealthMessagePointerV1;
};

export type FITDiagnosticsV1 = {
  sdkProfileVersion?: string;
  parserVersion: string;
  messageCounts: Record<string, number>;
  recognizedMessageCounts: Record<string, number>;
  unknownMessageCounts: Record<string, number>;
  invalidValueCounts: Record<string, number>;
  warnings: FITDiagnosticWarningV1[];
  unknownMessages?: Record<string, unknown[]>;
};

export type HealthDocumentV1 = {
  schemaVersion: '1';
  observedStart?: Date;
  observedEnd?: Date;
  timezone: {
    strategy:
      | 'explicit_offset'
      | 'timestamp_correlation'
      | 'inferred'
      | 'unknown';
    offsets: Array<{ at: Date; offsetSeconds: number }>;
  };
  points: HealthPointV1[];
  intervals: HealthIntervalV1[];
  summaries: HealthSummaryV1[];
  sessions: HealthSessionV1[];
  diagnostics: FITDiagnosticsV1;
};

export type FITDocumentParseOptions = {
  includeUnknownMessages?: boolean;
  includeDeveloperFields?: boolean;
  strict?: boolean;
  health?: {
    reconstructIntervals?: boolean;
    retainCumulativeValues?: boolean;
  };
};

export type FITMessages = Record<string, unknown[] | undefined>;

export const TRACKSWAP_HEALTH_PARSER_VERSION = "trackswap-0.2.0-health-ir-v1";

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
  'hsaBodyBatteryDataMesgs',
  'skinTempOvernightMesgs',
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
  {
    field: 'ascent',
    metric: 'ascent_m',
    unit: 'm',
    rolloverModulus: 2 ** 32 / 1000,
    rolloverBits: 32,
  },
  {
    field: 'descent',
    metric: 'descent_m',
    unit: 'm',
    rolloverModulus: 2 ** 32 / 1000,
    rolloverBits: 32,
  },
];

function asObject(value: unknown): Record<string, any> {
  return value && typeof value === 'object'
    ? (value as Record<string, any>)
    : {};
}

function asNumber(value: unknown): number | undefined {
  const result = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(result) ? result : undefined;
}

function asDate(value: unknown): Date | undefined {
  if (value instanceof Date && Number.isFinite(value.valueOf())) return value;
  if (value === null || value === undefined || value === '') return undefined;
  const result = new Date(value as string | number);
  return Number.isFinite(result.valueOf()) ? result : undefined;
}

function localTimestamp(value: unknown) {
  const date = asDate(value);
  return date?.toISOString().replace(/Z$/, '');
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
        ['number', 'string', 'boolean'].includes(typeof value),
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

function buildTimezoneOffsets(messages: FITMessages) {
  return (messages.timestampCorrelationMesgs ?? [])
    .map((raw) => {
      const message = asObject(raw);
      const at = asDate(message.timestamp);
      const local = asDate(message.localTimestamp);
      if (!at || !local) return null;
      return {
        at,
        offsetSeconds: Math.round((local.valueOf() - at.valueOf()) / 1000),
      };
    })
    .filter(
      (value): value is { at: Date; offsetSeconds: number } => value !== null,
    )
    .sort((a, b) => a.at.valueOf() - b.at.valueOf());
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
  return result;
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

function respirationStatus(value: number): HealthValueStatus {
  if (value === -100) return 'off_wrist';
  if (value === -200) return 'motion';
  if (value === -300) return 'invalid';
  return value >= 0 ? 'valid' : 'unknown';
}

export function buildHealthDocumentFromMessages(
  messages: FITMessages,
  options: FITDocumentParseOptions = {},
  environment: { sdkProfileVersion?: string } = {},
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
  const offsets = buildTimezoneOffsets(messages);

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
  (messages.monitoringMesgs ?? []).forEach((raw, messageIndex) => {
    const message = asObject(raw);
    const timestamp = asDate(message.timestamp);
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
      addPoint({
        metric: 'heart_rate_bpm',
        timestamp,
        localTimestamp: localTimestamp(message.localTimestamp),
        value: heartRate,
        unit: 'bpm',
        status: 'valid',
        aggregation: 'instant',
        source: pointer('monitoringMesgs', messageIndex, 'heartRate'),
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
        message.deviceIndex ?? 'device',
        message.activityType ?? 'activity',
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
            localStartTime: localTimestampAt(previous.timestamp, offsetSeconds),
            offsetSeconds,
            value: delta.value,
            unit: definition.unit,
            status: 'valid',
            activityType:
              message.activityType === undefined
                ? undefined
                : String(message.activityType),
            intensity:
              message.activityLevel === undefined
                ? undefined
                : String(message.activityLevel),
            source: pointer('monitoringMesgs', messageIndex, definition.field),
            attributes:
              options.health?.retainCumulativeValues === false
                ? undefined
                : { rawCumulativeValue: value },
          });
        } else {
          diagnostics.warnings.push({
            code: 'GARMIN_HEALTH_ACCUMULATOR_RESET',
            message: `${definition.field} accumulator decreased; a new accumulation window was started`,
            source: pointer('monitoringMesgs', messageIndex, definition.field),
          });
        }
      }
      monitoringState.set(stateKey, { timestamp, value });
    }
  });

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
      addPoint({
        metric,
        timestamp,
        value,
        unit: 'bpm',
        status: 'valid',
        aggregation: 'latest',
        source: pointer('monitoringHrDataMesgs', messageIndex, field),
      });
    });
  });

  (messages.stressLevelMesgs ?? []).forEach((raw, messageIndex) => {
    const message = asObject(raw);
    const timestamp = asDate(message.stressLevelTime);
    const value = asNumber(message.stressLevelValue);
    if (!timestamp || value === undefined) return;
    addPoint({
      metric: 'stress_level',
      timestamp,
      value: value >= 1 && value <= 100 ? value : undefined,
      unit: 'score',
      status: value >= 1 && value <= 100 ? 'valid' : 'invalid',
      aggregation: 'instant',
      source: pointer('stressLevelMesgs', messageIndex, 'stressLevelValue'),
      attributes: { rawValue: value },
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
    addPoint({
      metric: 'spo2_percent',
      timestamp,
      value,
      unit: 'percent',
      status:
        confidence !== undefined && confidence <= 0
          ? 'low_confidence'
          : 'valid',
      quality: confidence,
      aggregation: 'instant',
      source: pointer('spo2DataMesgs', messageIndex, 'readingSpo2'),
      attributes: {
        measurementMode:
          message.mode === undefined ? null : String(message.mode),
      },
    });
  });

  (messages.hrvValueMesgs ?? []).forEach((raw, messageIndex) => {
    const message = asObject(raw);
    const timestamp = asDate(message.timestamp);
    const value = asNumber(message.value);
    if (!timestamp || value === undefined) return;
    addPoint({
      metric: 'hrv_rmssd_ms',
      timestamp,
      value,
      unit: 'ms',
      status: 'valid',
      aggregation: 'mean',
      source: pointer('hrvValueMesgs', messageIndex, 'value'),
      attributes: { windowSeconds: 300 },
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
      calendarDate: calendarDateAtOffset(endTime, endOffsetSeconds),
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
    )
      return;
    const startOffsetSeconds = asNumber(message.startTimezoneOffset);
    const endOffsetSeconds = asNumber(message.endTimezoneOffset);
    observedTimes.push(startTime, endTime);
    sessions.push({
      sessionType: 'nap',
      externalId: `fit:nap:${message.messageIndex ?? messageIndex}:${startTime.toISOString()}`,
      startTime,
      endTime,
      startOffsetSeconds,
      endOffsetSeconds,
      calendarDate: calendarDateAtOffset(
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
        addPoint({
          metric,
          timestamp: new Date(
            timestamp.valueOf() + intervalSeconds * index * 1000,
          ),
          value: value === -16 ? undefined : value,
          unit,
          status: value === -16 ? 'invalid' : 'valid',
          aggregation: 'instant',
          source: pointer('hsaBodyBatteryDataMesgs', messageIndex, field),
          attributes: { sequenceIndex: index, intervalSeconds },
        });
      });
    });
  });

  points.sort((a, b) => a.timestamp.valueOf() - b.timestamp.valueOf());
  intervals.sort((a, b) => a.startTime.valueOf() - b.startTime.valueOf());
  sessions.sort((a, b) => a.startTime.valueOf() - b.startTime.valueOf());
  observedTimes.sort((a, b) => a.valueOf() - b.valueOf());

  return {
    schemaVersion: '1',
    observedStart: observedTimes[0],
    observedEnd: observedTimes.at(-1),
    timezone: {
      strategy: offsets.length > 0 ? 'timestamp_correlation' : 'unknown',
      offsets,
    },
    points,
    intervals: options.health?.reconstructIntervals === false ? [] : intervals,
    summaries,
    sessions,
    diagnostics,
  };
}

export class HealthStructurePlugin extends BaseFITStructurePlugin {
  name = "HealthStructurePlugin";
  priority = 20;

  structureData(
    messages: FITMessages,
    context: FITContext,
  ): Partial<import("./types.js").FITFileType> {
    const options =
      (context.userData?.fitDocumentOptions as FITDocumentParseOptions | undefined) ??
      {};
    const detectedKinds = detectFITKinds(messages);
    return {
      healthDocument: detectedKinds.includes("health")
        ? buildHealthDocumentFromMessages(messages, options, {
            sdkProfileVersion: context.metadata.get(
              "fit-sdk-profile-version"
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
