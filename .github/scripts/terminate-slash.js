const baseUrl = 'https://slash-api-ext.razorpay.com';
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
  const taskId = process.argv[2];
  if (!taskId) {
    console.error('Missing task_id. Pass as first argument.');
    process.exit(1);
  }

  const response = await fetch(`${baseUrl}/api/v1/tasks/${taskId}/terminate`, {
    method: 'POST',
    headers: {
      Authorization: getAuthorizationHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason: 'Superseded by new commit push' }),
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
