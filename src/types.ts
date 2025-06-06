export interface Token {
  type: "open" | "close" | "text";
  tag: string;
  attributes?: AttributeType;
  value?: string | number;
}

export interface TokenAST {
  tag: string;
  attributes?: AttributeType;
  children?: TokenAST[];
  value?: string | number;
}

export interface AttributeType {
  [key: string]: string;
}

/**
 * The latitude of the point. Decimal degrees, WGS84 datum.
 * @type {number} -90.0 <= value <= 90.0
 */
export type LatitudeType = number;
/**
 * The longitude of the point. Decimal degrees, WGS84 datum.
 * @type {number} -180.0 <= value < 180.0
 */
export type LongitudeType = number;

/**
 * Used for bearing, heading, course. Units are decimal degrees, true (not magnetic).
 * @type {number} 0.0 <= value < 360.0

 */
export type DegreesType = number;

export interface ExtensionsType {
  [key: string]: string | number | undefined | ExtensionsType;
}
