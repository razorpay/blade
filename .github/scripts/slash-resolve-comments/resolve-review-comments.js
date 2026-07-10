#!/usr/bin/env node
/**
 * Fetches review comments to resolve, triggers Slash, and posts reply comments.
 *
 * Selects comments that either:
 *   - mention @rzp-slash-public or @razorpay/slash-public (manual delegation), or
 *   - were posted by rzp-slash-public (auto-resolution, comments with confidence >= 5/10)
 */

const { execSync } = require('child_process');

const repo = process.env.GITHUB_REPOSITORY;
const prNumber = process.env.PR_NUMBER;
const reviewId = process.env.REVIEW_ID;

const allComments = JSON.parse(
  execSync(`gh api "repos/${repo}/pulls/${prNumber}/reviews/${reviewId}/comments"`, {
    encoding: 'utf8',
  }),
);

const selected = allComments.filter(
  (c) =>
    (c.body.includes('@rzp-slash-public') || c.body.includes('@razorpay/slash-public')) ||
    (c.user.login === 'rzp-slash-public[bot]' && /confidence: ([5-9]\d?|10)\/10/.test(c.body)),
);

if (selected.length === 0) {
  console.log('No eligible comments in this review, skipping.');
  process.exit(0);
}

const commentUrls = selected.map((c) => c.html_url).join('\n');
const commentIds = selected.map((c) => c.id);

const prompt = `Resolve the review comments on PR #${prNumber} using the /resolve-comments skill from the blade repo. COMMENT_URLS:\n${commentUrls}\n\nStrictly use the resolve-comments skill from the blade repo only. Do not use any other skill.`;

const responseOutput = execSync(`node .github/scripts/run-slash.js ${JSON.stringify(prompt)}`, {
  encoding: 'utf8',
});
console.log(responseOutput);

const responseLine = responseOutput.split('\n').find((l) => l.startsWith('Response:'));
if (!responseLine) process.exit(0);

const responseJson = responseLine.replace(/^Response: /, '');
const taskIdMatch = responseJson.match(/"task_id"\s*:\s*"([^"]+)"/);
if (!taskIdMatch) process.exit(0);

const executionUrl = `https://slash.concierge.razorpay.com/tasks/${taskIdMatch[1]}/execution-logs`;

for (const commentId of commentIds) {
  execSync(
    `gh api "repos/${repo}/pulls/${prNumber}/comments/${commentId}/replies" --method POST --field body=${JSON.stringify(
      `**✨ Agentic Resolution ✨:** Auto Comment Resolution Triggered ([**View Logs**](${executionUrl}))`,
    )}`,
    { encoding: 'utf8' },
  );
}
