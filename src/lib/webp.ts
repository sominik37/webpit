import encodeWebp, { init as initWebpEncoder } from '@jsquash/webp/encode.js';
import encWasmUrl from '@jsquash/webp/codec/enc/webp_enc.wasm?url';
import encSimdWasmUrl from '@jsquash/webp/codec/enc/webp_enc_simd.wasm?url';

let nativeWebpSupport: boolean | null = null;
let encoderReady: Promise<unknown> | null = null;

/**
 * Safari (and some other engines) can decode WebP but cannot encode it.
 * `canvas.toDataURL('image/webp')` silently falls back to PNG there, so we
 * probe with a 1x1 canvas and remember the result.
 */
export function supportsNativeWebpEncoding(): boolean {
  if (nativeWebpSupport !== null) return nativeWebpSupport;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    nativeWebpSupport = canvas.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    nativeWebpSupport = false;
  }
  return nativeWebpSupport;
}

function loadWasmEncoder(): Promise<unknown> {
  if (!encoderReady) {
    encoderReady = initWebpEncoder({
      locateFile: (path: string) =>
        path.includes('simd') ? encSimdWasmUrl : encWasmUrl,
    });
  }
  return encoderReady;
}

function nativeToBlob(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality / 100));
}

/**
 * Encode a canvas to a WebP blob. Uses the browser's native encoder when
 * available and transparently falls back to a bundled libwebp WASM encoder
 * (Safari, older Firefox, etc.) otherwise.
 */
export async function encodeCanvasToWebp(
  canvas: HTMLCanvasElement,
  quality: number
): Promise<Blob | null> {
  const clamped = Math.min(100, Math.max(1, Math.round(quality)));

  if (supportsNativeWebpEncoding()) {
    const blob = await nativeToBlob(canvas, clamped);
    // Guard against engines that report support but still hand back PNG.
    if (blob && blob.type === 'image/webp') return blob;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  await loadWasmEncoder();
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const buffer = await encodeWebp(imageData, { quality: clamped });
  return new Blob([buffer], { type: 'image/webp' });
}
