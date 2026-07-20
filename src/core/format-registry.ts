import type { TrackFormat } from "../document.js";
import { TrackSwapError } from "../errors.js";
import type { TrackFormatAdapter } from "./format-adapter.js";

export class FormatRegistry {
  private readonly adapters = new Map<TrackFormat, TrackFormatAdapter>();

  constructor(adapters: readonly TrackFormatAdapter[]) {
    for (const adapter of adapters) {
      if (this.adapters.has(adapter.format)) {
        throw new TrackSwapError(
          "ADAPTER_CONFLICT",
          `Multiple adapters registered for format "${adapter.format}"`,
          { format: adapter.format }
        );
      }
      this.adapters.set(adapter.format, adapter);
    }
  }

  get(format: TrackFormat): TrackFormatAdapter {
    const adapter = this.adapters.get(format);
    if (!adapter) {
      throw new TrackSwapError(
        "FORMAT_UNSUPPORTED",
        `No adapter registered for format "${format}"`,
        { format }
      );
    }
    return adapter;
  }

  detect(input: Buffer): TrackFormat {
    for (const adapter of this.adapters.values()) {
      if (adapter.matches(input)) return adapter.format;
    }
    throw new TrackSwapError(
      "FORMAT_UNKNOWN",
      "Unable to detect input format"
    );
  }

  async dispose(): Promise<void> {
    await Promise.all(
      [...this.adapters.values()].map((adapter) => adapter.dispose?.())
    );
  }
}
