// ========================================
// PREVIEW IMAGE RENDERING
// ========================================

import type { Platform } from "./types";
import { selected, platform } from "./state";
import { computeSignature } from "./signature";

// ---- Preview Image Mappings ----

interface PlatformVariants {
  [signature: string]: string;
}

interface PreviewMapping {
  variantsByPlatform?: {
    desktop?: PlatformVariants;
    mobile?: PlatformVariants;
  };
  keyByPlatform?: {
    desktop?: string | PlatformVariants;
    mobile?: string | PlatformVariants;
  };
}

const PREVIEW_IMAGE_MAPPINGS: { [patternId: string]: PreviewMapping } = {
  "dashboard-ui": {
    variantsByPlatform: {
      desktop: {
        "columnType=Full Width|showAside=True":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/dashboard-ui/Dashboard%20UI%2003.png?raw=true",
        "columnType=Full Width|showAside=False":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/dashboard-ui/Dashboard%20UI%2005.png?raw=true",
        "columnType=Narrow|showAside=False":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/dashboard-ui/Dashboard%20UI%2004.png?raw=true",
      },
    },
    keyByPlatform: {
      mobile: {
        "showAside=True":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/dashboard-ui/Dashboard%20UI%2002.png?raw=true",
        "showAside=False":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/dashboard-ui/Dashboard%20UI%2001.png?raw=true",
      },
    },
  },
  "list-view": {
    keyByPlatform: {
      desktop:
        "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/list-view/List%20View%2001.png?raw=true",
      mobile:
        "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/list-view/List%20View%2002.png?raw=true",
    },
  },
  "detail-view": {
    keyByPlatform: {
      desktop:
        "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/detail-view/Detail%20View%2001.png?raw=true",
      mobile:
        "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/detail-view/Detail%20View%2002.png?raw=true",
    },
  },
  "creation-view": {
    variantsByPlatform: {
      desktop: {
        // Single Step Type combinations
        "stepType=Single|viewType=Small Modal|columnType=Full Width|stepperType=StepGroup|content=Default":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2003.png?raw=true",
        "stepType=Single|viewType=Small Modal|columnType=Full Width|stepperType=StepGroup|content=Selection Cards":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2012.png?raw=true",
        "stepType=Single|viewType=Medium Modal|columnType=Full Width|stepperType=StepGroup|content=Default":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2002.png?raw=true",
        "stepType=Single|viewType=Medium Modal|columnType=Full Width|stepperType=StepGroup|content=Selection Cards":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2013.png?raw=true",
        "stepType=Single|viewType=Large Modal|columnType=Full Width|stepperType=StepGroup|content=Default":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2015.png?raw=true",
        "stepType=Single|viewType=Large Modal|columnType=Full Width|stepperType=StepGroup|content=Selection Cards":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2016.png?raw=true",

        // Multiple Step Type - Medium Modal (Content is hidden, using Default as placeholder)
        "stepType=Multiple|viewType=Medium Modal|columnType=Full Width|stepperType=StepGroup|content=Default":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2014.png?raw=true",

        // Multiple Step Type - Large Modal (Selection Cards removed)
        "stepType=Multiple|viewType=Large Modal|columnType=Full Width|stepperType=StepGroup|content=Default":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2017.png?raw=true",
        "stepType=Multiple|viewType=Large Modal|columnType=Full Width|stepperType=StepGroup|content=Right Asset":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2018.png?raw=true",

        // Multiple Step Type - Full Page (Full Width)
        "stepType=Multiple|viewType=Full Page|columnType=Full Width|stepperType=StepGroup|content=Default":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2008.png?raw=true",
        "stepType=Multiple|viewType=Full Page|columnType=Full Width|stepperType=StepGroup|content=Right Asset":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2006.png?raw=true",
        "stepType=Multiple|viewType=Full Page|columnType=Full Width|stepperType=StepGroup|content=Left Asset":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2005.png?raw=true",
        "stepType=Multiple|viewType=Full Page|columnType=Full Width|stepperType=Progress Bar|content=Default":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2010.png?raw=true",
        "stepType=Multiple|viewType=Full Page|columnType=Full Width|stepperType=Progress Bar|content=Right Asset":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2011.png?raw=true",

        // Multiple Step Type - Full Page (Narrow) - Content is hidden for Narrow
        "stepType=Multiple|viewType=Full Page|columnType=Narrow|stepperType=StepGroup|content=Default":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2007.png?raw=true",
        "stepType=Multiple|viewType=Full Page|columnType=Narrow|stepperType=Progress Bar|content=Default":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%209.png?raw=true",
      },
    },
    keyByPlatform: {
      mobile: {
        "viewType=Bottom Sheet":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2001.png?raw=true",
        "viewType=Full Page":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2004.png?raw=true",
      },
    },
  },
  settings: {
    variantsByPlatform: {
      desktop: {
        "pageType=HomePage|showTabs=False|supportingElements=None|columnType=narrow":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2016.png?raw=true",
        "pageType=Internal Modules|showTabs=False|supportingElements=None|columnType=narrow":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2006.png?raw=true",
        "pageType=Internal Modules|showTabs=False|supportingElements=None|columnType=Full Width":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2015.png?raw=true",
        "pageType=Internal Modules|showTabs=False|supportingElements=Guidance Panel|columnType=narrow":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2004.png?raw=true",
        "pageType=Internal Modules|showTabs=False|supportingElements=Preview|columnType=narrow":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2005.png?raw=true",
        "pageType=Internal Modules|showTabs=True|supportingElements=None|columnType=narrow":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2001.png?raw=true",
        "pageType=Internal Modules|showTabs=True|supportingElements=None|columnType=Full Width":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2014.png?raw=true",
        "pageType=Internal Modules|showTabs=True|supportingElements=Guidance Panel|columnType=narrow":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2002.png?raw=true",
        "pageType=Internal Modules|showTabs=True|supportingElements=Preview|columnType=narrow":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2003.png?raw=true",
      },
      mobile: {
        "pageType=HomePage|showTabs=False|supportingElements=None|columnType=narrow":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2013.png?raw=true",
        "pageType=Internal Modules|showTabs=False|supportingElements=None|columnType=narrow":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2012.png?raw=true",
        "pageType=Internal Modules|showTabs=False|supportingElements=Guidance Panel|columnType=narrow":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2011.png?raw=true",
        "pageType=Internal Modules|showTabs=False|supportingElements=Preview|columnType=narrow":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2010.png?raw=true",
        "pageType=Internal Modules|showTabs=True|supportingElements=None|columnType=narrow":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2009.png?raw=true",
        "pageType=Internal Modules|showTabs=True|supportingElements=Guidance Panel|columnType=narrow":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2008.png?raw=true",
        "pageType=Internal Modules|showTabs=True|supportingElements=Preview|columnType=narrow":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2007.png?raw=true",
      },
    },
  },
  "modal-template": {
    variantsByPlatform: {
      desktop: {
        "size=Large|contentType=Image + Text":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/modal-template/Modal%20Template%2004.png?raw=true",
        "size=Medium|contentType=Image + Text":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/modal-template/Modal%20Template%2005.png?raw=true",
        "size=Medium|contentType=Preview":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/modal-template/Modal%20Template%2003.png?raw=true",
        "size=Small|contentType=Image + Text":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/modal-template/Modal%20Template%2002.png?raw=true",
        "size=Small|contentType=Subtle Context":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/modal-template/Modal%20Template%2006.png?raw=true",
        "size=Small|contentType=Only Text":
          "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/modal-template/Modal%20Template%2007.png?raw=true",
      },
    },
    keyByPlatform: {
      mobile:
        "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/modal-template/Modal%20Template%2001.png?raw=true",
    },
  },
};

