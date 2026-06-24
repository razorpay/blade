// ========================================
// UI PATTERN DEFINITIONS
// ========================================
// This file contains UI pattern definitions and their associated component keys
// for the Figma UI Pattern Creator plugin.
// Preview images are managed in previewImages.ts

export type Platform = 'desktop' | 'mobile';

export interface UIPattern {
  id: string;
  name: string;
  emoji: string;
  wizard?: boolean;
  disabledOn?: Platform[];
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
}

// Preview image mappings are now in previewImages.ts
// Import them when needed: import { PREVIEW_IMAGE_MAPPINGS, getPreviewImageUrl } from './previewImages';

// ========================================
// DEFAULT UI PATTERNS
// ========================================
export const DEFAULT_UI_PATTERNS: UIPattern[] = [
  {
    id: "dashboard-ui",
    name: "UI Guidelines",
    emoji: "🧭",
    wizard: true,
    variantsByPlatform: {
      desktop: {
        "columnType=Full Width|showAside=True": "c14fdba53146ba3fc16f6cd8e4b9a9af3c6cedc6",
        "columnType=Full Width|showAside=False": "494669df310b5ec62d7b2e0cef93a90396536d5d",
        "columnType=Narrow|showAside=False": "49bf11b8de8d064ecdc8a7c8896110b223873d5a"
      }
    },
    keyByPlatform: {
      mobile: {
        "showAside=True": "ba4215986b792bf1eda4d982770430baeb9d0a81",
        "showAside=False": "6269d0248ffdad3f63be6b7b51816b40a3128a71"
      }
    }
  },
  {
    id: "list-view",
    name: "List View",
    emoji: "📋",
    keyByPlatform: {
      desktop: "4e58eda85dab0fc986c11027bfef6787ed769c14",
      mobile: "83ba54c49c8011abdcf8b117e1b212627f5f78fa"
    }
  },
  {
    id: "detail-view",
    name: "Detail View",
    emoji: "🔎",
    keyByPlatform: {
      desktop: "13137735c7e228012c03aa52041f1b82e744db06",
      mobile: "2d0fab42b2b5ba6f083fbec09adef10cbc2e3648"
    }
  },
  {
    id: "creation-view",
    name: "Creation View",
    emoji: "➕",
    wizard: true,
    variantsByPlatform: {
      desktop: {
        // Single Step Type combinations
        "stepType=Single|viewType=Small Modal|columnType=Full Width|stepperType=StepGroup|content=Default": "109b10c2e108a8e3093cdc224b9e0470dc413878",
        "stepType=Single|viewType=Small Modal|columnType=Full Width|stepperType=StepGroup|content=Selection Cards": "9bdb05857a225c0960057eaf156abd35dcb468ec",
        "stepType=Single|viewType=Medium Modal|columnType=Full Width|stepperType=StepGroup|content=Default": "a4f92d52242e29a8138db40adcde98c39d76433b",
        "stepType=Single|viewType=Medium Modal|columnType=Full Width|stepperType=StepGroup|content=Selection Cards": "acc8b979b27301c3572c121c7d97f21aaaf20038",
        "stepType=Single|viewType=Large Modal|columnType=Full Width|stepperType=StepGroup|content=Default": "3f52509d90f69f7356523e775a6d94868eab5660",
        "stepType=Single|viewType=Large Modal|columnType=Full Width|stepperType=StepGroup|content=Selection Cards": "6672b9d52da4dd8b5e08fd58737a9e6ab7e5a735",
        
        // Multiple Step Type - Medium Modal
        "stepType=Multiple|viewType=Medium Modal|columnType=Full Width|stepperType=StepGroup|content=Default": "de33b294726c3ce5513f3198f93f433c3b6f7acb",
        
        // Multiple Step Type - Large Modal
        "stepType=Multiple|viewType=Large Modal|columnType=Full Width|stepperType=StepGroup|content=Default": "49eedbda7b76c3708e141905f391f307e0ccae26",
        "stepType=Multiple|viewType=Large Modal|columnType=Full Width|stepperType=StepGroup|content=Right Asset": "c8d8596c28982e0c392adf6b9934005f79b080e0",
        
        // Multiple Step Type - Full Page (Full Width)
        "stepType=Multiple|viewType=Full Page|columnType=Full Width|stepperType=StepGroup|content=Default": "9283811d9e71cbee3b1853376948835e381a550c",
        "stepType=Multiple|viewType=Full Page|columnType=Full Width|stepperType=StepGroup|content=Right Asset": "d4229c3c2468e83ea32150481981f84285c60f2e",
        "stepType=Multiple|viewType=Full Page|columnType=Full Width|stepperType=StepGroup|content=Left Asset": "90f331df6db5110ef0346dc1ba3c4f06e209215a",
        "stepType=Multiple|viewType=Full Page|columnType=Full Width|stepperType=Progress Bar|content=Default": "ff262d6981e1d03c05969b4baaf4beb62f1aaae4",
        "stepType=Multiple|viewType=Full Page|columnType=Full Width|stepperType=Progress Bar|content=Right Asset": "336b054f09d89ca297f6d55eba083c8ce2155781",
        
        // Multiple Step Type - Full Page (Narrow) - Content is hidden for Narrow
        "stepType=Multiple|viewType=Full Page|columnType=Narrow|stepperType=StepGroup|content=Default": "f3285f6e7183dd048ed5589a3bb0937469a71da1",
        "stepType=Multiple|viewType=Full Page|columnType=Narrow|stepperType=Progress Bar|content=Default": "c47a5b70700432856ffe8b46afeb5c512fa6c84d"
      }
    },
    keyByPlatform: {
      mobile: {
        "viewType=Bottom Sheet": "e81938a18ce172d0661624a01b036fd5e003d205",
        "viewType=Full Page": "a408b85b594d8f7b89be8e86d075e5021e1747db"
      }
    }
  },
  {
    id: "settings",
    name: "Settings",
    emoji: "⚙️",
    wizard: true,
    variantsByPlatform: {
      desktop: {
        "pageType=HomePage|showTabs=False|supportingElements=None|columnType=narrow": "61c9a69f236c41412b048062d55737b3aa1c64af",
        "pageType=Internal Modules|showTabs=False|supportingElements=None|columnType=narrow": "12c1034c4ff721e19903a4e27c2896131c6ea98e",
        "pageType=Internal Modules|showTabs=False|supportingElements=None|columnType=Full Width": "ba5f40d3d2a0dcdfe39b588083a98bb3a08006cf",
        "pageType=Internal Modules|showTabs=False|supportingElements=Guidance Panel|columnType=narrow": "4d243694a0e2b89637dabda1bfea9ead2850e59f",
        "pageType=Internal Modules|showTabs=False|supportingElements=Preview|columnType=narrow": "94f8b90bdcb56331b90ce5fe7ce3704e51bd0344",
        "pageType=Internal Modules|showTabs=True|supportingElements=None|columnType=narrow": "06e9c9e5e3df2f66a638143304496aba3d1dc8de",
        "pageType=Internal Modules|showTabs=True|supportingElements=None|columnType=Full Width": "2eb0cc91983fdc76d0193f057d35277c561dfdef",
        "pageType=Internal Modules|showTabs=True|supportingElements=Guidance Panel|columnType=narrow": "50f74b7b8d877c509bd7c9e43c0895e40b6e2898",
        "pageType=Internal Modules|showTabs=True|supportingElements=Preview|columnType=narrow": "31b9ab28453d32de0f5277e29c2b9ab3e091ed6c"
      },
      mobile: {
        "pageType=HomePage|showTabs=False|supportingElements=None|columnType=narrow": "351e1350c95140bd9d5e4b06bbad1b107b6c1691",
        "pageType=Internal Modules|showTabs=False|supportingElements=None|columnType=narrow": "c92041d9407c86abb48749f93ffd4b5578bb4b79",
        "pageType=Internal Modules|showTabs=False|supportingElements=Guidance Panel|columnType=narrow": "417e305628d8d91d715a77374a98c03b9bd5c1d5",
        "pageType=Internal Modules|showTabs=False|supportingElements=Preview|columnType=narrow": "e2a000030ebb8d74980c5630bd15bfb3a839784e",
        "pageType=Internal Modules|showTabs=True|supportingElements=None|columnType=narrow": "db212a3dda7e7d2c5b2f43ad937c3c2fec90c35e",
        "pageType=Internal Modules|showTabs=True|supportingElements=Guidance Panel|columnType=narrow": "2bb23de9a4786c31e83ec82a5027e3bba18e0fd2",
        "pageType=Internal Modules|showTabs=True|supportingElements=Preview|columnType=narrow": "3725ac3a1a9a872daf82163b63941b309b94b030"
      }
    }
  },
  {
    id: "modal-template",
    name: "Modal Template",
    emoji: "🪟",
    wizard: true,
    variantsByPlatform: {
      desktop: {
        "size=Large|contentType=Image + Text": "60e2ef205e79c6ef6c992e708ecf4c565d59d800",
        "size=Medium|contentType=Image + Text": "d22cab75d2ca6461ca1c92264a3af097f02b1ef4",
        "size=Medium|contentType=Preview": "cf5e07bff5b7d7c89e13db2c803fed66f8bafd5f",
        "size=Small|contentType=Image + Text": "a5cedfbdaf0d46b6887c48c600947666df6d4df6",
        "size=Small|contentType=Subtle Context": "4dd681acd99f798ad196fb7595a5b1abd7cad6df",
        "size=Small|contentType=Only Text": "d78a237cbc4d36f8ef0645f8570d676fc54f8667"
      }
    },
    keyByPlatform: {
      mobile: "c86dfddf468ca1b4c9b6a5736aa3faeb4b793902"
    }
  },
  {
    id: "coming-soon",
    name: "Coming Soon",
    emoji: "🚀",
    disabledOn: ["desktop", "mobile"],
    keyByPlatform: {
      desktop: "",
      mobile: ""
    }
  }
];

