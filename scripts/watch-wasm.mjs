import chokidar from "chokidar";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDir = path.resolve(__dirname, "..");
const watchedPaths = [
  path.resolve(frontendDir, "wasm/**/*.rs"),
  path.resolve(frontendDir, "wasm/Cargo.toml"),
];

let buildRunning = false;
let buildQueued = false;
let debounceTimer = null;

function scheduleBuild(reason) {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    void runBuild(reason);
  }, 250);
}

async function runBuild(reason) {
  if (buildRunning) {
    buildQueued = true;
    return;
  }

  buildRunning = true;
  console.log(`[wasm-watch] rebuild triggered by ${reason}`);

  try {
    await spawnBuild();
    console.log("[wasm-watch] rebuild completed");
  } catch (error) {
    console.error("[wasm-watch] rebuild failed");
    if (error instanceof Error) {
      console.error(error.message);
    }
  } finally {
    buildRunning = false;

    if (buildQueued) {
      buildQueued = false;
      scheduleBuild("queued changes");
    }
  }
}

function spawnBuild() {
  return new Promise((resolve, reject) => {
    const command = process.platform === "win32" ? "wasm-pack.exe" : "wasm-pack";
    const child = spawn(
      command,
      [
        "build",
        "--target",
        "web",
        "./wasm",
        "--out-dir",
        "../src/wasm/pkg",
        "--out-name",
        "crank_drawer_wasm",
      ],
      {
      cwd: frontendDir,
      stdio: "inherit",
      shell: false,
      },
    );

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`build:wasm exited with code ${code ?? "unknown"}`));
    });
  });
}

const watcher = chokidar.watch(watchedPaths, {
  ignoreInitial: true,
});

watcher
  .on("ready", () => {
    console.log("[wasm-watch] watching wasm/**/*.rs and wasm/Cargo.toml");
  })
  .on("all", (event, changedPath) => {
    const relativePath = path.relative(frontendDir, changedPath);
    scheduleBuild(`${event}: ${relativePath}`);
  })
  .on("error", (error) => {
    console.error("[wasm-watch] watcher error");
    console.error(error);
  });

const shutdown = async () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  await watcher.close();
  process.exit(0);
};

process.on("SIGINT", () => {
  void shutdown();
});

process.on("SIGTERM", () => {
  void shutdown();
});

