// UI Pattern Creator — Basic Implementation (JavaScript compatible)
// This is a simplified version for basic Figma plugin functionality

function centerOn(node) {
  try {
    figma.currentPage.selection = [node];
    node.x = figma.viewport.center.x - node.width / 2;
    node.y = figma.viewport.center.y - node.height / 2;
    figma.viewport.scrollAndZoomIntoView([node]);
  } catch (e) {
    console.warn("[UI Pattern Creator] centerOn warning:", e);
  }
}

async function importDetachAndPlace(name, key) {
  const loading = figma.notify(`⏳ Importing ${name} Pattern`, { timeout: Infinity });

  try {
    // Import component
    const component = await figma.importComponentByKeyAsync(key);
    
    // Create instance
    const instance = component.createInstance();
    figma.currentPage.appendChild(instance);
    
    // Detach instance
    let placed = null;
    try {
      placed = instance.detachInstance();
    } catch (e) {
      console.warn("[UI Pattern Creator] detachInstance warning:", e);
    }
    if (!placed) placed = instance;
    
    // Center and finish
    centerOn(placed);
    
    if (loading && typeof loading.cancel === "function") loading.cancel();
    figma.notify(`✅ ${name} has been imported`);
    figma.closePlugin();
  } catch (err) {
    if (loading && typeof loading.cancel === "function") loading.cancel();
    console.error("[UI Pattern Creator] import failed:", err);
    figma.closePlugin(`❌ Failed to import ${name}. Check that the component is published and the KEY is correct.`);
  }
}

// Plugin initialization
figma.on("run", () => {
  figma.showUI(__html__, { width: 564, height: 467 });
});

// Message handling
figma.ui.onmessage = async (msg) => {
  if (!msg || !msg.type) return;

  if (msg.type === "create-pattern") {
    const { name, key } = msg;
    if (!key) {
      figma.closePlugin("Missing component key.");
      return;
    }
    
    try {
      figma.ui.hide();
    } catch (e) {
      // ignore for older runtimes
    }
    
    await importDetachAndPlace(name || "Component", key);
  }

  if (msg.type === "close") {
    figma.closePlugin(msg.message || "");
  }
};
