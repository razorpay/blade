const backend = process.env.SLASH_BACKEND || 'agent-platform';

// Agent-platform path
const apBaseUrl = 'https://slash.razorpay.com';
const apEndpoint = `${apBaseUrl}/v2/runs`;
const apApiKey = process.env.SLASH_CI_API_KEY;

// SWE-agent path (legacy)
const sweBaseUrl = 'https://slash-api-ext.razorpay.com';
const sweEndpoint = `${sweBaseUrl}/api/v1/agents/run`;
const username = process.env.SLASH_API_USERNAME;
const password = process.env.SLASH_API_PASSWORD;
const token = process.env.SLASH_API_TOKEN;

function getAuthorizationHeader() {
  if (backend === 'agent-platform' && apApiKey) {
    return `Bearer ${apApiKey}`;
  }
  if (username && password) {
    return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
  }
  if (token) {
    return `Bearer ${token}`;
  }
  console.error('Missing Slash credentials. Set SLASH_API_USERNAME+SLASH_API_PASSWORD or SLASH_API_TOKEN or SLASH_CI_API_KEY.');
  process.exit(1);
}

async function main() {
  const prompt = process.argv[2] || process.env.SLASH_PROMPT;
  if (!prompt) {
    console.error('Missing prompt. Pass as first argument or set SLASH_PROMPT env var.');
    process.exit(1);
  }

  const isAP = backend === 'agent-platform' && apApiKey;
  const endpoint = isAP ? apEndpoint : sweEndpoint;

  const payload = isAP
    ? { agent_name: 'slash', prompt }
    : { prompt };

  if (process.env.SLASH_REPOSITORY_URL) {
    if (isAP) {
      payload.repositories = [process.env.SLASH_REPOSITORY_URL];
    } else {
      payload.repository_url = process.env.SLASH_REPOSITORY_URL;
    }
  }
  if (process.env.SLASH_BRANCH && !isAP) {
    payload.branch = process.env.SLASH_BRANCH;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: getAuthorizationHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();
  console.log(`Status: ${response.status}`);
  console.log(`Response: ${responseText}`);

  // Extract task_id for both API formats
  if (response.ok) {
    try {
      const data = JSON.parse(responseText);
      const taskId = isAP ? data.id : data.task_id;
      if (taskId) {
        console.log(`task_id: ${taskId}`);
      }
    } catch {}
  }

  if (!response.ok) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
