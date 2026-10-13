import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';
import type { APIRequestContext, Page } from '@playwright/test';
import {
  registerBrowserStackStatusReporter,
  setBrowserStackSessionName,
} from '../browserstack/reportStatus';

registerBrowserStackStatusReporter(test);

/**
 * Screenshots every story of the deployed blade-svelte Storybook, one test per
 * component (story title). The story list comes from the deployed Storybook's
 * `index.json`, so whatever Chromatic built is what gets captured — the local
 * `*.stories.svelte` files are only used to enumerate component titles up front
 * (Playwright needs the test list before anything async can run).
 *
 * Output: `<package>/screenshots/<project>/<component>/<storyId>.png` plus a
 * `results.json` per component and an `index.html` gallery per project
 * (built in `buildGallery.cts`).
 */

type StoryIndexEntry = {
  id: string;
  title: string;
  name: string;
  type: 'story' | 'docs';
  importPath: string;
  tags?: string[];
};

type StoryIndex = {
  v: number;
  entries: Record<string, StoryIndexEntry>;
};

export type StoryScreenshotResult = {
  id: string;
  title: string;
  name: string;
  file: string | null;
  status: 'ok' | 'render-error' | 'timeout' | 'error';
  error?: string;
  durationMs: number;
};

const PACKAGE_ROOT = process.env.BLADE_SVELTE_ROOT ?? process.cwd();
const SCREENSHOTS_DIR = process.env.BLADE_SCREENSHOTS_DIR ?? path.join(PACKAGE_ROOT, 'screenshots');
const TITLE_FILTER = new RegExp(process.env.STORY_TITLE_FILTER ?? '^Components/');
// Time to let entrance animations / layout settle after Storybook reports the story rendered.
const STORY_SETTLE_MS = Number.parseInt(process.env.STORY_SETTLE_MS ?? '300', 10);
const STORY_RENDER_TIMEOUT_MS = 30 * 1000;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function listStoryFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      out.push(...listStoryFiles(full));
    } else if (entry.name.endsWith('.stories.svelte')) {
      out.push(full);
    }
  }
  return out;
}

