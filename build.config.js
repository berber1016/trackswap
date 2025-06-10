import { build } from "esbuild";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";

const baseConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node14",
  format: "esm",
  outfile: "dist/index.js",
  external: Object.keys(pkg.dependencies || {}),
  metafile: true,
  logLevel: "info",
};

const productionConfig = {
  ...baseConfig,
  minify: true,
  treeShaking: true,
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  drop: ["console", "debugger"],
  legalComments: "none",
  sourcemap: false,
};

const developmentConfig = {
  ...baseConfig,
  minify: false,
  define: {
    "process.env.NODE_ENV": '"development"',
  },
  sourcemap: true,
};

async function buildProject() {
  try {
    const config = isProduction ? productionConfig : developmentConfig;

    console.log(`🔨 构建模式: ${isProduction ? "Production" : "Development"}`);
    console.log(`📦 压缩代码: ${config.minify ? "✅" : "❌"}`);
    console.log(`🗺️  Source Map: ${config.sourcemap ? "✅" : "❌"}`);

    const result = await build(config);

    if (result.metafile) {
      const analysis = await import("esbuild").then((m) =>
        m.analyzeMetafile(result.metafile)
      );
      console.log("\n📊 构建分析:\n", analysis);
    }

    console.log("✅ 构建完成!");
  } catch (error) {
    console.error("❌ 构建失败:", error);
    process.exit(1);
  }
}

buildProject();
