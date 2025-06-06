import { BaseConverter, BaseMiddleware } from "./base.js";
import { TokenAST, Token } from "../types.js";
import {
  BoundsType,
  CopyrightType,
  EmailType,
  GPX11Type,
  LinkType,
  MetadataType,
  PersonType,
  RteType,
  TrksegType,
  TrkType,
  WptType,
  DecoderContext,
} from "./types.js";
import { GpxExtensionsv3Key } from "./extensions/index.js";

// ============ 核心转换器 ============

/**
 * WPT转换器
 */
export class WptConverter extends BaseConverter {
  name = "wpt-converter";
  supportedTags = ["wpt", "trkpt", "rtept"];
  version = "1.0.0";

  convert(ast: TokenAST, context: DecoderContext): WptType | undefined {
    if (!this.hasRequiredAttributes(ast, ["lat", "lon"])) {
      console.error(`${this.name}: 缺少必需的lat或lon属性`);
      return undefined;
    }

    const wpt: WptType = {
      lat: this.parseFloat(ast.attributes!["lat"]),
      lon: this.parseFloat(ast.attributes!["lon"]),
    };

    // 处理其他属性
    this.extractAttributes(ast, wpt, {
      lat: "lat",
      lon: "lon",
    });

    // 处理子节点
    this.processChildren(ast, wpt, {
      ele: (child, target) => (target.ele = this.parseFloat(child.value)),
      time: (child, target) =>
        (target.time = new Date(this.parseString(child.value))),
      speed: (child, target) => (target.speed = this.parseFloat(child.value)),
      course: (child, target) => (target.course = this.parseFloat(child.value)),
      name: (child, target) => (target.name = this.parseString(child.value)),
      cmt: (child, target) => (target.cmt = this.parseString(child.value)),
      desc: (child, target) => (target.desc = this.parseString(child.value)),
      src: (child, target) => (target.src = this.parseString(child.value)),
      sym: (child, target) => (target.sym = this.parseString(child.value)),
      type: (child, target) => (target.type = this.parseString(child.value)),
      fix: (child, target) => (target.fix = this.parseString(child.value)),
      sat: (child, target) => (target.sat = this.parseString(child.value)),
      hdop: (child, target) => (target.hdop = this.parseFloat(child.value)),
      vdop: (child, target) => (target.vdop = this.parseFloat(child.value)),
      pdop: (child, target) => (target.pdop = this.parseFloat(child.value)),
      ageofdgpsdata: (child, target) =>
        (target.ageofdgpsdata = this.parseFloat(child.value)),
      geoidheight: (child, target) =>
        (target.geoidheight = this.parseFloat(child.value)),
      magvar: (child, target) => (target.magvar = this.parseFloat(child.value)),
      dgpsid: (child, target) => (target.dgpsid = this.parseFloat(child.value)),
      extensions: (child, target) => {
        // 查找extensions转换器
        const decoder = context.metadata.get("decoder");
        if (decoder) {
          target.extensions = decoder.convertExtensions(child);
        }
      },
      link: (child, target) => {
        if (!target.link) target.link = [];
        const decoder = context.metadata.get("decoder");
        const link = decoder?.getConverter("link")?.convert(child, context);
        if (link && target.link) target.link.push(link);
      },
    });

    return wpt;
  }
}

/**
 * Route转换器
 */
export class RteConverter extends BaseConverter {
  name = "rte-converter";
  supportedTags = ["rte"];

