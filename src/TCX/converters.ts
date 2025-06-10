import { TokenAST } from "../types.js";
import { BaseTCXConverter } from "./base.js";
import {
  TCXContext,
  ActivityType,
  ActivityLapType,
  TrackType,
  TrackpointType,
  PositionType,
  ActivityListType,
  MultiSportSessionType,
  AbstractSourceType,
  HistoryType,
  FolderType,
  WorkoutListType,
  CourseListType,
  CourseType,
  CourseLapType,
  CoursePointType,
  IntensityType,
  TriggerMethodType,
  CadenceType,
  FirstSportType,
  NextSportType,
  HistoryFolderType,
  ActivityRefType,
  WeekType,
  WorkoutType,
} from "./types.js";

// ============ Basic Element Converters ============

/**
 * Position converter
 */
export class PositionConverter extends BaseTCXConverter {
  name = "PositionConverter";
  supportedTags = ["Position"];

  convert(ast: TokenAST, context: TCXContext): PositionType | undefined {
    const position: PositionType = {};

    this.processChildren(ast, position, {
      LatitudeDegrees: (child, target) =>
        (target.LatitudeDegrees = this.parseString(child.value)),
      LongitudeDegrees: (child, target) =>
        (target.LongitudeDegrees = this.parseString(child.value)),
    });

    return position;
  }
}

/**
 * Trackpoint converter
 */
export class TrackpointConverter extends BaseTCXConverter {
  name = "TrackpointConverter";
  supportedTags = ["Trackpoint"];

  convert(ast: TokenAST, context: TCXContext): TrackpointType | undefined {
    const trackpoint: TrackpointType = {};

    this.processChildren(ast, trackpoint, {
      Time: (child, target) => (target.Time = this.parseString(child.value)),
      Position: (child, target) => {
        const decoder = context.metadata.get("decoder");
        target.Position = decoder
          ?.getConverter("Position")
          ?.convert(child, context);
      },
      AltitudeMeters: (child, target) =>
        (target.AltitudeMeters = this.parseFloat(child.value)),
      DistanceMeters: (child, target) =>
        (target.DistanceMeters = this.parseFloat(child.value)),
      HeartRateBpm: (child, target) => {
        // Handle two formats: <HeartRateBpm>123</HeartRateBpm> or <HeartRateBpm><Value>123</Value></HeartRateBpm>
        if (child.value) {
          target.HeartRateBpm = this.parseFloat(child.value);
        } else {
          const valueChild = this.getChildByTag(child, "Value");
          if (valueChild?.value) {
            target.HeartRateBpm = this.parseFloat(valueChild.value);
          }
        }
      },
      Cadence: (child, target) => {
        const cadence: CadenceType = { Low: 0, High: 0 };
        this.processChildren(child, cadence, {
          Low: (subChild, subTarget) =>
            (subTarget.Low = this.parseFloat(subChild.value)),
          High: (subChild, subTarget) =>
            (subTarget.High = this.parseFloat(subChild.value)),
        });
        target.Cadence = cadence;
      },
      SensorState: (child, target) =>
        (target.SensorState = child.value as "Present" | "Absent"),
      Extensions: (child, target) =>
        (target.Extensions = this.convertExtensions(child)),
    });

    return trackpoint;
  }

  protected convertExtensions(extensionsAST: TokenAST): any {
    const extensions: any = {};

    extensionsAST.children?.forEach((child: TokenAST) => {
      extensions[child.tag] = this.convertExtensionContent(child);
    });

    return extensions;
  }

  protected convertExtensionContent(extension: TokenAST): any {
    if (extension.children?.length) {
      const result: any = {};
      extension.children.forEach((child) => {
        result[child.tag] = this.convertExtensionContent(child);
      });
      return result;
    } else {
      return extension.value;
    }
  }
}

/**
 * Track converter
 */
export class TrackConverter extends BaseTCXConverter {
  name = "TrackConverter";
  supportedTags = ["Track"];

  convert(ast: TokenAST, context: TCXContext): TrackType | undefined {
    const track: TrackType = {
      Trackpoint: [],
    };

    this.processChildren(ast, track, {
      Trackpoint: (child, target) => {
        const decoder = context.metadata.get("decoder");
        const trackpoint = decoder
          ?.getConverter("Trackpoint")
          ?.convert(child, context);
        if (trackpoint && target.Trackpoint) {
          target.Trackpoint.push(trackpoint);
        }
      },
    });

    return track;
  }
}

/**
 * Activity lap converter
 */
export class ActivityLapConverter extends BaseTCXConverter {
  name = "ActivityLapConverter";
  supportedTags = ["Lap"];

  convert(ast: TokenAST, context: TCXContext): ActivityLapType | undefined {
    const lap: ActivityLapType = {};

    // Extract attributes
    this.extractAttributes(ast, lap, {
      StartTime: "Id" as any,
    });

    this.processChildren(ast, lap, {
      TotalTimeSeconds: (child, target) =>
        (target.TotalTimeSeconds = this.parseFloat(child.value)),
      DistanceMeters: (child, target) =>
        (target.DistanceMeters = this.parseFloat(child.value)),
      MaximumSpeed: (child, target) =>
        (target.MaximumSpeed = this.parseFloat(child.value)),
      Calories: (child, target) =>
        (target.Calories = this.parseFloat(child.value)),
      AverageHeartRateBpm: (child, target) =>
        (target.AverageHeartRateBpm = this.parseFloat(child.value)),
      MaximumHeartRateBpm: (child, target) =>
        (target.MaximumHeartRateBpm = this.parseFloat(child.value)),
      Intensity: (child, target) =>
        (target.Intensity = child.value as IntensityType),
      TriggerMethod: (child, target) =>
        (target.TriggerMethod = child.value as TriggerMethodType),
      Track: (child, target) => {
        if (!target.Track) target.Track = [];
        const decoder = context.metadata.get("decoder");
        const track = decoder?.getConverter("Track")?.convert(child, context);
        if (track) target.Track.push(track);
      },
      Notes: (child, target) => (target.Notes = this.parseString(child.value)),
      Extensions: (child, target) =>
        (target.Extensions = this.convertExtensions(child)),
    });

    return lap;
  }

