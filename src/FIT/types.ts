import { IProcessingContext } from "../core/base.js";

/**
 * Session corresponds to AbstractTrackType, Lap corresponds to RouteSegType, Records corresponds to RouteType, each Record corresponds to PointType
 */
export interface FITFileType {
  fileIdMesgs?: FileIdMesgType[];
  fileCreatorMesgs?: FileCreatorMesgType[];
  eventMesgs?: EventMesgType[];
  deviceInfoMesgs?: DeviceInfoMesgType[];
  deviceSettingsMesgs?: DeviceSettingsMesgType[];
  userProfileMesgs?: UserProfileMesgType[];
  sessionMesgs?: SessionMesgType[];
  courseMesgs?: any[];
}

export type FITDecoderMesgs = {
  /**
   * 
   */
  fileIdMesgs?: FileIdMesgType[];
  fileCreatorMesgs?: FileCreatorMesgType[];
  eventMesgs?: EventMesgType[];
  deviceInfoMesgs?: DeviceInfoMesgType[];
  deviceSettingsMesgs?: DeviceSettingsMesgType[];
  userProfileMesgs?: UserProfileMesgType[];
  /**
   * Session 消息数组
   */
  sessionMesgs?: Omit<SessionMesgType, "lapMesgs">[];
  /**
   * Lap 消息数组
   */
  lapMesgs?: Omit<SessionMesgType, "recordMesgs">[];
  /**
   * Record 消息数组
   */
  recordMesgs?: RecordMesgType[];
  courseMesgs?: any[];
  // Index signature, supports dynamic access
  [key: string]: any[] | undefined;
};

export interface FileIdMesgType {
  serialNumber?: number;
  timeCreated?: string;
  manufacturer?: string;
  product?: number;
  type?: string;
  garminProduct?: string;
}

export interface FileCreatorMesgType {
  softwareVersion?: number;
}

export interface EventMesgType {
  timestamp?: Date;
  data?: number;
  event?: string;
  eventType?: string;
  eventGroup?: number;
  timerTrigger?: string;
}

export interface DeviceInfoMesgType {
  timestamp?: string;
  serialNumber?: number;
  manufacturer?: string;
  product?: number;
  softwareVersion?: number;
  deviceIndex?: string;
  deviceType?: number;
  garminProduct?: string;
}

export interface DeviceSettingsMesgType {
  utcOffset?: number;
  timeOffset?: number;
  activeTimeZone?: number;
  timeMode?: string;
  timeZoneOffset?: number;
  backlightMode?: string;
}
/**
 * FIT userProfileMesg
 */
export interface UserProfileMesgType {
  friendlyName?: string;
  weight?: number;
  gender?: string;
  age?: number;
  height?: number;
  language?: string;
  elevSetting?: string;
  weightSetting?: string;
  defaultMaxBikingHeartRate?: number;
  defaultMaxHeartRate?: number;
  hrSetting?: string;
  speedSetting?: string;
  distSetting?: string;
  powerSetting?: string;
  activityClass?: number;
  positionSetting?: string;
  temperatureSetting?: string;
}

/**
 * FIT SessionMesg
 */
/**
 * FIT 文件 session 消息（整场活动汇总）TypeScript 定义
 * 字段顺序与协议保持一致，全部驼峰命名 + 中文注释
 * 单位已换算为常用展示值，无效值(255/65535)请在前端显示为“–”
 */
export interface SessionMesgType {
  /** 消息索引（通常 0） */
  messageIndex?: number;

  /** 活动结束时间戳（UTC） */
  timestamp: Date;

  /** 事件类型 – session */
  event: string;

  /** 事件子类型 – stop/activityEnd 等 */
  eventType: string;

  /** 活动开始时间戳（UTC） */
  startTime: Date;

  /** 起点纬度 ° */
  startPositionLat?: number;

  /** 起点经度 ° */
  startPositionLong?: number;

  /** 主运动类型 running/cycling 等 */
  sport?: string;

  /** 子运动类型 generic/interval 等 */
  subSport?: string;

  /** 总耗时（含暂停）s */
  totalElapsedTime?: number;

  /** 总计时（不含暂停）s */
  totalTimerTime?: number;

