import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const scriptPath = fileURLToPath(import.meta.url);
const packageRoot = path.resolve(path.dirname(scriptPath), '..');
const outputDirectory = path.join(packageRoot, 'assets/spark/razorsense-stills');
const contactSheetPath = '/tmp/razorsense-fallback-contact-sheet.png';
const chromeExecutable = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const storyId = 'components-razorsense-fallback-exporter--exporter';
const readySelector = '[data-razor-sense-export][data-export-ready="true"]';
const errorSelector = '[data-export-error]';
const navigationTimeoutMs = 90_000;
const transparentPixelPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  'base64',
);

const operationalModes = ['neutral', 'typing', 'thinking', 'loading'];
const emotionalModes = ['calm', 'joyful', 'caution', 'regret'];
const colorSchemes = ['light', 'dark'];

const dimensionsByMode = {
  neutral: { width: 1920, height: 1280 },
  typing: { width: 1920, height: 1080 },
  thinking: { width: 1920, height: 1280 },
  loading: { width: 1920, height: 1280 },
};

const captures = [
  ...colorSchemes.flatMap((colorScheme) =>
    operationalModes.map((mode) => ({
      mode,
      colorScheme,
      viewport: 'desktop',
      ...dimensionsByMode[mode],
    })),
  ),
  ...colorSchemes.flatMap((colorScheme) =>
    emotionalModes.map((mode) => ({
      mode,
      colorScheme,
      viewport: 'desktop',
      width: 1364,
      height: 440,
    })),
  ),
  ...colorSchemes.flatMap((colorScheme) =>
    emotionalModes.map((mode) => ({
      mode,
      colorScheme,
      viewport: 'mobile',
      width: 360,
      height: 484,
    })),
  ),
].map((capture) => ({
  ...capture,
  file: `${capture.viewport}-${capture.colorScheme}-${capture.mode}.png`,
}));

const parseArguments = (argv) => {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];

    if (flag !== '--storybook-url') {
      throw new Error(`Unknown argument: ${flag ?? '<missing>'}`);
    }
    if (Object.hasOwn(parsed, flag)) {
      throw new Error(`Duplicate argument: ${flag}`);
    }
    if (value === undefined || value.startsWith('--')) {
      throw new Error(`Missing value for ${flag}`);
    }

    parsed[flag] = value;
  }

  if (!Object.hasOwn(parsed, '--storybook-url')) {
    throw new Error('Missing required argument: --storybook-url');
  }

  let storybookUrl;
  try {
    storybookUrl = new URL(parsed['--storybook-url']);
  } catch {
    throw new Error('--storybook-url must be a valid URL');
  }
  if (!['http:', 'https:'].includes(storybookUrl.protocol)) {
    throw new Error('--storybook-url must use http or https');
  }

  return storybookUrl;
};

const buildStoryUrl = (storybookUrl, capture) => {
  const baseUrl = new URL(storybookUrl.href);
  if (!baseUrl.pathname.endsWith('/')) baseUrl.pathname += '/';
  const storyUrl = new URL('iframe.html', baseUrl);
  storyUrl.search = new URLSearchParams({
    id: storyId,
    viewMode: 'story',
    mode: capture.mode,
    colorScheme: capture.colorScheme,
    viewport: capture.viewport,
  }).toString();
  return storyUrl.href;
};

const removeGeneratedSet = async () => {
  await Promise.all(
    captures.map(async ({ file }) => {
      try {
        await fs.unlink(path.join(outputDirectory, file));
      } catch (error) {
        if (error?.code !== 'ENOENT') throw error;
      }
    }),
  );
};

