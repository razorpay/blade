#!/usr/bin/env node
/**
 * Posts a structured PR review JSON as a GitHub review.
 *
 * Usage:
 *   node post-review.js <review-json-file> <pr-number> [repo] [--pending]
 *   cat review.json | node post-review.js - <pr-number> [repo] [--pending]
 *
 * Repo defaults to razorpay/blade.
 * Pass --pending to save as a draft review (not visible until submitted).
 */

const { execSync } = require('child_process');
const fs = require('fs');

const inputArg = process.argv[2];
const prNumber = process.argv[3];
const args = process.argv.slice(4);
const pendingFlagIndex = args.indexOf('--pending');
const isPending = pendingFlagIndex !== -1;
const repoArgs = args.filter((_, i) => i !== pendingFlagIndex);
const repo = repoArgs[0] || 'razorpay/blade';

if (!inputArg || !prNumber) {
  console.error('Usage: node post-review.js <review-json-file|-> <pr-number> [repo]');
  process.exit(1);
}

const raw =
  inputArg === '-' ? fs.readFileSync('/dev/stdin', 'utf8') : fs.readFileSync(inputArg, 'utf8');
const reviewJson = JSON.parse(raw);

// ---------------------------------------------------------------------------
// Overview comment formatter
// ---------------------------------------------------------------------------

function stateIcon(state) {
  if (state === 'SUCCESS') return '✅';
  if (state === 'FAILURE') return '❌';
  if (state === 'SKIPPED') return '⏭️';
  return '⏳';
}

function buildStatusSection(statuses, screenshotCdnMap = {}) {
  const failed = statuses.filter((s) => s.state !== 'SUCCESS' && s.state !== 'SKIPPED');
  const passed = statuses.filter((s) => s.state === 'SUCCESS');
  const skipped = statuses.filter((s) => s.state === 'SKIPPED');

  const hasScreenshots = statuses.some((s) => screenshotCdnMap[s.screenshot_path]);

  const screenshotCell = (s) => {
    const cdn = s.screenshot_path && screenshotCdnMap[s.screenshot_path];
    return cdn ? `<a href="${cdn}"><img src="${cdn}" width="400" /></a>` : '';
  };

  const parts = [];

  // Summary line
  const summary = [
    passed.length ? `✅ ${passed.length} passed` : null,
    failed.length ? `❌ ${failed.length} failed` : null,
    skipped.length ? `⏭️ ${skipped.length} skipped` : null,
  ]
    .filter(Boolean)
    .join(' · ');
  parts.push(summary);

  // Failures table
  if (failed.length) {
    const header = hasScreenshots
      ? ['| Check | Problem | Screenshot |', '|-------|---------|------------|']
      : ['| Check | Problem |', '|-------|---------|'];
    const rows = failed.map((s) => {
      const name = s.link ? `[${s.name}](${s.link})` : s.name;
      const detail = [s.problem, s.suggestion].filter(Boolean).join('<br><br>**Suggestion:** ');
      return hasScreenshots
        ? `| ${name} | ${detail} | ${screenshotCell(s)} |`
        : `| ${name} | ${detail} |`;
    });
    parts.push([...header, ...rows].join('\n'));
  }

  // Passing checks collapsed
  if (passed.length) {
    const header = hasScreenshots
      ? ['| Check | Screenshot |', '|-------|------------|']
      : ['| Check |', '|-------|'];
    const rows = passed.map((s) => {
      const name = s.link ? `[${s.name}](${s.link})` : s.name;
      return hasScreenshots ? `| ✅ ${name} | ${screenshotCell(s)} |` : `| ✅ ${name} |`;
    });
    const inner = [...header, ...rows].join('\n');
    parts.push(
      `<details>\n<summary>Passing checks (${passed.length})</summary>\n\n${inner}\n\n</details>`,
    );
  }

  return parts.join('\n\n');
}

