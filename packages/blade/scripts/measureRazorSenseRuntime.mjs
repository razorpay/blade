import { execFile as execFileCallback } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const execFile = promisify(execFileCallback);
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = path.resolve(packageRoot, '../..');

const chromeExecutable = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const defaultViewport = { width: 1200, height: 720 };
const defaultDeviceScaleFactor = 1;
const readySelector = '[data-scenario-ready="true"]';
const navigationTimeoutMs = 90_000;
const networkObservationMs = 2_000;
const frameWarmupMs = 2_000;
const frameObservationMs = 10_000;
const networkRunCount = 3;
const frameRunCount = 5;

const scenarios = [
  {
    slug: 'current-neutral',
    storyId: 'components-razorsense-performance--current-neutral',
    title: 'Current neutral',
  },
  {
    slug: 'current-calm',
    storyId: 'components-razorsense-performance--current-calm',
    title: 'Current calm',
  },
  {
    slug: 'four-visible-mixed-instances',
    storyId: 'components-razorsense-performance--four-visible-mixed-instances',
    title: 'Four visible mixed instances',
  },
  {
    slug: 'eight-mounted-instances',
    storyId: 'components-razorsense-performance--eight-mounted-instances',
    title: 'Eight mounted instances',
  },
  {
    slug: 'rapid-operational-changes',
    storyId: 'components-razorsense-performance--rapid-operational-changes',
    title: 'Rapid operational changes',
  },
  {
    slug: 'rapid-emotional-changes',
    storyId: 'components-razorsense-performance--rapid-emotional-changes',
    title: 'Rapid emotional changes',
  },
  {
    slug: 'provider-appearance-changes',
    storyId: 'components-razorsense-performance--provider-appearance-changes',
    title: 'Provider appearance changes',
  },
  {
    slug: 'page-visibility',
    storyId: 'components-razorsense-performance--page-visibility',
    title: 'Page visibility',
  },
].map((scenario) => ({
  ...scenario,
  viewport: defaultViewport,
  deviceScaleFactor: defaultDeviceScaleFactor,
}));

const requiredFlags = new Set(['--storybook-url', '--output', '--label']);

