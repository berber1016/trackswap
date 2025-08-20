# TrackSwap - Multi-Format Track Processing Library

A powerful multi-format track file processing library that supports parsing, encoding, and format conversion for GPX, FIT, and TCX files.

---

**🌐 Language / 语言**: [English](README_EN.md) | [中文](README.md)

---

## 🚀 Features

- 🔄 **Multi-Format Support**: GPX 1.1, FIT, TCX formats
- 🎯 **Unified Conversion**: Convert between any formats  
- 🤖 **Auto-Detection**: Intelligently identify file formats
- 🔧 **Plugin Architecture**: Extensible plugin-based design
- 🛡️ **Type Safety**: Complete TypeScript support
- ⚡ **High Performance**: Optimized parsing and encoding algorithms

## 📦 Installation

```bash
npm install trackswap
```

## 🎯 Quick Start

### Basic Usage

```typescript
import { TrackSwap } from 'trackswap';
import fs from 'fs';

const trackSwap = new TrackSwap();

// Parse GPX file
const gpxBuffer = fs.readFileSync('track.gpx');
const gpxData = await trackSwap.parseGPX(gpxBuffer);

// Parse FIT file
const fitBuffer = fs.readFileSync('activity.fit');
const fitData = await trackSwap.parseFIT(fitBuffer);

// Parse TCX file
const tcxBuffer = fs.readFileSync('workout.tcx');
const tcxData = await trackSwap.parseTCX(tcxBuffer);
```

### Format Conversion

```typescript
// 🔄 Auto-detect format and convert
const gpxBuffer = await trackSwap.convertFile(anyBuffer, 'gpx');
const fitBuffer = await trackSwap.convertFile(anyBuffer, 'fit');
const tcxBuffer = await trackSwap.convertFile(anyBuffer, 'tcx');

// 🎯 Specify source format for better performance
const convertedBuffer = await trackSwap.convertFile(
  sourceBuffer, 
  'fit',      // target format
  'gpx'       // source format (optional)
);
```

### Auto Parsing

```typescript
// 🤖 Auto-detect format and parse
const parsedData = await trackSwap.parseFile(buffer);

// 🏃‍♂️ Parse and convert to unified sport data format
const sportData = await trackSwap.parseToActivity(buffer);
```

## 📖 Detailed Usage Guide

### 1. File Parsing

#### GPX File Processing

```typescript
// Parse from Buffer
const gpxData = await trackSwap.parseGPX(buffer);

// Parse from string
const gpxData = await trackSwap.parseGPXString(xmlString);

// Encode to Buffer
const buffer = await trackSwap.encodeGPX(gpxData);

// Encode to string
const xmlString = trackSwap.encodeGPXString(gpxData);
```

#### FIT File Processing

```typescript
// Parse FIT file
const fitData = await trackSwap.parseFIT(buffer);

// Encode to Activity file
const activityBuffer = await trackSwap.encodeFIT(fitData);

// Encode to Course file
const courseBuffer = await trackSwap.encodeFITCourse(fitData);
```

#### TCX File Processing

```typescript
// Parse from Buffer
const tcxData = await trackSwap.parseTCX(buffer);

// Parse from string
const tcxData = await trackSwap.parseTCXString(xmlString);

// Encode to Buffer
const buffer = await trackSwap.encodeTCX(tcxData);

// Encode to string
const xmlString = await trackSwap.encodeTCXString(tcxData);
```

### 2. Format Conversion

#### Unified Conversion Method

```typescript
// 🔄 Auto-detect and convert
const result = await trackSwap.convertFile(sourceBuffer, 'gpx');

// 🎯 Specify format conversion
const result = await trackSwap.convertFile(sourceBuffer, 'fit', 'gpx');

// 📊 Supported conversion combinations
// GPX ↔ FIT ↔ TCX (convert between any formats)
```

#### ActivityType Unified Format

```typescript
// Convert to unified sport data format
const gpxActivity = await trackSwap.convertGPXToActivity(gpxData);
const fitActivity = await trackSwap.convertFITToActivity(fitData);
const tcxActivity = await trackSwap.convertTCXToActivity(tcxData);

// Convert from unified format back to specific formats
const gpxData = await trackSwap.convertActivityToGPX(sportData);
const fitData = await trackSwap.convertActivityToFIT(sportData);
const tcxData = await trackSwap.convertActivityToTCX(sportData);
```

### 3. Smart Parsing

