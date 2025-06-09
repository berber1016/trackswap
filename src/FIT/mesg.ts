import { types, encodedStrlen } from "./types/index.js";
import { MesgNum } from "./types/mesg_num.js";

interface FieldDefn {
  name: string;
  number: number;
  type: string;
}

interface MesgDefn {
  mesgNum: MesgNum;
  fieldDefns: FieldDefn[];
}

interface MesgDefns {
  [key: string]: MesgDefn;
}

interface Field {
  name: string;
  number: number;
  type: string;
  value: any;
}

interface ProcessedMesgDefn {
  localNum: number;
  mesgNum: MesgNum;
  fieldDefns: {
    number: number;
    size: number;
    baseType: number;
  }[];
}

const mesgDefns: MesgDefns = {
  file_id: {
    mesgNum: MesgNum.FILE_ID,
    fieldDefns: [
      { name: "type", number: 0, type: "enum_file" },
      { name: "time_created", number: 4, type: "date_time" },
    ],
  },
  session: {
    mesgNum: MesgNum.SESSION,
    fieldDefns: [
      { name: "timestamp", number: 253, type: "date_time" },
      { name: "start_time", number: 2, type: "date_time" },
      { name: "total_elapsed_time", number: 7, type: "seconds" },
      { name: "total_timer_time", number: 8, type: "seconds" },
      { name: "start_position_lat", number: 3, type: "semicircles" },
      { name: "start_position_long", number: 4, type: "semicircles" },
      { name: "total_distance", number: 9, type: "distance" },
      { name: "total_ascent", number: 21, type: "uint16" },
      { name: "total_descent", number: 22, type: "uint16" },
      { name: "sport", number: 5, type: "enum_sport" },
      { name: "sub_sport", number: 6, type: "enum_sub_sport" },
      { name: "first_lap_index", number: 11, type: "uint16" },
      { name: "num_laps", number: 26, type: "uint16" },
    ],
  },
  lap: {
    mesgNum: MesgNum.LAP,
    fieldDefns: [
      { name: "timestamp", number: 253, type: "date_time" },
      { name: "start_time", number: 2, type: "date_time" },
      { name: "start_position_lat", number: 3, type: "semicircles" },
      { name: "start_position_long", number: 4, type: "semicircles" },
      { name: "end_position_lat", number: 5, type: "semicircles" },
      { name: "end_position_long", number: 6, type: "semicircles" },
      { name: "total_elapsed_time", number: 7, type: "seconds" },
      { name: "total_timer_time", number: 8, type: "seconds" },
      { name: "total_distance", number: 9, type: "distance" },
      { name: "total_ascent", number: 21, type: "uint16" },
      { name: "total_descent", number: 22, type: "uint16" },
    ],
  },
  record: {
    mesgNum: MesgNum.RECORD,
    fieldDefns: [
      { name: "timestamp", number: 253, type: "date_time" },
      { name: "position_lat", number: 0, type: "semicircles" },
      { name: "position_long", number: 1, type: "semicircles" },
      { name: "altitude", number: 2, type: "altitude" },
      { name: "distance", number: 5, type: "distance" },
      { name: "heart_rate", number: 3, type: "uint8" },
      { name: "cadence", number: 4, type: "uint8" },
      { name: "speed", number: 6, type: "speed" },
      { name: "power", number: 7, type: "uint16" },
    ],
  },
  event: {
    mesgNum: MesgNum.EVENT,
    fieldDefns: [
      { name: "timestamp", number: 253, type: "date_time" },
      { name: "event", number: 0, type: "enum_event" },
      { name: "event_type", number: 1, type: "enum_event_type" },
      { name: "event_group", number: 4, type: "uint8" },
    ],
  },
  course: {
    mesgNum: MesgNum.COURSE,
    fieldDefns: [
      { name: "name", number: 5, type: "string" },
      { name: "sport", number: 4, type: "enum_sport" },
      { name: "sub_sport", number: 7, type: "enum_sub_sport" },
    ],
  },
  activity: {
    mesgNum: MesgNum.ACTIVITY,
    fieldDefns: [
      { name: "timestamp", number: 253, type: "date_time" },
      { name: "total_timer_time", number: 0, type: "seconds" },
      { name: "num_sessions", number: 1, type: "uint16" },
      { name: "type", number: 2, type: "enum_activity" },
      { name: "event", number: 3, type: "enum_event" },
      { name: "event_type", number: 4, type: "enum_event_type" },
      { name: "local_timestamp", number: 5, type: "date_time" },
      { name: "event_group", number: 6, type: "uint8" },
    ],
  },
  course_point: {
    mesgNum: MesgNum.COURSE_POINT,
    fieldDefns: [
      { name: "timestamp", number: 1, type: "date_time" },
      { name: "position_lat", number: 2, type: "semicircles" },
      { name: "position_long", number: 3, type: "semicircles" },
      { name: "distance", number: 4, type: "distance" },
      { name: "type", number: 5, type: "enum_course_point" },
    ],
  },
};

