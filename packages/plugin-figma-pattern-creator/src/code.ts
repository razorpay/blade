// UI Pattern Creator — Advanced TypeScript Implementation
// Enhanced version with better error handling, logging, and extensibility

/// <reference types="@figma/plugin-typings" />

import { sendAnalytics } from './utils/sendAnalytics';

// ========================================
// TYPE DEFINITIONS
// ========================================

interface CreatePatternMessage {
  type: "create-pattern";
  name: string;
  key: string;
}

interface CloseMessage {
  type: "close";
  message?: string;
}

interface LogMessage {
  type: "log";
  level: "info" | "warn" | "error";
  message: string;
}

interface FileLinkResponseMessage {
  type: "file-link-response";
  fileLink: string | null;
  referrer?: string;
}

interface FileLinkAvailableMessage {
  type: "file-link-available";
  fileLink: string | null;
}

type PluginMessage =
  | CreatePatternMessage
  | CloseMessage
  | LogMessage
  | FileLinkResponseMessage
  | FileLinkAvailableMessage;

interface PluginConfig {
  width: number;
  height: number;
  autoCenter: boolean;
  autoDetach: boolean;
  showNotifications: boolean;
}

// ========================================
// CONFIGURATION
// ========================================

const DEFAULT_CONFIG: PluginConfig = {
  width: 564,
  height: 467,
  autoCenter: true,
  autoDetach: true,
  showNotifications: true
};

// Cached file link shared across requests plus one-shot resolver for UI fallback
let cachedFileLink: string | null = null;
let pendingFileLinkResolve: ((link: string | null) => void) | null = null;

/**
 * Best-effort retrieval of the current file link.
 * 1) Prefer figma.fileKey if available
 * 2) Fallback: ask the UI to parse document.referrer and send back the base file link
 */
async function getFileLink(): Promise<string | null> {
  if (cachedFileLink) {
    return cachedFileLink;
  }
  try {
    if (typeof (figma as any).fileKey === "string" && (figma as any).fileKey) {
      cachedFileLink = `https://www.figma.com/file/${(figma as any).fileKey}`;
      return cachedFileLink;
    }
  } catch (_) {
    // ignore and try UI fallback
  }
  
  return await new Promise<string | null>((resolve) => {
    pendingFileLinkResolve = resolve;
    try {
      figma.ui.postMessage({ type: "request-file-link" });
    } catch (_) {
      // If we cannot reach UI, resolve with null immediately
      pendingFileLinkResolve = null;
      resolve(null);
      return;
    }
    // Safety timeout to avoid hanging if UI does not respond
    setTimeout(() => {
      if (pendingFileLinkResolve) {
        pendingFileLinkResolve(null);
        pendingFileLinkResolve = null;
      }
    }, 1500);
  });
}

async function getNodeUrlPath(node: SceneNode, baseLink?: string | null): Promise<string | null> {
  const resolvedLink = typeof baseLink === "string" ? baseLink : await getFileLink();
  if (!resolvedLink) {
    return null;
  }
  const separator = resolvedLink.includes('?') ? '&' : '?';
  return `${resolvedLink}${separator}node-id=${encodeURIComponent(node.id)}`;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Enhanced logging with different levels
 */
function log(level: "info" | "warn" | "error", message: string, data?: any): void {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [UI Pattern Creator] ${message}`;
  
  switch (level) {
    case "info":
      console.log(logMessage, data || "");
      break;
    case "warn":
      console.warn(logMessage, data || "");
      break;
    case "error":
      console.error(logMessage, data || "");
      break;
  }
}

/**
 * Enhanced node centering with viewport considerations
 */
function centerOn(node: SceneNode, config: PluginConfig = DEFAULT_CONFIG): void {
  if (!config.autoCenter) return;
  
  try {
    // Select the node
    figma.currentPage.selection = [node];
    
    // Calculate center position
    const viewportCenter = figma.viewport.center;
    const nodeCenter = {
      x: viewportCenter.x - node.width / 2,
      y: viewportCenter.y - node.height / 2
    };
    
    // Position the node
    node.x = nodeCenter.x;
    node.y = nodeCenter.y;
    
    // Zoom into view
    figma.viewport.scrollAndZoomIntoView([node]);
    
    log("info", `Centered node "${node.name}" at position (${nodeCenter.x}, ${nodeCenter.y})`);
  } catch (error) {
    log("warn", "Failed to center node", error);
  }
}

/**
 * Enhanced component import with better error handling
 */
async function importDetachAndPlace(
  name: string, 
  key: string, 
  config: PluginConfig = DEFAULT_CONFIG
): Promise<void> {
  let loading: NotificationHandler | null = null;
  
  try {
    // Start loading notification
    if (config.showNotifications) {
      loading = figma.notify(`⏳ Importing ${name} Pattern`, { timeout: Infinity });
    }
    
    log("info", `Starting import process for "${name}" with key: ${key}`);
    
    // 1) Import published component by KEY
    log("info", "Importing component from Figma library...");
    const component = await figma.importComponentByKeyAsync(key);
    
    if (!component) {
      throw new Error("Component import returned null");
    }
    
    log("info", `Successfully imported component: ${component.name}`);
    
    // 2) Create instance and attach to page
    log("info", "Creating component instance...");
    const instance = component.createInstance();
    figma.currentPage.appendChild(instance);
    
    // 3) Detach to raw layers (if enabled)
    let placed: SceneNode = instance;
    
    if (config.autoDetach) {
      try {
        log("info", "Detaching instance to raw layers...");
        const detached = instance.detachInstance();
        if (detached) {
          placed = detached;
          log("info", "Successfully detached instance");
        }
      } catch (error) {
        log("warn", "Failed to detach instance, keeping as instance", error);
      }
    }
    
    // 4) Center and focus
    centerOn(placed, config);
    
    // 5) Success cleanup
    if (loading && typeof loading.cancel === "function") {
      loading.cancel();
    }
    
    if (config.showNotifications) {
      figma.notify(`✅ ${name} has been imported`);
    }
    
    // Track successful pattern creation
    try {
      const fileLink = await getFileLink();
      const nodeUrlPath = await getNodeUrlPath(placed, fileLink);
      const properties: Record<string, any> = {
        patternName: name,
        patternKey: key,
        fileName: figma.root.name,
        fileLink: `https://www.figma.com/file/${figma.fileKey}`,
        pageName: figma.currentPage.name,
      };

      await sendAnalytics({
        eventName: "Pattern Creator Plugin Used",
        properties,
      });
      
    } catch (analyticsError) {
      log("warn", "Failed to send success analytics", analyticsError);
    }
    
    log("info", `Successfully completed import process for "${name}"`);
    figma.closePlugin();
    
  } catch (error) {
    // Error cleanup
    if (loading && typeof loading.cancel === "function") {
      loading.cancel();
    }
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    log("error", `Import failed for "${name}": ${errorMessage}`, error);
    
    if (config.showNotifications) {
      figma.closePlugin(`❌ Failed to import ${name}. ${errorMessage}`);
    } else {
      figma.closePlugin();
    }
  }
}

