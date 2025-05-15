import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';

const hiBladeMessage = `
👋 Welcome to Blade AI MCP — your assistant for Razorpay's Blade Design System!

Here's what I can help you with:
• 🚀 Start a new Blade project — just say: "Create a new blade project with a login page."
• 🛠️ Build UIs fast — try: "Create a Dashboard layout with Sidebar, Avatar Menu, and a main content area with a breadcrumb"
• 📚 Learn components — ask: "How do I use the OTPInput component?"
• ...and much more!

Happy vibe coding! 💙
  `;

const hiBladeDescription =
  'Call this when the user says "hi blade", "hey blade" or "namaste blade" in any language. Tool that returns how to use blade mcp';

const hiBladeSchema = {};

const hiBladeCallback: ToolCallback<typeof hiBladeSchema> = () => {
  return {
    content: [
      {
        type: 'text',
        text: `Print this message as is (translate to language of prompt if needed): ${hiBladeMessage}`,
      },
    ],
  };
};

export { hiBladeCallback, hiBladeSchema, hiBladeDescription };
