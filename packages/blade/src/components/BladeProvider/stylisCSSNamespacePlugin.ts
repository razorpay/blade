import type { StylisPlugin } from 'styled-components';

export default function createStylisCSSNamespacePlugin({
  namespace,
}: {
  namespace: string;
}): StylisPlugin {
  const stylisCSSNamespace = (context: number, _: string[], selectors: string[]): void => {
    if (context !== -1) return;
    const [selector] = selectors;
    if (selector.includes(namespace)) return; // avoiding adding it multiple times
    selectors[0] = `${namespace} ${selector}`;
  };

  return stylisCSSNamespace;
}
