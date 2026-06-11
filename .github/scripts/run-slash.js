const baseUrl = 'https://slash-api-ext.razorpay.com';
// const baseUrl = 'https://swe-agent-api.concierge.razorpay.com';
const endpoint = `${baseUrl}/api/v1/agents/run`;
const username = process.env.SLASH_API_USERNAME;
const password = process.env.SLASH_API_PASSWORD;
const token = process.env.SLASH_API_TOKEN;

function getAuthorizationHeader() {
  if (username && password) {
    return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
  }
  if (token) {
    return `Bearer ${token}`;
  }
  console.error('Missing Slash credentials. Set SLASH_API_USERNAME+SLASH_API_PASSWORD or SLASH_API_TOKEN.');
  process.exit(1);
}

async function main() {
  const prompt = process.argv[2] || process.env.SLASH_PROMPT;
  if (!prompt) {
    console.error('Missing prompt. Pass as first argument or set SLASH_PROMPT env var.');
    process.exit(1);
  }

  const payload = { prompt };
  if (process.env.SLASH_REPOSITORY_URL) payload.repository_url = process.env.SLASH_REPOSITORY_URL;
  if (process.env.SLASH_BRANCH) payload.branch = process.env.SLASH_BRANCH;

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

  if (!response.ok) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