const readPngDimensions = (buffer) => {
  const pngSignature = '89504e470d0a1a0a';
  if (buffer.length < 24 || buffer.subarray(0, 8).toString('hex') !== pngSignature) {
    throw new Error('Output is not a valid PNG');
  }
  if (buffer.subarray(12, 16).toString('ascii') !== 'IHDR') {
    throw new Error('PNG is missing its IHDR chunk');
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
};

const analyzePng = async (page, buffer) => {
  const dataUrl = `data:image/png;base64,${buffer.toString('base64')}`;
  return page.evaluate(async (src) => {
    const image = new Image();
    image.src = src;
    await image.decode();

    const sampleWidth = Math.min(128, image.naturalWidth);
    const sampleHeight = Math.min(128, image.naturalHeight);
    const canvas = document.createElement('canvas');
    canvas.width = sampleWidth;
    canvas.height = sampleHeight;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Could not create a 2D canvas context');
    context.drawImage(image, 0, 0, sampleWidth, sampleHeight);
    const pixels = context.getImageData(0, 0, sampleWidth, sampleHeight).data;

    let count = 0;
    let alphaCount = 0;
    let luminanceSum = 0;
    let luminanceSquaredSum = 0;
    let luminanceMin = 255;
    let luminanceMax = 0;
    let chromaSum = 0;
    let chromaMax = 0;
    const channelMin = [255, 255, 255];
    const channelMax = [0, 0, 0];
    const quantizedColors = new Set();

    for (let index = 0; index < pixels.length; index += 4) {
      const red = pixels[index];
      const green = pixels[index + 1];
      const blue = pixels[index + 2];
      const alpha = pixels[index + 3];
      const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
      const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);

      count += 1;
      if (alpha > 250) alphaCount += 1;
      luminanceSum += luminance;
      luminanceSquaredSum += luminance * luminance;
      luminanceMin = Math.min(luminanceMin, luminance);
      luminanceMax = Math.max(luminanceMax, luminance);
      chromaSum += chroma;
      chromaMax = Math.max(chromaMax, chroma);
      channelMin[0] = Math.min(channelMin[0], red);
      channelMin[1] = Math.min(channelMin[1], green);
      channelMin[2] = Math.min(channelMin[2], blue);
      channelMax[0] = Math.max(channelMax[0], red);
      channelMax[1] = Math.max(channelMax[1], green);
      channelMax[2] = Math.max(channelMax[2], blue);
      quantizedColors.add(`${red >> 3},${green >> 3},${blue >> 3}`);
    }

    const meanLuminance = luminanceSum / count;
    const luminanceVariance = Math.max(
      0,
      luminanceSquaredSum / count - meanLuminance * meanLuminance,
    );

    return {
      alphaCoverage: alphaCount / count,
      meanLuminance,
      luminanceRange: luminanceMax - luminanceMin,
      luminanceStdDev: Math.sqrt(luminanceVariance),
      meanChroma: chromaSum / count,
      maxChroma: chromaMax,
      maxChannelRange: Math.max(
        channelMax[0] - channelMin[0],
        channelMax[1] - channelMin[1],
        channelMax[2] - channelMin[2],
      ),
      quantizedColorCount: quantizedColors.size,
    };
  }, dataUrl);
};

const assertMeaningfulPixels = (capture, metrics) => {
  if (metrics.alphaCoverage < 0.99) {
    throw new Error(`${capture.file} contains unexpected transparency`);
  }
  if (
    metrics.luminanceRange < 8 ||
    metrics.luminanceStdDev < 0.7 ||
    metrics.maxChannelRange < 8 ||
    metrics.quantizedColorCount < 8
  ) {
    throw new Error(`${capture.file} is blank or near-uniform: ${JSON.stringify(metrics)}`);
  }
  if (emotionalModes.includes(capture.mode) && metrics.maxChroma < 8) {
    throw new Error(`${capture.file} is unexpectedly grayscale: ${JSON.stringify(metrics)}`);
  }
};

const waitForExporter = async (page, capture) => {
  await page.waitForFunction(
    ({ readySelector, errorSelector }) =>
      Boolean(document.querySelector(readySelector) || document.querySelector(errorSelector)),
    { readySelector, errorSelector },
    { timeout: navigationTimeoutMs },
  );

  const exportError = page.locator(errorSelector).first();
  if ((await exportError.count()) > 0) {
    const message =
      (await exportError.getAttribute('data-export-error')) ?? (await exportError.textContent());
    throw new Error(`${capture.file} exporter failed: ${message}`);
  }

  const exportNode = page.locator(readySelector);
  if ((await exportNode.count()) !== 1) {
    throw new Error(`${capture.file} did not expose exactly one ready export node`);
  }
  const bounds = await exportNode.boundingBox();
  if (!bounds || bounds.width !== capture.width || bounds.height !== capture.height) {
    throw new Error(
      `${capture.file} export geometry was ${bounds?.width ?? 0}x${bounds?.height ?? 0}, expected ${
        capture.width
      }x${capture.height}`,
    );
  }

  return exportNode;
};

