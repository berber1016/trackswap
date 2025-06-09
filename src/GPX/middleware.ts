import { Token, TokenAST } from "../types";
import { BaseGPXMiddleware } from "./base";
import { DecoderContext } from "./types";

// ============ 示例中间件 ============

/**
 * 性能监控中间件
 */
export class PerformanceMiddleware extends BaseGPXMiddleware {
  name = "performance-middleware";
  description = "监控解析性能";

  async onTokenize(tokens: Token[], context: DecoderContext): Promise<Token[]> {
    console.log(`Token化完成，生成了 ${tokens.length} 个token`);
    return tokens;
  }

  async onAstGenerate(
    ast: TokenAST,
    context: DecoderContext
  ): Promise<TokenAST> {
    const nodeCount = this.countNodes(ast);
    console.log(`AST生成完成，包含 ${nodeCount} 个节点`);
    return ast;
  }

  async onComplete(result: any, context: DecoderContext): Promise<any> {
    const performance = context.metadata.get("performance");
    console.log("解析性能统计:", performance);
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
 * 验证中间件
 */
export class ValidationMiddleware extends BaseGPXMiddleware {
  name = "validation-middleware";
  description = "验证GPX数据的完整性";

  async onComplete(result: any, context: DecoderContext): Promise<any> {
    const errors = this.validateGPX(result);
    if (errors.length > 0) {
      console.warn("GPX验证发现问题:", errors);
      context.metadata.set("validation-errors", errors);
    } else {
      console.log("GPX验证通过");
    }
    return result;
  }

  private validateGPX(gpx: any): string[] {
    const errors: string[] = [];

    if (!gpx.version) {
      errors.push("缺少GPX版本信息");
    }

    if (!gpx.creator) {
      errors.push("缺少GPX创建者信息");
    }

    // 验证轨迹点
    if (gpx.trk) {
      for (const track of gpx.trk) {
        if (track.trkseg) {
          for (const segment of track.trkseg) {
            if (segment.trkpt) {
              for (const point of segment.trkpt) {
                if (
                  typeof point.lat !== "number" ||
                  typeof point.lon !== "number"
                ) {
                  errors.push("轨迹点坐标无效");
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

// ============ 默认转换器注册函数 ============

/**
 * 注册所有默认中间件
 */
export async function registerDefaultMiddlewares(decoder: any): Promise<void> {
  const middlewares = [new PerformanceMiddleware(), new ValidationMiddleware()];

  for (const middleware of middlewares) {
    await decoder.registerMiddleware(middleware);
  }
}
