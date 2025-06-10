import { Parser } from "htmlparser2";
import { Token } from "../types.js";

/**
 * XML parsing utility class
 */
export class XMLUtils {
  /**
   * Convert XML content to Token array
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
   * Compress XML string (remove extra whitespace)
   */
  static compressXML(xmlContent: string): string {
    return xmlContent
      .replace(/>\s+</g, "><") // Remove whitespace between tags
      .replace(/\s+/g, " ") // Replace multiple whitespace characters with single space
      .trim();
  }

  /**
   * Format XML string (add indentation)
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
          // Closing tag
          depth--;
          if (!inTag) {
            formatted += "\n" + indent.repeat(depth);
          }
        } else if (nextChar !== "?" && nextChar !== "!") {
          // Opening tag
          if (!inTag) {
            formatted += "\n" + indent.repeat(depth);
          }
          depth++;
        }
        inTag = true;
      } else if (char === ">") {
        inTag = false;
        if (nextChar === "<" && xmlContent[i + 2] === "/") {
          // Self-closing tag or immediately followed by closing tag
          depth--;
        }
      }

      formatted += char;
    }

    return formatted.trim();
  }

  /**
   * Validate XML format
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
   * Extract XML declaration information
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
   * Escape XML special characters
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
   * Unescape XML special characters
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
