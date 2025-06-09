import { ExtensionsType, Token, TokenAST } from "../types.js";

// ============ 核心接口定义 ============

/**
 * 通用插件接口
 */
export interface IPlugin<TContext = any> {
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
  initialize?(context: TContext): Promise<void> | void;
  /** 插件销毁 */
  destroy?(context: TContext): Promise<void> | void;
  /** 插件验证 */
  validate?(context: TContext): Promise<boolean> | boolean;
}

/**
 * 通用转换器插件接口
 */
export interface IConverterPlugin<TContext = any> extends IPlugin<TContext> {
  /** 转换方法 */
  convert(ast: TokenAST, context: TContext): any | undefined;
  /** 是否支持该标签 */
  supports(tag: string): boolean;
  /** 优先级（数字越小优先级越高） */
  priority?: number;
}

/**
 * 通用中间件插件接口
 */
export interface IMiddlewarePlugin<TContext = any, TResult = any>
  extends IPlugin<TContext> {
  /** 优先级（数字越小优先级越高） */
  priority?: number;
  /** 在tokenize阶段执行 */
  onTokenize?(tokens: Token[], context: TContext): Promise<Token[]> | Token[];
  /** 在AST生成阶段执行 */
  onAstGenerate?(
    ast: TokenAST,
    context: TContext
  ): Promise<TokenAST> | TokenAST;
  /** 在转换阶段执行 */
  onConvert?(result: any, context: TContext): Promise<any> | any;
  /** 在完成阶段执行 */
  onComplete?(result: TResult, context: TContext): Promise<TResult> | TResult;
  /** 错误处理 */
  onError?(error: Error, context: TContext): Promise<void> | void;
}

// ============ 通用上下文接口 ============

/**
 * 通用处理上下文
 */
export interface IProcessingContext {
  /** 元数据存储 */
  metadata: Map<string, any>;
  /** 错误列表 */
  errors: Error[];
  /** 警告列表 */
  warnings: string[];
  /** 处理统计信息 */
  stats: {
    startTime: number;
    endTime?: number;
    processedTokens: number;
    convertedElements: number;
  };
  /** 用户自定义数据 */
  userData?: Record<string, any>;
}

// ============ 基础工具类 ============

/**
 * 通用基础转换器抽象类
 */
export abstract class BaseConverter<
  TContext extends IProcessingContext = IProcessingContext
> implements IConverterPlugin<TContext>
{
  abstract name: string;
  abstract supportedTags: string[];
  version = "1.0.0";
  priority = 100;

  abstract convert(ast: TokenAST, context: TContext): any | undefined;

  supports(tag: string): boolean {
    return this.supportedTags.includes(tag);
  }

  async initialize(context: TContext): Promise<void> {
    context.metadata.set(`plugin:${this.name}:initialized`, true);
  }

  async destroy(context: TContext): Promise<void> {
    context.metadata.delete(`plugin:${this.name}:initialized`);
  }

  async validate(context: TContext): Promise<boolean> {
    return true;
  }

  // ============ 通用工具方法 ============

  protected parseFloat(value: string | number | undefined): number {
    if (typeof value === "number") return value;
    if (typeof value === "string") return parseFloat(value) || 0;
    return 0;
  }

  protected parseInt(value: string | number | undefined): number {
    if (typeof value === "number") return Math.floor(value);
    if (typeof value === "string") return parseInt(value, 10) || 0;
    return 0;
  }

  protected parseString(value: string | number | undefined): string {
    return String(value || "");
  }

  protected parseBoolean(value: string | boolean | undefined): boolean {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.toLowerCase() === "true";
    return false;
  }

  protected parseDate(value: string | undefined): Date | undefined {
    if (!value) return undefined;
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
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
        (target as any)[targetKey] = String(value || "");
      }
    });
  }

  protected processChildren<U extends Record<string, any>>(
    ast: TokenAST,
    target: U,
    processors: Record<string, (child: TokenAST, target: U) => void>
  ): void {
    ast.children?.forEach((child) => {
      const fn = processors[child.tag];
      if (fn) fn(child, target);
    });
  }

  protected getChildValue(ast: TokenAST, tag: string): string | undefined {
    const child = ast.children?.find((c) => c.tag === tag);
    return child?.value ? String(child.value) : undefined;
  }

  protected getChildByTag(ast: TokenAST, tag: string): TokenAST | undefined {
    return ast.children?.find((c) => c.tag === tag);
  }

  protected getChildrenByTag(ast: TokenAST, tag: string): TokenAST[] {
    return ast.children?.filter((c) => c.tag === tag) || [];
  }

  // ============ 扩展处理工具 ============

  /**
   * 通用的 Extensions 处理方法
   */
  protected convertExtensions(extensionsAST: TokenAST): ExtensionsType {
    const extensions: ExtensionsType = {};

    extensionsAST.children?.forEach((child: TokenAST) => {
      extensions[child.tag] = this.convertExtensionContent(child);
    });

    return extensions;
  }

  /**
   * 递归转换 Extensions 内容
   */
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
 * 通用基础中间件抽象类
 */
export abstract class BaseMiddleware<
  TContext extends IProcessingContext = IProcessingContext,
  TResult = any
> implements IMiddlewarePlugin<TContext, TResult>
{
  abstract name: string;
  version = "1.0.0";
  description = "";

  async initialize(context: TContext): Promise<void> {}
  async destroy(context: TContext): Promise<void> {}
  async validate(context: TContext): Promise<boolean> {
    return true;
  }

  async onTokenize(tokens: Token[], context: TContext): Promise<Token[]> {
    return tokens;
  }

  async onAstGenerate(ast: TokenAST, context: TContext): Promise<TokenAST> {
    return ast;
  }

  async onConvert(result: any, context: TContext): Promise<any> {
    return result;
  }

  async onComplete(result: TResult, context: TContext): Promise<TResult> {
    return result;
  }

  async onError(error: Error, context: TContext): Promise<void> {
    console.error(`中间件 ${this.name} 处理错误:`, error);
  }
}
