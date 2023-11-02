import type { StylisPlugin } from 'styled-components';

export default function createStylisCSSHigherSpecificityPlugin(): StylisPlugin {
  const stylisCSSHigherSpecificity = (context: number, _: string[], selectors: string[]): void => {
    if (context !== -1) return;

    const [selector] = selectors;

    selectors[0] = `${selector.repeat(5)}`;
  };

  return stylisCSSHigherSpecificity;
}
