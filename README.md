# v86 + cool-retro-term: Basic Demo Setup

This guide sets up a web page that boots FreeDOS in v86 and shows it with cool-retro-term's CRT effect. The libraries are used unchanged. The only new code is the linker, `v86-crt.js`.

| Part | What it is |
| --- | --- |
| [v86](https://github.com/copy/v86) | The x86 emulator. |
| `cool-retro-term-renderer` | The CRT renderer from [cool-retro-term-webgl](https://github.com/remojansen/cool-retro-term-webgl). It needs `three` (three.js). |
| `v86-crt.js` | Our linker. It sends v86's text screen straight to the renderer's `TerminalText`. No xterm.js is involved. |

**Text and graphics:** text mode (DOS, a Linux console) always goes through the CRT. For graphics modes you choose with the `graphics` option:
- `"crt"`: DOS games and graphics go through the CRT too.
- `"native"` (default): the linker hides the CRT, stops its rendering, and shows v86's normal screen until the guest returns to text mode. Use this for Windows 98 and other graphical systems.

**You need:** Node.js with npm, and a web server. The page uses ES modules, so it won't work opened as a local `file://` file.

There are two ways to get the libraries:

- **Option A:** install them from npm.
- **Option B:** use your own local builds.

Both use the same linker and almost the same `basic.html`.

---

## Option A: Install from npm

### A1. Install the libraries

```sh
mkdir v86 && cd v86
npm init -y
npm install v86@0.5.473 cool-retro-term-renderer@1.0.1 three@0.180.0
```

- `v86` is the npm package named in [v86's README](https://github.com/copy/v86#how-to-build-run-and-embed). It includes `build/libv86.mjs` and `build/v86.wasm`.
- Keep `three` at 0.180.x. Renderer 1.0.1 only supports `^0.180.0`, and npm refuses to install newer versions.
- npm also installs `@xterm/xterm`, because the renderer lists it as a dependency. The page never loads it.

### A2. Add the BIOS and a disk image

The npm package doesn't include the BIOS files. Copy them from the [`bios/`](https://github.com/copy/v86/tree/master/bios) folder of the v86 repo.

```sh
mkdir bios images
curl -L -o bios/seabios.bin https://raw.githubusercontent.com/copy/v86/master/bios/seabios.bin
curl -L -o bios/vgabios.bin https://raw.githubusercontent.com/copy/v86/master/bios/vgabios.bin
curl -L -o images/freedos722.img https://i.copy.sh/freedos722.img
```

`freedos722.img` is the FreeDOS floppy that [copy.sh/v86](https://copy.sh/v86/?profile=freedos) boots. Any DOS floppy image works.

### A3. Add the linker

Copy `v86-crt.js` into the folder. It imports `cool-retro-term-renderer` and `three` by name and exports one function: `attach(emulator, options)`.

```
v86/
├── package.json
├── node_modules/   v86, cool-retro-term-renderer, three
├── bios/           seabios.bin, vgabios.bin
├── images/         freedos722.img
├── v86-crt.js      the linker
└── basic.html      next step
```

### A4. Create basic.html

The import map tells the browser which installed file each library name refers to. The renderer imports `three` by name, so `three` must be in the map.

```html
<!doctype html>
<meta charset="utf-8">
<title>Basic Emulator</title>

<style>
  html, body { margin: 0; background: #0b0c0b; }
  #crt { width: min(100vw, calc(100vh * 4 / 3)); margin: 0 auto; }
</style>

<script type="importmap">
{
  "imports": {
    "v86": "./node_modules/v86/build/libv86.mjs",
    "cool-retro-term-renderer": "./node_modules/cool-retro-term-renderer/dist/index.js",
    "three": "./node_modules/three/build/three.module.js"
  }
}
</script>

<script type="module">
import { V86 } from "v86";
import { attach } from "./v86-crt.js";

const emulator = window.emulator = new V86({
    wasm_path: "./node_modules/v86/build/v86.wasm",
    memory_size: 32 * 1024 * 1024,
    vga_memory_size: 2 * 1024 * 1024,
    screen_container: document.getElementById("screen_container"),
    bios: { url: "./bios/seabios.bin" },
    vga_bios: { url: "./bios/vgabios.bin" },
    fda: { url: "./images/freedos722.img" },
    autostart: true,
});

window.crt = attach(emulator, { container: "#crt", graphics: "crt" });   // "native" for Windows 98
</script>

<div id="crt"></div>

<!-- v86's own screen: still required. The linker keeps it out of sight and
     reads from it; with graphics: "native" it is shown in graphics modes. -->
<div id="screen_container">
    <div style="white-space: pre; font: 14px monospace; line-height: 14px"></div>
    <canvas style="display: none"></canvas>
</div>
```

`attach()` takes these options besides `container`:

| Option | Default | What it does |
| --- | --- | --- |
| `padding` | `[3, 1]` | Blank columns and rows kept clear on each side, so text doesn't run under the curved edges. |
| `aspect` | `4 / 3` | Shape of the CRT on the page. Any text mode is stretched to fill it, like a real monitor. |
| `scanlineIntensity` | automatic | Scanline strength, 0 to 1. By default it depends on how big the CRT is shown. |
| `graphics` | `"native"` | Graphics modes: `"crt"` sends them through the CRT; `"native"` shows v86's own screen. Change it later with `crt.setGraphics("crt")`. |
| `lockMouse` | `true` | Clicking the CRT captures the mouse for the guest, once it has loaded a mouse driver. Press Esc to release it. |
| `crt` | none | Raw renderer settings. For whole looks, use profiles instead. |

To switch to cool-retro-term's other looks, fonts and scanlines, see [Change the CRT profile](#change-the-crt-profile).

### A5. Run it

```sh
npx http-server .
```

Open `http://localhost:8080/basic.html`, click the screen, and type `dir`.

To publish, upload the whole `v86/` folder, including `node_modules/`. On GitHub Pages, also add an empty `.nojekyll` file at the site root, because Jekyll skips `node_modules/`.

---

## Option B: Use your own local builds

You don't need npm packages here. Build each project from its repo, then point the import map at the built files.

### B1. Build v86

The requirements from [v86's README](https://github.com/copy/v86#how-to-build-run-and-embed) are make, Rust with the `wasm32-unknown-unknown` target, a compatible clang, Java (for Closure Compiler), and a recent Node.js.

```sh
git clone https://github.com/copy/v86
cd v86
rustup target add wasm32-unknown-unknown
make all
```

`make all` creates `build/libv86.mjs`, `build/libv86.js` and `build/v86.wasm`. The BIOS files are already in the repo's `bios/` folder.

### B2. Build cool-retro-term-renderer

```sh
git clone https://github.com/remojansen/cool-retro-term-webgl
cd cool-retro-term-webgl
npm install --ignore-scripts
npm run build:renderer
```

- `--ignore-scripts` skips the repo's Electron desktop app setup, which isn't needed and can fail.
- The build writes `modules/cool-retro-term-renderer/dist/index.js`. three.js comes from the repo's own `node_modules/`.

### B3. Lay out the site

```
site/
├── v86/                     the built v86 clone
├── cool-retro-term-webgl/   the built renderer clone
├── images/                  freedos722.img (see A2)
├── v86-crt.js               the linker (unchanged)
└── basic.html
```

### B4. Point basic.html at the builds

Use the `basic.html` from A4, with this import map:

```html
<script type="importmap">
{
  "imports": {
    "v86": "./v86/build/libv86.mjs",
    "cool-retro-term-renderer": "./cool-retro-term-webgl/modules/cool-retro-term-renderer/dist/index.js",
    "three": "./cool-retro-term-webgl/node_modules/three/build/three.module.js"
  }
}
</script>
```

Also change these three paths in the V86 options:

```js
    wasm_path: "./v86/build/v86.wasm",
    bios: { url: "./v86/bios/seabios.bin" },
    vga_bios: { url: "./v86/bios/vgabios.bin" },
```

Run it as in A5. The browser only loads the files in the import map, `v86.wasm`, the BIOS files and the disk image. If you'd rather not upload the full clones, copy just those files and update the paths.

You can also mix the options, for example a local v86 build with the renderer from npm. Only the import map paths change.

---

## Change the CRT profile

The renderer has no named profiles. It takes individual settings, and its defaults copy cool-retro-term's "Monochrome Green". `crt-profiles.js` adds cool-retro-term's 14 built-in profiles, each with its own font, and an `applyProfile()` function.

### Set up

1. Copy `crt-profiles.js` next to `v86-crt.js`.
2. For the profile fonts, copy the `app/qml/fonts/` folder from [cool-retro-term](https://github.com/Swordfish90/cool-retro-term) (the original Qt app, not the webgl port) into your site as `fonts/`:

   ```sh
   git clone --depth 1 https://github.com/Swordfish90/cool-retro-term
   cp -r cool-retro-term/app/qml/fonts ./fonts
   ```

   Each font folder includes its own licence file. Keep those with the fonts.

3. Apply a profile right after `attach()`:

   ```js
   import { attach } from "./v86-crt.js";
   import { PROFILES, applyProfile } from "./crt-profiles.js";

   window.crt = attach(emulator, { container: "#crt" });
   applyProfile(crt.text, PROFILES["Default Amber"], { fonts: "./fonts/" });
   ```

You can switch at any time, for example from a button:

```js
applyProfile(crt.text, PROFILES["Commodore 64"], { fonts: "./fonts/" });
```

Leave out `{ fonts }` to keep the renderer's built-in Terminus font. The linker resizes the screen for each font's character size, so 80×25 always fits with a margin.

**Built-in profiles and their fonts:**

| Profile | Font |
| --- | --- |
| Default Amber | Terminess |
| Monochrome Green | Departure Mono |
| Deep Blue | BigBlue Terminal |
| Commodore 64 | PetMe64 |
| Commodore PET | PetMe |
| Apple ][ | PrintChar21 |
| Atari 400 | Atari Classic |
| IBM VGA 8x16 | PxPlus IBM VGA 8x16 |
| IBM 3278 Reborn | 3270 |
| Neon Cyan | Iosevka |
| Ghost Terminal, Boring | JetBrains Mono |
| Plasma | Fira Code |
| E-Ink | Hack |

### Scanlines

The `rasterization` field controls scanlines: 0 = none, 1 = scanlines, 2 = pixels, 3 = subpixels. Some profiles turn them off, as in cool-retro-term (Default Amber, Monochrome Green and Deep Blue use 0). To turn them on for any profile:

```js
applyProfile(crt.text, { ...PROFILES["Default Amber"], rasterization: 1 }, { fonts: "./fonts/" });
```

The linker picks the number of scanlines from the size the CRT is shown at: each line gets about 4 screen pixels, with at most 16 lines per text row. It sets their strength the way cool-retro-term does. To make them stronger, pass `scanlineIntensity: 1` to `attach()`.

### Your own profile

- Pass an object with cool-retro-term's field names: `fontName`, `fontColor`, `backgroundColor`, `contrast`, `saturationColor`, `brightness`, `ambientLight`, `chromaColor`, `bloom`, `burnIn`, `flickering`, `glowingLine`, `horizontalSync`, `jitter`, `staticNoise`, `screenCurvature`, `rgbShift`, `rasterization`.
- A profile exported from the cool-retro-term app works as-is:

  ```js
  applyProfile(crt.text, await (await fetch("my-profile.json")).json(), { fonts: "./fonts/" });
  ```

- `fontName` uses cool-retro-term's names, such as `IBM_VGA_8x16` or `COMMODORE_64_SCALED`. `FONTS` in `crt-profiles.js` lists all 24.
- Frame, margin, line-spacing and window-opacity fields are ignored.

Use `applyProfile()` rather than `attach`'s `crt:` option for profiles. It mixes colours the way cool-retro-term does, using contrast and saturation. It also handles non-black backgrounds, which the `crt:` option shows washed out.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Blank page; console says "Failed to resolve module specifier" | The import map is missing, or one of its paths is wrong. |
| Typing does nothing | Click the CRT once so the page, not a button or input, has focus. |
| The CRT disappears and the normal v86 screen shows | The guest switched to graphics mode and `graphics` is `"native"`. Use `graphics: "crt"` to keep graphics on the CRT. |
| DOS graphics are all one colour | Monochrome profiles show graphics in the phosphor colour, like a real monochrome monitor. For colour, use a profile with `chromaColor: 1`, e.g. `{ ...PROFILES["IBM VGA 8x16"], chromaColor: 1 }`. |
| Menu highlights and colours are missing | The renderer is monochrome, so colours and highlighted (reverse-video) text don't show. |
| The mouse does nothing | Click the CRT to capture it. This only works once the guest has loaded a mouse driver (e.g. CTMOUSE in FreeDOS). Press Esc to release it. |
| A profile's font doesn't change | Check the `fonts` path: the browser's Network tab shows a 404 for the font file. |
| Text looks squeezed with Commodore or Apple fonts | Those fonts are as wide as they are tall, so 80 columns of them are stretched to fit 4:3. This is intended. |

## Notes

The renderer has no public API for fonts, sizing or background colour, so the linker and `crt-profiles.js` use some of its internal fields. These include `charWidth`, `screenScaling`, `handleResize`, `staticMaterial` (also used for graphics through the CRT) and `calculateFontMetrics`. If a future renderer version renames them, those features stop working; the basic CRT keeps working. Pin the renderer version (1.0.1) and test before upgrading.

## Sources

- [copy/v86 README](https://github.com/copy/v86#how-to-build-run-and-embed)
- [copy/v86 examples/basic.html](https://github.com/copy/v86/blob/master/examples/basic.html)
- [cool-retro-term-renderer README](https://github.com/remojansen/cool-retro-term-webgl/tree/main/modules/cool-retro-term-renderer)
- [cool-retro-term-webgl package.json](https://github.com/remojansen/cool-retro-term-webgl/blob/main/package.json) (the `build:renderer` script)
