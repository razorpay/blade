#!/usr/bin/env node
// @ts-check
import Anthropic from '@anthropic-ai/sdk';
import { execSync } from 'child_process';
import { readFileSync, readdirSync, mkdirSync, appendFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLADE_REPO = path.resolve(__dirname, '../..');

// Parse ANTHROPIC_CUSTOM_HEADERS="key: value, key2: value2" into an object
function parseCustomHeaders(raw) {
  if (!raw) return {};
  return Object.fromEntries(
    raw.split(',').map((h) => {
      const idx = h.indexOf(':');
      return [h.slice(0, idx).trim(), h.slice(idx + 1).trim()];
    }),
  );
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? 'placeholder',
  baseURL: process.env.ANTHROPIC_BASE_URL,
  defaultHeaders: parseCustomHeaders(process.env.ANTHROPIC_CUSTOM_HEADERS),
});

const MODEL = process.env.ANTHROPIC_DEFAULT_MODEL ?? 'claude-haiku-4-5';

// Read agent system prompt (strip YAML frontmatter)
const agentDef = readFileSync(
  path.join(__dirname, '../../.agents/agents/critiques/api-decision-critique.md'),
  'utf-8',
);
const AGENT_SYSTEM_PROMPT = agentDef.replace(/^---[\s\S]*?---\n/, '').trim();

// ---------------------------------------------------------------------------
// Diff fetching
// ---------------------------------------------------------------------------

function fetchDiffForCommit(repo, baseRef, beforeRef, diffFilePatterns) {
  const compareRaw = execSync(
    `gh api "repos/${repo}/compare/${baseRef}...${beforeRef}"`,
  ).toString();
  const compare = JSON.parse(compareRaw);
  const patches = compare.files
    .filter(
      (f) => diffFilePatterns.length === 0 || diffFilePatterns.some((p) => f.filename.includes(p)),
    )
    .map((f) => `--- a/${f.filename}\n+++ b/${f.filename}\n${f.patch ?? '(binary)'}`)
    .join('\n\n');
  return patches || '(no matching files found in commit range)';
}

function fetchPrDiff(repo, prNumber) {
  return execSync(`gh pr diff ${prNumber} --repo ${repo}`).toString();
}

// ---------------------------------------------------------------------------
// Agent runner via Anthropic SDK (with bash tool so it can sample existing components)
// ---------------------------------------------------------------------------

// eslint-disable-next-line consistent-return
async function runClaude(
  systemPrompt,
  userPrompt,
  /** @type {{ allowBash?: boolean, log?: ((text: string) => void) | null }} */ {
    allowBash = false,
    log = null,
  } = {},
) {
  const tools = allowBash
    ? /** @type {import('@anthropic-ai/sdk/resources/messages').ToolUnion[]} */ ([
        { type: 'bash_20250124', name: 'bash' },
      ])
    : undefined;

  /** @type {import('@anthropic-ai/sdk/resources/messages').MessageParam[]} */
  const messages = [{ role: 'user', content: userPrompt }];

  // Agentic loop — keep going until the model stops requesting tools.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const createParams = { model: MODEL, max_tokens: 16000, system: systemPrompt, tools, messages };
    // eslint-disable-next-line no-await-in-loop
    const response = allowBash
      ? // eslint-disable-next-line no-await-in-loop
        await client.beta.messages.create({ ...createParams, betas: ['computer-use-2025-01-24'] })
      : // eslint-disable-next-line no-await-in-loop
        await client.messages.create(createParams);

    if (response.stop_reason === 'end_turn') {
      const textBlock = response.content.find((b) => b.type === 'text');
      if (!textBlock) {
        throw new Error(
          `No text block in response. Content was: ${JSON.stringify(response.content)}`,
        );
      }
      if (log) log(`\n## Final response\n\n${textBlock.text}\n`);
      return textBlock.text;
    }

    if (response.stop_reason !== 'tool_use') {
      throw new Error(`Unexpected stop_reason: ${response.stop_reason}`);
    }

    // Execute bash tool calls
    messages.push({ role: 'assistant', content: response.content });

    const toolResults = [];
    for (const block of response.content) {
      if (block.type !== 'tool_use') continue;
      if (block.name !== 'bash') {
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: `Unknown tool: ${block.name}`,
        });
        continue;
      }

      const cmd = /** @type {any} */ (block.input).command;
      if (log) log(`\n## bash\n\n\`\`\`sh\n$ ${cmd}\n\`\`\`\n`);

      let output;
      try {
        output = execSync(cmd, {
          cwd: BLADE_REPO,
          encoding: 'utf-8',
          timeout: 30_000,
          stdio: 'pipe',
        });
      } catch (e) {
        output = e.stdout ?? '';
        const stderr = e.stderr ?? e.message;
        if (stderr) output += `\nSTDERR: ${stderr}`;
      }

      if (log) log(`\`\`\`\n${output}\n\`\`\`\n`);

      toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: output });
    }

    // @ts-ignore
    messages.push({ role: 'user', content: toolResults });
  }
}

