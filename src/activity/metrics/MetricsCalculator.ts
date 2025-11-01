import dayjs from "dayjs";
import {
  FileType,
  ActivityType,
  ActivityLapType,
  ActivityRecordType,
} from "../../types.js";
import { getDistance, getPreciseDistance } from "geolib";

/**
 * 指标计算结果接口
 */
interface MetricsRecordsResult extends Partial<ActivityLapType> {
  records: ActivityRecordType[];
}

interface MetricsLapsResult extends Partial<ActivityType> {
  timestamp: Date;
  laps: ActivityLapType[];
}

export class MetricsAggregator {
  /**
   * record 数据聚合计算器 将 record 通过计算后输出
   */
  public calculateRecordsAggMetrics(
    records: ActivityRecordType[]
  ): MetricsRecordsResult | undefined {
    if (!records || records.length === 0) return undefined;
    // 先对 records 进行处理
    let result: MetricsRecordsResult = {
      records: this.preprocessRecords(records),
    };
    for (let i = 0; i < result.records.length; i++) {
      const record = result.records[i];
      // 如果没有位置数据，跳过
      if (!record.positionLat || !record.positionLong) {
        continue;
      }
      // 设定起始点和结束点
      if (!result?.startPositionLat) {
        result.startPositionLat = record.positionLat;
      }
      if (!result?.startPositionLong) {
        result.startPositionLong = record.positionLong;
      }
      result.endPositionLat = record.positionLat;
      result.endPositionLong = record.positionLong;
      // 设定开始时间和结束时间
      result.timestamp = record.timestamp;
      if (!result?.startTime) {
        result.startTime = record.timestamp;
      }
      result.endTime = record.timestamp;
      result.totalDistance = record.distance;
      result.totalElapsedTime = dayjs(record.timestamp).diff(
        dayjs(result.startTime),
        "second"
      );

      // 根据速度计算平均速度和最大速度
      if (record?.speed) {
        result.avgSpeed = result.avgSpeed
          ? (result.avgSpeed + record.speed) / 2
          : record.speed;
        result.maxSpeed = Math.max(result.maxSpeed || 0, record.speed);
      }
      if (record?.heartRate) {
        result.maxHeartRate = Math.max(
          result.maxHeartRate || 0,
          record.heartRate
        );
        result.minHeartRate = Math.min(
          result.minHeartRate || record.heartRate,
          record.heartRate
        );
        if (!result.avgHeartRate) {
          result.avgHeartRate = record.heartRate;
        } else {
          result.avgHeartRate = (result.avgHeartRate + record.heartRate) / 2;
        }
      }

      if (record?.altitude) {
        result.maxAltitude = Math.max(result.maxAltitude || 0, record.altitude);
        result.minAltitude = Math.min(
          result.minAltitude || record.altitude,
          record.altitude
        );
        result.avgAltitude = result.avgAltitude
          ? (result.avgAltitude + record.altitude) / 2
          : record.altitude;

        // 计算 totalAscent 和 totalDescent
        if (i > 0 && records[i - 1].altitude) {
          const elevationChange = this.calculateElevationChanges(
            records[i - 1],
            record
          );
          result.totalAscent =
            (result.totalAscent || 0) + elevationChange.ascent;
          result.totalDescent =
            (result.totalDescent || 0) + elevationChange.descent;
        }
      }

      if (record?.cadence) {
        result.maxCadence = Math.max(result.maxCadence || 0, record.cadence);
        if (!result.avgCadence) {
          result.avgCadence = record.cadence;
        } else {
          result.avgCadence = (result.avgCadence + record.cadence) / 2;
        }
      }

      if (record?.power) {
        result.maxPower = Math.max(result.maxPower || 0, record.power);
        if (!result.avgPower) {
          result.avgPower = record.power;
        } else {
          result.avgPower = (result.avgPower + record.power) / 2;
        }

        // 计算totalWork
        const workResult = this.calculateAccumulatedPower(
          i > 0 ? records[i - 1] : record,
          record,
          result.totalWork || 0
        );
        result.totalWork = workResult.newAccumulatedWork;
        // NP 计算
        result.normalizedPower = undefined;
      }

      if (record?.temperature) {
        if (!result.avgTemperature) {
          result.avgTemperature = record.temperature;
        } else {
          result.avgTemperature =
            (result.avgTemperature + record.temperature) / 2;
        }
        result.maxTemperature = Math.max(
          result.maxTemperature || 0,
          record.temperature
        );
        result.minTemperature = Math.min(
          result.minTemperature || record.temperature,
          record.temperature
        );
      }
    }

    return result;
  }
  /**
   * 将 laps 数据聚合起来，返回给 Activity
   * @param laps
   * @returns
   */
  public calculateLapAggMetrics(
    laps: ActivityLapType[]
  ): MetricsLapsResult | undefined {
    if (!laps || laps.length === 0) return undefined;

    let result: MetricsLapsResult = {
      laps: laps,
      timestamp: laps[0]?.timestamp || new Date(),
    };
    for (let i = 0; i < laps.length; i++) {
      const lap = laps[i];
      // 设定起始点和结束点
      if (
        lap.startPositionLat &&
        lap.startPositionLong &&
        !result?.startPositionLat &&
        !result?.startPositionLong
      ) {
        result.startPositionLat = lap.startPositionLat;
        result.startPositionLong = lap.startPositionLong;
      }
      if (lap.endPositionLat && lap.endPositionLong) {
        result.endPositionLat = lap.endPositionLat;
        result.endPositionLong = lap.endPositionLong;
      }
      // 设定开始时间和结束时间
      if (lap.startTime && !result?.startTime) {
        result.startTime = lap.startTime;
      }
      if (lap.endTime) {
        result.endTime = lap.endTime;
      }
      result.timestamp = lap.timestamp || lap.endTime || result.timestamp;

      // 累计距离
      if (lap.totalDistance) {
        result.totalDistance = (result.totalDistance || 0) + lap.totalDistance;
      }
      // 计算总时间 圈耗时（含暂停）s
      if (lap.totalElapsedTime) {
        result.totalElapsedTime =
          (result.totalElapsedTime || 0) + lap.totalElapsedTime;
      }
      // 圈总移动时间 s
      if (lap.totalMovingTime) {
        result.totalMovingTime =
          (result.totalMovingTime || 0) + lap.totalMovingTime;
      }
      // 圈总耗时（不含暂停）s
      if (lap.totalTimerTime) {
        result.totalTimerTime =
          (result.totalTimerTime || 0) + lap.totalTimerTime;
      }
      // 计算最大速度和平均速度
      if (lap.maxSpeed) {
        result.maxSpeed = Math.max(result.maxSpeed || 0, lap.maxSpeed);
      }
      if (lap.avgSpeed) {
        if (!result.avgSpeed) {
          result.avgSpeed = lap.avgSpeed;
        } else {
          result.avgSpeed = (result.avgSpeed + lap.avgSpeed) / 2;
        }
      }

      // 心率
      if (lap.maxHeartRate) {
        result.maxHeartRate = Math.max(
          result.maxHeartRate || 0,
          lap.maxHeartRate
        );
      }
      if (lap.minHeartRate) {
        result.minHeartRate = result.minHeartRate
          ? Math.min(result.minHeartRate, lap.minHeartRate)
          : lap.minHeartRate;
      }
      if (lap.avgHeartRate) {
        if (!result.avgHeartRate) {
          result.avgHeartRate = lap.avgHeartRate;
        } else {
          result.avgHeartRate = (result.avgHeartRate + lap.avgHeartRate) / 2;
        }
      }

      // 海拔
      if (lap.maxAltitude) {
        result.maxAltitude = Math.max(result.maxAltitude || 0, lap.maxAltitude);
      }
      if (lap.minAltitude) {
        result.minAltitude = result.minAltitude
          ? Math.min(result.minAltitude, lap.minAltitude)
          : lap.minAltitude;
      }
      if (lap.avgAltitude) {
        if (!result.avgAltitude) {
          result.avgAltitude = lap.avgAltitude;
        } else {
          result.avgAltitude = (result.avgAltitude + lap.avgAltitude) / 2;
        }
      }
      if (lap.totalAscent) {
        result.totalAscent = (result.totalAscent || 0) + lap.totalAscent;
      }
      if (lap.totalDescent) {
        result.totalDescent = (result.totalDescent || 0) + lap.totalDescent;
      }

      // 踏频
      if (lap.maxCadence) {
        result.maxCadence = Math.max(result.maxCadence || 0, lap.maxCadence);
      }
      if (lap.avgCadence) {
        if (!result.avgCadence) {
          result.avgCadence = lap.avgCadence;
        } else {
          result.avgCadence = (result.avgCadence + lap.avgCadence) / 2;
        }
      }

      // 功率
      if (lap.maxPower) {
        result.maxPower = Math.max(result.maxPower || 0, lap.maxPower);
      }
      if (lap.avgPower) {
        if (!result.avgPower) {
          result.avgPower = lap.avgPower;
        } else {
          result.avgPower = (result.avgPower + lap.avgPower) / 2;
        }
      }
      if (lap.totalWork) {
        result.totalWork = (result.totalWork || 0) + lap.totalWork;
      }

      // 温度
      if (lap.maxTemperature) {
        result.maxTemperature = Math.max(
          result.maxTemperature || 0,
          lap.maxTemperature
        );
      }
      if (lap.minTemperature) {
        result.minTemperature = result.minTemperature
          ? Math.min(result.minTemperature, lap.minTemperature)
          : lap.minTemperature;
      }
      if (lap.avgTemperature) {
        if (!result.avgTemperature) {
          result.avgTemperature = lap.avgTemperature;
        } else {
          result.avgTemperature =
            (result.avgTemperature + lap.avgTemperature) / 2;
        }
      }
    }

    return result;
  }

