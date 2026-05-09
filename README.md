# SonicPeel 🍊🔊

**SonicPeel** is a browser-based utility that "peels" the audio from your video files. With a stunning neon aesthetic and smooth mechanical animations, it extracts high-quality MP3s using client-side FFmpeg.

![SonicPeel Icon](favicon.png)

## Features

- **Peel-to-Reveal Interface**: A unique, satisfying animation when you drop your video.
- **Client-Side Extraction**: Powered by `ffmpeg.wasm`. Your files never leave your computer—processing happens entirely in the browser.
- **Retro-Modern Aesthetic**: Deep neon colors, glassmorphism, and a "lava lamp" animated background.
- **Lurking Engine**: Watch the internal gears grind as your audio is extracted.
- **Format Support**: Supports common video formats including MP4, MPG, and AVI.

## Live Demo

_Deploy this repository to GitHub Pages to see the live demo._

## How to Use

1. **Drop it**: Drag a video file onto the **SonicPeel** card or click **Browse Files**.
2. **Peel**: Watch the interface peel away to reveal the processing engine.
3. **Download**: Once the gears stop grinding, click **DOWNLOAD MP3**.
4. **Repeat**: Hit **CONVERT ANOTHER** to start a new extraction.

## Technical Details

- **Core**: HTML5, Vanilla CSS, JavaScript (ES6).
- **Processing Engine**: [FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) (v0.11.6).
- **Security**: Uses `coi-serviceworker.js` to enable `SharedArrayBuffer` support on static hosts like GitHub Pages.
- **Animations**: CSS Grid stacking, 3D transforms, and custom keyframes.

## Deployment to GitHub Pages

This app requires **Cross-Origin Isolation** to use `SharedArrayBuffer`. Since GitHub Pages doesn't allow custom headers, we use a service worker workaround:

1. Push this repository to GitHub.
2. Go to **Settings > Pages**.
3. Select **Deploy from a branch** (usually `main`).
4. Once deployed, the `coi-serviceworker.js` will automatically intercept requests and apply the necessary `COOP` and `COEP` headers.

## License

MIT License
