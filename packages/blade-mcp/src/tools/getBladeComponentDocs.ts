import { resolve, join } from 'path';
import { existsSync, readFileSync } from 'fs';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  KNOWLEDGEBASE_DIRECTORY,
  hasOutDatedRules,
  getBladeComponentsList,
  handleError,
  sendAnalytics,
  analyticsToolCallEventName,
} from '../utils.js';

const bladeComponentsList = getBladeComponentsList();

const getBladeComponentDocsToolName = 'get_blade_component_docs';

const getBladeComponentDocsToolDescription = `Fetch the Blade Design System docs for the given list of components. Use this to get information about the components and their props while adding or changing a component.`;

const getBladeComponentDocsToolSchema = {
  componentsList: z
    .string()
    .describe(
      `Comma separated list of semantic blade component names. E.g. "Button, Accordion". Make sure to use the semantic components (like PasswordInput for passwords). Possible values: ${bladeComponentsList.join(
        ', ',
      )}`,
    ),
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
};

const getBladeComponentDocsToolCallback: ToolCallback<typeof getBladeComponentDocsToolSchema> = ({
  componentsList,
  currentProjectRootDirectory,
}) => {
  const components = componentsList.split(',').map((s) => s.trim());
  const invalidComponents = components.filter((comp) => !bladeComponentsList.includes(comp));
  if (invalidComponents.length > 0) {
    return handleError({
      toolName: getBladeComponentDocsToolName,
      mcpErrorMessage: `Invalid argument componentsList. Invalid values: ${invalidComponents.join(
        ', ',
      )}. Valid component docs values: ${bladeComponentsList.join(
        ', ',
      )}. Make sure to call the parent component name (e.g. instead of calling ListViewFilters, call ListView)`,
    });
  }

  const ruleFilePath = join(currentProjectRootDirectory, '.cursor/rules/frontend-blade-rules.mdc');

  if (!existsSync(ruleFilePath)) {
    return handleError({
      toolName: getBladeComponentDocsToolName,
      mcpErrorMessage: 'Cursor rules do not exist. Call create_blade_cursor_rules first.',
    });
  }

  if (hasOutDatedRules(ruleFilePath)) {
    return handleError({
      toolName: getBladeComponentDocsToolName,
      mcpErrorMessage: 'Cursor rules are outdated. Call create_blade_cursor_rules first.',
    });
  }

  try {
    // Parse the comma-separated string into an array of component names
    const componentNames = componentsList.split(',').map((name: string) => name.trim());

    // Build the formatted documentation text
    let responseText = `Blade component documentation for: ${componentsList}\n\n`;

    // Process each component
    for (const componentName of componentNames) {
      responseText += `## ${componentName}\n`;

      try {
        const filePath = resolve(KNOWLEDGEBASE_DIRECTORY, `${componentName}.md`);
        const content = readFileSync(filePath, 'utf8');
        responseText += `${content}\n\n`;
      } catch (error: unknown) {
        responseText += `⚠️ Error: Could not read documentation for ${componentName}. The component may not exist or there may be an issue with the file.\n\n`;
      }
    }

    // Return the formatted response
    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: getBladeComponentDocsToolName,
        componentsList,
      },
    });
    return {
      content: [
        {
          type: 'text',
          text: responseText.trim(),
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: getBladeComponentDocsToolName,
      errorObject: error,
    });
  }
};

export {
  getBladeComponentDocsToolName,
  getBladeComponentDocsToolDescription,
  getBladeComponentDocsToolSchema,
  getBladeComponentDocsToolCallback,
};
