#!/usr/bin/env node
/**
 * Checks how many times the auto-resolve workflow has already run on this PR.
 * Exits with code 1 (and outputs "allowed=false") if the limit is reached.
 *
 * Outputs "allowed=true/false" to GITHUB_OUTPUT.
 */

const { execSync } = require('child_process');
const fs = require('fs');

const repo = process.env.GITHUB_REPOSITORY;
const prNumber = parseInt(process.env.PR_NUMBER, 10);
const workflowRef = process.env.GITHUB_WORKFLOW_REF;
const githubOutput = process.env.GITHUB_OUTPUT;
const MAX_RUNS = 20;

function output(allowed) {
  const line = `allowed=${allowed}\n`;
  if (githubOutput) fs.appendFileSync(githubOutput, line);
  else process.stdout.write(line);
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
  console.log('Limit reached — skipping to prevent feedback loop.');
  output('false');
} else {
  output('true');
}
