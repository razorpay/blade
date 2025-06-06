import { join } from 'path';
import { existsSync } from 'fs';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  CONSUMER_CURSOR_RULES_RELATIVE_PATH,
  analyticsToolCallEventName,
} from '../utils/tokens.js';
import { hasOutDatedRules, getBladeDocsList } from '../utils/generalUtils.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { getBladeDocsResponseText } from '../utils/getBladeDocsResponseText.js';

const bladeComponentsList = getBladeDocsList('components');

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

  const ruleFilePath = join(currentProjectRootDirectory, CONSUMER_CURSOR_RULES_RELATIVE_PATH);

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
    const responseText = getBladeDocsResponseText({
      docsList: componentsList,
      documentationType: 'components',
    });

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