async function runAgent(
  testCase,
  diff,
  /** @type {{ log?: ((text: string) => void) | null }} */ { log = null } = {},
) {
  const ref = testCase.before_ref ?? `refs/pull/${testCase.pr_number}/head`;
  const userPrompt = [
    `PR_NUMBER: ${testCase.pr_number}`,
    `PR_TITLE: ${testCase.pr_title}`,
    `PR_BODY: ${testCase.pr_body ?? ''}`,
    ``,
    `IMPORTANT: When exploring existing component files for context, do NOT read local files.`,
    `Use the GitHub API at ref "${ref}" in repo "${testCase.repo}":`,
    `  List directory: gh api repos/${testCase.repo}/contents/{path}?ref=${ref}`,
    `  Read file:      gh api repos/${testCase.repo}/contents/{path}?ref=${ref} --jq '.content' | base64 -d`,
    ``,
    `DIFF:`,
    diff,
  ].join('\n');

  const text = await runClaude(AGENT_SYSTEM_PROMPT, userPrompt, { allowBash: true, log });
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ?? text.match(/(\{[\s\S]*\})/);
  if (!jsonMatch) throw new Error(`Could not find JSON in agent output:\n${text}`);
  return JSON.parse(jsonMatch[1]);
}

// ---------------------------------------------------------------------------
// LLM-as-judge grader
// ---------------------------------------------------------------------------

/** @returns {Promise<{matched: boolean, matched_index: number|null, reason: string}>} */
async function gradeIssue(expectedIssue, agentIssues) {
  const graderSystem =
    'You are a grader for an AI code-review agent. Reply ONLY with a JSON object, no other text.';
  const graderPrompt = `Expected issue:
"${expectedIssue.description}"

Agent output issues (JSON array):
${JSON.stringify(agentIssues, null, 2)}

Does any item in the agent output address the same concern as the expected issue?
Two issues match if they identify the same prop/component name problem, even if worded differently.

Reply ONLY with a JSON object, no other text:
{"matched": <true|false>, "matched_index": <0-based index or null>, "reason": "<one sentence>"}`;

  const text = await runClaude(graderSystem, graderPrompt);
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ?? text.match(/(\{[\s\S]*\})/);
  if (!jsonMatch) throw new Error(`Could not find JSON in grader output:\n${text}`);
  return JSON.parse(jsonMatch[1]);
}

// ---------------------------------------------------------------------------
// Scoring helpers
// ---------------------------------------------------------------------------

function computeCaseStats(testCase, agentIssues, gradingResults) {
  let matchedWeight = 0;
  let totalWeight = 0;
  const matchedAgentIndices = new Set();

  const expectedDetail = testCase.expected_issues.map((issue, i) => {
    totalWeight += issue.weight;
    const verdict = gradingResults[i];
    if (verdict.matched) {
      matchedWeight += issue.weight;
      if (verdict.matched_index !== null) matchedAgentIndices.add(verdict.matched_index);
    }
    return { id: issue.id, description: issue.description, matched: verdict.matched };
  });

  const falsePositiveDetail = agentIssues
    .filter((_, i) => !matchedAgentIndices.has(i))
    .map((issue) => issue.problem ?? issue.description ?? JSON.stringify(issue));

  return {
    matchedWeight,
    totalWeight,
    matchedAgentCount: matchedAgentIndices.size,
    matchedCount: gradingResults.filter((v) => v.matched).length,
    totalExpected: testCase.expected_issues.length,
    totalFlagged: agentIssues.length,
    falsePositives: agentIssues.length - matchedAgentIndices.size,
    expectedDetail,
    falsePositiveDetail,
  };
}

