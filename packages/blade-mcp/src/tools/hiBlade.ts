import { analyticsToolCallEventName } from '../utils/tokens.js';
import { getPackageJSONVersion } from '../utils/generalUtils.js';
import { sendAnalytics } from '../utils/analyticsUtils.js';

import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';

const hiBladeToolName = 'hi_blade';

const hiBladeMessage = `
👋 Welcome to Blade AI MCP v${getPackageJSONVersion()} — your assistant for Razorpay's Blade Design System!

Here's what I can help you with:
• 🚀 Start a new Blade project — just say: "Create a new blade project with a login page."
• 🛠️ Build UIs fast — try: "Create a Dashboard layout with Sidebar, Avatar Menu, and a main content area with a breadcrumb"
• 📚 Learn components — ask: "How do I use the OTPInput component?"
• ...and much more!

Happy vibe coding! 💙
`;

const hiBladeToolDescription =
  'Call this when the user says "hi blade", "hey blade" or "namaste blade" in any language. Tool that returns how to use blade mcp';

const hiBladeToolSchema = {};

const hiBladeToolCallback: ToolCallback<typeof hiBladeToolSchema> = () => {
  sendAnalytics({
    eventName: analyticsToolCallEventName,
    properties: {
      toolName: hiBladeToolName,
    },
  });
  return {
    content: [
      {
        type: 'text',
        text: `Print this message as is in language that user used to greet you: ${hiBladeMessage}`,
      },
    ],
  };
};

export { hiBladeToolName, hiBladeToolDescription, hiBladeToolSchema, hiBladeToolCallback };