  /** 总距离 m */
  totalDistance?: number;

  /** 总圈数/总步数/总划水数（见子字段） */
  totalCycles?: number;

  /** 总步数（running） */
  totalStrides?: number;

  /** 总划水数（swimming） */
  totalStrokes?: number;

  /** 总热量 kcal */
  totalCalories?: number;

  /** 脂肪热量 kcal */
  totalFatCalories?: number;

  /** 平均速度 m/s；enhancedAvgSpeed 优先 */
  avgSpeed?: number;

  /** 高精度平均速度 m/s */
  enhancedAvgSpeed?: number;

  /** 最大速度 m/s；enhancedMaxSpeed 优先 */
  maxSpeed?: number;

  /** 高精度最大速度 m/s */
  enhancedMaxSpeed?: number;

  /** 平均心率 bpm */
  avgHeartRate?: number;

  /** 最大心率 bpm */
  maxHeartRate?: number;

  /** 平均踏频/步频 rpm；子字段 avgRunningCadence */
  avgCadence?: number;

  /** 平均步频 spm（running） */
  avgRunningCadence?: number;

  /** 最大踏频/步频 rpm；子字段 maxRunningCadence */
  maxCadence?: number;

  /** 最大步频 spm（running） */
  maxRunningCadence?: number;

  /** 平均功率 W */
  avgPower?: number;

  /** 最大功率 W */
  maxPower?: number;

  /** 累计爬升 m */
  totalAscent?: number;

  /** 累计下降 m */
  totalDescent?: number;

  /** 训练效果 0–5 */
  totalTrainingEffect?: number;

  /** 第一圈索引 */
  firstLapIndex?: number;

  /** 圈数 */
  numLaps?: number;

  /** 事件组（通常 0） */
  eventGroup?: number;

  /** 触发方式 activityEnd/manual 等 */
  trigger?: string;

  /** 东北角纬度 °（边界框） */
  necLat?: number;

  /** 东北角经度 °（边界框） */
  necLong?: number;

  /** 西南角纬度 °（边界框） */
  swcLat?: number;

  /** 西南角经度 °（边界框） */
  swcLong?: number;

  /** 游泳趟数 */
  numLengths?: number;

  /** 标准化功率 W */
  normalizedPower?: number;

  /** 训练压力分数 TSS */
  trainingStressScore?: number;

  /** 强度系数 IF */
  intensityFactor?: number;

  /** 左右平衡 %（左 50-右 50） */
  leftRightBalance?: number;

  /** 终点纬度 ° */
  endPositionLat?: number;

  /** 终点经度 ° */
  endPositionLong?: number;

  /** 平均每趟划水数 */
  avgStrokeCount?: number;

  /** 平均每划距离 m */
  avgStrokeDistance?: number;

  /** 游泳划水类型 */
  swimStroke?: string;

  /** 泳池长度 m */
  poolLength?: number;

  /** 阈值功率 W */
  thresholdPower?: number;

  /** 泳池长度单位 metric/imperial */
  poolLengthUnit?: string;

  /** 有效趟数 */
  numActiveLengths?: number;

  /** 总做功 J */
  totalWork?: number;

  /** 平均海拔 m；enhancedAvgAltitude 优先 */
  avgAltitude?: number;

  /** 高精度平均海拔 m */
  enhancedAvgAltitude?: number;

  /** 最大海拔 m；enhancedMaxAltitude 优先 */
  maxAltitude?: number;

  /** 高精度最大海拔 m */
  enhancedMaxAltitude?: number;

  /** GPS 精度 m */
  gpsAccuracy?: number;

  /** 平均坡度 % */
  avgGrade?: number;

  /** 平均正坡度 % */
  avgPosGrade?: number;

  /** 平均负坡度 % */
  avgNegGrade?: number;

  /** 最大正坡度 % */
  maxPosGrade?: number;

  /** 最大负坡度 % */
  maxNegGrade?: number;

  /** 平均温度 °C */
  avgTemperature?: number;

  /** 最高温度 °C */
  maxTemperature?: number;

  /** 最低温度 °C */
  minTemperature?: number;

  /** 总移动时间 s */
  totalMovingTime?: number;

