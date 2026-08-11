#!/usr/bin/env node
/**
 * Fetches review comments to resolve, triggers Slash, and posts reply comments.
 *
 * Selects comments that either:
 *   - mention @rzp-slash-public or @razorpay/slash-public (manual delegation), or
 *   - were posted by rzp-slash-public (auto-resolution, comments with confidence >= 5/10)
 */

const { execFileSync } = require('child_process');
const { selectEligibleComments } = require('./comment-selection');
const { runGh } = require('./github-api');

const repo = process.env.GITHUB_REPOSITORY;
const prNumber = process.env.PR_NUMBER;
const reviewId = process.env.REVIEW_ID;

const allComments = runGh(
  [
    'api',
    `repos/${repo}/pulls/${prNumber}/reviews/${reviewId}/comments`,
    '--paginate',
    '--jq',
    '.[] | {id, html_url, body: (.body // ""), user: {login: .user.login}}',
  ],
  { format: 'json-lines' },
);

const selected = selectEligibleComments(allComments);

if (selected.length === 0) {
  console.log('No eligible comments in this review, skipping.');
  process.exit(0);
}

const commentUrls = selected.map((c) => c.html_url).join('\n');
const commentIds = selected.map((c) => c.id);

const prompt = `Resolve the review comments on PR #${prNumber} using the /resolve-comments skill from the blade repo. COMMENT_URLS:\n${commentUrls}\n\nStrictly use the resolve-comments skill from the blade repo only. Do not use any other skill.`;

const responseOutput = execFileSync('node', ['.github/scripts/run-slash.js', prompt], {
  encoding: 'utf8',
});
console.log(responseOutput);

const responseLine = responseOutput.split('\n').find((l) => l.startsWith('Response:'));
if (!responseLine) process.exit(0);

const responseJson = responseLine.replace(/^Response: /, '');
const taskIdMatch = responseJson.match(/"task_id"\s*:\s*"([^"]+)"/);
if (!taskIdMatch) process.exit(0);

const executionUrl = `https://slash.concierge.razorpay.com/tasks/${taskIdMatch[1]}/execution-logs`;
const resolutionComment =
  `**✨ Agentic Resolution ✨:** Auto Comment Resolution Triggered ` +
  `([**View Logs**](${executionUrl}))`;

for (const commentId of commentIds) {
  runGh([
    'api',
    `repos/${repo}/pulls/${prNumber}/comments/${commentId}/replies`,
    '--method',
    'POST',
    '--field',
    `body=${resolutionComment}`,
  ]);
}
