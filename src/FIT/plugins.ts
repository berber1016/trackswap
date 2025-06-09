import dayjs from "dayjs";
import { BaseFITStructurePlugin } from "./base.js";
import {
  FITDecoderMesgs,
  FITFileType,
  SessionMesgType,
  LapMesgType,
  FITContext,
} from "./types.js";

/**
 * Session 数据结构化插件
 */
export class SessionStructurePlugin extends BaseFITStructurePlugin {
  name = "SessionStructurePlugin";
  priority = 10;

  structureData(
    messages: FITDecoderMesgs,
    context: FITContext
  ): Partial<FITFileType> {
    const { sessionMesgs, lapMesgs, recordMesgs } = messages;

    if (!sessionMesgs?.length) {
      console.warn("未发现结构化 session，数据结构不完整");
      return {};
    }

    // 将每个 Session 的 Lap 和 Record 关联起来
    const sessionStructureMesgs = sessionMesgs.map((session) => {
      const sessionStartTime = dayjs(session.startTime).valueOf();
      const sessionEndTime = dayjs(session.timestamp).valueOf();

      // 找出属于当前 Session 的 Laps
      const sessionLaps =
        lapMesgs?.filter((lap) => {
          const lapStartTime = dayjs(lap.startTime).valueOf();
          const lapEndTime = dayjs(lap.timestamp).valueOf();
          return (
            lapStartTime >= sessionStartTime && lapEndTime <= sessionEndTime
          );
        }) || [];
      console.log("当前 session 下共有 Lap", sessionLaps.length);
      // 为每个 Lap 找出对应的 Records
      const lapsWithRecords = sessionLaps.map((lap) => {
        const lapStartTime = dayjs(lap.startTime).valueOf();
        const lapEndTime = dayjs(lap.timestamp).valueOf();

        const lapRecords =
          recordMesgs?.filter((record) => {
            const recordTime = dayjs(record.timestamp).valueOf();
            return recordTime >= lapStartTime && recordTime <= lapEndTime;
          }) || [];
        console.log(
          "找到当前 Lap 下的 records",
          lapRecords.length,
          recordMesgs?.length,
          dayjs(lapStartTime).format("YYYY-MM-DD HH:mm:ss"),
          dayjs(lapEndTime).format("YYYY-MM-DD HH:mm:ss")
        );
        return { ...lap, recordMesgs: lapRecords };
      });

      // 返回重新组织后的 Session
      return { ...session, lapMesgs: lapsWithRecords };
    });

    return {
      sessionMesgs: sessionStructureMesgs,
    };
  }
}

/**
 * Course 数据结构化插件
 */
export class CourseStructurePlugin extends BaseFITStructurePlugin {
  name = "CourseStructurePlugin";
  priority = 10;

  structureData(
    messages: FITDecoderMesgs,
    context: FITContext
  ): Partial<FITFileType> {
    const { courseMesgs, lapMesgs, recordMesgs } = messages;

    if (!courseMesgs?.length) {
      return {};
    }

    // 时间容错，默认2秒
    const TIME_TOLERANCE = 2000;

    const courseStructureMesgs = courseMesgs.map((course) => {
      const lapsWithRecords =
        lapMesgs?.map((lap) => {
          const lapStartTime = dayjs(lap.startTime).valueOf();
          const lapEndTime = dayjs(lap.timestamp).valueOf();

          // 添加时间容错，因为时间戳可能不太准确
          const lapRecords =
            recordMesgs?.filter((record) => {
              const recordTime = dayjs(record.timestamp).valueOf();
              return (
                recordTime >= lapStartTime - TIME_TOLERANCE &&
                recordTime <= lapEndTime + TIME_TOLERANCE
              );
            }) || [];

          return { ...lap, recordMesgs: lapRecords };
        }) || [];

      return { ...course, lapMesgs: lapsWithRecords };
    });

    return {
      courseMesgs: courseStructureMesgs,
    };
  }
}

/**
 * 文件头信息提取插件
 */
export class FileHeaderPlugin extends BaseFITStructurePlugin {
  name = "FileHeaderPlugin";
  priority = 1; // 高优先级，先执行

  structureData(
    messages: FITDecoderMesgs,
    context: FITContext
  ): Partial<FITFileType> {
    const { fileIdMesgs } = messages;

    if (fileIdMesgs?.length && fileIdMesgs[0]) {
      const fileId = fileIdMesgs[0];
      context.fileHeader = {
        type: fileId.type,
        manufacturer: fileId.manufacturer,
        product: fileId.product,
      };
    }

    return {};
  }
}