/**
 * 将 fieldDefns 和 fieldValues 转换为 fields 对象
 */
const fields = (
  fieldDefns: FieldDefn[],
  fieldValues: { [key: string]: any }
): Field[] => {
  return fieldDefns
    .map((fieldDefn) => ({ ...fieldDefn, value: fieldValues[fieldDefn.name] }))
    .filter(({ value }) => value !== undefined);
};

export class Mesg {
  localNum: number;
  mesgNum: MesgNum;
  fields: Field[];

  static check(
    mesgName: string,
    mesgNum: MesgNum | undefined,
    fieldDefns: FieldDefn[] | undefined,
    values: { [key: string]: any }
  ): void {
    if (mesgNum === undefined) {
      throw new Error(`Message '${mesgName}' not known`);
    }
    if (fieldDefns === undefined) {
      throw new Error(`Message '${mesgName}' has no field definitions`);
    }
    const fieldNames = fieldDefns.map((fieldDefn: FieldDefn) => fieldDefn.name);
    const unknownFields = Object.keys(values).filter(
      (fieldName) => !fieldNames.includes(fieldName)
    );
    if (unknownFields.length) {
      throw new Error(
        `Message '${mesgName}' has no field definitions named '${unknownFields}'`
      );
    }
  }

  constructor(
    localNum: number,
    mesgName: string,
    values: { [key: string]: any }
  ) {
    const mesgDefn = mesgDefns[mesgName];
    if (!mesgDefn) {
      throw new Error(`Unknown message type: ${mesgName}`);
    }

    const { mesgNum, fieldDefns } = mesgDefn;
    Mesg.check(mesgName, mesgNum, fieldDefns, values);
    this.localNum = localNum;
    this.mesgNum = mesgNum;
    this.fields = fields(fieldDefns, values);
  }

  /**
   * 获取 defns，并获取了 size
   */
  get mesgDefn(): ProcessedMesgDefn {
    const fieldDefns = this.fields.map(({ number, type, value }) => {
      const typeInfo = types[type as keyof typeof types];
      if (!typeInfo) {
        throw new Error(`Unknown type: ${type}`);
      }

      const { size, baseType } = typeInfo;
      if (type === "string") {
        return { number, size: encodedStrlen(value), baseType };
      }
      return { number, size, baseType };
    });

    return {
      localNum: this.localNum,
      mesgNum: this.mesgNum,
      fieldDefns,
    };
  }

  isSameDefn(mesgDefn: ProcessedMesgDefn): boolean {
    const isSameFieldDefn = (
      defn1: { number: number; size: number; baseType: number },
      defn2: { number: number; size: number; baseType: number }
    ): boolean =>
      defn1.number === defn2.number &&
      defn1.size === defn2.size &&
      defn1.baseType === defn2.baseType;

    const areSameFieldDefns = (
      defns1: { number: number; size: number; baseType: number }[],
      defns2: { number: number; size: number; baseType: number }[]
    ): boolean =>
      defns1.length === defns2.length &&
      defns1.every((defn1, i) => isSameFieldDefn(defn1, defns2[i]));

    const { localNum, mesgNum, fieldDefns } = this.mesgDefn;
    return (
      mesgNum === mesgDefn.mesgNum &&
      localNum === mesgDefn.localNum &&
      areSameFieldDefns(fieldDefns, mesgDefn.fieldDefns)
    );
  }

  get defnRecord(): ArrayBuffer {
    const { localNum, mesgNum, fieldDefns } = this.mesgDefn;
    const recordLen = 6 + 3 * fieldDefns.length;
    const dv = new DataView(new ArrayBuffer(recordLen));

    dv.setUint8(0, 0x40 | localNum);
    dv.setUint8(2, 1); // big endian
    dv.setUint16(3, mesgNum);
    dv.setUint8(5, fieldDefns.length);

    let offset = 6;
    for (const fieldDefn of fieldDefns) {
      dv.setUint8(offset++, fieldDefn.number);
      dv.setUint8(offset++, fieldDefn.size);
      dv.setUint8(offset++, fieldDefn.baseType);
    }

    return dv.buffer;
  }

  get dataRecord(): ArrayBuffer {
    const { fieldDefns } = this.mesgDefn;
    const recordLen =
      1 +
      fieldDefns.reduce(
        (len: number, { size }: { size: number }) => len + size,
        0
      );
    const dv = new DataView(new ArrayBuffer(recordLen));

    dv.setUint8(0, this.localNum);

    let offset = 1;
    for (const { number, type, value } of this.fields) {
      const typeInfo = types[type as keyof typeof types];
      if (!typeInfo) {
        throw new Error(`Unknown type: ${type}`);
      }

      const { size, setValue } = typeInfo;
      let mappedValue: any;
      if ("mapValue" in typeInfo) {
        mappedValue = (typeInfo.mapValue as (v: any) => any)(value);
      } else {
        mappedValue = value;
      }

      if (setValue) {
        setValue.call(dv, offset, mappedValue);
      }
      offset += size;
    }

    return dv.buffer;
  }
}
