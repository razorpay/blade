import type { StylisPlugin } from 'styled-components';

export default function createStylisCSSHigherSpecificityPlugin(): StylisPlugin {
  const stylisCSSHigherSpecificity = (context: number, _: string[], selectors: string[]): void => {
    if (context !== -1) return;

    const [selector] = selectors;

    setTimeout(() => {
      const elements = document.querySelectorAll(selector);

      elements.forEach((element) => {
        const className = element.getAttribute('class');
        if (className?.includes('sc-')) {
          const allClasses = className.split(' ');
          allClasses.pop();
          element.setAttribute('class', allClasses.join(' '));
        }
      });
    }, 0);

    selectors[0] = `${selector.repeat(5)}`;
  };

  return stylisCSSHigherSpecificity;
}
