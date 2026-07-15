import { readFileSync } from 'fs';
import { join, basename } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  analyticsToolCallEventName,
  GENERAL_KNOWLEDGEBASE_DIRECTORY,
  SVELTE_KNOWLEDGEBASE_DIRECTORY,
} from '../utils/tokens.js';
import {
  commonBladeMCPToolSchema,
  httpTransportSkillVersionSchema,
} from '../utils/getCommonSchema.js';

import { getBladeDocsList } from '../utils/generalUtils.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { getBladeDocsResponseText } from '../utils/getBladeDocsResponseText.js';
import { shouldCreateOrUpdateSkill } from '../utils/skillUtils.js';
import type { McpToolResponse } from '../utils/types.js';
import type { BladeFramework } from '../types/framework.js';
import { detectFrameworkFromProject } from '../utils/detectFramework.js';

const reactGeneralDocsList = getBladeDocsList('general', 'react');
const svelteGeneralDocsList = getBladeDocsList('general', 'svelte');

const getBladeGeneralDocsToolName = 'get_blade_general_docs';

const reactGeneralDocsGuide = readFileSync(
  join(GENERAL_KNOWLEDGEBASE_DIRECTORY, 'index.md'),
  'utf8',
);

const svelteGeneralDocsGuide = readFileSync(
  join(SVELTE_KNOWLEDGEBASE_DIRECTORY, 'general', 'index.md'),
  'utf8',
);

const getBladeGeneralDocsToolDescription = `Fetch general Blade Design System documentation. Use this to get information about setup, installation, theming, tokens, and general guidelines. Pass framework="svelte" for Blade Svelte setup docs or framework="react" for the React catalog. When framework is omitted, it is auto-detected from the consumer project's package.json (@razorpay/blade-svelte → svelte, @razorpay/blade → react; defaults to react).`;

const frameworkSchema = z
  .enum(['react', 'svelte'])
  .optional()
  .describe(
    'Target framework for general docs. Use "react" for @razorpay/blade or "svelte" for @razorpay/blade-svelte. When omitted, auto-detected from consumer package.json dependencies.',
  );

// Schema for stdio transport
const getBladeGeneralDocsStdioSchema = {
  topicsList: z
    .string()
    .describe(
      `Comma separated list of general documentation topics. E.g. "Installation, Usage". React topics: ${reactGeneralDocsList.join(
        ', ',
      )}. Svelte topics: ${svelteGeneralDocsList.join(
        ', ',
      )}. React guide:\n${reactGeneralDocsGuide}\n\nSvelte guide:\n${svelteGeneralDocsGuide}`,
    ),
  framework: frameworkSchema,
  ...commonBladeMCPToolSchema,
};

// Schema for HTTP transport
const getBladeGeneralDocsHttpSchema = {
  ...getBladeGeneralDocsStdioSchema,
  ...httpTransportSkillVersionSchema,
};

// Core business logic function
const getBladeGeneralDocsCore = ({
  topicsList,
  framework,
  currentProjectRootDirectory,
  skipLocalSkillChecks = false,
  skillVersion = '0',
  clientName,
}: {
  topicsList: string;
  framework?: BladeFramework;
  currentProjectRootDirectory?: string;
  skipLocalSkillChecks?: boolean;
  skillVersion?: string;
  clientName: 'claude' | 'cursor' | 'unknown';
}): McpToolResponse => {
  const resolvedFramework = framework ?? detectFrameworkFromProject(currentProjectRootDirectory);
  const bladeGeneralDocsList = getBladeDocsList('general', resolvedFramework);
  const topics = topicsList.split(',').map((s) => s.trim());
  const invalidTopics = topics.filter((topic) => !bladeGeneralDocsList.includes(topic));
  if (invalidTopics.length > 0) {
    return handleError({
      toolName: getBladeGeneralDocsToolName,
      mcpErrorMessage: `Invalid argument topicsList. Invalid values: ${invalidTopics.join(
        ', ',
      )}. Valid general docs values for framework="${resolvedFramework}": ${bladeGeneralDocsList.join(
        ', ',
      )}`,
    });
  }

  if (currentProjectRootDirectory) {
    const createOrUpdateSkill = shouldCreateOrUpdateSkill(
      skillVersion,
      currentProjectRootDirectory,
      skipLocalSkillChecks,
      getBladeGeneralDocsToolName,
    );
    if (createOrUpdateSkill) {
      return createOrUpdateSkill;
    }
  }

  try {
    const responseText = getBladeDocsResponseText({
      docsList: topicsList,
      documentationType: 'general',
      framework: resolvedFramework,
    });

    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: getBladeGeneralDocsToolName,
        topicsList,
        framework: resolvedFramework,
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
          text: responseText.trim(),
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: getBladeGeneralDocsToolName,
      errorObject: error,
    });
  }
};

// Callback for stdio transport
const getBladeGeneralDocsStdioCallback: ToolCallback<typeof getBladeGeneralDocsStdioSchema> = ({
  topicsList,
  framework,
  currentProjectRootDirectory,
  clientName,
}) => {
  return getBladeGeneralDocsCore({
    topicsList,
    framework,
    currentProjectRootDirectory,
    skipLocalSkillChecks: false,
    clientName,
  });
};

// Callback for HTTP transport
const getBladeGeneralDocsHttpCallback: ToolCallback<typeof getBladeGeneralDocsHttpSchema> = ({
  topicsList,
  framework,
  skillVersion,
  clientName,
  currentProjectRootDirectory,
}) => {
  return getBladeGeneralDocsCore({
    topicsList,
    framework,
    currentProjectRootDirectory,
    skipLocalSkillChecks: true,
    skillVersion,
    clientName,
  });
};

export {
  getBladeGeneralDocsToolName,
  getBladeGeneralDocsToolDescription,
  getBladeGeneralDocsHttpCallback,
  getBladeGeneralDocsStdioCallback,
  getBladeGeneralDocsHttpSchema,
  getBladeGeneralDocsStdioSchema,
};
