const staticViolationBorderColor = '1px solid orange';
const focusViolationBorderColor = '2px solid red';
const interactiveElements = ['button', 'a', 'input', 'label', 'textarea', 'select', 'option'];
const nonInteractiveElements = ['div', 'span', 'section', 'article', 'p', 'main'];

const a11yChecks = {
  focus: {
    violations: [],
    passes: [],
    violationWeight: 5,
  },
  imagesWithAlt: {
    violations: [],
    passes: [],
    violationWeight: 1.5,
  },
  buttonsWithLabels: {
    violations: [],
    passes: [],
    violationWeight: 3,
  },
  elementsWithRole: {
    violations: [],
    passes: [],
    violationWeight: 1.5,
  },
  html: {
    violations: [],
    passes: [],
    violationWeight: 1,
  },
  skipLinksWithNavigationRole: {
    violations: [],
    passes: [],
    violationWeight: 1,
  },
  ariaInputsWithNames: {
    violations: [],
    passes: [],
    violationWeight: 1,
  },
  elementsWithTabindexZero: {
    violations: [],
    passes: [],
    violationWeight: 2,
  },
  highContrastElements: {
    violations: [],
    passes: [],
    violationWeight: 1,
  },
  listItemsInProperParents: {
    violations: [],
    passes: [],
    violationWeight: 2,
  },
  formElementsWithLabels: {
    violations: [],
    passes: [],
    violationWeight: 3,
  },
  correctHeadingOrder: {
    violations: [],
    passes: [],
    violationWeight: 1.5,
  },
};

function getBackgroundColor(el) {
  while (el && el !== document.body) {
    const bg = window.getComputedStyle(el).backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      return bg;
    }
    el = el.parentElement;
  }

  return window.getComputedStyle(document.body).backgroundColor;
}

// =(A2^2 * C2 + B2^2 * D2) / 100

const markViolation = (element, issue, borderColor = staticViolationBorderColor) => {
  element.style.border = borderColor;
  element.dataset.a11yViolation = true;
  element.dataset.a11yViolationIssue = issue;
};

function hasPointerCursor(element) {
  return getComputedStyle(element).cursor === 'pointer';
}

