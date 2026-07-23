// ========================================
// SHARED TYPES
// ========================================

export type Platform = "desktop" | "mobile";

export interface Pattern {
  id: string;
  name: string;
  emoji?: string;
  wizard?: boolean;
  disabledOn?: Platform[];
  variantsByPlatform?: {
    [platform in Platform]?: {
      [signature: string]: string;
    };
  };
  keyByPlatform?: {
    [platform in Platform]?: string | { [signature: string]: string };
  };
}

export interface KeyAndName {
  name: string;
  key: string;
}

// Augment the global Window interface so TypeScript knows about the
// injected build-time variable.
declare global {
  interface Window {
    DEFAULT_UI_PATTERNS: Pattern[];
  }
}
