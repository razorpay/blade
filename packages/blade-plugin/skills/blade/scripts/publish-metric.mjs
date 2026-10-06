// Port of Blade MCP's publish_lines_of_code_metric tool
// (packages/blade-mcp/src/tools/publishLinesOfCodeMetric.ts). Same arguments,
// validation, event and response text; the numbers are reported by the agent.
//
// Usage: node publish-metric.mjs '<json>'   (or pipe the JSON on stdin)
import { skillUsedEventName, sendAnalytics } from './analytics.mjs';

const toolName = 'publish_lines_of_code_metric';

// The plugin's skills replace the MCP's tool names in `toolsUsed`.
const bladeSkillNames = ['blade', 'blade-upgrade', 'blade-new-project', 'blade-figma-to-code'];

const OPTIONAL_TOTALS = [
  'bladeUiLinesAddedTotal',
  'bladeUiLinesRemovedTotal',
  'nonBladeUiLinesAddedTotal',
  'nonBladeUiLinesRemovedTotal',
  'nonUiLinesAddedTotal',
  'nonUiLinesRemovedTotal',
];

const isCount = (value) => Number.isInteger(value) && value >= 0;

const readInput = async () => {
  if (process.argv[2]) return process.argv[2];
  let data = '';
  for await (const chunk of process.stdin) data += chunk;
  return data;
};

// Mirrors the zod schema of the MCP tool. Returns a list of problems.
const validate = (input) => {
  const problems = [];
  if (!input || typeof input !== 'object') return ['arguments must be a JSON object'];
  if (!Array.isArray(input.files) || input.files.length === 0) {
    problems.push('files must be a non-empty array');
  } else {
    input.files.forEach((file, i) => {
      if (typeof file?.filePath !== 'string')
        problems.push(`files[${i}].filePath must be a string`);
      if (!isCount(file?.linesAdded))
        problems.push(`files[${i}].linesAdded must be a non-negative integer`);
      if (!isCount(file?.linesRemoved))
        problems.push(`files[${i}].linesRemoved must be a non-negative integer`);
    });
  }
  for (const key of ['linesAddedTotal', 'linesRemovedTotal']) {
    if (!isCount(input[key])) problems.push(`${key} must be a non-negative integer`);
  }
  for (const key of OPTIONAL_TOTALS) {
    if (input[key] !== undefined && !isCount(input[key]))
      problems.push(`${key} must be a non-negative integer`);
  }
  if (typeof input.currentProjectRootDirectory !== 'string' || !input.currentProjectRootDirectory) {
    problems.push('currentProjectRootDirectory must be the absolute path of the project');
  }
  if (input.toolsUsed !== undefined) {
    if (!Array.isArray(input.toolsUsed)) problems.push('toolsUsed must be an array');
    else {
      for (const name of input.toolsUsed) {
        if (!bladeSkillNames.includes(String(name).replace(/^blade:/, ''))) {
          problems.push(`toolsUsed: "${name}" is not one of ${bladeSkillNames.join(', ')}`);
        }
      }
    }
  }
  return problems;
};

const main = async () => {
  let input;
  try {
    input = JSON.parse(await readInput());
  } catch (error) {
    console.error(`Error in ${toolName}: arguments are not valid JSON (${error.message})`);
    process.exit(1);
  }
  const problems = validate(input);
  if (problems.length) {
    console.error(`Error in ${toolName}:\n${problems.map((p) => `- ${p}`).join('\n')}`);
    process.exit(1);
  }

  const toolsUsed = (input.toolsUsed ?? []).map((name) => name.replace(/^blade:/, ''));
  const flattenedFiles = input.files
    .map(({ filePath, linesAdded, linesRemoved }) => `${filePath}:${linesAdded}:${linesRemoved}`)
    .join(',');

  await sendAnalytics({
    eventName: skillUsedEventName,
    properties: {
      toolName,
      linesAddedTotal: input.linesAddedTotal,
      linesRemovedTotal: input.linesRemovedTotal,
      ...Object.fromEntries(OPTIONAL_TOTALS.map((key) => [key, input[key] ?? 0])),
      files: flattenedFiles,
      toolsUsed: toolsUsed.join(','),
      currentProjectRootDirectory: input.currentProjectRootDirectory,
    },
  });

  console.log(
    `Recorded ${input.linesAddedTotal} lines added and ${input.linesRemovedTotal} lines removed across ` +
      `${input.files.length} files. Tools used: ${toolsUsed.join(', ')}.`,
  );
};

main();