  /**
   * 对 record 数据进行预处理
   * 由于 record 数据来自 FIT、TCX、GPX 可能存在缺失、异常等问题，所以需要提前对数据进行清洗和补全
   */
  private preprocessRecords(
    records: ActivityRecordType[]
  ): ActivityRecordType[] {
    if (!records || records.length === 0) return records;

    // 过滤掉没有时间戳的点，并按时间排序
    let normalizedRecords = records
      .filter((r) => r.timestamp)
      .sort((a, b) => a.timestamp!.valueOf() - b.timestamp!.valueOf());
    // 累计功和累计距离
    let accumulatedWork = 0;
    let accDistance = 0;

    const result: ActivityRecordType[] = [];
    for (let i = 0; i < normalizedRecords.length; i++) {
      const record = normalizedRecords[i];
      const newRecord = { ...record };

      if (i > 0) {
        // 计算距离(距离是累计值，需要累加)
        const segmentDistance =
          this.calculatePointDistanceByPosition(
            normalizedRecords[i - 1],
            newRecord
          ) || 0;
        if (!newRecord.distance) {
          accDistance += segmentDistance;
          newRecord.distance = accDistance;
        }
        // 计算速度
        if (!record.speed) {
          newRecord.speed = this.calculateInstantSpeed(
            normalizedRecords[i - 1],
            newRecord,
            segmentDistance
          );
        }
        if (record.power) {
          const workResult = this.calculateAccumulatedPower(
            normalizedRecords[i - 1],
            newRecord,
            accumulatedWork
          );
          newRecord.accumulatedPower = workResult.accumulatedPower;
          accumulatedWork = workResult.newAccumulatedWork;
        }
      }
      result.push(newRecord);
    }

    return result;
  }
  /**
   * 计算两点间距离（使用 geolib 的高精度算法）
   * @param prevPoint 前一个点
   * @param currPoint 当前点
   * @returns 距离（米），如果无法计算则返回 undefined
   */
  private calculatePointDistanceByPosition(
    prevPoint: ActivityRecordType,
    currPoint: ActivityRecordType
  ): number | undefined {
    if (
      !prevPoint.positionLat ||
      !prevPoint.positionLong ||
      !currPoint.positionLat ||
      !currPoint.positionLong
    ) {
      return undefined;
    }

    try {
      // 使用 geolib 的高精度距离计算
      // 返回距离（米）
      return getPreciseDistance(
        { latitude: prevPoint.positionLat, longitude: prevPoint.positionLong },
        { latitude: currPoint.positionLat, longitude: currPoint.positionLong }
      );
    } catch (error) {
      console.warn("Distance calculation failed:", error);
      return undefined;
    }
  }

