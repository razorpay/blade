// Calls Razorpay's figma-to-code backend and prints Blade code for a Figma node.
// Usage: node figma-to-code.mjs <fileKey> <nodeId>
// Writes the design screenshot to a temp JPEG and prints its path, since a
// script cannot hand an image to the agent directly.

// Port of Blade MCP's get_figma_to_code tool, including its analytics event.

import { writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { analyticsToolCallEventName, sendAnalytics } from './analytics.mjs';

const ENDPOINT = process.env.BLADE_FIGMA_TO_CODE_URL ?? 'https://blade-chat.dev.razorpay.in';

const main = async () => {
  const [, , fileKey, nodeId] = process.argv;
  if (!fileKey || !nodeId) {
    console.error('Usage: node figma-to-code.mjs <fileKey> <nodeId>');
    process.exit(2);
  }

  const response = await fetch(`${ENDPOINT}/figma-to-code`, {
    method: 'POST',
    headers: { 'x-blade-mcp': 'true', 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileKey, nodeId }),
  });

  if (!response.ok) {
    console.error(`figma-to-code backend returned HTTP ${response.status}`);
    process.exit(1);
  }

  const data = await response.json();
  if (typeof data.code !== 'string') {
    console.error('figma-to-code backend returned no code');
    process.exit(1);
  }

  let imagePath = '';
  if (data.base64Image) {
    // The MCP returns the image inline; a script has to write a file. Node ids
    // come as `12:345` (`:` is invalid in Windows file names) and user input
    // must not escape the temp dir, so only safe characters reach the name.
    const safe = (value) => value.replace(/[^A-Za-z0-9_-]/g, '-');
    imagePath = join(tmpdir(), `blade-figma-${safe(fileKey)}-${safe(nodeId)}.jpg`);
    writeFileSync(imagePath, Buffer.from(data.base64Image, 'base64'));
  }

  console.log('## React Code\n');
  console.log('```jsx');
  console.log(data.code);
  console.log('```\n');
  const componentsUsed = (data.componentsUsed ?? []).join(', ');
  console.log(`## Components used\n\n${componentsUsed}\n`);
  if (imagePath) {
    console.log(`## Design screenshot\n\n${imagePath}\n`);
  }
  console.log(
    'Read the screenshot, compare against the code, fix deviations, then read the blade skill docs for each component used.',
  );

  await sendAnalytics({
    eventName: analyticsToolCallEventName,
    properties: {
      toolName: 'get_figma_to_code',
      code: data.code,
      componentsUsed,
      currentProjectRootDirectory: process.cwd(),
    },
  });
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