```typescript
// 🤖 Auto-detect format
const format = trackSwap.detectFormat(buffer);
console.log(`Detected format: ${format}`); // 'gpx' | 'fit' | 'tcx' | 'unknown'

// 📂 Unified parsing method
const parsedData = await trackSwap.parseFile(buffer);
const parsedData = await trackSwap.parseFile(buffer, 'gpx'); // specify format

// 🏃‍♂️ Parse to unified format
const sportData = await trackSwap.parseToActivity(buffer);
const sportData = await trackSwap.parseToActivity(buffer, 'fit'); // specify format
```

## 🔧 API Reference

### TrackSwap Class

#### Parsing Methods

| Method | Description | Parameters | Return Value |
|--------|-------------|------------|--------------|
| `parseGPX(buffer)` | Parse GPX Buffer | `Buffer` | `Promise<GPX11Type \| undefined>` |
| `parseGPXString(xml)` | Parse GPX string | `string` | `Promise<GPX11Type \| undefined>` |
| `parseFIT(buffer)` | Parse FIT Buffer | `Buffer` | `Promise<FITFileType>` |
| `parseTCX(buffer)` | Parse TCX Buffer | `Buffer` | `Promise<TCXFileType>` |
| `parseTCXString(xml)` | Parse TCX string | `string` | `Promise<TCXFileType>` |
| `parseFile(buffer, type?)` | Unified parsing method | `Buffer, string?` | `Promise<GPX11Type \| FITFileType \| TCXFileType>` |
| `parseToActivity(buffer, type?)` | Parse to unified format | `Buffer, string?` | `Promise<ActivityType>` |

#### Encoding Methods

| Method | Description | Parameters | Return Value |
|--------|-------------|------------|--------------|
| `encodeGPX(data)` | Encode GPX to Buffer | `GPX11Type` | `Promise<Buffer>` |
| `encodeGPXString(data)` | Encode GPX to string | `GPX11Type` | `string` |
| `encodeFIT(data)` | Encode FIT to Buffer | `FITFileType` | `Promise<Buffer>` |
| `encodeFITCourse(data)` | Encode FIT Course | `FITFileType` | `Promise<Buffer>` |
| `encodeTCX(data)` | Encode TCX to Buffer | `TCXFileType` | `Promise<Buffer>` |
| `encodeTCXString(data)` | Encode TCX to string | `TCXFileType` | `Promise<string>` |

#### Conversion Methods

| Method | Description | Parameters | Return Value |
|--------|-------------|------------|--------------|
| `convertFile(buffer, target, source?)` | Unified conversion method | `Buffer, string, string?` | `Promise<Buffer>` |
| `convertGPXToActivity(data)` | GPX → Activity | `GPX11Type` | `Promise<ActivityType>` |
| `convertFITToActivity(data)` | FIT → Activity | `FITFileType` | `Promise<ActivityType>` |
| `convertTCXToActivity(data)` | TCX → Activity | `TCXFileType` | `Promise<ActivityType>` |
| `convertActivityToGPX(data)` | Activity → GPX | `ActivityType` | `Promise<GPX11Type>` |
| `convertActivityToFIT(data)` | Activity → FIT | `ActivityType` | `Promise<FITFileType>` |
| `convertActivityToTCX(data)` | Activity → TCX | `ActivityType` | `Promise<TCXFileType>` |

#### Utility Methods

| Method | Description | Parameters | Return Value |
|--------|-------------|------------|--------------|
| `detectFormat(buffer)` | Detect file format | `Buffer` | `'gpx' \| 'fit' \| 'tcx' \| 'unknown'` |
| `getActivityProcessor()` | Get sport processor | - | `ActivityProcessor` |
| `destroy()` | Clean up resources | - | `Promise<void>` |

## 🌟 Real-World Examples

### Batch Format Conversion

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
      
      // 🔄 Auto-detect and convert
      const converted = await trackSwap.convertFile(buffer, outputFormat);
      
      const outputPath = path.join(inputDir, 
        `${path.parse(file).name}.${outputFormat}`);
      fs.writeFileSync(outputPath, converted);
      
      console.log(`✅ Conversion complete: ${file} → ${outputFormat}`);
    } catch (error) {
      console.error(`❌ Conversion failed: ${file}`, error);
    }
  }
  
  await trackSwap.destroy();
}