  /** 平均上升速度 m/s */
  avgPosVerticalSpeed?: number;

  /** 平均下降速度 m/s */
  avgNegVerticalSpeed?: number;

  /** 最大上升速度 m/s */
  maxPosVerticalSpeed?: number;

  /** 最大下降速度 m/s */
  maxNegVerticalSpeed?: number;

  /** 最小心率 bpm */
  minHeartRate?: number;

  /** 各心率区间停留时间 s 数组 */
  timeInHrZone?: number[];

  /** 各速度区间停留时间 s 数组 */
  timeInSpeedZone?: number[];

  /** 各踏频区间停留时间 s 数组 */
  timeInCadenceZone?: number[];

  /** 各功率区间停留时间 s 数组 */
  timeInPowerZone?: number[];

  /** 平均圈时 s */
  avgLapTime?: number;

  /** 最快圈索引 */
  bestLapIndex?: number;

  /** 最小海拔 m；enhancedMinAltitude 优先 */
  minAltitude?: number;

  /** 高精度最小海拔 m */
  enhancedMinAltitude?: number;

  /** 玩家得分（球类） */
  playerScore?: number;

  /** 对手得分（球类） */
  opponentScore?: number;

  /** 对手名称（球类） */
  opponentName?: string;

  /** 划水次数（游泳） */
  strokeCount?: number[];

  /** 区间计数 */
  zoneCount?: number[];

  /** 最大球速 m/s */
  maxBallSpeed?: number;

  /** 平均球速 m/s */
  avgBallSpeed?: number;

  /** 平均垂直振幅 cm */
  avgVerticalOscillation?: number;

  /** 平均触地时间占比 % */
  avgStanceTimePercent?: number;

  /** 平均触地时间 ms */
  avgStanceTime?: number;

  /** 平均小数步频 rpm */
  avgFractionalCadence?: number;

  /** 最大小数步频 rpm */
  maxFractionalCadence?: number;

  /** 总小数步/圈 */
  totalFractionalCycles?: number;

  /** 平均总血红蛋白 g/dL */
  avgTotalHemoglobinConc?: number;

  /** 最小总血红蛋白 g/dL */
  minTotalHemoglobinConc?: number;

  /** 最大总血红蛋白 g/dL */
  maxTotalHemoglobinConc?: number;

  /** 平均血红蛋白氧饱和度 % */
  avgSaturatedHemoglobinPercent?: number;

  /** 最小氧饱和度 % */
  minSaturatedHemoglobinPercent?: number;

  /** 最大氧饱和度 % */
  maxSaturatedHemoglobinPercent?: number;

  /** 左腿力矩效率 % */
  avgLeftTorqueEffectiveness?: number;

  /** 右腿力矩效率 % */
  avgRightTorqueEffectiveness?: number;

  /** 左踩踏平滑度 % */
  avgLeftPedalSmoothness?: number;

  /** 右踩踏平滑度 % */
  avgRightPedalSmoothness?: number;

  /** 综合踩踏平滑度 % */
  avgCombinedPedalSmoothness?: number;

  /** 运动配置文件名称 */
  sportProfileName?: string;

  /** 运动配置索引 */
  sportIndex?: number;

  /** 总站立时间 s（骑行） */
  timeStanding?: number;

  /** 站立次数（骑行） */
  standCount?: number;

  /** 平均左踏板中心偏移 mm */
  avgLeftPco?: number;

  /** 平均右踏板中心偏移 mm */
  avgRightPco?: number;

  /** 平均左发力相位 ° */
  avgLeftPowerPhase?: number[];

  /** 平均左峰值相位 ° */
  avgLeftPowerPhasePeak?: number[];

  /** 平均右发力相位 ° */
  avgRightPowerPhase?: number[];

  /** 平均右峰值相位 ° */
  avgRightPowerPhasePeak?: number[];

  /** 坐/站平均功率 W */
  avgPowerPosition?: number[];

  /** 坐/站最大功率 W */
  maxPowerPosition?: number[];

  /** 坐/站平均踏频 rpm */
  avgCadencePosition?: number[];

  /** 坐/站最大踏频 rpm */
  maxCadencePosition?: number[];

