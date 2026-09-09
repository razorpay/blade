// ========================================
// PREVIEW IMAGE RENDERING
// ========================================

import type { Platform } from './types';
import { selected, platform } from './state';
import { computeSignature } from './signature';
import { getPreviewImageUrl as getSharedPreviewImageUrl } from '../previewImages';

// ---- Preview URL Lookup ----

export function getPreviewImageUrl(
  patternId: string,
  currentPlatform: Platform,
  signature?: string,
): string | undefined {
  const resolvedSignature =
    selected && selected.wizard ? signature || computeSignature() : signature;

  return getSharedPreviewImageUrl(patternId, currentPlatform, resolvedSignature);
}

// ---- Preview DOM Update ----

export function updatePreview(): void {
  const previewContent = document.querySelector('.preview-content') as HTMLElement | null;
  if (!previewContent) return;

  if (!selected) {
    previewContent.innerHTML =
      '<div class="preview-placeholder"><div style="color: #768EA7; text-align: center; padding: 20px; font-size: 14px;">Select a pattern to see preview</div></div>';
    return;
  }

  const previewImageUrl = getPreviewImageUrl(selected.id, platform);

  if (previewImageUrl) {
    previewContent.innerHTML =
      '<img src="' +
      previewImageUrl +
      '" alt="' +
      selected.name +
      ' Preview" style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px;">';
  } else {
    previewContent.innerHTML =
      '<div class="preview-placeholder"><div style="color: #768EA7; text-align: center; padding: 20px; font-size: 14px;">Preview not available</div></div>';
  }
}

// ---- Emoji/Thumb Size Update ----

export function updateEmojiSizes(): void {
  const thumbs = document.querySelectorAll('.thumb');
  thumbs.forEach(function (thumb) {
    if (platform === 'mobile') {
      (thumb as HTMLElement).classList.add('mobile');
    } else {
      (thumb as HTMLElement).classList.remove('mobile');
    }
  });
}
