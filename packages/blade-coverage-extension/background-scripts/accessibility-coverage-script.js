import tinycolor from 'tinycolor2';

const getAccessibilityCoverage = (shouldHighlightNodes = false) => {
  const staticViolationBorderColor = '1px solid orange';
  const focusViolationBorderColor = '1px solid red';
  const interactiveElements = ['button', 'a', 'input', 'label', 'textarea', 'select', 'option'];
  const nonInteractiveElements = ['div', 'span', 'section', 'article', 'p', 'main'];
  function getBackgroundColor(el) {
    let currentEl = el;
    while (currentEl && currentEl !== document.body) {
      const bg = window.getComputedStyle(currentEl).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        return bg;
      }
      currentEl = currentEl.parentElement;
    }

    return window.getComputedStyle(document.body).backgroundColor;
  }

  function hasPointerCursor(element) {
    return getComputedStyle(element).cursor === 'pointer';
  }

  function isInsideAnotherPointerElement(element) {
    try {
      let parent = element.parentElement;
      while (parent) {
        if (
          nonInteractiveElements.includes(parent.tagName.toLowerCase()) &&
          hasPointerCursor(parent)
        ) {
          return true;
        }
        parent = parent.parentElement;
      }
      return false;
    } catch (error) {
      console.warn(
        '[a11yScript]: Error checking if element is inside another pointer element',
        error,
      );
      return false;
    }
  }

  // Function to check accessibility rules
  function getAccessibilityViolations(shouldHighlightNodes = false) {
    const markViolation = (
      element,
      issue,
      borderColor = staticViolationBorderColor,
      shouldMarkViolationOnPage = shouldHighlightNodes,
    ) => {
      if (shouldMarkViolationOnPage && element) {
        element.style.outline = borderColor;
        element.dataset.a11yViolation = 'true';
        element.dataset.a11yViolationIssue = issue;
        element.title = issue;
      }

      if (!shouldMarkViolationOnPage) {
        element.style.outline = 'initial';
        element.title = '';
      }
    };

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

    try {
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
          !(element.textContent ?? '').trim()
        ) {
          const issue = 'Button/icon without accessible name';
          markViolation(element, issue);
          a11yChecks.buttonsWithLabels.violations.push({ element, issue });
        } else {
          a11yChecks.buttonsWithLabels.passes.push({ element });
        }
      });
      // Check for elements with tabIndex and role and if it has tabIndex > 0
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

        const tabIndex = element.getAttribute('tabindex');
        if (tabIndex && parseInt(tabIndex, 10) > 0) {
          const issue = 'Element with [tabindex] > 0';
          markViolation(element, issue);
          a11yChecks.elementsWithTabindexZero.violations.push({ element, issue });
        } else {
          a11yChecks.elementsWithTabindexZero.passes.push({ element });
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

      // Check for "Skip" text on links/buttons with role="navigation"
      document.querySelectorAll('a, button').forEach((element) => {
        if (
          (element.textContent ?? '').includes('Skip') &&
          !element.closest('[role="navigation"], nav')
        ) {
          const issue = 'Skip link/button without navigation role';
          markViolation(element, issue);
          a11yChecks.skipLinksWithNavigationRole.violations.push({
            element,
            issue,
          });
        }
      });

      // Check for contrast ratio (simplified example)
      document.querySelectorAll('p, span').forEach((element) => {
        // @ts-expect-error: tinycolor is added as script
        if (!window.tinycolor) {
          return;
        }

        try {
          const bgColor = getBackgroundColor(element);
          const color = getComputedStyle(element).color;
          // @ts-expect-error: tinycolor is added as script
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call

          const isAA = tinycolor.isReadable(color, bgColor, {
            level: 'AA',
            size: 'large',
          });
          if (!isAA) {
            const issue = 'Low contrast ratio';
            markViolation(element, issue);
            element.dataset.textColor = color;
            element.dataset.bgColor = bgColor;
            a11yChecks.highContrastElements.violations.push({
              element,
              issue,
            });
          } else {
            a11yChecks.highContrastElements.passes.push({
              element,
            });
          }
        } catch (error) {
          console.log('[a11yScript]: Error checking contrast ratio. Skipping...', error);
        }
      });

      // Check if list items are contained within <ul>, <ol>, or <menu>
      document.querySelectorAll('li').forEach((li) => {
        if (!li.closest('ul, ol, menu')) {
          const issue = 'List item not in <ul>, <ol>, or <menu>';
          markViolation(li, issue);
          a11yChecks.listItemsInProperParents.violations.push({
            element: li,
            issue,
          });
        } else {
          a11yChecks.listItemsInProperParents.passes.push({ element: li });
        }
      });

      // Check for form elements with labels
      document.querySelectorAll('input, select, textarea').forEach((element) => {
        const id = element.getAttribute('id');
        const hasLabel =
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
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
      let lastHeadingLevel = 0;
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
        const headingLevel = parseInt(heading.tagName.substring(1), 10);
        if (headingLevel > lastHeadingLevel + 1) {
          const issue = 'Skipped heading level';
          markViolation(heading, issue);
          a11yChecks.correctHeadingOrder.violations.push({
            element: heading,
            issue,
          });
        } else {
          a11yChecks.correctHeadingOrder.passes.push({ element: heading });
        }
        lastHeadingLevel = headingLevel;
      });

      // Focus Checks
      const focusPasses = document.querySelectorAll(interactiveElements.join(','));
      document.querySelectorAll(nonInteractiveElements.join(',')).forEach((element) => {
        const isClosestInteractiveElement = interactiveElements.some((el) => element.closest(el));
        if (
          !isClosestInteractiveElement &&
          !isInsideAnotherPointerElement(element) &&
          hasPointerCursor(element)
        ) {
          const issue = `${element.tagName.toLowerCase()} cannot be interactive. Make sure correct HTML element is used.`;
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
    } catch (error) {
      console.warn('[a11yScript]: Error checking accessibility violations', error);
    }

    return a11yChecks;
  }

  const getA11yScoreForEachRule = (a11yChecks) => {
    return Object.fromEntries(
      Object.keys(a11yChecks).map((key) => {
        const check = a11yChecks[key];
        if (check.passes.length === 0 && check.violations.length === 0) {
          return [
            key,
            {
              passes: check.passes,
              violations: check.violations,
              score: NaN,
              violationWeight: check.violationWeight,
            },
          ];
        }

        return [
          key,
          {
            passes: check.passes,
            violations: check.violations,
            score:
              100 -
              (check.violations.length * check.violationWeight * 100) /
                (check.passes.length + check.violations.length * check.violationWeight),
            violationWeight: check.violationWeight,
          },
        ];
      }),
    );
  };

  const getStaticA11yScore = (a11yScoreForEachRule) => {
    const applicableRulesKeys = Object.keys(a11yScoreForEachRule).filter(
      (key) => !isNaN(a11yScoreForEachRule[key].score) && key !== 'focus',
    );

    if (applicableRulesKeys.length === 0) {
      // Rare scenario, but if no static rules are applicable, return 100
      return 100;
    }

    const staticA11yScore =
      applicableRulesKeys.reduce((sum, ruleKey) => sum + a11yScoreForEachRule[ruleKey].score, 0) /
      applicableRulesKeys.length;
    return staticA11yScore;
  };

  // Exection start
  const a11yChecks = getAccessibilityViolations(shouldHighlightNodes);
  const a11yScoreForEachRule = getA11yScoreForEachRule(a11yChecks);
  const a11yStaticScore = getStaticA11yScore(a11yScoreForEachRule);
  let a11yFocusScore = a11yScoreForEachRule.focus.score;
  // Check if a11yFocusScore is not a number or is NaN
  let a11yScore = 0;
  if (isNaN(a11yFocusScore)) {
    // if focus score is NaN, use static score as final score.
    // rare scenario where the page has no focus elements
    a11yScore = a11yStaticScore;
    a11yFocusScore = 100;
  } else {
    a11yScore = (a11yStaticScore + a11yFocusScore) / 2;
  }

  console.log('ACCESSIBILITY VIOLATIONS');
  console.log(a11yChecks);

  return {
    a11yScore: a11yScore.toFixed(2),
    a11yFocusScore: a11yFocusScore.toFixed(2),
    a11yStaticScore: a11yStaticScore.toFixed(2),
  };
};

export { getAccessibilityCoverage };
