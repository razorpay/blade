import { readdirSync, existsSync, cpSync, rmSync, renameSync } from 'fs';
import { resolve, join } from 'path';
import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { workingDirectory } from '../../utils/get-working-dir.js';

const toolName = 'create_new_blade_project';
const toolDescription =
  'Create a new project using blade. Uses vite, react, and typescript for setup. Call this tool ONLY when you are creating a new project from scratch.';

const toolSchema = {
  currentProjectRootDirectory: z
    .string()
    .describe("The working root directory of the consumer's project"),
};

const registerCreateNewBladeProjectTool = (server: McpServer): ReturnType<McpServer['tool']> => {
  return server.tool(toolName, toolDescription, toolSchema, ({ currentProjectRootDirectory }) => {
    // check if project is not empty
    if (readdirSync(currentProjectRootDirectory).length > 0) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text:
              'Project is not empty. Call this tool only when creating a new project from scratch.',
          },
        ],
      };
    }

    // Copy project from __dirname/base-blade-template to consumer's project
    const baseBladeTemplatePath = resolve(workingDirectory, 'base-blade-template');

    // copy directory
    if (existsSync(join(baseBladeTemplatePath, 'node_modules'))) {
      rmSync(join(baseBladeTemplatePath, 'node_modules'), { recursive: true });
    }

    cpSync(baseBladeTemplatePath, currentProjectRootDirectory, { recursive: true });
    // rename gitignore to .gitignore
    renameSync(
      join(currentProjectRootDirectory, 'gitignore'),
      join(currentProjectRootDirectory, '.gitignore'),
    );

    return {
      content: [
        {
          type: 'text',
          text: `Project created successfully in ${currentProjectRootDirectory}. 
          ## AI should run the following commands

          1. Call create_blade_cursor_rules to create the cursor rules.
          2. Run \`npm install --legacy-peer-deps && npm install @razorpay/blade@latest --legacy-peer-deps\` to install the latest blade.
          3. Always start the development server using \`npm run dev\` (if its not already running) before starting to code
          4. Start coding in App.tsx. use get_blade_docs to get information about the components.
          `,
        },
      ],
    };
  });
};

export { registerCreateNewBladeProjectTool };
