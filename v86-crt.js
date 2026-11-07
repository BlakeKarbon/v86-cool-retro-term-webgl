// v86-crt.js: connects v86 to cool-retro-term-renderer.
// The libraries are loaded through the page's import map; this file only
// connects them. No xterm.js: v86's text screen is fed straight into the
// renderer's TerminalText.
//
//   v86 VGA text mode ──screen events──► TerminalText.setText() ──► CRT
//   v86 graphics mode, option `graphics`:
//     "native" (default): the CRT is hidden and paused and v86's own screen is
//                         shown unchanged (e.g. Windows 98)
//     "crt":              v86's canvas is fed to the CRT shader instead of
//                         text (e.g. DOS games)

import * as THREE from "three";
import { CRTTerminal } from "cool-retro-term-renderer";

// CRTTerminal derives its character grid from its container's pixel size and
// the current font. The linker sizes that container (the "stage") so the grid
// is the guest screen plus a margin, then CSS-scales the stage to fill the host
// at a fixed aspect ratio, like a monitor stretching any mode to 4:3.

// Code page 437 -> Unicode (0x00 and 0xFF shown as space).
const CP437 = Array.from(
    " ☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*+,-./0123456789:;<=>?" +
    "@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂" +
    "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐" +
    "└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ");

export function attach(emulator, {
    container,
    screenContainer = "#screen_container",
    crt: crtOptions,
    padding = [3, 1],       // blank columns / rows kept clear on each side (curved edges)
    aspect = 4 / 3,         // shape of the CRT on the page
    scanlineIntensity,      // 0-1; default: automatic, from the displayed size
    graphics = "native",    // graphics modes: "native" (v86's own screen) or "crt"
    lockMouse = true,       // clicking the CRT captures the mouse once the guest has a mouse driver
} = {})
{
    const $ = el => typeof el === "string" ? document.querySelector(el) : el;
    const host = $(container);
    const screen = $(screenContainer);
    const screenStyle = screen.getAttribute("style") || "";

    // ---- CRT renderer on a stage that is sized by layout() and scaled to the host
    host.style.position = "relative";
    host.style.overflow = "hidden";
    host.style.aspectRatio ||= String(aspect);
    let stageW = 1160, stageH = 812;
    const stage = document.createElement("div");
    stage.style.cssText = `position:absolute;left:0;top:0;width:${stageW}px;height:${stageH}px;transform-origin:0 0`;
    host.append(stage);
    const crt = new CRTTerminal({ container: stage, ...crtOptions });
    const text = crt.getTerminalText();

    function fit()
    {
        const w = host.clientWidth, h = host.clientHeight, dpr = window.devicePixelRatio || 1;
        if(!w || !h) return;
        const sy = h / stageH;
        stage.style.transform = `scale(${w / stageW}, ${sy})`;
        // Draw the final image at the size it's shown, so the browser doesn't
        // shrink it (shrinking turns scanlines into moiré).
        const renderer = crt.getRenderer();
        renderer.setPixelRatio(dpr * sy);
        renderer.setSize(stageW, stageH);
        // One scanline per virtual pixel row: pick a count that leaves each
        // line about 4 device pixels tall (at most 16 per text row, like VGA),
        // and set their strength the way cool-retro-term does
        // (smoothstep(2, 4, device pixels per line)).
        const grid = text.getGridSize();
        const perRow = Math.max(2, Math.min(16, Math.floor(h * dpr / grid.rows / 4)));
        const lines = grid.rows * perRow;
        text.setVirtualResolution(Math.round(lines * w / h), lines);
        const t = Math.min(1, Math.max(0, (h * dpr / lines - 2) / 2));
        text.setRasterizationIntensity(scanlineIntensity ?? t * t * (3 - 2 * t));
    }
    new ResizeObserver(fit).observe(host);
    window.addEventListener("resize", fit);     // runs after the renderer's own resize handler

    // Text mode: CRT shown, v86's screen moved out of sight (it keeps running:
    // the cursor is read from it). Graphics mode: the reverse, CRT paused.
    function useCRT(on)
    {
        screen.setAttribute("style", on ? screenStyle + ";position:absolute;left:-10000px;top:0;overflow:hidden" : screenStyle);
        host.style.display = on ? "" : "none";
        if(typeof crt.animate !== "function") return;              // renderer internals
        if(on && crt.animationFrameId == null) crt.animate();
        if(!on && crt.animationFrameId != null)
        {
            cancelAnimationFrame(crt.animationFrameId);
            crt.animationFrameId = null;
        }
    }
    useCRT(true);

    // v86 reads keys on window but ignores them while an input/textarea has
    // focus, and buttons swallow Space/Enter: clicking the CRT clears focus.
    host.addEventListener("mouseup", () => setTimeout(() => document.activeElement?.blur?.(), 0));

    // ---- v86 screen state, mirrored from its public bus events
    let cols = 80, rows = 25, graphical = false, changed = true;
    let cells = new Uint8Array(cols * rows).fill(32);

    emulator.add_listener("screen-put-char", ([row, col, chr]) =>
    {
        if(row < rows && col < cols) { cells[row * cols + col] = chr; changed = true; }
    });

    emulator.add_listener("screen-set-size", ([w, h, bpp]) =>
    {
        if(!bpp && (w !== cols || h !== rows))
        {
            cols = w; rows = h;
            cells = new Uint8Array(cols * rows).fill(32);
        }
        if(!!bpp !== graphical)
        {
            graphical = !!bpp;
            applyMode();
        }
        changed = true;
    });

    // ---- graphics modes
    function applyMode()
    {
        const throughCRT = graphical && graphics === "crt" && setPassthrough(true);
        if(!throughCRT) setPassthrough(false);
        useCRT(!graphical || throughCRT);
        changed = true;
        lastOn = null;
    }

    // "crt": point the shader's input texture at a copy of v86's canvas,
    // inset by the same margin as the text. Uses renderer internals
    // (staticMaterial / dynamicMaterial); without them, falls back to "native".
    let gfx = null;
    function setPassthrough(on)
    {
        const mats = [text.staticMaterial, text.dynamicMaterial];
        if(!mats.every(m => m?.uniforms?.textTexture)) return false;
        if(on && !gfx)
        {
            const canvas = document.createElement("canvas");
            gfx = { canvas, ctx: canvas.getContext("2d"), saved: mats[0].uniforms.textTexture.value };
            gfx.texture = new THREE.CanvasTexture(canvas);
            gfx.texture.minFilter = gfx.texture.magFilter = THREE.LinearFilter;
            for(const m of mats) m.uniforms.textTexture.value = gfx.texture;
            text.setCursorVisible(false);
        }
        else if(!on && gfx)
        {
            for(const m of mats) m.uniforms.textTexture.value = gfx.saved;
            gfx.texture.dispose();
            gfx = null;
        }
        return true;
    }

    function drawGraphics()
    {
        const src = screen.querySelector("canvas");
        if(!src?.width || !src.height) return;
        const s = text.screenScaling, m = text.totalMargin ?? 0;
        const fx = Math.min(0.2, (m + offX * text.charWidth * s) / stageW);
        const fy = Math.min(0.2, (m + offY * text.charHeight * s) / stageH);
        const w = Math.round(src.width / (1 - 2 * fx)), h = Math.round(src.height / (1 - 2 * fy));
        const { canvas, ctx } = gfx;
        if(canvas.width !== w || canvas.height !== h)
        {
            canvas.width = w;
            canvas.height = h;
            gfx.texture.dispose();      // new size: let three.js re-create the GPU texture
        }
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(src, Math.round(fx * w), Math.round(fy * h));
        gfx.texture.needsUpdate = true;
    }

    // ---- mouse: v86 handles it while the pointer is locked
    let guestMouse = false;
    emulator.add_listener("mouse-enable", on => { guestMouse = !!on; });
    host.addEventListener("click", () =>
    {
        if(lockMouse && guestMouse && !document.pointerLockElement) emulator.lock_mouse?.();
    });

    const screenText = () => Array.from({ length: rows }, (_, r) =>
        Array.from(cells.subarray(r * cols, (r + 1) * cols), b => CP437[b]).join(""));

    // ---- cursor: v86's text DOM puts <div class="cursor"> just before the
    // cursor's cell, tracking the real CRTC registers (works for any guest).
    function readCursor()
    {
        const el = screen.querySelector(".cursor");
        const rowEl = el?.parentElement;
        if(rowEl?.parentElement?.parentElement === screen)
        {
            let col = 0;
            for(let n = el.previousSibling; n; n = n.previousSibling) col += n.textContent.length;
            const row = Array.prototype.indexOf.call(rowEl.parentElement.children, rowEl);
            return { row, col, on: el.style.display !== "none" };
        }
        // Fallback: BIOS data area (cursor pos at 0x450, shape at 0x461, page at 0x462).
        try
        {
            const b = emulator.read_memory(0x450, 0x13), p = (b[0x12] & 7) * 2;
            return { row: b[p + 1], col: b[p], on: !(b[0x11] & 0x20) };
        }
        catch { return null; }
    }

    // ---- layout: whenever the font or the guest's text size changes, resize the
    // stage so the renderer's grid is the guest screen + padding, and centre it.
    // Uses renderer internals (charWidth, charHeight, screenScaling, totalMargin).
    let layoutKey = "", offX = 0, offY = 0;
    function layout()
    {
        const s = text.screenScaling, cw = text.charWidth, ch = text.charHeight, m = text.totalMargin ?? 0;
        if(!(s > 0 && cw > 0 && ch > 0)) return;
        const key = [s, cw, ch, m, cols, rows].join();
        if(key === layoutKey) return;
        layoutKey = key;

        const edge = 2 * Math.floor(m / s);
        stageW = Math.ceil(s * ((cols + 2 * padding[0]) * cw + edge)) + 2;
        stageH = Math.ceil(s * ((rows + 2 * padding[1]) * ch + edge)) + 2;
        stage.style.width = stageW + "px";
        stage.style.height = stageH + "px";
        if(typeof crt.handleResize === "function") crt.handleResize();
        else window.dispatchEvent(new Event("resize"));            // the renderer listens for this
        // The renderer resizes its text canvas but keeps the old-size GPU
        // texture; release it so three.js re-creates it at the new size.
        text.texture?.dispose?.();

        const grid = text.getGridSize();
        offX = Math.max(0, Math.floor((grid.cols - cols) / 2));
        offY = Math.max(0, Math.floor((grid.rows - rows) / 2));
        fit();
        changed = true;
        lastPos = "";
    }

    // ---- once per frame: push changes into the renderer
    let lastPos = "", lastOn = null;
    (function frame()
    {
        requestAnimationFrame(frame);
        if(graphical)
        {
            if(gfx) drawGraphics();
            return;
        }
        layout();

        if(changed)
        {
            changed = false;
            const pad = " ".repeat(offX);
            text.setText("\n".repeat(offY) + screenText().map(line => pad + line).join("\n"));
        }
        const cur = readCursor();
        if(cur)
        {
            const pos = cur.col + "," + cur.row;
            if(pos !== lastPos) { lastPos = pos; text.setCursorPosition(cur.col + offX, cur.row + offY); }
            if(cur.on !== lastOn) { lastOn = cur.on; text.setCursorVisible(cur.on); }
        }
    })();

    return {
        crt,
        text,
        getText: screenText,
        get isGraphical() { return graphical; },
        // Switch how graphics modes are shown: "native" or "crt".
        setGraphics(mode) { graphics = mode; applyMode(); },
    };
}
