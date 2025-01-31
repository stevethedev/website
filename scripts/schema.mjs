#!/usr/bin/env node

import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { exit } from "node:process";
import { fileURLToPath } from "node:url";
import {
  InputData,
  JSONSchemaInput,
  quicktype as quicktypeCore,
} from "quicktype-core";
import { Project } from "ts-morph";

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

/**
 * Get the path to the TypeScript directory
 * @param fp {...string[]}
 * @returns {string}
 */
function tsDir(...fp) {
  return baseDir("web", "src", "schema", ...fp);
}

/**
 * Get the path to the Rust directory
 * @param fp {...string[]}
 * @returns {string}
 */
function rsDir(...fp) {
  return baseDir("api", "src", "schema", ...fp);
}

/**
 * Get the path to the schema directory
 * @param fp {...string[]}
 * @returns {string}
 */
function schemaDir(...fp) {
  return baseDir("schema", ...fp);
}

/**
 * Get the base directory
 * @param fp {...string[]}
 * @returns {string}
 */
function baseDir(...fp) {
  const dir = fileURLToPath(new URL("..", import.meta.url));
  return resolve(dir, ...fp);
}

/**
 * Get all the JSON files in the given path
 * @param path {string} Path to the directory
 * @returns {Promise<Array<Record<"file"|"rsName"|"tsName", string> & {jsonFiles: string[]}>>}
 */
async function getBuildComponents(path) {
  const files = await readdir(path);
  /** @type {string[]} */
  const jsonFiles = files.filter((file) => file.endsWith(".json"));

  return jsonFiles.map((file) => {
    const basename = file.replace(/\.json$/, "");
    const rsName = processCase(basename, "_");
    const tsName = processCase(basename, "-");
    return {
      file,
      rsName,
      tsName,
      jsonFiles: jsonFiles.filter((jsonFile) => jsonFile !== file),
    };
  });
}

/**
 * Process the case of the string
 * @param str {string} The string to process
 * @param delim {string} The delimiter to use
 * @returns {string}
 */
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
 * @param jsonFiles {string[]}
 * @returns {Promise<void>}
 */
async function processSchema({ file, rsName, tsName, jsonFiles }) {
  const schemaFile = schemaDir(file);
  const jsonSchemaFiles = jsonFiles.map((jsonFile) => schemaDir(jsonFile));
  await ts(schemaFile, tsDir(`${tsName}.ts`), jsonSchemaFiles);
  await rs(schemaFile, rsDir(`${rsName}.rs`), jsonSchemaFiles);
}

/**
 * Generate TypeScript types
 * @param srcJson {string}
 * @param outFile {string}
 * @param jsonFiles {string[]}
 * @returns {Promise<void>}
 */
async function ts(srcJson, outFile, jsonFiles) {
  await quicktype("typescript", srcJson, outFile, jsonFiles, {
    "no-just-types": true,
    "nice-property-names": true,
    "no-explicit-unions": true,
    "runtime-typecheck": true,
    "no-runtime-typecheck-ignore-unknown-properties": true,
    "acronym-style": "original",
    converters: "all-objects",
    "raw-type": "json",
    "no-prefer-unions": true,
    "no-prefer-types": true,
    "no-prefer-const-values": true,
    readonly: true,
  });

  await patchTsFile(outFile);
}

/**
 * Generate Rust types
 * @param srcJson {string}
 * @param outFile {string}
 * @param jsonFiles {string[]}
 * @returns {Promise<void>}
 */
async function rs(srcJson, outFile, jsonFiles) {
  await quicktype("rust", srcJson, outFile, jsonFiles, {
    density: "normal",
    visibility: "crate",
    "derive-debug": true,
    "derive-clone": true,
    "derive-partial-eq": true,
    edition: "2018",
    "leading-comments": true,
    "no-skip-serializing-none": true,
  });
}

/**
 * Run the quicktype command
 * @param targetLanguage {string}
 * @param srcJson {string}
 * @param outFile {string}
 * @param jsonFiles {string[]}
 * @param options {Partial<import("quicktype-core").Options>}
 * @returns {Promise<void>}
 */
async function quicktype(
  targetLanguage,
  srcJson,
  outFile,
  jsonFiles,
  rendererOptions,
) {
  const schema = await readFile(srcJson, "utf-8");
  const jsonSchemaInput = new JSONSchemaInput(undefined);
  const name = basename(srcJson, ".json");
  await jsonSchemaInput.addSource({ name, schema });

  const inputData = new InputData();
  inputData.addInput(jsonSchemaInput);

  const result = await quicktypeCore({
    inputData,
    lang: targetLanguage,
    rendererOptions,
  });

  console.log(`Writing ${outFile}`);
  await writeFile(outFile, result.lines.join("\n"));
}

async function patchTsFile(outFile) {
  // Initialize the project
  const project = new Project();

  // Add the source file to the project
  const sourceFile = project.addSourceFileAtPath(outFile);

  // Find the Convert class
  const convertClass = sourceFile.getClassOrThrow("Convert");

  const { methods } = convertClass.getStructure();

  for (const method of methods) {
    if (method.name.startsWith("to")) {
      convertClass.addMethod({
        ...method,
        name: `${method.name}Array`,
        returnType: `${method.returnType}[]`,
        statements: `return cast(JSON.parse(json), a(r("${method.returnType}")));`,
      });
    }

    if (method.name.endsWith("ToJson")) {
      convertClass.addMethod({
        ...method,
        name: method.name.replace(/ToJson$/, "ArrayToJson"),
        parameters: [{ name: "value", type: `${method.returnType}[]` }],
        returnType: "string",
        statements: `return JSON.stringify(uncast(value, a(r("${method.returnType}"))), null, 2);`,
      });
    }
  }

  // Save the changes
  sourceFile.saveSync();
}
