# TrackSwap - 多格式轨迹处理库

一个强大的多格式轨迹文件处理库，支持 GPX、FIT、TCX 文件的解析、编码和格式转换。

---

**🌐 Language / 语言**: [English](README_EN.md) | [中文](README.md)

---

## 🚀 特性

- 🔄 **多格式支持**: GPX 1.1、FIT、TCX 格式
- 🎯 **统一转换**: 任意格式之间相互转换
- 🤖 **自动检测**: 智能识别文件格式
- 🔧 **插件架构**: 基于插件的可扩展设计
- 🛡️ **类型安全**: 完整的 TypeScript 支持
- ⚡ **高性能**: 优化的解析和编码算法

## 📦 安装

```bash
npm install trackswap
```

## 🎯 快速开始

### 基本使用

```typescript
import { TrackSwap } from 'trackswap';
import fs from 'fs';

const trackSwap = new TrackSwap();

// 解析 GPX 文件
const gpxBuffer = fs.readFileSync('track.gpx');
const gpxData = await trackSwap.parseGPX(gpxBuffer);

// 解析 FIT 文件
const fitBuffer = fs.readFileSync('activity.fit');
const fitData = await trackSwap.parseFIT(fitBuffer);

// 解析 TCX 文件
const tcxBuffer = fs.readFileSync('workout.tcx');
const tcxData = await trackSwap.parseTCX(tcxBuffer);
```

### 格式转换

```typescript
// 🔄 自动检测格式并转换
const gpxBuffer = await trackSwap.convertFile(anyBuffer, 'gpx');
const fitBuffer = await trackSwap.convertFile(anyBuffer, 'fit');
const tcxBuffer = await trackSwap.convertFile(anyBuffer, 'tcx');

// 🎯 指定源格式转换（提升性能）
const convertedBuffer = await trackSwap.convertFile(
  sourceBuffer, 
  'fit',      // 目标格式
  'gpx'       // 源格式（可选）
);
```

### 自动解析

```typescript
// 🤖 自动检测格式并解析
const parsedData = await trackSwap.parseFile(buffer);

// 🏃‍♂️ 解析并转换为统一的运动数据格式
const sportData = await trackSwap.parseToSport(buffer);
```

## 📖 详细使用指南

### 1. 文件解析

#### GPX 文件处理

```typescript
// 从 Buffer 解析
const gpxData = await trackSwap.parseGPX(buffer);

// 从字符串解析
const gpxData = await trackSwap.parseGPXString(xmlString);

// 编码为 Buffer
const buffer = await trackSwap.encodeGPX(gpxData);

// 编码为字符串
const xmlString = trackSwap.encodeGPXString(gpxData);
```

#### FIT 文件处理

```typescript
// 解析 FIT 文件
const fitData = await trackSwap.parseFIT(buffer);

// 编码为 Activity 文件
const activityBuffer = await trackSwap.encodeFIT(fitData);

// 编码为 Course 文件
const courseBuffer = await trackSwap.encodeFITCourse(fitData);
```

#### TCX 文件处理

```typescript
// 从 Buffer 解析
const tcxData = await trackSwap.parseTCX(buffer);

// 从字符串解析
const tcxData = await trackSwap.parseTCXString(xmlString);

// 编码为 Buffer
const buffer = await trackSwap.encodeTCX(tcxData);

// 编码为字符串
const xmlString = await trackSwap.encodeTCXString(tcxData);
```

### 2. 格式转换

#### 统一转换方法

```typescript
// 🔄 自动检测并转换
const result = await trackSwap.convertFile(sourceBuffer, 'gpx');

// 🎯 指定格式转换
const result = await trackSwap.convertFile(sourceBuffer, 'fit', 'gpx');

// 📊 支持的转换组合
// GPX ↔ FIT ↔ TCX (任意格式之间相互转换)
```

#### SportFileType 统一格式

```typescript
// 转换为统一的运动数据格式
const gpxSport = await trackSwap.convertGPXToSport(gpxData);
const fitSport = await trackSwap.convertFITToSport(fitData);
const tcxSport = await trackSwap.convertTCXToSport(tcxData);

// 从统一格式转换回具体格式
const gpxData = await trackSwap.convertSportToGPX(sportData);
const fitData = await trackSwap.convertSportToFIT(sportData);
const tcxData = await trackSwap.convertSportToTCX(sportData);
```

### 3. 智能解析

```typescript
// 🤖 自动检测格式
const format = trackSwap.detectFormat(buffer);
console.log(`检测到格式: ${format}`); // 'gpx' | 'fit' | 'tcx' | 'unknown'

// 📂 统一解析方法
const parsedData = await trackSwap.parseFile(buffer);
const parsedData = await trackSwap.parseFile(buffer, 'gpx'); // 指定格式

// 🏃‍♂️ 解析为统一格式
const sportData = await trackSwap.parseToSport(buffer);
const sportData = await trackSwap.parseToSport(buffer, 'fit'); // 指定格式
```

