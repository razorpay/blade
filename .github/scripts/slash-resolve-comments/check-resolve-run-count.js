#!/usr/bin/env node
/**
 * Checks how many times the auto-resolve workflow has already run on this PR.
 * Outputs "allowed=false" when the review is ineligible or the limit is reached.
 *
 * The max-count limit only applies to "slash comments" — i.e. auto-resolution
 * of high-confidence comments posted by rzp-slash-public[bot].  Reviews that
 * contain an explicit @rzp-slash-public or @razorpay/slash-public mention (manual delegation) bypass
 * the limit so they are always processed.
 *
 * Outputs "allowed=true/false" to GITHUB_OUTPUT.
 */

const fs = require('fs');
const {
  countResolutionAttempts,
  isManualDelegation,
  selectEligibleComments,
} = require('./comment-selection');
const { runGh } = require('./github-api');

const repo = process.env.GITHUB_REPOSITORY;
const prNumber = parseInt(process.env.PR_NUMBER, 10);
const reviewId = process.env.REVIEW_ID;
const githubOutput = process.env.GITHUB_OUTPUT;
const MAX_RUNS = 10;
const HUMAN_HELP_NEEDED_LABEL = 'Human Help Needed 🧑🏻‍💻';

function output(allowed) {
  const line = `allowed=${allowed}\n`;
  if (githubOutput) fs.appendFileSync(githubOutput, line);
  else process.stdout.write(line);
}

function addHumanHelpNeededLabel() {
  try {
    runGh([
      'api',
      `repos/${repo}/issues/${prNumber}/labels`,
      '--method',
      'POST',
      '--field',
      `labels[]=${HUMAN_HELP_NEEDED_LABEL}`,
    ]);
    console.log(`Added '${HUMAN_HELP_NEEDED_LABEL}' label to PR #${prNumber}.`);
  } catch (err) {
    console.error(`Failed to add '${HUMAN_HELP_NEEDED_LABEL}' label:`, err.message);
  }
}

if (!reviewId) {
  console.error('REVIEW_ID is required to evaluate the current review.');
  output('false');
  process.exit(1);
}

const currentReviewComments = runGh(
  [
    'api',
    `repos/${repo}/pulls/${prNumber}/reviews/${reviewId}/comments`,
    '--paginate',
    '--jq',
    '.[] | {body: (.body // ""), user: {login: .user.login}}',
  ],
  { format: 'json-lines' },
);
const selectedComments = selectEligibleComments(currentReviewComments);

if (selectedComments.length === 0) {
  console.log('No eligible comments in this review, skipping.');
  output('false');
  process.exit(0);
}

if (selectedComments.some(isManualDelegation)) {
  console.log('Review contains an explicit Slash mention — allowing manual delegation.');
  output('true');
  process.exit(0);
}

const previousReviewComments = runGh(
  [
    'api',
    `repos/${repo}/pulls/${prNumber}/comments`,
    '--paginate',
    '--jq',
    '.[] | {body: (.body // "")}',
  ],
  { format: 'json-lines' },
);
const count = countResolutionAttempts(previousReviewComments);

console.log(`Auto-resolve has run ${count} time(s) on this PR (max: ${MAX_RUNS}).`);

if (count >= MAX_RUNS) {
  console.log('Limit reached — skipping to prevent feedback loop.');
  addHumanHelpNeededLabel();
  output('false');
  process.exit(0);
}

output('true');
