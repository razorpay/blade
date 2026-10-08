'use strict';

/**
 * Predicates for the ✨ Agentic Merge Ready ✨ label.
 * Slash reactions on the original comment: rocket / -1 ready, confused blocks.
 * A summary-only CHANGES_REQUESTED review blocks too. Orchestration: add-label.js.
 */

const MERGE_READY_LABEL = '✨ Agentic Merge Ready ✨';
// Required status checks on master that come from blade-validate.yml.
const VALIDATE_WORKFLOW_FILE = 'blade-validate.yml';
const GATE_CHECK_NAMES = [
  'Validate Source Code',
  'Run Tests (1)',
  'Run Tests (2)',
  'Run Tests (3)',
  'Run Tests (4)',
];
const FAIL_CONCLUSIONS = new Set([
  'failure',
  'cancelled',
  'canceled',
  'timed_out',
  'action_required',
  'cancel',
]);
const HANDLED_REACTIONS = new Set(['ROCKET', 'THUMBS_DOWN']);
const BLOCKING_REACTIONS = new Set(['CONFUSED']);
// GraphQL's Actor.login omits the "[bot]" suffix that REST logins carry
// (e.g. "rzp-slash" vs "rzp-slash[bot]"); loginOf() strips it so both
// naming conventions resolve to the same entries below.
const SLASH_REACTION_LOGINS = new Set(['rzp-slash', 'rzp-slash-public', 'rzp-slash-reviewer']);
const WORKFLOW_TO_GATES = {
  [VALIDATE_WORKFLOW_FILE]: GATE_CHECK_NAMES,
};

// Slash commits are pushed with a git author/committer name like
// "rzp-slash[bot]" that GitHub often cannot link to an account, so match on
// the name: anything containing both "slash" and "[bot]".
function isSlashName(name) {
  const normalized = String(name || '').toLowerCase();
  return normalized.includes('slash') && normalized.includes('[bot]');
}

function isSlashBotCommit({ authorName = '', committerName = '' } = {}) {
  return isSlashName(authorName) || isSlashName(committerName);
}

function classifyGatesFromChecks(checks) {
  const byName = {};
  for (const check of checks || []) {
    if (!GATE_CHECK_NAMES.includes(check.name)) continue;
    byName[check.name] = check.conclusion;
  }
  const conclusions = GATE_CHECK_NAMES.map((name) => byName[name]);
  if (conclusions.some((value) => FAIL_CONCLUSIONS.has(value))) return 'fail';
  if (conclusions.every((value) => value === 'success')) return 'pass';
  return 'other';
}

function loginOf(user) {
  return ((user && user.login) || '').replace(/\[bot\]$/, '');
}

function firstComment(thread) {
  if (!thread || !thread.comments) return null;
  const list = Array.isArray(thread.comments)
    ? thread.comments
    : thread.comments.nodes || [];
  return list[0] || null;
}

function reactionsOf(comment) {
  if (!comment || !comment.reactions) return [];
  if (Array.isArray(comment.reactions)) return comment.reactions;
  return comment.reactions.nodes || [];
}

function isSlashReaction(reaction, contents) {
  return contents.has(reaction.content) && SLASH_REACTION_LOGINS.has(loginOf(reaction.user));
}

function evaluateComments(threads, reviewDecision) {
  if (reviewDecision === 'CHANGES_REQUESTED') {
    return { ready: false, noVisibleComments: false, changesRequested: true };
  }
  const visible = [];
  for (const thread of threads || []) {
    if (thread.isOutdated) continue;
    const comment = firstComment(thread);
    if (!comment) continue;
    visible.push(comment);
  }
  if (visible.length === 0) return { ready: true, noVisibleComments: true };

  const ready = visible.every((comment) => {
    const reactions = reactionsOf(comment);
    if (reactions.some((reaction) => isSlashReaction(reaction, BLOCKING_REACTIONS))) {
      return false;
    }
    return reactions.some((reaction) => isSlashReaction(reaction, HANDLED_REACTIONS));
  });
  return { ready, noVisibleComments: false };
}

function didSlashTurnRedToGreen(commits) {
  if (!commits || commits.length === 0) return false;
  if (commits[commits.length - 1].gates !== 'pass') return false;
  const lastFail = commits.findLastIndex((commit) => commit.gates === 'fail');
  if (lastFail < 0) return false;
  const firstPassAfter = commits.findIndex(
    (commit, index) => index > lastFail && commit.gates === 'pass',
  );
  if (firstPassAfter < 0) return false;
  return commits
    .slice(lastFail + 1, firstPassAfter + 1)
    .some((commit) => commit.isSlash);
}

