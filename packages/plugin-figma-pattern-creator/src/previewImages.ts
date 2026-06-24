// ========================================
// PREVIEW IMAGE MAPPINGS
// ========================================
// This file contains all preview image URLs for UI patterns
// Used to display pattern previews in the plugin interface

import type { Platform } from './componentKeys';

export interface PreviewImageMapping {
  [patternId: string]: {
    variantsByPlatform?: {
      [platform in Platform]?: {
        [signature: string]: string;
      };
    };
    keyByPlatform?: {
      [platform in Platform]?: string | {
        [signature: string]: string;
      };
    };
  };
}

// ========================================
// PREVIEW IMAGE URLS
// ========================================
// These URLs point to GitHub-hosted preview images for each pattern variant.
// The structure mirrors the component key structure in componentKeys.ts
//
// Example signatures (must match the pattern definitions in componentKeys.ts):
// Dashboard UI Desktop: "columnType=Full Width|showAside=True"
// Settings Desktop: "pageType=HomePage|showTabs=False|supportingElements=None|columnType=narrow"
// Modal Template Desktop: "size=Large|contentType=Image + Text"
export const PREVIEW_IMAGE_MAPPINGS: PreviewImageMapping = {
  "dashboard-ui": {
    variantsByPlatform: {
      desktop: {
        "columnType=Full Width|showAside=True": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/dashboard-ui/Dashboard%20UI%2003.png?raw=true",
        "columnType=Full Width|showAside=False": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/dashboard-ui/Dashboard%20UI%2005.png?raw=true", 
        "columnType=Narrow|showAside=False": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/dashboard-ui/Dashboard%20UI%2004.png?raw=true"
      }
    },
    keyByPlatform: {
      mobile: {
        "showAside=True": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/dashboard-ui/Dashboard%20UI%2002.png?raw=true",
        "showAside=False": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/dashboard-ui/Dashboard%20UI%2001.png?raw=true"
      }
    }
  },
  "list-view": {
    keyByPlatform: {
      desktop: "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/list-view/List%20View%2001.png?raw=true",
      mobile: "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/list-view/List%20View%2002.png?raw=true"
    }
  },
  "detail-view": {
    keyByPlatform: {
      desktop: "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/detail-view/Detail%20View%2001.png?raw=true", 
      mobile: "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/detail-view/Detail%20View%2002.png?raw=true"
    }
  },
  "creation-view": {
    variantsByPlatform: {
      desktop: {
        // Single Step Type combinations
        "stepType=Single|viewType=Small Modal|columnType=Full Width|stepperType=StepGroup|content=Default": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2003.png?raw=true",
        "stepType=Single|viewType=Small Modal|columnType=Full Width|stepperType=StepGroup|content=Selection Cards": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2012.png?raw=true",
        "stepType=Single|viewType=Medium Modal|columnType=Full Width|stepperType=StepGroup|content=Default": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2002.png?raw=true",
        "stepType=Single|viewType=Medium Modal|columnType=Full Width|stepperType=StepGroup|content=Selection Cards": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2013.png?raw=true",
        "stepType=Single|viewType=Large Modal|columnType=Full Width|stepperType=StepGroup|content=Default": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2015.png?raw=true",
        "stepType=Single|viewType=Large Modal|columnType=Full Width|stepperType=StepGroup|content=Selection Cards": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2016.png?raw=true",
        
        // Multiple Step Type - Medium Modal (Content is hidden, using Default as placeholder)
        "stepType=Multiple|viewType=Medium Modal|columnType=Full Width|stepperType=StepGroup|content=Default": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2014.png?raw=true",
        
        // Multiple Step Type - Large Modal (Selection Cards removed)
        "stepType=Multiple|viewType=Large Modal|columnType=Full Width|stepperType=StepGroup|content=Default": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2017.png?raw=true",
        "stepType=Multiple|viewType=Large Modal|columnType=Full Width|stepperType=StepGroup|content=Right Asset": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2018.png?raw=true",
        
        // Multiple Step Type - Full Page (Full Width)
        "stepType=Multiple|viewType=Full Page|columnType=Full Width|stepperType=StepGroup|content=Default": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2008.png?raw=true",
        "stepType=Multiple|viewType=Full Page|columnType=Full Width|stepperType=StepGroup|content=Right Asset": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2006.png?raw=true",
        "stepType=Multiple|viewType=Full Page|columnType=Full Width|stepperType=StepGroup|content=Left Asset": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2005.png?raw=true",
        "stepType=Multiple|viewType=Full Page|columnType=Full Width|stepperType=Progress Bar|content=Default": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2010.png?raw=true",
        "stepType=Multiple|viewType=Full Page|columnType=Full Width|stepperType=Progress Bar|content=Right Asset": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2011.png?raw=true",
        
        // Multiple Step Type - Full Page (Narrow) - Content is hidden for Narrow
        "stepType=Multiple|viewType=Full Page|columnType=Narrow|stepperType=StepGroup|content=Default": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2007.png?raw=true",
        "stepType=Multiple|viewType=Full Page|columnType=Narrow|stepperType=Progress Bar|content=Default": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%209.png?raw=true"
      }
    },
    keyByPlatform: {
      mobile: {
        "viewType=Bottom Sheet": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2001.png?raw=true",
        "viewType=Full Page": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/creation-view/Creation%20View%2004.png?raw=true"
      }
    }
  },
  "settings": {
    variantsByPlatform: {
      desktop: {
        "pageType=HomePage|showTabs=False|supportingElements=None|columnType=narrow": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2016.png?raw=true",
        "pageType=Internal Modules|showTabs=False|supportingElements=None|columnType=narrow": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2006.png?raw=true",
        "pageType=Internal Modules|showTabs=False|supportingElements=None|columnType=Full Width": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2015.png?raw=true",
        "pageType=Internal Modules|showTabs=False|supportingElements=Guidance Panel|columnType=narrow": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2004.png?raw=true",
        "pageType=Internal Modules|showTabs=False|supportingElements=Preview|columnType=narrow": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2005.png?raw=true",
        "pageType=Internal Modules|showTabs=True|supportingElements=None|columnType=narrow": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2001.png?raw=true",
        "pageType=Internal Modules|showTabs=True|supportingElements=None|columnType=Full Width": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2014.png?raw=true",
        "pageType=Internal Modules|showTabs=True|supportingElements=Guidance Panel|columnType=narrow": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2002.png?raw=true",
        "pageType=Internal Modules|showTabs=True|supportingElements=Preview|columnType=narrow": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2003.png?raw=true"
      },
      mobile: {
        "pageType=HomePage|showTabs=False|supportingElements=None|columnType=narrow": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2013.png?raw=true",
        "pageType=Internal Modules|showTabs=False|supportingElements=None|columnType=narrow": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2012.png?raw=true",
        "pageType=Internal Modules|showTabs=False|supportingElements=Guidance Panel|columnType=narrow": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2011.png?raw=true",
        "pageType=Internal Modules|showTabs=False|supportingElements=Preview|columnType=narrow": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2010.png?raw=true",
        "pageType=Internal Modules|showTabs=True|supportingElements=None|columnType=narrow": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2009.png?raw=true",
        "pageType=Internal Modules|showTabs=True|supportingElements=Guidance Panel|columnType=narrow": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2008.png?raw=true",
        "pageType=Internal Modules|showTabs=True|supportingElements=Preview|columnType=narrow": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/settings/Settings%2007.png?raw=true"
      }
    }
  },
  "modal-template": {
    variantsByPlatform: {
      desktop: {
        "size=Large|contentType=Image + Text": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/modal-template/Modal%20Template%2004.png?raw=true",
        "size=Medium|contentType=Image + Text": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/modal-template/Modal%20Template%2005.png?raw=true",
        "size=Medium|contentType=Preview": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/modal-template/Modal%20Template%2003.png?raw=true",
        "size=Small|contentType=Image + Text": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/modal-template/Modal%20Template%2002.png?raw=true",
        "size=Small|contentType=Subtle Context": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/modal-template/Modal%20Template%2006.png?raw=true",
        "size=Small|contentType=Only Text": "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/modal-template/Modal%20Template%2007.png?raw=true"
      }
    },
    keyByPlatform: {
      mobile: "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/modal-template/Modal%20Template%2001.png?raw=true"
    }
  }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get preview image URL for a specific pattern and configuration
 */
export function getPreviewImageUrl(
  patternId: string, 
  platform: Platform, 
  signature?: string
): string | undefined {
  const mapping = PREVIEW_IMAGE_MAPPINGS[patternId];
  if (!mapping) return undefined;

  // Check variantsByPlatform first (for wizard patterns)
  if (mapping.variantsByPlatform?.[platform] && signature) {
    const variants = mapping.variantsByPlatform[platform];
    if (typeof variants === 'object' && variants[signature]) {
      return variants[signature];
    }
  }

  // Fall back to keyByPlatform (for simple patterns)
  if (mapping.keyByPlatform?.[platform]) {
    const platformMapping = mapping.keyByPlatform[platform];
    
    if (typeof platformMapping === 'string') {
      return platformMapping;
    } else if (typeof platformMapping === 'object' && signature) {
      return platformMapping[signature];
    }
  }

  return undefined;
}

/**
 * Get all available preview images for a pattern
 */
export function getAllPreviewImages(patternId: string): { platform: Platform; signature?: string; url: string }[] {
  const mapping = PREVIEW_IMAGE_MAPPINGS[patternId];
  if (!mapping) return [];

  const results: { platform: Platform; signature?: string; url: string }[] = [];

  // Add variant images
  if (mapping.variantsByPlatform) {
    Object.entries(mapping.variantsByPlatform).forEach(([platform, variants]) => {
      if (variants && typeof variants === 'object') {
        Object.entries(variants).forEach(([signature, url]) => {
          results.push({ platform: platform as Platform, signature, url });
        });
      }
    });
  }

  // Add key-based images
  if (mapping.keyByPlatform) {
    Object.entries(mapping.keyByPlatform).forEach(([platform, value]) => {
      if (typeof value === 'string') {
        results.push({ platform: platform as Platform, url: value });
      } else if (typeof value === 'object') {
        Object.entries(value).forEach(([signature, url]) => {
          results.push({ platform: platform as Platform, signature, url });
        });
      }
    });
  }

  return results;
}