  convert(ast: TokenAST, context: DecoderContext): RteType | undefined {
    const rte: RteType = { rtept: [] };

    this.processChildren(ast, rte, {
      name: (child, target) => (target.name = this.parseString(child.value)),
      cmt: (child, target) => (target.cmt = this.parseString(child.value)),
      desc: (child, target) => (target.desc = this.parseString(child.value)),
      src: (child, target) => (target.src = this.parseString(child.value)),
      number: (child, target) => (target.number = this.parseFloat(child.value)),
      type: (child, target) => (target.type = this.parseString(child.value)),
      rtept: (child, target) => {
        const decoder = context.metadata.get("decoder");
        const wpt = decoder?.getConverter("wpt")?.convert(child, context);
        if (wpt && target.rtept) {
          target.rtept.push(wpt);
        }
      },
      extensions: (child, target) => {
        const decoder = context.metadata.get("decoder");
        if (decoder) {
          target.extensions = decoder.convertExtensions(child);
        }
      },
      link: (child, target) => {
        if (!target.link) target.link = [];
        const decoder = context.metadata.get("decoder");
        child.children?.forEach((linkChild) => {
          const link = decoder
            ?.getConverter("link")
            ?.convert(linkChild, context);
          if (link && target.link) target.link.push(link);
        });
      },
    });

    return rte;
  }
}

/**
 * Track转换器
 */
export class TrkConverter extends BaseConverter {
  name = "trk-converter";
  supportedTags = ["trk"];

  convert(ast: TokenAST, context: DecoderContext): TrkType | undefined {
    const trk: TrkType = { trkseg: [] };

    this.processChildren(ast, trk, {
      name: (child, target) => (target.name = this.parseString(child.value)),
      cmt: (child, target) => (target.cmt = this.parseString(child.value)),
      desc: (child, target) => (target.desc = this.parseString(child.value)),
      src: (child, target) => (target.src = this.parseString(child.value)),
      number: (child, target) => (target.number = this.parseFloat(child.value)),
      type: (child, target) => (target.type = this.parseString(child.value)),
      trkseg: (child, target) => {
        const decoder = context.metadata.get("decoder");
        const trkseg = decoder?.getConverter("trkseg")?.convert(child, context);
        if (trkseg && target.trkseg) {
          target.trkseg.push(trkseg);
        }
      },
      extensions: (child, target) => {
        const decoder = context.metadata.get("decoder");
        if (decoder) {
          target.extensions = decoder.convertExtensions(child);
        }
      },
      link: (child, target) => {
        if (!target.link) target.link = [];
        const decoder = context.metadata.get("decoder");
        child.children?.forEach((linkChild) => {
          const link = decoder
            ?.getConverter("link")
            ?.convert(linkChild, context);
          if (link && target.link) target.link.push(link);
        });
      },
    });

    return trk;
  }
}

/**
 * Track Segment转换器
 */
export class TrksegConverter extends BaseConverter {
  name = "trkseg-converter";
  supportedTags = ["trkseg"];

  convert(ast: TokenAST, context: DecoderContext): TrksegType | undefined {
    const trkseg: TrksegType = { trkpt: [] };

    this.processChildren(ast, trkseg, {
      trkpt: (child, target) => {
        const decoder = context.metadata.get("decoder");
        const wpt = decoder?.getConverter("wpt")?.convert(child, context);
        if (wpt && target.trkpt) {
          target.trkpt.push(wpt);
        }
      },
      extensions: (child, target) => {
        const decoder = context.metadata.get("decoder");
        if (decoder) {
          target.extensions = decoder.convertExtensions(child);
        }
      },
    });

    return trkseg;
  }
}

/**
 * Link转换器
 */
export class LinkConverter extends BaseConverter {
  name = "link-converter";
  supportedTags = ["link"];

  convert(ast: TokenAST, context: DecoderContext): LinkType | undefined {
    const link: LinkType = {};

    if (ast.attributes?.href) {
      link.href = ast.attributes.href;
    }

    this.processChildren(ast, link, {
      text: (child, target) => (target.text = this.parseString(child.value)),
      type: (child, target) => (target.type = this.parseString(child.value)),
    });

    return link;
  }
}

/**
 * Metadata转换器
 */
export class MetadataConverter extends BaseConverter {
  name = "metadata-converter";
  supportedTags = ["metadata"];

