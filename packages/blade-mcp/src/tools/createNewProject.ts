import { readdirSync, existsSync, cpSync, rmSync, renameSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import { BASE_BLADE_TEMPLATE_DIRECTORY } from '../utils.js';

const createNewBladeProjectSchema = {
  currentProjectRootDirectory: z
    .string()
    .describe("The working root directory of the consumer's project"),
};

const createNewBladeProjectCallback: ToolCallback<typeof createNewBladeProjectSchema> = ({
  currentProjectRootDirectory,
}) => {
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

  return {
    content: [
      {
        type: 'text',
        text: `Project created successfully in ${currentProjectRootDirectory}. \n            ## AI should run the following commands\n\n            1. Call create_blade_cursor_rules to create the cursor rules.\n            2. Run \`npm install --legacy-peer-deps && npm install @razorpay/blade@latest --legacy-peer-deps\` to install the latest blade.\n            3. Always start the development server using \`npm run dev\` (if its not already running) before starting to code. Do not start it again after writing code.\n            4. Start coding in App.tsx. use get_blade_docs to get information about the components.\n            `,
      },
    ],
  };
};

export { createNewBladeProjectCallback, createNewBladeProjectSchema };
