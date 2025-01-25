#!/usr/bin/env node

import { spawn } from "node:child_process";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { exit } from "node:process";

main().catch((err) => {
  console.error(err);
  exit(1);
});

async function main() {
  await cleanup();
  const schemas = await getBuildComponents("./schema");
  try {
    await Promise.all(schemas.map(processSchema));
    await createModFile(schemas);
  } catch (e) {
    await cleanup();
    console.error(e);
  }
}

async function cleanup() {
  await Promise.all(
    [rsDir(), tsDir()].map(async (dir) => {
      await rm(dir, { recursive: true }).catch((err) => {
        if (err.code !== "ENOENT") {
          throw err;
        }
      });

      await mkdir(dir, { recursive: true });
    }),
  );
}

/**
 * Generate the mod.rs file
 * @param schemas {Record<"file"|"rsName"|"tsName", string>[]}
 * @returns {Promise<void>}
 */
async function createModFile(schemas) {
  const modFile = schemas.map(({ rsName }) => `pub mod ${rsName};`).join("\n");
  await writeFile(rsDir("mod.rs"), modFile);
}

function tsDir(...fp) {
  return baseDir("web", "src", "schema", ...fp);
}

function rsDir(...fp) {
  return baseDir("api", "src", "schema", ...fp);
}

function schemaDir(...fp) {
  return baseDir("schema", ...fp);
}

function baseDir(...fp) {
  const dir = fileURLToPath(new URL("..", import.meta.url));
  return resolve(dir, ...fp);
}

/**
 * Get all the JSON files in the given path
 * @param path {string} Path to the directory
 * @returns {Promise<Record<"file"|"rsName"|"tsName", string>[]>}
 */
async function getBuildComponents(path) {
  const files = await readdir(path);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));

  return jsonFiles.map((file) => {
    const basename = file.replace(/\.json$/, "");
    const rsName = processCase(basename, "_");
    const tsName = processCase(basename, "-");
    return { file, rsName, tsName };
  });
}

function processCase(str, delim) {
  return (
    str
      // Add space between lowercase and uppercase letters
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      // Add space between lowercase letters and digits
      .replace(/([a-z])(\d)/g, "$1 $2")
      // Add space between digits and letters
      .replace(/(\d)([a-zA-Z])/g, "$1 $2")
      // Trim, convert to lowercase, and split by non-word characters
      .trim()
      .toLowerCase()
      .split(/\W+/)
      .join(delim)
  );
}

/**
 * Process the schema file
 * @param file {string}
 * @param rsName {string}
 * @param tsName {string}
 * @returns {Promise<void>}
 */
async function processSchema({ file, rsName, tsName }) {
  await ts(schemaDir(file), tsDir(`${tsName}.ts`));
  await rs(schemaDir(file), rsDir(`${rsName}.rs`));
}

async function ts(srcJson, outFile) {
  await quicktype("typescript", srcJson, outFile, [
    "--no-just-types",
    "--nice-property-names",
    "--no-explicit-unions",
    "--runtime-typecheck",
    "--no-runtime-typecheck-ignore-unknown-properties",
    "--acronym-style",
    "original",
    "--converters",
    "top-level",
    "--raw-type",
    "json",
    "--no-prefer-unions",
    "--no-prefer-types",
    "--no-prefer-const-values",
    "--readonly",
  ]);
}

async function rs(srcJson, outFile) {
  await quicktype("rust", srcJson, outFile, [
    "--density",
    "normal",
    "--visibility",
    "crate",
    "--derive-debug",
    "--derive-clone",
    "--derive-partial-eq",
    "--edition-2018",
    "--leading-comments",
    "--no-skip-serializing-none",
  ]);
}

async function quicktype(targetLanguage, srcJson, outFile, options) {
  await spawn(
    "npx",
    [
      "quicktype",
      "--src-lang",
      "schema",
      "--lang",
      targetLanguage,
      "--src",
      srcJson,
      "--out",
      outFile,
      ...options,
    ],
    { cwd: baseDir(), shell: true, stdio: "inherit" },
  );
}