  convert(ast: TokenAST, context: DecoderContext): MetadataType | undefined {
    const metadata: MetadataType = {};

    this.processChildren(ast, metadata, {
      name: (child, target) => (target.name = this.parseString(child.value)),
      desc: (child, target) => (target.desc = this.parseString(child.value)),
      keywords: (child, target) =>
        (target.keywords = this.parseString(child.value)),
      time: (child, target) =>
        (target.time = new Date(this.parseString(child.value))),
      author: (child, target) => {
        const decoder = context.metadata.get("decoder");
        target.author = decoder
          ?.getConverter("author")
          ?.convert(child, context);
      },
      copyright: (child, target) => {
        const decoder = context.metadata.get("decoder");
        target.copyright = decoder
          ?.getConverter("copyright")
          ?.convert(child, context);
      },
      bounds: (child, target) => {
        const decoder = context.metadata.get("decoder");
        target.bounds = decoder
          ?.getConverter("bounds")
          ?.convert(child, context);
      },
      extensions: (child, target) => {
        const decoder = context.metadata.get("decoder");
        if (decoder) {
          target.extensions = decoder.convertExtensions(child);
        }
      },
      link: (child, target) => {
        if (!target.link) target.link = [];
        const decoder = context.metadata.get("decoder");
        const link = decoder?.getConverter("link")?.convert(child, context);
        if (link && target.link) target.link.push(link);
      },
    });

    return metadata;
  }
}

/**
 * Person转换器
 */
export class PersonConverter extends BaseConverter {
  name = "person-converter";
  supportedTags = ["author"];

  convert(ast: TokenAST, context: DecoderContext): PersonType | undefined {
    const person: PersonType = {};

    // 如果author标签直接包含文本值（如 <author>Matschi1000</author>）
    if (ast.value && !ast.children?.length) {
      person.name = this.parseString(ast.value);
      return person;
    }

    // 处理包含子元素的情况（如 <author><name>...</name><email>...</email></author>）
    this.processChildren(ast, person, {
      name: (child, target) => (target.name = this.parseString(child.value)),
      email: (child, target) => {
        const decoder = context.metadata.get("decoder");
        target.email = decoder?.getConverter("email")?.convert(child, context);
      },
      link: (child, target) => {
        const decoder = context.metadata.get("decoder");
        target.link = decoder?.getConverter("link")?.convert(child, context);
      },
    });

    return person;
  }
}

/**
 * Email转换器
 */
export class EmailConverter extends BaseConverter {
  name = "email-converter";
  supportedTags = ["email"];

  convert(ast: TokenAST, context: DecoderContext): EmailType | undefined {
    const email: EmailType = {};

    this.processChildren(ast, email, {
      id: (child, target) => (target.id = this.parseString(child.value)),
      domain: (child, target) =>
        (target.domain = this.parseString(child.value)),
    });

    return email;
  }
}

/**
 * Copyright转换器
 */
export class CopyrightConverter extends BaseConverter {
  name = "copyright-converter";
  supportedTags = ["copyright"];

  convert(ast: TokenAST, context: DecoderContext): CopyrightType | undefined {
    const copyright: CopyrightType = {};

    if (ast.attributes?.author) {
      copyright.author = ast.attributes.author;
    }

    this.processChildren(ast, copyright, {
      year: (child, target) => (target.year = this.parseString(child.value)),
      license: (child, target) =>
        (target.license = this.parseString(child.value)),
    });

    return copyright;
  }
}

/**
 * Bounds转换器
 */
export class BoundsConverter extends BaseConverter {
  name = "bounds-converter";
  supportedTags = ["bounds"];

  convert(ast: TokenAST, context: DecoderContext): BoundsType | undefined {
    const bounds: BoundsType = {};

    this.extractAttributes(ast, bounds, {
      minlat: "minlat",
      minlon: "minlon",
      maxlat: "maxlat",
      maxlon: "maxlon",
    });

    return bounds;
  }
}

// ============ 示例中间件 ============

/**
 * 性能监控中间件
 */
export class PerformanceMiddleware extends BaseMiddleware {
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
export class ValidationMiddleware extends BaseMiddleware {
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