  /** 平均电机功率 W（eBike） */
  avgLevMotorPower?: number;

  /** 最大电机功率 W（eBike） */
  maxLevMotorPower?: number;

  /** 电池消耗 %（eBike） */
  levBatteryConsumption?: number;

  /** 平均垂直率 % */
  avgVerticalRatio?: number;

  /** 平均左右触地平衡 %（左 50-右 50） */
  avgStanceTimeBalance?: number;

  /** 平均步长 cm */
  avgStepLength?: number;

  /** 无氧训练效果 0–5 */
  totalAnaerobicTrainingEffect?: number;

  /** 平均 VAM m/s */
  avgVam?: number;

  /** 平均深度 m（潜水） */
  avgDepth?: number;

  /** 最大深度 m（潜水） */
  maxDepth?: number;

  /** 水面休息时间 s（潜水） */
  surfaceInterval?: number;

  /** 起潜 CNS%（潜水） */
  startCns?: number;

  /** 结束 CNS%（潜水） */
  endCns?: number;

  /** 起潜 N2%（潜水） */
  startN2?: number;

  /** 结束 N2%（潜水） */
  endN2?: number;

  /** 平均呼吸率 breaths/min；255=无效 */
  avgRespirationRate?: number;

  /** 最大呼吸率 breaths/min；255=无效 */
  maxRespirationRate?: number;

  /** 最小呼吸率 breaths/min；255=无效 */
  minRespirationRate?: number;

  /** 高精度平均呼吸率 breaths/min；65535=无效 */
  enhancedAvgRespirationRate?: number;

  /** 高精度最大呼吸率 breaths/min；65535=无效 */
  enhancedMaxRespirationRate?: number;

  /** 高精度最小呼吸率 breaths/min；65535=无效 */
  enhancedMinRespirationRate?: number;

  /** 氧毒性单位 OTUs（潜水） */
  o2Toxicity?: number;

  /** 潜水编号 */
  diveNumber?: number;

  /** 训练负荷峰值 EPOC·min */
  trainingLoadPeak?: number;

  /** 总地形崎岖度 kGrit */
  totalGrit?: number;

  /** 总流畅度 Flow */
  totalFlow?: number;

  /** 跳跃次数（山地车） */
  jumpCount?: number;

  /** 平均崎岖度 kGrit */
  avgGrit?: number;

  /** 平均流畅度 Flow */
  avgFlow?: number;

  /** 主观感觉 0-100 */
  workoutFeel?: number;

  /** 主观用力 0-10 */
  workoutRpe?: number;

  /** 平均血氧饱和度 % */
  avgSpo2?: number;

  /** 平均压力 % */
  avgStress?: number;

  /** HRV SDNN ms */
  sdrrHrv?: number;

  /** HRV RMSSD ms */
  rmssdHrv?: number;

  /** 小数爬升 m */
  totalFractionalAscent?: number;

  /** 小数下降 m */
  totalFractionalDescent?: number;

  /** 平均核心体温 °C */
  avgCoreTemperature?: number;

  /** 最低核心体温 °C */
  minCoreTemperature?: number;

  /** 最高核心体温 °C */
  maxCoreTemperature?: number;

  // 关联的 lap 数据
  lapMesgs?: LapMesgType[];
}

/**
 * FIT 文件 record 消息（单条采样点）TypeScript 定义
 * 字段顺序与协议保持一致，全部驼峰命名 + 中文注释
 * 单位已换算为常用展示值，无效值(255/65535)请在前端显示为“–”
 */
export interface RecordMesgType {
  /** 采样时间戳（UTC） */
  timestamp: Date;

  /** 纬度 ° */
  positionLat?: number;

  /** 经度 ° */
  positionLong?: number;

  /** 海拔 m；enhancedAltitude 优先 */
  altitude?: number;

  /** 高精度海拔 m */
  enhancedAltitude?: number;

  /** 瞬时心率 bpm */
  heartRate?: number;

  /** 步频/踏频 rpm（跑步=spm） */
  cadence?: number;

  /** 累计距离 m */
  distance?: number;

  /** 速度 m/s；enhancedSpeed 优先 */
  speed?: number;

