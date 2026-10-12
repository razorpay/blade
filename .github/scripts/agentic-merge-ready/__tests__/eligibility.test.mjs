/**
 * Eligibility grid and decide() gateStatus for Agentic Merge Ready.
 *
 * Run:
 *   node --test .github/scripts/agentic-merge-ready/__tests__/eligibility.test.mjs
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { shouldApplyLabel, decide } from '../evaluate.js';

const firstTryPass = [{ isSlash: false, gates: 'pass' }];
const slashRedToGreen = [
  { isSlash: false, gates: 'fail' },
  { isSlash: true, gates: 'pass' },
];
const humanFixed = [
  { isSlash: false, gates: 'fail' },
  { isSlash: false, gates: 'pass' },
];

test('shouldApplyLabel: no comments + first-attempt green', () => {
  assert.equal(
    shouldApplyLabel({
      gatesGreen: true,
      commentEval: { ready: true, noVisibleComments: true },
      commits: firstTryPass,
    }),
    true,
  );
});

test('shouldApplyLabel: no comments + slash red-to-green', () => {
  assert.equal(
    shouldApplyLabel({
      gatesGreen: true,
      commentEval: { ready: true, noVisibleComments: true },
      commits: slashRedToGreen,
    }),
    true,
  );
});

test('shouldApplyLabel: handled comments + slash red-to-green', () => {
  assert.equal(
    shouldApplyLabel({
      gatesGreen: true,
      commentEval: { ready: true, noVisibleComments: false },
      commits: slashRedToGreen,
    }),
    true,
  );
});

test('shouldApplyLabel: handled comments + first-try green', () => {
  assert.equal(
    shouldApplyLabel({
      gatesGreen: true,
      commentEval: { ready: true, noVisibleComments: false },
      commits: firstTryPass,
    }),
    true,
  );
});

test('shouldApplyLabel: handled comments + human-fixed CI — no', () => {
  assert.equal(
    shouldApplyLabel({
      gatesGreen: true,
      commentEval: { ready: true, noVisibleComments: false },
      commits: humanFixed,
    }),
    false,
  );
});

test('shouldApplyLabel: no comments + human-fixed CI — no', () => {
  assert.equal(
    shouldApplyLabel({
      gatesGreen: true,
      commentEval: { ready: true, noVisibleComments: true },
      commits: humanFixed,
    }),
    false,
  );
});

test('shouldApplyLabel: not green or comments not ready — no', () => {
  assert.equal(
    shouldApplyLabel({
      gatesGreen: false,
      commentEval: { ready: true, noVisibleComments: true },
      commits: firstTryPass,
    }),
    false,
  );
  assert.equal(
    shouldApplyLabel({
      gatesGreen: true,
      commentEval: { ready: false, noVisibleComments: false },
      commits: firstTryPass,
    }),
    false,
  );
});

test('decide: pending head on a new commit removes an existing label', () => {
  const result = decide({
    headGates: 'other',
    commentEval: { ready: true, noVisibleComments: true },
    commits: [],
    hasLabel: true,
    onPending: 'remove',
  });
  assert.equal(result.action, 'remove');
  assert.equal(result.eligible, false);
  assert.equal(result.gateStatus.checksStatus, 'pending');
});

test('decide: pending head on a new commit with no label is noop', () => {
  const result = decide({
    headGates: 'other',
    commentEval: { ready: true, noVisibleComments: true },
    commits: [],
    hasLabel: false,
    onPending: 'remove',
  });
  assert.equal(result.action, 'noop');
});

test('decide: pending head is noop even if labelled', () => {
  const result = decide({
    headGates: 'other',
    commentEval: { ready: true, noVisibleComments: true },
    commits: [{ isSlash: false, gates: 'other' }],
    hasLabel: true,
  });
  assert.equal(result.action, 'noop');
  assert.equal(result.eligible, false);
  assert.deepEqual(result.gateStatus, {
    checksStatus: 'pending',
    commentsStatus: 'none',
  });
});

test('decide: failed head removes label', () => {
  const result = decide({
    headGates: 'fail',
    commentEval: { ready: true, noVisibleComments: true },
    commits: [{ isSlash: false, gates: 'fail' }],
    hasLabel: true,
  });
  assert.equal(result.action, 'remove');
  assert.deepEqual(result.gateStatus, {
    checksStatus: 'failed',
    commentsStatus: 'none',
  });
});

test('decide: unhandled comments does not add', () => {
  const result = decide({
    headGates: 'pass',
    commentEval: { ready: false, noVisibleComments: false },
    commits: [{ isSlash: false, gates: 'pass' }],
    hasLabel: false,
  });
  assert.equal(result.action, 'noop');
  assert.deepEqual(result.gateStatus, {
    checksStatus: 'first_attempt_green',
    commentsStatus: 'failed',
  });
});

test('decide: unhandled comments and human-recovered CI', () => {
  const result = decide({
    headGates: 'pass',
    commentEval: { ready: false, noVisibleComments: false },
    commits: humanFixed,
    hasLabel: false,
  });
  assert.equal(result.action, 'noop');
  assert.deepEqual(result.gateStatus, {
    checksStatus: 'human_recovered',
    commentsStatus: 'failed',
  });
});

test('decide: red checks and unhandled comments', () => {
  const result = decide({
    headGates: 'fail',
    commentEval: { ready: false, noVisibleComments: false },
    commits: [{ isSlash: false, gates: 'fail' }],
    hasLabel: false,
  });
  assert.equal(result.action, 'noop');
  assert.deepEqual(result.gateStatus, {
    checksStatus: 'failed',
    commentsStatus: 'failed',
  });
});

test('decide: first-attempt green with no comments', () => {
  const result = decide({
    headGates: 'pass',
    commentEval: { ready: true, noVisibleComments: true },
    commits: firstTryPass,
    hasLabel: false,
  });
  assert.equal(result.action, 'add');
  assert.equal(result.eligible, true);
  assert.deepEqual(result.gateStatus, {
    checksStatus: 'first_attempt_green',
    commentsStatus: 'none',
  });
});

test('decide: slash-handled comments and red-to-green CI', () => {
  const result = decide({
    headGates: 'pass',
    commentEval: { ready: true, noVisibleComments: false },
    commits: slashRedToGreen,
    hasLabel: false,
  });
  assert.equal(result.action, 'add');
  assert.deepEqual(result.gateStatus, {
    checksStatus: 'slash_red_to_green',
    commentsStatus: 'slash_handled',
  });
});