// ---- Preview URL Lookup ----

export function getPreviewImageUrl(
  patternId: string,
  currentPlatform: Platform,
  signature?: string
): string | undefined {
  const mapping = PREVIEW_IMAGE_MAPPINGS[patternId];
  if (!mapping) return undefined;

  // For wizard patterns, compute signature and look up in variantsByPlatform
  if (selected && selected.wizard) {
    const sig = signature || computeSignature();

    // Check variantsByPlatform first
    if (mapping.variantsByPlatform && mapping.variantsByPlatform[currentPlatform] && sig) {
      const variants = mapping.variantsByPlatform[currentPlatform]!;
      if (variants[sig]) {
        return variants[sig];
      }
    }

    // Fall back to keyByPlatform for mobile patterns with signatures
    if (mapping.keyByPlatform && mapping.keyByPlatform[currentPlatform]) {
      const platformMapping = mapping.keyByPlatform[currentPlatform];
      if (typeof platformMapping === "object" && sig && (platformMapping as PlatformVariants)[sig]) {
        return (platformMapping as PlatformVariants)[sig];
      }
    }
  }

  // For simple patterns, use keyByPlatform directly
  if (mapping.keyByPlatform && mapping.keyByPlatform[currentPlatform]) {
    const platformMapping = mapping.keyByPlatform[currentPlatform];
    if (typeof platformMapping === "string") {
      return platformMapping;
    }
  }

  return undefined;
}

// ---- Preview DOM Update ----

export function updatePreview(): void {
  const previewContent = document.querySelector(".preview-content") as HTMLElement | null;
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
  const thumbs = document.querySelectorAll(".thumb");
  thumbs.forEach(function (thumb) {
    if (platform === "mobile") {
      (thumb as HTMLElement).classList.add("mobile");
    } else {
      (thumb as HTMLElement).classList.remove("mobile");
    }
  });
}