  /** 高精度速度 m/s */
  enhancedSpeed?: number;

  /** 瞬时功率 W */
  power?: number;

  /** 压缩速距（内部） */
  compressedSpeedDistance?: Uint8Array;

  /** 坡度 % */
  grade?: number;

  /** 阻力级别 0-100 */
  resistance?: number;

  /** 偏离航线时间 s */
  timeFromCourse?: number;

  /** 单圈长度 m */
  cycleLength?: number;

  /** 环境温度 °C */
  temperature?: number;

  /** 1 秒平均速度 m/s */
  speed1s?: number;

  /** 单圈圈数 */
  cycles?: number;

  /** 总圈数 */
  totalCycles?: number;

  /** 压缩累计功率（内部） */
  compressedAccumulatedPower?: number;

  /** 累计功率 W */
  accumulatedPower?: number;

  /** 左右平衡 %（左 50-右 50） */
  leftRightBalance?: number;

  /** GPS 精度 m */
  gpsAccuracy?: number;

  /** 垂直速度 m/s（正=上升） */
  verticalSpeed?: number;

  /** 瞬时热量 kcal */
  calories?: number;

  /** 垂直振幅 cm（mm→cm） */
  verticalOscillation?: number;

  /** 触地时间占比 % */
  stanceTimePercent?: number;

  /** 触地时间 ms */
  stanceTime?: number;

  /** 活动类型 running/cycling 等 */
  activityType?: string;

  /** 左腿力矩效率 % */
  leftTorqueEffectiveness?: number;

  /** 右腿力矩效率 % */
  rightTorqueEffectiveness?: number;

  /** 左踩踏平滑度 % */
  leftPedalSmoothness?: number;

  /** 右踩踏平滑度 % */
  rightPedalSmoothness?: number;

  /** 综合踩踏平滑度 % */
  combinedPedalSmoothness?: number;

  /** 128 分度时间（内部） */
  time128?: number;

  /** 游泳划水类型 */
  strokeType?: string;

  /** 训练区间 1-5 */
  zone?: number;

  /** 球速 m/s */
  ballSpeed?: number;

  /** 高分辨率踏频 rpm */
  cadence256?: number;

  /** 小数步频/踏频 rpm（需加回 cadence） */
  fractionalCadence?: number;

  /** 总血红蛋白浓度 g/dL */
  totalHemoglobinConc?: number;

  /** 最小总血红蛋白 g/dL */
  totalHemoglobinConcMin?: number;

  /** 最大总血红蛋白 g/dL */
  totalHemoglobinConcMax?: number;

  /** 血红蛋白氧饱和度 % */
  saturatedHemoglobinPercent?: number;

  /** 最小氧饱和度 % */
  saturatedHemoglobinPercentMin?: number;

  /** 最大氧饱和度 % */
  saturatedHemoglobinPercentMax?: number;

  /** 设备索引 */
  deviceIndex?: number;

  /** 左踏板中心偏移 mm */
  leftPco?: number;

  /** 右踏板中心偏移 mm */
  rightPco?: number;

  /** 左发力相位 ° */
  leftPowerPhase?: number;

  /** 左峰值相位 ° */
  leftPowerPhasePeak?: number;

  /** 右发力相位 ° */
  rightPowerPhase?: number;

  /** 右峰值相位 ° */
  rightPowerPhasePeak?: number;

  /** 电池电量 % */
  batterySoc?: number;

  /** 电机功率 W */
  motorPower?: number;

  /** 垂直率 % */
  verticalRatio?: number;

  /** 左右触地平衡 %（左 50-右 50） */
  stanceTimeBalance?: number;

  /** 步长 cm（mm→cm） */
  stepLength?: number;

  /** 16 分度步幅 m */
  cycleLength16?: number;

  /** 绝对气压 Pa */
  absolutePressure?: number;

  /** 潜水深度 m */
  depth?: number;

  /** 下一减压停深度 m */
  nextStopDepth?: number;

  /** 下一减压停时间 s */
  nextStopTime?: number;

  /** 升水时间 s */
  timeToSurface?: number;

  /** 免减压极限时间 s */
  ndlTime?: number;

  /** 中枢神经系统毒性负荷 % */
  cnsLoad?: number;

