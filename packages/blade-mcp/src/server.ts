#!/usr/bin/env node

import {
  readFileSync,
  readdirSync,
  existsSync,
  writeFileSync,
  mkdirSync,
  unlinkSync,
  cpSync,
  rmSync,
  renameSync,
} from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
// eslint-disable-next-line import/extensions
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
// eslint-disable-next-line import/extensions
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// Get package.json path and read version
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8'));

// Dynamically read component files from knowledgebase directory
const knowledgebasePath = resolve(__dirname, '../knowledgebase');
const bladeComponentsList: string[] = [];

// Maintaining separate version from package.json since we don't want to re-write cursor rules on every MCP release
const CURSOR_RULES_VERSION = '0.0.2';
const CURSOR_RULES_VERSION_STRING = `rules_version: ${CURSOR_RULES_VERSION}`;

const hasOutDatedRules = (ruleFilePath: string): boolean => {
  const ruleFileContent = readFileSync(ruleFilePath, 'utf8');
  return !ruleFileContent.includes(CURSOR_RULES_VERSION_STRING);
};

try {
  // Read all markdown files and strip the .md extension
  const files = readdirSync(knowledgebasePath);
  for (const file of files) {
    if (file.endsWith('.md')) {
      bladeComponentsList.push(file.replace('.md', '').trim());
    }
  }
} catch (error: unknown) {
  console.error('Error reading knowledgebase directory:', error);
}

try {
  const server = new McpServer({
    name: 'Blade MCP',
    version: packageJson.version,
  });

  const hiBladeMessage = `
👋 Welcome to Blade AI MCP — your assistant for Razorpay's Blade Design System!

Here's what I can help you with:
• 🚀 Start a new Blade project — just say: "Create a new blade project with a login page."
• 🛠️ Build UIs fast — try: "Create a card grid layout using Blade in this file"
• 📚 Learn components — ask: "How do I use the OTPInput component?"
• ...and much more!

Need help or found an issue? Reach out at https://github.com/razorpay/blade/issues or on the #design-system Slack channel.

Happy vibe coding! 💙
  `;

  server.tool(
    'hi_blade',
    'Call this when the user says "hi blade", "hey blade" or "namaste blade". Tool that returns how to use blade mcp',
    {},
    () => {
      return {
        content: [
          {
            type: 'text',
            text: `Print this message as is: ${hiBladeMessage}`,
          },
        ],
      };
    },
  );

  server.tool(
    'create_new_blade_project',
    'Create a new project using blade. Uses vite, react, and typescript for setup. Call this tool ONLY when you are creating a new project from scratch.',
    {
      currentProjectRootDirectory: z
        .string()
        .describe("The working root directory of the consumer's project"),
    },
    ({ currentProjectRootDirectory }) => {
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
      const baseBladeTemplatePath = resolve(__dirname, '..', 'base-blade-template');

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
            3. Run \`npm run dev\` to start the development server.
            4. Start coding App.tsx. use get_blade_docs to get information about the components.
            `,
          },
        ],
      };
    },
  );

  // create a tool to write cursor rules to consumer's project
  server.tool(
    'create_blade_cursor_rules',
    'Creates the cursor rules for blade to help with code generation. Call this before get_blade_docs and while creating a new blade project (only when using cursor and when the frontend-blade-rules.mdc rule does not already exist).',
    {
      currentProjectRootDirectory: z
        .string()
        .describe("The working root directory of the consumer's project"),
    },
    ({ currentProjectRootDirectory }) => {
      const ruleFileDir = join(currentProjectRootDirectory, '.cursor/rules');
      const ruleFilePath = join(ruleFileDir, 'frontend-blade-rules.mdc');

      if (existsSync(ruleFilePath)) {
        if (hasOutDatedRules(ruleFilePath)) {
          // removes the outdated rules file and continues execution to generate new rule file
          unlinkSync(ruleFilePath);
        } else {
          return {
            content: [{ type: 'text', text: 'Cursor rules already exist. Doing nothing' }],
          };
        }
      }

      const ruleFileTemplatePath = join(__dirname, '..', 'cursorRules', 'frontend-blade-rules.mdc');
      const ruleFileTemplateContent = readFileSync(ruleFileTemplatePath, 'utf8').replace(
        'rules_version: <!-- dynamic_version -->',
        `rules_version: ${CURSOR_RULES_VERSION}`,
      );

      if (!existsSync(ruleFileDir)) {
        mkdirSync(ruleFileDir, { recursive: true });
      }

      writeFileSync(ruleFilePath, ruleFileTemplateContent);

      return {
        content: [
          {
            type: 'text',
            text: `Blade cursor rules created at: ${ruleFilePath}. Cursor Rules Version: ${CURSOR_RULES_VERSION}`,
          },
        ],
      };
    },
  );

  server.tool(
    'get_blade_component_docs',
    `Fetch the Blade Design System docs for the given list of components. Use this to get information about the components and their props while adding or changing a component.`,
    {
      componentsList: z
        .string()
        .refine(
          (str) => {
            const components = str.split(',').map((s) => s.trim());
            return components.every((comp) => bladeComponentsList.includes(comp));
          },
          {
            message: `Components must be a comma-separated list of valid component names. Possible values: ${bladeComponentsList.join(
              ', ',
            )}`,
          },
        )
        .describe(
          `Comma separated list of semantic blade component names. E.g. "Button, Accordion, AccordionItem". Make sure to use the semantic components (like PasswordInput for passwords). Possible values: ${bladeComponentsList.join(
            ', ',
          )}`,
        ),
      currentProjectRootDirectory: z
        .string()
        .describe("The working root directory of the consumer's project"),
    },
    ({ componentsList, currentProjectRootDirectory }) => {
      const ruleFilePath = join(
        currentProjectRootDirectory,
        '.cursor/rules/frontend-blade-rules.mdc',
      );

      if (!existsSync(ruleFilePath)) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: 'Cursor rules do not exist. Call create_blade_cursor_rules first.',
            },
          ],
        };
      }

      if (hasOutDatedRules(ruleFilePath)) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text:
                'Cursor rules are outdated. Call create_blade_cursor_rules first to update cursor rules',
            },
          ],
        };
      }

      try {
        // Parse the comma-separated string into an array of component names
        const componentNames = componentsList.split(',').map((name: string) => name.trim());

        // Build the formatted documentation text
        let responseText = `Blade component documentation for: ${componentsList}\n\n`;

        // Process each component
        for (const componentName of componentNames) {
          responseText += `## ${componentName}\n`;

          try {
            const filePath = resolve(knowledgebasePath, `${componentName}.md`);
            const content = readFileSync(filePath, 'utf8');
            responseText += `${content}\n\n`;
          } catch (error: unknown) {
            console.error(`Error reading markdown for component ${componentName}:`, error);
            responseText += `⚠️ Error: Could not read documentation for ${componentName}. The component may not exist or there may be an issue with the file.\n\n`;
          }
        }

        // Return the formatted response
        return {
          content: [
            {
              type: 'text',
              text: responseText.trim(),
            },
          ],
        };
      } catch (error: unknown) {
        console.error('Error processing component documentation request:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error retrieving documentation for components: ${componentsList}. ${
                error instanceof Error ? error.message : 'Unknown error occurred.'
              }`,
            },
          ],
        };
      }
    },
  );

  // Start receiving messages on stdin and sending messages on stdout
  const transport = new StdioServerTransport();

  // Use Promise handling for async operations
  await server.connect(transport);
  console.error('Blade MCP connected successfully.');
} catch (error: unknown) {
  console.error('Blade MCP initialization failed:', error);
  process.exit(1);
}