function formatOverviewComment(overview, reviewStatus, isSelfReview, screenshotCdnMap = {}) {
  const parts = ['## ✨ Agentic PR Review ✨'];

  if (reviewStatus === 'approved') {
    parts.push('**Status:** Approved ✅');
  }

  if (isSelfReview) {
    parts.push(
      '<img src="https://i.imgur.com/dOeSiPZ.jpeg" alt="obama giving obama medal" width="300px" />',
    );
  }

  const sanity = overview['sanity-review'];
  const ui = overview['ui-review'];

  if (ui) {
    const storybookStatus = sanity?.statuses?.find((s) =>
      s.name.toLowerCase().includes('storybook'),
    );
    const storybookLine = storybookStatus?.link
      ? `🔗 Storybook: [Preview](${storybookStatus.link})`
      : null;

    parts.push('### UI Review');
    if (storybookLine) parts.push(storybookLine);
    parts.push(buildStatusSection(ui.statuses, screenshotCdnMap));
  }

  if (sanity) {
    parts.push('### CI / Sanity');
    parts.push(buildStatusSection(sanity.statuses));
    if (sanity.issues?.length) {
      parts.push(sanity.issues.map((i) => `> ⚠️ ${i.problem}`).join('\n'));
    }
  }

  return parts.join('\n\n');
}

// ---------------------------------------------------------------------------
// Inline comment formatter
// ---------------------------------------------------------------------------

const SEVERITY_EMOJI = { critical: '🔴', major: '🟠', minor: '🔵' };