function parseArguments(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];

    if (!requiredFlags.has(flag)) {
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

  for (const flag of requiredFlags) {
    if (!Object.hasOwn(parsed, flag)) {
      throw new Error(`Missing required argument: ${flag}`);
    }
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

  const outputPath = path.resolve(packageRoot, parsed['--output']);
  if (path.extname(outputPath).toLowerCase() !== '.md') {
    throw new Error('--output must point to a Markdown file');
  }

  const label = parsed['--label'];
  if (!/^[a-zA-Z0-9_-]+$/.test(label)) {
    throw new Error('--label may contain only letters, numbers, underscores, and hyphens');
  }

  const outputParts = path.parse(outputPath);
  const rawOutputPath = path.join(outputParts.dir, `${outputParts.name}.${label}.json`);

  return {
    storybookUrl: storybookUrl.toString().replace(/\/$/, ''),
    outputPath,
    rawOutputPath,
    label,
  };
}

function installRazorSenseMetrics() {
  const originalRequestAnimationFrame = window.requestAnimationFrame;
  const originalCancelAnimationFrame = window.cancelAnimationFrame;
  const originalMediaPlay = window.HTMLMediaElement?.prototype.play;
  const originalMediaPause = window.HTMLMediaElement?.prototype.pause;
  const originalGetContext = window.HTMLCanvasElement?.prototype.getContext;
  const originalRequestVideoFrameCallback =
    window.HTMLVideoElement?.prototype.requestVideoFrameCallback;

  const pendingAnimationFrames = new Set();
  const knownMediaElements = new Set();
  const knownWebGLContexts = new WeakSet();
  let knownWebGLContextCount = 0;
  let webGLContextBaseline = 0;
  let videoQualityBaseline = new WeakMap();
  let lastAnimationFrameTimestamp;

  const createSample = () => ({
    startedAt: performance.now(),
    rafSchedules: 0,
    rafCancels: 0,
    rafCancelledWhilePending: 0,
    rafCallbacks: 0,
    rafIntervalsMs: [],
    mediaPlayCalls: 0,
    mediaPauseCalls: 0,
    rvfcSchedules: 0,
    rvfcCallbacks: 0,
    rvfcLatenessMs: [],
    rvfcProcessingDurationMs: [],
    longTasks: [],
  });

  let sample = createSample();

  const getVideoQuality = (video) => {
    try {
      if (typeof video.getVideoPlaybackQuality === 'function') {
        const quality = video.getVideoPlaybackQuality();
        return {
          totalVideoFrames: Number(quality.totalVideoFrames) || 0,
          droppedVideoFrames: Number(quality.droppedVideoFrames) || 0,
        };
      }

      return {
        totalVideoFrames: Number(video.webkitDecodedFrameCount) || 0,
        droppedVideoFrames: Number(video.webkitDroppedFrameCount) || 0,
      };
    } catch {
      return { totalVideoFrames: 0, droppedVideoFrames: 0 };
    }
  };

  const listMediaElements = () => {
    const elements = new Set(knownMediaElements);
    document.querySelectorAll('audio, video').forEach((element) => elements.add(element));
    return [...elements].filter((element) => element?.isConnected);
  };

  const describeMediaElement = (element) => ({
    tagName: element.tagName.toLowerCase(),
    currentSrc: element.currentSrc || element.src || '',
    paused: element.paused,
    ended: element.ended,
    readyState: element.readyState,
  });

  const captureVideoQualityBaseline = () => {
    videoQualityBaseline = new WeakMap();
    document.querySelectorAll('video').forEach((video) => {
      videoQualityBaseline.set(video, getVideoQuality(video));
    });
  };

  window.requestAnimationFrame = function (...args) {
    const callback = args[0];
    if (typeof callback !== 'function') {
      return Reflect.apply(originalRequestAnimationFrame, this, args);
    }

    sample.rafSchedules += 1;
    let requestId;
    const wrappedCallback = function (...callbackArgs) {
      pendingAnimationFrames.delete(requestId);
      sample.rafCallbacks += 1;

      const timestamp = callbackArgs[0];
      if (Number.isFinite(timestamp) && timestamp !== lastAnimationFrameTimestamp) {
        if (lastAnimationFrameTimestamp !== undefined) {
          sample.rafIntervalsMs.push(timestamp - lastAnimationFrameTimestamp);
        }
        lastAnimationFrameTimestamp = timestamp;
      }

      return Reflect.apply(callback, this, callbackArgs);
    };

    requestId = Reflect.apply(originalRequestAnimationFrame, this, [
      wrappedCallback,
      ...args.slice(1),
    ]);
    pendingAnimationFrames.add(requestId);
    return requestId;
  };

  window.cancelAnimationFrame = function (...args) {
    sample.rafCancels += 1;
    if (pendingAnimationFrames.delete(args[0])) {
      sample.rafCancelledWhilePending += 1;
    }
    return Reflect.apply(originalCancelAnimationFrame, this, args);
  };

  if (originalMediaPlay) {
    window.HTMLMediaElement.prototype.play = function (...args) {
      const returnValue = Reflect.apply(originalMediaPlay, this, args);
      knownMediaElements.add(this);
      sample.mediaPlayCalls += 1;
      return returnValue;
    };
  }

  if (originalMediaPause) {
    window.HTMLMediaElement.prototype.pause = function (...args) {
      const returnValue = Reflect.apply(originalMediaPause, this, args);
      knownMediaElements.add(this);
      sample.mediaPauseCalls += 1;
      return returnValue;
    };
  }

  if (originalGetContext) {
    window.HTMLCanvasElement.prototype.getContext = function (...args) {
      const context = Reflect.apply(originalGetContext, this, args);
      const contextType = typeof args[0] === 'string' ? args[0].toLowerCase() : '';
      const isWebGL = ['webgl', 'webgl2', 'experimental-webgl'].includes(contextType);

      if (isWebGL && context && !knownWebGLContexts.has(context)) {
        knownWebGLContexts.add(context);
        knownWebGLContextCount += 1;
      }

      return context;
    };
  }

  if (originalRequestVideoFrameCallback) {
    window.HTMLVideoElement.prototype.requestVideoFrameCallback = function (...args) {
      const callback = args[0];
      if (typeof callback !== 'function') {
        return Reflect.apply(originalRequestVideoFrameCallback, this, args);
      }

      sample.rvfcSchedules += 1;
      const wrappedCallback = function (...callbackArgs) {
        sample.rvfcCallbacks += 1;

        const callbackTimestamp = callbackArgs[0];
        const metadata = callbackArgs[1];
        if (Number.isFinite(callbackTimestamp) && Number.isFinite(metadata?.expectedDisplayTime)) {
          sample.rvfcLatenessMs.push(Math.max(0, callbackTimestamp - metadata.expectedDisplayTime));
        }
        if (Number.isFinite(metadata?.processingDuration)) {
          sample.rvfcProcessingDurationMs.push(metadata.processingDuration * 1_000);
        }

        return Reflect.apply(callback, this, callbackArgs);
      };

      return Reflect.apply(originalRequestVideoFrameCallback, this, [
        wrappedCallback,
        ...args.slice(1),
      ]);
    };
  }

  const supportsLongTasks = Boolean(
    window.PerformanceObserver?.supportedEntryTypes?.includes('longtask'),
  );
  if (supportsLongTasks) {
    const observer = new PerformanceObserver((entryList) => {
      entryList.getEntries().forEach((entry) => {
        if (entry.startTime >= sample.startedAt) {
          sample.longTasks.push({
            startTime: entry.startTime,
            duration: entry.duration,
            name: entry.name,
          });
        }
      });
    });
    observer.observe({ type: 'longtask', buffered: true });
  }

  const reset = () => {
    sample = createSample();
    pendingAnimationFrames.clear();
    lastAnimationFrameTimestamp = undefined;
    webGLContextBaseline = knownWebGLContextCount;
    captureVideoQualityBaseline();
  };

  const read = () => {
    const mediaElements = listMediaElements();
    const currentPlayingElements = mediaElements.filter(
      (element) => !element.paused && !element.ended,
    );
    const videos = [...document.querySelectorAll('video')].map((video) => {
      const current = getVideoQuality(video);
      const baseline = videoQualityBaseline.get(video) ?? {
        totalVideoFrames: 0,
        droppedVideoFrames: 0,
      };
      const totalVideoFrames = Math.max(0, current.totalVideoFrames - baseline.totalVideoFrames);
      const droppedVideoFrames = Math.max(
        0,
        current.droppedVideoFrames - baseline.droppedVideoFrames,
      );

      return {
        currentSrc: video.currentSrc || video.src || '',
        totalVideoFrames,
        droppedVideoFrames,
        droppedFramePercentage:
          totalVideoFrames === 0 ? 0 : (droppedVideoFrames / totalVideoFrames) * 100,
      };
    });
    const totalVideoFrames = videos.reduce((total, video) => total + video.totalVideoFrames, 0);
    const droppedVideoFrames = videos.reduce((total, video) => total + video.droppedVideoFrames, 0);

    return {
      measurementDurationMs: performance.now() - sample.startedAt,
      raf: {
        schedules: sample.rafSchedules,
        cancels: sample.rafCancels,
        cancelledWhilePending: sample.rafCancelledWhilePending,
        callbacks: sample.rafCallbacks,
        pending: pendingAnimationFrames.size,
        intervalsMs: [...sample.rafIntervalsMs],
      },
      media: {
        playCalls: sample.mediaPlayCalls,
        pauseCalls: sample.mediaPauseCalls,
        elementCount: mediaElements.length,
        currentPlayingCount: currentPlayingElements.length,
        currentPlayingElements: currentPlayingElements.map(describeMediaElement),
      },
      webgl: {
        uniqueContextCount: knownWebGLContextCount,
        acquiredDuringMeasurement: knownWebGLContextCount - webGLContextBaseline,
      },
      requestVideoFrameCallback: {
        supported: Boolean(originalRequestVideoFrameCallback),
        schedules: sample.rvfcSchedules,
        callbacks: sample.rvfcCallbacks,
        latenessMs: [...sample.rvfcLatenessMs],
        processingDurationMs: [...sample.rvfcProcessingDurationMs],
      },
      longTasks: {
        supported: supportsLongTasks,
        entries: sample.longTasks.map((entry) => ({ ...entry })),
      },
      videoPlaybackQuality: {
        totalVideoFrames,
        droppedVideoFrames,
        droppedFramePercentage:
          totalVideoFrames === 0 ? 0 : (droppedVideoFrames / totalVideoFrames) * 100,
        videos,
      },
    };
  };

  captureVideoQualityBaseline();
  Object.defineProperty(window, '__razorSenseMetrics', {
    value: Object.freeze({ reset, read }),
    configurable: false,
    enumerable: false,
    writable: false,
  });
}

function serializeError(error) {
  return {
    name: error instanceof Error ? error.name : 'Error',
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  };
}

function buildStoryUrl(storybookUrl, storyId) {
  const url = new URL(`${storybookUrl}/iframe.html`);
  url.searchParams.set('id', storyId);
  url.searchParams.set('viewMode', 'story');
  return url.toString();
}

async function waitForScenarioReady(page) {
  await page.locator(readySelector).waitFor({ state: 'attached', timeout: navigationTimeoutMs });
}

function toResponsesByRequestId(requests) {
  return Object.fromEntries(
    [...requests.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([requestId, request]) => [requestId, request]),
  );
}

function isRazorSenseMediaTransfer(request) {
  let pathname = '';
  try {
    pathname = new URL(request.url).pathname;
  } catch {
    pathname = request.url;
  }

  const isVideoMimeType = /^video\//i.test(request.mimeType);
  const isVideoFile = /\.(mp4|webm)$/i.test(pathname);
  return request.url.includes('razorsense-') && (isVideoMimeType || isVideoFile);
}

async function collectNetworkRun({ context, page, storyUrl, runIndex }) {
  const client = await context.newCDPSession(page);
  const requests = new Map();
  const startedAt = new Date().toISOString();
  const startedAtMonotonic = performance.now();

  client.on('Network.responseReceived', ({ requestId, response, type }) => {
    requests.set(requestId, {
      url: response.url,
      status: response.status,
      mimeType: response.mimeType,
      encodedDataLength: response.encodedDataLength,
      resourceType: type,
      completed: false,
    });
  });
  client.on('Network.loadingFinished', ({ requestId, encodedDataLength }) => {
    const request = requests.get(requestId);
    if (request) {
      request.encodedDataLength = encodedDataLength;
      request.completed = true;
    }
  });
  client.on('Network.loadingFailed', ({ requestId, errorText, canceled }) => {
    const request = requests.get(requestId);
    if (request) {
      request.failed = true;
      request.errorText = errorText;
      request.canceled = canceled;
    }
  });

  let error;
  try {
    await client.send('Network.enable');
    await client.send('Network.setCacheDisabled', { cacheDisabled: true });
    await client.send('Network.clearBrowserCache');

    if (runIndex === 1 || page.url() === 'about:blank') {
      await page.goto(storyUrl, {
        waitUntil: 'domcontentloaded',
        timeout: navigationTimeoutMs,
      });
    } else {
      await page.reload({ waitUntil: 'domcontentloaded', timeout: navigationTimeoutMs });
    }
    await waitForScenarioReady(page);
    await page.waitForTimeout(networkObservationMs);
  } catch (runError) {
    error = serializeError(runError);
  }

  const razorSenseMediaTransfersByRequestId = Object.fromEntries(
    Object.entries(toResponsesByRequestId(requests)).filter(([, request]) =>
      isRazorSenseMediaTransfer(request),
    ),
  );
  const razorSenseMediaTransfers = Object.values(razorSenseMediaTransfersByRequestId);
  const uniqueMediaAssetUrlCount = new Set(razorSenseMediaTransfers.map((request) => request.url))
    .size;
  const mediaBytes = razorSenseMediaTransfers.reduce(
    (total, request) => total + (Number(request.encodedDataLength) || 0),
    0,
  );

  try {
    await client.detach();
  } catch {
    // The target may already be gone after a navigation failure.
  }

  return {
    runIndex,
    status: error ? 'failed' : 'passed',
    startedAt,
    durationMs: performance.now() - startedAtMonotonic,
    cacheCondition: 'CDP Network cache disabled and browser cache cleared',
    observationAfterReadyMs: networkObservationMs,
    uniqueMediaAssetUrlCount,
    mediaTransferCount: razorSenseMediaTransfers.length,
    mediaEncodedDataLength: mediaBytes,
    razorSenseMediaTransfersByRequestId,
    ...(error ? { error } : {}),
  };
}

async function setNetworkCacheDisabled(context, page, cacheDisabled) {
  const client = await context.newCDPSession(page);
  try {
    await client.send('Network.enable');
    await client.send('Network.setCacheDisabled', { cacheDisabled });
  } finally {
    await client.detach();
  }
}

async function collectFrameRun({ page, runIndex }) {
  const startedAt = new Date().toISOString();
  const startedAtMonotonic = performance.now();

  try {
    await page.reload({ waitUntil: 'domcontentloaded', timeout: navigationTimeoutMs });
    await waitForScenarioReady(page);
    await page.waitForTimeout(frameWarmupMs);
    await page.evaluate(() => {
      if (!window.__razorSenseMetrics) {
        throw new Error('RazorSense runtime instrumentation was not installed');
      }
      window.__razorSenseMetrics.reset();
    });
    await page.waitForTimeout(frameObservationMs);
    const metrics = await page.evaluate(() => window.__razorSenseMetrics.read());

    return {
      runIndex,
      status: 'passed',
      startedAt,
      durationMs: performance.now() - startedAtMonotonic,
      cacheCondition: 'Browser cache enabled after an unmeasured priming navigation',
      warmupMs: frameWarmupMs,
      observationMs: frameObservationMs,
      metrics,
    };
  } catch (error) {
    return {
      runIndex,
      status: 'failed',
      startedAt,
      durationMs: performance.now() - startedAtMonotonic,
      cacheCondition: 'Browser cache enabled after an unmeasured priming navigation',
      warmupMs: frameWarmupMs,
      observationMs: frameObservationMs,
      error: serializeError(error),
    };
  }
}

async function measureScenario({ context, scenario, storybookUrl }) {
  const storyUrl = buildStoryUrl(storybookUrl, scenario.storyId);
  const scenarioResult = {
    slug: scenario.slug,
    title: scenario.title,
    storyId: scenario.storyId,
    storyUrl,
    viewport: scenario.viewport,
    deviceScaleFactor: scenario.deviceScaleFactor,
    status: 'passed',
    networkRuns: [],
    frameRuns: [],
    errors: [],
  };
  const page = await context.newPage();

  try {
    for (let runIndex = 1; runIndex <= networkRunCount; runIndex += 1) {
      console.log(`[${scenario.slug}] cold network run ${runIndex}/${networkRunCount}`);
      const run = await collectNetworkRun({ context, page, storyUrl, runIndex });
      scenarioResult.networkRuns.push(run);
      if (run.error) {
        scenarioResult.errors.push({ phase: 'network', runIndex, ...run.error });
      }
    }

    try {
      await setNetworkCacheDisabled(context, page, false);
      await page.goto(storyUrl, {
        waitUntil: 'domcontentloaded',
        timeout: navigationTimeoutMs,
      });
      await waitForScenarioReady(page);
    } catch (error) {
      scenarioResult.errors.push({ phase: 'frame-cache-prime', ...serializeError(error) });
    }

    for (let runIndex = 1; runIndex <= frameRunCount; runIndex += 1) {
      console.log(`[${scenario.slug}] frame run ${runIndex}/${frameRunCount}`);
      const run = await collectFrameRun({ page, runIndex });
      scenarioResult.frameRuns.push(run);
      if (run.error) {
        scenarioResult.errors.push({ phase: 'frame', runIndex, ...run.error });
      }
    }
  } catch (error) {
    scenarioResult.errors.push({ phase: 'scenario', ...serializeError(error) });
  } finally {
    await page.close().catch(() => undefined);
  }

  if (scenarioResult.errors.length > 0) {
    scenarioResult.status = 'failed';
  }
  return scenarioResult;
}

function percentile(values, percentileValue) {
  const sorted = values.filter(Number.isFinite).sort((left, right) => left - right);
  if (sorted.length === 0) return null;
  if (sorted.length === 1) return sorted[0];

  const index = (sorted.length - 1) * percentileValue;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

function median(values) {
  return percentile(values, 0.5);
}

function roundMetric(value, precision = 3) {
  if (!Number.isFinite(value)) return null;
  const multiplier = 10 ** precision;
  return Math.round(value * multiplier) / multiplier;
}

function medianMetric(values, precision) {
  return roundMetric(median(values), precision);
}

function medianRunPercentile(frameRuns, selectValues, percentileValue) {
  return medianMetric(
    frameRuns.map((run) => percentile(selectValues(run.metrics), percentileValue)),
  );
}

function summarizeScenario(scenarioResult) {
  const networkRuns = scenarioResult.networkRuns.filter((run) => run.status === 'passed');
  const frameRuns = scenarioResult.frameRuns.filter((run) => run.status === 'passed');
  const longTaskDurations = (metrics) => metrics.longTasks.entries.map((entry) => entry.duration);

  return {
    status: scenarioResult.status,
    successfulNetworkRuns: networkRuns.length,
    successfulFrameRuns: frameRuns.length,
    network: {
      medianUniqueMediaAssetUrlCount: medianMetric(
        networkRuns.map((run) => run.uniqueMediaAssetUrlCount),
      ),
      medianMediaTransferCount: medianMetric(networkRuns.map((run) => run.mediaTransferCount)),
      medianMediaEncodedDataLength: medianMetric(
        networkRuns.map((run) => run.mediaEncodedDataLength),
        0,
      ),
    },
    rafIntervalMs: {
      p50: medianRunPercentile(frameRuns, (metrics) => metrics.raf.intervalsMs, 0.5),
      p95: medianRunPercentile(frameRuns, (metrics) => metrics.raf.intervalsMs, 0.95),
      p99: medianRunPercentile(frameRuns, (metrics) => metrics.raf.intervalsMs, 0.99),
    },
    longTasks: {
      medianCount: medianMetric(frameRuns.map((run) => run.metrics.longTasks.entries.length)),
      medianTotalDurationMs: medianMetric(
        frameRuns.map((run) =>
          longTaskDurations(run.metrics).reduce((total, duration) => total + duration, 0),
        ),
      ),
      medianMaxDurationMs: medianMetric(
        frameRuns.map((run) => Math.max(0, ...longTaskDurations(run.metrics))),
      ),
    },
    medianPlayingMediaCount: medianMetric(
      frameRuns.map((run) => run.metrics.media.currentPlayingCount),
    ),
    medianUniqueWebGLContextCount: medianMetric(
      frameRuns.map((run) => run.metrics.webgl.uniqueContextCount),
    ),
    requestVideoFrameCallback: {
      medianCallbackCount: medianMetric(
        frameRuns.map((run) => run.metrics.requestVideoFrameCallback.callbacks),
      ),
      latenessMs: {
        p50: medianRunPercentile(
          frameRuns,
          (metrics) => metrics.requestVideoFrameCallback.latenessMs,
          0.5,
        ),
        p95: medianRunPercentile(
          frameRuns,
          (metrics) => metrics.requestVideoFrameCallback.latenessMs,
          0.95,
        ),
        p99: medianRunPercentile(
          frameRuns,
          (metrics) => metrics.requestVideoFrameCallback.latenessMs,
          0.99,
        ),
      },
      processingDurationMs: {
        p50: medianRunPercentile(
          frameRuns,
          (metrics) => metrics.requestVideoFrameCallback.processingDurationMs,
          0.5,
        ),
        p95: medianRunPercentile(
          frameRuns,
          (metrics) => metrics.requestVideoFrameCallback.processingDurationMs,
          0.95,
        ),
        p99: medianRunPercentile(
          frameRuns,
          (metrics) => metrics.requestVideoFrameCallback.processingDurationMs,
          0.99,
        ),
      },
    },
    videoPlaybackQuality: {
      medianTotalVideoFrames: medianMetric(
        frameRuns.map((run) => run.metrics.videoPlaybackQuality.totalVideoFrames),
      ),
      medianDroppedVideoFrames: medianMetric(
        frameRuns.map((run) => run.metrics.videoPlaybackQuality.droppedVideoFrames),
      ),
      medianDroppedFramePercentage: medianMetric(
        frameRuns.map((run) => run.metrics.videoPlaybackQuality.droppedFramePercentage),
      ),
    },
  };
}

async function getCommandOutput(command, args, cwd = repositoryRoot) {
  const { stdout } = await execFile(command, args, { cwd, encoding: 'utf8' });
  return stdout.trim();
}

async function collectEnvironmentMetadata(args) {
  const [gitCommit, gitStatus, macOSProductVersion] = await Promise.all([
    getCommandOutput('git', ['rev-parse', 'HEAD']),
    getCommandOutput('git', ['status', '--porcelain=v1']),
    getCommandOutput('sw_vers', ['-productVersion'], packageRoot),
  ]);

  return {
    capturedAt: new Date().toISOString(),
    git: {
      commit: gitCommit,
      dirty: gitStatus.length > 0,
      status: gitStatus.length > 0 ? gitStatus.split('\n') : [],
    },
    chrome: {
      executable: chromeExecutable,
      version: null,
      product: null,
      protocolVersion: null,
      headless: true,
    },
    macOSProductVersion,
    viewport: defaultViewport,
    deviceScaleFactor: defaultDeviceScaleFactor,
    cacheCondition: {
      networkRuns: 'CDP Network cache disabled and browser cache cleared before every run',
      frameRuns: 'Browser cache enabled after one unmeasured priming navigation',
    },
    timingProtocol: {
      readySelector,
      networkRunsPerScenario: networkRunCount,
      networkObservationAfterReadyMs: networkObservationMs,
      frameRunsPerScenario: frameRunCount,
      frameWarmupMs,
      frameObservationMs,
      fullyReadySelectorWaitedFor: false,
    },
    storybookUrl: args.storybookUrl,
  };
}

async function collectChromeVersion(context) {
  const page = await context.newPage();
  const client = await context.newCDPSession(page);

  try {
    const version = await client.send('Browser.getVersion');
    return {
      version: version.product.replace(/^[^/]+\//, ''),
      product: version.product,
      protocolVersion: version.protocolVersion,
    };
  } finally {
    await client.detach().catch(() => undefined);
    await page.close().catch(() => undefined);
  }
}

function formatNumber(value, digits = 2) {
  return value === null || value === undefined ? 'n/a' : Number(value).toFixed(digits);
}

function formatInteger(value) {
  return value === null || value === undefined ? 'n/a' : Math.round(value).toLocaleString('en-US');
}

function formatBytes(value) {
  return value === null || value === undefined ? 'n/a' : `${(value / 1_048_576).toFixed(2)} MiB`;
}

function escapeMarkdown(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function buildMarkdownBlock(result, label, rawOutputPath) {
  const startMarker = `<!-- razorsense-runtime:${label}:start -->`;
  const endMarker = `<!-- razorsense-runtime:${label}:end -->`;
  const tableRows = result.scenarios.map((scenario) => {
    const summary = scenario.summary;
    const raf = summary.rafIntervalMs;
    const longTasks = summary.longTasks;
    const rvfc = summary.requestVideoFrameCallback;
    const video = summary.videoPlaybackQuality;

    return `| ${escapeMarkdown(scenario.title)} | ${summary.status} | ${formatInteger(
      summary.network.medianUniqueMediaAssetUrlCount,
    )} / ${formatInteger(summary.network.medianMediaTransferCount)} / ${formatBytes(
      summary.network.medianMediaEncodedDataLength,
    )} | ${formatNumber(raf.p50)} / ${formatNumber(raf.p95)} / ${formatNumber(
      raf.p99,
    )} | ${formatInteger(longTasks.medianCount)} / ${formatNumber(
      longTasks.medianTotalDurationMs,
    )} ms | ${formatInteger(summary.medianPlayingMediaCount)} | ${formatInteger(
      summary.medianUniqueWebGLContextCount,
    )} | ${formatInteger(rvfc.medianCallbackCount)} / ${formatNumber(
      rvfc.latenessMs.p95,
    )} ms | ${formatInteger(video.medianTotalVideoFrames)} / ${formatInteger(
      video.medianDroppedVideoFrames,
    )} (${formatNumber(video.medianDroppedFramePercentage)}%) |`;
  });
  const failureLines = result.scenarios
    .filter((scenario) => scenario.errors.length > 0)
    .flatMap((scenario) =>
      scenario.errors.map(
        (error) =>
          `- \`${scenario.slug}\` (${error.phase}${
            error.runIndex ? ` run ${error.runIndex}` : ''
          }): ${escapeMarkdown(error.message)}`,
      ),
    );
  const rawFileName = path.basename(rawOutputPath);

  return [
    startMarker,
    `## ${label} runtime capture`,
    '',
    `Status: **${result.status}**. Captured ${result.metadata.capturedAt} from commit \`${
      result.metadata.git.commit
    }\`${
      result.metadata.git.dirty ? ' with a dirty worktree' : ' with a clean worktree'
    } using Chrome ${result.metadata.chrome.version} on macOS ${
      result.metadata.macOSProductVersion
    }. Raw runs: [\`${rawFileName}\`](./${rawFileName}).`,
    '',
    `Viewport: ${result.metadata.viewport.width}x${result.metadata.viewport.height} at DPR ${result.metadata.deviceScaleFactor}. Each scenario uses three cache-disabled cold network runs, then five cache-enabled frame runs with a 2 s warm-up and 10 s measurement window.`,
    '',
    '| Scenario | Status | Media assets / transfers / bytes | RAF p50 / p95 / p99 (ms) | Long tasks count / total | Playing media | WebGL contexts | rVFC callbacks / p95 late | Video total / dropped |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...tableRows,
    ...(failureLines.length > 0 ? ['', 'Failures:', '', ...failureLines] : []),
    '',
    'Limitations:',
    '',
    '- This is a single-machine, single-Chrome-version baseline. Use it for before/after comparison under the same protocol, not as a cross-device performance target.',
    '- Network assets are unique URLs and transfers are CDP request IDs. Both include only `razorsense-` video MIME responses or `.mp4`/`.webm` URLs observed during the fixed two-second post-ready window; bytes are encoded transfer lengths.',
    '- WebGL context count is a resource gauge and includes unique contexts acquired before the ten-second frame window; raw runs also report contexts acquired during the window.',
    '- Video frame counters are ten-second deltas from `getVideoPlaybackQuality` (with WebKit counters as a fallback). Long-task and rVFC fields depend on browser support.',
    '- The collector waits only for `data-scenario-ready="true"`; it intentionally never blocks on `data-scenario-fully-ready` so optimized offscreen instances may remain deferred.',
    endMarker,
  ].join('\n');
}

async function atomicWrite(targetPath, contents) {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  const temporaryPath = path.join(
    path.dirname(targetPath),
    `.${path.basename(targetPath)}.${process.pid}.${Date.now()}.tmp`,
  );

  try {
    await fs.writeFile(temporaryPath, contents, 'utf8');
    await fs.rename(temporaryPath, targetPath);
  } catch (error) {
    await fs.rm(temporaryPath, { force: true }).catch(() => undefined);
    throw error;
  }
}

async function writeResults({ args, result }) {
  const markdownBlock = buildMarkdownBlock(result, args.label, args.rawOutputPath);
  const startMarker = `<!-- razorsense-runtime:${args.label}:start -->`;
  const endMarker = `<!-- razorsense-runtime:${args.label}:end -->`;
  let existingMarkdown;

  try {
    existingMarkdown = await fs.readFile(args.outputPath, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    existingMarkdown = '# RazorSense performance baseline\n';
  }

  const startIndex = existingMarkdown.indexOf(startMarker);
  const endIndex = existingMarkdown.indexOf(endMarker);
  if ((startIndex === -1) !== (endIndex === -1) || endIndex < startIndex) {
    throw new Error(`Mismatched RazorSense runtime markers for label "${args.label}"`);
  }

  const nextMarkdown =
    startIndex === -1
      ? `${existingMarkdown.trimEnd()}\n\n${markdownBlock}\n`
      : `${existingMarkdown.slice(0, startIndex)}${markdownBlock}${existingMarkdown.slice(
          endIndex + endMarker.length,
        )}`;

  await atomicWrite(args.rawOutputPath, `${JSON.stringify(result, null, 2)}\n`);
  await atomicWrite(args.outputPath, nextMarkdown);
}

async function run(args) {
  const result = {
    schemaVersion: 1,
    label: args.label,
    status: 'passed',
    metadata: await collectEnvironmentMetadata(args),
    scenarios: [],
    errors: [],
  };
  const profilePath = await fs.mkdtemp(path.join(os.tmpdir(), 'razorsense-runtime-'));
  let context;

  try {
    context = await chromium.launchPersistentContext(profilePath, {
      executablePath: chromeExecutable,
      headless: true,
      viewport: defaultViewport,
      deviceScaleFactor: defaultDeviceScaleFactor,
    });
    result.metadata.chrome = {
      ...result.metadata.chrome,
      ...(await collectChromeVersion(context)),
    };
    await context.addInitScript(installRazorSenseMetrics);

    for (const scenario of scenarios) {
      console.log(`Measuring ${scenario.title}`);
      try {
        const scenarioResult = await measureScenario({
          context,
          scenario,
          storybookUrl: args.storybookUrl,
        });
        result.scenarios.push(scenarioResult);
      } catch (error) {
        result.scenarios.push({
          ...scenario,
          storyUrl: buildStoryUrl(args.storybookUrl, scenario.storyId),
          status: 'failed',
          networkRuns: [],
          frameRuns: [],
          errors: [{ phase: 'scenario-setup', ...serializeError(error) }],
        });
      }
    }
  } catch (error) {
    result.errors.push({ phase: 'collector', ...serializeError(error) });
    const measuredSlugs = new Set(result.scenarios.map((scenario) => scenario.slug));
    scenarios
      .filter((scenario) => !measuredSlugs.has(scenario.slug))
      .forEach((scenario) => {
        result.scenarios.push({
          ...scenario,
          storyUrl: buildStoryUrl(args.storybookUrl, scenario.storyId),
          status: 'failed',
          networkRuns: [],
          frameRuns: [],
          errors: [{ phase: 'collector', ...serializeError(error) }],
        });
      });
  } finally {
    await context?.close().catch(() => undefined);
    await fs.rm(profilePath, { recursive: true, force: true }).catch(() => undefined);
  }

  result.scenarios.forEach((scenario) => {
    scenario.summary = summarizeScenario(scenario);
  });
  if (
    result.errors.length > 0 ||
    result.scenarios.some((scenario) => scenario.status === 'failed')
  ) {
    result.status = 'failed';
  }

  await writeResults({ args, result });
  return result;
}

let args;
try {
  args = parseArguments(process.argv.slice(2));
} catch (error) {
  console.error(`RazorSense runtime collector: ${error.message}`);
  process.exitCode = 1;
}

if (args) {
  try {
    const result = await run(args);
    console.log(`RazorSense runtime collector finished with status: ${result.status}`);
    if (result.status !== 'passed') {
      process.exitCode = 1;
    }
  } catch (error) {
    console.error('RazorSense runtime collector failed before it could write the report.');
    console.error(error);
    process.exitCode = 1;
  }
}
