# Kira Kira ☆ Neurosis 2
2023, 2026

https://0bjekt.co/2023/neurosis

----

## Project layout

- `src/`: React frontend
- `src/Components/Neurosis.tsx`: Host component that initializes WASM and forwards reset clicks
- `src/wasm/pkg/`: Generated wasm-bindgen package consumed by the frontend
- `wasm/src/lib.rs`: Rust rendering and animation logic

## How it works

- The crank animation loop (`requestAnimationFrame`) runs in Rust.
- React mounts canvases and calls the WASM API.
- The center point is intentionally fixed while drawing.
- On click, `reset()` recomputes the center and regenerates crank line parameters.

## Prerequisites

- Rust + Cargo
- `wasm32-unknown-unknown` target
- `wasm-pack`
- Node.js + `pnpm`

## Development

```bash
pnpm install
pnpm run dev
```

`pnpm run dev` first runs a WASM build:

```bash
wasm-pack build --target web ./wasm --out-dir ../src/wasm/pkg --out-name crank_drawer_wasm
```

Then it starts:

- Vite dev server
- `scripts/watch-wasm.mjs` (watches `wasm/**/*.rs` and `wasm/Cargo.toml`)

When Rust files change, WASM is rebuilt and Vite picks up the generated package update.

## Production build

```bash
pnpm run build
```

## Main WASM API

- `start(canvas)` -> starts the basic single-canvas renderer (`CanvasApp`)
- `start_crank_drawer(crankCanvas, trailCanvas)` -> starts crank + trail rendering (`CrankDrawerApp`)
- `CrankDrawerApp.reset()` -> recomputes center and line parameters
- `CrankDrawerApp.lines_info()` -> returns line metadata for UI display
- `stop()` -> cancels animation loop