// ========================================
// PREVIEW IMAGE MAPPINGS
// ========================================
// This section defines preview images that will be displayed in the preview window
// based on the selected configuration options. The structure mirrors DEFAULT_UI_PATTERNS
// with the same signature format for easy mapping.
//
// Preview image mappings have been moved to previewImages.ts
// Import with: import { PREVIEW_IMAGE_MAPPINGS, getPreviewImageUrl } from './previewImages';

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get all available patterns
 */
export function getAllPatterns(): UIPattern[] {
  return DEFAULT_UI_PATTERNS;
}

/**
 * Get a specific pattern by ID
 */
export function getPatternById(id: string): UIPattern | undefined {
  return DEFAULT_UI_PATTERNS.find(pattern => pattern.id === id);
}

/**
 * Get patterns filtered by platform availability
 */
export function getPatternsByPlatform(platform: Platform): UIPattern[] {
  return DEFAULT_UI_PATTERNS.filter(pattern => 
    !pattern.disabledOn?.includes(platform)
  );
}

/**
 * Get preview image URL for a pattern configuration
 */
// getPreviewImageUrl function has been moved to previewImages.ts
// Import with: import { getPreviewImageUrl } from './previewImages';

/**
 * Get component key for a pattern configuration
 */
export function getComponentKey(
  patternId: string,
  platform: Platform,
  signature?: string
): string | null {
  const pattern = getPatternById(patternId);
  if (!pattern) return null;

  // For patterns with variants
  if (signature && pattern.variantsByPlatform?.[platform]) {
    return pattern.variantsByPlatform[platform][signature] || null;
  }

  // For simple patterns or mobile variants with signatures
  if (pattern.keyByPlatform?.[platform]) {
    const platformMapping = pattern.keyByPlatform[platform];
    
    if (typeof platformMapping === 'string') {
      return platformMapping;
    } else if (signature && typeof platformMapping === 'object') {
      return platformMapping[signature] || null;
    }
  }

  return null;
}
