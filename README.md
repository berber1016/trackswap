# TrackSwap - GPX 轨迹处理库

一个功能强大、插件化的 GPX 轨迹文件处理库，支持解析、编码、转换和扩展。

## 🚀 快速开始

### 安装

```bash
npm install trackswap
```

## 📖 How to use

最简单的GPX文件处理：

```typescript
import { TrackSwap } from 'trackswap';
import fs from 'fs';

const trackSwap = new TrackSwap();

// 解析GPX文件
async function parseGPX() {
  const buffer = fs.readFileSync('track.gpx');
  const gpxData = await trackSwap.parseGPX(buffer);
  
  console.log('GPX版本:', gpxData?.version);
  console.log('轨迹数量:', gpxData?.trk?.length);
}

// 从字符串解析
async function parseFromString() {
  const xmlString = `<?xml version="1.0"?>
    <gpx version="1.1" creator="TrackSwap">
      <wpt lat="39.9042" lon="116.4074">
        <name>北京</name>
      </wpt>
    </gpx>`;
  
  const gpxData = await trackSwap.parseGPXString(xmlString);
  console.log('航路点:', gpxData?.wpt?.[0]?.name);
}
```


## 🔧 API 参考

### TrackSwap

| 方法 | 说明 | 参数 | 返回值 |
|------|------|------|--------|
| `parseGPX(buffer)` | 解析GPX Buffer | `Buffer` | `Promise<GPX11Type \| undefined>` |
| `parseGPXString(xml)` | 解析GPX字符串 | `string` | `Promise<GPX11Type \| undefined>` |
| `encodeGPX(data)` | 编码为Buffer | `GPX11Type` | `Promise<Buffer>` |
| `encodeGPXString(data)` | 编码为字符串 | `GPX11Type` | `string` |
| `getDecoder()` | 获取解码器实例 | - | `GPXDecoder` |
| `getEncoder()` | 获取编码器实例 | - | `GPXEncoder` |
| `destroy()` | 清理资源 | - | `Promise<void>` |



# GPX 流水线插件化解码器

这是一个基于流水线(Pipeline)和插件架构的GPX文件解码器，采用了现代化的设计模式，支持完整的插件生命周期管理和中间件机制。

🏗️  GPX解码器架构说明:

┌─────────────────────────────────────────────────────────────┐
│                    GPX解码器架构图                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔧 固定核心处理器 (不可修改)                                  │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 1. TokenizeProcessor    - XML → Tokens                 │ │
│  │ 2. AstGenerateProcessor - Tokens → AST                 │ │
│  │ 3. ConvertProcessor     - AST → GPX对象                 │ │
│  │ 4. CompleteProcessor    - 最终化处理                     │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  🔌 可扩展中间件 (真正的扩展点)                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ • onTokenize()    - Token增强、过滤                     │ │
│  │ • onAstGenerate() - AST结构增强                         │ │
│  │ • onConvert()     - 转换结果增强                        │ │
│  │ • onComplete()    - 最终结果处理                        │ │
│  │ • onError()       - 错误处理                           │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  📦 转换器插件 (支持优先级)                                   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ • 默认转换器：wpt, rte, trk, metadata...               │ │
│  │ • 自定义转换器：扩展标签、覆盖默认行为                    │ │
│  │ • 优先级系统：多转换器处理同一标签                       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘

## 📋 快速开始

```typescript
import { GPXDecoder } from './decoder';
import { registerDefaultMiddlewares } from './converters';

const decoder = new GPXDecoder();
// 可选：注册默认中间件（性能监控、验证等）
await registerDefaultMiddlewares(decoder);

// 解析GPX文件
const buffer = fs.readFileSync('track.gpx');
const gpxData = await decoder.parserByBuffer(buffer);

// 销毁解码器
await decoder.destroy();
```


## 🏗️ 架构设计

### 自动注册的组件

创建`GPXDecoder`实例时，以下组件会自动注册：

#### 🔧 核心流水线处理器（自动注册）
- `TokenizeProcessor`: XML → Token数组
- `AstGenerateProcessor`: Token数组 → AST
- `ConvertProcessor`: AST → GPX对象 
- `CompleteProcessor`: 性能统计和清理

