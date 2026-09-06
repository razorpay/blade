#!/usr/bin/env node
/**
 * Finds open, non-draft PRs that have merge conflicts (mergeable: CONFLICTING).
 *
 * Uses the GitHub GraphQL API to fetch mergeable status for up to 100 open PRs
 * in a single call, then filters out:
 *   - Draft PRs
 *   - PRs that already carry the "Human Help Needed 🧑🏻‍💻" label
 *     (Slash already tried and couldn't resolve — no point re-triggering)
 *
 * Outputs a JSON array of { number, branch, url } objects to stdout.
 * Writes "conflict_prs=<json>" to $GITHUB_OUTPUT for workflow consumption.
 */

const { execSync } = require('child_process');
const fs = require('fs');

const repo = process.env.GITHUB_REPOSITORY; // e.g. "razorpay/blade"
const githubOutput = process.env.GITHUB_OUTPUT;
const HUMAN_HELP_NEEDED_LABEL = 'Human Help Needed 🧑🏻‍💻';
const MAX_PRS = 5; // limit per scheduled run to avoid overloading Slash

const [owner, name] = repo.split('/');

const query = `
query {
  repository(owner: "${owner}", name: "${name}") {
    pullRequests(states: OPEN, first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
      nodes {
        number
        isDraft
        mergeable
        headRefName
        url
        labels(first: 20) { nodes { name } }
      }
    }
  }
}`;

const result = JSON.parse(
  execSync(`gh api graphql -f query='${query}'`, { encoding: 'utf8' }),
);

const allPRs = result.data.repository.pullRequests.nodes;

const conflictPRs = allPRs
  .filter((pr) => pr.mergeable === 'CONFLICTING')
  .filter((pr) => !pr.isDraft)
  .filter(
    (pr) =>
      !pr.labels.nodes.some((l) => l.name === HUMAN_HELP_NEEDED_LABEL),
  )
  .slice(0, MAX_PRS)
  .map((pr) => ({
    number: pr.number,
    branch: pr.headRefName,
    url: pr.url,
  }));

const json = JSON.stringify(conflictPRs);

if (githubOutput) {
  fs.appendFileSync(githubOutput, `conflict_prs=${json}\n`);
} else {
  process.stdout.write(json);
}

console.log(
  `Found ${conflictPRs.length} PR(s) with merge conflicts (max ${MAX_PRS} per run).`,
);
