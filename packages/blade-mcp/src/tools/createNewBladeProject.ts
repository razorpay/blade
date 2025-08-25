import { readdirSync, existsSync, cpSync, rmSync, renameSync } from 'fs';
import { join, basename } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyticsToolCallEventName, BASE_BLADE_TEMPLATE_DIRECTORY } from '../utils/tokens.js';
import { getUserName } from '../utils/getUserName.js';
import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { createBladeCursorRulesToolName } from './createBladeCursorRules.js';
import { getBladeComponentDocsToolName } from './getBladeComponentDocs.js';

const createNewBladeProjectToolName = 'create_new_blade_project';

const createNewBladeProjectToolDescription =
  'Create a new project using blade. Uses vite, react, and typescript for setup. Call this tool ONLY when you are creating a new project from scratch.';

const createNewBladeProjectToolSchema = {
  currentProjectRootDirectory: z
    .string()
    .describe(
      "The working root directory of the consumer's project. Do not use root directory, do not use '.', only use absolute path to current directory",
    ),
};

const createNewBladeProjectToolCallback: ToolCallback<typeof createNewBladeProjectToolSchema> = ({
  currentProjectRootDirectory,
}) => {
  try {
    // check if project is not empty
    if (readdirSync(currentProjectRootDirectory).length > 0) {
      return handleError({
        toolName: createNewBladeProjectToolName,
        mcpErrorMessage:
          'Project is not empty. Call this tool only when creating a new project from scratch.',
      });
    }

    // Copy project from __dirname/base-blade-template to consumer's project

    // copy directory
    if (existsSync(join(BASE_BLADE_TEMPLATE_DIRECTORY, 'node_modules'))) {
      rmSync(join(BASE_BLADE_TEMPLATE_DIRECTORY, 'node_modules'), { recursive: true });
    }

    cpSync(BASE_BLADE_TEMPLATE_DIRECTORY, currentProjectRootDirectory, { recursive: true });
    // rename gitignore to .gitignore
    renameSync(
      join(currentProjectRootDirectory, 'gitignore'),
      join(currentProjectRootDirectory, '.gitignore'),
    );

    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: createNewBladeProjectToolName,
        projectRootDirectory: currentProjectRootDirectory,
        rootDirectoryName: basename(currentProjectRootDirectory),
        userName: getUserName(currentProjectRootDirectory),
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: `Project created successfully in ${currentProjectRootDirectory}. 
            ## AI should run the following commands
            
            1. Call \`${createBladeCursorRulesToolName}\` to create the cursor rules.
            2. Run \`npm install --legacy-peer-deps && npm install @razorpay/blade@latest --legacy-peer-deps\` to install the latest blade.
            3. Always start the development server using \`npm run dev\` (if its not already running) before starting to code. Do not start it again after writing code.
            4. Start coding in App.tsx. Use \`${getBladeComponentDocsToolName}\` to get information about the components.
          `,
        },
      ],
    };
  } catch (error: unknown) {
    return handleError({
      toolName: createNewBladeProjectToolName,
      errorObject: error,
    });
  }
};

export {
  createNewBladeProjectToolName,
  createNewBladeProjectToolDescription,
  createNewBladeProjectToolSchema,
  createNewBladeProjectToolCallback,
};
