/**
 * Comment-reaction predicates for Agentic Merge Ready.
 *
 * Run:
 *   node --test .github/scripts/agentic-merge-ready/__tests__/comments.test.mjs
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { evaluateComments } from '../evaluate.js';

function thread({ isOutdated = false, author = 'reviewer', reactions = [] } = {}) {
  return {
    isOutdated,
    comments: [
      {
        author: { login: author },
        reactions: reactions.map((r) =>
          typeof r === 'string'
            ? { content: r, user: { login: 'rzp-slash[bot]' } }
            : r,
        ),
      },
    ],
  };
}

test('evaluateComments: zero threads is vacuously ready', () => {
  assert.deepEqual(evaluateComments([]), { ready: true, noVisibleComments: true });
});

test('evaluateComments: CHANGES_REQUESTED blocks even with no threads', () => {
  assert.deepEqual(evaluateComments([], 'CHANGES_REQUESTED'), {
    ready: false,
    noVisibleComments: false,
    changesRequested: true,
  });
});

test('evaluateComments: CHANGES_REQUESTED blocks slash-handled threads', () => {
  assert.equal(
    evaluateComments([thread({ reactions: ['ROCKET'] })], 'CHANGES_REQUESTED').ready,
    false,
  );
});

test('evaluateComments: APPROVED with no threads stays ready', () => {
  assert.deepEqual(evaluateComments([], 'APPROVED'), {
    ready: true,
    noVisibleComments: true,
  });
});

test('evaluateComments: outdated threads without reactions are ignored', () => {
  assert.deepEqual(evaluateComments([thread({ isOutdated: true, reactions: [] })]), {
    ready: true,
    noVisibleComments: true,
  });
});

test('evaluateComments: unhandled bot first comments block', () => {
  for (const author of [
    'cursor[bot]',
    'cursor',
    'github-actions[bot]',
    'rzp-slash-reviewer[bot]',
  ]) {
    const result = evaluateComments([thread({ author, reactions: [] })]);
    assert.equal(result.ready, false, `${author} without Slash reaction must block`);
    assert.equal(result.noVisibleComments, false);
  }
});

test('evaluateComments: Slash rocket on cursor[bot] comment is handled', () => {
  const result = evaluateComments([
    thread({ author: 'cursor[bot]', reactions: ['ROCKET'] }),
  ]);
  assert.equal(result.ready, true);
  assert.equal(result.noVisibleComments, false);
});

test('evaluateComments: rocket from slash via GraphQL login (no [bot] suffix) is handled', () => {
  assert.equal(
    evaluateComments([
      thread({ reactions: [{ content: 'ROCKET', user: { login: 'rzp-slash' } }] }),
    ]).ready,
    true,
  );
});

test('evaluateComments: rocket from rzp-slash-public is handled', () => {
  for (const login of ['rzp-slash-public', 'rzp-slash-public[bot]']) {
    assert.equal(
      evaluateComments([thread({ reactions: [{ content: 'ROCKET', user: { login } }] })]).ready,
      true,
      `${login} rocket must count as handled`,
    );
  }
});

test('evaluateComments: rocket from a human is not handled', () => {
  assert.equal(
    evaluateComments([
      thread({ reactions: [{ content: 'ROCKET', user: { login: 'saurabhdaware' } }] }),
    ]).ready,
    false,
  );
});

test('evaluateComments: rocket or thumbs_down from slash is handled', () => {
  assert.equal(evaluateComments([thread({ reactions: ['ROCKET'] })]).ready, true);
  assert.equal(evaluateComments([thread({ reactions: ['THUMBS_DOWN'] })]).ready, true);
  assert.equal(evaluateComments([thread({ reactions: ['ROCKET'] })]).noVisibleComments, false);
});

test('evaluateComments: confused from slash blocks', () => {
  const result = evaluateComments([thread({ reactions: ['CONFUSED'] })]);
  assert.equal(result.ready, false);
  assert.equal(result.noVisibleComments, false);
});

test('evaluateComments: missing slash reaction blocks', () => {
  assert.equal(evaluateComments([thread({ reactions: [] })]).ready, false);
});

test('evaluateComments: human rocket does not count as slash-handled', () => {
  assert.equal(
    evaluateComments([
      thread({ reactions: [{ content: 'ROCKET', user: { login: 'alice' } }] }),
    ]).ready,
    false,
  );
});

test('evaluateComments: mixed visible threads — one unhandled fails all', () => {
  assert.equal(
    evaluateComments([thread({ reactions: ['ROCKET'] }), thread({ reactions: [] })]).ready,
    false,
  );
  assert.equal(
    evaluateComments([
      thread({ reactions: ['ROCKET'] }),
      thread({ author: 'cursor[bot]', reactions: [] }),
    ]).ready,
    false,
  );
});
