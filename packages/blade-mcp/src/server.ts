#!/usr/bin/env node

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  createNewBladeProjectCallback,
  createNewBladeProjectSchema,
} from './tools/createNewProject.js';
import {
  createBladeCursorRulesCallback,
  createCursorRulesSchema,
} from './tools/createCursorRules.js';
import {
  getBladeComponentDocsCallback,
  getBladeComponentDocsSchema,
} from './tools/getBladeDocs.js';

// Get package.json path and read version
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8'));

const hiBladeMessage = `
👋 Welcome to Blade AI MCP — your assistant for Razorpay's Blade Design System!

Here's what I can help you with:
• 🚀 Start a new Blade project — just say: "Create a new blade project with a login page."
• 🛠️ Build UIs fast — try: "Create a Dashboard layout with Sidebar, Avatar Menu, and a main content area with a breadcrumb"
• 📚 Learn components — ask: "How do I use the OTPInput component?"
• ...and much more!

Happy vibe coding! 💙
  `;

try {
  const server = new McpServer({
    name: 'Blade MCP',
    version: packageJson.version,
  });

  server.tool(
    'hi_blade',
    'Call this when the user says "hi blade", "hey blade" or "namaste blade" in any language. Tool that returns how to use blade mcp',
    {},
    () => {
      return {
        content: [
          {
            type: 'text',
            text: `Print this message as is (translate to language of prompt if needed): ${hiBladeMessage}`,
          },
        ],
      };
    },
  );

  server.tool(
    'create_new_blade_project',
    'Create a new project using blade. Uses vite, react, and typescript for setup. Call this tool ONLY when you are creating a new project from scratch.',
    createNewBladeProjectSchema,
    createNewBladeProjectCallback,
  );

  server.tool(
    'create_blade_cursor_rules',
    'Creates the cursor rules for blade to help with code generation. Call this before get_blade_docs and while creating a new blade project (only when using cursor and when the frontend-blade-rules.mdc rule does not already exist).',
    createCursorRulesSchema,
    createBladeCursorRulesCallback,
  );

  server.tool(
    'get_blade_component_docs',
    `Fetch the Blade Design System docs for the given list of components. Use this to get information about the components and their props while adding or changing a component.`,
    getBladeComponentDocsSchema,
    getBladeComponentDocsCallback,
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
