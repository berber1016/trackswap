import { Parser } from "htmlparser2";
import { Token } from "../types.js";

/**
 * XML 解析工具类
 */
export class XMLUtils {
  /**
   * 将 XML 内容转换为 Token 数组
   */
  static tokenizeXML(xmlContent: string): Token[] {
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

    parser.write(xmlContent);
    parser.end();

    return tokens;
  }

  /**
   * 压缩 XML 字符串（移除多余空白）
   */
  static compressXML(xmlContent: string): string {
    return xmlContent
      .replace(/>\s+</g, "><") // 移除标签间的空白
      .replace(/\s+/g, " ") // 将多个空白字符替换为单个空格
      .trim();
  }

  /**
   * 格式化 XML 字符串（添加缩进）
   */
  static formatXML(xmlContent: string, indentSize: number = 2): string {
    const indent = " ".repeat(indentSize);
    let formatted = "";
    let depth = 0;
    let inTag = false;

    for (let i = 0; i < xmlContent.length; i++) {
      const char = xmlContent[i];
      const nextChar = xmlContent[i + 1];

      if (char === "<") {
        if (nextChar === "/") {
          // 闭合标签
          depth--;
          if (!inTag) {
            formatted += "\n" + indent.repeat(depth);
          }
        } else if (nextChar !== "?" && nextChar !== "!") {
          // 开始标签
          if (!inTag) {
            formatted += "\n" + indent.repeat(depth);
          }
          depth++;
        }
        inTag = true;
      } else if (char === ">") {
        inTag = false;
        if (nextChar === "<" && xmlContent[i + 2] === "/") {
          // 自闭合标签或紧跟闭合标签
          depth--;
        }
      }

      formatted += char;
    }

    return formatted.trim();
  }

  /**
   * 验证 XML 格式
   */
  static validateXML(xmlContent: string): { isValid: boolean; error?: string } {
    try {
      const parser = new Parser({}, { xmlMode: true });
      parser.write(xmlContent);
      parser.end();
      return { isValid: true };
    } catch (error) {
      return {
        isValid: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * 提取 XML 声明信息
   */
  static extractXMLDeclaration(xmlContent: string): {
    version?: string;
    encoding?: string;
    standalone?: string;
  } {
    const declarationMatch = xmlContent.match(/<\?xml\s+([^>]+)\?>/);
    if (!declarationMatch) return {};

    const declaration = declarationMatch[1];
    const result: any = {};

    const versionMatch = declaration.match(/version=["']([^"']+)["']/);
    if (versionMatch) result.version = versionMatch[1];

    const encodingMatch = declaration.match(/encoding=["']([^"']+)["']/);
    if (encodingMatch) result.encoding = encodingMatch[1];

    const standaloneMatch = declaration.match(/standalone=["']([^"']+)["']/);
    if (standaloneMatch) result.standalone = standaloneMatch[1];

    return result;
  }

  /**
   * 转义 XML 特殊字符
   */
  static escapeXML(text: string): string {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * 反转义 XML 特殊字符
   */
  static unescapeXML(text: string): string {
    return text
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&");
  }
}
