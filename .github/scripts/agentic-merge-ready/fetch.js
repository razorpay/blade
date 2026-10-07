'use strict';

const {
  GATE_CHECK_NAMES,
  WORKFLOW_TO_GATES,
  pickGateConclusion,
  isWorkflowRunInFlight,
} = require('./evaluate');

const THREADS_QUERY = `
query($owner:String!, $name:String!, $number:Int!, $cursor:String) {
  repository(owner:$owner, name:$name) {
    pullRequest(number:$number) {
      reviewDecision
      reviewThreads(first:100, after:$cursor) {
        pageInfo { hasNextPage endCursor }
        nodes {
          isOutdated
          comments(first:1) {
            nodes {
              author { login }
              reactions(first:20) {
                nodes { content user { login } }
              }
            }
          }
        }
      }
    }
  }
}`;

async function listReviewState(github, owner, repo, prNumber) {
  const threads = [];
  let reviewDecision = null;
  let cursor = null;
  for (;;) {
    const data = await github.graphql(THREADS_QUERY, {
      owner,
      name: repo,
      number: prNumber,
      cursor,
    });
    const pullRequest = data.repository.pullRequest;
    reviewDecision = pullRequest.reviewDecision;
    const connection = pullRequest.reviewThreads;
    threads.push(...(connection.nodes || []));
    if (!connection.pageInfo.hasNextPage) break;
    cursor = connection.pageInfo.endCursor;
  }
  return { threads, reviewDecision };
}

async function listGateChecksForRef(github, owner, repo, ref) {
  const checks = [];
  for (const name of GATE_CHECK_NAMES) {
    const { data } = await github.rest.checks.listForRef({
      owner,
      repo,
      ref,
      check_name: name,
      per_page: 100,
    });
    const conclusion = pickGateConclusion(data.check_runs);
    if (conclusion !== undefined) checks.push({ name, conclusion });
  }
  return checks;
}

async function listInFlightGateNames(github, owner, repo, sha) {
  const names = [];
  for (const [workflowId, gateNames] of Object.entries(WORKFLOW_TO_GATES)) {
    const { data } = await github.rest.actions.listWorkflowRuns({
      owner,
      repo,
      workflow_id: workflowId,
      head_sha: sha,
      per_page: 20,
    });
    if (isWorkflowRunInFlight(data.workflow_runs)) names.push(...gateNames);
  }
  return names;
}

async function checksForCommits(github, owner, repo, commits, headSha, headChecks) {
  const out = { [headSha]: headChecks };
  await Promise.all(
    (commits || [])
      .map((commit) => commit.sha)
      .filter((sha) => sha && sha !== headSha)
      .map(async (sha) => {
        out[sha] = await listGateChecksForRef(github, owner, repo, sha);
      }),
  );
  return out;
}

module.exports = {
  listReviewState,
  listGateChecksForRef,
  listInFlightGateNames,
  checksForCommits,
};
