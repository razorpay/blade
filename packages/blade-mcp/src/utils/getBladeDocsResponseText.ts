import { readFileSync } from 'fs';
import { resolve } from 'path';
import { KNOWLEDGEBASE_DIRECTORY } from './tokens.js';
import type { DocumentationType } from './generalUtils.js';

const getBladeDocsResponseText = ({
  docsList,
  documentationType,
}: {
  docsList: string;
  documentationType: DocumentationType;
}): string => {
  // Parse the comma-separated string into an array of component names
  const docNames = docsList.split(',').map((name: string) => name.trim());

  // Build the formatted documentation text
  let responseText = `Blade ${documentationType} documentation for: ${docsList}\n\n`;

  // Process each component
  for (const docName of docNames) {
    responseText += `# ${docName}\n`;

    try {
      const filePath = resolve(KNOWLEDGEBASE_DIRECTORY, documentationType, `${docName}.md`);
      const content = readFileSync(filePath, 'utf8');
      responseText += `${content}\n\n`;
    } catch (error: unknown) {
      responseText += `⚠️ Error: Could not read documentation for ${docName} in ${documentationType}. The documentation may not exist or there may be an issue with the file.\n\n`;
    }
  }

  return responseText;
};

export { getBladeDocsResponseText };
