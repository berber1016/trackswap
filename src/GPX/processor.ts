import { Parser } from "htmlparser2";
import { ExtensionsType, Token, TokenAST } from "../types.js";
import {
  GPX11Type,
  MetadataType,
  RteType,
  TrkType,
  WptType,
  DecoderContext,
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
 * 流水线处理器
 */
export interface IPipelineProcessor {
  stage: PipelineStage;
  process(context: DecoderContext): Promise<DecoderContext>;
}

/**
 * Tokenize处理器
 */
export class TokenizeProcessor implements IPipelineProcessor {
  stage = PipelineStage.TOKENIZE;

  async process(context: DecoderContext): Promise<DecoderContext> {
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

  async process(context: DecoderContext): Promise<DecoderContext> {
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

  async process(context: DecoderContext): Promise<DecoderContext> {
    const startTime = Date.now();

    if (!context.ast) {
      throw new Error("AST不能为空");
    }

    const gpx: GPX11Type = {};

    // 处理根节点属性
    if (context.ast.attributes) {
      Object.entries(context.ast.attributes).forEach(([key, value]) => {
        if (key.startsWith("xmlns:")) {
          gpx[key] = value.replace(/&#39;/g, "'");
        } else if (key === "xsi:schemaLocation") {
          gpx[key] = value.replace(/&#39;/g, "'");
        } else {
          gpx[key] = value;
        }
      });
    }

    // 处理子节点
    context.ast.children?.forEach((child) => {
      const converter = this.getConverter(child.tag);
      if (converter) {
        try {
          const result = converter.convert(child, context);
          if (result) {
            this.assignResult(gpx, child.tag, result);
          }
        } catch (error) {
          context.errors.push(error as Error);
          console.error(
            `转换器 ${converter.name} 处理标签 ${child.tag} 时出错:`,
            error
          );
        }
      }
    });

    context.result = gpx;
    context.performance.convertTime = Date.now() - startTime;

    return context;
  }

  private assignResult(gpx: GPX11Type, tag: string, result: any): void {
    switch (tag) {
      case "metadata":
        gpx.metadata = result as MetadataType;
        break;
      case "wpt":
        if (!gpx.wpt) gpx.wpt = [];
        gpx.wpt.push(result as WptType);
        break;
      case "rte":
        if (!gpx.rte) gpx.rte = [];
        gpx.rte.push(result as RteType);
        break;
      case "trk":
        if (!gpx.trk) gpx.trk = [];
        gpx.trk.push(result as TrkType);
        break;
      case "extensions":
        gpx.extensions = result as ExtensionsType;
        break;
    }
  }
}

/**
 * 完成处理器
 */
export class CompleteProcessor implements IPipelineProcessor {
  stage = PipelineStage.COMPLETE;

  async process(context: DecoderContext): Promise<DecoderContext> {
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

    return context;
  }
}
