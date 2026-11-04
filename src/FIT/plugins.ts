import dayjs from "dayjs";
import { BaseFITStructurePlugin } from "./base.js";
import {
  FITDecoderMesgs,
  FITFileType,
  FITContext,
  LapMesgType,
  LengthMesgType,
} from "./types.js";
import { fitDebugWarn } from "../fit-debug.js";

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
    const { sessionMesgs, lapMesgs, recordMesgs, lengthMesgs, setMesgs } =
      messages;

    if (!sessionMesgs?.length) {
      fitDebugWarn(
        "No structured session found, data structure is incomplete"
      );
      return {};
    }

    // Associate each Session's Laps and Records
    const sessionStructureMesgs = sessionMesgs.map((session, sessionIndex) => {
      const sessionStartTime = dayjs(session.startTime).valueOf();
      const elapsedSessionEndTime =
        sessionStartTime + (session.totalElapsedTime ?? 0) * 1000;
      const declaredSessionEndTime = dayjs(session.timestamp).valueOf();
      const sessionEndTime = Math.max(
        Number.isFinite(elapsedSessionEndTime)
          ? elapsedSessionEndTime
          : Number.NEGATIVE_INFINITY,
        Number.isFinite(declaredSessionEndTime)
          ? declaredSessionEndTime
          : Number.NEGATIVE_INFINITY
      );
      const nextSession = sessionMesgs[sessionIndex + 1];
      const nextSessionStartTime = nextSession
        ? dayjs(nextSession.startTime).valueOf()
        : Number.NaN;
      const hasNextSessionBoundary =
        Number.isFinite(nextSessionStartTime) &&
        nextSessionStartTime > sessionStartTime;
      const boundedSessionRecords = (recordMesgs ?? []).filter((record) => {
        const recordTime = dayjs(record.timestamp).valueOf();
        if (!Number.isFinite(recordTime) || recordTime < sessionStartTime) {
          return false;
        }
        return hasNextSessionBoundary
          ? recordTime < nextSessionStartTime
          : recordTime <= sessionEndTime + 2000;
      });

      // FIT defines firstLapIndex/numLaps specifically for this association.
      // Prefer those stable indices over floating-point duration windows.
      const firstLapIndex = session.firstLapIndex;
      const numLaps = session.numLaps;
      const indexedLaps =
        typeof firstLapIndex === "number" && typeof numLaps === "number"
          ? (lapMesgs ?? []).filter((lap) => {
              const lapIndex = lap.messageIndex;
              return (
                typeof lapIndex === "number" &&
                lapIndex >= firstLapIndex &&
                lapIndex < firstLapIndex + numLaps
              );
            })
          : [];
      const declaredSessionLaps = (
        indexedLaps.length > 0
          ? indexedLaps
          : (lapMesgs ?? []).filter((lap) => {
              const lapStartTime = dayjs(lap.startTime).valueOf();
              return (
                Number.isFinite(lapStartTime) &&
                lapStartTime >= sessionStartTime &&
                lapStartTime <= sessionEndTime + 2000
              );
            })
      ).sort(
        (left, right) =>
          dayjs(left.startTime).valueOf() - dayjs(right.startTime).valueOf()
      );
      const sessionRecords =
        declaredSessionLaps.length > 0
          ? boundedSessionRecords
          : sessionMesgs.length === 1
            ? [...(recordMesgs ?? [])]
            : (recordMesgs ?? []).filter((record) => {
                const recordTime = dayjs(record.timestamp).valueOf();
                if (!Number.isFinite(recordTime)) return sessionIndex === 0;
                if (sessionIndex === 0) {
                  return (
                    !hasNextSessionBoundary || recordTime < nextSessionStartTime
                  );
                }
                return (
                  recordTime >= sessionStartTime &&
                  (!hasNextSessionBoundary || recordTime < nextSessionStartTime)
                );
              });
      const sessionSets = (setMesgs ?? []).filter((set) => {
        const setTime = dayjs(set.startTime ?? set.timestamp).valueOf();
        if (!Number.isFinite(setTime)) return sessionMesgs.length === 1;
        if (setTime < sessionStartTime) return false;
        return hasNextSessionBoundary
          ? setTime < nextSessionStartTime
          : setTime <= sessionEndTime + 2000;
      });

      // Some valid FIT producers emit session + record messages without any
      // lap message. A canonical activity still needs a segment that owns the
      // records, otherwise the activity facet silently drops the entire time
      // series. Synthesize exactly one lap from the session summary while the
      // original top-level messages remain available in native output.
      const sessionLaps: LapMesgType[] =
        declaredSessionLaps.length > 0
          ? declaredSessionLaps
          : sessionRecords.length > 0
            ? [
                {
                  ...session,
                  messageIndex:
                    typeof session.firstLapIndex === "number"
                      ? session.firstLapIndex
                      : sessionIndex,
                  recordMesgs: sessionRecords,
                } as LapMesgType,
              ]
            : [];
      if (declaredSessionLaps.length === 0 && sessionLaps.length === 1) {
        const count = Number(
          context.metadata.get("fit-synthetic-lap-count") ?? 0
        );
        context.metadata.set("fit-synthetic-lap-count", count + 1);
      }

      // Find corresponding Records for each Lap
      const lapsWithRecords = sessionLaps.map((lap, lapIndex) => {
        const lapStartTime = dayjs(lap.startTime).valueOf();
        const nextLapStart = sessionLaps[lapIndex + 1]?.startTime;
        const nextLapStartTime =
          nextLapStart == null ? Number.NaN : dayjs(nextLapStart).valueOf();
        const elapsedLapEndTime =
          lapStartTime + (lap.totalElapsedTime ?? 0) * 1000;
        const isBoundedByNextLap =
          Number.isFinite(nextLapStartTime) && nextLapStartTime > lapStartTime;
        const lapEndTime = isBoundedByNextLap
          ? nextLapStartTime
          : Math.max(elapsedLapEndTime, sessionEndTime);

        const lapRecords =
          declaredSessionLaps.length === 0
            ? sessionRecords
            : sessionRecords.filter((record) => {
                const recordTime = dayjs(record.timestamp).valueOf();
                return (
                  recordTime >= lapStartTime &&
                  (isBoundedByNextLap
                    ? recordTime < lapEndTime
                    : recordTime <= lapEndTime + 2000)
                );
              });

        // 获取起点索引
        const startIndex = lap.firstLengthIndex ?? undefined;
        const offset = lap.numLengths ?? undefined;

        let lapLengths: LengthMesgType[] = [];
        if (startIndex !== undefined && offset !== undefined) {
          const endIndex = startIndex + offset;
          lapLengths =
            lengthMesgs?.filter((len) => {
              return (
                len.messageIndex >= startIndex && len.messageIndex < endIndex
              );
            }) || [];
        }
        return {
          ...lap,
          recordMesgs: lapRecords,
          // 仅限游泳
          lengthMesgs: lapLengths,
          messageIndex: lap.messageIndex !== undefined ? lap.messageIndex : 0, // Ensure messageIndex is a number
        };
      });

      // Return reorganized Session
      return {
        ...session,
        lapMesgs: lapsWithRecords,
        setMesgs: sessionSets,
      };
    });

    const assignedTimestamps = new Set<number>();
    for (const sess of sessionStructureMesgs) {
      for (const lap of sess.lapMesgs ?? []) {
        for (const r of lap.recordMesgs ?? []) {
          if (r?.timestamp != null) {
            assignedTimestamps.add(dayjs(r.timestamp).valueOf());
          }
        }
      }
    }
    let unassignedRecordCount = 0;
    for (const r of recordMesgs ?? []) {
      if (r?.timestamp == null) continue;
      const ts = dayjs(r.timestamp).valueOf();
      if (!assignedTimestamps.has(ts)) unassignedRecordCount++;
    }
    if (unassignedRecordCount > 0) {
      context.metadata.set(
        "fit-unassigned-record-count",
        unassignedRecordCount
      );
      fitDebugWarn(
        `SessionStructurePlugin: ${unassignedRecordCount} record(s) did not fall into any lap time window`
      );
    }

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
    const { fileIdMesgs, fileCreatorMesgs, deviceInfoMesgs } = messages;

    if (fileIdMesgs?.length && fileIdMesgs[0]) {
      const fileId = fileIdMesgs[0];
      context.fileHeader = {
        type: fileId.type,
        manufacturer: fileId.manufacturer,
        product: fileId.product,
      };
    }

    return { fileIdMesgs, fileCreatorMesgs, deviceInfoMesgs };
  }
}
