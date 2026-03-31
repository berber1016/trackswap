import { Encoder } from "@garmin/fitsdk";
import { FITFile } from "./types/file.js";
import { MesgNum } from "./types/mesg_num.js";
import {
  Intensity,
  Sport,
  SubSport,
  WktStepDuration,
  WktStepTarget,
} from "./types/message_index_type.js";

/**
 * 业务层的「步骤时长」抽象。
 * 注意：这里只表达业务含义，具体如何编码到 FIT 在 mapDuration() 里处理。
 */
export type WorkoutDuration =
  | { kind: "time"; seconds: number }
  | { kind: "distance"; meters: number }
  | { kind: "calories"; kcal: number }
  | { kind: "open" };

/**
 * 业务层的「步骤目标」抽象。
 * V1 仅支持 open（不设目标区间）。
 */
export type WorkoutTarget = { kind: "open" };

/**
 * 单个训练步骤（业务模型）。
 */
export interface WorkoutStep {
  /** 步骤名称（如 Warmup / Interval）。 */
  name?: string;
  /** 步骤强度，默认 ACTIVE。 */
  intensity?: Intensity;
  /** 步骤时长/结束条件（必填）。 */
  duration: WorkoutDuration;
  /** 步骤目标，V1 默认 open。 */
  target?: WorkoutTarget;
}

/**
 * 一个完整的训练计划（业务模型）。
 * - 前 5 个字段是核心业务字段
 * - 后面的 manufacturer/product... 是 FIT file_id 附加字段，可选
 */
export interface WorkoutPlan {
  /** 训练名称，映射到 FIT 的 wktName。 */
  name: string;
  /** 训练描述，映射到 FIT 的 wktDescription。 */
  description?: string;
  /** 运动类型（跑步/骑行/游泳等）。 */
  sport: Sport;
  /** 子运动类型，默认 GENERIC。 */
  subSport?: SubSport;
  /** 训练步骤列表，至少 1 条。 */
  steps: WorkoutStep[];
  /** file_id.manufacturer，可选，不传则用 development。 */
  manufacturer?: string | number;
  /** file_id.product，可选，默认 1。 */
  product?: number;
  /** file_id.serialNumber，可选，默认 1。 */
  serialNumber?: number;
  /** workout.messageIndex，可选，默认 0。 */
  messageIndex?: number;
  /** file_id.timeCreated，可选，默认 new Date()。 */
  timeCreated?: Date | number;
}

/**
 * 中间层消息结构：后续统一喂给 Garmin Encoder.onMesg()。
 */
export interface FitMesg {
  /** FIT 消息号，例如 FILE_ID/WORKOUT/WORKOUT_STEP。 */
  mesgNum: MesgNum;
  /** Garmin Encoder 需要的消息体数据。 */
  data: Record<string, unknown>;
}

interface NormalizedWorkoutStep {
  /** 归一化后的步骤名。 */
  name?: string;
  /** 归一化后的强度（一定有值）。 */
  intensity: Intensity;
  /** 归一化后的时长定义。 */
  duration: WorkoutDuration;
  /** 归一化后的目标定义（一定有值）。 */
  target: WorkoutTarget;
}

interface NormalizedWorkoutPlan extends Omit<WorkoutPlan, "steps"> {
  /** 归一化后的 subSport（一定有值）。 */
  subSport: SubSport;
  /** 归一化后的步骤列表。 */
  steps: NormalizedWorkoutStep[];
  /** 归一化后的 manufacturer。 */
  manufacturer: string | number;
  /** 归一化后的 product。 */
  product: number;
  /** 归一化后的 serialNumber。 */
  serialNumber: number;
  /** 归一化后的 messageIndex。 */
  messageIndex: number;
  /** 归一化后的 timeCreated。 */
  timeCreated: Date | number;
}

interface DurationEncoding {
  /** FIT durationType 枚举值。 */
  durationType: WktStepDuration;
  /** FIT durationValue 数值（已完成单位换算）。 */
  durationValue: number;
}

const DEFAULT_MANUFACTURER = "development";
const DEFAULT_PRODUCT = 1;
const DEFAULT_SERIAL_NUMBER = 1;
const DEFAULT_MESSAGE_INDEX = 0;

/**
 * 通用正数校验，用于 step 的 time/distance/calories。
 */
