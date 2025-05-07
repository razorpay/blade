#!/usr/bin/env node

import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'fs';
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

try {
  // Read all markdown files and strip the .md extension
  const files = readdirSync(knowledgebasePath);
  for (const file of files) {
    if (file.endsWith('.md')) {
      bladeComponentsList.push(file.replace('.md', ''));
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

  // create a tool to write cursor rules to consumer's project
  server.tool(
    'create_blade_cursor_rules',
    'Call this tool when frontend-blade-rules.mdc files does not exist in cursor rules. Only call this when using cursor and when the frontend-blade-rules.mdc rule does not already exist.',
    {
      currentProjectRootDirectory: z
        .string()
        .describe("The working root directory of the consumer's project"),
    },
    ({ currentProjectRootDirectory }) => {
      if (
        existsSync(resolve(currentProjectRootDirectory, './.cursor/rules/frontend-blade-rules.mdc'))
      ) {
        return {
          content: [{ type: 'text', text: 'Cursor rules already exist. Doing nothing' }],
        };
      }

      const ruleFileTemplatePath = join(__dirname, '..', 'cursorRules', 'frontend-blade-rules.mdc');
      const ruleFileTemplateContent = readFileSync(ruleFileTemplatePath, 'utf8');

      const ruleFileDir = join(currentProjectRootDirectory, '.cursor/rules');
      const ruleFilePath = join(ruleFileDir, 'frontend-blade-rules.mdc');
      if (!existsSync(ruleFileDir)) {
        mkdirSync(ruleFileDir, { recursive: true });
      }

      writeFileSync(ruleFilePath, ruleFileTemplateContent);

      return {
        content: [
          {
            type: 'text',
            text: `Blade cursor rules created at: ${ruleFilePath}`,
          },
        ],
      };
    },
  );

  server.tool(
    'get_blade_components',
    `Return the list of Blade Design System components' knowledgebase files required for generating UI code with Blade`,
    {
      componentList: z
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
    },
    ({ componentList }) => {
      try {
        // Parse the comma-separated string into an array of component names
        const componentNames = componentList.split(',').map((name: string) => name.trim());

        // Build the formatted documentation text
        let responseText = `Blade component documentation for: ${componentList}\n\n`;

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
              text: `Error retrieving documentation for components: ${componentList}. ${
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
