import {
  ActivityType,
  ActivityRecordType,
  ActivityLapType,
  FileType,
} from "../../types.js";
import { getPreciseDistance } from "geolib";

/**
 * 扩展接口
 * 所有 TrackSwap 扩展都必须实现此接口
 */
export interface TrackSwapExtension {
  /** 扩展名称 */
  name: string;
  /** 扩展版本 */
  version?: string;
  /** 扩展描述 */
  description?: string;

  /** 初始化扩展 */
  initialize?(): void;
  /** 销毁扩展 */
  destroy?(): void;

  /** 处理记录级别数据 */
  processRecord?(
    record: ActivityRecordType,
    index: number,
    records: ActivityRecordType[]
  ): ActivityRecordType;
  /** 处理圈级别数据 */
  processLap?(lap: ActivityLapType): ActivityLapType;
  /** 处理活动级别数据 */
  processActivity?(activity: ActivityType): ActivityType;
  /** 处理文件级别数据 */
  processFile?(file: FileType): FileType;
}

/**
 * 基础指标聚合扩展
 * 默认启用，提供距离、时间、心率、功率、速度、踏频等基础指标的聚合
 */
export class BaseMetricsExtension implements TrackSwapExtension {
  name = "BaseMetrics";
  version = "1.0.0";
  description = "基础指标聚合：距离、时间、心率、功率、速度、踏频";

  private cumulativeDistance = 0;

  initialize(): void {
    this.cumulativeDistance = 0;
  }

  destroy(): void {
    this.cumulativeDistance = 0;
  }

  processRecord(
    record: ActivityRecordType,
    index: number,
    records: ActivityRecordType[]
  ): ActivityRecordType {
    // 计算累计距离
    if (index > 0) {
      const prevRecord = records[index - 1];
      if (
        record.lat !== undefined &&
        record.lon !== undefined &&
        prevRecord.lat !== undefined &&
        prevRecord.lon !== undefined
      ) {
        const distance = getPreciseDistance(
          { latitude: prevRecord.lat, longitude: prevRecord.lon },
          { latitude: record.lat, longitude: record.lon }
        );
        this.cumulativeDistance += distance;
      }
    }

    return {
      ...record,
      distance: this.cumulativeDistance,
    };
  }

  processLap(lap: ActivityLapType): ActivityLapType {
    if (!lap.records || lap.records.length === 0) {
      return lap;
    }

    // 重置累计距离
    this.cumulativeDistance = 0;

    // 处理记录点
    const processedRecords = lap.records.map((record, index) =>
      this.processRecord(record, index, lap.records!)
    );

    // 计算聚合数据
    const aggregatedData = this.aggregateLapData(processedRecords);

    return {
      ...lap,
      records: processedRecords,
      ...aggregatedData,
    };
  }

  processActivity(activity: ActivityType): ActivityType {
    if (!activity.laps || activity.laps.length === 0) {
      return activity;
    }

    // 处理每个圈
    const processedLaps = activity.laps.map((lap) => this.processLap(lap));

    // 计算活动级别聚合数据
    const aggregatedData = this.aggregateActivityData(processedLaps);

    return {
      ...activity,
      laps: processedLaps,
      ...aggregatedData,
    };
  }

