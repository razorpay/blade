// ========================================
// CONDITIONAL RENDERING FUNCTIONS
// ========================================

import {
  platform,
  selected,
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

export function updateConditionalRendering(): void {
  if (selected && selected.id === "settings") {
    const pageTypeValue = optPageType.value;
    const supportingElementsValue = optSupportingElements.value;

    if (pageTypeValue === "HomePage") {
      optShowTabs.parentElement!.style.display = "none";
      optSupportingElements.parentElement!.style.display = "none";
      optColumnType.parentElement!.style.display = "none";
    } else {
      optShowTabs.parentElement!.style.display = "block";
      optSupportingElements.parentElement!.style.display = "block";

      if (platform === "mobile") {
        optColumnType.parentElement!.style.display = "none";
      } else {
        if (supportingElementsValue === "None") {
          optColumnType.parentElement!.style.display = "block";
        } else {
          optColumnType.parentElement!.style.display = "none";
        }
      }
    }
  }
}

export function updateConfigurationOptions(): void {
  if (selected && selected.id === "modal-template") {
    optPageType.parentElement!.style.display = "none";
    optShowTabs.parentElement!.style.display = "none";
    optSupportingElements.parentElement!.style.display = "none";
    optColumnType.parentElement!.style.display = "none";
    optSize.parentElement!.style.display = "block";
    optContentType.parentElement!.style.display = "block";
    optViewType.parentElement!.style.display = "none";
    if (optSupportingElement) optSupportingElement.parentElement!.style.display = "none";
    optColumnTypeDashboard.parentElement!.style.display = "none";
    optShowAside.parentElement!.style.display = "none";
    // Hide creation-view specific options
    if (optStepType) optStepType.parentElement!.style.display = "none";
    if (optStepperType) optStepperType.parentElement!.style.display = "none";
    if (optContent) optContent.parentElement!.style.display = "none";
  } else if (selected && selected.id === "creation-view") {
    optPageType.parentElement!.style.display = "none";
    optShowTabs.parentElement!.style.display = "none";
    optSupportingElements.parentElement!.style.display = "none";
    optSize.parentElement!.style.display = "none";
    optContentType.parentElement!.style.display = "none";
    if (optSupportingElement) optSupportingElement.parentElement!.style.display = "none";
    optColumnTypeDashboard.parentElement!.style.display = "none";
    optShowAside.parentElement!.style.display = "none";

    if (platform === "mobile") {
      optStepType.parentElement!.style.display = "none";
      optViewType.parentElement!.style.display = "block";
      optColumnType.parentElement!.style.display = "none";
      optStepperType.parentElement!.style.display = "none";
      optContent.parentElement!.style.display = "none";
    } else {
      // Desktop: show all new options
      optStepType.parentElement!.style.display = "block";
      optViewType.parentElement!.style.display = "block";
      optColumnType.parentElement!.style.display = "block";
      optStepperType.parentElement!.style.display = "block";
      optContent.parentElement!.style.display = "block";
    }
  } else if (selected && selected.id === "dashboard-ui") {
    optPageType.parentElement!.style.display = "none";
    optShowTabs.parentElement!.style.display = "none";
    optSupportingElements.parentElement!.style.display = "none";
    optColumnType.parentElement!.style.display = "none";
    optSize.parentElement!.style.display = "none";
    optContentType.parentElement!.style.display = "none";
    optViewType.parentElement!.style.display = "none";
    if (optSupportingElement) optSupportingElement.parentElement!.style.display = "none";
    optColumnTypeDashboard.parentElement!.style.display = "block";
    optShowAside.parentElement!.style.display = "block";
    // Hide creation-view specific options
    if (optStepType) optStepType.parentElement!.style.display = "none";
    if (optStepperType) optStepperType.parentElement!.style.display = "none";
    if (optContent) optContent.parentElement!.style.display = "none";
  } else {
    // Settings pattern
    optPageType.parentElement!.style.display = "block";
    optShowTabs.parentElement!.style.display = "block";
    optSupportingElements.parentElement!.style.display = "block";
    if (platform === "mobile") {
      optColumnType.parentElement!.style.display = "none";
    } else {
      optColumnType.parentElement!.style.display = "block";
    }
    optSize.parentElement!.style.display = "none";
    optContentType.parentElement!.style.display = "none";
    optViewType.parentElement!.style.display = "none";
    if (optSupportingElement) optSupportingElement.parentElement!.style.display = "none";
    optColumnTypeDashboard.parentElement!.style.display = "none";
    optShowAside.parentElement!.style.display = "none";
    // Hide creation-view specific options
    if (optStepType) optStepType.parentElement!.style.display = "none";
    if (optStepperType) optStepperType.parentElement!.style.display = "none";
    if (optContent) optContent.parentElement!.style.display = "none";
  }
}

export function updateModalConditionalRendering(): void {
  if (selected && selected.id === "modal-template") {
    const sizeValue = optSize.value;
    const contentTypeSelect = optContentType;
    const currentValue = contentTypeSelect.value;

    contentTypeSelect.innerHTML = "";

    if (sizeValue === "Large") {
      contentTypeSelect.innerHTML = '<option value="Image + Text">Image + Text</option>';
    } else if (sizeValue === "Medium") {
      contentTypeSelect.innerHTML =
        '<option value="Image + Text">Image + Text</option><option value="Preview">Preview</option>';
    } else if (sizeValue === "Small") {
      contentTypeSelect.innerHTML =
        '<option value="Image + Text">Image + Text</option><option value="Subtle Context">Subtle Context</option><option value="Only Text">Only Text</option>';
    }

    if (currentValue && contentTypeSelect.querySelector('option[value="' + currentValue + '"]')) {
      contentTypeSelect.value = currentValue;
    } else {
      contentTypeSelect.value = contentTypeSelect.options[0].value;
    }
  }
}

export function updateCreationViewConditionalRendering(): void {
  if (selected && selected.id === "creation-view") {
    if (platform === "mobile") {
      optStepType.parentElement!.style.display = "none";
      optColumnType.parentElement!.style.display = "none";
      optStepperType.parentElement!.style.display = "none";
      optContent.parentElement!.style.display = "none";

      const viewTypeSelect = optViewType;
      const currentValue = viewTypeSelect.value;
      viewTypeSelect.innerHTML =
        '<option value="Bottom Sheet">Bottom Sheet</option><option value="Full Page">Full Page</option>';

      if (currentValue === "Bottom Sheet" || currentValue === "Full Page") {
        viewTypeSelect.value = currentValue;
      } else {
        viewTypeSelect.value = "Bottom Sheet";
      }
    } else {
      // Desktop: conditional rendering based on Step Type
      const stepTypeValue = optStepType.value;

      if (stepTypeValue === "Single") {
        // Single: hide Column Type and Stepper Type
        optColumnType.parentElement!.style.display = "none";
        optStepperType.parentElement!.style.display = "none";

        // Update View Type options - remove Full Page
        const viewTypeSelect = optViewType;
        const currentViewValue = viewTypeSelect.value;
        viewTypeSelect.innerHTML =
          '<option value="Small Modal">Small Modal</option><option value="Medium Modal">Medium Modal</option><option value="Large Modal">Large Modal</option>';

        // Preserve value if it's still valid, otherwise default to Small Modal
        if (
          currentViewValue === "Small Modal" ||
          currentViewValue === "Medium Modal" ||
          currentViewValue === "Large Modal"
        ) {
          viewTypeSelect.value = currentViewValue;
        } else {
          viewTypeSelect.value = "Small Modal";
        }

        // Update Content options - remove Right Asset and Left Asset
        const contentSelect = optContent;
        const currentContentValue = contentSelect.value;
        contentSelect.innerHTML =
          '<option value="Default">Default</option><option value="Selection Cards">Selection Cards</option>';

        // Preserve value if it's still valid, otherwise default to Default
        if (currentContentValue === "Default" || currentContentValue === "Selection Cards") {
          contentSelect.value = currentContentValue;
        } else {
          contentSelect.value = "Default";
        }
      } else if (stepTypeValue === "Multiple") {
        // Update View Type options - remove Small Modal
        const viewTypeSelect = optViewType;
        const currentViewValue = viewTypeSelect.value;
        viewTypeSelect.innerHTML =
          '<option value="Medium Modal">Medium Modal</option><option value="Large Modal">Large Modal</option><option value="Full Page">Full Page</option>';

        // Preserve value if it's still valid, otherwise default to Medium Modal
        if (
          currentViewValue === "Medium Modal" ||
          currentViewValue === "Large Modal" ||
          currentViewValue === "Full Page"
        ) {
          viewTypeSelect.value = currentViewValue;
        } else {
          viewTypeSelect.value = "Medium Modal";
        }

        // Column Type: only show when View Type = Full Page
        const viewTypeValue = optViewType.value;
        if (viewTypeValue === "Full Page") {
          optColumnType.parentElement!.style.display = "block";
        } else {
          optColumnType.parentElement!.style.display = "none";
        }

        // Stepper Type: only show when View Type = Full Page
        if (viewTypeValue === "Full Page") {
          optStepperType.parentElement!.style.display = "block";
        } else {
          optStepperType.parentElement!.style.display = "none";
        }

        // Content: conditional visibility and options based on View Type, Stepper Type, and Column Type
        const contentSelect = optContent;
        const currentContentValue = contentSelect.value;
        const stepperTypeValue = optStepperType ? optStepperType.value : "";
        const columnTypeValue = optColumnType ? optColumnType.value : "";

        // Hide Content option when View Type = Medium Modal (for Multiple step type)
        if (viewTypeValue === "Medium Modal") {
          optContent.parentElement!.style.display = "none";
        } else if (viewTypeValue === "Full Page" && columnTypeValue === "Narrow") {
          // Hide Content option when View Type = Full Page and Column Type = Narrow
          optContent.parentElement!.style.display = "none";
        } else {
          optContent.parentElement!.style.display = "block";

          if (viewTypeValue === "Large Modal") {
            // Large Modal: remove Selection Cards and Left Asset
            contentSelect.innerHTML =
              '<option value="Default">Default</option><option value="Right Asset">Right Asset</option>';
          } else if (viewTypeValue === "Full Page") {
            // Full Page: remove Selection Cards
            if (stepperTypeValue === "Progress Bar") {
              // Full Page + Progress Bar: remove Left Asset
              contentSelect.innerHTML =
                '<option value="Default">Default</option><option value="Right Asset">Right Asset</option>';
            } else {
              // Full Page (other stepper types): show Default, Right Asset, Left Asset
              contentSelect.innerHTML =
                '<option value="Default">Default</option><option value="Right Asset">Right Asset</option><option value="Left Asset">Left Asset</option>';
            }
          } else {
            // Fallback: show all options
            contentSelect.innerHTML =
              '<option value="Default">Default</option><option value="Selection Cards">Selection Cards</option><option value="Right Asset">Right Asset</option><option value="Left Asset">Left Asset</option>';
          }

          // Preserve value if it's still valid, otherwise default to Default
          if (contentSelect.querySelector('option[value="' + currentContentValue + '"]')) {
            contentSelect.value = currentContentValue;
          } else {
            contentSelect.value = "Default";
          }
        }
      }
    }
  }
}

export function updateDashboardConditionalRendering(): void {
  if (selected && selected.id === "dashboard-ui") {
    const columnTypeValue = optColumnTypeDashboard.value;

    if (platform === "mobile") {
      optColumnTypeDashboard.parentElement!.style.display = "none";
      optShowAside.parentElement!.style.display = "block";
    } else {
      optColumnTypeDashboard.parentElement!.style.display = "block";

      if (columnTypeValue === "Narrow") {
        optShowAside.parentElement!.style.display = "none";
      } else {
        optShowAside.parentElement!.style.display = "block";
      }
    }
  }
}
