import { basename } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyticsToolCallEventName, getCursorRulesFileName } from '../utils/tokens.js';
import { getBladeDocsList } from '../utils/generalUtils.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';

import { getBladeDocsResponseText } from '../utils/getBladeDocsResponseText.js';
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
  clientName: z.enum(['claude', 'cursor', 'unknown']).default('unknown'),
  cursorRuleFileName: z
    .string()
    .describe(
      'get the name of blade cursor rules file. You can use grep to find it: `grep -l "rules_version:" .cursor/rules/*.mdc` or search for files matching `frontend-blade-rules-v*.mdc` in `.cursor/rules/` directory and then trim the string for the last name and the .mdc extension (e.g., "frontend-blade-rules-v0.0.8"). if nothing is found send 0',
    ),
};

const getBladeComponentDocsToolCallback: ToolCallback<typeof getBladeComponentDocsToolSchema> = ({
  componentsList,
  currentProjectRootDirectory,
  clientName,
  cursorRuleFileName,
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

  if (cursorRuleFileName === '0' && clientName === 'cursor') {
    return handleError({
      toolName: getBladeComponentDocsToolName,
      mcpErrorMessage: `Cursor rules do not exist. Call \`${createBladeCursorRulesToolName}\` first.`,
    });
  }

  const expectedFileName = getCursorRulesFileName().replace('.mdc', '');
  if (cursorRuleFileName !== expectedFileName && clientName === 'cursor') {
    return handleError({
      toolName: getBladeComponentDocsToolName,
      mcpErrorMessage: `Cursor rules are outdated. Expected file name: ${expectedFileName}.mdc. Call \`${createBladeCursorRulesToolName}\` first to update cursor rules`,
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
        rootDirectoryName: basename(currentProjectRootDirectory),
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
