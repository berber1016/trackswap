// FIT types mapping

// 简化的枚举映射
const enum_maps = {
  file: {
    course: 6,
    device: 1,
    settings: 2,
    sport: 3,
    activity: 4,
    workout: 5,
    schedules: 7,
    weight: 9,
    totals: 10,
    goals: 11,
    blood_pressure: 14,
    monitoring_a: 15,
    activity_summary: 20,
    monitoring_daily: 28,
    monitoring_b: 32,
    segment_list: 35,
    exd_configuration: 40,
    invalid: 0,
  },
  sport: {
    generic: 0,
    running: 1,
    cycling: 2,
    transition: 3,
    fitness_equipment: 4,
    swimming: 5,
    basketball: 6,
    soccer: 7,
    tennis: 8,
    american_football: 9,
    training: 10,
    walking: 11,
    cross_country_skiing: 12,
    alpine_skiing: 13,
    snowboarding: 14,
    rowing: 15,
    mountaineering: 16,
    hiking: 17,
    multisport: 18,
    paddling: 19,
    invalid: 254,
  },
  event: {
    timer: 0,
    workout: 3,
    workout_step: 4,
    power_down: 5,
    power_up: 6,
    off_course: 7,
    session: 8,
    lap: 9,
    course_point: 10,
    battery: 11,
    virtual_partner_pace: 12,
    hr_high_alert: 13,
    hr_low_alert: 14,
    speed_high_alert: 15,
    speed_low_alert: 16,
    cad_high_alert: 17,
    cad_low_alert: 18,
    power_high_alert: 19,
    power_low_alert: 20,
    recovery_hr: 21,
    battery_low: 22,
    time_duration_alert: 23,
    distance_duration_alert: 24,
    calorie_duration_alert: 25,
    activity: 26,
    fitness_equipment: 27,
    length: 28,
    user_marker: 32,
    sport_point: 33,
    calibration: 36,
    front_gear_change: 42,
    rear_gear_change: 43,
    rider_position_change: 44,
    elev_high_alert: 45,
    elev_low_alert: 46,
    comm_timeout: 47,
    invalid: 255,
  },
  event_type: {
    start: 0,
    stop: 1,
    consecutive_depreciated: 2,
    marker: 3,
    stop_all: 4,
    begin_depreciated: 5,
    end_depreciated: 6,
    end_all_depreciated: 7,
    stop_disable: 8,
    stop_disable_all: 9,
    invalid: 255,
  },
  course_point: {
    generic: 0,
    summit: 1,
    valley: 2,
    water: 3,
    food: 4,
    danger: 5,
    left: 6,
    right: 7,
    straight: 8,
    first_aid: 9,
    fourth_category: 10,
    third_category: 11,
    second_category: 12,
    first_category: 13,
    hors_category: 14,
    sprint: 15,
    left_fork: 16,
    right_fork: 17,
    middle_fork: 18,
    slight_left: 19,
    sharp_left: 20,
    slight_right: 21,
    sharp_right: 22,
    u_turn: 23,
    segment_start: 24,
    segment_end: 25,
    invalid: 255,
  },
} as const;

type EnumMapKeys = keyof typeof enum_maps;

const _enum = (name: EnumMapKeys) => {
  const enum_map = enum_maps[name];
  return {
    size: 1,
    baseType: 0,
    mapValue: (value: string | number) => {
      if (typeof value === "string") {
        return (enum_map as any)[value] ?? 255;
      }
      return value;
    },
    setValue: function (this: DataView, byteOffset: number, value: number) {
      this.setUint8(byteOffset, value);
    },
  };
};

