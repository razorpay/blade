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
const MAX_RUNS = 5;

function output(allowed) {
  const line = `allowed=${allowed}\n`;
  if (githubOutput) fs.appendFileSync(githubOutput, line);
  else process.stdout.write(line);
}

const workflowFilename = workflowRef.split('/').pop().split('@')[0];

const response = execSync(
  `gh api "repos/${repo}/actions/workflows/${workflowFilename}/runs?event=pull_request_review&per_page=100"`,
  { encoding: 'utf8' },
);

const { workflow_runs: runs } = JSON.parse(response);
const count = runs.filter((run) => run.pull_requests?.some((pr) => pr.number === prNumber)).length;

console.log(`Auto-resolve has run ${count} time(s) on this PR (max: ${MAX_RUNS}).`);

if (count >= MAX_RUNS) {
  console.log('Limit reached — skipping to prevent feedback loop.');
  output('false');
} else {
  output('true');
}
