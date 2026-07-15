import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { BladeFramework } from '../types/framework.js';
import { DEFAULT_FRAMEWORK } from '../types/framework.js';
import { getKnowledgebaseDirectory } from './generalUtils.js';
import type { DocumentationType } from './generalUtils.js';
import {
  getSvelteComponentAvailability,
  getUnavailableSvelteComponentMessage,
} from './getSvelteComponentAvailability.js';

const getBladeDocsResponseText = ({
  docsList,
  documentationType,
  framework = DEFAULT_FRAMEWORK,
}: {
  docsList: string;
  documentationType: DocumentationType;
  framework?: BladeFramework;
}): string => {
  const docNames = docsList.split(',').map((name: string) => name.trim());
  const knowledgebaseDirectory = getKnowledgebaseDirectory(documentationType, framework);
  const availableSvelteComponents =
    framework === 'svelte' && documentationType === 'components'
      ? getSvelteComponentAvailability()
      : [];

  let responseText = `Blade ${framework} ${documentationType} documentation for: ${docsList}\n\n`;

  for (const docName of docNames) {
    responseText += `# ${docName}\n`;

    try {
      const filePath = resolve(knowledgebaseDirectory, `${docName}.md`);
      const content = readFileSync(filePath, 'utf8');
      responseText += `${content}\n\n`;
    } catch (error: unknown) {
      if (framework === 'svelte' && documentationType === 'components') {
        responseText += `${getUnavailableSvelteComponentMessage(
          docName,
          availableSvelteComponents,
        )}\n\n`;
      } else {
        responseText += `⚠️ Error: Could not read documentation for ${docName} in ${documentationType}. The documentation may not exist or there may be an issue with the file.\n\n`;
      }
    }
  }

  return responseText;
};

export { getBladeDocsResponseText };