const captureStill = async ({ page, storybookUrl, capture, hashes }) => {
  await page.setViewportSize({ width: capture.width, height: capture.height });
  await page.goto(buildStoryUrl(storybookUrl, capture), {
    waitUntil: 'domcontentloaded',
    timeout: navigationTimeoutMs,
  });

  const exportNode = await waitForExporter(page, capture);
  const finalPath = path.join(outputDirectory, capture.file);
  const temporaryPath = path.join(outputDirectory, `.${capture.file}.${process.pid}.tmp.png`);

  try {
    await exportNode.screenshot({ path: temporaryPath, type: 'png', animations: 'disabled' });
    const buffer = await fs.readFile(temporaryPath);
    const dimensions = readPngDimensions(buffer);
    if (dimensions.width !== capture.width || dimensions.height !== capture.height) {
      throw new Error(
        `${capture.file} PNG IHDR was ${dimensions.width}x${dimensions.height}, expected ${capture.width}x${capture.height}`,
      );
    }

    const metrics = await analyzePng(page, buffer);
    assertMeaningfulPixels(capture, metrics);
    const sha256 = createHash('sha256').update(buffer).digest('hex');
    const duplicate = hashes.get(sha256);
    if (duplicate) {
      throw new Error(`${capture.file} duplicates ${duplicate}`);
    }
    hashes.set(sha256, capture.file);

    await fs.rename(temporaryPath, finalPath);
    return {
      file: capture.file,
      width: dimensions.width,
      height: dimensions.height,
      bytes: buffer.length,
      sha256: sha256.slice(0, 12),
      meanLuminance: Number(metrics.meanLuminance.toFixed(2)),
      luminanceStdDev: Number(metrics.luminanceStdDev.toFixed(2)),
      meanChroma: Number(metrics.meanChroma.toFixed(2)),
    };
  } finally {
    try {
      await fs.unlink(temporaryPath);
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
  }
};

const assertGeneratedSet = async () => {
  const expected = captures.map(({ file }) => file).sort();
  const actual = (await fs.readdir(outputDirectory))
    .filter((file) => file.toLowerCase().endsWith('.png'))
    .sort();
  if (new Set(expected).size !== 24 || expected.length !== 24) {
    throw new Error('Capture matrix does not contain exactly 24 unique outputs');
  }
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `Generated PNG set differs from the exact 24-file matrix: ${JSON.stringify({
        expected,
        actual,
      })}`,
    );
  }
};

const createContactSheet = async (context, summaries) => {
  const rows = [
    ['Operational · desktop · light', 'desktop', 'light', operationalModes],
    ['Operational · desktop · dark', 'desktop', 'dark', operationalModes],
    ['Emotional · desktop · light', 'desktop', 'light', emotionalModes],
    ['Emotional · desktop · dark', 'desktop', 'dark', emotionalModes],
    ['Emotional · mobile · light', 'mobile', 'light', emotionalModes],
    ['Emotional · mobile · dark', 'mobile', 'dark', emotionalModes],
  ];
  const summaryByFile = new Map(summaries.map((summary) => [summary.file, summary]));
  const dataUrlByFile = new Map(
    await Promise.all(
      captures.map(async ({ file }) => {
        const buffer = await fs.readFile(path.join(outputDirectory, file));
        return [file, `data:image/png;base64,${buffer.toString('base64')}`];
      }),
    ),
  );
  const rowMarkup = rows
    .map(([title, viewport, colorScheme, modes]) => {
      const cards = modes
        .map((mode) => {
          const file = `${viewport}-${colorScheme}-${mode}.png`;
          const summary = summaryByFile.get(file);
          return `<figure><div class="image"><img src="${dataUrlByFile.get(
            file,
          )}" alt=""></div><figcaption><strong>${mode}</strong><span>${summary.width}×${
            summary.height
          }</span></figcaption></figure>`;
        })
        .join('');
      return `<section><h2>${title}</h2><div class="row">${cards}</div></section>`;
    })
    .join('');

  const page = await context.newPage();
  try {
    await page.setViewportSize({ width: 1560, height: 1000 });
    await page.setContent(`<!doctype html><html><head><style>
      * { box-sizing: border-box; }
      body { margin: 0; padding: 28px; color: #f5f7fb; background: #0b0d11; font: 14px/1.4 -apple-system, BlinkMacSystemFont, sans-serif; }
      h1 { margin: 0 0 24px; font-size: 24px; }
      section { margin: 0 0 30px; }
      h2 { margin: 0 0 10px; color: #b9c1d1; font-size: 15px; font-weight: 600; }
      .row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
      figure { min-width: 0; margin: 0; padding: 10px; border: 1px solid #2a303a; border-radius: 10px; background: #15191f; }
      .image { display: grid; width: 100%; height: 220px; place-items: center; overflow: hidden; background: #07090c; }
      img { display: block; max-width: 100%; max-height: 100%; object-fit: contain; }
      figcaption { display: flex; justify-content: space-between; margin-top: 8px; color: #9da7b7; }
      strong { color: #f5f7fb; font-weight: 600; }
    </style></head><body><h1>RazorSense fallback stills · 24 captures</h1>${rowMarkup}</body></html>`);
    await page.evaluate(() =>
      Promise.all(Array.from(document.images).map((image) => image.decode())),
    );
    await page.screenshot({ path: contactSheetPath, type: 'png', fullPage: true });
  } finally {
    await page.close();
  }
};

