// ========================================
// UI PATTERN CREATOR — MAIN ENTRY POINT
// ========================================
// Vite entry: packages/plugin-figma-pattern-creator/src/ui/index.ts
// Gets bundled to dist/ui.js and inlined into ui.html by the figmaPlugin.

import { render } from "./renderer";
import { updatePreview } from "./preview";
import { bindEventHandlers } from "./eventHandlers";

// ---- Bootstrap ----

bindEventHandlers();
render();
updatePreview();

const prevBtn = document.getElementById("prevBtn") as HTMLElement;
prevBtn.style.display = "none";
