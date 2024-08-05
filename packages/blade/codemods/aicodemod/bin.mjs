#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { migrated, original } from './sampleMigration.mjs';

const getFlagValue = (flag) => {
  const flagIndex = process.argv.indexOf(flag);
  if (flagIndex < 0) {
    return 'http://localhost:3000';
  }

  return process.argv[flagIndex + 1];
};

// This is for passing ngrok instance URL
const baseUrl = getFlagValue('--base-url');
const SERVER_ENDPOINT = '/chat/completions';

const getChatCompletionFromServer = async (messages) => {
  const url = baseUrl + SERVER_ENDPOINT;

  // Define the fetch options
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  };

  // Make the fetch call
  const response = await fetch(url, options);
  return response.json();
};

const __dirname = new URL('.', import.meta.url).pathname;
const cwd = process.cwd();

const codeKnowledge = fs.readFileSync(path.join(cwd, 'codeKnowledge.md'), 'utf-8');
const bladeKnowledge = fs.readFileSync(path.resolve(__dirname, './knowledge/Table.md'), 'utf-8');

const usageFileArg = process.argv[2];
const usageFilePath = path.join(cwd, usageFileArg);
const usage = fs.readFileSync(usageFilePath, 'utf-8');

const ultimatePrompt = `
I want you to migrate our old codebase code from custom implementation, to use our design-system component called Blade.

You fill find code snippets of these things below-

1. Custom Component Definitions: Custom component implementations to help figure out what they do
2. Blade's Table Documentation: Documentation of our design-system table
3. Example Migration for Reference: Understand and use this as a reference for any migrations
4. Code to Migrate: Migrate this code to use our design-system components

Return Format:
- Refer to Custom component definitions, and Blade's Table documentation and return the migrated code snippet of custom usage using Blade
- Return raw migrated code without additional text
- Don't change unrelated code and imports
- Remove variables that are no longer in use
- Make sure Blade's Header and Footer are also used wherever needed.
- Ignore the code related to mobile responsiveness as Blade components are responsive by default

## 1. Custom Component Definitions
${codeKnowledge}

## 2. Blade's Table Documentation
${bladeKnowledge}

## 3. Example Migration for Reference

### Old Custom Table Code
\`\`\`jsx
${original}
\`\`\`

### Migrated Table Code
\`\`\`jsx
${migrated}
\`\`\`

## 4. Code to Migrate
\`\`\`jsx
${usage}
\`\`\`
`;

const messages = [
  {
    role: 'system',
    content: [
      {
        type: 'text',
        text:
          'You are an AI assistant that helps in migrating codebase from old custom implementation to our internal design-system components',
      },
    ],
  },
  {
    role: 'user',
    content: ultimatePrompt,
  },
];

const data = await getChatCompletionFromServer(messages);
console.log('USAGE STATS', {
  inputLength: data.inputLength,
  openAIUsage: data.usage,
  v: 5,
});

const out = data.answer.content;
const cleanOut = out.startsWith('```jsx')
  ? out.slice(`\`\`\`jsx`.length + 1, -('```'.length + 1))
  : out;
fs.writeFileSync(usageFilePath, cleanOut);
