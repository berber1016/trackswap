declare module "@garmin/fitsdk" {
  export class Stream {
    static fromByteArray(bytes: number[]): Stream;
    static fromArrayBuffer(buffer: ArrayBuffer): Stream;
    static fromBuffer(buffer: Buffer): Stream;
  }

  export class Decoder {
    constructor(stream: Stream);
    static isFIT(stream: Stream): boolean;
    isFIT(): boolean;
    checkIntegrity(): boolean;
    read(options?: any): { messages: any; errors: any[] };
  }

  export class Encoder {
    onMesg(mesgNum: number, data: any): void;
    writeMesg(data: any): void;
    close(): Uint8Array;
  }

  export const Profile: any;
  export const Utils: any;
}