const run = async () => {
  const storybookUrl = parseArguments(process.argv.slice(2));
  const packageMetadata = JSON.parse(
    await fs.readFile(path.join(packageRoot, 'package.json'), 'utf8'),
  );
  await fs.access(chromeExecutable);
  await fs.mkdir(outputDirectory, { recursive: true });
  await removeGeneratedSet();

  const profilePath = await fs.mkdtemp(path.join(os.tmpdir(), 'razorsense-fallbacks-'));
  let context;
  const summaries = [];
  const hashes = new Map();
  const pageErrors = [];

  try {
    context = await chromium.launchPersistentContext(profilePath, {
      executablePath: chromeExecutable,
      headless: true,
      viewport: { width: 1920, height: 1280 },
      deviceScaleFactor: 1,
    });
    await context.addInitScript((version) => {
      globalThis.__BLADE_VERSION__ = version;
    }, packageMetadata.version);
    await context.route('**/favicon.ico', (route) => route.fulfill({ status: 204, body: '' }));
    // The production renderer keeps its calibrated still beneath the progressive
    // video layer. During regeneration those same files have intentionally been
    // removed, so serve a transparent pixel to keep the capture self-contained
    // and prevent stale fallback pixels from influencing the new still.
    await context.route('**/assets/spark/razorsense-stills/*.png', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'image/png',
        body: transparentPixelPng,
      }),
    );
    const page = context.pages()[0] ?? (await context.newPage());
    page.on('pageerror', (error) => pageErrors.push({ type: 'pageerror', message: error.message }));
    page.on('console', (message) => {
      if (message.type() === 'error') {
        const location = message.location();
        pageErrors.push({
          type: 'console',
          message: message.text(),
          url: location.url || undefined,
        });
      }
    });
    page.on('response', (response) => {
      if (response.status() >= 400) {
        pageErrors.push({
          type: 'http',
          status: response.status(),
          url: response.url(),
        });
      }
    });

    for (const capture of captures) {
      summaries.push(await captureStill({ page, storybookUrl, capture, hashes }));
    }

    await assertGeneratedSet();
    await createContactSheet(context, summaries);
    if (pageErrors.length > 0) {
      throw new Error(`Exporter emitted browser errors: ${JSON.stringify(pageErrors)}`);
    }
  } finally {
    await context?.close();
    await fs.rm(profilePath, { recursive: true, force: true });
  }

  const dimensions = Object.entries(
    summaries.reduce((counts, summary) => {
      const key = `${summary.width}x${summary.height}`;
      counts[key] = (counts[key] ?? 0) + 1;
      return counts;
    }, {}),
  ).map(([size, count]) => ({ size, count }));

  console.log(
    JSON.stringify(
      {
        status: 'passed',
        total: summaries.length,
        outputDirectory,
        dimensions,
        files: summaries,
        contactSheetPath,
      },
      null,
      2,
    ),
  );
};

run().catch((error) => {
  console.error(
    JSON.stringify(
      {
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
});