## 🔧 API 参考

### TrackSwap 类

#### 解析方法

| 方法 | 说明 | 参数 | 返回值 |
|------|------|------|--------|
| `parseGPX(buffer)` | 解析 GPX Buffer | `Buffer` | `Promise<GPX11Type \| undefined>` |
| `parseGPXString(xml)` | 解析 GPX 字符串 | `string` | `Promise<GPX11Type \| undefined>` |
| `parseFIT(buffer)` | 解析 FIT Buffer | `Buffer` | `Promise<FITFileType>` |
| `parseTCX(buffer)` | 解析 TCX Buffer | `Buffer` | `Promise<TCXFileType>` |
| `parseTCXString(xml)` | 解析 TCX 字符串 | `string` | `Promise<TCXFileType>` |
| `parseFile(buffer, type?)` | 统一解析方法 | `Buffer, string?` | `Promise<GPX11Type \| FITFileType \| TCXFileType>` |
| `parseToSport(buffer, type?)` | 解析为统一格式 | `Buffer, string?` | `Promise<SportFileType>` |

#### 编码方法

| 方法 | 说明 | 参数 | 返回值 |
|------|------|------|--------|
| `encodeGPX(data)` | 编码 GPX 为 Buffer | `GPX11Type` | `Promise<Buffer>` |
| `encodeGPXString(data)` | 编码 GPX 为字符串 | `GPX11Type` | `string` |
| `encodeFIT(data)` | 编码 FIT 为 Buffer | `FITFileType` | `Promise<Buffer>` |
| `encodeFITCourse(data)` | 编码 FIT Course | `FITFileType` | `Promise<Buffer>` |
| `encodeTCX(data)` | 编码 TCX 为 Buffer | `TCXFileType` | `Promise<Buffer>` |
| `encodeTCXString(data)` | 编码 TCX 为字符串 | `TCXFileType` | `Promise<string>` |

#### 转换方法

| 方法 | 说明 | 参数 | 返回值 |
|------|------|------|--------|
| `convertFile(buffer, target, source?)` | 统一转换方法 | `Buffer, string, string?` | `Promise<Buffer>` |
| `convertGPXToSport(data)` | GPX → Sport | `GPX11Type` | `Promise<SportFileType>` |
| `convertFITToSport(data)` | FIT → Sport | `FITFileType` | `Promise<SportFileType>` |
| `convertTCXToSport(data)` | TCX → Sport | `TCXFileType` | `Promise<SportFileType>` |
| `convertSportToGPX(data)` | Sport → GPX | `SportFileType` | `Promise<GPX11Type>` |
| `convertSportToFIT(data)` | Sport → FIT | `SportFileType` | `Promise<FITFileType>` |
| `convertSportToTCX(data)` | Sport → TCX | `SportFileType` | `Promise<TCXFileType>` |

#### 工具方法

| 方法 | 说明 | 参数 | 返回值 |
|------|------|------|--------|
| `detectFormat(buffer)` | 检测文件格式 | `Buffer` | `'gpx' \| 'fit' \| 'tcx' \| 'unknown'` |
| `getSportProcessor()` | 获取运动处理器 | - | `SportProcessor` |
| `destroy()` | 清理资源 | - | `Promise<void>` |

## 🌟 实际应用示例

### 批量格式转换

```typescript
import { TrackSwap } from 'trackswap';
import fs from 'fs';
import path from 'path';

async function batchConvert(inputDir: string, outputFormat: 'gpx' | 'fit' | 'tcx') {
  const trackSwap = new TrackSwap();
  const files = fs.readdirSync(inputDir);
  
  for (const file of files) {
    try {
      const inputPath = path.join(inputDir, file);
      const buffer = fs.readFileSync(inputPath);
      
      // 🔄 自动检测并转换
      const converted = await trackSwap.convertFile(buffer, outputFormat);
      
      const outputPath = path.join(inputDir, 
        `${path.parse(file).name}.${outputFormat}`);
      fs.writeFileSync(outputPath, converted);
      
      console.log(`✅ 转换完成: ${file} → ${outputFormat}`);
    } catch (error) {
      console.error(`❌ 转换失败: ${file}`, error);
    }
  }
  
  await trackSwap.destroy();
}

// 使用示例
await batchConvert('./tracks', 'gpx');
```

### 轨迹数据分析