  /**
   * 聚合圈级别数据
   */
  private aggregateLapData(
    records: ActivityRecordType[]
  ): Partial<ActivityLapType> {
    if (records.length === 0) return {};

    const firstRecord = records[0];
    const lastRecord = records[records.length - 1];

    // 计算总距离
    const totalDistance = lastRecord.distance || 0;

    // 计算时间相关数据
    const startTime = firstRecord.timestamp;
    const endTime = lastRecord.timestamp;
    const totalElapsedTime =
      startTime && endTime ? (endTime - startTime) / 1000 : undefined;

    // 计算海拔上升和下降
    let totalAscent = 0;
    let totalDescent = 0;
    for (let i = 1; i < records.length; i++) {
      const prevAlt =
        records[i - 1].altitude || records[i - 1].enhanced_altitude || 0;
      const currAlt = records[i].altitude || records[i].enhanced_altitude || 0;
      const elevationChange = currAlt - prevAlt;

      if (elevationChange > 0) {
        totalAscent += elevationChange;
      } else if (elevationChange < 0) {
        totalDescent += Math.abs(elevationChange);
      }
    }

    // 计算平均值和最大值
    const heartRates = records
      .filter((r) => r.heart_rate)
      .map((r) => r.heart_rate!);
    const powers = records.filter((r) => r.power).map((r) => r.power!);
    const speeds = records
      .filter((r) => r.speed || r.enhanced_speed)
      .map((r) => r.speed || r.enhanced_speed!);
    const cadences = records.filter((r) => r.cadence).map((r) => r.cadence!);

    return {
      start_time: startTime,
      end_time: endTime,
      start_lat: firstRecord.lat,
      start_lon: firstRecord.lon,
      end_lat: lastRecord.lat,
      end_lon: lastRecord.lon,
      total_distance: totalDistance,
      total_elapsed_time: totalElapsedTime,
      total_ascent: totalAscent,
      total_descent: totalDescent,
      avg_heart_rate:
        heartRates.length > 0
          ? heartRates.reduce((a, b) => a + b, 0) / heartRates.length
          : undefined,
      max_heart_rate:
        heartRates.length > 0 ? Math.max(...heartRates) : undefined,
      avg_power:
        powers.length > 0
          ? powers.reduce((a, b) => a + b, 0) / powers.length
          : undefined,
      max_power: powers.length > 0 ? Math.max(...powers) : undefined,
      avg_speed:
        speeds.length > 0
          ? speeds.reduce((a, b) => a + b, 0) / speeds.length
          : undefined,
      max_speed: speeds.length > 0 ? Math.max(...speeds) : undefined,
      avg_cadence:
        cadences.length > 0
          ? cadences.reduce((a, b) => a + b, 0) / cadences.length
          : undefined,
      max_cadence: cadences.length > 0 ? Math.max(...cadences) : undefined,
    };
  }

  /**
   * 聚合活动级别数据
   */
  private aggregateActivityData(
    laps: ActivityLapType[]
  ): Partial<ActivityType> {
    if (laps.length === 0) return {};

    const firstLap = laps[0];
    const lastLap = laps[laps.length - 1];

    // 计算总计数据
    const totalDistance = laps.reduce(
      (sum, lap) => sum + (lap.total_distance || 0),
      0
    );
    const totalElapsedTime = laps.reduce(
      (sum, lap) => sum + (lap.total_elapsed_time || 0),
      0
    );
    const totalAscent = laps.reduce(
      (sum, lap) => sum + (lap.total_ascent || 0),
      0
    );
    const totalDescent = laps.reduce(
      (sum, lap) => sum + (lap.total_descent || 0),
      0
    );

    // 计算平均值（基于所有lap的平均值）
    const avgHeartRates = laps
      .filter((lap) => lap.avg_heart_rate)
      .map((lap) => lap.avg_heart_rate!);
    const avgPowers = laps
      .filter((lap) => lap.avg_power)
      .map((lap) => lap.avg_power!);
    const avgSpeeds = laps
      .filter((lap) => lap.avg_speed)
      .map((lap) => lap.avg_speed!);
    const avgCadences = laps
      .filter((lap) => lap.avg_cadence)
      .map((lap) => lap.avg_cadence!);

    // 计算最大值
    const maxHeartRates = laps
      .filter((lap) => lap.max_heart_rate)
      .map((lap) => lap.max_heart_rate!);
    const maxPowers = laps
      .filter((lap) => lap.max_power)
      .map((lap) => lap.max_power!);
    const maxSpeeds = laps
      .filter((lap) => lap.max_speed)
      .map((lap) => lap.max_speed!);
    const maxCadences = laps
      .filter((lap) => lap.max_cadence)
      .map((lap) => lap.max_cadence!);

    return {
      start_time: firstLap.start_time,
      end_time: lastLap.end_time,
      start_lat: firstLap.start_lat,
      start_lon: firstLap.start_lon,
      end_lat: lastLap.end_lat,
      end_lon: lastLap.end_lon,
      total_distance: totalDistance,
      total_elapsed_time: totalElapsedTime,
      total_ascent: totalAscent,
      total_descent: totalDescent,
      avg_speed:
        totalElapsedTime > 0 ? totalDistance / totalElapsedTime : undefined,
      avg_heart_rate:
        avgHeartRates.length > 0
          ? avgHeartRates.reduce((a, b) => a + b, 0) / avgHeartRates.length
          : undefined,
      max_heart_rate:
        maxHeartRates.length > 0 ? Math.max(...maxHeartRates) : undefined,
      avg_power:
        avgPowers.length > 0
          ? avgPowers.reduce((a, b) => a + b, 0) / avgPowers.length
          : undefined,
      max_power: maxPowers.length > 0 ? Math.max(...maxPowers) : undefined,
      max_speed: maxSpeeds.length > 0 ? Math.max(...maxSpeeds) : undefined,
      avg_cadence:
        avgCadences.length > 0
          ? avgCadences.reduce((a, b) => a + b, 0) / avgCadences.length
          : undefined,
      max_cadence:
        maxCadences.length > 0 ? Math.max(...maxCadences) : undefined,
    };
  }
}

