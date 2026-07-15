import { readdirSync } from 'fs';
import { join } from 'path';
import { SVELTE_KNOWLEDGEBASE_DIRECTORY } from './tokens.js';

const getSvelteComponentAvailability = (): string[] => {
  const componentsDirectory = join(SVELTE_KNOWLEDGEBASE_DIRECTORY, 'components');
  try {
    return readdirSync(componentsDirectory)
      .filter((file) => file.endsWith('.md') && !file.includes('index.md'))
      .map((file) => file.replace('.md', '').trim());
  } catch {
    return [];
  }
};

const getUnavailableSvelteComponentMessage = (
  componentName: string,
  availableComponents: string[],
): string => {
  const availableList =
    availableComponents.length > 0 ? availableComponents.join(', ') : 'none yet';

  return `⚠️ Svelte documentation for ${componentName} is not available yet. Available Svelte components: ${availableList}. Use framework="react" for the full React component catalog.`;
};

export { getSvelteComponentAvailability, getUnavailableSvelteComponentMessage };
