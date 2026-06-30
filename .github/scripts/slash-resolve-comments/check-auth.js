#!/usr/bin/env node
/**
 * Checks whether the actor is authorized to trigger auto-resolution.
 * Authorized if: PR author, rzp-slash-public, or a CODEOWNER.
 *
 * Outputs "authorized=true/false" to GITHUB_OUTPUT.
 */

const { execSync } = require('child_process');
const fs = require('fs');

const actor = process.env.ACTOR;
const prAuthor = process.env.PR_AUTHOR;
const githubOutput = process.env.GITHUB_OUTPUT;

function output(authorized) {
  const line = `authorized=${authorized}\n`;
  if (githubOutput) fs.appendFileSync(githubOutput, line);
  else process.stdout.write(line);
}

if (actor === prAuthor) {
  console.log('Actor is the PR author — authorized.');
  output('true');
  process.exit(0);
}

if (actor === 'rzp-slash-public[bot]') {
  console.log('Actor is rzp-slash-public[bot] — authorized for high-confidence comment resolution.');
  output('true');
  process.exit(0);
}

const codeowners = execSync("grep -oP '@\\K[A-Za-z0-9_-]+' CODEOWNERS | sort -u", { encoding: 'utf8' })
  .split('\n')
  .map((u) => u.trim())
  .filter(Boolean);

if (codeowners.includes(actor)) {
  console.log(`Actor '${actor}' is a CODEOWNER — authorized.`);
  output('true');
} else {
  console.log(`Actor '${actor}' is neither the PR author nor a CODEOWNER — skipping.`);
  output('false');
}
