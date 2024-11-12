#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const getFlagValue = (flag) => {
  const flagIndex = process.argv.indexOf(flag);
  if (flagIndex < 0) {
    return undefined;
  }

  return process.argv[flagIndex + 1];
};

// This is for passing ngrok instance URL
const BASE_URL = 'https://blade-chat.dev.razorpay.in';
const SERVER_ENDPOINT = '/chat';

const preset = getFlagValue('--code-knowledge') ?? 'presets/dashboard/table-pattern-1';

const getChatCompletionFromServer = async (messages) => {
  const url = BASE_URL + SERVER_ENDPOINT;

  // Define the fetch options
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'rzpctx-dev-serve-user': 'base',
    },
    body: JSON.stringify({ input: messages }),
  };

  try {
    // Make the fetch call
    const response = await fetch(url, options);
    return response.text();
  } catch (err) {
    throw err;
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

You will find code snippets of these things below-

1. Blade's Table Documentation: Documentation of our design-system table
2. Custom Component Definitions: Custom component implementations to help figure out what some of the internally used components do
3. Migration Example: A reference example of migration. How the output migrated code would look like on given certain input.
4. Code to Migrate: Migrate this code to use our design-system components

Return Format:
- Refer to Blade's Table documentation and Custom Component Definitons and Migration Example and return the migrated code snippet of usage using Blade
- Return raw migrated code without additional text
- Don't change unrelated code and imports
- If something existed in previous code, but does not map to anything in new code. Add a TODO comment describing what needs to be done
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
    content: [
      {
        type: 'text',
        text: ultimatePrompt,
      },
    ],
  },
];

const answer = await getChatCompletionFromServer(messages);

if (answer) {
  console.log('USAGE STATS', {
    inputLength: JSON.stringify(messages).length,
  });

  const cleanOut = answer.startsWith('```jsx')
    ? answer.slice(`\`\`\`jsx`.length + 1, -('```'.length + 1))
    : answer;
  fs.writeFileSync(usageFilePath, cleanOut);
} else {
  console.log(
    "Something's not right. The server didn't respond correctly. Hopefully there are more helpful logs above ^^",
  );
}
