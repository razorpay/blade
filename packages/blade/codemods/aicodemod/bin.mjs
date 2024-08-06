#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { migrated, original } from './sampleMigration.mjs';

const getFlagValue = (flag) => {
  const flagIndex = process.argv.indexOf(flag);
  if (flagIndex < 0) {
    return undefined;
  }

  return process.argv[flagIndex + 1];
};

// This is for passing ngrok instance URL
const baseUrl = getFlagValue('--base-url') ?? 'https://blade-ds.loca.lt';
const preset = getFlagValue('--code-knowledge') ?? 'presets/dashboard/table-pattern-1';

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

  try {
    // Make the fetch call
    const response = await fetch(url, options);
    return response.json();
  } catch (err) {
    if (err.cause.code === 'ECONNREFUSED') {
      console.log(
        ">> Looks like the Blade OpenAI POC Server is not accessible on network. Tag @Saurabh on slack in #design-system channel so he can start it. P.S. This is just until POC since we don't have a dedicated server yet 🙈",
      );
      process.exit(1);
    } else {
      throw err;
    }
  }
};

const __dirname = new URL('.', import.meta.url).pathname;
const cwd = process.cwd();

let codeKnowledge;
const consumerPresetPath = path.join(cwd, preset);
const predefinedPresetPath = path.join(__dirname, 'knowledge', `${preset}.md`);

if (fs.existsSync(consumerPresetPath)) {
  codeKnowledge = fs.readFileSync(consumerPresetPath, 'utf-8');
} else {
  codeKnowledge = fs.readFileSync(predefinedPresetPath, 'utf-8');
}

const bladeKnowledge = fs.readFileSync(path.resolve(__dirname, './knowledge/Table.md'), 'utf-8');

const usageFileArg = process.argv[2];
const usageFilePath = path.join(cwd, usageFileArg);
const usage = fs.readFileSync(usageFilePath, 'utf-8');

const ultimatePrompt = `
I want you to migrate our old codebase code from custom implementation, to use our design-system component called Blade.

You fill find code snippets of these things below-

1. Blade's Table Documentation: Documentation of our design-system table
2. Custom Component Definitions: Custom component implementations to help figure out what some of the internally used components do
3. Migration Example: A reference example of migration. How the output migrated code would look like on given certain input.
4. Code to Migrate: Migrate this code to use our design-system components

Return Format:
- Refer to Blade's Table documentation and Custom Component Definitons and Migration Example and return the migrated code snippet of usage using Blade
- Return raw migrated code without additional text
- Don't change unrelated code and imports
- Remove unused variables, functions, and imports
- Make sure Blade's Header and Footer are also used wherever needed.
- Ignore the code related to mobile responsiveness as Blade components are responsive by default


## 1. Blade's Table Documentation
${bladeKnowledge}

${codeKnowledge}

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
  v: 9,
});

const out = data.answer.content;
const cleanOut = out.startsWith('```jsx')
  ? out.slice(`\`\`\`jsx`.length + 1, -('```'.length + 1))
  : out;
fs.writeFileSync(usageFilePath, cleanOut);
