import { TrackSwapExtension } from "./extensions.js";
import { ActivityRecordType } from "../../types.js";

/**
 * 坡度计算扩展
 * 计算每个记录点的爬升、下降和坡度值
 */
export class SlopeExtension implements TrackSwapExtension {
  name = "Slope";
  version = "1.0.0";
  description = "坡度计算：爬升、下降、坡度";

  private readonly elevationThreshold = 1; // 海拔变化阈值（米）
  private readonly slopeWindowSize = 5; // 坡度计算窗口大小

  processRecord(
    record: ActivityRecordType,
    index: number,
    records: ActivityRecordType[]
  ): ActivityRecordType {
    const result = { ...record };

    // 计算爬升和下降
    if (index > 0) {
      const prevRecord = records[index - 1];
      const prevAlt = prevRecord.altitude || prevRecord.enhanced_altitude;
      const currAlt = record.altitude || record.enhanced_altitude;

      if (prevAlt !== undefined && currAlt !== undefined) {
        const elevationChange = currAlt - prevAlt;

        if (Math.abs(elevationChange) >= this.elevationThreshold) {
          if (elevationChange > 0) {
            (result as any).climb = elevationChange;
            (result as any).descend = 0;
          } else {
            (result as any).climb = 0;
            (result as any).descend = Math.abs(elevationChange);
          }
        } else {
          (result as any).climb = 0;
          (result as any).descend = 0;
        }
      }
    } else {
      (result as any).climb = 0;
      (result as any).descend = 0;
    }

    // 计算坡度（使用滑动窗口）
    const slope = this.calculateSlope(record, index, records);
    if (slope !== null) {
      (result as any).slope = slope;
    }

    return result;
  }

  /**
   * 计算坡度（使用滑动窗口算法减少噪声）
   */
  private calculateSlope(
    record: ActivityRecordType,
    index: number,
    records: ActivityRecordType[]
  ): number | null {
    const halfWindow = Math.floor(this.slopeWindowSize / 2);
    const startIndex = Math.max(0, index - halfWindow);
    const endIndex = Math.min(records.length - 1, index + halfWindow);

    if (startIndex >= endIndex) {
      return null;
    }

    const startRecord = records[startIndex];
    const endRecord = records[endIndex];

    // 检查必要的数据
    if (
      !startRecord.lat ||
      !startRecord.lon ||
      !endRecord.lat ||
      !endRecord.lon
    ) {
      return null;
    }

    const startAlt = startRecord.altitude || startRecord.enhanced_altitude;
    const endAlt = endRecord.altitude || endRecord.enhanced_altitude;

    if (startAlt === undefined || endAlt === undefined) {
      return null;
    }

    // 计算水平距离
    const horizontalDistance = this.calculateDistance(
      startRecord.lat,
      startRecord.lon,
      endRecord.lat,
      endRecord.lon
    );

    if (horizontalDistance === 0) {
      return null;
    }

    // 计算坡度 (rise/run)
    const elevationChange = endAlt - startAlt;
    const slope = elevationChange / horizontalDistance;

    return slope;
  }

  /**
   * 计算两点间的距离（米）
   */
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371000; // 地球半径（米）
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * 角度转弧度
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
