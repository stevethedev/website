import { copyFile, mkdir, readdir } from "node:fs/promises";
import { join, basename, extname } from "node:path";
import { URL, fileURLToPath } from "node:url";
import * as process from "node:process";
import { command, run, flag, number, option } from "cmd-ts";
import { context } from "esbuild";

run(
  command({
    name: "build",
    args: {
      serve: flag({
        description: "Serve the built files",
        defaultValue: () => false,
        long: "serve",
        short: "s",
      }),
      port: option({
        type: number,
        description: "Port to serve on",
        defaultValue: () => 8000,
        long: "port",
        short: "p",
      }),
    },
    async handler(args) {
      const entryPoints = await getEntryPoints();
      const namedEntryPoints = getNamedEntryPoints(entryPoints);
      const copiedFiles = Object.keys(namedEntryPoints).map(async (appName) => {
        await mkdir(getFilePath("dist", appName), { recursive: true });
        await copyFiles(getFilePath("resource"), getFilePath("dist", appName));
      });
      await Promise.all(copiedFiles);
      const ctx = await getBuildContext(namedEntryPoints);

      console.log(args);
      if (!args.serve) {
        await ctx.dispose();
        return;
      }
      const port = args.port;
      process.stdout.write(`Serving on http://localhost:${port}...\n`);
      await ctx.serve({
        servedir: getFilePath("dist"),
        port,
        onRequest: (args) => {
          process.stdout.write(
            `HTTP ${args.method} ${args.path} -> HTTP ${args.status} (${args.timeInMS}ms)\n`,
          );
        },
      });
    },
  }),
  process.argv.slice(2),
).catch((error) => {
  process.stderr.write(`Error: ${error.message}\n`);
  process.exit(1);
});

function getNamedEntryPoints(entryPoints: string[]): Record<string, string> {
  const entries = entryPoints.map((entryPoint) => {
    const appName = basename(entryPoint, extname(entryPoint));
    return [appName, entryPoint];
  });
  return Object.fromEntries(entries);
}

async function getBuildContext(namedEntryPoints: Record<string, string>) {
  const ctx = await context({
    entryPoints: Object.fromEntries(
      Object.entries(namedEntryPoints).map(([appName, entryPoint]) => {
        return [`${appName}/app`, entryPoint];
      }),
    ),
    bundle: true,
    minify: true,
    sourcemap: false,
    outdir: getFilePath("dist"),
    platform: "browser",
    target: "es2015",
  });

  process.stdout.write("Building...\n");
  await ctx.rebuild().then((result) => {
    result.errors.forEach((error) => {
      process.stderr.write(`Error: ${error.text}\n`);
    });
    result.warnings.forEach((warning) => {
      process.stderr.write(`Warning: ${warning.text}\n`);
    });
    process.stdout.write("Build complete\n");
  });

  return ctx;
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
