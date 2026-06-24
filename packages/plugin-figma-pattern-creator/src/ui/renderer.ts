// ========================================
// RENDERING FUNCTIONS
// ========================================

import type { Pattern } from "./types";
import {
  platform,
  selected,
  setSelected,
  filtered,
  setFiltered,
  allPatterns,
  gridEl,
  emptyEl,
  emptyMsgEl,
  searchEl,
  step1El,
  step2El,
  wizardNameEl,
} from "./state";
import { platformDisabled, matchesSearch, platformLabel } from "./utils";
import { updateCreateEnabled } from "./componentKeys";
import { updatePreview, updateEmojiSizes } from "./preview";
import {
  updateConditionalRendering,
  updateConfigurationOptions,
  updateModalConditionalRendering,
  updateCreationViewConditionalRendering,
  updateDashboardConditionalRendering,
} from "./conditionalRendering";

// ---- Image rendering helper ----

function applyCardImage(t: HTMLElement, src: string, isMobile: boolean): void {
  const img = document.createElement("img");
  img.src = src;
  if (isMobile) {
    img.style.width = "45px";
    img.style.height = "90px";
  } else {
    img.style.width = "132px";
    img.style.height = "82px";
  }
  img.style.objectFit = "cover";
  img.style.borderRadius = "0";
  img.style.margin = "0 auto";
  img.style.display = "block";
  t.appendChild(img);
}

// ---- Grid rendering ----

export function renderGrid(): void {
  gridEl.innerHTML = "";
  const none = filtered.length === 0;
  emptyEl.style.display = none ? "" : "none";
  if (none) {
    const searchQuery = (searchEl.value || "").trim();
    if (searchQuery) {
      emptyMsgEl.textContent = 'Couldn\'t find any patterns with the name "' + searchQuery + '"';
    } else {
      emptyMsgEl.textContent = "No patterns available.";
    }
    return;
  }

  filtered.forEach(function (p: Pattern) {
    const dis = platformDisabled(p);
    const card = document.createElement("div");
    card.className =
      "card" +
      (dis ? " disabled" : "") +
      (selected && selected.id === p.id ? " selected" : "");
    const t = document.createElement("div");
    t.className = "thumb";

    const isMobile = platform === "mobile";

    // Use images for specific patterns instead of emojis
    if (p.id === "dashboard-ui") {
      const src = isMobile
        ? "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/Dashboard%20UI%2001.png?raw=true"
        : "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/Dashboard%20UI%2005.png?raw=true";
      applyCardImage(t, src, isMobile);
    } else if (p.id === "list-view") {
      const src = isMobile
        ? "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/List%20View%2002.png?raw=true"
        : "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/List%20View%2001.png?raw=true";
      applyCardImage(t, src, isMobile);
    } else if (p.id === "detail-view") {
      const src = isMobile
        ? "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/Detail%20View%2002.png?raw=true"
        : "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/Detail%20View%2001.png?raw=true";
      applyCardImage(t, src, isMobile);
    } else if (p.id === "creation-view") {
      const src = isMobile
        ? "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/Creation%20View%2004.png?raw=true"
        : "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/Creation%20View%2008.png?raw=true";
      applyCardImage(t, src, isMobile);
    } else if (p.id === "settings") {
      const src = isMobile
        ? "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/Settings%2012.png?raw=true"
        : "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/Settings%2015.png?raw=true";
      applyCardImage(t, src, isMobile);
    } else if (p.id === "modal-template") {
      const src = isMobile
        ? "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/Modal%20Template%2001.png?raw=true"
        : "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/Modal%20Template%2002.png?raw=true";
      applyCardImage(t, src, isMobile);
    } else {
      t.textContent = p.emoji || "📦";
    }

    const nm = document.createElement("div");
    nm.className = "title";
    nm.textContent = p.name;
    card.appendChild(t);
    card.appendChild(nm);

    card.onclick = function () {
      if (dis) return;

      if (selected && selected.id === p.id) {
        setSelected(null);
        step2El.style.display = "none";
        step1El.style.display = "";
        updateCreateEnabled();
        renderGrid();
        updatePreview();
        (document.querySelector(".toolbar") as HTMLElement).style.display = "flex";
        return;
      }

      setSelected(p);
      if (p.wizard && !(p.id === "modal-template" && platform === "mobile")) {
        goWizard(p);
      } else {
        step2El.style.display = "none";
        step1El.style.display = "";
        updateCreateEnabled();
        renderGrid();
        updatePreview();
        (document.querySelector(".toolbar") as HTMLElement).style.display = "flex";
      }
    };
    gridEl.appendChild(card);
  });
}

// ---- Wizard transition ----

export function goWizard(p: Pattern): void {
  setSelected(p);
  step1El.style.display = "none";
  step2El.style.display = "";
  wizardNameEl.textContent = p.name + " (" + platformLabel() + ")";
  updateCreateEnabled();
  renderGrid();
  (document.querySelector(".toolbar") as HTMLElement).style.display = "none";
  (document.getElementById("prevBtn") as HTMLElement).style.display = "block";
  updateConditionalRendering();
  updateConfigurationOptions();
  updateModalConditionalRendering();
  updateCreationViewConditionalRendering();
  updateDashboardConditionalRendering();
  updateEmojiSizes();
  updatePreview();
}

// ---- Full render (search filter + grid) ----

export function render(): void {
  const q = (searchEl.value || "").trim().toLowerCase();
  setFiltered(allPatterns.filter(function (p: Pattern) {
    return matchesSearch(p, q);
  }));
  renderGrid();
  updateEmojiSizes();
}
