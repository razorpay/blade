import { join, basename } from 'path';
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
import { createBladeCursorRulesToolName } from './createBladeCursorRules.js';

const bladeComponentsList = getBladeDocsList('components');
const bladeComponentsListString = bladeComponentsList.join(', ');

const getBladeComponentDocsToolName = 'get_blade_component_docs';
const getBladeComponentDocsToolDescription = `Fetch the Blade Design System docs for the given list of components. Use this to get information about the components and their props while adding or changing a component.`;

// Schema for stdio transport
const getBladeComponentDocsStdioSchema = {
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
};

// Schema for HTTP transport
const getBladeComponentDocsHttpSchema = {
  componentsList: z
    .string()
    .describe(
      `Comma separated list of semantic blade component names. E.g. "Button, Accordion". Make sure to use the semantic components (like PasswordInput for passwords). Possible values: ${bladeComponentsListString}`,
    ),
  cursorRuleVersion: z
    .string()
    .describe('The version of cursor rules. Required for HTTP transport.'),
  clientName: z
    .string()
    .describe('The name of the client making the request. Required for HTTP transport.'),
  currentProjectRootDirectory: z
    .string()
    .optional()
    .describe(
      "The working root directory of the consumer's project. Optional for HTTP transport. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
};

// Core business logic function
const getBladeComponentDocsCore = ({
  componentsList,
  currentProjectRootDirectory,
  skipCursorRuleChecks = false,
  cursorRuleVersion,
  clientName,
}: {
  componentsList: string;
  currentProjectRootDirectory?: string;
  skipCursorRuleChecks?: boolean;
  cursorRuleVersion?: string;
  clientName?: string;
}): {
  isError?: true;
  content: Array<{ type: 'text'; text: string }>;
} => {
  const components = componentsList.split(',').map((s) => s.trim());
  const invalidComponents = components.filter((comp) => !bladeComponentsList.includes(comp));
  const invalidComponentsString = invalidComponents.join(', ');
  if (invalidComponents.length > 0) {
    return handleError({
      toolName: getBladeComponentDocsToolName,
      mcpErrorMessage: `Invalid argument componentsList. Invalid values: ${invalidComponentsString}. Valid component docs values: ${bladeComponentsListString}. Make sure to call the parent component name (e.g. instead of calling ListViewFilters, call ListView)`,
    });
  }

  // Skip cursor rule checks if skipCursorRuleChecks is true (for HTTP transport)
  if (!skipCursorRuleChecks && currentProjectRootDirectory) {
    const ruleFilePath = join(currentProjectRootDirectory, CONSUMER_CURSOR_RULES_RELATIVE_PATH);

    if (!existsSync(ruleFilePath)) {
      return handleError({
        toolName: getBladeComponentDocsToolName,
        mcpErrorMessage: `Cursor rules do not exist. Call \`${createBladeCursorRulesToolName}\` first.`,
      });
    }

    if (hasOutDatedRules(ruleFilePath)) {
      return handleError({
        toolName: getBladeComponentDocsToolName,
        mcpErrorMessage: `Cursor rules are outdated. Call \`${createBladeCursorRulesToolName}\` first to update cursor rules`,
      });
    }
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
        rootDirectoryName: currentProjectRootDirectory
          ? basename(currentProjectRootDirectory)
          : undefined,
        cursorRuleVersion,
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

// Callback for stdio transport
const getBladeComponentDocsStdioCallback: ToolCallback<typeof getBladeComponentDocsStdioSchema> = ({
  componentsList,
  currentProjectRootDirectory,
}) => {
  return getBladeComponentDocsCore({
    componentsList,
    currentProjectRootDirectory,
    skipCursorRuleChecks: false, // Perform cursor rule checks for stdio
  });
};

// Callback for HTTP transport
const getBladeComponentDocsHttpCallback: ToolCallback<typeof getBladeComponentDocsHttpSchema> = ({
  componentsList,
  cursorRuleVersion,
  clientName,
  currentProjectRootDirectory,
}) => {
  return getBladeComponentDocsCore({
    componentsList,
    currentProjectRootDirectory,
    skipCursorRuleChecks: true, // Skip cursor rule checks for HTTP
    cursorRuleVersion,
    clientName,
  });
};

// getBladeComponentDocsStdioSchema,
//   getBladeComponentDocsHttpSchema

const getBladeComponentDocsToolSchema = (
  transportType: 'stdio' | 'http',
): typeof getBladeComponentDocsStdioSchema | typeof getBladeComponentDocsHttpSchema => {
  if (transportType === 'stdio') {
    return getBladeComponentDocsStdioSchema;
  }
  return getBladeComponentDocsHttpSchema;
};

const getBladeComponentDocsToolCallback = (
  transportType: 'stdio' | 'http',
): typeof getBladeComponentDocsStdioCallback | typeof getBladeComponentDocsHttpCallback => {
  if (transportType === 'stdio') {
    return getBladeComponentDocsStdioCallback;
  }
  return getBladeComponentDocsHttpCallback;
};
// Export all at once
export {
  getBladeComponentDocsToolName,
  getBladeComponentDocsToolDescription,
  getBladeComponentDocsToolSchema,
  getBladeComponentDocsToolCallback,
};