/** Story titles declared via `defineMeta({ title: '...' })` in the local source. */
function getLocalStoryTitles(): string[] {
  const titles = new Set<string>();
  for (const file of listStoryFiles(path.join(PACKAGE_ROOT, 'src'))) {
    const source = fs.readFileSync(file, 'utf8');
    const match = /defineMeta\(\s*\{[\s\S]*?\btitle:\s*(['"`])([^'"`]+)\1/.exec(source);
    if (match) titles.add(match[2]);
  }
  return [...titles].filter((title) => TITLE_FILTER.test(title)).sort();
}

let storyIndexPromise: Promise<StoryIndex> | undefined;

/** Fetches the deployed Storybook's story index once per worker. */
function getStoryIndex(request: APIRequestContext): Promise<StoryIndex> {
  if (!storyIndexPromise) {
    storyIndexPromise = (async () => {
      const response = await request.get('index.json');
      if (!response.ok()) {
        throw new Error(`Failed to fetch Storybook index.json: HTTP ${response.status()}`);
      }
      return (await response.json()) as StoryIndex;
    })();
  }
  return storyIndexPromise;
}

function getStoriesForTitle(index: StoryIndex, title: string): StoryIndexEntry[] {
  return Object.values(index.entries).filter(
    (entry) => entry.type === 'story' && entry.title === title,
  );
}

async function screenshotStory(
  page: Page,
  story: StoryIndexEntry,
  outDir: string,
): Promise<StoryScreenshotResult> {
  const startedAt = Date.now();
  const file = path.join(outDir, `${story.id}.png`);
  const base = { id: story.id, title: story.title, name: story.name };

  try {
    await page.goto(`iframe.html?id=${story.id}&viewMode=story`, { waitUntil: 'load' });

    // Storybook flags the <body> once the story has rendered (or blown up).
    await page
      .locator('body.sb-show-main, body.sb-show-errordisplay')
      .first()
      .waitFor({ state: 'attached', timeout: STORY_RENDER_TIMEOUT_MS });

    const hasErrorDisplay = await page.evaluate(() =>
      document.body.classList.contains('sb-show-errordisplay'),
    );
    if (hasErrorDisplay) {
      const message = (
        await page
          .locator('#error-message')
          .textContent({ timeout: 2000 })
          .catch(() => null)
      )?.trim();
      await page.screenshot({ path: file, fullPage: true }).catch(() => undefined);
      return {
        ...base,
        file,
        status: 'render-error',
        error: message ? message : 'Storybook rendered its error overlay',
        durationMs: Date.now() - startedAt,
      };
    }

    await page.waitForFunction(
      () => {
        const root = document.querySelector('#storybook-root');
        return Boolean(root && root.childElementCount > 0);
      },
      undefined,
      { timeout: STORY_RENDER_TIMEOUT_MS },
    );
    await page.evaluate(() => (document as Document & { fonts?: FontFaceSet }).fonts?.ready);
    await page.waitForTimeout(STORY_SETTLE_MS);

    await page.screenshot({ path: file, fullPage: true, animations: 'disabled' });
    return { ...base, file, status: 'ok', durationMs: Date.now() - startedAt };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const isTimeout = /timeout/i.test(message);
    // Keep whatever is on screen — a half-rendered story is still useful evidence.
    const captured = await page
      .screenshot({ path: file, fullPage: true })
      .then(() => file)
      .catch(() => null);
    return {
      ...base,
      file: captured,
      status: isTimeout ? 'timeout' : 'error',
      error: message.split('\n')[0],
      durationMs: Date.now() - startedAt,
    };
  }
}

async function screenshotStories(
  page: Page,
  stories: StoryIndexEntry[],
  outDir: string,
): Promise<StoryScreenshotResult[]> {
  fs.mkdirSync(outDir, { recursive: true });
  const results: StoryScreenshotResult[] = [];
  for (const story of stories) {
    // Sequential on purpose: one page per BrowserStack session.
    // eslint-disable-next-line no-await-in-loop
    results.push(await screenshotStory(page, story, outDir));
  }
  fs.writeFileSync(path.join(outDir, 'results.json'), JSON.stringify(results, null, 2));
  return results;
}

function expectAllRendered(results: StoryScreenshotResult[]): void {
  const failed = results.filter((result) => result.status !== 'ok');
  expect(
    failed.map((result) => `${result.id} [${result.status}] ${result.error ?? ''}`),
    'Stories that did not render cleanly',
  ).toEqual([]);
}

const localTitles = getLocalStoryTitles();

for (const title of localTitles) {
  test(title, async ({ page, request }, testInfo) => {
    await setBrowserStackSessionName(page, testInfo, `${testInfo.project.name} · ${title}`);
    const index = await getStoryIndex(request);
    const stories = getStoriesForTitle(index, title);
    test.skip(stories.length === 0, `No stories titled "${title}" in the deployed Storybook`);

    const outDir = path.join(SCREENSHOTS_DIR, testInfo.project.name, slugify(title));
    const results = await screenshotStories(page, stories, outDir);
    expectAllRendered(results);
  });
}

// Anything the deployed Storybook has that the local checkout doesn't know about
// (e.g. a newer Chromatic build) still gets captured.
test('stories without a matching local stories file', async ({ page, request }, testInfo) => {
  await setBrowserStackSessionName(page, testInfo, `${testInfo.project.name} · unmatched stories`);
  const index = await getStoryIndex(request);
  const known = new Set(localTitles);
  const stories = Object.values(index.entries).filter(
    (entry) => entry.type === 'story' && TITLE_FILTER.test(entry.title) && !known.has(entry.title),
  );
  test.skip(stories.length === 0, 'Every deployed story title has a local stories file');

  const outDir = path.join(SCREENSHOTS_DIR, testInfo.project.name, '_unmatched');
  const results = await screenshotStories(page, stories, outDir);
  expectAllRendered(results);
});
