// ========================================
// APPLICATION STATE & DOM ELEMENT REFERENCES
// ========================================

import type { Pattern, Platform } from "./types";

// ---- State ----

export const allPatterns: Pattern[] = Array.isArray(window.DEFAULT_UI_PATTERNS)
  ? window.DEFAULT_UI_PATTERNS.slice()
  : [];

export let platform: Platform = "desktop";
export let filtered: Pattern[] = allPatterns.slice();
export let selected: Pattern | null = null;

export function setPlatform(p: Platform): void {
  platform = p;
}

export function setFiltered(patterns: Pattern[]): void {
  filtered = patterns;
}

export function setSelected(pattern: Pattern | null): void {
  selected = pattern;
}

// ---- DOM Element References ----

export const gridEl = document.getElementById("grid") as HTMLElement;
export const emptyEl = document.getElementById("empty") as HTMLElement;
export const emptyMsgEl = document.getElementById("emptyMsg") as HTMLElement;
export const searchEl = document.getElementById("search") as HTMLInputElement;
export const createBtn = document.getElementById("createBtn") as HTMLButtonElement;
export const step1El = document.getElementById("step1") as HTMLElement;
export const step2El = document.getElementById("step2") as HTMLElement;
export const wizardNameEl = document.getElementById("wizardPatternName") as HTMLElement;

export const optPageType = document.getElementById("opt_pageType") as HTMLSelectElement;
export const optShowTabs = document.getElementById("opt_showTabs") as HTMLSelectElement;
export const optSupportingElements = document.getElementById("opt_supportingElements") as HTMLSelectElement;
export const optColumnType = document.getElementById("opt_columnType") as HTMLSelectElement;
export const optSize = document.getElementById("opt_size") as HTMLSelectElement;
export const optContentType = document.getElementById("opt_contentType") as HTMLSelectElement;
export const optViewType = document.getElementById("opt_viewType") as HTMLSelectElement;
// Legacy element — may not exist in DOM
export const optSupportingElement = document.getElementById("opt_supportingElement") as HTMLSelectElement | null;
export const optColumnTypeDashboard = document.getElementById("opt_columnType_dashboard") as HTMLSelectElement;
export const optShowAside = document.getElementById("opt_showAside") as HTMLSelectElement;
export const optStepType = document.getElementById("opt_stepType") as HTMLSelectElement;
export const optStepperType = document.getElementById("opt_stepperType") as HTMLSelectElement;
export const optContent = document.getElementById("opt_content") as HTMLSelectElement;
