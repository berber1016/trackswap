import { BaseGPXConverter, BaseGPXMiddleware } from "./base.js";
import { TokenAST, Token, ExtensionsType } from "../types.js";
import {
  BoundsType,
  CopyrightType,
  EmailType,
  LinkType,
  MetadataType,
  PersonType,
  RteType,
  TrksegType,
  TrkType,
  WptType,
  DecoderContext,
} from "./types.js";

// ============ Core Converters ============

/**
 * WPT converter
 */
export class WptConverter extends BaseGPXConverter {
  name = "wpt-converter";
  supportedTags = ["wpt", "trkpt", "rtept"];
  version = "1.0.0";

  convert(ast: TokenAST, context: DecoderContext): WptType | undefined {
    if (!this.hasRequiredAttributes(ast, ["lat", "lon"])) {
      console.error(`${this.name}: Missing required lat or lon attribute`);
      return undefined;
    }
    const wpt: WptType = {
      lat: this.parseFloat(ast.attributes?.["lat"]) as number,
      lon: this.parseFloat(ast.attributes?.["lon"]) as number,
    };

    // Process child nodes
    this.processChildren(ast, wpt, {
      ele: (child, target) => (target.ele = this.parseFloat(child.value)),
      time: (child, target) =>
        (target.time = new Date(this.parseString(child.value))),
      speed: (child, target) => (target.speed = this.parseFloat(child.value)),
      power: (child, target) => (target.power = this.parseFloat(child.value)),
      cadence: (child, target) =>
        (target.cadence = this.parseFloat(child.value)),
      heartRate: (child, target) =>
        (target.heartRate = this.parseFloat(child.value)),
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
        // Use extensions converter to get flattened extensions
        const decoder = context.metadata.get("decoder");
        const extensionsConverter = decoder?.getConverter("extensions");
        if (extensionsConverter) {
          const extensions = extensionsConverter.convert(child, context);
          if (extensions) {
            // Map extension fields directly to point object
            this.mapExtensionsToPoint(extensions, target);
            // Also keep original extensions for backward compatibility
            target.extensions = extensions;
          }
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

  /**
   * Maps extension fields from the extensions object to the point object.
   * This is necessary because the extensions converter flattens the extensions
   * into a single object, but the point object expects them as separate fields.
   */
  private mapExtensionsToPoint(
    extensions: ExtensionsType,
    point: WptType
  ): void {
    // Map common extension fields to point properties
    Object.entries(extensions).forEach(([key, value]) => {
      if (
        value !== undefined &&
        (typeof value === "string" || typeof value === "number")
      ) {
        // Helper function to check if key matches any of the field names (exact match or ends with :field)
        const matchesField = (fieldNames: string | string[]) => {
          const names = Array.isArray(fieldNames) ? fieldNames : [fieldNames];
          return names.some((name) => {
            const lowerKey = key.toLowerCase();
            const lowerName = name.toLowerCase();
            return lowerKey === lowerName || lowerKey.endsWith(`:${lowerName}`);
          });
        };

        // Map fields with flexible matching
        if (matchesField("speed")) {
          (point as WptType).speed = this.parseFloat(value);
        } else if (matchesField("hr")) {
          (point as WptType).heartRate = this.parseFloat(value);
        } else if (matchesField(["cad", "cadence"])) {
          (point as WptType).cadence = this.parseFloat(value);
        } else if (matchesField(["PowerInWatts", "power"])) {
          (point as any).power = this.parseFloat(value);
        }
        //  else if (matchesField(["atemp", "temp","Temperature"])) {
        //   (point as any).temperature = this.parseFloat(value);
        // } else if (matchesField("wtemp")) {
        //   (point as any).wtemp = this.parseFloat(value);
        // } else if (matchesField("Depth")) {
        //   (point as any).depth = this.parseFloat(value);
        // }
      }
    });
  }
}

/**
 * Route converter
 */
export class RteConverter extends BaseGPXConverter {
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
        const extensionsConverter = decoder?.getConverter("extensions");
        if (extensionsConverter) {
          target.extensions = extensionsConverter.convert(child, context);
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
 * Track converter
 */
export class TrkConverter extends BaseGPXConverter {
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
        const extensionsConverter = decoder?.getConverter("extensions");
        if (extensionsConverter) {
          target.extensions = extensionsConverter.convert(child, context);
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
 * Track Segment converter
 */
export class TrksegConverter extends BaseGPXConverter {
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
        const extensionsConverter = decoder?.getConverter("extensions");
        if (extensionsConverter) {
          target.extensions = extensionsConverter.convert(child, context);
        }
      },
    });

    return trkseg;
  }
}

/**
 * Link converter
 */
export class LinkConverter extends BaseGPXConverter {
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
 * Metadata converter
 */
export class MetadataConverter extends BaseGPXConverter {
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
        const extensionsConverter = decoder?.getConverter("extensions");
        if (extensionsConverter) {
          target.extensions = extensionsConverter.convert(child, context);
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
 * Person converter
 */
export class PersonConverter extends BaseGPXConverter {
  name = "person-converter";
  supportedTags = ["author"];

  convert(ast: TokenAST, context: DecoderContext): PersonType | undefined {
    const person: PersonType = {};

    // If author tag directly contains text value (e.g. <author>Matschi1000</author>)
    if (ast.value && !ast.children?.length) {
      person.name = this.parseString(ast.value);
      return person;
    }

    // Handle cases with child elements (e.g. <author><name>...</name><email>...</email></author>)
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
 * Email converter
 */
export class EmailConverter extends BaseGPXConverter {
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
 * Copyright converter
 */
export class CopyrightConverter extends BaseGPXConverter {
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
 * Bounds converter
 */
export class BoundsConverter extends BaseGPXConverter {
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

/**
 * Extensions converter
 */
export class ExtensionsConverter extends BaseGPXConverter {
  name = "extensions-converter";
  supportedTags = ["extensions"];

  convert(ast: TokenAST, context: DecoderContext): ExtensionsType | undefined {
    const extensions: ExtensionsType = {};

    // Process all child elements of extensions
    ast.children?.forEach((child: TokenAST) => {
      this.flattenExtensionElement(child, extensions);
    });

    return extensions;
  }

  /**
   * Flatten extension element, extracting all leaf nodes
   */
  private flattenExtensionElement(
    extensionAST: TokenAST,
    result: ExtensionsType
  ): void {
    // If the extension has no children but has a value, it's a leaf node
    if (!extensionAST.children?.length && extensionAST.value !== undefined) {
      result[extensionAST.tag] = this.parseExtensionValue(extensionAST.value);
      return;
    }

    // If the extension has children, recursively process them
    if (extensionAST.children?.length) {
      extensionAST.children.forEach((child: TokenAST) => {
        this.flattenExtensionElement(child, result);
      });
    }
  }

  /**
   * Parse extension value, trying to convert to appropriate type
   */
  private parseExtensionValue(value: string | number | undefined): any {
    if (value === undefined) return undefined;

    const strValue = String(value);

    // Try to parse as number first
    const numValue = parseFloat(strValue);
    if (!isNaN(numValue) && isFinite(numValue)) {
      return numValue;
    }

    // Return as string if not a valid number
    return strValue;
  }
}