function isInsideAnotherPointerElement(element) {
  let parent = element.parentElement;
  while (parent) {
    if (nonInteractiveElements.includes(parent.tagName.toLowerCase()) && hasPointerCursor(parent)) {
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
}

function getFocusViolations() {
  const focusPasses = document.querySelectorAll(interactiveElements.join(','));

  document.querySelectorAll(nonInteractiveElements.join(',')).forEach((element) => {
    const isClosestInteractiveElement = interactiveElements.some((el) => element.closest(el));

    if (
      !isClosestInteractiveElement &&
      !isInsideAnotherPointerElement(element) &&
      hasPointerCursor(element)
    ) {
      const issue = `${element.tagName.toLowerCase()} cannot be interactive (found cursor: pointer)`;
      markViolation(element, issue, focusViolationBorderColor);
      a11yChecks.focus.violations.push({ element, issue });
    }
  });

  focusPasses.forEach((element) => {
    if (element.tagName.toLowerCase() === 'a' && !element.hasAttribute('href')) {
      const issue = 'Link without href';
      markViolation(element, issue, focusViolationBorderColor);
      a11yChecks.focus.violations.push({ element, issue });
    } else {
      a11yChecks.focus.passes.push({ element });
    }
  });
}

// Function to check accessibility rules
function getStaticAccessibilityViolations() {
  // Check for images with alt attribute
  document.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('alt')) {
      const issue = 'Image without alt';
      markViolation(img, issue);
      a11yChecks.imagesWithAlt.violations.push({ element: img, issue });
    } else {
      a11yChecks.imagesWithAlt.passes.push({ element: img });
    }
  });

  // Check for button icons with accessibility label
  document.querySelectorAll('button, a, [role="menuitem"]').forEach((element) => {
    const hasImageWithAlt = element.querySelector('img[alt]');
    if (
      !hasImageWithAlt &&
      !element.getAttribute('aria-label') &&
      !element.getAttribute('aria-labelledby') &&
      !element.getAttribute('title') &&
      !element.textContent.trim()
    ) {
      const issue = 'Button/icon without accessible name';
      markViolation(element, issue);
      a11yChecks.buttonsWithLabels.violations.push({ element, issue });
    } else {
      a11yChecks.buttonsWithLabels.passes.push({ element });
    }
  });

  // Check for elements with tabIndex and role
  document.querySelectorAll('[tabindex]').forEach((element) => {
    if (
      !element.hasAttribute('role') &&
      !interactiveElements.includes(element.tagName.toLowerCase())
    ) {
      const issue = 'Has tabIndex but no role';
      markViolation(element, issue);
      a11yChecks.elementsWithRole.violations.push({ element, issue });
    } else {
      a11yChecks.elementsWithRole.passes.push({ element });
    }
  });

  // Check for ARIA input fields with accessible names
  document
    .querySelectorAll('[role="textbox"], [role="searchbox"], [role="combobox"]')
    .forEach((element) => {
      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        const issue = 'ARIA input field without accessible name';
        markViolation(element, issue);
        a11yChecks.ariaInputsWithNames.violations.push({ element, issue });
      } else {
        a11yChecks.ariaInputsWithNames.passes.push({ element });
      }
    });

  // Check if <html> element has a [lang] attribute
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    const issue = '<html> element missing [lang] attribute';
    markViolation(htmlElement, issue);
    a11yChecks.html.violations.push({ element: htmlElement, issue });
  } else {
    a11yChecks.html.passes.push({ element: htmlElement });
  }

  // Check for elements with [tabindex] value of 0
  document.querySelectorAll('[tabindex]').forEach((element) => {
    if (parseInt(element.getAttribute('tabindex'), 10) > 0) {
      const issue = 'Element with [tabindex] > 0';
      markViolation(element, issue);
      a11yChecks.elementsWithTabindexZero.violations.push({ element, issue });
    } else {
      a11yChecks.elementsWithTabindexZero.passes.push({ element });
    }
  });

  // Check for "Skip" text on links/buttons with role="navigation"
  document.querySelectorAll('a, button').forEach((element) => {
    if (element.textContent.includes('Skip') && !element.closest('[role="navigation"], nav')) {
      const issue = 'Skip link/button without navigation role';
      markViolation(element, issue);
      a11yChecks.skipLinksWithNavigationRole.violations.push({ element, issue });
    }
  });

  // Check for contrast ratio (simplified example)
  document.querySelectorAll('p, span').forEach((element) => {
    const bgColor = getBackgroundColor(element);
    const color = getComputedStyle(element).color;
    // eslint-disable-next-line no-undef
    const isAA = tinycolor.isReadable(color, bgColor, { level: 'AA', size: 'large' });

    if (!isAA) {
      const issue = 'Low contrast ratio';
      markViolation(element, issue);
      element.dataset.textColor = color;
      element.dataset.bgColor = bgColor;
      a11yChecks.highContrastElements.violations.push({ element, issue });
    } else {
      a11yChecks.highContrastElements.passes.push({ element });
    }
  });

  // Check if list items are contained within <ul>, <ol>, or <menu>
  document.querySelectorAll('li').forEach((li) => {
    if (!li.closest('ul, ol, menu')) {
      const issue = 'List item not in <ul>, <ol>, or <menu>';
      markViolation(li, issue);
      a11yChecks.listItemsInProperParents.violations.push({ element: li, issue });
    } else {
      a11yChecks.listItemsInProperParents.passes.push({ element: li });
    }
  });

  // Check for form elements with labels
  document.querySelectorAll('input, select, textarea').forEach((element) => {
    const id = element.getAttribute('id');
    const hasLabel =
      document.querySelector(`label[for="${id}"]`) ||
      element.hasAttribute('aria-label') ||
      element.hasAttribute('aria-labelledby') ||
      element.closest('label');
    if (!hasLabel) {
      const issue = 'Form element without associated label';
      markViolation(element, issue);
      a11yChecks.formElementsWithLabels.violations.push({ element, issue });
    } else {
      a11yChecks.formElementsWithLabels.passes.push({ element });
    }
  });

  // Check for logical heading order
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  let lastLevel = 0;
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.substring(1), 10);
    if (level > lastLevel + 1) {
      const issue = 'Skipped heading level';
      markViolation(heading, issue);
      a11yChecks.correctHeadingOrder.violations.push({ element: heading, issue });
    } else {
      a11yChecks.correctHeadingOrder.passes.push({ element: heading });
    }
    lastLevel = level;
  });
}

const getA11yScoreForEachRule = () => {
  return Object.fromEntries(
    Object.keys(a11yChecks).map((key) => {
      if (a11yChecks[key].passes.length === 0 && a11yChecks[key].violations.length === 0) {
        // Rules not applicable on this page
        return [
          key,
          {
            passes: a11yChecks[key].passes,
            violations: a11yChecks[key].violations,
            score: NaN,
          },
        ];
      }

      return [
        key,
        {
          passes: a11yChecks[key].passes,
          violations: a11yChecks[key].violations,
          score:
            100 -
            (a11yChecks[key].violations.length * a11yChecks[key].violationWeight * 100) /
              (a11yChecks[key].passes.length +
                a11yChecks[key].violations.length * a11yChecks[key].violationWeight),
        },
      ];
    }),
  );
};

const getA11yScore = (a11yScoreForEachRule) => {
  // Loop through the a11yScoreForEachRule and calculate the final score
  const applicableRulesKeys = Object.keys(a11yScoreForEachRule).filter(
    (key) => !isNaN(a11yScoreForEachRule[key].score) && key !== 'focus',
  );

  const staticA11yScore =
    applicableRulesKeys.reduce((sum, ruleKey) => sum + a11yScoreForEachRule[ruleKey].score, 0) /
    applicableRulesKeys.length;

  const focusA11yScore = a11yScoreForEachRule.focus.score;

  return (staticA11yScore + focusA11yScore) / 2;
};

const tinyColorScript = document.createElement('script');
tinyColorScript.src = 'https://cdn.jsdelivr.net/npm/tinycolor2@1.6.0/dist/tinycolor-min.js';
document.head.appendChild(tinyColorScript);
tinyColorScript.onload = () => {
  getStaticAccessibilityViolations();
  getFocusViolations();

  const a11yScoreForEachRule = getA11yScoreForEachRule();
  console.log('Static Accessibility Checks:', a11yScoreForEachRule);
  const finalA11yScore = getA11yScore(a11yScoreForEachRule);
  console.log('Final A11y Score:', finalA11yScore);
};
