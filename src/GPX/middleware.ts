import { Token, TokenAST } from "../types";
import { BaseGPXMiddleware } from "./base";
import { DecoderContext } from "./types";

// ============ Example Middleware ============

/**
 * Performance monitoring middleware
 */
export class PerformanceMiddleware extends BaseGPXMiddleware {
  name = "performance-middleware";
  description = "Monitor parsing performance";

  async onTokenize(tokens: Token[], context: DecoderContext): Promise<Token[]> {
    console.log(`Tokenization completed, generated ${tokens.length} tokens`);
    return tokens;
  }

  async onAstGenerate(
    ast: TokenAST,
    context: DecoderContext
  ): Promise<TokenAST> {
    const nodeCount = this.countNodes(ast);
    console.log(`AST generation completed, contains ${nodeCount} nodes`);
    return ast;
  }

  async onComplete(result: any, context: DecoderContext): Promise<any> {
    const performance = context.metadata.get("performance");
    console.log("Parsing performance statistics:", performance);
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
 * Validation middleware
 */
export class ValidationMiddleware extends BaseGPXMiddleware {
  name = "validation-middleware";
  description = "Validate GPX data integrity";

  async onComplete(result: any, context: DecoderContext): Promise<any> {
    const errors = this.validateGPX(result);
    if (errors.length > 0) {
      console.warn("GPX validation found issues:", errors);
      context.metadata.set("validation-errors", errors);
    } else {
      console.log("GPX validation passed");
    }
    return result;
  }

  private validateGPX(gpx: any): string[] {
    const errors: string[] = [];

    if (!gpx.version) {
      errors.push("Missing GPX version information");
    }

    if (!gpx.creator) {
      errors.push("Missing GPX creator information");
    }

    // Validate track points
    if (gpx.trk) {
      for (const track of gpx.trk) {
        if (track.trkseg) {
          for (const segment of track.trkseg) {
            if (segment.trkpt) {
              for (const point of segment.trkpt) {
                if (!!point.time) {
                  errors.push("Invalid track point time");
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

// ============ Default Converter Registration Function ============

/**
 * Register all default middleware
 */
export async function registerDefaultMiddlewares(decoder: any): Promise<void> {
  const middlewares = [new PerformanceMiddleware(), new ValidationMiddleware()];

  for (const middleware of middlewares) {
    await decoder.registerMiddleware(middleware);
  }
}