/**
 * 扩展管理器
 * 负责管理和执行所有已注册的扩展
 */
export class ExtensionManager {
  private extensions: Map<string, TrackSwapExtension> = new Map();

  constructor() {
    // 默认注册基础指标扩展
    this.registerExtension(new BaseMetricsExtension());
  }

  /**
   * 注册扩展
   */
  registerExtension(extension: TrackSwapExtension): void {
    if (this.extensions.has(extension.name)) {
      console.warn(
        `Extension '${extension.name}' is already registered. Replacing...`
      );
    }

    this.extensions.set(extension.name, extension);

    // 初始化扩展
    if (extension.initialize) {
      extension.initialize();
    }
  }

  /**
   * 移除扩展
   */
  unregisterExtension(name: string): boolean {
    const extension = this.extensions.get(name);
    if (extension) {
      // 销毁扩展
      if (extension.destroy) {
        extension.destroy();
      }
      return this.extensions.delete(name);
    }
    return false;
  }

  /**
   * 获取扩展
   */
  getExtension(name: string): TrackSwapExtension | undefined {
    return this.extensions.get(name);
  }

  /**
   * 获取所有扩展
   */
  getAllExtensions(): TrackSwapExtension[] {
    return Array.from(this.extensions.values());
  }

  /**
   * 处理文件
   */
  processFile(file: FileType): FileType {
    let processedFile = file;

    // 依次通过所有扩展处理
    for (const extension of this.extensions.values()) {
      if (extension.processFile) {
        processedFile = extension.processFile(processedFile);
      } else {
        // 如果扩展没有 processFile 方法，则逐层处理
        processedFile = this.processFileByLayers(processedFile, extension);
      }
    }

    return processedFile;
  }

  /**
   * 逐层处理文件（活动 -> 圈 -> 记录）
   */
  private processFileByLayers(
    file: FileType,
    extension: TrackSwapExtension
  ): FileType {
    if (!file.activities || file.activities.length === 0) {
      return file;
    }

    const processedActivities = file.activities.map((activity) => {
      let processedActivity = activity;

      // 处理活动级别
      if (extension.processActivity) {
        processedActivity = extension.processActivity(processedActivity);
      } else {
        // 处理圈级别
        if (processedActivity.laps) {
          const processedLaps = processedActivity.laps.map((lap) => {
            let processedLap = lap;

            if (extension.processLap) {
              processedLap = extension.processLap(processedLap);
            } else if (extension.processRecord && processedLap.records) {
              // 处理记录级别
              const processedRecords = processedLap.records.map(
                (record, index) =>
                  extension.processRecord!(record, index, processedLap.records!)
              );
              processedLap = { ...processedLap, records: processedRecords };
            }

            return processedLap;
          });

          processedActivity = { ...processedActivity, laps: processedLaps };
        }
      }

      return processedActivity;
    });

    return {
      ...file,
      activities: processedActivities,
    };
  }

  /**
   * 重置所有扩展
   */
  reset(): void {
    for (const extension of this.extensions.values()) {
      if (extension.destroy) {
        extension.destroy();
      }
      if (extension.initialize) {
        extension.initialize();
      }
    }
  }

  /**
   * 销毁管理器
   */
  destroy(): void {
    for (const extension of this.extensions.values()) {
      if (extension.destroy) {
        extension.destroy();
      }
    }
    this.extensions.clear();
  }
}
