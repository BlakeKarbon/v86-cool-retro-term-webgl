// crt-profiles.js: cool-retro-term profiles for cool-retro-term-renderer.
//
// PROFILES holds cool-retro-term's built-in profiles, copied from its
// app/qml/ApplicationSettings.qml (GPL-3.0), using cool-retro-term's own field
// names. applyProfile() also accepts a profile JSON exported from the
// cool-retro-term app. Fields the renderer can't do (frame*, margin,
// screenRadius, lineSpacing, fontWidth, windowOpacity) are ignored.
//
// Fonts: pass `fonts`, the URL of cool-retro-term's app/qml/fonts/ folder, and
// the profile's font (fontName) is loaded from there. Without it the
// renderer's built-in Terminus is kept.
//
//   import { PROFILES, applyProfile } from "./crt-profiles.js";
//   await applyProfile(crt.text, PROFILES["Apple ]["], { fonts: "./cool-retro-term/app/qml/fonts/" });

export const PROFILES = {
    "Default Amber": { fontName: "TERMINESS_SCALED", fontColor: "#ff8100", backgroundColor: "#000000", contrast: 0.8, saturationColor: 0.2, brightness: 0.5, ambientLight: 0.3, chromaColor: 0.2, bloom: 0.6, burnIn: 0.3, flickering: 0.1, glowingLine: 0.2, horizontalSync: 0.1, jitter: 0.2, staticNoise: 0.1, screenCurvature: 0.2, rgbShift: 0, rasterization: 0 },
    "Monochrome Green": { fontName: "DEPARTURE_MONO_SCALED", fontColor: "#0ccc68", backgroundColor: "#000000", contrast: 0.8, saturationColor: 0.0, brightness: 0.5, ambientLight: 0.3, chromaColor: 0.0, bloom: 0.5, burnIn: 0.3, flickering: 0.1, glowingLine: 0.2, horizontalSync: 0.1, jitter: 0.2, staticNoise: 0.1, screenCurvature: 0.3, rgbShift: 0, rasterization: 0 },
    "Deep Blue": { fontName: "BIGBLUE_TERMINAL_SCALED", fontColor: "#7fb4ff", backgroundColor: "#000000", contrast: 0.8, saturationColor: 0.2, brightness: 0.5, ambientLight: 0.0, chromaColor: 1.0, bloom: 0.6, burnIn: 0.3, flickering: 0.1, glowingLine: 0.2, horizontalSync: 0.1, jitter: 0.2, staticNoise: 0.1, screenCurvature: 0.4, rgbShift: 0, rasterization: 0 },
    "Commodore 64": { fontName: "COMMODORE_64_SCALED", fontColor: "#a9a7ff", backgroundColor: "#3b3b8f", contrast: 0.7, saturationColor: 0, brightness: 0.6, ambientLight: 0.4, chromaColor: 0.0, bloom: 0.4, burnIn: 0.1, flickering: 0.1, glowingLine: 0.1, horizontalSync: 0.0, jitter: 0.0, staticNoise: 0.1, screenCurvature: 0.5, rgbShift: 0, rasterization: 1 },
    "Commodore PET": { fontName: "COMMODORE_PET_SCALED", fontColor: "#ffffff", backgroundColor: "#000000", contrast: 0.8, saturationColor: 0, brightness: 0.5, ambientLight: 0.0, chromaColor: 0, bloom: 0.4, burnIn: 0.4, flickering: 0.2, glowingLine: 0.3, horizontalSync: 0.2, jitter: 0.15, staticNoise: 0.2, screenCurvature: 0.7, rgbShift: 0.0, rasterization: 1 },
    "Apple ][": { fontName: "APPLE_II_SCALED", fontColor: "#4dff6b", backgroundColor: "#001100", contrast: 0.8, saturationColor: 0, brightness: 0.5, ambientLight: 1.0, chromaColor: 0, bloom: 0.3, burnIn: 0.3, flickering: 0.2, glowingLine: 0.3, horizontalSync: 0.2, jitter: 0.2, staticNoise: 0.2, screenCurvature: 0.5, rgbShift: 0.0, rasterization: 1 },
    "Atari 400": { fontName: "ATARI_400_SCALED", fontColor: "#8ed6ff", backgroundColor: "#0f1f5a", contrast: 0.9, saturationColor: 0, brightness: 0.6, ambientLight: 0.1, chromaColor: 0, bloom: 0.1, burnIn: 0.2, flickering: 0.1, glowingLine: 0.1, horizontalSync: 0.0, jitter: 0.0, staticNoise: 0.1, screenCurvature: 0.4, rgbShift: 0.0, rasterization: 1 },
    "IBM VGA 8x16": { fontName: "IBM_VGA_8x16", fontColor: "#c0c0c0", backgroundColor: "#000000", contrast: 1.0, saturationColor: 0, brightness: 0.6, ambientLight: 0.2, chromaColor: 0.5, bloom: 0.2, burnIn: 0.1, flickering: 0.1, glowingLine: 0.1, horizontalSync: 0.0, jitter: 0.0, staticNoise: 0.0, screenCurvature: 0.3, rgbShift: 0.1, rasterization: 1 },
    "IBM 3278 Reborn": { fontName: "IBM_3278", fontColor: "#3cff7a", backgroundColor: "#000000", contrast: 0.8, saturationColor: 0, brightness: 0.5, ambientLight: 0.2, chromaColor: 0, bloom: 0.2, burnIn: 0.5, flickering: 0, glowingLine: 0.0, horizontalSync: 0, jitter: 0, staticNoise: 0.0, screenCurvature: 0, rgbShift: 0, rasterization: 4 },
    "Neon Cyan": { fontName: "IOSEVKA", fontColor: "#52f7ff", backgroundColor: "#001018", contrast: 0.9, saturationColor: 0.6, brightness: 0.6, ambientLight: 0.1, chromaColor: 1, bloom: 0.6, burnIn: 0.1, flickering: 0.1, glowingLine: 0.2, horizontalSync: 0.0, jitter: 0.1, staticNoise: 0.1, screenCurvature: 0, rgbShift: 0.0, rasterization: 4 },
    "Ghost Terminal": { fontName: "JETBRAINS_MONO", fontColor: "#a6b3c0", backgroundColor: "#0b1014", contrast: 0.5, saturationColor: 0.0, brightness: 0.6, ambientLight: 0.3, chromaColor: 0, bloom: 0.3, burnIn: 0.2, flickering: 0.0, glowingLine: 0.1, horizontalSync: 0.0, jitter: 0.0, staticNoise: 0.1, screenCurvature: 0, rgbShift: 0.0, rasterization: 4 },
    "Plasma": { fontName: "FIRA_CODE", fontColor: "#ff9bd6", backgroundColor: "#070014", contrast: 0.8, saturationColor: 0.8, brightness: 0.6, ambientLight: 0.1, chromaColor: 1, bloom: 0.7, burnIn: 0.1, flickering: 0.1, glowingLine: 0.2, horizontalSync: 0.0, jitter: 0.1, staticNoise: 0.1, screenCurvature: 0, rgbShift: 0.1, rasterization: 4 },
    "Boring": { fontName: "JETBRAINS_MONO", fontColor: "#ffffff", backgroundColor: "#000000", contrast: 0.8, saturationColor: 0.0, brightness: 0.5, ambientLight: 0.1, chromaColor: 1, bloom: 0.5, burnIn: 0.05, flickering: 0.0, glowingLine: 0.1, horizontalSync: 0, jitter: 0.0, staticNoise: 0.0, screenCurvature: 0, rgbShift: 0, rasterization: 4 },
    "E-Ink": { fontName: "HACK", fontColor: "#101010", backgroundColor: "#f2f2ec", contrast: 0.5, saturationColor: 0, brightness: 1.0, ambientLight: 0.6, chromaColor: 0, bloom: 0.0, burnIn: 0.6, flickering: 0.0, glowingLine: 0.0, horizontalSync: 0.0, jitter: 0.0, staticNoise: 0.0, screenCurvature: 0, rgbShift: 0, rasterization: 4 },
};

