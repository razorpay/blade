#!/usr/bin/env node
/**
 * Checks how many times the auto-resolve workflow has already run on this PR.
 * Exits with code 1 (and outputs "allowed=false") if the limit is reached.
 *
 * The max-count limit only applies to "slash comments" — i.e. auto-resolution
 * of high-confidence comments posted by rzp-slash-public[bot].  Reviews that
 * contain an explicit @rzp-slash-public or @razorpay/slash-public mention (manual delegation) bypass
 * the limit so they are always processed.
 *
 * Outputs "allowed=true/false" to GITHUB_OUTPUT.
 */

const { execSync } = require('child_process');
const fs = require('fs');

const repo = process.env.GITHUB_REPOSITORY;
const prNumber = parseInt(process.env.PR_NUMBER, 10);
const reviewId = process.env.REVIEW_ID;
const workflowRef = process.env.GITHUB_WORKFLOW_REF;
const githubOutput = process.env.GITHUB_OUTPUT;
const MAX_RUNS = 20;
const HUMAN_HELP_NEEDED_LABEL = 'Human Help Needed 🧑🏻‍💻';

function output(allowed) {
  const line = `allowed=${allowed}\n`;
  if (githubOutput) fs.appendFileSync(githubOutput, line);
  else process.stdout.write(line);
}

function addHumanHelpNeededLabel() {
  try {
    execSync(
      `gh api "repos/${repo}/issues/${prNumber}/labels" --method POST --field "labels[]=${HUMAN_HELP_NEEDED_LABEL}"`,
      { encoding: 'utf8', stdio: 'pipe' },
    );
    console.log(`Added '${HUMAN_HELP_NEEDED_LABEL}' label to PR #${prNumber}.`);
  } catch (err) {
    console.error(`Failed to add '${HUMAN_HELP_NEEDED_LABEL}' label:`, err.message);
  }
}

/**
 * Returns true when the current review contains at least one comment that
 * explicitly mentions @rzp-slash-public or @razorpay/slash-public (manual delegation).  These comments
 * are outside the scope of the max-count limit.
 */
function reviewHasManualDelegation() {
  if (!reviewId) return false;
  try {
    const comments = JSON.parse(
      execSync(`gh api "repos/${repo}/pulls/${prNumber}/reviews/${reviewId}/comments"`, {
        encoding: 'utf8',
      }),
    );
    return comments.some((c) => c.body.includes('@rzp-slash-public') || c.body.includes('@razorpay/slash-public'));
  } catch (err) {
    console.log(`Could not fetch review comments to check for manual delegation: ${err.message}`);
    return false;
  }
}

// GITHUB_WORKFLOW_REF format: "org/repo/.github/workflows/filename.yml@refs/heads/branch"
const workflowFilename = workflowRef.split('@')[0].split('/').pop();

const count = parseInt(
  execSync(
    `gh api "repos/${repo}/actions/workflows/${workflowFilename}/runs?event=pull_request_review&per_page=100" --jq '[.workflow_runs[] | select(.pull_requests[]?.number == ${prNumber})] | length'`,
    { encoding: 'utf8' },
  ).trim(),
  10,
);

console.log(`Auto-resolve has run ${count} time(s) on this PR (max: ${MAX_RUNS}).`);

if (count >= MAX_RUNS) {
  if (reviewHasManualDelegation()) {
    console.log('Limit reached, but review contains an explicit @rzp-slash-public or @razorpay/slash-public mention — allowing.');
    output('true');
  } else {
    console.log('Limit reached — skipping to prevent feedback loop.');
    addHumanHelpNeededLabel();
    output('false');
  }
} else {
  output('true');
}