#### ✅ 默认转换器（自动注册）
- `WptConverter`: 处理 `<wpt>`, `<trkpt>`, `<rtept>` 标签
- `RteConverter`: 处理 `<rte>` 路线标签
- `TrkConverter`: 处理 `<trk>` 轨迹标签  
- `TrksegConverter`: 处理 `<trkseg>` 轨迹段标签
- `MetadataConverter`: 处理 `<metadata>` 元数据标签
- `LinkConverter`: 处理 `<link>` 链接标签
- `PersonConverter`: 处理 `<author>` 作者标签
- `EmailConverter`: 处理 `<email>` 邮箱标签
- `CopyrightConverter`: 处理 `<copyright>` 版权标签
- `BoundsConverter`: 处理 `<bounds>` 边界标签

#### 🔌 用户注册的组件
- **自定义转换器**: 处理扩展标签或覆盖默认行为
- **中间件**: 在流水线各阶段插入自定义逻辑

### 流水线阶段

```
Input Buffer → Tokenize → AST Generate → Convert → Complete → Output
     ↓            ↓            ↓           ↓          ↓
  中间件钩子   中间件钩子    中间件钩子   中间件钩子  中间件钩子
```

## 🔧 创建转换器插件

### 基础转换器

```typescript
import { BaseConverter } from './decoder';

class MyConverter extends BaseConverter {
  name = 'my-converter';
  supportedTags = ['custom-tag'];
  priority = 50; // 优先级，数字越小优先级越高

  convert(ast: TokenAST, context: DecoderContext): MyDataType | undefined {
    // 验证必要属性
    if (!this.hasRequiredAttributes(ast, ['required-attr'])) {
      return undefined;
    }

    const result: MyDataType = {
      value: this.parseFloat(ast.value),
      name: this.parseString(ast.attributes?.name)
    };

    // 处理子节点
    this.processChildren(ast, result, {
      'child-tag': (child, target) => {
        target.childValue = this.parseString(child.value);
      }
    });

    return result;
  }

  // 可选的生命周期钩子
  async initialize(context: DecoderContext): Promise<void> {
    console.log(`${this.name} 转换器初始化`);
  }

  async destroy(context: DecoderContext): Promise<void> {
    console.log(`${this.name} 转换器销毁`);
  }
}
```

### 注册和使用

```typescript
const decoder = new GPXDecoder(); // 默认转换器已就绪
await decoder.registerConverter(new MyConverter());

// 验证注册
console.log(decoder.listConverters()); // 包含 'custom-tag' 和所有默认标签
```

## 🔄 创建中间件插件

### 基础中间件

```typescript
import { BaseMiddleware } from './decoder';

class MyMiddleware extends BaseMiddleware {
  name = 'my-middleware';
  description = '我的自定义中间件';

  // Token处理阶段
  async onTokenize(tokens: Token[], context: DecoderContext): Promise<Token[]> {
    console.log(`处理了 ${tokens.length} 个token`);
    // 可以修改或过滤token
    return tokens.filter(token => token.type !== 'unwanted');
  }

  // AST生成阶段
  async onAstGenerate(ast: TokenAST, context: DecoderContext): Promise<TokenAST> {
    // 可以修改AST结构
    this.addCustomProperties(ast);
    return ast;
  }

  // 转换阶段
  async onConvert(result: any, context: DecoderContext): Promise<any> {
    // 可以对转换结果进行后处理
    result.processedBy = this.name;
    return result;
  }

  // 完成阶段
  async onComplete(result: GPX11Type, context: DecoderContext): Promise<GPX11Type> {
    // 最终处理
    const performance = context.metadata.get('performance');
    console.log('处理完成，性能指标:', performance);
    return result;
  }

  // 错误处理
  async onError(error: Error, context: DecoderContext): Promise<void> {
    console.error(`中间件 ${this.name} 捕获错误:`, error.message);
    // 可以进行错误上报、恢复等操作
  }

  private addCustomProperties(ast: TokenAST): void {
    // 添加自定义属性逻辑
  }
}
```