  /** 氮气负荷 % */
  n2Load?: number;

  /** 呼吸率 breaths/min；255=无效 */
  respirationRate?: number;

  /** 高精度呼吸率 breaths/min；65535=无效 */
  enhancedRespirationRate?: number;

  /** 地形崎岖度（0-1） */
  grit?: number;

  /** 流畅度（0-1） */
  flow?: number;

  /** 实时压力指数 */
  currentStress?: number;

  /** 预估续航 km */
  ebikeTravelRange?: number;

  /** 电池电量 % */
  ebikeBatteryLevel?: number;

  /** 助力模式 */
  ebikeAssistMode?: number;

  /** 助力等级 % */
  ebikeAssistLevelPercent?: number;

  /** 剩余气体时间 s */
  airTimeRemaining?: number;

  /** 水面耗气率 bar/min */
  pressureSac?: number;

  /** 体积耗气率 L/min */
  volumeSac?: number;

  /** 每分通气量 L/min */
  rmv?: number;

  /** 上升速率 m/s */
  ascentRate?: number;

  /** 氧分压 % */
  po2?: number;

  /** 核心体温 °C（×100→°C） */
  coreTemperature?: number;
}

/**
 * FIT 文件 lap 消息（单圈数据）TypeScript 定义
 * 字段顺序与协议保持一致，全部驼峰命名 + 中文注释
 * 单位已换算为常用展示值，无效值(255/65535)请在前端显示为“–”
 */
export interface LapMesgType {
  /** 圈索引（0 起） */
  messageIndex: number;

  /** 圈结束时间戳（UTC） */
  timestamp?: Date;

  /** 事件类型 – lap */
  event?: string;

  /** 事件子类型 – stop 等 */
  eventType?: string;

  /** 圈开始时间戳（UTC） */
  startTime?: Date;

  /** 起点纬度 ° */
  startPositionLat?: number;

  /** 起点经度 ° */
  startPositionLong?: number;

  /** 终点纬度 ° */
  endPositionLat?: number;

  /** 终点经度 ° */
  endPositionLong?: number;

  /** 圈耗时（含暂停）s */
  totalElapsedTime?: number;

  /** 圈计时（不含暂停）s */
  totalTimerTime?: number;

  /** 圈距离 m */
  totalDistance?: number;

  /** 圈步/踏/划次数（见子字段） */
  totalCycles?: number;

  /** 圈步数（running） */
  totalStrides?: number;

  /** 圈划水数（swimming） */
  totalStrokes?: number;

  /** 圈热量 kcal */
  totalCalories?: number;

  /** 圈脂肪热量 kcal */
  totalFatCalories?: number;

  /** 圈平均速度 m/s；enhancedAvgSpeed 优先 */
  avgSpeed?: number;

  /** 高精度圈平均速度 m/s */
  enhancedAvgSpeed?: number;

  /** 圈最大速度 m/s；enhancedMaxSpeed 优先 */
  maxSpeed?: number;

  /** 高精度圈最大速度 m/s */
  enhancedMaxSpeed?: number;

  /** 圈平均心率 bpm */
  avgHeartRate?: number;

  /** 圈最大心率 bpm */
  maxHeartRate?: number;

  /** 圈平均踏频/步频 rpm；子字段 avgRunningCadence */
  avgCadence?: number;

  /** 圈平均步频 spm（running） */
  avgRunningCadence?: number;

  /** 圈最大踏频/步频 rpm；子字段 maxRunningCadence */
  maxCadence?: number;

  /** 圈最大步频 spm（running） */
  maxRunningCadence?: number;

  /** 圈平均功率 W */
  avgPower?: number;

  /** 圈最大功率 W */
  maxPower?: number;

  /** 圈爬升 m */
  totalAscent?: number;

  /** 圈下降 m */
  totalDescent?: number;

  /** 强度区间（Active/Rest） */
  intensity?: string;

  /** 圈触发方式 time/distance/position 等 */
  lapTrigger?: string;

  /** 运动类型（与 session 相同） */
  sport?: string;

  /** 事件组（通常 0） */
  eventGroup?: number;

  /** 游泳趟数 */
  numLengths?: number;