  /**
   * 计算瞬时速度
   */
  private calculateInstantSpeed(
    prevRecord: ActivityRecordType,
    currRecord: ActivityRecordType,
    distance: number | undefined
  ): number | undefined {
    if (!prevRecord.timestamp || !currRecord.timestamp || !distance) {
      return undefined;
    }

    const timeDiff =
      (dayjs(currRecord.timestamp).valueOf() -
        dayjs(prevRecord.timestamp).valueOf()) /
      1000;
    if (timeDiff <= 0) {
      return undefined;
    }

    return distance / timeDiff; // m/s
  }

  /**
   * 计算累计功率（功）
   */
  private calculateAccumulatedPower(
    prevRecord: ActivityRecordType,
    currRecord: ActivityRecordType,
    currentAccumulatedWork: number
  ): { accumulatedPower: number; newAccumulatedWork: number } {
    if (
      prevRecord.power === undefined ||
      currRecord.power === undefined ||
      !prevRecord.timestamp ||
      !currRecord.timestamp
    ) {
      return {
        accumulatedPower: currentAccumulatedWork,
        newAccumulatedWork: currentAccumulatedWork,
      };
    }

    const timeDiff =
      currRecord.timestamp?.valueOf() - prevRecord.timestamp?.valueOf();
    if (timeDiff <= 0) {
      return {
        accumulatedPower: currentAccumulatedWork,
        newAccumulatedWork: currentAccumulatedWork,
      };
    }

    const avgPowerInInterval = (prevRecord.power + currRecord.power) / 2;
    const workInInterval = avgPowerInInterval * timeDiff;
    const newAccumulatedWork = currentAccumulatedWork + workInInterval;

    return {
      accumulatedPower: newAccumulatedWork,
      newAccumulatedWork: newAccumulatedWork,
    };
  }

  /**
   * 计算两点爬升和下降
   */

  private calculateElevationChanges(
    prev: ActivityRecordType,
    curr: ActivityRecordType
  ): { ascent: number; descent: number } {
    let ascent = 0;
    let descent = 0;

    if (curr.altitude !== undefined && prev.altitude !== undefined) {
      if (curr.altitude > prev.altitude) {
        ascent = curr.altitude - prev.altitude;
      } else if (curr.altitude <= prev.altitude) {
        descent = prev.altitude - curr.altitude;
      }
    }

    return { ascent, descent };
  }
}
