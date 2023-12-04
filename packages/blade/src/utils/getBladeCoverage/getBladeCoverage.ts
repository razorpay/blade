const getBladeCoverage = (): { bladeCoverage: number; totalNodes: number; bladeNodes: number } => {
  /**
   * Checks if DOM node is hidden or not
   */
  const isElementHidden = (element: Element): boolean => {
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
   * Checks if DOM node is a media element or not
   */
  const isMediaElement = (element: Element): boolean => {
    const mediaTags = ['img', 'video', 'audio', 'source', 'picture'];
    return mediaTags.includes(element.tagName.toLowerCase());
  };

  /**
   * Checks if DOM element is empty or not
   */
  const isElementEmpty = (element: Element): boolean => {
    if (!element) return true;
    if (!element.childNodes.length) {
      return true;
    }
    return false;
  };

  const allDomElements = document.querySelectorAll('body *');

  const bladeNodeElements: Element[] = [];
  const totalNodeElements: Element[] = [];

  allDomElements.forEach((elm) => {
    if (isElementHidden(elm)) return;
    if (isElementEmpty(elm)) return;
    if (isMediaElement(elm)) return;

    // skip svg nodes but not blade icons
    const closestSvgNode = elm.closest('svg');
    // if this is a blade icon then add it
    if (elm.tagName.toLocaleLowerCase() === 'svg' && elm.hasAttribute('data-blade-component')) {
      bladeNodeElements.push(elm);
      totalNodeElements.push(elm);
      return;
    }
    // if it's a svg node inside a blade icon then skip it
    if (closestSvgNode?.getAttribute('data-blade-component') === 'icon') {
      return;
    }
    // if it's a svg node but not a blade icon then skip it
    if (closestSvgNode && !elm.hasAttribute('data-blade-component')) {
      return;
    }

    totalNodeElements.push(elm);

    // If element has data-blade-component add it
    if (elm.hasAttribute('data-blade-component')) {
      bladeNodeElements.push(elm);
    }
  });

  const totalNodes = totalNodeElements.length;
  const bladeNodes = bladeNodeElements.length;
  let bladeCoverage = Number(((bladeNodes / totalNodes) * 100).toFixed(2));
  // NaN guard
  if (totalNodes === 0) {
    bladeCoverage = 0;
  }

  return {
    bladeCoverage,
    totalNodes,
    bladeNodes,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const assertBladeCoverage = async (page: any, threshold = 70): Promise<void> => {
  const { bladeCoverage } = await page.evaluate((coverageFnStr: string) => {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    const getBladeCoverage = new Function(`return (${coverageFnStr})()`);
    return getBladeCoverage();
  }, getBladeCoverage.toString());

  expect(bladeCoverage).toBeGreaterThan(threshold);
};

export { getBladeCoverage, assertBladeCoverage };