  /** 圈标准化功率 W */
  normalizedPower?: number;

  /** 圈左右平衡 %（左 50-右 50） */
  leftRightBalance?: number;

  /** 第一趟索引（游泳） */
  firstLengthIndex?: number;

  /** 平均每趟划水距离 m（游泳） */
  avgStrokeDistance?: number;

  /** 游泳划水类型 */
  swimStroke?: string;

  /** 子运动类型 */
  subSport?: string;

  /** 有效趟数（游泳） */
  numActiveLengths?: number;

  /** 圈做功 J */
  totalWork?: number;

  /** 圈平均海拔 m；enhancedAvgAltitude 优先 */
  avgAltitude?: number;

  /** 高精度圈平均海拔 m */
  enhancedAvgAltitude?: number;

  /** 圈最大海拔 m；enhancedMaxAltitude 优先 */
  maxAltitude?: number;

  /** 高精度圈最大海拔 m */
  enhancedMaxAltitude?: number;

  /** GPS 精度 m */
  gpsAccuracy?: number;

  /** 圈平均坡度 % */
  avgGrade?: number;

  /** 圈平均正坡度 % */
  avgPosGrade?: number;

  /** 圈平均负坡度 % */
  avgNegGrade?: number;

  /** 圈最大正坡度 % */
  maxPosGrade?: number;

  /** 圈最大负坡度 % */
  maxNegGrade?: number;

  /** 圈平均温度 °C */
  avgTemperature?: number;

  /** 圈最高温度 °C */
  maxTemperature?: number;

  /** 圈总移动时间 s */
  totalMovingTime?: number;

  /** 圈平均上升速度 m/s */
  avgPosVerticalSpeed?: number;

  /** 圈平均下降速度 m/s */
  avgNegVerticalSpeed?: number;

  /** 圈最大上升速度 m/s */
  maxPosVerticalSpeed?: number;

  /** 圈最大下降速度 m/s */
  maxNegVerticalSpeed?: number;

  /** 圈最小心率 bpm */
  minHeartRate?: number;

  /** 各心率区间停留时间 s 数组 */
  timeInHrZone?: number[];

  /** 各速度区间停留时间 s 数组 */
  timeInSpeedZone?: number[];

  /** 各踏频区间停留时间 s 数组 */
  timeInCadenceZone?: number[];

  /** 各功率区间停留时间 s 数组 */
  timeInPowerZone?: number[];

  /** 重复次数（间歇） */
  repetitionNum?: number;

  /** 圈最小海拔 m；enhancedMinAltitude 优先 */
  minAltitude?: number;

  /** 高精度圈最小海拔 m */
  enhancedMinAltitude?: number;

  /** 训练课索引（结构化训练） */
  wktStepIndex?: number;

  /** 对手得分（球类） */
  opponentScore?: number;

  /** 每趟划水次数（游泳） */
  strokeCount?: number[];

  /** 各区间的次数 */
  zoneCount?: number[];

  /** 平均垂直振幅 cm */
  avgVerticalOscillation?: number;

  /** 平均触地时间占比 % */
  avgStanceTimePercent?: number;

  /** 平均触地时间 ms */
  avgStanceTime?: number;

  /** 平均小数步频 rpm */
  avgFractionalCadence?: number;

  /** 最大小数步频 rpm */
  maxFractionalCadence?: number;

  /** 圈小数步/踏次数 */
  totalFractionalCycles?: number;

  /** 玩家得分（球类） */
  playerScore?: number;

  /** 平均总血红蛋白 g/dL */
  avgTotalHemoglobinConc?: number;

  /** 最小总血红蛋白 g/dL */
  minTotalHemoglobinConc?: number;

  /** 最大总血红蛋白 g/dL */
  maxTotalHemoglobinConc?: number;

  /** 平均血红蛋白氧饱和度 % */
  avgSaturatedHemoglobinPercent?: number;

  /** 最小氧饱和度 % */
  minSaturatedHemoglobinPercent?: number;

  /** 最大氧饱和度 % */
  maxSaturatedHemoglobinPercent?: number;

  /** 左腿力矩效率 % */
  avgLeftTorqueEffectiveness?: number;

