const assert = require('node:assert/strict');
const test = require('node:test');
const {
  countResolutionAttempts,
  isManualDelegation,
  selectEligibleComments,
} = require('./comment-selection');
const { MAX_BUFFER_BYTES, parseJsonLines, runGh } = require('./github-api');

test('selectEligibleComments includes both supported manual mentions', () => {
  const comments = [
    { body: 'Please fix this @rzp-slash-public', user: { login: 'maintainer' } },
    { body: '@razorpay/slash-public can you handle this?', user: { login: 'author' } },
    { body: 'No delegation here', user: { login: 'maintainer' } },
  ];

  assert.deepEqual(selectEligibleComments(comments), comments.slice(0, 2));
  assert.equal(isManualDelegation(comments[0]), true);
});

test('selectEligibleComments applies the configured bot confidence threshold', () => {
  const comments = [
    { body: 'confidence: 5/10', user: { login: 'rzp-slash-public[bot]' } },
    { body: 'confidence: 10/10', user: { login: 'rzp-slash-public[bot]' } },
    { body: 'confidence: 4/10', user: { login: 'rzp-slash-public[bot]' } },
    { body: 'confidence: 9/10', user: { login: 'another-bot[bot]' } },
  ];

  assert.deepEqual(selectEligibleComments(comments), comments.slice(0, 2));
});

test('countResolutionAttempts counts unique Slash tasks rather than reply comments', () => {
  const firstTask =
    '**Agentic Resolution:** Auto Comment Resolution Triggered https://slash.concierge.razorpay.com/tasks/task-1/execution-logs';
  const comments = [
    { body: firstTask },
    { body: firstTask },
    {
      body: 'Auto Comment Resolution Triggered https://slash.concierge.razorpay.com/tasks/task-2/execution-logs',
    },
    {
      body: 'Slash AI Review: https://slash.concierge.razorpay.com/tasks/review-task/execution-logs',
    },
    { body: 'A normal review comment' },
  ];

  assert.equal(countResolutionAttempts(comments), 2);
});

test('runGh uses argument-safe execution and supports paginated JSON lines', () => {
  const calls = [];
  const result = runGh(['api', 'repos/razorpay/blade/pulls/1/comments', '--paginate'], {
    format: 'json-lines',
    execFile: (file, args, options) => {
      calls.push({ file, args, options });
      return '{"body":"one"}\n{"body":"two"}\n';
    },
  });

  assert.deepEqual(result, [{ body: 'one' }, { body: 'two' }]);
  assert.equal(calls[0].file, 'gh');
  assert.equal(calls[0].options.maxBuffer, MAX_BUFFER_BYTES);
  assert.deepEqual(parseJsonLines(''), []);
});