function ensurePositive(value: number, fieldName: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Workout step ${fieldName} must be a positive number.`);
  }
}

/**
 * 归一化与兜底：
 * - 校验 name / steps 必填
 * - 赋默认值：subSport/intensity/target/file_id 相关字段
 */
function normalizeWorkoutPlan(plan: WorkoutPlan): NormalizedWorkoutPlan {
  if (!plan.name || plan.name.trim().length === 0) {
    throw new Error("Workout name is required.");
  }

  if (!Array.isArray(plan.steps) || plan.steps.length === 0) {
    throw new Error("Workout must contain at least one step.");
  }

  const normalizedSteps: NormalizedWorkoutStep[] = plan.steps.map(
    (step, index) => {
      if (step == null || step.duration == null) {
        throw new Error(`Workout step #${index + 1} is missing duration.`);
      }

      return {
        name: step.name,
        intensity: step.intensity ?? Intensity.ACTIVE,
        duration: step.duration,
        target: step.target ?? { kind: "open" },
      };
    },
  );

  return {
    ...plan,
    subSport: plan.subSport ?? SubSport.GENERIC,
    steps: normalizedSteps,
    manufacturer: plan.manufacturer ?? DEFAULT_MANUFACTURER,
    product: plan.product ?? DEFAULT_PRODUCT,
    serialNumber: plan.serialNumber ?? DEFAULT_SERIAL_NUMBER,
    messageIndex: plan.messageIndex ?? DEFAULT_MESSAGE_INDEX,
    timeCreated: plan.timeCreated ?? new Date(),
  };
}

/**
 * 把业务层 duration 映射为 FIT 的 durationType + durationValue。
 * 关键单位转换：
 * - time: 秒 -> 毫秒（*1000）
 * - distance: 米 -> 1/100 米（*100）
 * - calories: 直接整数值
 */
function mapDuration(duration: WorkoutDuration): DurationEncoding {
  switch (duration.kind) {
    case "time":
      ensurePositive(duration.seconds, "duration.seconds");
      return {
        durationType: WktStepDuration.TIME,
        durationValue: Math.round(duration.seconds * 1000),
      };
    case "distance":
      ensurePositive(duration.meters, "duration.meters");
      return {
        durationType: WktStepDuration.DISTANCE,
        durationValue: Math.round(duration.meters * 100),
      };
    case "calories":
      ensurePositive(duration.kcal, "duration.kcal");
      return {
        durationType: WktStepDuration.CALORIES,
        durationValue: Math.round(duration.kcal),
      };
    case "open":
      return {
        durationType: WktStepDuration.OPEN,
        durationValue: 0,
      };
    default: {
      const unknownDuration: never = duration;
      throw new Error(
        `Unsupported workout duration: ${String(unknownDuration)}`,
      );
    }
  }
}

/**
 * 核心映射函数：
 * WorkoutPlan -> FILE_ID + WORKOUT + WORKOUT_STEP[]。
 */
export function buildWorkoutMesgs(plan: WorkoutPlan): FitMesg[] {
  const normalized = normalizeWorkoutPlan(plan);

  const mesgs: FitMesg[] = [
    {
      mesgNum: MesgNum.FILE_ID,
      data: {
        type: FITFile.WORKOUT,
        manufacturer: normalized.manufacturer,
        product: normalized.product,
        serialNumber: normalized.serialNumber,
        timeCreated: normalized.timeCreated,
      },
    },
    {
      mesgNum: MesgNum.WORKOUT,
      data: {
        messageIndex: normalized.messageIndex,
        sport: normalized.sport,
        subSport: normalized.subSport,
        numValidSteps: normalized.steps.length,
        wktName: normalized.name,
        wktDescription: normalized.description,
      },
    },
  ];

  normalized.steps.forEach((step, index) => {
    const duration = mapDuration(step.duration);
    // V1 固定 open target，后续可扩展 HR/Power 等目标类型
    const targetType = WktStepTarget.OPEN;
    const targetValue = 0;

    mesgs.push({
      mesgNum: MesgNum.WORKOUT_STEP,
      data: {
        messageIndex: index,
        wktStepName: step.name,
        intensity: step.intensity,
        durationType: duration.durationType,
        durationValue: duration.durationValue,
        targetType,
        targetValue,
      },
    });
  });

  return mesgs;
}

/**
 * 编码入口：
 * 1) 先构造中间消息数组
 * 2) 逐条写入 Garmin Encoder
 * 3) close() 得到 FIT 二进制（Uint8Array）
 */
export function encodeWorkout(plan: WorkoutPlan): Uint8Array {
  const encoder = new Encoder();
  const mesgs = buildWorkoutMesgs(plan);

  mesgs.forEach((mesg) => {
    encoder.onMesg(mesg.mesgNum, mesg.data);
  });

  return encoder.close();
}
