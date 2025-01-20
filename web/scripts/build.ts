import { copyFile, mkdir, readdir } from "node:fs/promises";
import { join, basename, extname } from "node:path";
import { URL, fileURLToPath } from "node:url";
import { build } from "esbuild";

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

async function main(): Promise<void> {
  const entryPoints = await getEntryPoints();

  const buildPromises = entryPoints.map(async (entryPoint) => {
    const appName = basename(entryPoint, extname(entryPoint));

    await mkdir(getFilePath("dist", appName), { recursive: true });

    await copyFiles(getFilePath("resource"), getFilePath("dist", appName));

    await build({
      entryPoints: [entryPoint],
      bundle: true,
      minify: true,
      sourcemap: false,
      outfile: getFilePath("dist", appName, "app.js"),
      platform: "browser",
      target: "es2015",
    });
  });

  await Promise.all(buildPromises);
}

/**
 * Copy files from srcDir to destDir
 * @param srcDir
 * @param destDir
 */
async function copyFiles(srcDir: string, destDir: string): Promise<void> {
  const files = await readdir(srcDir);
  const copyPromises = files.map(async (file) => {
    await copyFile(join(srcDir, file), join(destDir, file));
  });

  await Promise.all(copyPromises);
}

/**
 * Get all entry points from src/entry-points
 */
async function getEntryPoints(): Promise<string[]> {
  const entryPointsDir = getFilePath("src", "entry-points");
  const entryPointsFiles = await readdir(entryPointsDir);
  return entryPointsFiles.map((file) => join(entryPointsDir, file));
}

/**
 * Get file path from NPM project root
 * @param fp
 */
function getFilePath(...fp: string[]): string {
  const baseUrl = new URL(join("..", ...fp), import.meta.url);
  return fileURLToPath(baseUrl);
}
