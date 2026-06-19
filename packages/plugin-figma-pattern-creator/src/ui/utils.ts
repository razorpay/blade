// ========================================
// UTILITY FUNCTIONS
// ========================================

import type { Pattern } from "./types";
import { platform } from "./state";

export function platformDisabled(p: Pattern): boolean {
  return (p.disabledOn || []).indexOf(platform) >= 0;
}

export function matchesSearch(p: Pattern, q: string): boolean {
  if (!q) return true;
  q = q.toLowerCase();
  return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
}

export function platformLabel(): string {
  return platform === "mobile" ? "Mobile" : "Desktop";
}
