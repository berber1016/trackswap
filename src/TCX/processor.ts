import { Parser } from "htmlparser2";
import { ExtensionsType, Token, TokenAST } from "../types.js";
import {
  TCXFileType,
  TCXContext,
  ActivityListType,
  AbstractSourceType,
  FolderType,
  WorkoutListType,
  CourseListType,
} from "./types.js";

/**
 * 流水线阶段
 */
export enum PipelineStage {
  TOKENIZE = "tokenize",
  AST_GENERATE = "ast_generate",
  CONVERT = "convert",
  COMPLETE = "complete",
}

// ============ 流水线处理器实现 ============

/**
 * 流水线处理器接口
 */
export interface IPipelineProcessor {
  stage: PipelineStage;
  process(context: TCXContext): Promise<TCXContext>;
}

/**
 * Tokenize处理器，将XML转为Token
 */
export class TokenizeProcessor implements IPipelineProcessor {
  stage = PipelineStage.TOKENIZE;

  async process(context: TCXContext): Promise<TCXContext> {
    const startTime = Date.now();

    if (!context.xmlContent) {
      throw new Error("XML内容不能为空");
    }

    const tokens: Token[] = [];
    const parser = new Parser(
      {
        onopentag(name, attribs) {
          tokens.push({
            type: "open",
            tag: name,
            attributes: attribs,
          });
        },
        ontext(text) {
          const filteredText = text.replace(/\n/g, "").trim();
          if (filteredText) {
            tokens.push({ type: "text", tag: "text", value: filteredText });
          }
        },
        onclosetag(name) {
          tokens.push({ type: "close", tag: name });
        },
      },
      { xmlMode: true }
    );

    parser.write(context.xmlContent);
    parser.end();

    context.tokens = tokens;
    context.performance.tokenizeTime = Date.now() - startTime;

    return context;
  }
}

/**
 * AST生成处理器
 */
export class AstGenerateProcessor implements IPipelineProcessor {
  stage = PipelineStage.AST_GENERATE;

  async process(context: TCXContext): Promise<TCXContext> {
    const startTime = Date.now();

    if (!context.tokens) {
      throw new Error("Tokens不能为空");
    }

    const stack: TokenAST[] = [];
    let root: TokenAST | undefined = undefined;
    let current: TokenAST | null = null;

    for (const token of context.tokens) {
      if (token.type === "open") {
        const newElement: TokenAST = {
          tag: token.tag,
          attributes: token.attributes || {},
          children: [],
        };

        if (!root) {
          root = newElement;
        } else if (current) {
          current.children?.push(newElement);
        }

        stack.push(newElement);
        current = newElement;
      } else if (token.type === "text" && current) {
        current.value = token.value;
      } else if (token.type === "close") {
        stack.pop();
        current = stack[stack.length - 1] || null;
      }
    }

    context.ast = root;
    context.performance.astTime = Date.now() - startTime;

    return context;
  }
}

/**
 * 转换处理器
 */
export class ConvertProcessor implements IPipelineProcessor {
  stage = PipelineStage.CONVERT;

  constructor(private getConverter: (tag: string) => any) {}

  async process(context: TCXContext): Promise<TCXContext> {
    const startTime = Date.now();

    if (!context.ast) {
      throw new Error("AST不能为空");
    }

    const tcx: TCXFileType = {};

    // 处理根节点属性
    if (context.ast.attributes) {
      Object.entries(context.ast.attributes).forEach(([key, value]) => {
        if (key.startsWith("xmlns:")) {
          tcx[key] = value.replace(/&#39;/g, "'");
        } else if (key === "xsi:schemaLocation") {
          tcx[key] = value.replace(/&#39;/g, "'");
        } else {
          tcx[key] = value;
        }
      });
    }

    // 处理子节点
    context.ast.children?.forEach((child) => {
      const converter = this.getConverter(child.tag);
      if (!converter) {
        console.error(`标签 ${child.tag} 未找到对应的 converter`);
        return;
      }
      try {
        const result = converter.convert(child, context);
        if (result) {
          this.assignResult(tcx, child.tag, result);
        }
      } catch (error) {
        context.errors.push(error as Error);
        console.error(
          `转换器 ${converter.name} 处理标签 ${child.tag} 时出错:`,
          error
        );
      }
    });

    context.result = tcx;
    context.performance.convertTime = Date.now() - startTime;

    return context;
  }

  private assignResult(tcx: TCXFileType, tag: string, result: any): void {
    switch (tag) {
      case "Folders":
        tcx.Folders = result as FolderType;
        break;
      case "Activities":
        tcx.Activities = result as ActivityListType;
        break;
      case "Workouts":
        tcx.Workouts = result as WorkoutListType;
        break;
      case "Courses":
        tcx.Courses = result as CourseListType;
        break;
      case "Author":
        tcx.Author = result as AbstractSourceType;
        break;
      case "Extensions":
        tcx.Extensions = result as ExtensionsType;
        break;
      default:
        // 对于其他标签，直接赋值
        tcx[tag] = result;
        break;
    }
  }
}

/**
 * 完成处理器
 */
export class CompleteProcessor implements IPipelineProcessor {
  stage = PipelineStage.COMPLETE;

  async process(context: TCXContext): Promise<TCXContext> {
    context.performance.endTime = Date.now();

    // 记录性能指标
    const totalTime =
      context.performance.endTime - context.performance.startTime;
    context.metadata.set("performance", {
      totalTime,
      tokenizeTime: context.performance.tokenizeTime,
      astTime: context.performance.astTime,
      convertTime: context.performance.convertTime,
    });

    // 更新统计信息
    if (context.stats) {
      context.stats.endTime = Date.now();
      if (context.tokens) {
        context.stats.processedTokens = context.tokens.length;
      }
    }

    return context;
  }
}
