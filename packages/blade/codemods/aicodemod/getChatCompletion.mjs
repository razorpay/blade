const aiConfig = {
  temperature: 0.7,
  top_p: 0.95,
  max_tokens: 3000,
};

const getChatCompletion = async (messages) => {
  if (process.env.TEST_MODE === 'true') {
    console.log('messages:');
    console.dir(messages, { depth: Infinity });
    return {
      answer: {
        content:
          'The server is running in TEST_MODE environment. Its not supposed to. Blame @Saurabh for this on slack #design-system channel.',
      },
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
    ...aiConfig,
  };

  const GPT4V_ENDPOINT = `${process.env.OPENAI_BASE_URL}/chat/completions?api-version=2024-02-15-preview`;

  // Send request
  let data;
  try {
    data = await fetch(GPT4V_ENDPOINT, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    }).then((response) => {
      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return {
          success: false,
          status: response.status,
          error: 'HTTP error!',
        };
      }

      return response.json();
    });
  } catch (error) {
    console.error(`Failed to make the request. Error: ${error}`);
    return {
      success: false,
      status: 500,
      error,
    };
  }

  console.log('>> USAGE', data.model, data.usage);

  if (data.status === false) {
    return {
      answer: undefined,
      usage: undefined,
      inputLength: JSON.stringify(messages).length,
      error: data.error,
      status: data.status,
    };
  }

  return {
    answer: data.choices[0].message,
    usage: data.usage,
    inputLength: JSON.stringify(messages).length,
  };
};

export { getChatCompletion };
