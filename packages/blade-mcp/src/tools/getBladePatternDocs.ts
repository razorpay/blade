import { readFileSync } from 'fs';
import { join, basename } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyticsToolCallEventName, PATTERNS_KNOWLEDGEBASE_DIRECTORY } from '../utils/tokens.js';

import { getBladeDocsList } from '../utils/generalUtils.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { getBladeDocsResponseText } from '../utils/getBladeDocsResponseText.js';
import { shouldCreateOrUpdateSkill } from '../utils/skillUtils.js';
import type { McpToolResponse } from '../utils/types.js';
import {
  commonBladeMCPToolSchema,
  httpTransportSkillVersionSchema,
} from '../utils/getCommonSchema.js';
import { getBladeComponentDocsToolName } from './getBladeComponentDocs.js';

const bladePatternsList = getBladeDocsList('patterns');
const whichPatternToUseGuide = readFileSync(
  join(PATTERNS_KNOWLEDGEBASE_DIRECTORY, 'index.md'),
  'utf8',
);

const getBladePatternDocsToolName = 'get_blade_pattern_docs';

const getBladePatternDocsToolDescription = `Fetch the Blade Design System pattern docs. Use this to get information about design patterns, best practices, and implementation guidelines.`;

// Schema for stdio transport
const getBladePatternDocsStdioSchema = {
  patternsList: z
    .string()
    .describe(
      `Comma separated list of blade pattern names. E.g. "ListView, DetailedView". Possible values: ${bladePatternsList.join(
        ', ',
      )}. Here is guide on how to decide which pattern to use: ${whichPatternToUseGuide}`,
    ),
  ...commonBladeMCPToolSchema,
};

// Schema for HTTP transport
const getBladePatternDocsHttpSchema = {
  ...getBladePatternDocsStdioSchema,
  ...httpTransportSkillVersionSchema,
};

// Core business logic function
const getBladePatternDocsCore = ({
  patternsList,
  currentProjectRootDirectory,
  skipLocalSkillChecks = false,
  skillVersion,
  clientName,
}: {
  patternsList: string;
  currentProjectRootDirectory?: string;
  skipLocalSkillChecks?: boolean;
  skillVersion?: string;
  clientName: 'claude' | 'cursor' | 'unknown';
}): McpToolResponse => {
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

  // Check skill using shouldCreateOrUpdateSkill which handles both file system and version checks
  if (currentProjectRootDirectory) {
    const createOrUpdateSkill = shouldCreateOrUpdateSkill(
      skillVersion,
      currentProjectRootDirectory,
      skipLocalSkillChecks,
      getBladePatternDocsToolName,
    );
    if (createOrUpdateSkill) {
      return createOrUpdateSkill;
    }
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
        rootDirectoryName: currentProjectRootDirectory
          ? basename(currentProjectRootDirectory)
          : undefined,
        skillVersion,
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

// Callback for stdio transport
const getBladePatternDocsStdioCallback: ToolCallback<typeof getBladePatternDocsStdioSchema> = ({
  patternsList,
  currentProjectRootDirectory,
  clientName,
}) => {
  return getBladePatternDocsCore({
    patternsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: false, // Perform skill checks for stdio
    clientName,
  });
};

// Callback for HTTP transport
const getBladePatternDocsHttpCallback: ToolCallback<typeof getBladePatternDocsHttpSchema> = ({
  patternsList,
  skillVersion,
  clientName,
  currentProjectRootDirectory,
}) => {
  return getBladePatternDocsCore({
    patternsList,
    currentProjectRootDirectory,
    skipLocalSkillChecks: true, // Skip local skill checks for HTTP
    skillVersion,
    clientName,
  });
};

export {
  getBladePatternDocsToolName,
  getBladePatternDocsToolDescription,
  getBladePatternDocsStdioCallback,
  getBladePatternDocsHttpCallback,
  getBladePatternDocsStdioSchema,
  getBladePatternDocsHttpSchema,
};