  protected convertExtensions(extensionsAST: TokenAST): any {
    const extensions: any = {};

    extensionsAST.children?.forEach((child: TokenAST) => {
      extensions[child.tag] = this.convertExtensionContent(child);
    });

    return extensions;
  }

  protected convertExtensionContent(extension: TokenAST): any {
    if (extension.children?.length) {
      const result: any = {};
      extension.children.forEach((child) => {
        result[child.tag] = this.convertExtensionContent(child);
      });
      return result;
    } else {
      return extension.value;
    }
  }
}

/**
 * Activity converter
 */
export class ActivityConverter extends BaseTCXConverter {
  name = "ActivityConverter";
  supportedTags = ["Activity"];

  convert(ast: TokenAST, context: TCXContext): ActivityType | undefined {
    const activity: ActivityType = {
      Id: "",
      Lap: [],
    };

    // Extract attributes
    this.extractAttributes(ast, activity, {
      Sport: "Sport" as any,
    });

    this.processChildren(ast, activity, {
      Id: (child, target) => (target.Id = this.parseString(child.value)),
      Lap: (child, target) => {
        const decoder = context.metadata.get("decoder");
        const lap = decoder?.getConverter("Lap")?.convert(child, context);
        if (lap) target.Lap.push(lap);
      },
      Notes: (child, target) => (target.Notes = this.parseString(child.value)),
      Training: (child, target) =>
        (target.Training = this.convertTraining(child)),
      Creator: (child, target) => (target.Creator = this.convertCreator(child)),
      Extensions: (child, target) =>
        (target.Extensions = this.convertExtensions(child)),
    });

    return activity;
  }

  private convertTraining(ast: TokenAST): any {
    const training: any = {};

    // Process attributes
    if (ast.attributes) {
      Object.entries(ast.attributes).forEach(([key, value]) => {
        training[key] = value;
      });
    }

    // Process child elements
    ast.children?.forEach((child) => {
      training[child.tag] = this.convertExtensionContent(child);
    });

    return training;
  }

  private convertCreator(ast: TokenAST): any {
    const creator: any = {};

    ast.children?.forEach((child) => {
      creator[child.tag] = this.convertExtensionContent(child);
    });

    return creator;
  }

  protected convertExtensions(extensionsAST: TokenAST): any {
    const extensions: any = {};

    extensionsAST.children?.forEach((child: TokenAST) => {
      extensions[child.tag] = this.convertExtensionContent(child);
    });

    return extensions;
  }

  protected convertExtensionContent(extension: TokenAST): any {
    if (extension.children?.length) {
      const result: any = {};
      extension.children.forEach((child) => {
        result[child.tag] = this.convertExtensionContent(child);
      });
      return result;
    } else {
      return extension.value;
    }
  }
}

/**
 * Activity list converter
 */
export class ActivityListConverter extends BaseTCXConverter {
  name = "ActivityListConverter";
  supportedTags = ["Activities"];

  convert(ast: TokenAST, context: TCXContext): ActivityListType | undefined {
    const activities: ActivityListType = {
      Activity: [],
      MultiSportSession: [],
    };

    this.processChildren(ast, activities, {
      Activity: (child, target) => {
        const decoder = context.metadata.get("decoder");
        const activity = decoder
          ?.getConverter("Activity")
          ?.convert(child, context);
        if (activity && target.Activity) {
          target.Activity.push(activity);
        }
      },
      MultiSportSession: (child, target) => {
        const decoder = context.metadata.get("decoder");
        const session = decoder
          ?.getConverter("MultiSportSession")
          ?.convert(child, context);
        if (session && target.MultiSportSession) {
          target.MultiSportSession.push(session);
        }
      },
    });

    return activities;
  }
}

/**
 * Multi-sport session converter
 */
export class MultiSportSessionConverter extends BaseTCXConverter {
  name = "MultiSportSessionConverter";
  supportedTags = ["MultiSportSession"];

  convert(
    ast: TokenAST,
    context: TCXContext
  ): MultiSportSessionType | undefined {
    const session: MultiSportSessionType = {};

    this.processChildren(ast, session, {
      Id: (child, target) => (target.Id = this.parseString(child.value)),
      FirstSport: (child, target) => {
        const decoder = context.metadata.get("decoder");
        target.FirstSport = decoder
          ?.getConverter("FirstSport")
          ?.convert(child, context);
      },
      NextSport: (child, target) => {
        if (!target.NextSport) target.NextSport = [];
        const decoder = context.metadata.get("decoder");
        const nextSport = decoder
          ?.getConverter("NextSport")
          ?.convert(child, context);
        if (nextSport) target.NextSport.push(nextSport);
      },
      Notes: (child, target) => (target.Notes = this.parseString(child.value)),
    });

    return session;
  }
}

// ============ Helper Converters ============

/**
 * Abstract source converter
 */
export class AbstractSourceConverter extends BaseTCXConverter {
  name = "AbstractSourceConverter";
  supportedTags = ["Author", "Creator"];

  convert(ast: TokenAST, context: TCXContext): AbstractSourceType | undefined {
    const source: AbstractSourceType = {};

    this.processChildren(ast, source, {
      Name: (child, target) => (target.Name = this.parseString(child.value)),
    });

    return source;
  }
}