// cool-retro-term's font names -> files under its app/qml/fonts/ folder (fontmanager.cpp).
export const FONTS = {
    TERMINESS_SCALED: "terminus/TerminessNerdFontMono-Regular.ttf",
    BIGBLUE_TERMINAL_SCALED: "bigblue-terminal/BigBlueTerm437NerdFontMono-Regular.ttf",
    EXCELSIOR_SCALED: "fixedsys-excelsior/FSEX301-L2.ttf",
    GREYBEARD_SCALED: "greybeard/Greybeard-16px.ttf",
    COMMODORE_PET_SCALED: "pet-me/PetMe.ttf",
    GOHU_11_SCALED: "gohu/GohuFont11NerdFontMono-Regular.ttf",
    COZETTE_SCALED: "cozette/CozetteVector.ttf",
    UNSCII_8_SCALED: "unscii/unscii-8.ttf",
    UNSCII_8_THIN_SCALED: "unscii/unscii-8-thin.ttf",
    UNSCII_16_SCALED: "unscii/unscii-16-full.ttf",
    APPLE_II_SCALED: "apple2/PrintChar21.ttf",
    ATARI_400_SCALED: "atari-400-800/AtariClassic-Regular.ttf",
    COMMODORE_64_SCALED: "pet-me/PetMe64.ttf",
    IBM_EGA_8x8: "oldschool-pc-fonts/PxPlus_IBM_EGA_8x8.ttf",
    IBM_VGA_8x16: "oldschool-pc-fonts/PxPlus_IBM_VGA_8x16.ttf",
    TERMINESS: "terminus/TerminessNerdFontMono-Regular.ttf",
    HACK: "hack/HackNerdFontMono-Regular.ttf",
    FIRA_CODE: "fira-code/FiraCodeNerdFontMono-Regular.ttf",
    IOSEVKA: "iosevka/IosevkaTermNerdFontMono-Regular.ttf",
    JETBRAINS_MONO: "jetbrains-mono/JetBrainsMonoNerdFontMono-Regular.ttf",
    IBM_3278: "ibm-3278/3270NerdFontMono-Regular.ttf",
    SOURCE_CODE_PRO: "source-code-pro/SauceCodeProNerdFontMono-Regular.ttf",
    DEPARTURE_MONO_SCALED: "departure-mono/DepartureMonoNerdFontMono-Regular.otf",
    OPENDYSLEXIC: "opendyslexic/OpenDyslexicMNerdFontMono-Regular.otf",
};

