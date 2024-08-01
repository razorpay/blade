import { aiConfig } from './config.mjs';

const getChatCompletion = async (messages) => {
  const { testMode, ...payloadConfig } = aiConfig;

  if (testMode) {
    console.log('messages:');
    console.dir(messages, { depth: Infinity });
    return {
      answer:
        'The server is running in testMode. Its not supposed to. Blame @Saurabh for this on slack #design-system channel.',
      usage: { total_tokens: 0 },
      inputLength: JSON.stringify(messages).length,
    };
  }

  const headers = {
    'Content-Type': 'application/json',
    'api-key': process.env.OPENAI_API_KEY,
  };

  // Payload for the request
  const payload = {
    messages,
    ...payloadConfig,
  };

  const GPT4V_ENDPOINT =
    'https://design-system-blade.openai.azure.com/openai/deployments/Designsystem/chat/completions?api-version=2024-02-15-preview';

  // Send request
  let data;
  try {
    data = await fetch(GPT4V_ENDPOINT, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  } catch (error) {
    console.error(`Failed to make the request. Error: ${error}`);
  }

  console.log('>> USAGE', data.model, data.usage);

  return {
    answer: data.choices[0].message,
    usage: data.usage,
    inputLength: JSON.stringify(messages).length,
  };
};

export { getChatCompletion };
