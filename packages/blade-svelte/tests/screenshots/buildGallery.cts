import fs from 'fs';
import path from 'path';

/**
 * Playwright globalTeardown for the screenshot run: stitches every
 * `<project>/<component>/results.json` into a single `<project>/index.html`
 * so the run can be reviewed in a browser without clicking through folders.
 */

type StoryScreenshotResult = {
  id: string;
  title: string;
  name: string;
  file: string | null;
  status: 'ok' | 'render-error' | 'timeout' | 'error';
  error?: string;
  durationMs: number;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function readResults(projectDir: string): StoryScreenshotResult[] {
  const results: StoryScreenshotResult[] = [];
  for (const entry of fs.readdirSync(projectDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const resultsFile = path.join(projectDir, entry.name, 'results.json');
    if (!fs.existsSync(resultsFile)) continue;
    const parsed = JSON.parse(fs.readFileSync(resultsFile, 'utf8')) as StoryScreenshotResult[];
    results.push(...parsed);
  }
  return results.sort((a, b) => a.title.localeCompare(b.title) || a.name.localeCompare(b.name));
}

function renderGallery(projectName: string, projectDir: string, results: StoryScreenshotResult[]): string {
  const counts = results.reduce<Record<string, number>>((acc, result) => {
    acc[result.status] = (acc[result.status] ?? 0) + 1;
    return acc;
  }, {});
  const summary = Object.entries(counts)
    .map(([status, count]) => `<span class="pill ${status}">${count} ${status}</span>`)
    .join(' ');

  const byTitle = new Map<string, StoryScreenshotResult[]>();
  for (const result of results) {
    const list = byTitle.get(result.title) ?? [];
    list.push(result);
    byTitle.set(result.title, list);
  }

  const sections = [...byTitle.entries()]
    .map(([title, stories]) => {
      const cards = stories
        .map((story) => {
          const src = story.file ? path.relative(projectDir, story.file).split(path.sep).join('/') : null;
          const image = src
            ? `<a href="${escapeHtml(src)}" target="_blank"><img loading="lazy" src="${escapeHtml(src)}" alt="${escapeHtml(story.id)}"></a>`
            : '<div class="missing">no screenshot</div>';
          const error = story.error ? `<pre>${escapeHtml(story.error)}</pre>` : '';
          return `<figure class="${story.status}">${image}<figcaption><strong>${escapeHtml(story.name)}</strong> <code>${escapeHtml(story.id)}</code> <span class="pill ${story.status}">${story.status}</span>${error}</figcaption></figure>`;
        })
        .join('\n');
      return `<section id="${escapeHtml(title)}"><h2>${escapeHtml(title)} <small>${stories.length}</small></h2><div class="grid">${cards}</div></section>`;
    })
    .join('\n');

  const nav = [...byTitle.keys()]
    .map((title) => `<a href="#${escapeHtml(title)}">${escapeHtml(title.replace(/^Components\//, ''))}</a>`)
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(projectName)} screenshots</title>
<style>
  :root { color-scheme: light; --border: #d9dde3; --muted: #5f6b7a; --ok: #0e8f5b; --bad: #c62828; --warn: #b26a00; }
  body { margin: 0; font: 14px/1.4 system-ui, sans-serif; color: #1a1f26; background: #f6f7f9; }
  header { position: sticky; top: 0; background: #fff; border-bottom: 1px solid var(--border); padding: 12px 16px; z-index: 1; }
  header h1 { margin: 0 0 6px; font-size: 18px; }
  nav { display: flex; flex-wrap: wrap; gap: 6px 12px; font-size: 12px; }
  nav a { color: var(--muted); text-decoration: none; }
  main { padding: 16px; }
  section { margin-bottom: 32px; }
  h2 { font-size: 16px; margin: 0 0 12px; } h2 small { color: var(--muted); font-weight: normal; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
  figure { margin: 0; background: #fff; border: 1px solid var(--border); border-radius: 6px; overflow: hidden; }
  figure.render-error, figure.error, figure.timeout { border-color: var(--bad); }
  figure img { display: block; width: 100%; max-height: 360px; object-fit: contain; object-position: top; background: #fff; border-bottom: 1px solid var(--border); }
  figcaption { padding: 8px 10px; font-size: 12px; }
  figcaption code { color: var(--muted); display: block; margin: 2px 0 4px; word-break: break-all; }
  figcaption pre { white-space: pre-wrap; color: var(--bad); margin: 6px 0 0; font-size: 11px; }
  .missing { padding: 40px; text-align: center; color: var(--muted); }
  .pill { display: inline-block; padding: 1px 8px; border-radius: 999px; font-size: 11px; color: #fff; background: var(--muted); }
  .pill.ok { background: var(--ok); } .pill.render-error, .pill.error { background: var(--bad); } .pill.timeout { background: var(--warn); }
</style>
</head>
<body>
<header>
  <h1>${escapeHtml(projectName)} &middot; ${results.length} stories ${summary}</h1>
  <nav>${nav}</nav>
</header>
<main>
${sections}
</main>
</body>
</html>
`;
}

export default function buildGallery(): void {
  const screenshotsDir = process.env.BLADE_SCREENSHOTS_DIR;
  if (!screenshotsDir || !fs.existsSync(screenshotsDir)) return;

  for (const entry of fs.readdirSync(screenshotsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const projectDir = path.join(screenshotsDir, entry.name);
    const results = readResults(projectDir);
    if (results.length === 0) continue;
    const galleryFile = path.join(projectDir, 'index.html');
    fs.writeFileSync(galleryFile, renderGallery(entry.name, projectDir, results));
    const failed = results.filter((result) => result.status !== 'ok').length;
    // eslint-disable-next-line no-console
    console.log(
      `\n[screenshots] ${entry.name}: ${results.length} stories, ${failed} not clean → ${galleryFile}`,
    );
  }
}