function formatInlineComment(c) {
  const emoji = SEVERITY_EMOJI[c.severity] || '⚪';
  const lines = [
    `${emoji} **[${c.severity.toUpperCase()}]** · _${c.critique}_`,
    '',
    `**Problem:** ${c.problem}`,
  ];
  if (c.suggestion) lines.push('', `**Suggestion:** ${c.suggestion}`);
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Archive UI critique screenshots to __ci_artifacts branch
// ---------------------------------------------------------------------------

function archiveUiScreenshots(reviewJson, repoArg) {
  const uiStatuses = reviewJson?.['overview-comment']?.['ui-review']?.statuses ?? [];
  const screenshots = uiStatuses.filter((s) => s.screenshot_path);
  if (screenshots.length === 0) return {};

  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const sec = String(now.getSeconds()).padStart(2, '0');
  const timestamp = `${dd}-${mm}-${yy}--${hh}-${min}-${sec}`;
  const destDir = `artifacts/review/${timestamp}/ui-critique`;

  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  const cdnMap = {};
  let stashed = false;

  try {
    const dirty = execSync('git status --porcelain').toString().trim();
    if (dirty) {
      execSync('git stash --include-untracked', { stdio: 'pipe' });
      stashed = true;
    }

    try {
      execSync('git fetch origin __ci_artifacts:__ci_artifacts --no-tags', { stdio: 'pipe' });
    } catch (_) {
      // branch may not exist on remote yet — that's fine
    }
    try {
      execSync('git checkout __ci_artifacts', { stdio: 'pipe' });
    } catch (_) {
      execSync('git checkout --orphan __ci_artifacts', { stdio: 'pipe' });
      execSync('git rm -rf . --quiet', { stdio: 'pipe' });
    }

    execSync(`mkdir -p ${destDir}`);

    screenshots.forEach((s, i) => {
      if (!fs.existsSync(s.screenshot_path)) return;
      const storyIdMatch = s.link?.match(/[?&]path=\/story\/([^&]+)/);
      const storyId = storyIdMatch ? storyIdMatch[1].replace(/[^a-zA-Z0-9_-]/g, '-') : `story-${i}`;
      const dest = `${destDir}/${storyId}-${i + 1}.png`;
      fs.copyFileSync(s.screenshot_path, dest);
      execSync(`git add ${dest}`);
      cdnMap[s.screenshot_path] =
        `https://raw.githubusercontent.com/${repoArg}/__ci_artifacts/${dest}`;
    });

    execSync(`git commit -m "chore: add ui-critique screenshots for ${timestamp}" --allow-empty`);
    execSync('git push origin __ci_artifacts');
    console.log(`\nUI screenshots archived to __ci_artifacts: ${destDir}`);
  } finally {
    execSync(`git checkout ${currentBranch}`);
    if (stashed) execSync('git stash pop', { stdio: 'pipe' });
  }

  return cdnMap;
}

const screenshotCdnMap = archiveUiScreenshots(reviewJson, repo);

// ---------------------------------------------------------------------------
// Build payload
// ---------------------------------------------------------------------------

const prAuthor = execSync(`gh api repos/${repo}/pulls/${prNumber} --jq '.user.login'`)
  .toString()
  .trim();
let currentUser;
try {
  currentUser = execSync("gh api user --jq '.login'").toString().trim();
} catch (_) {
  currentUser = null;
}
const isSelfReview = currentUser !== null && prAuthor === currentUser;

// "Generate PR Report" runs long and is always in-progress — exclude it from review gates
const IGNORED_CHECKS = ['generate pr report'];
function filterIgnoredChecks(overview) {
  const filtered = { ...overview };
  for (const key of ['sanity-review', 'ui-review']) {
    if (filtered[key]?.statuses) {
      filtered[key] = {
        ...filtered[key],
        statuses: filtered[key].statuses.filter(
          (s) => !IGNORED_CHECKS.includes(s.name.toLowerCase()),
        ),
      };
    }
  }
  return filtered;
}

const overviewBody = formatOverviewComment(
  filterIgnoredChecks(reviewJson['overview-comment']),
  reviewJson['reviewStatus'],
  isSelfReview,
  screenshotCdnMap,
);

const SEVERITY_ORDER = { critical: 0, major: 1, minor: 2 };
const sortBySeverity = (a, b) =>
  (SEVERITY_ORDER[a.severity] ?? 3) - (SEVERITY_ORDER[b.severity] ?? 3);

const allComments = (reviewJson['inlined-comments'] ?? []).sort(sortBySeverity);
const lineComments = allComments.filter((c) => c.line);
const fileComments = allComments.filter((c) => !c.line);

// ---------------------------------------------------------------------------
// Post via gh CLI
// ---------------------------------------------------------------------------

console.log(`Posting to ${repo}#${prNumber}…`);
console.log(`  Overview body: ${overviewBody.length} chars`);
console.log(
  `  Comments: ${allComments.length} (${lineComments.length} line-level, ${fileComments.length} file-level → line 1)`,
);

// All comments go into a single review.
// File-level comments (line: null) are anchored to line 1 of the file — the batch
// /reviews API doesn't support subject_type:"file", so line 1 is the next-best anchor.
const reviewStatus = reviewJson['reviewStatus'];
const submitEvent = isPending
  ? undefined
  : reviewStatus === 'approved' && !isSelfReview
    ? 'APPROVE'
    : 'COMMENT';

const reviewPayload = {
  body: overviewBody,
  ...(submitEvent ? { event: submitEvent } : {}),
  comments: allComments.map((c) => {
    const base = { path: c.file, body: formatInlineComment(c) };
    // Line-level: use line + side (new-style, resolves against file content in the diff).
    // File-level (no line): use position: 1 (old-style, always the first line of the patch).
    return c.line ? { ...base, line: c.line, side: c.side ?? 'RIGHT' } : { ...base, position: 1 };
  }),
};

const result = execSync(`gh api repos/${repo}/pulls/${prNumber}/reviews --method POST --input -`, {
  input: JSON.stringify(reviewPayload),
});
const created = JSON.parse(result.toString());

if (isPending) {
  console.log(`\nReview saved as PENDING draft (id: ${created.id})`);
  console.log(`Review URL: ${created.html_url}`);
  console.log(`\nTo submit the pending review:`);
  console.log(
    `  gh api repos/${repo}/pulls/${prNumber}/reviews/${created.id}/events --method POST --field event=COMMENT`,
  );
} else {
  console.log(`\nReview submitted as ${submitEvent} (id: ${created.id})`);
  console.log(`Review URL: ${created.html_url}`);
}
