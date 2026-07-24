const MANUAL_MENTIONS = ['@rzp-slash-public', '@razorpay/slash-public'];
const AGENT_REVIEWER = 'rzp-slash-public[bot]';
const AUTO_RESOLVE_CONFIDENCE = /confidence: ([5-9]|10)\/10/;
const RESOLUTION_MARKER = 'Auto Comment Resolution Triggered';
const RESOLUTION_TASK_ID = /\/tasks\/([^/\s)]+)\/execution-logs/;

function isManualDelegation(comment) {
  const body = comment.body ?? '';
  return MANUAL_MENTIONS.some((mention) => body.includes(mention));
}

function isEligibleAutoResolveComment(comment) {
  return (
    comment.user?.login === AGENT_REVIEWER &&
    AUTO_RESOLVE_CONFIDENCE.test(comment.body ?? '')
  );
}

function selectEligibleComments(comments) {
  return comments.filter(
    (comment) => isManualDelegation(comment) || isEligibleAutoResolveComment(comment),
  );
}

function countResolutionAttempts(comments) {
  const taskIds = new Set();

  for (const comment of comments) {
    const body = comment.body ?? '';
    if (!body.includes(RESOLUTION_MARKER)) continue;

    const taskId = body.match(RESOLUTION_TASK_ID)?.[1];
    if (taskId) taskIds.add(taskId);
  }

  return taskIds.size;
}

module.exports = {
  countResolutionAttempts,
  isManualDelegation,
  selectEligibleComments,
};
