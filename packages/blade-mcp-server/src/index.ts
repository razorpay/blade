#!/usr/bin/env node

import { readFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
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
    name: 'Blade MCP Server',
    version: packageJson.version,
  });

  server.tool(
    'get-blade-components',
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
        const componentNames = componentList.split(',').map((name) => name.trim());

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
  console.error('Blade MCP Server connected successfully');
} catch (error: unknown) {
  console.error('Blade MCP Server initialization failed:', error);
  process.exit(1);
}
