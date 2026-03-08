import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GenUISpecSchema, genUISchemaPrompt } from './genUISchema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RESOURCE_URI = 'ui://blade-genui/view.html';
const RESOURCE_MIME_TYPE = 'text/html;profile=mcp-app';

const renderBladeUIToolName = 'render_blade_ui';
const renderBladeUIToolDescription = `Render rich, interactive UI using the Blade Design System's GenUI components. This tool displays charts, tables, cards, alerts, and other UI elements directly in the chat interface. Use this when you need to visualize data, show structured information, or create interactive dashboards.

${genUISchemaPrompt}`;

async function getExtApps(): Promise<typeof import('@modelcontextprotocol/ext-apps/server')> {
  const mod = await import('@modelcontextprotocol/ext-apps/server');
  return mod;
}

async function loadHtml(): Promise<string> {
  const htmlPath = path.join(__dirname, '..', '..', 'mcp-app', 'index.html');
  try {
    return await fs.readFile(htmlPath, 'utf-8');
  } catch {
    console.error(`[renderBladeUI] HTML not found at ${htmlPath}. Run 'yarn build:ui' first.`);
    return `<!DOCTYPE html>
<html>
<head><title>Error</title></head>
<body><p>UI bundle not found. Please run yarn build:ui in blade-mcp.</p></body>
</html>`;
  }
}

const registerRenderBladeUITool = async (server: McpServer): Promise<void> => {
  const { registerAppTool, registerAppResource } = await getExtApps();

  registerAppTool(
    server,
    renderBladeUIToolName,
    {
      title: 'Render Blade UI',
      description: renderBladeUIToolDescription,
      inputSchema: { spec: GenUISpecSchema },
      _meta: { ui: { resourceUri: RESOURCE_URI } },
    },
    async (args: Record<string, unknown>) => {
      const spec = args.spec as { components: unknown[] } | undefined;
      const validation = GenUISpecSchema.safeParse(spec);
      const validSpec = validation.success ? validation.data : spec;

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(validSpec, null, 2),
          },
        ],
        structuredContent: { spec: validSpec },
      };
    },
  );

  const html = await loadHtml();

  // Parameter order: server, name, uri, config, readCallback
  registerAppResource(
    server,
    'Blade GenUI Viewer',
    RESOURCE_URI,
    { mimeType: RESOURCE_MIME_TYPE },
    async () => ({
      contents: [
        {
          uri: RESOURCE_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: html,
          _meta: {
            ui: {
              csp: {
                resourceDomains: ['https:'],
                connectDomains: ['https:'],
              },
            },
          },
        },
      ],
    }),
  );
};

export {
  renderBladeUIToolName,
  renderBladeUIToolDescription,
  registerRenderBladeUITool,
  RESOURCE_URI,
};
