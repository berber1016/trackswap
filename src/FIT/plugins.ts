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
 * Session data structuring plugin
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
      console.warn("No structured session found, data structure is incomplete");
      return {};
    }

    // Associate each Session's Laps and Records
    const sessionStructureMesgs = sessionMesgs.map((session) => {
      const sessionStartTime = dayjs(session.startTime).valueOf();
      const sessionEndTime = dayjs(session.timestamp).valueOf();

      // Find Laps that belong to current Session
      const sessionLaps =
        lapMesgs?.filter((lap) => {
          const lapStartTime = dayjs(lap.startTime).valueOf();
          const lapEndTime = dayjs(lap.timestamp).valueOf();
          return (
            lapStartTime >= sessionStartTime && lapEndTime <= sessionEndTime
          );
        }) || [];
      console.log("Current session has Laps:", sessionLaps?.length || 0);
      // Find corresponding Records for each Lap
      const lapsWithRecords = sessionLaps.map((lap) => {
        const lapStartTime = dayjs(lap.startTime).valueOf();
        const lapEndTime = dayjs(lap.timestamp).valueOf();

        const lapRecords =
          recordMesgs?.filter((record) => {
            const recordTime = dayjs(record.timestamp).valueOf();
            return recordTime >= lapStartTime && recordTime <= lapEndTime;
          }) || [];

        return { ...lap, recordMesgs: lapRecords };
      });

      // Return reorganized Session
      return { ...session, lapMesgs: lapsWithRecords };
    });

    return {
      sessionMesgs: sessionStructureMesgs,
    };
  }
}

/**
 * Course data structuring plugin
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

    // Time tolerance, default 2 seconds
    const TIME_TOLERANCE = 2000;

    const courseStructureMesgs = courseMesgs.map((course) => {
      const lapsWithRecords =
        lapMesgs?.map((lap) => {
          const lapStartTime = dayjs(lap.startTime).valueOf();
          const lapEndTime = dayjs(lap.timestamp).valueOf();

          // Add time tolerance because timestamps might not be accurate
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
 * File header information extraction plugin
 */
export class FileHeaderPlugin extends BaseFITStructurePlugin {
  name = "FileHeaderPlugin";
  priority = 1; // High priority, execute first

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
