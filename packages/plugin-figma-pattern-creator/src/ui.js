// ========================================
// UI PATTERN CREATOR - MAIN UI LOGIC
// ========================================
// This file contains all the JavaScript logic for the Figma plugin UI

(function() {
  'use strict';

  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  // Use built-in patterns
  var allPatterns = Array.isArray(window.DEFAULT_UI_PATTERNS) ? window.DEFAULT_UI_PATTERNS.slice() : [];

  // Application state
  var platform = "desktop";
  var filtered = allPatterns.slice();
  var selected = null;

  // ========================================
  // DOM ELEMENT REFERENCES
  // ========================================
  
  var gridEl = document.getElementById("grid");
  var emptyEl = document.getElementById("empty");
  var emptyMsgEl = document.getElementById("emptyMsg");
  var searchEl = document.getElementById("search");
  var createBtn = document.getElementById("createBtn");
  var step1El = document.getElementById("step1");
  var step2El = document.getElementById("step2");
  var wizardNameEl = document.getElementById("wizardPatternName");
  var optPageType = document.getElementById("opt_pageType");
  var optShowTabs = document.getElementById("opt_showTabs");
  var optSupportingElements = document.getElementById("opt_supportingElements");
  var optColumnType = document.getElementById("opt_columnType");
  var optSize = document.getElementById("opt_size");
  var optContentType = document.getElementById("opt_contentType");
  var optViewType = document.getElementById("opt_viewType");
  var optSupportingElement = document.getElementById("opt_supportingElement"); // Legacy - may not exist
  var optColumnTypeDashboard = document.getElementById("opt_columnType_dashboard");
  var optShowAside = document.getElementById("opt_showAside");
  var optStepType = document.getElementById("opt_stepType");
  var optStepperType = document.getElementById("opt_stepperType");
  var optContent = document.getElementById("opt_content");

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================
  
  function platformDisabled(p) { 
    return (p.disabledOn || []).indexOf(platform) >= 0; 
  }
  
  function matchesSearch(p, q) { 
    if (!q) return true; 
    q = q.toLowerCase(); 
    return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q); 
  }
  
  function platformLabel() { 
    return platform === "mobile" ? "Mobile" : "Desktop"; 
  }

  // ========================================
  // SIGNATURE COMPUTATION
  // ========================================
  
  function computeSignature() {
    if (selected && selected.id === "modal-template") {
      return "size=" + optSize.value + "|contentType=" + optContentType.value;
    } else if (selected && selected.id === "creation-view") {
      if (platform === "mobile") {
        // Mobile only uses viewType for signature
        return "viewType=" + optViewType.value;
      } else {
        // Desktop uses new signature structure
        return "stepType=" + optStepType.value + "|viewType=" + optViewType.value + "|columnType=" + optColumnType.value + "|stepperType=" + optStepperType.value + "|content=" + optContent.value;
      }
    } else if (selected && selected.id === "dashboard-ui") {
      if (platform === "mobile") {
        return "showAside=" + optShowAside.value;
      } else {
        var columnType = optColumnTypeDashboard.value;
        var showAside = columnType === "Narrow" ? "False" : optShowAside.value;
        return "columnType=" + columnType + "|showAside=" + showAside;
      }
    } else if (selected && selected.id === "settings") {
      var pageType = optPageType.value;
      if (pageType === "HomePage") {
        return "pageType=HomePage|showTabs=False|supportingElements=None|columnType=narrow";
      } else {
        var supportingElements = optSupportingElements.value;
        var columnType;
        
        if (platform === "mobile") {
          columnType = "narrow";
        } else {
          if (supportingElements === "Guidance Panel" || supportingElements === "Preview") {
            columnType = "narrow";
          } else {
            // Normalize columnType: "Narrow" -> "narrow", "Full Width" stays as is
            var columnTypeValue = optColumnType.value;
            columnType = columnTypeValue === "Narrow" ? "narrow" : columnTypeValue;
          }
        }
        
        return "pageType=" + pageType + "|showTabs=" + optShowTabs.value + "|supportingElements=" + supportingElements + "|columnType=" + columnType;
      }
    } else {
      return "pageType=" + optPageType.value + "|showTabs=" + optShowTabs.value + "|supportingElements=" + optSupportingElements.value + "|columnType=" + optColumnType.value;
    }
  }

  // ========================================
  // COMPONENT KEY MANAGEMENT
  // ========================================
  
  function currentKeyAndName() {
    if (!selected) return { name: "", key: "" };
    
    if (!selected.wizard) {
      var k = selected.keyByPlatform ? selected.keyByPlatform[platform] : "";
      return { name: selected.name, key: (k || "") };
    }
    
    if (selected.id === "modal-template" && platform === "mobile" && selected.keyByPlatform && selected.keyByPlatform.mobile) {
      return { name: selected.name, key: selected.keyByPlatform.mobile };
    }
    
    if (selected.id === "creation-view" && platform === "mobile" && selected.keyByPlatform && selected.keyByPlatform.mobile) {
      var viewTypeValue = optViewType.value;
      var mobileKey = selected.keyByPlatform.mobile["viewType=" + viewTypeValue];
      return { name: selected.name, key: (mobileKey || "") };
    }
    
    if (selected.id === "dashboard-ui" && platform === "mobile" && selected.keyByPlatform && selected.keyByPlatform.mobile) {
      var showAsideValue = optShowAside.value;
      var mobileKey = selected.keyByPlatform.mobile["showAside=" + showAsideValue];
      return { name: selected.name, key: (mobileKey || "") };
    }
    
    var map = selected.variantsByPlatform ? selected.variantsByPlatform[platform] : null;
    if (!map) return { name: selected.name, key: "" };
    var sig = computeSignature();
    return { name: selected.name, key: (map[sig] || "") };
  }
  
  function updateCreateEnabled() {
    var ck = currentKeyAndName();
    createBtn.disabled = !ck.key;
  }

  // ========================================
  // RENDERING FUNCTIONS
  // ========================================

  function renderGrid() {
    gridEl.innerHTML = "";
    var none = filtered.length === 0;
    emptyEl.style.display = none ? "" : "none";
    if (none) {
      var searchQuery = (searchEl.value || "").trim();
      if (searchQuery) {
        emptyMsgEl.textContent = 'Couldn\'t find any patterns with the name "' + searchQuery + '"';
      } else {
        emptyMsgEl.textContent = 'No patterns available.';
      }
      return;
    }

    filtered.forEach(function(p) {
      var dis = platformDisabled(p);
      var card = document.createElement("div");
      card.className = "card" + (dis ? " disabled" : "") + (selected && selected.id === p.id ? " selected" : "");
      var t = document.createElement("div"); 
      t.className = "thumb";
      
      // Use images for specific patterns instead of emojis
      if (p.id === "dashboard-ui") {
        var img = document.createElement("img");
        if (platform === "mobile") {
          img.src = "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/Dashboard%20UI%2001.png?raw=true";
        } else {
          img.src = "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/Dashboard%20UI%2005.png?raw=true";
        }
        if (platform === "mobile") {
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
      } else if (p.id === "list-view") {
        var img = document.createElement("img");
        if (platform === "mobile") {
          img.src = "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/List%20View%2002.png?raw=true";
        } else {
          img.src = "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/List%20View%2001.png?raw=true";
        }
        if (platform === "mobile") {
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
      } else if (p.id === "detail-view") {
        var img = document.createElement("img");
        if (platform === "mobile") {
          img.src = "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/Detail%20View%2002.png?raw=true";
        } else {
          img.src = "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/Detail%20View%2001.png?raw=true";
        }
        if (platform === "mobile") {
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
      } else if (p.id === "creation-view") {
        var img = document.createElement("img");
        if (platform === "mobile") {
          img.src = "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/Creation%20View%2004.png?raw=true";
        } else {
          img.src = "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/Creation%20View%2008.png?raw=true";
        }
        if (platform === "mobile") {
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
      } else if (p.id === "settings") {
        var img = document.createElement("img");
        if (platform === "mobile") {
          img.src = "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/Settings%2012.png?raw=true";
        } else {
          img.src = "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/Settings%2015.png?raw=true";
        }
        if (platform === "mobile") {
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
      } else if (p.id === "modal-template") {
        var img = document.createElement("img");
        if (platform === "mobile") {
          img.src = "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/Modal%20Template%2001.png?raw=true";
        } else {
          img.src = "https://github.com/rkdotdesign/ui-pattern-creator-images/blob/main/cover-images/Modal%20Template%2002.png?raw=true";
        }
        if (platform === "mobile") {
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
      } else {
        t.textContent = p.emoji || "📦";
      }
      
      var nm = document.createElement("div"); 
      nm.className = "title"; 
      nm.textContent = p.name;
      card.appendChild(t); 
      card.appendChild(nm);
      
      card.onclick = function() {
        if (dis) return;
        
        if (selected && selected.id === p.id) {
          selected = null;
          step2El.style.display = "none"; 
          step1El.style.display = "";
          updateCreateEnabled();
          renderGrid();
          updatePreview();
          document.querySelector('.toolbar').style.display = "flex";
          return;
        }
        
        selected = p;
        if (p.wizard && !(p.id === "modal-template" && platform === "mobile")) {
          goWizard(p);
        } else {
          step2El.style.display = "none"; 
          step1El.style.display = "";
          updateCreateEnabled();
          renderGrid();
          updatePreview();
          document.querySelector('.toolbar').style.display = "flex";
        }
      };
      gridEl.appendChild(card);
    });
  }

  function goWizard(p) {
    selected = p;
    step1El.style.display = "none"; 
    step2El.style.display = "";
    wizardNameEl.textContent = p.name + " (" + platformLabel() + ")";
    updateCreateEnabled();
    renderGrid();
    document.querySelector('.toolbar').style.display = "none";
    document.getElementById("prevBtn").style.display = "block";
    updateConditionalRendering();
    updateConfigurationOptions();
    updateModalConditionalRendering();
    updateCreationViewConditionalRendering();
    updateDashboardConditionalRendering();
    updateEmojiSizes();
    updatePreview();
  }

  function render() {
    var q = (searchEl.value || "").trim().toLowerCase();
    filtered = allPatterns.filter(function(p) { 
      return matchesSearch(p, q); 
    });
    renderGrid();
    updateEmojiSizes();
  }

  // ========================================
  // CONDITIONAL RENDERING FUNCTIONS
  // ========================================

  function updateConditionalRendering() {
    if (selected && selected.id === "settings") {
      var pageTypeValue = optPageType.value;
      var supportingElementsValue = optSupportingElements.value;
      
      if (pageTypeValue === "HomePage") {
        optShowTabs.parentElement.style.display = "none";
        optSupportingElements.parentElement.style.display = "none";
        optColumnType.parentElement.style.display = "none";
      } else {
        optShowTabs.parentElement.style.display = "block";
        optSupportingElements.parentElement.style.display = "block";
        
        if (platform === "mobile") {
          optColumnType.parentElement.style.display = "none";
        } else {
          if (supportingElementsValue === "None") {
            optColumnType.parentElement.style.display = "block";
          } else {
            optColumnType.parentElement.style.display = "none";
          }
        }
      }
    }
  }

  function updateConfigurationOptions() {
    if (selected && selected.id === "modal-template") {
      optPageType.parentElement.style.display = "none";
      optShowTabs.parentElement.style.display = "none";
      optSupportingElements.parentElement.style.display = "none";
      optColumnType.parentElement.style.display = "none";
      optSize.parentElement.style.display = "block";
      optContentType.parentElement.style.display = "block";
      optViewType.parentElement.style.display = "none";
      if (optSupportingElement) optSupportingElement.parentElement.style.display = "none";
      optColumnTypeDashboard.parentElement.style.display = "none";
      optShowAside.parentElement.style.display = "none";
      // Hide creation-view specific options
      if (optStepType) optStepType.parentElement.style.display = "none";
      if (optStepperType) optStepperType.parentElement.style.display = "none";
      if (optContent) optContent.parentElement.style.display = "none";
    } else if (selected && selected.id === "creation-view") {
      optPageType.parentElement.style.display = "none";
      optShowTabs.parentElement.style.display = "none";
      optSupportingElements.parentElement.style.display = "none";
      optSize.parentElement.style.display = "none";
      optContentType.parentElement.style.display = "none";
      if (optSupportingElement) optSupportingElement.parentElement.style.display = "none";
      optColumnTypeDashboard.parentElement.style.display = "none";
      optShowAside.parentElement.style.display = "none";
      
      if (platform === "mobile") {
        optStepType.parentElement.style.display = "none";
        optViewType.parentElement.style.display = "block";
        optColumnType.parentElement.style.display = "none";
        optStepperType.parentElement.style.display = "none";
        optContent.parentElement.style.display = "none";
      } else {
        // Desktop: show all new options
        optStepType.parentElement.style.display = "block";
        optViewType.parentElement.style.display = "block";
        optColumnType.parentElement.style.display = "block";
        optStepperType.parentElement.style.display = "block";
        optContent.parentElement.style.display = "block";
      }
    } else if (selected && selected.id === "dashboard-ui") {
      optPageType.parentElement.style.display = "none";
      optShowTabs.parentElement.style.display = "none";
      optSupportingElements.parentElement.style.display = "none";
      optColumnType.parentElement.style.display = "none";
      optSize.parentElement.style.display = "none";
      optContentType.parentElement.style.display = "none";
      optViewType.parentElement.style.display = "none";
      if (optSupportingElement) optSupportingElement.parentElement.style.display = "none";
      optColumnTypeDashboard.parentElement.style.display = "block";
      optShowAside.parentElement.style.display = "block";
      // Hide creation-view specific options
      if (optStepType) optStepType.parentElement.style.display = "none";
      if (optStepperType) optStepperType.parentElement.style.display = "none";
      if (optContent) optContent.parentElement.style.display = "none";
    } else {
      // Settings pattern
      optPageType.parentElement.style.display = "block";
      optShowTabs.parentElement.style.display = "block";
      optSupportingElements.parentElement.style.display = "block";
      if (platform === "mobile") {
        optColumnType.parentElement.style.display = "none";
      } else {
        optColumnType.parentElement.style.display = "block";
      }
      optSize.parentElement.style.display = "none";
      optContentType.parentElement.style.display = "none";
      optViewType.parentElement.style.display = "none";
      if (optSupportingElement) optSupportingElement.parentElement.style.display = "none";
      optColumnTypeDashboard.parentElement.style.display = "none";
      optShowAside.parentElement.style.display = "none";
      // Hide creation-view specific options
      if (optStepType) optStepType.parentElement.style.display = "none";
      if (optStepperType) optStepperType.parentElement.style.display = "none";
      if (optContent) optContent.parentElement.style.display = "none";
    }
  }

  function updateModalConditionalRendering() {
    if (selected && selected.id === "modal-template") {
      var sizeValue = optSize.value;
      var contentTypeSelect = optContentType;
      var currentValue = contentTypeSelect.value;
      
      contentTypeSelect.innerHTML = "";
      
      if (sizeValue === "Large") {
        contentTypeSelect.innerHTML = '<option value="Image + Text">Image + Text</option>';
      } else if (sizeValue === "Medium") {
        contentTypeSelect.innerHTML = '<option value="Image + Text">Image + Text</option><option value="Preview">Preview</option>';
      } else if (sizeValue === "Small") {
        contentTypeSelect.innerHTML = '<option value="Image + Text">Image + Text</option><option value="Subtle Context">Subtle Context</option><option value="Only Text">Only Text</option>';
      }
      
      if (currentValue && contentTypeSelect.querySelector('option[value="' + currentValue + '"]')) {
        contentTypeSelect.value = currentValue;
      } else {
        contentTypeSelect.value = contentTypeSelect.options[0].value;
      }
    }
  }

  function updateCreationViewConditionalRendering() {
    if (selected && selected.id === "creation-view") {
      if (platform === "mobile") {
        optStepType.parentElement.style.display = "none";
        optColumnType.parentElement.style.display = "none";
        optStepperType.parentElement.style.display = "none";
        optContent.parentElement.style.display = "none";
        
        var viewTypeSelect = optViewType;
        var currentValue = viewTypeSelect.value;
        viewTypeSelect.innerHTML = '<option value="Bottom Sheet">Bottom Sheet</option><option value="Full Page">Full Page</option>';
        
        if (currentValue === "Bottom Sheet" || currentValue === "Full Page") {
          viewTypeSelect.value = currentValue;
        } else {
          viewTypeSelect.value = "Bottom Sheet";
        }
      } else {
        // Desktop: conditional rendering based on Step Type
        var stepTypeValue = optStepType.value;
        
        if (stepTypeValue === "Single") {
          // Single: hide Column Type and Stepper Type
          optColumnType.parentElement.style.display = "none";
          optStepperType.parentElement.style.display = "none";
          
          // Update View Type options - remove Full Page
          var viewTypeSelect = optViewType;
          var currentViewValue = viewTypeSelect.value;
          viewTypeSelect.innerHTML = '<option value="Small Modal">Small Modal</option><option value="Medium Modal">Medium Modal</option><option value="Large Modal">Large Modal</option>';
          
          // Preserve value if it's still valid, otherwise default to Small Modal
          if (currentViewValue === "Small Modal" || currentViewValue === "Medium Modal" || currentViewValue === "Large Modal") {
            viewTypeSelect.value = currentViewValue;
          } else {
            viewTypeSelect.value = "Small Modal";
          }
          
          // Update Content options - remove Right Asset and Left Asset
          var contentSelect = optContent;
          var currentContentValue = contentSelect.value;
          contentSelect.innerHTML = '<option value="Default">Default</option><option value="Selection Cards">Selection Cards</option>';
          
          // Preserve value if it's still valid, otherwise default to Default
          if (currentContentValue === "Default" || currentContentValue === "Selection Cards") {
            contentSelect.value = currentContentValue;
          } else {
            contentSelect.value = "Default";
          }
        } else if (stepTypeValue === "Multiple") {
          // Update View Type options - remove Small Modal
          var viewTypeSelect = optViewType;
          var currentViewValue = viewTypeSelect.value;
          viewTypeSelect.innerHTML = '<option value="Medium Modal">Medium Modal</option><option value="Large Modal">Large Modal</option><option value="Full Page">Full Page</option>';
          
          // Preserve value if it's still valid, otherwise default to Medium Modal
          if (currentViewValue === "Medium Modal" || currentViewValue === "Large Modal" || currentViewValue === "Full Page") {
            viewTypeSelect.value = currentViewValue;
          } else {
            viewTypeSelect.value = "Medium Modal";
          }
          
          // Column Type: only show when View Type = Full Page
          var viewTypeValue = optViewType.value;
          if (viewTypeValue === "Full Page") {
            optColumnType.parentElement.style.display = "block";
          } else {
            optColumnType.parentElement.style.display = "none";
          }
          
          // Stepper Type: only show when View Type = Full Page
          if (viewTypeValue === "Full Page") {
            optStepperType.parentElement.style.display = "block";
          } else {
            optStepperType.parentElement.style.display = "none";
          }
          
          // Content: conditional visibility and options based on View Type, Stepper Type, and Column Type
          var contentSelect = optContent;
          var currentContentValue = contentSelect.value;
          var stepperTypeValue = optStepperType ? optStepperType.value : "";
          var columnTypeValue = optColumnType ? optColumnType.value : "";
          
          // Hide Content option when View Type = Medium Modal (for Multiple step type)
          if (viewTypeValue === "Medium Modal") {
            optContent.parentElement.style.display = "none";
          } else if (viewTypeValue === "Full Page" && columnTypeValue === "Narrow") {
            // Hide Content option when View Type = Full Page and Column Type = Narrow
            optContent.parentElement.style.display = "none";
          } else {
            optContent.parentElement.style.display = "block";
            
            if (viewTypeValue === "Large Modal") {
              // Large Modal: remove Selection Cards and Left Asset
              contentSelect.innerHTML = '<option value="Default">Default</option><option value="Right Asset">Right Asset</option>';
            } else if (viewTypeValue === "Full Page") {
              // Full Page: remove Selection Cards
              if (stepperTypeValue === "Progress Bar") {
                // Full Page + Progress Bar: remove Left Asset
                contentSelect.innerHTML = '<option value="Default">Default</option><option value="Right Asset">Right Asset</option>';
              } else {
                // Full Page (other stepper types): show Default, Right Asset, Left Asset
                contentSelect.innerHTML = '<option value="Default">Default</option><option value="Right Asset">Right Asset</option><option value="Left Asset">Left Asset</option>';
              }
            } else {
              // Fallback: show all options
              contentSelect.innerHTML = '<option value="Default">Default</option><option value="Selection Cards">Selection Cards</option><option value="Right Asset">Right Asset</option><option value="Left Asset">Left Asset</option>';
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

  function updateDashboardConditionalRendering() {
    if (selected && selected.id === "dashboard-ui") {
      var columnTypeValue = optColumnTypeDashboard.value;
      
      if (platform === "mobile") {
        optColumnTypeDashboard.parentElement.style.display = "none";
        optShowAside.parentElement.style.display = "block";
      } else {
        optColumnTypeDashboard.parentElement.style.display = "block";
        
        if (columnTypeValue === "Narrow") {
          optShowAside.parentElement.style.display = "none";
        } else {
          optShowAside.parentElement.style.display = "block";
        }
      }
    }
  }

  function updateEmojiSizes() {
    var thumbs = document.querySelectorAll('.thumb');
    thumbs.forEach(function(thumb) {
      if (platform === "mobile") {
        thumb.classList.add('mobile');
      } else {
        thumb.classList.remove('mobile');
      }
    });
  }

  function updatePreview() {
    var previewContent = document.querySelector('.preview-content');
    if (!previewContent) return;

    if (!selected) {
      previewContent.innerHTML = '<div class="preview-placeholder"><div style="color: #768EA7; text-align: center; padding: 20px; font-size: 14px;">Select a pattern to see preview</div></div>';
      return;
    }

    var previewImageUrl = getPreviewImageUrl(selected.id, platform);
    
    if (previewImageUrl) {
      previewContent.innerHTML = '<img src="' + previewImageUrl + '" alt="' + selected.name + ' Preview" style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px;">';
    } else {
      previewContent.innerHTML = '<div class="preview-placeholder"><div style="color: #768EA7; text-align: center; padding: 20px; font-size: 14px;">Preview not available</div></div>';
    }
  }

  function getPreviewImageUrl(patternId, currentPlatform, signature) {
    // Preview image mappings - matches the structure from previewImages.ts
    var PREVIEW_IMAGE_MAPPINGS = {
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

    var mapping = PREVIEW_IMAGE_MAPPINGS[patternId];
    if (!mapping) return undefined;

    // For wizard patterns, compute signature and look up in variantsByPlatform
    if (selected && selected.wizard) {
      var sig = signature || computeSignature();
      
      // Check variantsByPlatform first
      if (mapping.variantsByPlatform && mapping.variantsByPlatform[currentPlatform] && sig) {
        var variants = mapping.variantsByPlatform[currentPlatform];
        if (variants && variants[sig]) {
          return variants[sig];
        }
      }

      // Fall back to keyByPlatform for mobile patterns with signatures
      if (mapping.keyByPlatform && mapping.keyByPlatform[currentPlatform]) {
        var platformMapping = mapping.keyByPlatform[currentPlatform];
        if (typeof platformMapping === 'object' && sig && platformMapping[sig]) {
          return platformMapping[sig];
        }
      }
    }

    // For simple patterns, use keyByPlatform directly
    if (mapping.keyByPlatform && mapping.keyByPlatform[currentPlatform]) {
      var platformMapping = mapping.keyByPlatform[currentPlatform];
      if (typeof platformMapping === 'string') {
        return platformMapping;
      }
    }

    return undefined;
  }

  // ========================================
  // EVENT HANDLERS
  // ========================================

  // Platform switcher
  document.getElementById("platformSeg").addEventListener("click", function(e) {
    var b = e.target.closest("button"); 
    if (!b) return;
    platform = b.getAttribute("data-platform") || "desktop";
    Array.from(this.querySelectorAll("button")).forEach(function(x) { 
      x.classList.remove("active"); 
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

  // Search input
  searchEl.addEventListener("input", render);

  // Configuration option changes
  [optPageType, optShowTabs, optSupportingElements, optColumnType, optSize, optContentType, optViewType, optSupportingElement, optColumnTypeDashboard, optShowAside, optStepType, optStepperType, optContent].filter(function(sel) { return sel !== null; }).forEach(function(sel) { 
    if (sel) {
      sel.addEventListener("change", function() {
        updateCreateEnabled();
        updateConditionalRendering();
        updateModalConditionalRendering();
        updateCreationViewConditionalRendering();
        updateDashboardConditionalRendering();
        updatePreview();
      });
    }
  });

  // Create button
  document.getElementById("createBtn").onclick = function() {
    var ck = currentKeyAndName();
    if (!ck.key) {
      alert("No component key configured for this selection.\nAdd it in components.js or in the defaults inside ui.html.\n\n" + (selected && selected.wizard ? "Variant signature:\n" + computeSignature() : ""));
      return;
    }
    parent.postMessage({ pluginMessage: { type: "create-pattern", name: ck.name, key: ck.key } }, "https://www.figma.com");
  };

  // Previous button
  document.getElementById("prevBtn").onclick = function() {
    selected = null;
    step2El.style.display = "none"; 
    step1El.style.display = "";
    updateCreateEnabled();
    renderGrid();
    updatePreview();
    document.querySelector('.toolbar').style.display = "flex";
    document.getElementById("prevBtn").style.display = "none";
  };

  // ========================================
  // INITIALIZATION
  // ========================================

  // Boot up the application
  render();
  updatePreview();
  document.getElementById("prevBtn").style.display = "none";

})();
