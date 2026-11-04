import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";

const declaration = readFileSync("dist/index.d.ts", "utf8");
const healthDeclaration = readFileSync("dist/FIT/health.d.ts", "utf8");
const relativeImports = [
  ...declaration.matchAll(/from\s+["'](\.\/[^"']+)["']/g),
].map((match) => match[1]);

for (const specifier of relativeImports) {
  const declarationPath = `dist/${specifier.slice(2).replace(/\.js$/, ".d.ts")}`;
  assert.ok(
    existsSync(declarationPath),
    `Missing declaration referenced by dist/index.d.ts: ${declarationPath}`
  );
}

assert.match(
  healthDeclaration,
  /Only `valid` values are safe to use/,
  "Health declaration must document valid-value aggregation semantics"
);
assert.match(
  healthDeclaration,
  /UTC offset at `startTime`, in seconds; this is not a duration/,
  "Health declaration must document session offset units and semantics"
);
assert.match(
  healthDeclaration,
  /original FIT sentinel solely for diagnostics and round-trip audit/,
  "Health declaration must document raw sentinel handling"
);

const require = createRequire(import.meta.url);
const commonjs = require("../dist/index.cjs");
const esm = await import("../dist/index.js");
const methods = [
  "detect",
  "decode",
  "decodeActivity",
  "encodeActivity",
  "transcode",
  "encodeCourse",
  "dispose",
];

for (const module of [commonjs, esm]) {
  const instance = new module.TrackSwap();
  for (const method of methods) {
    assert.equal(typeof instance[method], "function", `Missing method: ${method}`);
  }
  assert.equal(instance.parseToActivity, undefined);
  assert.equal(instance.parseFITDocument, undefined);
  await instance.dispose();
}

console.log("TrackSwap package artifacts verified");
