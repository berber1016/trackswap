# TrackSwap

TrackSwap 是一个面向 Node.js 和 TypeScript 的运动、轨迹与健康数据工具包。它使用统一文档模型读取 FIT、GPX 和 TCX，并通过格式适配器隔离各协议的解析与编码实现。

## 安装

~~~bash
npm install trackswap
~~~

需要 Node.js 18 或更高版本。

## 核心模型

~~~ts
import TrackSwap from "trackswap";

const trackSwap = new TrackSwap();

try {
  const document = await trackSwap.decode(buffer);

  console.log(document.format);
  console.log(document.kinds);
  console.log(document.facets.activity);
  console.log(document.facets.health);
  console.log(document.metadata);
} finally {
  await trackSwap.dispose();
}
~~~

`decode()` 默认不会返回格式原生对象。只有调试或协议级处理确实需要时才启用：

~~~ts
const document = await trackSwap.decode(buffer, {
  format: "fit",
  includeNative: true,
  fit: {
    includeUnknownMessages: true,
  },
});
~~~

## 活动读取、编码与转换

~~~ts
const activity = await trackSwap.decodeActivity(input);

const gpx = await trackSwap.encodeActivity(activity, { format: "gpx" });
const fit = await trackSwap.encodeActivity(activity, { format: "fit" });
const tcx = await trackSwap.encodeActivity(activity, { format: "tcx" });

const converted = await trackSwap.transcode(input, {
  sourceFormat: "gpx",
  format: "tcx",
});

const course = await trackSwap.encodeCourse(input);
~~~

## FIT 健康数据

FIT 文件只解码一次，活动与健康数据作为同一 `TrackDocument` 的 facet 返回。健康结构不直接绑定 Garmin Connect JSON，使用稳定的中间表示：

- `points`：心率、压力、呼吸率、血氧、Body Battery、HRV、温度等时间点；
- `intervals`：步数、距离、热量和活动累计量；
- `sessions`：睡眠、小睡和 Health Snapshot；
- `summaries`：日汇总、睡眠汇总及设备汇总；
- `diagnostics`：FIT SDK profile、无效值、未知消息和解析警告。

~~~ts
const document = await trackSwap.decode(fitBuffer, {
  fit: {
    includeDeveloperFields: true,
    health: {
      reconstructIntervals: true,
      retainCumulativeValues: false,
    },
  },
});
~~~

## 错误处理

所有公共操作使用 `TrackSwapError`，可通过稳定错误码分类：

~~~ts
import { TrackSwapError } from "trackswap";

try {
  await trackSwap.decode(input);
} catch (error) {
  if (error instanceof TrackSwapError) {
    console.error(error.code, error.format, error.cause);
  }
}
~~~

错误码包括 `FORMAT_UNKNOWN`、`FORMAT_UNSUPPORTED`、`DECODE_FAILED`、`ACTIVITY_NOT_FOUND`、`ENCODE_FAILED`、`ADAPTER_CONFLICT` 和 `DISPOSED`。

## 自定义格式适配器

格式扩展发生在一个明确边界上，不需要访问 TrackSwap 内部解码器：

~~~ts
import TrackSwap, { type TrackFormatAdapter } from "trackswap";

const adapter: TrackFormatAdapter = {
  format: "geojson",
  matches: (input) => input.includes(Buffer.from('"FeatureCollection"')),
  decode: async (input, options) => ({
    kinds: ["route"],
    facets: { activity: myDecode(input, options) },
    native: {},
  }),
  encodeActivity: async (activity) => myEncode(activity),
};

const trackSwap = new TrackSwap({ adapters: [adapter] });
~~~

自定义适配器默认追加到 FIT、GPX、TCX 之后。每种格式只能注册一个适配器；重复注册会立即抛出 `ADAPTER_CONFLICT`。测试或完全定制运行时可设置 `includeBuiltInAdapters: false`。

## 公共 API

| 方法 | 作用 |
| --- | --- |
| `detect(input)` | 检测 FIT、GPX 或 TCX |
| `decode(input, options?)` | 返回统一 `TrackDocument` |
| `decodeActivity(input, options?)` | 读取并要求存在活动 facet |
| `encodeActivity(activity, options)` | 将统一活动编码为目标格式 |
| `transcode(input, options)` | 通过统一活动模型转换格式 |
| `encodeCourse(inputOrActivity, options?)` | 生成 FIT Course |
| `dispose()` | 释放当前实例已创建的解码器 |

## 设计原则

- façade 只负责编排，不包含协议逻辑；
- 格式适配器负责检测、原生解码与编码；
- 统一活动和健康模型是格式之间唯一的数据交换边界；
- 默认惰性创建解码器，未使用的格式没有初始化成本；
- 核心解析阶段 fail-fast，不返回部分损坏的文档；
- 原生协议对象默认不进入公共结果，避免业务层依赖实现细节。

## License

MIT
