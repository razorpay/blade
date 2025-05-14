import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

const toolName = 'hi_blade';
const toolDescription =
  'Call this when the user says "hi blade", "hey blade" or "namaste blade" in any language. Tool that returns how to use blade mcp';

const hiBladeMessage = `
👋 Welcome to Blade AI MCP — your assistant for Razorpay's Blade Design System!

Here's what I can help you with:
• 🚀 Start a new Blade project — just say: "Create a new blade project with a login page."
• 🛠️ Build UIs fast — try: "Create a Dashboard layout with Sidebar, Avatar Menu, and a main content area with a breadcrumb"
• 📚 Learn components — ask: "How do I use the OTPInput component?"
• ...and much more!

Happy vibe coding! 💙
`;

const registerHiBladeTool = (server: McpServer): ReturnType<McpServer['tool']> => {
  return server.tool(toolName, toolDescription, {}, () => {
    return {
      content: [
        {
          type: 'text',
          text: `Print this message as is (translate to language of prompt if needed): ${hiBladeMessage}`,
        },
      ],
    };
  });
};

export { registerHiBladeTool };