// ---------------------------------------------------------------------------
// CSV results
// ---------------------------------------------------------------------------

function appendResultsCSV(runId, results) {
  let totalMatchedWeight = 0;
  let totalWeight = 0;
  let totalMatchedAgentCount = 0;
  let totalFlagged = 0;
  let totalFalsePositives = 0;
  let totalExpected = 0;

  for (const r of results) {
    if (r.error) continue;
    if (r.isClean) {
      totalFalsePositives += r.falsePositives;
      totalFlagged += r.falsePositives;
    } else {
      totalMatchedWeight += r.matchedWeight;
      totalWeight += r.totalWeight;
      totalMatchedAgentCount += r.matchedAgentCount;
      totalFlagged += r.totalFlagged;
      totalFalsePositives += r.falsePositives;
      totalExpected += r.totalExpected;
    }
  }

  const recall = totalWeight > 0 ? totalMatchedWeight / totalWeight : 1;
  const precision = totalFlagged > 0 ? totalMatchedAgentCount / totalFlagged : 1;
  const f1 = recall + precision > 0 ? (2 * recall * precision) / (recall + precision) : 0;

  const csvPath = path.join(__dirname, 'results.csv');
  const row = `${runId},${f1.toFixed(4)},${precision.toFixed(4)},${recall.toFixed(
    4,
  )},${totalFalsePositives},${totalExpected},${totalFlagged},${MODEL}\n`;
  appendFileSync(csvPath, row);
  console.log(`\nResults appended to results.csv (task-id: ${runId})`);
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function printReport(results) {
  console.log('\n=== api-decision-critique Eval Results ===\n');

  // Micro-average accumulators (pool all issues across cases)
  let totalMatchedWeight = 0;
  let totalWeight = 0;
  let totalMatchedAgentCount = 0;
  let totalFlagged = 0;

  const tableRows = {};
  for (const r of results) {
    if (r.error) {
      tableRows[r.component] = { Recall: 'error', 'False Pos': '-', Caught: r.error };
      continue;
    }
    if (r.isClean) {
      tableRows[r.component] = {
        Recall: 'n/a',
        'False Pos': r.falsePositives,
        Caught: 'clean PR',
      };
      totalFlagged += r.falsePositives;
    } else {
      const { matchedWeight, matchedCount, totalExpected, falsePositives } = r;
      const caseRecall = r.totalWeight > 0 ? matchedWeight / r.totalWeight : 1;
      tableRows[r.component] = {
        Recall: caseRecall.toFixed(2),
        'False Pos': falsePositives,
        Caught: `${matchedCount}/${totalExpected}`,
      };
      totalMatchedWeight += matchedWeight;
      totalWeight += r.totalWeight;
      totalMatchedAgentCount += r.matchedAgentCount;
      totalFlagged += r.totalFlagged;
    }
  }

  console.table(tableRows);

  // Per-case issue breakdown
  const breakdown = {};
  for (const r of results) {
    if (r.error) continue;
    breakdown[r.component] = {
      caught: (r.expectedDetail ?? []).filter((i) => i.matched).map((i) => i.id),
      missed: (r.expectedDetail ?? []).filter((i) => !i.matched).map((i) => i.id),
      falsePositives: r.falsePositiveDetail ?? [],
    };
  }
  console.log('\n=== Per-case issue breakdown ===');
  console.log(breakdown);

  // Micro-averaged scores across all issues in all scored cases
  const recall = totalWeight > 0 ? totalMatchedWeight / totalWeight : 1;
  const precision = totalFlagged > 0 ? totalMatchedAgentCount / totalFlagged : 1;
  const f1 = recall + precision > 0 ? (2 * recall * precision) / (recall + precision) : 0;

  console.log('\nMicro-averaged (all issues pooled):');
  console.table({
    Recall: `${recall.toFixed(2)} (${totalMatchedWeight.toFixed(1)} / ${totalWeight.toFixed(
      1,
    )} caught)`,
    Precision: `${precision.toFixed(2)} (${totalMatchedAgentCount} / ${totalFlagged} correct)`,
    F1: f1.toFixed(2),
  });
  console.log(`Passing bar: Recall ≥ 0.85, Precision ≥ 0.80`);
  const passed = recall >= 0.85 && precision >= 0.8;
  console.log(`Overall: ${passed ? '✅ PASS' : '❌ FAIL'}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const casesArg = process.argv.find((a) => a.startsWith('--cases='));
  const caseLimit = casesArg ? parseInt(casesArg.split('=')[1], 10) : Infinity;
  const VERBOSE = process.argv.includes('--verbose');

  const runId = new Date()
    .toLocaleString('sv-SE', { timeZone: 'Asia/Kolkata', hour12: false })
    .replace(/[: ]/g, '-');
  const logsDir = VERBOSE ? path.join(__dirname, '.logs', runId) : null;
  if (logsDir) {
    mkdirSync(logsDir, { recursive: true });
    console.log(`Verbose logs → ${logsDir}`);
  }

  const casesDir = path.join(__dirname, 'cases');
  const cases = readdirSync(casesDir)
    .sort()
    .map((f) => JSON.parse(readFileSync(path.join(casesDir, f), 'utf-8')))
    .slice(0, caseLimit);

  async function runCase(testCase) {
    const logFile = logsDir ? path.join(logsDir, `${testCase.component}.md`) : null;
    const log = logFile
      ? /** @param {string} text */ (text) => appendFileSync(logFile, text)
      : null;
    if (logFile) writeFileSync(logFile, `# ${testCase.component}\n`);

    process.stdout.write(`\n[${testCase.component}]: running eval `);

    // 1. Fetch diff
    let diff, agentOutput;
    try {
      diff =
        testCase.type === 'clean_pr'
          ? fetchPrDiff(testCase.repo, testCase.pr_number)
          : fetchDiffForCommit(
              testCase.repo,
              testCase.base_ref,
              testCase.before_ref,
              testCase.diff_files,
            );
    } catch (e) {
      console.log(`[${testCase.component}]: FAIL (diff fetch: ${e.message})`);
      return { component: testCase.component, error: `diff fetch: ${e.message}` };
    }

    // 2. Run agent
    try {
      agentOutput = await runAgent(testCase, diff, { log });
    } catch (e) {
      console.log(`[${testCase.component}]: FAIL (agent: ${e.message})`);
      return { component: testCase.component, error: `agent: ${e.message}` };
    }

    const agentIssues = agentOutput.issues ?? [];

    // Clean case — just count false positives
    if (testCase.type === 'clean_pr') {
      console.log(`\n[${testCase.component}]: done (${agentIssues.length} issues flagged)`);
      return {
        component: testCase.component,
        isClean: true,
        falsePositives: agentIssues.length,
        falsePositiveDetail: agentIssues.map(
          (issue) => issue.problem ?? issue.description ?? JSON.stringify(issue),
        ),
      };
    }

    // 3. Grade each expected issue
    const gradingResults = await Promise.all(
      testCase.expected_issues.map((expected) => gradeIssue(expected, agentIssues)),
    );

    const stats = computeCaseStats(testCase, agentIssues, gradingResults);
    console.log(
      `\n[${testCase.component}]: done (${stats.matchedCount}/${stats.totalExpected} correctly caught, ${stats.falsePositives} false positives)`,
    );
    return { component: testCase.component, isClean: false, ...stats };
  }

  const BATCH_SIZE = 18;
  const results = [];
  for (let i = 0; i < cases.length; i += BATCH_SIZE) {
    const batch = cases.slice(i, i + BATCH_SIZE);
    // eslint-disable-next-line no-await-in-loop
    const batchResults = await Promise.all(batch.map(runCase));
    results.push(...batchResults);
  }

  printReport(results);
  appendResultsCSV(runId, results);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