export const types = {
  enum_file: _enum("file"),
  enum_activity: _enum("sport"),
  enum_sport: _enum("sport"),
  enum_sub_sport: _enum("sport"),
  enum_event: _enum("event"),
  enum_event_type: _enum("event_type"),
  enum_course_point: _enum("course_point"),
  uint8: {
    size: 1,
    baseType: 2,
    setValue: DataView.prototype.setUint8,
  },
  sint8: {
    size: 1,
    baseType: 1,
    setValue: DataView.prototype.setInt8,
  },
  uint16: {
    size: 2,
    baseType: 0x84,
    setValue: DataView.prototype.setUint16,
  },
  sint16: {
    size: 2,
    baseType: 0x83,
    setValue: DataView.prototype.setInt16,
  },
  uint32: {
    size: 4,
    baseType: 0x86,
    setValue: DataView.prototype.setUint32,
  },
  sint32: {
    size: 4,
    baseType: 0x85,
    setValue: DataView.prototype.setInt32,
  },
  string: {
    size: 0, // Variable size
    baseType: 7,
    mapValue: (value: string) => Array.from(encodedStr(value)),
    setValue: dvSetUint8Array,
  },
  distance: {
    size: 4,
    baseType: 0x86,
    setValue: DataView.prototype.setUint32,
    mapValue: (value: number) => Math.round(value * 1000),
  },
  speed: {
    size: 2,
    baseType: 0x84,
    setValue: DataView.prototype.setUint16,
    mapValue: (value: number) => Math.round(value * 100),
  },
  altitude: {
    size: 2,
    baseType: 0x84,
    setValue: DataView.prototype.setUint16,
    mapValue: (value: number) => Math.round((value + 500) * 5),
  },
  seconds: {
    size: 4,
    baseType: 0x86,
    setValue: DataView.prototype.setUint32,
    mapValue: (value: number) => Math.round(value * 1000),
  },
  date_time: {
    size: 4,
    baseType: 0x86,
    setValue: DataView.prototype.setUint32,
    mapValue: (value: number | string | Date) => {
      let timestamp: number;

      if (value instanceof Date) {
        timestamp = Math.floor(value.getTime() / 1000);
        // 转换为FIT时间戳：Unix时间戳 - FIT epoch偏移量
        return timestamp - 631065600;
      } else if (typeof value === "string") {
        timestamp = Math.floor(new Date(value).getTime() / 1000);
        // 转换为FIT时间戳：Unix时间戳 - FIT epoch偏移量
        return timestamp - 631065600;
      } else {
        // 如果输入的数字值看起来像是FIT时间戳（小于Unix时间戳），直接返回
        // FIT时间戳从1989开始，所以值通常比较小
        if (value < 631065600) {
          // 直接返回，假设已经是FIT时间戳
          return Math.floor(value);
        }

        // 否则处理为Unix时间戳
        if (value > 9999999999) {
          // 毫秒级时间戳
          timestamp = Math.floor(value / 1000);
        } else {
          // 秒级时间戳
          timestamp = Math.floor(value);
        }

        // 转换为FIT时间戳：Unix时间戳 - FIT epoch偏移量
        return timestamp - 631065600;
      }
    }, // "1989-12-31T00:00" epoch
  },
  semicircles: {
    size: 4,
    baseType: 0x85,
    setValue: DataView.prototype.setInt32,
    mapValue: (value: number) => Math.round((value / 180) * 0x80000000),
  },
};

export function encodedStrlen(str: string): number {
  // Calculate the byte length of a UTF-8 encoded string
  return Array.from(encodedStr(str)).length + 1; // +1 for null terminator
}

function* encodedStr(s: string): Generator<number> {
  for (const codePoint of codePoints(s)) {
    if (codePoint < 0x80) {
      yield codePoint;
    } else if (codePoint < 0x800) {
      yield 0xc0 | (codePoint >> 6);
      yield 0x80 | (codePoint & 0x3f);
    } else if (codePoint < 0x10000) {
      yield 0xe0 | (codePoint >> 12);
      yield 0x80 | ((codePoint >> 6) & 0x3f);
      yield 0x80 | (codePoint & 0x3f);
    } else {
      yield 0xf0 | (codePoint >> 18);
      yield 0x80 | ((codePoint >> 12) & 0x3f);
      yield 0x80 | ((codePoint >> 6) & 0x3f);
      yield 0x80 | (codePoint & 0x3f);
    }
  }
  yield 0; // null terminator
}

function* codePoints(s: string): Generator<number> {
  for (let i = 0; i < s.length; ) {
    const cp = s.codePointAt(i);
    if (cp === undefined) break;
    yield cp;
    i += cp > 0xffff ? 2 : 1;
  }
}

function dvSetUint8Array(
  this: DataView,
  offset: number,
  values: number[]
): void {
  for (let i = 0; i < values.length; i++) {
    this.setUint8(offset + i, values[i]);
  }
}
