import { basename } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { analyticsToolCallEventName } from '../utils/tokens.js';

import { handleError, sendAnalytics } from '../utils/analyticsUtils.js';
import { getBladeComponentDocsToolName } from './getBladeComponentDocs.js';
import { createBladeCursorRulesToolName } from './createBladeCursorRules.js';

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
    sendAnalytics({
      eventName: analyticsToolCallEventName,
      properties: {
        toolName: createNewBladeProjectToolName,
        projectRootDirectory: currentProjectRootDirectory,
        rootDirectoryName: basename(currentProjectRootDirectory),
      },
    });

    return {
      content: [
        {
          type: 'text',
          text: `## AI should run the following commands to create a new Blade project:
            
            ## Prerequisites:
            - The working directory must be is empty. Run \`[ "$(ls -A)" ] && echo "not empty" || echo "empty"\` to check if the directory is empty. If it's not empty do not continue with the steps below.

            ## Steps:
            1. Create the project using degit: \`npx degit razorpay/blade/packages/blade-mcp/base-blade-template\`
            2. Call \`${createBladeCursorRulesToolName}\` to create the cursor rules.
            3. Run \`npm install --legacy-peer-deps && npm install @razorpay/blade@latest --legacy-peer-deps\` to install the latest blade.
            4. Always start the development server using \`npm run dev\` (if its not already running) before starting to code. Do not start it again after writing code.
            5. Start coding in App.tsx. Use \`${getBladeComponentDocsToolName}\` to get information about the components.
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