/**
 * Validate component key format
 */
function isValidComponentKey(key: string): boolean {
  // Figma component keys are typically 40-character hex strings
  return /^[a-f0-9]{40}$/i.test(key);
}

// ========================================
// PLUGIN INITIALIZATION
// ========================================

figma.on("run", () => {
  log("info", "Plugin started");
  
  try {
    figma.showUI(__html__, { 
      width: DEFAULT_CONFIG.width, 
      height: DEFAULT_CONFIG.height 
    });
    log("info", `UI shown with dimensions: ${DEFAULT_CONFIG.width}x${DEFAULT_CONFIG.height}`);
    try {
      figma.ui.postMessage({ type: "request-file-link" });
    } catch (postMessageError) {
      log("warn", "Failed to request initial file link from UI", postMessageError);
    }
  } catch (error) {
    log("error", "Failed to show UI", error);
  }
});

// ========================================
// MESSAGE HANDLING
// ========================================

figma.ui.onmessage = async (msg: PluginMessage) => {
  if (!msg || !msg.type) {
    log("warn", "Received invalid message", msg);
    return;
  }
  
  log("info", `Received message: ${msg.type}`);
  
  try {
    switch (msg.type) {
      case "create-pattern":
        await handleCreatePattern(msg);
        break;
        
      case "close":
        handleClose(msg);
        break;
        
      case "log":
        handleLogMessage(msg);
        break;
        
      case "file-link-response":
        cachedFileLink = (msg as FileLinkResponseMessage).fileLink || null;
        if (pendingFileLinkResolve) {
          pendingFileLinkResolve(cachedFileLink);
          pendingFileLinkResolve = null;
        }
        break;
      
      case "file-link-available":
        cachedFileLink = (msg as FileLinkAvailableMessage).fileLink || null;
        if (pendingFileLinkResolve) {
          pendingFileLinkResolve(cachedFileLink);
          pendingFileLinkResolve = null;
        }
        break;
        
      default:
        log("warn", `Unknown message type: ${(msg as any).type}`);
    }
  } catch (error) {
    log("error", `Error handling message type "${msg.type}"`, error);
  }
};

/**
 * Handle create pattern message
 */
async function handleCreatePattern(msg: CreatePatternMessage): Promise<void> {
  const { name, key } = msg;
  
  // Validation
  if (!key) {
    log("error", "Missing component key in create-pattern message");
    figma.closePlugin("Missing component key.");
    return;
  }
  
  if (!isValidComponentKey(key)) {
    log("warn", `Invalid component key format: ${key}`);
    // Continue anyway, let Figma handle the validation
  }
  
  if (!name || name.trim().length === 0) {
    log("warn", "Empty or missing pattern name");
  }
  
  // Hide UI for better UX
  try {
    figma.ui.hide();
    log("info", "UI hidden for import process");
  } catch (error) {
    log("warn", "Failed to hide UI", error);
  }
  
  // Start import process
  await importDetachAndPlace(name || "Component", key);
}

/**
 * Handle close message
 */
function handleClose(msg: CloseMessage): void {
  const message = msg.message || "";
  log("info", `Plugin closing with message: "${message}"`);
  figma.closePlugin(message);
}

/**
 * Handle log message from UI
 */
function handleLogMessage(msg: LogMessage): void {
  log(msg.level, `[UI] ${msg.message}`);
}