// Usage example
await batchConvert('./tracks', 'gpx');
```

### Track Data Analysis

```typescript
async function analyzeTrack(buffer: Buffer) {
  const trackSwap = new TrackSwap();
  
  // 🔍 Detect format
  const format = trackSwap.detectFormat(buffer);
  console.log(`File format: ${format}`);
  
  // 📊 Convert to unified format for analysis
  const sportData = await trackSwap.parseToActivity(buffer);
  
  // Analyze data
  const analysis = {
    totalDistance: sportData.summary?.totalDistance || 0,
    totalTime: sportData.summary?.totalTime || 0,
    avgSpeed: sportData.summary?.avgSpeed || 0,
    maxSpeed: sportData.summary?.maxSpeed || 0,
    trackPoints: sportData.tracks?.[0]?.segments?.[0]?.points?.length || 0
  };
  
  console.log('Track analysis results:', analysis);
  
  await trackSwap.destroy();
  return analysis;
}
```

### Multi-Format Data Fusion

```typescript
async function mergeMultiFormatTracks(files: { buffer: Buffer, name: string }[]) {
  const trackSwap = new TrackSwap();
  const allActivityData: ActivityType[] = [];
  
  // 🔄 Convert all formats to unified format
  for (const file of files) {
    try {
      const sportData = await trackSwap.parseToActivity(file.buffer);
      sportData.metadata = { ...sportData.metadata, originalFile: file.name };
      allActivityData.push(sportData);
    } catch (error) {
      console.error(`Parsing failed: ${file.name}`, error);
    }
  }
  
  // Data fusion logic
  const mergedData = mergeActivityData(allActivityData);
  
  // Output to different formats
  const results = {
    gpx: await trackSwap.convertActivityToGPX(mergedData),
    fit: await trackSwap.convertActivityToFIT(mergedData),
    tcx: await trackSwap.convertActivityToTCX(mergedData)
  };
  
  await trackSwap.destroy();
  return results;
}
```

## 🏗️ Architecture Design

TrackSwap adopts a modular architecture with core components including:

```
┌─────────────────────────────────────────────────────────────┐
│                    TrackSwap Architecture                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔧 Core Processing Modules                                 │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ • GPXDecoder/Encoder - GPX file processing              │ │
│  │ • FITDecoder/Encoder - FIT file processing              │ │
│  │ • TCXDecoder/Encoder - TCX file processing              │ │
│  │ • ActivityProcessor - Unified format conversion            │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  🔄 Conversion Engine                                       │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ • GPXToActivityConverter - GPX → ActivityType            │ │
│  │ • FITToActivityConverter - FIT → ActivityType            │ │
│  │ • TCXToActivityConverter - TCX → ActivityType            │ │
│  │ • ActivityToGPXEncoder - ActivityType → GPX              │ │
│  │ • ActivityToFITEncoder - ActivityType → FIT              │ │
│  │ • ActivityToTCXEncoder - ActivityType → TCX              │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
│  🎯 Unified Interface                                       │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ • Auto format detection                                 │ │
│  │ • Unified parsing methods                               │ │
│  │ • Unified conversion methods                            │ │
│  │ • Lifecycle management                                  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔍 Supported Formats

### GPX (GPS Exchange Format)
- ✅ GPX 1.1 standard
- ✅ Waypoints
- ✅ Routes
- ✅ Tracks
- ✅ Metadata
- ✅ Extensions

### FIT (Flexible and Interoperable Data Transfer)
- ✅ Activity files
- ✅ Course files
- ✅ Track point data
- ✅ Heart rate, speed, altitude and other sensor data
- ✅ Garmin device compatibility

### TCX (Training Center XML)
- ✅ Training data
- ✅ Exercise tracks
- ✅ Heart rate zones
- ✅ Lap data
- ✅ Garmin Connect compatibility

## 🛠️ Development Guide

### Requirements

- Node.js >= 16
- TypeScript >= 4.5

### Project Structure

```
src/
├── TrackSwap.ts          # Main entry class
├── GPX/                  # GPX module
│   ├── decoder.ts
│   ├── encoder.ts
│   └── types.ts
├── FIT/                  # FIT module
│   ├── decoder.ts
│   ├── encoder.ts
│   └── types.ts
├── TCX/                  # TCX module
│   ├── decoder.ts
│   ├── encoder.ts
│   └── types.ts
├── sport/                # Unified conversion module
│   ├── processor.ts
│   ├── converters.ts
│   ├── encoders.ts
│   └── base.ts
└── types.ts              # Common type definitions
```

### Contributing Guidelines

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Create a Pull Request

## 📄 License

MIT License

## 🙏 Acknowledgments

Thanks to all contributors and the open source community for their support!

---

<div align="center">
  <strong>TrackSwap - Making Track Data Processing Simple</strong><br>
  🚀 Efficient • 🔄 Unified • 🛡️ Secure • 📈 Scalable
</div> 