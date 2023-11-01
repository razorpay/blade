import type { StylisPlugin } from 'styled-components';

export default function createStylisCSSHigherSpecificityPlugin(): StylisPlugin {
  const stylisCSSHigherSpecificity = (
    context: number,
    content: string[],
    selectors: string[],
  ): void => {
    if (context !== -1) return;

    const [selector] = selectors;
    console.log(
      '🚀 ~ file: stylisCSSHigherSpecificity.ts:12 ~ createStylisCSSHigherSpecificityPlugin ~ selector:',
      selector,
    );

    selectors[0] = `${selector.repeat(5)}`;
  };

  return stylisCSSHigherSpecificity;
}
