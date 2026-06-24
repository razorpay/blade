// ========================================
// SIGNATURE COMPUTATION
// ========================================

import { platform, selected, optPageType, optShowTabs, optSupportingElements, optColumnType, optSize, optContentType, optViewType, optColumnTypeDashboard, optShowAside, optStepType, optStepperType, optContent } from "./state";

export function computeSignature(): string {
  if (selected && selected.id === "modal-template") {
    return "size=" + optSize.value + "|contentType=" + optContentType.value;
  } else if (selected && selected.id === "creation-view") {
    if (platform === "mobile") {
      // Mobile only uses viewType for signature
      return "viewType=" + optViewType.value;
    } else {
      // Desktop uses new signature structure
      return (
        "stepType=" + optStepType.value +
        "|viewType=" + optViewType.value +
        "|columnType=" + optColumnType.value +
        "|stepperType=" + optStepperType.value +
        "|content=" + optContent.value
      );
    }
  } else if (selected && selected.id === "dashboard-ui") {
    if (platform === "mobile") {
      return "showAside=" + optShowAside.value;
    } else {
      const columnType = optColumnTypeDashboard.value;
      const showAside = columnType === "Narrow" ? "False" : optShowAside.value;
      return "columnType=" + columnType + "|showAside=" + showAside;
    }
  } else if (selected && selected.id === "settings") {
    const pageType = optPageType.value;
    if (pageType === "HomePage") {
      return "pageType=HomePage|showTabs=False|supportingElements=None|columnType=narrow";
    } else {
      const supportingElements = optSupportingElements.value;
      let columnType: string;

      if (platform === "mobile") {
        columnType = "narrow";
      } else {
        if (supportingElements === "Guidance Panel" || supportingElements === "Preview") {
          columnType = "narrow";
        } else {
          // Normalize columnType: "Narrow" -> "narrow", "Full Width" stays as is
          const columnTypeValue = optColumnType.value;
          columnType = columnTypeValue === "Narrow" ? "narrow" : columnTypeValue;
        }
      }

      return (
        "pageType=" + pageType +
        "|showTabs=" + optShowTabs.value +
        "|supportingElements=" + supportingElements +
        "|columnType=" + columnType
      );
    }
  } else {
    return (
      "pageType=" + optPageType.value +
      "|showTabs=" + optShowTabs.value +
      "|supportingElements=" + optSupportingElements.value +
      "|columnType=" + optColumnType.value
    );
  }
}
