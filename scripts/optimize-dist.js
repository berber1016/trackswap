import { promises as fs } from "fs";
import path from "path";

const DIST_DIR = "dist";
const KEEP_FILES = [
  "index.js",
  "index.cjs",
  "index.d.ts",
  "TrackSwap.d.ts",
  "document.d.ts",
  "errors.d.ts",
  "types.d.ts",
  "util.d.ts",
  "fit-debug.d.ts",
];

const KEEP_DIRECTORIES = [
  "GPX",
  "FIT",
  "TCX",
  "activity",
  "sport",
  "core",
];

async function optimizeDist() {
  try {
    console.log("🧹 开始优化 dist 目录...");

    // 读取 dist 目录内容
    const distContent = await fs.readdir(DIST_DIR, { withFileTypes: true });

    let removedCount = 0;
    let keptCount = 0;

    for (const item of distContent) {
      const itemPath = path.join(DIST_DIR, item.name);

      if (item.isFile()) {
        if (KEEP_FILES.includes(item.name)) {
          console.log(`✅ 保留文件: ${item.name}`);
          keptCount++;
        } else {
          await fs.unlink(itemPath);
          console.log(`🗑️  删除文件: ${item.name}`);
          removedCount++;
        }
      } else if (item.isDirectory()) {
        if (KEEP_DIRECTORIES.includes(item.name)) {
          // 保留目录但清理其中的 .js 文件
          await cleanDirectory(itemPath);
          console.log(`📁 清理目录: ${item.name}`);
          keptCount++;
        } else {
          await fs.rm(itemPath, { recursive: true });
          console.log(`🗑️  删除目录: ${item.name}`);
          removedCount++;
        }
      }
    }

    console.log(`\n📊 优化完成:`);
    console.log(`   保留: ${keptCount} 项`);
    console.log(`   删除: ${removedCount} 项`);

    // 显示最终文件大小
    await showFinalStats();
  } catch (error) {
    console.error("❌ 优化失败:", error);
    process.exit(1);
  }
}

async function cleanDirectory(dirPath) {
  const items = await fs.readdir(dirPath, { withFileTypes: true });

  for (const item of items) {
    const itemPath = path.join(dirPath, item.name);

    if (item.isFile() && item.name.endsWith(".js")) {
      // 删除子目录中的 .js 文件
      await fs.unlink(itemPath);
    } else if (item.isDirectory()) {
      // 递归清理子目录
      await cleanDirectory(itemPath);
    }
  }
}

async function showFinalStats() {
  try {
    const stats = await fs.stat(path.join(DIST_DIR, "index.js"));
    const sizeInKB = (stats.size / 1024).toFixed(2);

    console.log(`\n📦 最终包大小: ${sizeInKB} KB`);

    const files = await fs.readdir(DIST_DIR, { recursive: true });
    console.log(`📄 文件总数: ${files.length}`);
  } catch (error) {
    console.log("ℹ️  无法获取统计信息");
  }
}

optimizeDist();
