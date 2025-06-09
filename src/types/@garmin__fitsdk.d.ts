declare module "@garmin/fitsdk" {
  // Stream 类
  export class Stream {
    static fromBuffer(buffer: Buffer): Stream;
  }

  // Decoder 类
  export class Decoder {
    constructor(stream: Stream);

    static isFIT(stream: Stream): boolean;

    read(): {
      messages: any;
      errors: any[];
    };
  }

  // 其他可能的导出
  export interface FITMessage {
    [key: string]: any;
  }

  export interface FITField {
    name: string;
    value: any;
    units?: string;
  }
}
