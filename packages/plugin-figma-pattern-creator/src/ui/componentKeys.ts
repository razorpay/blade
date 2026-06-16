// ========================================
// COMPONENT KEY MANAGEMENT
// ========================================

import type { KeyAndName } from "./types";
import { platform, selected, createBtn, optViewType, optShowAside } from "./state";
import { computeSignature } from "./signature";

export function currentKeyAndName(): KeyAndName {
  if (!selected) return { name: "", key: "" };

  if (!selected.wizard) {
    const k = selected.keyByPlatform ? (selected.keyByPlatform[platform] as string | undefined) : "";
    return { name: selected.name, key: k || "" };
  }

  if (
    selected.id === "modal-template" &&
    platform === "mobile" &&
    selected.keyByPlatform &&
    selected.keyByPlatform.mobile
  ) {
    return { name: selected.name, key: selected.keyByPlatform.mobile as string };
  }

  if (
    selected.id === "creation-view" &&
    platform === "mobile" &&
    selected.keyByPlatform &&
    selected.keyByPlatform.mobile
  ) {
    const viewTypeValue = optViewType.value;
    const mobileKeys = selected.keyByPlatform.mobile as { [sig: string]: string };
    const mobileKey = mobileKeys["viewType=" + viewTypeValue];
    return { name: selected.name, key: mobileKey || "" };
  }

  if (
    selected.id === "dashboard-ui" &&
    platform === "mobile" &&
    selected.keyByPlatform &&
    selected.keyByPlatform.mobile
  ) {
    const showAsideValue = optShowAside.value;
    const mobileKeys = selected.keyByPlatform.mobile as { [sig: string]: string };
    const mobileKey = mobileKeys["showAside=" + showAsideValue];
    return { name: selected.name, key: mobileKey || "" };
  }

  const map = selected.variantsByPlatform ? selected.variantsByPlatform[platform] : null;
  if (!map) return { name: selected.name, key: "" };
  const sig = computeSignature();
  return { name: selected.name, key: map[sig] || "" };
}

export function updateCreateEnabled(): void {
  const ck = currentKeyAndName();
  createBtn.disabled = !ck.key;
}
