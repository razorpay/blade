// ========================================
// EVENT HANDLERS
// ========================================

import {
  platform,
  selected,
  setSelected,
  setPlatform,
  searchEl,
  step1El,
  step2El,
  optPageType,
  optShowTabs,
  optSupportingElements,
  optColumnType,
  optSize,
  optContentType,
  optViewType,
  optSupportingElement,
  optColumnTypeDashboard,
  optShowAside,
  optStepType,
  optStepperType,
  optContent,
} from "./state";
import type { Platform } from "./types";
import { updateCreateEnabled, currentKeyAndName } from "./componentKeys";
import { computeSignature } from "./signature";
import {
  updateConditionalRendering,
  updateConfigurationOptions,
  updateModalConditionalRendering,
  updateCreationViewConditionalRendering,
  updateDashboardConditionalRendering,
} from "./conditionalRendering";
import { updatePreview, updateEmojiSizes } from "./preview";
import { render, renderGrid } from "./renderer";

export function bindEventHandlers(): void {
  // ---- Platform switcher ----
  const platformSeg = document.getElementById("platformSeg") as HTMLElement;
  platformSeg.addEventListener("click", function (e) {
    const b = (e.target as HTMLElement).closest("button");
    if (!b) return;
    setPlatform((b.getAttribute("data-platform") || "desktop") as Platform);
    Array.from(platformSeg.querySelectorAll("button")).forEach(function (x) {
      (x as HTMLElement).classList.remove("active");
    });
    b.classList.add("active");
    updateCreateEnabled();
    updateConfigurationOptions();
    updateConditionalRendering();
    updateModalConditionalRendering();
    updateCreationViewConditionalRendering();
    updateDashboardConditionalRendering();
    updateEmojiSizes();
    updatePreview();
    render();
  });

  // ---- Search input ----
  searchEl.addEventListener("input", render);

  // ---- Configuration option changes ----
  const configSelects = [
    optPageType,
    optShowTabs,
    optSupportingElements,
    optColumnType,
    optSize,
    optContentType,
    optViewType,
    optSupportingElement,
    optColumnTypeDashboard,
    optShowAside,
    optStepType,
    optStepperType,
    optContent,
  ].filter((sel): sel is HTMLSelectElement => sel !== null);

  configSelects.forEach(function (sel) {
    sel.addEventListener("change", function () {
      updateCreateEnabled();
      updateConditionalRendering();
      updateModalConditionalRendering();
      updateCreationViewConditionalRendering();
      updateDashboardConditionalRendering();
      updatePreview();
    });
  });

  // ---- Create button ----
  const createBtn = document.getElementById("createBtn") as HTMLButtonElement;
  createBtn.onclick = function () {
    const ck = currentKeyAndName();
    if (!ck.key) {
      alert(
        "No component key configured for this selection.\nAdd it in components.js or in the defaults inside ui.html.\n\n" +
          (selected && selected.wizard ? "Variant signature:\n" + computeSignature() : "")
      );
      return;
    }
    parent.postMessage(
      { pluginMessage: { type: "create-pattern", name: ck.name, key: ck.key } },
      "https://www.figma.com"
    );
  };

  // ---- Previous button ----
  const prevBtn = document.getElementById("prevBtn") as HTMLButtonElement;
  prevBtn.onclick = function () {
    setSelected(null);
    step2El.style.display = "none";
    step1El.style.display = "";
    updateCreateEnabled();
    renderGrid();
    updatePreview();
    (document.querySelector(".toolbar") as HTMLElement).style.display = "flex";
    prevBtn.style.display = "none";
  };
}
