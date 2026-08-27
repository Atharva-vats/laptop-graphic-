// Configuration
const CONFIG = {
  frameCount: 240,
  framePrefix: 'frames/ezgif-frame-',
  frameExt: '.jpg',
  lerpFactor: 0.09, // Smooth interpolation speed (0.05 - 0.15)
};

// Elements
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d', { alpha: false });
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loader-bar');
const loaderText = document.getElementById('loader-text');

// State
const images = [];
let loadedCount = 0;
let targetFrame = 0;
let currentFrame = 0;
let lastRenderedIndex = -1;
let isReady = false;

// Format frame index as 3 digits (e.g. 1 -> "001")
function getFramePath(index) {
  const numStr = String(index).padStart(3, '0');
  return `${CONFIG.framePrefix}${numStr}${CONFIG.frameExt}`;
}

// Resize canvas handling high-DPI (Retina) displays
function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  if (isReady) {
    const frameIndex = Math.min(CONFIG.frameCount - 1, Math.max(0, Math.round(currentFrame)));
    renderFrame(frameIndex);
  }
}

// Render specific frame with object-fit: cover
function renderFrame(index) {
  const img = images[index];
  if (!img || !img.complete || img.naturalWidth === 0) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const canvasW = canvas.width / dpr;
  const canvasH = canvas.height / dpr;
  const imgW = img.naturalWidth;
  const imgH = img.naturalHeight;

  // Calculate aspect ratio cover math
  const scale = Math.max(canvasW / imgW, canvasH / imgH);
  const drawW = imgW * scale;
  const drawH = imgH * scale;
  const drawX = (canvasW - drawW) / 2;
  const drawY = (canvasH - drawH) / 2;

  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
  ctx.restore();
}

// Calculate target frame from current scroll position
function updateScroll() {
  const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? Math.max(0, Math.min(1, scrollTop / maxScroll)) : 0;
  targetFrame = progress * (CONFIG.frameCount - 1);
}

// Main animation render loop with smooth linear interpolation (lerp)
function animationLoop() {
  if (isReady) {
    // Lerp towards target frame
    const delta = targetFrame - currentFrame;
    if (Math.abs(delta) > 0.0001) {
      currentFrame += delta * CONFIG.lerpFactor;
    } else {
      currentFrame = targetFrame;
    }

    const frameIndex = Math.min(CONFIG.frameCount - 1, Math.max(0, Math.round(currentFrame)));
    if (frameIndex !== lastRenderedIndex) {
      renderFrame(frameIndex);
      lastRenderedIndex = frameIndex;
    }
  }

  requestAnimationFrame(animationLoop);
}

// Preload all 240 frames
function preloadImages() {
  return new Promise((resolve) => {
    for (let i = 1; i <= CONFIG.frameCount; i++) {
      const img = new Image();
      const frameIdx = i - 1;

      img.onload = () => {
        loadedCount++;
        const percent = Math.round((loadedCount / CONFIG.frameCount) * 100);
        if (loaderBar) loaderBar.style.width = `${percent}%`;
        if (loaderText) loaderText.textContent = `Loading ${percent}%`;

        // Render first frame as soon as it is available
        if (frameIdx === 0 && !isReady) {
          renderFrame(0);
        }

        if (loadedCount === CONFIG.frameCount) {
          resolve();
        }
      };

      img.onerror = () => {
        console.warn(`Failed to load frame: ${getFramePath(i)}`);
        loadedCount++;
        if (loadedCount === CONFIG.frameCount) {
          resolve();
        }
      };

      img.src = getFramePath(i);
      images.push(img);
    }
  });
}

// Initialization
async function init() {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });
  window.addEventListener('scroll', updateScroll, { passive: true });

  // Start animation loop immediately
  requestAnimationFrame(animationLoop);

  // Preload frames
  await preloadImages();

  // Mark ready & dismiss loader
  isReady = true;
  updateScroll();
  currentFrame = targetFrame;
  renderFrame(Math.round(currentFrame));

  if (loader) {
    loader.classList.add('loaded');
  }
}

// DOM Ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
