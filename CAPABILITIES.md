# TrackSwap 能力范围与限制

本文说明本库在 **解析 / 互转** 上实际覆盖的内容，以及「未承诺」部分，避免与产品目标（多格式、多运动）产生期望偏差。

## 支持的文件格式

| 格式 | 解析 | 编码 | 说明 |
|------|------|------|------|
| FIT | 是 | 是 | 活动型 FIT 以 session / lap / record 为主；课程型见下 |
| GPX 1.1 | 是 | 是 | 以 `trk` / `wpt` / `rte` 与常用扩展为主 |
| TCX | 是 | 是 | Training Center Database v2 子集；`Activities` 与 `Courses`（课程路线）可解析并写回 `Courses` |

不内置：KML、GeoJSON、其他厂商二进制等。若需扩展，应实现 `TrackFormatAdapter`，并把领域数据映射到统一 activity / health facet。

## FIT 子类型

- **活动（activity）**：含 `session` 的 FIT 会进入 `document.facets.activity`。
- **全天健康（health）**：Monitoring、睡眠、压力、呼吸、Pulse Ox、Body Battery、HRV 等进入 `document.facets.health`。
- **混合文件**：FIT 只解码一次，activity 与 health facet 可同时存在。
- **课程（course）**：解析侧可通过 `courseMesgs` 进入 `FileType.routes`；标准 course 文件使用 `TrackSwap.encodeCourse`。
- **Workout / 设备设置**：可参与文件种类识别，但尚未提供独立规范化 facet。

## TCX 子集

- **Activities → Activity**：已支持常见 Lap / Track / Trackpoint。
- **Courses → routes**：顶层 `Courses/Course` 会进入 `FileType.routes`；编码时 `routes` 再输出为 `Courses`（`Name`、`Track`、含 `Track` 的 `Lap`、以及 `CoursePoint` 子集）。**Folders** 下的课程列表未统一归并。
- **Workouts、Folders/History、Training、Creator**：编码侧多为占位或未实现，不宜假设完整往返。

## 运动类型（sport）

- FIT 的 `sport` / `subSport` 会进入统一模型；导出 GPX/TCX 时，TCX 的 `Activity` 属性目前主要映射为 `Running` / `Biking` / `Other`，其余运动可能归为 `Other`。
- **游泳、室内、无 GPS**：数据可解析；GPX 轨迹依赖经纬度，无坐标点会被省略并在 metadata 中说明（若使用当前 GPX 编码策略）。

## 数据完整性

- **开发者字段 / 厂商扩展**：可通过 FIT 选项保留在诊断信息中，但不保证全部投影到规范化 facet。
- **原生结构**：`decode()` 默认不返回；需要协议级检查时使用 `includeNative: true`。
- **同格式转换**：`transcode()` 在源格式与目标格式相同时返回原 Buffer，不做规范化。

## 自动化测试

- 坐标与 FIT 半圆换算：`npm run test:fit-coords`
- TCX Courses 冒烟：`npm run test:tcx-course`
- 仅路线 → 活动 FIT：`npm run test:routes-fit`
- façade、适配器、检测和转换：`npm run test:architecture`
- FIT 健康与活动 facet：`npm run test:health`
- 更多场景依赖样例文件回归，见 `scripts/` 下验证脚本。
