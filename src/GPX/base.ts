import { ExtensionsType, Token, TokenAST } from "../types.js";
import { DecoderContext, GPX11Type } from "./types.js";

// ============ 核心接口定义 ============

/**
 * 插件接口
 */
export interface IPlugin {
  /** 插件名称 */
  name: string;
  /** 插件版本 */
  version?: string;
  /** 插件描述 */
  description?: string;
  /** 依赖的其他插件 */
  dependencies?: string[];
  /** 支持的标签 */
  supportedTags?: string[];

  /** 插件初始化 */
  initialize?(context: DecoderContext): Promise<void> | void;
  /** 插件销毁 */
  destroy?(context: DecoderContext): Promise<void> | void;
  /** 插件验证 */
  validate?(context: DecoderContext): Promise<boolean> | boolean;
}

/**
 * 转换器插件接口
 */
export interface IConverterPlugin extends IPlugin {
  /** 转换方法 */
  convert(ast: TokenAST, context: DecoderContext): any | undefined;
  /** 是否支持该标签 */
  supports(tag: string): boolean;
  /** 优先级（数字越小优先级越高） */
  priority?: number;
}

/**
 * 中间件插件接口
 */
export interface IMiddlewarePlugin extends IPlugin {
  /** 在tokenize阶段执行 */
  onTokenize?(
    tokens: Token[],
    context: DecoderContext
  ): Promise<Token[]> | Token[];
  /** 在AST生成阶段执行 */
  onAstGenerate?(
    ast: TokenAST,
    context: DecoderContext
  ): Promise<TokenAST> | TokenAST;
  /** 在转换阶段执行 */
  onConvert?(result: any, context: DecoderContext): Promise<any> | any;
  /** 在完成阶段执行 */
  onComplete?(
    result: GPX11Type,
    context: DecoderContext
  ): Promise<GPX11Type> | GPX11Type;
  /** 错误处理 */
  onError?(error: Error, context: DecoderContext): Promise<void> | void;
}

// ============ 基础工具类 ============

/**
 * 基础转换器抽象类
 */
export abstract class BaseConverter implements IConverterPlugin {
  abstract name: string;
  abstract supportedTags: string[];
  version = "1.0.0";
  priority = 100;

  abstract convert(ast: TokenAST, context: DecoderContext): any | undefined;

  supports(tag: string): boolean {
    return this.supportedTags.includes(tag);
  }

  async initialize(context: DecoderContext): Promise<void> {
    context.metadata.set(`plugin:${this.name}:initialized`, true);
  }

  async destroy(context: DecoderContext): Promise<void> {
    context.metadata.delete(`plugin:${this.name}:initialized`);
  }

  async validate(context: DecoderContext): Promise<boolean> {
    return true;
  }

  // 工具方法
  protected parseFloat(value: string | number | undefined): number {
    if (typeof value === "number") return value;
    if (typeof value === "string") return parseFloat(value) || 0;
    return 0;
  }

  protected parseString(value: string | number | undefined): string {
    return String(value || "");
  }

  protected hasRequiredAttributes(ast: TokenAST, required: string[]): boolean {
    return required.every((attr) => ast.attributes?.[attr]);
  }

  protected extractAttributes<U extends Record<string, any>>(
    ast: TokenAST,
    target: U,
    mapping: Record<string, keyof U>
  ): void {
    if (!ast.attributes) return;

    Object.entries(ast.attributes).forEach(([key, value]) => {
      const targetKey = mapping[key];
      if (targetKey && targetKey in target) {
        (target as any)[targetKey] = this.parseFloat(value);
      }
    });
  }

  protected processChildren<U extends Record<string, any>>(
    ast: TokenAST,
    target: U,
    processors: Record<string, (child: TokenAST, target: U) => void>
  ): void {
    ast.children?.forEach((child) => {
      const processor = processors[child.tag];
      if (processor) {
        processor(child, target);
      }
    });
  }
}

/**
 * 基础中间件抽象类
 */
export abstract class BaseMiddleware implements IMiddlewarePlugin {
  abstract name: string;
  version = "1.0.0";
  description = "";

  async initialize(context: DecoderContext): Promise<void> {}
  async destroy(context: DecoderContext): Promise<void> {}
  async validate(context: DecoderContext): Promise<boolean> {
    return true;
  }

  async onTokenize(tokens: Token[], context: DecoderContext): Promise<Token[]> {
    return tokens;
  }

  async onAstGenerate(
    ast: TokenAST,
    context: DecoderContext
  ): Promise<TokenAST> {
    return ast;
  }

  async onConvert(result: any, context: DecoderContext): Promise<any> {
    return result;
  }

  async onComplete(
    result: GPX11Type,
    context: DecoderContext
  ): Promise<GPX11Type> {
    return result;
  }

  async onError(error: Error, context: DecoderContext): Promise<void> {
    console.error(`中间件 ${this.name} 处理错误:`, error);
  }
}
