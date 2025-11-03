import { readFileSync } from 'fs';
import { join, basename } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  analyticsToolCallEventName,
  PATTERNS_KNOWLEDGEBASE_DIRECTORY,
  getCursorRulesFileName,
} from '../utils/tokens.js';

import { getBladeDocsList } from '../utils/generalUtils.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { getBladeDocsResponseText } from '../utils/getBladeDocsResponseText.js';
import { getBladeComponentDocsToolName } from './getBladeComponentDocs.js';
import { createBladeCursorRulesToolName } from './createBladeCursorRules.js';

const bladePatternsList = getBladeDocsList('patterns');
const whichPatternToUseGuide = readFileSync(
  join(PATTERNS_KNOWLEDGEBASE_DIRECTORY, 'index.md'),
  'utf8',
);

const getBladePatternDocsToolName = 'get_blade_pattern_docs';

const getBladePatternDocsToolDescription = `Fetch the Blade Design System pattern docs. Use this to get information about design patterns, best practices, and implementation guidelines.`;

const getBladePatternDocsToolSchema = {
  patternsList: z
    .string()
    .describe(
      `Comma separated list of blade pattern names. E.g. "ListView, DetailedView". Possible values: ${bladePatternsList.join(
        ', ',
      )}. Here is guide on how to decide which pattern to use: ${whichPatternToUseGuide}`,
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

const getBladePatternDocsToolCallback: ToolCallback<typeof getBladePatternDocsToolSchema> = ({
  patternsList,
  currentProjectRootDirectory,
  clientName,
  cursorRuleFileName,
}) => {
  const components = patternsList.split(',').map((s) => s.trim());
  const invalidComponents = components.filter((comp) => !bladePatternsList.includes(comp));
  if (invalidComponents.length > 0) {
    return handleError({
      toolName: getBladePatternDocsToolName,
      mcpErrorMessage: `Invalid argument componentsList. Invalid values: ${invalidComponents.join(
        ', ',
      )}. Valid component docs values: ${bladePatternsList.join(
        ', ',
      )}. Make sure to call the parent component name (e.g. instead of calling ListViewFilters, call ListView)`,
    });
  }

  if (cursorRuleFileName === '0' && clientName === 'cursor') {
    return handleError({
      toolName: getBladePatternDocsToolName,
      mcpErrorMessage: `Cursor rules do not exist. Call \`${createBladeCursorRulesToolName}\` first.`,
    });
  }

  const expectedFileName = getCursorRulesFileName().replace('.mdc', '');
  if (cursorRuleFileName !== expectedFileName && clientName === 'cursor') {
    return handleError({
      toolName: getBladePatternDocsToolName,
      mcpErrorMessage: `Cursor rules are outdated. Expected file name: ${expectedFileName}.mdc. Call \`${createBladeCursorRulesToolName}\` first to update cursor rules`,
    });
  }

  try {
    const responseText = getBladeDocsResponseText({
      docsList: patternsList,
      documentationType: 'patterns',
    });

    // Return the formatted response
    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: getBladePatternDocsToolName,
        patternsList,
        rootDirectoryName: basename(currentProjectRootDirectory),
        clientName,
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: `Below is the documentation for Patterns. After this, call ${getBladeComponentDocsToolName} to get documentation for components that are used in patterns.:\n ${responseText}`,
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: getBladePatternDocsToolName,
      errorObject: error,
    });
  }
};

export {
  getBladePatternDocsToolName,
  getBladePatternDocsToolDescription,
  getBladePatternDocsToolSchema,
  getBladePatternDocsToolCallback,
};