### 注册中间件

```typescript
const decoder = new GPXDecoder();
await decoder.registerMiddleware(new MyMiddleware());

console.log(decoder.listMiddlewares()); // 包含 'my-middleware'
```

## 🎯 实际示例

### 最简洁的使用方式

```typescript
// 🎉 一行创建，立即可用！
const decoder = new GPXDecoder();
const result = await decoder.parserByBuffer(buffer);
```

### 带中间件的使用方式

```typescript
import { registerDefaultMiddlewares } from './converters';

const decoder = new GPXDecoder();
await registerDefaultMiddlewares(decoder); // 性能监控、验证等
const result = await decoder.parserByBuffer(buffer);
```

### 自定义扩展处理

```typescript
// Garmin扩展转换器
class GarminExtensionConverter extends BaseConverter {
  name = 'garmin-extension';
  supportedTags = ['gpxtpx:TrackPointExtension'];

  convert(ast: TokenAST, context: DecoderContext): GarminExtension {
    const extension: GarminExtension = {};
    
    this.processChildren(ast, extension, {
      'gpxtpx:hr': (child, target) => target.heartRate = this.parseFloat(child.value),
      'gpxtpx:cad': (child, target) => target.cadence = this.parseFloat(child.value),
      'gpxtpx:atemp': (child, target) => target.airTemp = this.parseFloat(child.value),
    });

    return extension;
  }
}

// 注册到已有解码器
const decoder = new GPXDecoder();
await decoder.registerConverter(new GarminExtensionConverter());
```

## 🛠️ 管理插件

```typescript
const decoder = new GPXDecoder();

// 查看默认注册的转换器
console.log('默认转换器:', decoder.listConverters());
// 输出: ['wpt', 'trkpt', 'rtept', 'rte', 'trk', 'trkseg', 'metadata', 'link', 'author', 'email', 'copyright', 'bounds']

// 注册自定义插件
await decoder.registerConverter(customConverter);
await decoder.registerMiddleware(customMiddleware);

// 查看所有插件
console.log('所有转换器:', decoder.listConverters());
console.log('所有中间件:', decoder.listMiddlewares());

// 移除插件
decoder.unregisterConverter('custom-tag');
decoder.unregisterMiddleware('my-middleware');

// 销毁解码器
await decoder.destroy();
```

## 🔍 调试和监控

新架构提供了丰富的调试和监控能力：

- **性能指标**: 自动收集各个阶段的处理时间
- **错误处理**: 统一的错误处理机制
- **插件状态**: 跟踪插件的生命周期状态
- **上下文传递**: 丰富的上下文信息便于调试
- **开箱即用**: 创建即可工作，无需配置

## 📚 API参考

### GPXDecoder

- `constructor()`: 创建解码器，自动注册默认转换器和流水线处理器
- `registerConverter(plugin: IConverterPlugin)`: 注册自定义转换器
- `registerMiddleware(plugin: IMiddlewarePlugin)`: 注册中间件
- `getConverter(tag: string)`: 获取转换器
- `unregisterConverter(tag: string)`: 移除转换器
- `unregisterMiddleware(name: string)`: 移除中间件
- `listConverters()`: 列出所有转换器
- `listMiddlewares()`: 列出所有中间件
- `initialize()`: 初始化解码器（自动调用）
- `destroy()`: 销毁解码器
- `parserByBuffer(buffer: Buffer)`: 解析GPX数据

### BaseConverter

提供转换器的基础实现和工具方法，详见"创建转换器插件"部分。

### BaseMiddleware

提供中间件的基础实现，包含所有生命周期钩子的默认实现。

## 🎊 总结

现在的GPX解码器真正做到了**开箱即用**：

1. **创建即可用**: `new GPXDecoder()` 后立即支持所有标准GPX标签
2. **按需扩展**: 只需要注册自定义转换器和中间件
3. **零配置**: 无需了解内部流水线和默认转换器
4. **完全可控**: 仍然支持完整的插件化定制能力

这个新架构让GPX解码变得更加简洁、易用而又不失灵活性！ 🚀 