'use strict';

/**
 * GitHub API orchestration for the Agentic Merge Ready label.
 * The job always succeeds: it only adds, removes, or leaves the label.
 *
 * Usage (actions/github-script, after checkout):
 *   const { run } = require('./.github/scripts/agentic-merge-ready/add-label.js');
 *   await run({ github, context, core });
 */

const fs = require('fs');

const {
  MERGE_READY_LABEL,
  evaluateComments,
  classifyGatesFromChecks,
  decide,
  SKIP_GATE_STATUS,
  applyInFlightGates,
  buildCommitTimeline,
} = require('./evaluate');
const {
  listReviewState,
  listGateChecksForRef,
  listInFlightGateNames,
  checksForCommits,
} = require('./fetch');

function reportOutcome(core, prNumber, decision) {
  const payload = { pr: prNumber || null, ...decision };
  const json = JSON.stringify(payload, null, 2);
  core.notice(json);
  const summary = process.env.GITHUB_STEP_SUMMARY;
  if (!summary) return;
  try {
    fs.appendFileSync(summary, `## Agentic Merge Ready\n\n\`\`\`json\n${json}\n\`\`\`\n`);
  } catch (error) {
    core.info(`Could not write step summary: ${error.message}`);
  }
}

async function ensureLabel(github, owner, repo, core) {
  try {
    await github.rest.issues.createLabel({
      owner,
      repo,
      name: MERGE_READY_LABEL,
      color: '0E8A16',
      description: 'Slash handled comments and blade required checks are green',
    });
  } catch (error) {
    if (error.status !== 422) {
      core.warning(`Could not ensure label exists: ${error.message}`);
    }
  }
}

async function applyLabelAction(github, owner, repo, prNumber, action, core) {
  if (action === 'add') {
    await ensureLabel(github, owner, repo, core);
    await github.rest.issues.addLabels({
      owner,
      repo,
      issue_number: prNumber,
      labels: [MERGE_READY_LABEL],
    });
    return;
  }
  if (action === 'remove') {
    try {
      await github.rest.issues.removeLabel({
        owner,
        repo,
        issue_number: prNumber,
        name: MERGE_READY_LABEL,
      });
    } catch (error) {
      if (error.status !== 404) throw error;
    }
  }
}

async function run({ github, context, core }) {
  try {
    const { owner, repo } = context.repo;
    const workflowSha = context.payload.workflow_run && context.payload.workflow_run.head_sha;
    const eventPr = context.payload.pull_request;
    const headSha = workflowSha || (eventPr && eventPr.head && eventPr.head.sha);
    if (!headSha) {
      reportOutcome(core, null, {
        action: 'noop',
        skip: 'no_head_sha',
        eligible: false,
        gateStatus: SKIP_GATE_STATUS,
      });
      return;
    }

    let pr = eventPr;
    if (!pr) {
      const { data: associated } = await github.rest.repos.listPullRequestsAssociatedWithCommit({
        owner,
        repo,
        commit_sha: headSha,
      });
      pr = associated.find((item) => item.state === 'open') || associated[0];
    }
    if (!pr || pr.state !== 'open') {
      reportOutcome(core, null, {
        action: 'noop',
        skip: 'no_open_pr',
        headSha: headSha.slice(0, 8),
        eligible: false,
        gateStatus: SKIP_GATE_STATUS,
      });
      return;
    }
    if (pr.draft) {
      reportOutcome(core, pr.number, {
        action: 'noop',
        skip: 'draft',
        eligible: false,
        gateStatus: SKIP_GATE_STATUS,
      });
      return;
    }

    const { data: freshPr } = await github.rest.pulls.get({
      owner,
      repo,
      pull_number: pr.number,
    });
    pr = freshPr;

    const prHead = pr.head.sha;
    const isNewHead = context.eventName === 'pull_request' && context.payload.action === 'synchronize';
    let headGates = 'other';
    let headChecks = [];
    const attempts = isNewHead ? 1 : 4;
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      const inFlight = await listInFlightGateNames(github, owner, repo, prHead);
      headChecks = applyInFlightGates(
        await listGateChecksForRef(github, owner, repo, prHead),
        inFlight,
      );
      headGates = classifyGatesFromChecks(headChecks);
      if (headGates !== 'other' || inFlight.length > 0) break;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 15000));
    }

    const hasLabel = (pr.labels || []).some((label) => label.name === MERGE_READY_LABEL);
    // Push landed before this SHA's gates settled. Drop the label earned on
    // the previous commit. A head that already passed falls through.
    if (isNewHead && headGates !== 'pass') {
      const decision = decide({
        headGates,
        commentEval: { ready: true, noVisibleComments: true },
        commits: [],
        hasLabel,
        onPending: 'remove',
      });
      reportOutcome(core, pr.number, decision);
      await applyLabelAction(github, owner, repo, pr.number, decision.action, core);
      return;
    }

    const [commits, reviewState] = await Promise.all([
      github.paginate(github.rest.pulls.listCommits, {
        owner,
        repo,
        pull_number: pr.number,
        per_page: 100,
      }),
      listReviewState(github, owner, repo, pr.number),
    ]);
    const checksBySha = await checksForCommits(github, owner, repo, commits, prHead, headChecks);
    const timeline = buildCommitTimeline(commits, checksBySha);
    if (timeline.length > 0) timeline[timeline.length - 1].gates = headGates;

    const commentEval = evaluateComments(reviewState.threads, reviewState.reviewDecision);
    const decision = decide({ headGates, commentEval, commits: timeline, hasLabel });
    reportOutcome(core, pr.number, decision);
    await applyLabelAction(github, owner, repo, pr.number, decision.action, core);
  } catch (error) {
    core.warning(`agentic-merge-ready skipped due to error (job stays green): ${error.message}`);
  }
}

module.exports = { run };