const EFFECTS = ["screenCurvature", "bloom", "brightness", "ambientLight", "chromaColor", "flickering",
    "horizontalSync", "jitter", "staticNoise", "glowingLine", "burnIn"];

export function applyProfile(text, p, { fonts } = {})
{
    const num = (key, fallback) => typeof p[key] === "number" ? p[key] : fallback;

    // Colours, mixed the way cool-retro-term does (contrast + saturation).
    const font = rgb(p.fontColor ?? "#0ccc68");
    const bg = rgb(p.backgroundColor ?? "#000000");
    const saturated = mix(font, [1, 1, 1], num("saturationColor", 0) * 0.5);
    const k = 0.7 + num("contrast", 0.8) * 0.3;
    text.setFontColor(hex(mix(bg, saturated, k)));
    const background = mix(saturated, bg, k);

    // The renderer paints its background colour under the text too, where the
    // shader would glow it like text. Keep that layer black and give the
    // colour to the shader only.
    const mats = [text.staticMaterial, text.dynamicMaterial];      // renderer internals
    if(mats.every(m => m?.uniforms?.backgroundColor))
    {
        text.setBackgroundColor("#000000");
        for(const m of mats) m.uniforms.backgroundColor.value.set(...background);
    }
    else text.setBackgroundColor(hex(background));

    // Effects use the same scale in both projects.
    for(const key of EFFECTS)
    {
        if(typeof p[key] === "number") text["set" + key[0].toUpperCase() + key.slice(1)](p[key]);
    }
    // cool-retro-term: shift * 4 / width * 0.75; the renderer's shader multiplies by 12.
    if(typeof p.rgbShift === "number") text.setRgbShift(p.rgbShift * 4 / 1160 * 0.75 / 12);
    // 0 none, 1 scanlines, 2 pixels, 3 subpixels; cool-retro-term's 4 ("modern") -> none.
    if(typeof p.rasterization === "number") text.setRasterizationMode(p.rasterization <= 3 ? p.rasterization : 0);

    const file = FONTS[p.fontName];
    return fonts && file ? setFont(text, new URL(file, new URL(fonts, location.href)).href) : Promise.resolve();
}

// Swap the font the renderer draws with. The renderer always asks for the
// family "Terminus" (its built-in font), so the new font is registered under
// that name and the renderer's own face is removed. The linker re-lays out
// the screen when the character size changes. Uses renderer internals.
const faces = new Map();
let fontRequest = 0, currentFont = null;
export async function setFont(text, url)
{
    const request = ++fontRequest;
    if(url === currentFont) return;
    let face = faces.get(url);
    if(!face)
    {
        face = new FontFace("Terminus", `url("${url}")`);
        faces.set(url, face);
    }
    await face.load();
    // Wait for the renderer's own font load to finish, so it can't replace ours.
    for(let i = 0; i < 200 && !text.fontLoaded; i++) await new Promise(r => setTimeout(r, 25));
    if(request !== fontRequest) return;                                // a newer font won
    for(const f of [...document.fonts])
    {
        if(f !== face && f.family.replace(/["']/g, "") === "Terminus") document.fonts.delete(f);
    }
    document.fonts.add(face);
    currentFont = url;
    text.calculateFontMetrics?.();
    text.render?.();
}

const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
const mix = (a, b, t) => a.map((v, i) => v * (1 - t) + b[i] * t);
const hex = c => "#" + c.map(v => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("");
