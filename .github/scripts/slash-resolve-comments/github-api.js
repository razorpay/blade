const { execFileSync } = require('child_process');

const MAX_BUFFER_BYTES = 10 * 1024 * 1024;

function parseJsonLines(output) {
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function runGh(args, { format = 'json', execFile = execFileSync } = {}) {
  const output = execFile('gh', args, {
    encoding: 'utf8',
    maxBuffer: MAX_BUFFER_BYTES,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  if (!output.trim()) return [];
  return format === 'json-lines' ? parseJsonLines(output) : JSON.parse(output);
}

module.exports = { MAX_BUFFER_BYTES, parseJsonLines, runGh };
