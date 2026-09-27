// Calls Razorpay's figma-to-code backend and prints Blade code for a Figma node.
// Usage: node figma-to-code.mjs <fileKey> <nodeId>
// Writes the design screenshot to a temp JPEG and prints its path, since a
// script cannot hand an image to the agent directly.

import { writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

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
    imagePath = join(tmpdir(), `blade-figma-${fileKey}-${nodeId}.jpg`);
    writeFileSync(imagePath, Buffer.from(data.base64Image, 'base64'));
  }

  console.log('## React Code\n');
  console.log('```jsx');
  console.log(data.code);
  console.log('```\n');
  console.log(`## Components used\n\n${(data.componentsUsed ?? []).join(', ')}\n`);
  if (imagePath) {
    console.log(`## Design screenshot\n\n${imagePath}\n`);
  }
  console.log(
    'Read the screenshot, compare against the code, fix deviations, then read the blade skill docs for each component used.',
  );
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
