import { Token, TokenAST } from "../types.js";
import { BaseTCXMiddleware } from "./base.js";
import { TCXContext, TCXFileType } from "./types.js";

// ============ Example Middleware ============

/**
 * TCX performance monitoring middleware
 */
export class TCXPerformanceMiddleware extends BaseTCXMiddleware {
  name = "tcx-performance-middleware";
  description = "Monitor TCX parsing performance";

  async onTokenize(tokens: Token[], context: TCXContext): Promise<Token[]> {
    console.log(
      `TCX tokenization completed, generated ${tokens.length} tokens`
    );
    return tokens;
  }

  async onAstGenerate(ast: TokenAST, context: TCXContext): Promise<TokenAST> {
    const nodeCount = this.countNodes(ast);
    console.log(`TCX AST generation completed, contains ${nodeCount} nodes`);
    return ast;
  }

  async onComplete(result: any, context: TCXContext): Promise<any> {
    const performance = context.metadata.get("performance");
    console.log("TCX parsing performance statistics:", performance);
    return result;
  }

  private countNodes(ast: TokenAST): number {
    let count = 1;
    if (ast.children) {
      for (const child of ast.children) {
        count += this.countNodes(child);
      }
    }
    return count;
  }
}

/**
 * TCX validation middleware
 */
export class TCXValidationMiddleware extends BaseTCXMiddleware {
  name = "tcx-validation-middleware";
  description = "Validate TCX data integrity";

  async onComplete(result: any, context: TCXContext): Promise<any> {
    const errors = this.validateTCX(result);
    if (errors.length > 0) {
      console.warn("TCX validation found issues:", errors);
      context.metadata.set("validation-errors", errors);
    } else {
      console.log("TCX validation passed");
    }
    return result;
  }

  private validateTCX(tcx: TCXFileType): string[] {
    const errors: string[] = [];

    if (!tcx.version) {
      errors.push("Missing TCX version information");
    }

    if (!tcx.creator) {
      errors.push("Missing TCX creator information");
    }

    // Validate activities
    if (tcx.Activities && tcx.Activities.Activity) {
      for (const activity of tcx.Activities.Activity) {
        if (!activity.Id) {
          errors.push("Activity missing ID information");
        }

        if (!activity.Lap || activity.Lap.length === 0) {
          errors.push("Activity must contain at least one Lap");
        }

        // Validate laps
        if (activity.Lap) {
          for (const lap of activity.Lap) {
            if (lap.Track) {
              for (const track of lap.Track) {
                if (track.Trackpoint) {
                  for (const point of track.Trackpoint) {
                    if (!!point.Time) {
                      errors.push("Invalid trackpoint coordinates");
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    return errors;
  }
}

/**
 * TCX data enhancement middleware
 */
export class TCXEnhancementMiddleware extends BaseTCXMiddleware {
  name = "tcx-enhancement-middleware";
  description = "Enhance TCX data with additional calculated fields";

  async onComplete(result: any, context: TCXContext): Promise<any> {
    if (result.Activities && result.Activities.Activity) {
      for (const activity of result.Activities.Activity) {
        // Calculate total distance
        activity.totalDistance = this.calculateTotalDistance(activity);

        // Calculate total duration
        activity.totalDuration = this.calculateTotalDuration(activity);

        // Calculate average speed
        if (activity.totalDistance && activity.totalDuration) {
          activity.averageSpeed =
            activity.totalDistance / activity.totalDuration;
        }
      }
    }

    console.log("TCX data enhancement completed");
    return result;
  }

  private calculateTotalDistance(activity: any): number {
    let totalDistance = 0;

    if (activity.Lap) {
      for (const lap of activity.Lap) {
        if (lap.DistanceMeters) {
          totalDistance += lap.DistanceMeters;
        }
      }
    }

    return totalDistance;
  }

  private calculateTotalDuration(activity: any): number {
    let totalDuration = 0;

    if (activity.Lap) {
      for (const lap of activity.Lap) {
        if (lap.TotalTimeSeconds) {
          totalDuration += lap.TotalTimeSeconds;
        }
      }
    }

    return totalDuration;
  }
}

// ============ Default Middleware Registration Function ============

/**
 * Register all default middleware
 */
export async function registerDefaultTCXMiddlewares(
  decoder: any
): Promise<void> {
  const middlewares = [
    new TCXPerformanceMiddleware(),
    new TCXValidationMiddleware(),
    new TCXEnhancementMiddleware(),
  ];

  for (const middleware of middlewares) {
    await decoder.registerMiddleware(middleware);
  }
}
