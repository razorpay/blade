#!/usr/bin/env node
/**
 * Fetches review comments to resolve, triggers Slash, and posts reply comments.
 *
 * Selects comments that either:
 *   - mention @rzp-slash-public (manual delegation), or
 *   - were posted by rzp-slash-public with confidence >= 8/10 (auto-resolution)
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
    c.body.includes('@rzp-slash-public') ||
    (c.user.login === 'rzp-slash-public[bot]' && /confidence: ([89]\d?|10)\/10/.test(c.body)),
);

if (selected.length === 0) {
  console.log('No eligible comments in this review, skipping.');
  process.exit(0);
}

const commentUrls = selected.map((c) => c.html_url).join('\n');
const commentIds = selected.map((c) => c.id);

const prompt = `Resolve the following PR review comments that were just submitted in a single review.

Comment URLs:
${commentUrls}

Instructions:
  - Fetch the details of the PR and each comment with \`gh\` CLI.
  - For each comment: when it asks for clarification, reply to the comment with a response (including "[resolved by agent]" at the end) OR push a code fix to the PR branch.
  - Whenever applicable, create a fix commit and push it to the PR branch, reply to the relevant comment(s) with "[resolved by agent]" at the end and also mark the comment thread as resolved on github.
  - After investigation and looking at the other code, if you find that a comment is invalid or irrelevant, skip resolving it and just reply to the comment with why that is invalid or irrelevant (add [resolved by agent] at the end).
  - If you need clarification from the PR author for any comment, add the label "Human Help Needed 🧑🏻‍💻" to the PR instead of guessing.`;

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
