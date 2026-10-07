/**
 * Gate / label predicates for Agentic Merge Ready.
 *
 * Run:
 *   node --test .github/scripts/agentic-merge-ready/__tests__/evaluate.test.mjs
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  MERGE_READY_LABEL,
  didSlashTurnRedToGreen,
  isFirstAttemptGreen,
  classifyGatesFromChecks,
  nextLabelAction,
  buildCommitTimeline,
  pickGateConclusion,
  isWorkflowRunInFlight,
  applyInFlightGates,
  GATE_CHECK_NAMES,
  VALIDATE_WORKFLOW_FILE,
  WORKFLOW_TO_GATES,
} from '../evaluate.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('MERGE_READY_LABEL is the product string', () => {
  assert.equal(MERGE_READY_LABEL, '✨ Agentic Merge Ready ✨');
});

test('workflow yaml hardcodes the same MERGE_READY_LABEL', () => {
  const yml = fs.readFileSync(
    path.join(__dirname, '..', '..', '..', 'workflows', 'agentic-merge-ready.yml'),
    'utf8',
  );
  assert.match(yml, /✨ Agentic Merge Ready ✨/);
});

test('workflow drops the label on synchronize and does not run on ready_for_review', () => {
  const yml = fs.readFileSync(
    path.join(__dirname, '..', '..', '..', 'workflows', 'agentic-merge-ready.yml'),
    'utf8',
  );
  assert.match(yml, /types:\s*\[synchronize\]/);
  assert.doesNotMatch(yml, /ready_for_review/);
});

test('pickGateConclusion: an in-progress run hides an older success', () => {
  assert.equal(
    pickGateConclusion([
      { conclusion: 'success', completed_at: '2026-09-01T00:00:00Z', status: 'completed' },
      { conclusion: null, completed_at: null, status: 'in_progress' },
    ]),
    null,
  );
});

test('pickGateConclusion: newest completed check wins', () => {
  assert.equal(
    pickGateConclusion([
      { conclusion: 'success', completed_at: '2026-09-01T00:00:00Z', status: 'completed' },
      { conclusion: 'failure', completed_at: '2026-09-02T00:00:00Z', status: 'completed' },
    ]),
    'failure',
  );
});

test('pickGateConclusion: no runs is missing', () => {
  assert.equal(pickGateConclusion([]), undefined);
});

test('isWorkflowRunInFlight: queued or in_progress only', () => {
  assert.equal(isWorkflowRunInFlight([{ status: 'completed' }]), false);
  assert.equal(isWorkflowRunInFlight([{ status: 'completed' }, { status: 'in_progress' }]), true);
  assert.equal(isWorkflowRunInFlight([{ status: 'queued' }]), true);
});

function gateChecks(overrides = {}) {
  return GATE_CHECK_NAMES.map((name) => ({
    name,
    conclusion: name in overrides ? overrides[name] : 'success',
  }));
}

test('GATE_CHECK_NAMES are the required blade-validate checks', () => {
  assert.deepEqual(GATE_CHECK_NAMES, [
    'Validate Source Code',
    'Run Tests (1)',
    'Run Tests (2)',
    'Run Tests (3)',
    'Run Tests (4)',
  ]);
});

test('workflow yaml listens to the workflow that produces the gate checks', () => {
  const yml = fs.readFileSync(
    path.join(__dirname, '..', '..', '..', 'workflows', 'agentic-merge-ready.yml'),
    'utf8',
  );
  const validate = fs.readFileSync(
    path.join(__dirname, '..', '..', '..', 'workflows', VALIDATE_WORKFLOW_FILE),
    'utf8',
  );
  const workflowName = validate.match(/^name:\s*(.+)$/m)[1].trim();
  assert.ok(yml.includes(`"${workflowName}"`), `${workflowName} missing from workflow_run`);
  assert.match(validate, /name: Validate Source Code/);
  assert.match(validate, /name: Run Tests \(\$\{\{ matrix\.shard \}\}\)/);
});

test('applyInFlightGates: an in-flight workflow overrides a stale success check', () => {
  const checks = applyInFlightGates(gateChecks(), WORKFLOW_TO_GATES[VALIDATE_WORKFLOW_FILE]);
  assert.equal(classifyGatesFromChecks(checks), 'other');
});

test('classifyGatesFromChecks: all named gates pass', () => {
  assert.equal(classifyGatesFromChecks(gateChecks()), 'pass');
});

test('classifyGatesFromChecks: any named gate failure is fail', () => {
  assert.equal(classifyGatesFromChecks(gateChecks({ 'Validate Source Code': 'failure' })), 'fail');
  assert.equal(classifyGatesFromChecks(gateChecks({ 'Run Tests (3)': 'cancelled' })), 'fail');
});

test('classifyGatesFromChecks: missing or pending gates are other', () => {
  assert.equal(classifyGatesFromChecks([]), 'other');
  assert.equal(
    classifyGatesFromChecks(gateChecks().filter((check) => check.name !== 'Run Tests (4)')),
    'other',
  );
  assert.equal(classifyGatesFromChecks(gateChecks({ 'Run Tests (2)': null })), 'other');
});

test('classifyGatesFromChecks: non-gate checks are ignored', () => {
  assert.equal(
    classifyGatesFromChecks([...gateChecks(), { name: 'Chromatic Deployment', conclusion: 'failure' }]),
    'pass',
  );
});

test('didSlashTurnRedToGreen: fail then slash then pass', () => {
  assert.equal(
    didSlashTurnRedToGreen([
      { isSlash: false, gates: 'fail' },
      { isSlash: true, gates: 'pass' },
    ]),
    true,
  );
});

test('didSlashTurnRedToGreen: human fixed before slash — no', () => {
  assert.equal(
    didSlashTurnRedToGreen([
      { isSlash: false, gates: 'fail' },
      { isSlash: false, gates: 'pass' },
      { isSlash: true, gates: 'pass' },
    ]),
    false,
  );
});

test('didSlashTurnRedToGreen: never failed — no', () => {
  assert.equal(didSlashTurnRedToGreen([{ isSlash: true, gates: 'pass' }]), false);
});

test('didSlashTurnRedToGreen: slash in the fail-to-first-pass window', () => {
  assert.equal(
    didSlashTurnRedToGreen([
      { isSlash: false, gates: 'fail' },
      { isSlash: true, gates: 'fail' },
      { isSlash: true, gates: 'pass' },
    ]),
    true,
  );
});

test('isFirstAttemptGreen: head pass and never failed', () => {
  assert.equal(isFirstAttemptGreen([{ gates: 'other' }, { gates: 'pass' }]), true);
});

test('isFirstAttemptGreen: any historical fail is not first attempt', () => {
  assert.equal(isFirstAttemptGreen([{ gates: 'fail' }, { gates: 'pass' }]), false);
});

test('isFirstAttemptGreen: empty or head not pass', () => {
  assert.equal(isFirstAttemptGreen([]), false);
  assert.equal(isFirstAttemptGreen([{ gates: 'other' }]), false);
});

test('nextLabelAction: add, remove, noop', () => {
  assert.equal(nextLabelAction({ shouldApply: true, hasLabel: false }), 'add');
  assert.equal(nextLabelAction({ shouldApply: false, hasLabel: true }), 'remove');
  assert.equal(nextLabelAction({ shouldApply: true, hasLabel: true }), 'noop');
  assert.equal(nextLabelAction({ shouldApply: false, hasLabel: false }), 'noop');
});

test('buildCommitTimeline: razorpay-slash[bot] is a Slash commit', () => {
  const timeline = buildCommitTimeline(
    [
      {
        sha: 'aaa',
        commit: { author: { name: 'razorpay-slash[bot]' }, committer: { name: 'GitHub' } },
      },
    ],
    { aaa: [{ name: 'Validate Source Code', conclusion: 'success' }] },
  );
  assert.equal(timeline[0].isSlash, true);
});
