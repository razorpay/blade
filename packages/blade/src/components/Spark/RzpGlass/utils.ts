/**
 * RzpGlass Utility Functions
 */

/**
 * Load an image from URL
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Load a video from URL
 */
export function loadVideo(src: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = src;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.oncanplaythrough = () => resolve(video);
    video.onerror = () => reject(new Error(`Failed to load video: ${src}`));
    video.load();
  });
}

/**
 * Check if browser is Safari
 */
export function isSafari(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('safari') && !ua.includes('chrome') && !ua.includes('android');
}

/**
 * Best guess browser zoom level (for Safari which doesn't include zoom in devicePixelRatio)
 */
export function bestGuessBrowserZoom(): number {
  const viewportScale = visualViewport?.scale ?? 1;
  const viewportWidth = visualViewport?.width ?? window.innerWidth;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  const innerWidth = viewportScale * viewportWidth + scrollbarWidth;

  const ratio = outerWidth / innerWidth;
  const zoomPercentageRounded = Math.round(100 * ratio);

  // Common zoom levels divisible by 5%
  if (zoomPercentageRounded % 5 === 0) {
    return zoomPercentageRounded / 100;
  }

  // Handle special zoom levels
  if (zoomPercentageRounded === 33) return 1 / 3;
  if (zoomPercentageRounded === 67) return 2 / 3;
  if (zoomPercentageRounded === 133) return 4 / 3;

  return ratio;
}