  /** 右腿力矩效率 % */
  avgRightTorqueEffectiveness?: number;

  /** 左踩踏平滑度 % */
  avgLeftPedalSmoothness?: number;

  /** 右踩踏平滑度 % */
  avgRightPedalSmoothness?: number;

  /** 综合踩踏平滑度 % */
  avgCombinedPedalSmoothness?: number;

  /** 圈站立时间 s（骑行） */
  timeStanding?: number;

  /** 圈站立次数（骑行） */
  standCount?: number;

  /** 平均左踏板中心偏移 mm */
  avgLeftPco?: number;

  /** 平均右踏板中心偏移 mm */
  avgRightPco?: number;

  /** 平均左发力相位 ° */
  avgLeftPowerPhase?: number[];

  /** 平均左峰值相位 ° */
  avgLeftPowerPhasePeak?: number[];

  /** 平均右发力相位 ° */
  avgRightPowerPhase?: number[];

  /** 平均右峰值相位 ° */
  avgRightPowerPhasePeak?: number[];

  /** 坐/站平均功率 W */
  avgPowerPosition?: number[];

  /** 坐/站最大功率 W */
  maxPowerPosition?: number[];

  /** 坐/站平均踏频 rpm */
  avgCadencePosition?: number[];

  /** 坐/站最大踏频 rpm */
  maxCadencePosition?: number[];

  /** 平均电机功率 W（eBike） */
  avgLevMotorPower?: number;

  /** 最大电机功率 W（eBike） */
  maxLevMotorPower?: number;

  /** 电池消耗 %（eBike） */
  levBatteryConsumption?: number;

  /** 平均垂直率 % */
  avgVerticalRatio?: number;

  /** 平均左右触地平衡 % */
  avgStanceTimeBalance?: number;

  /** 平均步长 cm */
  avgStepLength?: number;

  /** 平均 VAM m/s */
  avgVam?: number;

  /** 平均深度 m（潜水） */
  avgDepth?: number;

  /** 最大深度 m（潜水） */
  maxDepth?: number;

  /** 最低温度 °C */
  minTemperature?: number;

  /** 高精度平均呼吸率 breaths/min；65535=无效 */
  enhancedAvgRespirationRate?: number;

  /** 高精度最大呼吸率 breaths/min；65535=无效 */
  enhancedMaxRespirationRate?: number;

  /** 平均呼吸率 breaths/min；255=无效 */
  avgRespirationRate?: number;

  /** 最大呼吸率 breaths/min；255=无效 */
  maxRespirationRate?: number;

  /** 总地形崎岖度 kGrit */
  totalGrit?: number;

  /** 总流畅度 Flow */
  totalFlow?: number;

  /** 跳跃次数（山地车） */
  jumpCount?: number;

  /** 平均崎岖度 kGrit */
  avgGrit?: number;

  /** 平均流畅度 Flow */
  avgFlow?: number;

  /** 小数爬升 m */
  totalFractionalAscent?: number;

  /** 小数下降 m */
  totalFractionalDescent?: number;

  /** 平均核心体温 °C */
  avgCoreTemperature?: number;

  /** 最低核心体温 °C */
  minCoreTemperature?: number;

  /** 最高核心体温 °C */
  maxCoreTemperature?: number;

  // 关联的 record 数据
  recordMesgs?: RecordMesgType[];
}

export interface ActivityMesgType {
  timestamp?: Date;
  totalTimerTime?: number;
  numSessions?: number;
  type?: string;
  event?: string;
  eventType?: string;
  [key: string]: number | string | undefined | any;
}

/**
 * FIT message processing context
 */
export interface FITContext extends IProcessingContext {
  /** Raw binary data */
  rawData?: Buffer;
  /** Raw messages parsed by FIT SDK */
  rawMessages?: FITDecoderMesgs;
  /** Final result */
  result?: FITFileType;
  /** FIT file header information */
  fileHeader?: {
    type?: string;
    manufacturer?: string;
    product?: number;
  };
  /** FIT specific performance statistics */
  performance: {
    startTime: number;
    parseTime?: number;
    extractTime?: number;
    structureTime?: number;
    endTime?: number;
  };
}
