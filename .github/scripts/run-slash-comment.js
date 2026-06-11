const fs = require('fs');

const endpoint = 'https://slash-api-ext.razorpay.com/api/v1/agents/run';
const username = process.env.SLASH_API_USERNAME;
const password = process.env.SLASH_API_PASSWORD;

if (!username || !password) {
  console.error('Missing SLASH_API_USERNAME or SLASH_API_PASSWORD');
  process.exit(1);
}

const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

const commentBody = fs.readFileSync('/tmp/comment_body.txt', 'utf-8').trim();
const diffHunk = fs.readFileSync('/tmp/diff_hunk.txt', 'utf-8').trim();

const prNumber = process.env.PR_NUMBER;
const prUrl = process.env.PR_URL;
const prTitle = process.env.PR_TITLE;
const prBranch = process.env.PR_BRANCH;
const repository = process.env.PR_REPOSITORY;
const commentId = process.env.COMMENT_ID;
const commentAuthor = process.env.COMMENT_AUTHOR;
const commentType = process.env.COMMENT_TYPE;
const commentPath = process.env.COMMENT_PATH;
const commentLine = process.env.COMMENT_LINE;

let location = '';
if (commentPath) {
  location = `File: ${commentPath}`;
  if (commentLine) location += `, Line: ${commentLine}`;
}
if (diffHunk) location += `\nDiff hunk:\n${diffHunk}`;

let prompt = `Resolve a PR review comment on PR #${prNumber} in ${repository}.\n\n`;
prompt += `PR: ${prUrl}\n`;
prompt += `Title: ${prTitle}\n`;
prompt += `Branch: ${prBranch}\n\n`;
prompt += `Comment by @${commentAuthor} (comment #${commentId}, type: ${commentType}):\n`;
prompt += `${commentBody}\n`;
if (location) prompt += `\n${location}\n`;
prompt += `\nInstructions:\n`;
prompt += `- Look at the PR diff on branch ${prBranch} for context.\n`;
prompt += `- Either reply to the comment with a text response, OR push a code fix to branch ${prBranch}.\n`;
prompt += `- After responding, make sure your reply includes the text "resolved by agent".\n`;
prompt += `- If you need clarification from the PR author, add the label "Human Help Needed" to PR #${prNumber} instead of guessing.`;

const payload = {
  prompt,
  repository_url: `https://github.com/${repository}`,
  branch: prBranch,
};

async function main() {
  console.log(`Triggering Slash to resolve comment #${commentId} on PR #${prNumber}`);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();
  console.log(`HTTP status: ${response.status}`);
  console.log(responseText);

  if (response.status === 200 || response.status === 201 || response.status === 202) {
    let taskId = '';
    try {
      const parsed = JSON.parse(responseText);
      taskId = parsed.task_id || parsed.id || '';
    } catch (_) {}
    console.log(`Comment resolution task created — task_id: ${taskId}`);
  } else {
    console.error(`Slash comment resolution request failed with HTTP ${response.status}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Failed to trigger Slash:', error);
  process.exit(1);
});
