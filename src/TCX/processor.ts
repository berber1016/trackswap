import { Token, TokenAST } from "../types.js";
import { XMLUtils } from "../core/xml-utils.js";
import { TCXContext, TCXFileType } from "./types.js";
import { ITCXConverterPlugin } from "./base.js";

/**
 * TCX pipeline stages
 */
export enum PipelineStage {
  TOKENIZE = "tokenize",
  AST_GENERATE = "ast-generate",
  CONVERT = "convert",
  COMPLETE = "complete",
}

/**
 * Pipeline processor interface
 */
export interface IPipelineProcessor {
  stage: PipelineStage;
  name: string;
  process(context: TCXContext): Promise<TCXContext>;
}

// ============ Core Pipeline Processors ============

/**
 * Tokenizer - convert XML to Token array
 */
export class TokenizeProcessor implements IPipelineProcessor {
  stage = PipelineStage.TOKENIZE;
  name = "tokenize-processor";

  async process(context: TCXContext): Promise<TCXContext> {
    if (!context.xmlContent) {
      throw new Error("TCX data cannot be empty");
    }

    // Use XMLUtils to tokenize
    const tokens = XMLUtils.tokenizeXML(context.xmlContent);

    if (tokens.length === 0) {
      throw new Error("Not a valid TCX file");
    }

    context.tokens = tokens;
    context.stats.processedTokens = tokens.length;

    return context;
  }
}

/**
 * AST generator - convert Token array to AST tree
 */
export class AstGenerateProcessor implements IPipelineProcessor {
  stage = PipelineStage.AST_GENERATE;
  name = "ast-generate-processor";

  async process(context: TCXContext): Promise<TCXContext> {
    if (!context.tokens || context.tokens.length === 0) {
      throw new Error("Tokens are empty, cannot generate AST");
    }

    const ast = this.buildAST(context.tokens);

    if (!ast) {
      throw new Error("Failed to generate AST");
    }

    context.ast = ast;

    return context;
  }

  /**
   * Build AST from tokens
   */
  private buildAST(tokens: Token[]): TokenAST | undefined {
    if (tokens.length === 0) return undefined;

    const stack: TokenAST[] = [];
    let current: TokenAST | undefined;

    for (const token of tokens) {
      if (token.type === "open") {
        const node: TokenAST = {
          tag: token.tag,
          attributes: token.attributes,
          children: [],
        };

        if (current) {
          current.children = current.children || [];
          current.children.push(node);
        }

        stack.push(node);
        current = node;

        // Set root node
        if (!stack.length) {
          if (!current) current = node;
        }
      } else if (token.type === "close") {
        stack.pop();
        current = stack[stack.length - 1];
      } else if (token.type === "text" && current) {
        // Add text content to current element
        if (
          token.value &&
          typeof token.value === "string" &&
          token.value.trim()
        ) {
          current.value = token.value.trim();
        }
      }
    }

    return current;
  }
}

/**
 * Converter - convert AST to TCX data structure
 */
export class ConvertProcessor implements IPipelineProcessor {
  stage = PipelineStage.CONVERT;
  name = "convert-processor";

  constructor(
    private getConverter: (tag: string) => ITCXConverterPlugin | undefined
  ) {}

  async process(context: TCXContext): Promise<TCXContext> {
    if (!context.ast) {
      throw new Error("AST is empty, cannot convert");
    }

    // Find TrainingCenterDatabase root node
    const tcxNode = this.findTCXRoot(context.ast);
    if (!tcxNode) {
      throw new Error(
        "Not a valid TCX file: TrainingCenterDatabase element not found"
      );
    }

    const result = this.convertAST(tcxNode, context);
    context.result = result as TCXFileType;

    // Update statistics
    context.stats.convertedElements = this.countElements(context.ast);

    return context;
  }

  /**
   * Find TCX root node
   */
  private findTCXRoot(ast: TokenAST): TokenAST | undefined {
    if (ast.tag === "TrainingCenterDatabase") {
      return ast;
    }

    if (ast.children) {
      for (const child of ast.children) {
        const result = this.findTCXRoot(child);
        if (result) return result;
      }
    }

    return undefined;
  }

  /**
   * Convert AST node
   */
  private convertAST(ast: TokenAST, context: TCXContext): any {
    const converter = this.getConverter(ast.tag);

    if (converter) {
      return converter.convert(ast, context);
    }

    // If no converter available, perform generic conversion
    return this.genericConvert(ast, context);
  }

  /**
   * Generic conversion method
   */
  private genericConvert(ast: TokenAST, context: TCXContext): any {
    const result: any = {};

    // Copy attributes
    if (ast.attributes) {
      Object.entries(ast.attributes).forEach(([key, value]) => {
        result[key] = value;
      });
    }

    // Handle content
    if (ast.value !== undefined) {
      if (ast.children && ast.children.length > 0) {
        // If both value and children exist, create a special structure
        result._value = ast.value;
      } else {
        // Only value exists, return the value directly
        return ast.value;
      }
    }

    // Convert child elements
    if (ast.children) {
      ast.children.forEach((child) => {
        const childResult = this.convertAST(child, context);

        if (result[child.tag]) {
          // If property already exists, convert to array
          if (!Array.isArray(result[child.tag])) {
            result[child.tag] = [result[child.tag]];
          }
          result[child.tag].push(childResult);
        } else {
          result[child.tag] = childResult;
        }
      });
    }

    return result;
  }

  /**
   * Count AST elements
   */
  private countElements(ast: TokenAST): number {
    let count = 1;
    if (ast.children) {
      for (const child of ast.children) {
        count += this.countElements(child);
      }
    }
    return count;
  }
}

/**
 * Completion processor - final processing and cleanup
 */
export class CompleteProcessor implements IPipelineProcessor {
  stage = PipelineStage.COMPLETE;
  name = "complete-processor";

  async process(context: TCXContext): Promise<TCXContext> {
    if (!context.result) {
      throw new Error("No conversion result found");
    }

    // Calculate processing time
    const endTime = Date.now();
    const processingTime = endTime - context.performance.startTime;

    context.performance.endTime = endTime;
    context.performance.processingTime = processingTime;

    // Set performance data to context
    context.metadata.set("performance", {
      processingTime,
      processedTokens: context.stats.processedTokens,
      convertedElements: context.stats.convertedElements,
    });

    return context;
  }
}
