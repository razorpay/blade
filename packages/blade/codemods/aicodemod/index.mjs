#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

// This is our own server from where we call openai
const SERVER_BASE_URL = '';
const SERVER_ENDPOINT = '/chat/completions';

const getChatCompletionFromServer = async (messages) => {
  const url = SERVER_BASE_URL + SERVER_ENDPOINT;

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
4. Blade's Table Documentation: Documentation of our design-system table
3. Current Usage: Usage of the custom implimented component

Return Format:
- Refer to Custom component definitions, and Blade's Table documentation and return the migrated code snippet of custom usage using Blade
- Do not add any additional text
- Don't change unrelated code and imports
- Make sure Blade's Header and Footer are also used wherever needed.
- Ignore the code related to responsiveness as Blade components are responsive by default

## Custom Component Definitions
${codeKnowledge}

## Blade's Table Documentation
${bladeKnowledge}

## Current Usage
${usage}
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
});
fs.writeFileSync(usageFilePath, data.answer.content);
