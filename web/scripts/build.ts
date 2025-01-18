import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { URL, fileURLToPath } from "node:url";
import { build } from "esbuild";

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

async function main(): Promise<void> {
  await build({
    entryPoints: await getEntryPoints(),
    bundle: true,
    minify: true,
    sourcemap: true,
    outdir: getFilePath("dist"),
    platform: "browser",
    target: "es2015",
  });
}

async function getEntryPoints(): Promise<string[]> {
  const entryPointsDir = getFilePath("src", "entry-points");
  const entryPointsFiles = await readdir(entryPointsDir);
  return entryPointsFiles.map((file) => join(entryPointsDir, file));
}

function getFilePath(...fp: string[]): string {
  const baseUrl = new URL(join("..", ...fp), import.meta.url);
  return fileURLToPath(baseUrl);
}
