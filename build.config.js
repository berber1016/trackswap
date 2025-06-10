import { build } from "esbuild";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";
const format = process.env.FORMAT || "esm";

const baseConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node14",
  external: Object.keys(pkg.dependencies || {}),
  metafile: true,
  logLevel: "info",
};

// ESM configuration
const esmConfig = {
  ...baseConfig,
  format: "esm",
  outfile: "dist/index.js",
};

// CommonJS configuration
const cjsConfig = {
  ...baseConfig,
  format: "cjs",
  outfile: "dist/index.cjs",
};

const productionConfig = {
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
  minify: false,
  define: {
    "process.env.NODE_ENV": '"development"',
  },
  sourcemap: true,
};

async function buildProject() {
  try {
    const envConfig = isProduction ? productionConfig : developmentConfig;
    const formatConfig = format === "cjs" ? cjsConfig : esmConfig;
    const config = { ...formatConfig, ...envConfig };

    console.log(
      `🔨 Build mode: ${isProduction ? "Production" : "Development"}`
    );
    console.log(`📦 Format: ${format.toUpperCase()}`);
    console.log(`📦 Minify: ${config.minify ? "✅" : "❌"}`);
    console.log(`🗺️  Source Map: ${config.sourcemap ? "✅" : "❌"}`);

    const result = await build(config);

    if (result.metafile) {
      const analysis = await import("esbuild").then((m) =>
        m.analyzeMetafile(result.metafile)
      );
      console.log(`\n📊 Build analysis (${format.toUpperCase()}):\n`, analysis);
    }

    console.log(`✅ Build completed (${format.toUpperCase()})!`);
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

buildProject();
