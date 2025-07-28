import { ExtensionsType, Token, TokenAST } from "../types.js";

// ============ Core Interface Definitions ============

/**
 * Generic plugin interface
 */
export interface IPlugin<TContext = any> {
  /** Plugin name */
  name: string;
  /** Plugin version */
  version?: string;
  /** Plugin description */
  description?: string;
  /** Dependencies on other plugins */
  dependencies?: string[];
  /** Supported tags */
  supportedTags?: string[];

  /** Plugin initialization */
  initialize?(context: TContext): Promise<void> | void;
  /** Plugin destruction */
  destroy?(context: TContext): Promise<void> | void;
  /** Plugin validation */
  validate?(context: TContext): Promise<boolean> | boolean;
}

/**
 * Generic converter plugin interface
 */
export interface IConverterPlugin<TContext = any> extends IPlugin<TContext> {
  /** Conversion method */
  convert(ast: TokenAST, context: TContext): any | undefined;
  /** Whether it supports the tag */
  supports(tag: string): boolean;
  /** Priority (lower number = higher priority) */
  priority?: number;
}

/**
 * Generic middleware plugin interface
 */
export interface IMiddlewarePlugin<TContext = any, TResult = any>
  extends IPlugin<TContext> {
  /** Priority (lower number = higher priority) */
  priority?: number;
  /** Execute during tokenize stage */
  onTokenize?(tokens: Token[], context: TContext): Promise<Token[]> | Token[];
  /** Execute during AST generation stage */
  onAstGenerate?(
    ast: TokenAST,
    context: TContext
  ): Promise<TokenAST> | TokenAST;
  /** Execute during conversion stage */
  onConvert?(result: any, context: TContext): Promise<any> | any;
  /** Execute during completion stage */
  onComplete?(result: TResult, context: TContext): Promise<TResult> | TResult;
  /** Error handling */
  onError?(error: Error, context: TContext): Promise<void> | void;
}

// ============ Generic Context Interface ============

/**
 * Generic processing context
 */
export interface IProcessingContext {
  /** Metadata storage */
  metadata: Map<string, any>;
  /** Error list */
  errors: Error[];
  /** Warning list */
  warnings: string[];
  /** Processing statistics */
  stats: {
    startTime: number;
    endTime?: number;
    processedTokens: number;
    convertedElements: number;
  };
  /** User-defined data */
  userData?: Record<string, any>;
}

// ============ Base Utility Classes ============

/**
 * Generic base converter abstract class
 */
export abstract class BaseConverter<
  TContext extends IProcessingContext = IProcessingContext,
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

  // ============ Generic Utility Methods ============

  protected parseFloat(value: string | number | undefined): number | undefined {
    if (typeof value === "undefined") return undefined;
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

  // ============ Extension Processing Tools ============

  /**
   * Generic Extensions processing method
   */
  protected convertExtensions(extensionsAST: TokenAST): ExtensionsType {
    const extensions: ExtensionsType = {};

    extensionsAST.children?.forEach((child: TokenAST) => {
      extensions[child.tag] = this.convertExtensionContent(child);
    });

    return extensions;
  }

  /**
   * Recursively convert Extensions content
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
 * Generic base middleware abstract class
 */
export abstract class BaseMiddleware<
  TContext extends IProcessingContext = IProcessingContext,
  TResult = any,
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
    console.error(`Middleware ${this.name} processing error:`, error);
  }
}
