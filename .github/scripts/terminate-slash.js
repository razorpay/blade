const backend = process.env.SLASH_BACKEND || 'swe-agent';
const apBaseUrl = 'https://slash.razorpay.com';
const sweBaseUrl = 'https://slash-api-ext.razorpay.com';
const apApiKey = process.env.SLASH_CI_API_KEY;
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
  console.error('Missing Slash credentials.');
  process.exit(1);
}

async function main() {
  const taskId = process.argv[2];
  if (!taskId) {
    console.error('Missing task_id. Pass as first argument');
    process.exit(1);
  }

  const isAP = backend === 'agent-platform' && apApiKey;
  const endpoint = isAP
    ? `${apBaseUrl}/v2/runs/${taskId}/cancel`
    : `${sweBaseUrl}/api/v1/tasks/${taskId}/terminate`;

  const response = await fetch(endpoint, {
    method: isAP ? 'DELETE' : 'POST',
    headers: {
      Authorization: getAuthorizationHeader(),
      'Content-Type': 'application/json',
    },
    ...(isAP ? {} : { body: JSON.stringify({ reason: 'Superseded by new commit push' }) }),
  });

  const responseText = await response.text();
  console.log(`Status: ${response.status}`);
  console.log(`Response: ${responseText}`);

  if (!response.ok) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
