import type { TrackFormat } from "./document.js";

export type TrackSwapErrorCode =
  | "FORMAT_UNKNOWN"
  | "FORMAT_UNSUPPORTED"
  | "DECODE_FAILED"
  | "ACTIVITY_NOT_FOUND"
  | "ENCODE_FAILED"
  | "ADAPTER_CONFLICT"
  | "DISPOSED";

export class TrackSwapError extends Error {
  readonly code: TrackSwapErrorCode;
  readonly format?: TrackFormat;
  readonly cause?: unknown;

  constructor(
    code: TrackSwapErrorCode,
    message: string,
    options: { format?: TrackFormat; cause?: unknown } = {}
  ) {
    super(message);
    this.name = "TrackSwapError";
    this.code = code;
    this.format = options.format;
    this.cause = options.cause;
  }
}

export function asTrackSwapError(
  error: unknown,
  code: TrackSwapErrorCode,
  message: string,
  format?: TrackFormat
): TrackSwapError {
  if (error instanceof TrackSwapError) return error;
  const detail = error instanceof Error ? error.message : String(error);
  return new TrackSwapError(code, `${message}: ${detail}`, {
    format,
    cause: error,
  });
}
