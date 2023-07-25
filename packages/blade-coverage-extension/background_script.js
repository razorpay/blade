/* eslint-disable no-undef */
const calculateBladeCoverage = (shouldHighlightNodes) => {
  /**
   * Checks if DOM node is hidden or not
   */
  const isElementHidden = (element) => {
    if (element.parentElement && isElementHidden(element.parentElement)) {
      return true;
    }
    if (!(element instanceof HTMLElement)) {
      return false;
    }
    if (element.hidden) {
      return true;
    }
    const style = getComputedStyle(element);
    return style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0';
  };

  /**
   * Checks if DOM element is empty or not
   */
  const isElementEmpty = (element) => {
    if (!element) return true;
    if (!element.childNodes.length) {
      return true;
    }
    return false;
  };

  const allDomElements = document.querySelectorAll('body *');
  const bladeNodeElements = [];
  const totalNodeElements = [];
  const nonBladeNodeElements = [];

  allDomElements.forEach((elm) => {
    if (isElementHidden(elm)) return;
    if (isElementEmpty(elm)) return;
    totalNodeElements.push(elm);

    // If element has data-blade-component add it
    if (elm.hasAttribute('data-blade-component')) {
      bladeNodeElements.push(elm);
    } else {
      nonBladeNodeElements.push(elm);
    }
  });

  const totalNodes = totalNodeElements.length;
  const bladeNodes = bladeNodeElements.length;
  const bladeCoverage = Number(((bladeNodes / totalNodes) * 100).toFixed(2));

  if (shouldHighlightNodes) {
    nonBladeNodeElements.forEach((node) => {
      node.style.outline = '1px solid rgba(255, 0, 0, 0.5)';
    });
  } else {
    nonBladeNodeElements.forEach((node) => {
      node.style.outline = 'initial';
    });
  }

  return {
    bladeCoverage,
    totalNodes,
    bladeNodes,
  };
};

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'executeScript') {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const response = await chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: calculateBladeCoverage,
        args: [message.shouldHighlightNodes],
      });
      console.log('response', response);
      chrome.runtime.sendMessage({ action: 'blade-coverage', coverage: response[0].result });
    });
  }
});