```typescript
async function analyzeTrack(buffer: Buffer) {
  const trackSwap = new TrackSwap();
  
  // 🔍 检测格式
  const format = trackSwap.detectFormat(buffer);
  console.log(`文件格式: ${format}`);
  
  // 📊 转换为统一格式进行分析
  const sportData = await trackSwap.parseToSport(buffer);
  
  // 分析数据
  const analysis = {
    totalDistance: sportData.summary?.totalDistance || 0,
    totalTime: sportData.summary?.totalTime || 0,
    avgSpeed: sportData.summary?.avgSpeed || 0,
    maxSpeed: sportData.summary?.maxSpeed || 0,
    trackPoints: sportData.tracks?.[0]?.segments?.[0]?.points?.length || 0
  };
  
  console.log('轨迹分析结果:', analysis);
  
  await trackSwap.destroy();
  return analysis;
}
```

### 多格式数据融合

```typescript
async function mergeMultiFormatTracks(files: { buffer: Buffer, name: string }[]) {
  const trackSwap = new TrackSwap();
  const allSportData: SportFileType[] = [];
  
  // 🔄 将所有格式转换为统一格式
  for (const file of files) {
    try {
      const sportData = await trackSwap.parseToSport(file.buffer);
      sportData.metadata = { ...sportData.metadata, originalFile: file.name };
      allSportData.push(sportData);
    } catch (error) {
      console.error(`解析失败: ${file.name}`, error);
    }
  }
  
  // 融合数据逻辑
  const mergedData = mergeSportData(allSportData);
  
  // 输出为不同格式
  const results = {
    gpx: await trackSwap.convertSportToGPX(mergedData),
    fit: await trackSwap.convertSportToFIT(mergedData),
    tcx: await trackSwap.convertSportToTCX(mergedData)
  };
  
  await trackSwap.destroy();
  return results;
}
```

## 🏗️ 架构设计

TrackSwap 采用模块化架构，核心组件包括：

```
┌─────────────────────────────────────────────────────────────┐
│                    TrackSwap 架构图                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔧 核心处理模块                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ • GPXDecoder/Encoder - GPX 文件处理                     │ │
│  │ • FITDecoder/Encoder - FIT 文件处理                     │ │
│  │ • TCXDecoder/Encoder - TCX 文件处理                     │ │
│  │ • SportProcessor - 统一格式转换处理                      │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  🔄 转换引擎                                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ • GPXToSportConverter - GPX → SportFileType            │ │
│  │ • FITToSportConverter - FIT → SportFileType            │ │
│  │ • TCXToSportConverter - TCX → SportFileType            │ │
│  │ • SportToGPXEncoder - SportFileType → GPX              │ │
│  │ • SportToFITEncoder - SportFileType → FIT              │ │
│  │ • SportToTCXEncoder - SportFileType → TCX              │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  🎯 统一接口                                                │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ • 自动格式检测                                           │ │
│  │ • 统一解析方法                                           │ │
│  │ • 统一转换方法                                           │ │
│  │ • 生命周期管理                                           │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔍 支持的格式

### GPX (GPS Exchange Format)
- ✅ GPX 1.1 标准
- ✅ 航路点 (Waypoints)
- ✅ 路线 (Routes) 
- ✅ 轨迹 (Tracks)
- ✅ 元数据 (Metadata)
- ✅ 扩展属性

### FIT (Flexible and Interoperable Data Transfer)
- ✅ Activity 文件
- ✅ Course 文件
- ✅ 轨迹点数据
- ✅ 心率、速度、海拔等传感器数据
- ✅ Garmin 设备兼容

### TCX (Training Center XML)
- ✅ 训练数据
- ✅ 运动轨迹
- ✅ 心率区间
- ✅ 圈速数据
- ✅ Garmin Connect 兼容

## 🛠️ 开发指南

### 环境要求

- Node.js >= 16
- TypeScript >= 4.5

### 项目结构

```
src/
├── TrackSwap.ts          # 主入口类
├── GPX/                  # GPX 模块
│   ├── decoder.ts
│   ├── encoder.ts
│   └── types.ts
├── FIT/                  # FIT 模块
│   ├── decoder.ts
│   ├── encoder.ts
│   └── types.ts
├── TCX/                  # TCX 模块
│   ├── decoder.ts
│   ├── encoder.ts
│   └── types.ts
├── sport/                # 统一转换模块
│   ├── processor.ts
│   ├── converters.ts
│   ├── encoders.ts
│   └── base.ts
└── types.ts              # 公共类型定义
```

### 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 发起 Pull Request

## 📄 许可证

MIT License

## 🙏 致谢

感谢所有贡献者和开源社区的支持！

---

<div align="center">
  <strong>TrackSwap - 让轨迹数据处理变得简单</strong><br>
  🚀 高效 • 🔄 统一 • 🛡️ 安全 • 📈 可扩展
</div> 