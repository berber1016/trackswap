import { BaseFITMiddleware } from "./base.js";
import { FITDecoderMesgs, FITFileType, FITContext } from "./types.js";

// ============ 示例中间件 ============

/**
 * 性能监控中间件
 */
export class PerformanceMiddleware extends BaseFITMiddleware {
  name = "performance-middleware";
  description = "监控FIT解析性能";

  async onParse(buffer: Buffer, context: FITContext): Promise<Buffer> {
    console.log(`🔧 开始解析FIT文件，大小: ${buffer.length} bytes`);
    return buffer;
  }

  async onExtractMessages(
    messages: FITDecoderMesgs,
    context: FITContext
  ): Promise<FITDecoderMesgs> {
    const messageCount = this.countMessages(messages);
    console.log(`📋 消息提取完成，包含 ${messageCount} 条消息`);

    // 显示消息类型统计
    const messageTypes = Object.keys(messages).filter(
      (key) => Array.isArray(messages[key]) && messages[key]!.length > 0
    );
    console.log(`   消息类型: ${messageTypes.join(", ")}`);

    return messages;
  }

  async onStructure(
    result: Partial<FITFileType>,
    context: FITContext
  ): Promise<Partial<FITFileType>> {
    const structureInfo = this.analyzeStructure(result);
    console.log(`🏗️ 数据结构化完成: ${structureInfo}`);
    return result;
  }

  async onComplete(
    result: FITFileType,
    context: FITContext
  ): Promise<FITFileType> {
    const performance = context.metadata.get("performance");
    console.log("⚡ FIT解析性能统计:", performance);

    // 显示最终结果统计
    console.log(`✅ 解析完成: ${this.getSummary(result)}`);
    return result;
  }

  async onError(error: Error, context: FITContext): Promise<void> {
    console.error(`❌ FIT解析出错: ${error.message}`);
    console.error(`   错误详情:`, error.stack);
  }

  private countMessages(messages: FITDecoderMesgs): number {
    let count = 0;
    Object.values(messages).forEach((messageArray) => {
      if (Array.isArray(messageArray)) {
        count += messageArray.length;
      }
    });
    return count;
  }

  private analyzeStructure(result: Partial<FITFileType>): string {
    const parts: string[] = [];

    if (result.sessionMesgs?.length) {
      parts.push(`${result.sessionMesgs.length} sessions`);
    }
    if (result.fileIdMesgs?.length) {
      parts.push(`文件ID`);
    }
    if (result.eventMesgs?.length) {
      parts.push(`${result.eventMesgs.length} events`);
    }

    return parts.join(", ") || "无结构化数据";
  }

  private getSummary(result: FITFileType): string {
    const parts: string[] = [];

    if (result.sessionMesgs?.length) {
      parts.push(`${result.sessionMesgs.length}个会话`);
    }
    if (result.fileIdMesgs?.length) {
      const fileId = result.fileIdMesgs[0];
      parts.push(`类型:${fileId.type}, 厂商:${fileId.manufacturer}`);
    }

    return parts.join(", ") || "空结果";
  }
}

/**
 * 数据验证中间件
 */
export class ValidationMiddleware extends BaseFITMiddleware {
  name = "validation-middleware";
  description = "验证FIT数据的完整性";

  async onComplete(
    result: FITFileType,
    context: FITContext
  ): Promise<FITFileType> {
    const errors = this.validateFIT(result);
    if (errors.length > 0) {
      console.warn("🚨 FIT验证发现问题:", errors);
      context.metadata.set("validation-errors", errors);

      // 将验证错误添加到上下文
      errors.forEach((error) => context.warnings.push(error));
    } else {
      console.log("✅ FIT数据验证通过");
    }
    return result;
  }

  private validateFIT(fit: FITFileType): string[] {
    const errors: string[] = [];

    // 验证文件ID
    if (!fit.fileIdMesgs || fit.fileIdMesgs.length === 0) {
      errors.push("缺少文件ID信息");
    } else {
      const fileId = fit.fileIdMesgs[0];
      if (!fileId.type) {
        errors.push("文件类型未指定");
      }
      if (!fileId.manufacturer) {
        errors.push("制造商信息缺失");
      }
    }

    // 验证会话数据
    if (fit.sessionMesgs && fit.sessionMesgs.length > 0) {
      fit.sessionMesgs.forEach((session, index) => {
        if (!session.startTime) {
          errors.push(`会话 ${index + 1} 缺少开始时间`);
        }
        if (!session.timestamp) {
          errors.push(`会话 ${index + 1} 缺少结束时间`);
        }
        if (session.totalTimerTime === undefined) {
          errors.push(`会话 ${index + 1} 缺少计时时间`);
        }
      });
    }

    return errors;
  }
}

/**
 * 数据清理中间件
 */
export class DataCleanupMiddleware extends BaseFITMiddleware {
  name = "data-cleanup-middleware";
  description = "清理和优化FIT数据";

  async onStructure(
    result: Partial<FITFileType>,
    context: FITContext
  ): Promise<Partial<FITFileType>> {
    // 清理空数组和无效数据
    return this.cleanupData(result);
  }

  private cleanupData(result: Partial<FITFileType>): Partial<FITFileType> {
    const cleaned = { ...result };

    // 移除空数组
    Object.keys(cleaned).forEach((key) => {
      const value = (cleaned as any)[key];
      if (Array.isArray(value) && value.length === 0) {
        delete (cleaned as any)[key];
      }
    });

    // 清理会话数据中的无效值
    if (cleaned.sessionMesgs) {
      cleaned.sessionMesgs = cleaned.sessionMesgs.filter(
        (session) => session.startTime && session.timestamp
      );
    }

    console.log("🧹 数据清理完成");
    return cleaned;
  }
}

/**
 * 文件信息提取中间件
 */
export class FileInfoMiddleware extends BaseFITMiddleware {
  name = "file-info-middleware";
  description = "提取和显示文件基本信息";

  async onExtractMessages(
    messages: FITDecoderMesgs,
    context: FITContext
  ): Promise<FITDecoderMesgs> {
    this.extractFileInfo(messages, context);
    return messages;
  }

  private extractFileInfo(
    messages: FITDecoderMesgs,
    context: FITContext
  ): void {
    if (messages.fileIdMesgs && messages.fileIdMesgs.length > 0) {
      const fileId = messages.fileIdMesgs[0];

      const fileInfo = {
        type: fileId.type,
        manufacturer: fileId.manufacturer,
        product: fileId.product,
        serialNumber: fileId.serialNumber,
        timeCreated: fileId.timeCreated,
      };

      context.metadata.set("file-info", fileInfo);

      console.log("📄 文件信息:", {
        类型: fileInfo.type,
        制造商: fileInfo.manufacturer,
        产品: fileInfo.product,
        序列号: fileInfo.serialNumber,
        创建时间: fileInfo.timeCreated,
      });
    }
  }
}

// ============ 默认中间件注册函数 ============

/**
 * 注册所有默认中间件
 */
export async function registerDefaultMiddlewares(decoder: any): Promise<void> {
  const middlewares = [
    new PerformanceMiddleware(),
    new ValidationMiddleware(),
    new DataCleanupMiddleware(),
    new FileInfoMiddleware(),
  ];

  for (const middleware of middlewares) {
    await decoder.registerMiddleware(middleware);
  }
}
