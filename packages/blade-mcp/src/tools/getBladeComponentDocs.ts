import { basename } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyticsToolCallEventName } from '../utils/tokens.js';
import { getBladeDocsList } from '../utils/generalUtils.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { getBladeDocsResponseText } from '../utils/getBladeDocsResponseText.js';
import { shouldCreateOrUpdateSkill } from '../utils/skillUtils.js';
import type { McpToolResponse } from '../utils/types.js';
import {
  commonBladeMCPToolSchema,
  httpTransportSkillVersionSchema,
} from '../utils/getCommonSchema.js';
import type { BladeFramework } from '../types/framework.js';
import { frameworkSchema } from '../types/framework.js';
import { detectFrameworkFromProject } from '../utils/detectFramework.js';

const reactComponentsList = getBladeDocsList('components', 'react');
const svelteComponentsList = getBladeDocsList('components', 'svelte');
const reactComponentsListString = reactComponentsList.join(', ');
const svelteComponentsListString = svelteComponentsList.join(', ');

const getBladeComponentDocsToolName = 'get_blade_component_docs';
const getBladeComponentDocsToolDescription = `Fetch the Blade Design System docs for the given list of components. Use this to get information about the components and their props while adding or changing a component. Pass framework="svelte" for Blade Svelte docs (limited catalog) or framework="react" for the full React catalog. When framework is omitted, it is auto-detected from the consumer project's package.json (@razorpay/blade-svelte → svelte, @razorpay/blade → react; defaults to react).`;

// Schema for stdio transport
const getBladeComponentDocsStdioSchema = {
  componentsList: z
    .string()
    .describe(
      `Comma separated list of semantic blade component names. E.g. "Button, Accordion". Make sure to use the semantic components (like PasswordInput for passwords). React components: ${reactComponentsListString}. Svelte components: ${svelteComponentsListString}.`,
    ),
  framework: frameworkSchema.describe(
    'Target framework for component docs. Use "react" for @razorpay/blade or "svelte" for @razorpay/blade-svelte. When omitted, auto-detected from consumer package.json dependencies.',
  ),
  ...commonBladeMCPToolSchema,
};

// Schema for HTTP transport
const getBladeComponentDocsHttpSchema = {
  ...getBladeComponentDocsStdioSchema,
  ...httpTransportSkillVersionSchema,
};

// Core business logic function
const getBladeComponentDocsCore = ({
  componentsList,
  framework,
  currentProjectRootDirectory,
  skipLocalSkillChecks = false,
  skillVersion = '0',
  clientName,
}: {
  componentsList: string;
  framework?: BladeFramework;
  currentProjectRootDirectory?: string;
  skipLocalSkillChecks?: boolean;
  skillVersion?: string;
  clientName: 'claude' | 'cursor' | 'unknown';
}): McpToolResponse => {
  const resolvedFramework = framework ?? detectFrameworkFromProject(currentProjectRootDirectory);
  const bladeComponentsList = getBladeDocsList('components', resolvedFramework);
  const bladeComponentsListString = bladeComponentsList.join(', ');
  const components = componentsList.split(',').map((s) => s.trim());
  const invalidComponents = components.filter((comp) => !bladeComponentsList.includes(comp));
  const invalidComponentsString = invalidComponents.join(', ');
  if (invalidComponents.length > 0) {
    return handleError({
      toolName: getBladeComponentDocsToolName,
      mcpErrorMessage: `Invalid argument componentsList. Invalid values: ${invalidComponentsString}. Valid component docs values for framework="${resolvedFramework}": ${bladeComponentsListString}. Make sure to call the parent component name (e.g. instead of calling ListViewFilters, call ListView)`,
    });
  }

  if (currentProjectRootDirectory) {
    const createOrUpdateSkill = shouldCreateOrUpdateSkill(
      skillVersion,
      currentProjectRootDirectory,
      skipLocalSkillChecks,
      getBladeComponentDocsToolName,
    );
    if (createOrUpdateSkill) {
      return createOrUpdateSkill;
    }
  }

  try {
    const responseText = getBladeDocsResponseText({
      docsList: componentsList,
      documentationType: 'components',
      framework: resolvedFramework,
    });

    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: getBladeComponentDocsToolName,
        componentsList,
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
      toolName: getBladeComponentDocsToolName,
      errorObject: error,
    });
  }
};

// Callback for stdio transport
const getBladeComponentDocsStdioCallback: ToolCallback<typeof getBladeComponentDocsStdioSchema> = ({
  componentsList,
  framework,
  currentProjectRootDirectory,
  clientName,
}) => {
  return getBladeComponentDocsCore({
    componentsList,
    framework,
    currentProjectRootDirectory,
    skipLocalSkillChecks: false,
    clientName,
  });
};

// Callback for HTTP transport
const getBladeComponentDocsHttpCallback: ToolCallback<typeof getBladeComponentDocsHttpSchema> = ({
  componentsList,
  framework,
  skillVersion,
  clientName,
  currentProjectRootDirectory,
}) => {
  return getBladeComponentDocsCore({
    componentsList,
    framework,
    currentProjectRootDirectory,
    skipLocalSkillChecks: true,
    skillVersion,
    clientName,
  });
};

export {
  getBladeComponentDocsToolName,
  getBladeComponentDocsToolDescription,
  getBladeComponentDocsHttpCallback,
  getBladeComponentDocsStdioCallback,
  getBladeComponentDocsStdioSchema,
  getBladeComponentDocsHttpSchema,
};
