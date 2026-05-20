#!/usr/bin/env node
/**
 * Fetches agentic blade metrics for razorpay/blade repo.
 *
 * Usage:
 *   node fetch-metrics.mjs [days]
 *
 *   days: number of days to look back (default: 1)
 */

import { execSync } from "child_process";

const REPO = "razorpay/blade";
const AGENT_AUTHORS = new Set(["rzp-slash", "rzp-slash-public"]);
const AGENT_REVIEWERS = new Set(["rzp-slash", "rzp-slash-public", "rzp-slash-reviewer"]);
const BOT_COMMENTERS = new Set(["changeset-bot[bot]", "github-actions[bot]", "codesandbox-ci[bot]"]);
const AUTO_APPROVE_LABEL = "rcore:eligible-for-auto-approval";

function gh(...args) {
  const result = execSync(`gh ${args.join(" ")}`, { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
  return result.trim() ? JSON.parse(result) : [];
}

function pct(n, d) {
  if (!d) return "N/A";
  return `${Math.round((n / d) * 100)}%`;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

const days = parseInt(process.argv[2] ?? "1", 10);
const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
const sinceLabel = formatDate(since);
const todayLabel = formatDate(new Date());

// Fetch PRs
const allPRs = gh("pr", "list", "--repo", REPO, "--state", "all",
  "--json", "number,title,createdAt,labels,author", "--limit", "200");

const prs = allPRs.filter(p => new Date(p.createdAt) >= since);
const totalPRs = prs.length;

const agentPRs = prs.filter(p => AGENT_AUTHORS.has(p.author.login?.replace("app/", "")));
const humanPRs = totalPRs - agentPRs.length;
const autoApproved = prs.filter(p => p.labels.some(l => l.name === AUTO_APPROVE_LABEL));

// Fetch comments for each PR
let totalComments = 0;
let agentComments = 0;
let resolvedByAgent = 0;

for (const pr of prs) {
  const reviewComments = gh("api", `repos/${REPO}/pulls/${pr.number}/comments`, "--paginate");
  const issueComments = gh("api", `repos/${REPO}/issues/${pr.number}/comments`, "--paginate");

  for (const c of [...reviewComments, ...issueComments]) {
    const user = c.user.login;
    if (BOT_COMMENTERS.has(user)) continue;
    totalComments++;
    if (AGENT_REVIEWERS.has(user) || AGENT_REVIEWERS.has(user.replace("app/", ""))) {
      agentComments++;
    }
    if (c.body.toLowerCase().includes("resolved by agent")) {
      resolvedByAgent++;
    }
  }
}

const humanComments = totalComments - agentComments;

const report = `> Agentic Blade Metrics — ${sinceLabel} to ${todayLabel} (${days} day${days !== 1 ? "s" : ""})

- Timespan: Last ${days} day${days !== 1 ? "s" : ""} (${sinceLabel} to ${todayLabel})

### Summary

| Metric                                                | Value | Description of Metric                                                        |
| ----------------------------------------------------- | ----- | ---------------------------------------------------------------------------- |
| Metric 1: % PRs with auto-approval label              | ${pct(autoApproved.length, totalPRs)} | Percentage of PRs that received the \`rcore:eligible-for-auto-approval\` label |
| Submetric 1: % of comments on PRs (by human)          | ${pct(humanComments, totalComments)} | Percentage of review comments made by human contributors        |
| Submetric 2: % comments marked as resolved (by agent) | ${pct(resolvedByAgent, totalComments)} | Percentage of comments that were resolved by agent           |

### PRs Metric

| Metric                     | Value | Description of Metric                                                    |
| -------------------------- | ----- | ------------------------------------------------------------------------ |
| Total Number of PRs        | ${totalPRs} | Total number of PRs opened in the given timespan                    |
| PRs raised (by agent)      | ${agentPRs.length} | PRs raised by \`rzp-slash\` or \`rzp-slash-public\` user / app        |
| PRs raised (by human)      | ${humanPRs} | Total PRs minus PRs raised by agent                                 |
| % of PRs raised (by human) | ${pct(humanPRs, totalPRs)} | Percentage of PRs opened by human contributors              |
| % of PRs raised (by agent) | ${pct(agentPRs.length, totalPRs)} | Percentage of PRs opened by agent                      |
| Total PRs auto-approved    | ${pct(autoApproved.length, totalPRs)} | Percentage of PRs that have the \`rcore:eligible-for-auto-approval\` label |

### Review Metric

Note: excludes all comments by \`changeset-bot\`, \`github-actions\`, \`codesandbox-ci\` bots

| Metric                                      | Value | Description of Metric                                                         |
| ------------------------------------------- | ----- | ----------------------------------------------------------------------------- |
| Total comments on PRs                       | ${totalComments} | Total number of review comments across all PRs in the timespan      |
| Comments on PRs (by agent)                  | ${agentComments} | Comments by \`rzp-slash\`, \`rzp-slash-public\`, or \`rzp-slash-reviewer\` user/app |
| Comments on PRs (by human)                  | ${humanComments} | Total comments minus comments made by agent                         |
| % of comments on PRs (by human)             | ${pct(humanComments, totalComments)} | Percentage of review comments made by human contributors |
| % of comments on PRs (by agent)             | ${pct(agentComments, totalComments)} | Percentage of review comments made by agent              |
| % of comments marked as resolved (by agent) | ${pct(resolvedByAgent, totalComments)} | Percentage of comments where "resolved by agent" is mentioned |
`;

process.stdout.write(report);