function isFirstAttemptGreen(commits) {
  if (!commits || commits.length === 0) return false;
  if (commits[commits.length - 1].gates !== 'pass') return false;
  return !commits.some((commit) => commit.gates === 'fail');
}

const CHECKS_ELIGIBLE = new Set(['first_attempt_green', 'slash_red_to_green']);
const COMMENTS_ELIGIBLE = new Set(['none', 'slash_handled']);
const SKIP_GATE_STATUS = Object.freeze({
  checksStatus: 'pending',
  commentsStatus: 'failed',
});

function checksStatusOf(headGates, commits) {
  if (headGates === 'other') return 'pending';
  if (headGates !== 'pass') return 'failed';
  if (isFirstAttemptGreen(commits)) return 'first_attempt_green';
  if (didSlashTurnRedToGreen(commits)) return 'slash_red_to_green';
  return 'human_recovered';
}

function commentsStatusOf(commentEval) {
  if (commentEval && commentEval.changesRequested) return 'changes_requested';
  if (!commentEval || !commentEval.ready) return 'failed';
  return commentEval.noVisibleComments ? 'none' : 'slash_handled';
}

function explainEligibility({ headGates, commentEval, commits }) {
  const gateStatus = {
    checksStatus: checksStatusOf(headGates, commits),
    commentsStatus: commentsStatusOf(commentEval),
  };
  const eligible =
    CHECKS_ELIGIBLE.has(gateStatus.checksStatus) &&
    COMMENTS_ELIGIBLE.has(gateStatus.commentsStatus);
  return { eligible, gateStatus };
}

function shouldApplyLabel({ gatesGreen, commentEval, commits }) {
  return explainEligibility({
    headGates: gatesGreen ? 'pass' : 'fail',
    commentEval,
    commits,
  }).eligible;
}

function nextLabelAction({ shouldApply, hasLabel }) {
  if (shouldApply && !hasLabel) return 'add';
  if (!shouldApply && hasLabel) return 'remove';
  return 'noop';
}

function decide({ headGates, commentEval, commits, hasLabel, onPending = 'noop' }) {
  const explained = explainEligibility({ headGates, commentEval, commits });
  let action = 'noop';
  if (headGates === 'other') {
    // A new head has not earned the label. Same-SHA pending stays a no-op so
    // one gate finishing before the other does not flap it.
    if (onPending === 'remove' && hasLabel) action = 'remove';
  } else {
    action = nextLabelAction({ shouldApply: explained.eligible, hasLabel });
  }
  return {
    action,
    alreadyLabelled: Boolean(hasLabel),
    ...explained,
  };
}

function pickGateConclusion(checkRuns) {
  const runs = checkRuns || [];
  if (runs.length === 0) return undefined;
  // An in-progress re-run has completed_at null. Sorting that as epoch would
  // keep the previous success (draft-gated green, or a run being replaced).
  if (runs.some((run) => !run.completed_at)) return null;
  return [...runs].sort(
    (left, right) => new Date(right.completed_at) - new Date(left.completed_at),
  )[0].conclusion;
}

function isWorkflowRunInFlight(runs) {
  return (runs || []).some((run) => run.status === 'queued' || run.status === 'in_progress');
}

function applyInFlightGates(checks, inFlightNames) {
  const byName = new Map((checks || []).map((check) => [check.name, check.conclusion]));
  for (const name of inFlightNames || []) byName.set(name, null);
  return [...byName.entries()].map(([name, conclusion]) => ({ name, conclusion }));
}

function buildCommitTimeline(prCommits, checksBySha) {
  return (prCommits || []).map((commit) => ({
    sha: commit.sha,
    isSlash: isSlashBotCommit({
      authorName: (commit.commit && commit.commit.author && commit.commit.author.name) || '',
      committerName:
        (commit.commit && commit.commit.committer && commit.commit.committer.name) || '',
    }),
    gates: classifyGatesFromChecks((checksBySha && checksBySha[commit.sha]) || []),
  }));
}

module.exports = {
  MERGE_READY_LABEL,
  GATE_CHECK_NAMES,
  VALIDATE_WORKFLOW_FILE,
  WORKFLOW_TO_GATES,
  isSlashBotCommit,
  explainEligibility,
  evaluateComments,
  didSlashTurnRedToGreen,
  isFirstAttemptGreen,
  classifyGatesFromChecks,
  shouldApplyLabel,
  nextLabelAction,
  decide,
  SKIP_GATE_STATUS,
  pickGateConclusion,
  isWorkflowRunInFlight,
  applyInFlightGates,
  buildCommitTimeline,
};
