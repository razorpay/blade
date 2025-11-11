import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  analyticsToolCallEventName,
  CURSOR_RULES_VERSION,
  CHECK_CURSOR_RULES_DESCRIPTION,
} from '../utils/tokens.js';
import { getBladeDocsList } from '../utils/generalUtils.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';

import { getBladeDocsResponseText } from '../utils/getBladeDocsResponseText.js';
import { isCursorRuleFileMissing, areCursorRulesOutdated } from '../utils/cursorRulesUtils.js';
import { createBladeCursorRulesToolName } from './createBladeCursorRules.js';

const bladeComponentsList = getBladeDocsList('components');
const bladeComponentsListString = bladeComponentsList.join(', ');
const getBladeComponentDocsToolName = 'get_blade_component_docs';

const getBladeComponentDocsToolDescription = `Fetch the Blade Design System docs for the given list of components. Use this to get information about the components and their props while adding or changing a component.`;

const getBladeComponentDocsToolSchema = {
  componentsList: z
    .string()
    .describe(
      `Comma separated list of semantic blade component names. E.g. "Button, Accordion". Make sure to use the semantic components (like PasswordInput for passwords). Possible values: ${bladeComponentsListString}`,
    ),
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
  clientName: z
    .enum(['claude', 'cursor', 'unknown'])
    .default('unknown')
    .describe(
      'The name of the client that is calling the tool. It can be "claude", "cursor", or "unknown". Use "unknown" if you are not sure.',
    ),
  cursorRuleVersion: z.string().describe(CHECK_CURSOR_RULES_DESCRIPTION),
};

const getBladeComponentDocsToolCallback: ToolCallback<typeof getBladeComponentDocsToolSchema> = ({
  componentsList,
  currentProjectRootDirectory,
  clientName,
  cursorRuleVersion,
}) => {
  const components = componentsList.split(',').map((s) => s.trim());
  const invalidComponents = components.filter((comp) => !bladeComponentsList.includes(comp));
  const invalidComponentsString = invalidComponents.join(', ');
  if (invalidComponents.length > 0) {
    return handleError({
      toolName: getBladeComponentDocsToolName,
      mcpErrorMessage: `Invalid argument componentsList. Invalid values: ${invalidComponentsString}. Valid component docs values: ${bladeComponentsListString}. Make sure to call the parent component name (e.g. instead of calling ListViewFilters, call ListView)`,
    });
  }

  if (isCursorRuleFileMissing(cursorRuleVersion, clientName)) {
    return handleError({
      toolName: getBladeComponentDocsToolName,
      mcpErrorMessage: `Cursor rules do not exist. Call \`${createBladeCursorRulesToolName}\` first.`,
    });
  }

  if (areCursorRulesOutdated(cursorRuleVersion, clientName)) {
    return handleError({
      toolName: getBladeComponentDocsToolName,
      mcpErrorMessage: `Cursor rules are outdated. Expected version: ${CURSOR_RULES_VERSION}. Current version: ${cursorRuleVersion}. Call \`${createBladeCursorRulesToolName}\` first to update cursor rules`,
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
        currentProjectRootDirectory,
        clientName,
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
