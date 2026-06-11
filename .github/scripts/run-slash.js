const baseUrl = 'https://slash-api-ext.razorpay.com';
// const baseUrl = 'https://swe-agent-api.concierge.razorpay.com';
const endpoint = `${baseUrl}/api/v1/agents/run`;
const username = process.env.SLASH_USERNAME;
const password = process.env.SLASH_PASSWORD;
const token = process.env.SLASH_TOKEN;

function getAuthorizationHeader() {
  if (username && password) {
    return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
  }
  if (token) {
    return `Bearer ${token}`;
  }
  console.error('Missing Slash credentials. Set SLASH_USERNAME+SLASH_PASSWORD or SLASH_TOKEN.');
  process.exit(1);
}

async function main() {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: getAuthorizationHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: 'hi slash' }),
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
