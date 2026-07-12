import { execFile as execFileCallback } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import prettier from 'prettier';

const execFile = promisify(execFileCallback);
const collectorPath = fileURLToPath(import.meta.url);
const packageRoot = path.resolve(path.dirname(collectorPath), '..');
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
    title: 'Legacy provider appearance changes',
  },
  {
    slug: 'public-rapid-state-replacement',
    storyId: 'components-razorsense--rapid-state-replacement',
    title: 'Public state rapid replacement',
    readySelector: '[data-razor-sense-presentation-host="true"]',
    interaction: {
      buttonText: 'Issue 8 replacements',
      intervalMs: 1_200,
    },
  },
  {
    slug: 'public-provider-appearance-changes',
    storyId: 'components-razorsense--light-to-dark-transition',
    title: 'Public state provider appearance changes',
    readySelector: '[data-razor-sense-presentation-host="true"]',
    interaction: {
      buttonTextIncludes: 'Switch to',
      intervalMs: 1_000,
    },
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
const allowedFlags = new Set([...requiredFlags, '--headed']);

function parseArguments(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index];
    const value = argv[index + 1];

    if (!allowedFlags.has(flag)) {
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
  const rawOutputPrefix = path.join(outputParts.dir, `${outputParts.name}.${label}`);
  const headedValue = parsed['--headed'] ?? 'false';
  if (!['true', 'false'].includes(headedValue)) {
    throw new Error('--headed must be either true or false');
  }

  return {
    storybookUrl: storybookUrl.toString().replace(/\/$/, ''),
    outputPath,
    rawOutputPrefix,
    label,
    headed: headedValue === 'true',
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
  const knownMediaElements = new WeakSet();
  const knownWebGLContexts = new WeakSet();
  let knownMediaElementRefs = [];
  let knownWebGLContextRefs = [];
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
    rafCallbackCadenceMs: [],
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

  const hasRetainedSource = (element) =>
    Boolean(element?.currentSrc || element?.getAttribute?.('src'));

  const trackMediaElement = (element) => {
    if (knownMediaElements.has(element)) return;
    knownMediaElements.add(element);
    knownMediaElementRefs.push(new WeakRef(element));
  };

  const listKnownMediaElements = () => {
    const elements = [];
    knownMediaElementRefs = knownMediaElementRefs.filter((reference) => {
      const element = reference.deref();
      if (element) elements.push(element);
      return Boolean(element);
    });
    return elements;
  };

  const listMediaElements = () => {
    const elements = new Set(listKnownMediaElements());
    document.querySelectorAll('audio, video').forEach((element) => {
      trackMediaElement(element);
      elements.add(element);
    });
    return [...elements].filter((element) => element?.isConnected || hasRetainedSource(element));
  };

  const describeMediaElement = (element) => ({
    tagName: element.tagName.toLowerCase(),
    currentSrc: element.currentSrc || element.src || '',
    paused: element.paused,
    ended: element.ended,
    readyState: element.readyState,
    isConnected: element.isConnected,
    retainsSource: hasRetainedSource(element),
  });

  const captureVideoQualityBaseline = () => {
    videoQualityBaseline = new WeakMap();
    listMediaElements()
      .filter((element) => element.tagName === 'VIDEO')
      .forEach((video) => {
        videoQualityBaseline.set(video, getVideoQuality(video));
      });
  };

  const isCurrentWebGLContext = (context) => {
    try {
      return Boolean(context.canvas?.isConnected) && !context.isContextLost();
    } catch {
      return false;
    }
  };

  const listKnownWebGLContexts = () => {
    const contexts = [];
    knownWebGLContextRefs = knownWebGLContextRefs.filter((reference) => {
      const context = reference.deref();
      if (context) contexts.push(context);
      return Boolean(context);
    });
    return contexts;
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
          sample.rafCallbackCadenceMs.push(timestamp - lastAnimationFrameTimestamp);
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
      trackMediaElement(this);
      sample.mediaPlayCalls += 1;
      return returnValue;
    };
  }

  if (originalMediaPause) {
    window.HTMLMediaElement.prototype.pause = function (...args) {
      const returnValue = Reflect.apply(originalMediaPause, this, args);
      trackMediaElement(this);
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
        knownWebGLContextRefs.push(new WeakRef(context));
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
    const webGLContexts = listKnownWebGLContexts();
    const currentPlayingElements = mediaElements.filter(
      (element) => !element.paused && !element.ended,
    );
    const videos = mediaElements
      .filter((element) => element.tagName === 'VIDEO')
      .map((video) => {
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
        callbackCadenceMs: [...sample.rafCallbackCadenceMs],
      },
      media: {
        playCalls: sample.mediaPlayCalls,
        pauseCalls: sample.mediaPauseCalls,
        elementCount: mediaElements.length,
        connectedElementCount: mediaElements.filter((element) => element.isConnected).length,
        offDOMRetainedSourceCount: mediaElements.filter(
          (element) => !element.isConnected && hasRetainedSource(element),
        ).length,
        currentPlayingCount: currentPlayingElements.length,
        currentPlayingElements: currentPlayingElements.map(describeMediaElement),
      },
      webgl: {
        uniqueContextCount: knownWebGLContextCount,
        currentContextCount: webGLContexts.filter(isCurrentWebGLContext).length,
        inactiveOrCollectedContextCount:
          knownWebGLContextCount - webGLContexts.filter(isCurrentWebGLContext).length,
        detachedOrLostLiveContextCount: webGLContexts.filter(
          (context) => !isCurrentWebGLContext(context),
        ).length,
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

async function waitForScenarioReady(page, scenario) {
  await page
    .locator(scenario.readySelector ?? readySelector)
    .waitFor({ state: 'attached', timeout: navigationTimeoutMs });
}

async function clickScenarioButton(page, interaction) {
  const button = interaction.buttonText
    ? page.getByRole('button', { name: interaction.buttonText, exact: true })
    : page.getByRole('button', { name: new RegExp(interaction.buttonTextIncludes, 'i') });
  await button.click({ timeout: navigationTimeoutMs });
}

async function startScenarioInteraction(page, scenario) {
  if (!scenario.interaction) return;

  await clickScenarioButton(page, scenario.interaction);
  await page.evaluate((interaction) => {
    const findButton = () =>
      [...document.querySelectorAll('button')].find((button) => {
        const label = button.textContent?.trim() ?? '';
        return interaction.buttonText
          ? label === interaction.buttonText
          : label.includes(interaction.buttonTextIncludes);
      });

    window.__razorSenseCollectorInteraction = window.setInterval(() => {
      findButton()?.click();
    }, interaction.intervalMs);
  }, scenario.interaction);
}

async function stopScenarioInteraction(page) {
  await page.evaluate(() => {
    window.clearInterval(window.__razorSenseCollectorInteraction);
    delete window.__razorSenseCollectorInteraction;
  });
}

function toResponsesByRequestId(requests) {
  return Object.fromEntries(
    [...requests.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([requestId, request]) => [requestId, { ...request }]),
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

function isRazorSenseRepresentativeStillTransfer(request) {
  let pathname = '';
  try {
    pathname = new URL(request.url).pathname;
  } catch {
    pathname = request.url;
  }

  const isImageMimeType = /^image\//i.test(request.mimeType);
  const isImageFile = /\.(avif|jpe?g|png|svg|webp)$/i.test(pathname);
  return pathname.includes('/razorsense-stills/') && (isImageMimeType || isImageFile);
}

function classifyMediaTransfers(transfers) {
  const classification = {
    completed: 0,
    canceled: 0,
    failed: 0,
    other: 0,
  };

  transfers.forEach((transfer) => {
    // These categories are disjoint. Canceled takes precedence over failed,
    // failed over completed, and anything still in flight is other.
    if (transfer.canceled) {
      classification.canceled += 1;
    } else if (transfer.failed) {
      classification.failed += 1;
    } else if (transfer.completed) {
      classification.completed += 1;
    } else {
      classification.other += 1;
    }
  });

  return classification;
}

function sumTransferClassification(classification) {
  return (
    classification.completed +
    classification.canceled +
    classification.failed +
    classification.other
  );
}

function summarizeTransfers(transfersByRequestId) {
  const transfers = Object.values(transfersByRequestId);
  return {
    uniqueAssetUrlCount: new Set(transfers.map((request) => request.url)).size,
    transferCount: transfers.length,
    observedEncodedBytes: transfers.reduce(
      (total, request) => total + (Number(request.encodedDataLength) || 0),
      0,
    ),
    transferClassification: classifyMediaTransfers(transfers),
  };
}

async function collectNetworkRun({ context, page, scenario, storyUrl, runIndex }) {
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
    await waitForScenarioReady(page, scenario);
    if (scenario.interaction) {
      await clickScenarioButton(page, scenario.interaction);
    }
    await page.waitForTimeout(networkObservationMs);
  } catch (runError) {
    error = serializeError(runError);
  }

  try {
    await client.send('Network.disable');
  } catch (disableError) {
    if (!error) {
      error = serializeError(disableError);
    }
  }
  try {
    await client.detach();
  } catch {
    // The target may already be gone after a navigation failure.
  }

  const immutableRequestSnapshot = new Map(
    [...requests.entries()].map(([requestId, request]) => [
      requestId,
      Object.freeze({ ...request }),
    ]),
  );
  const razorSenseMediaTransfersByRequestId = Object.fromEntries(
    Object.entries(toResponsesByRequestId(immutableRequestSnapshot)).filter(([, request]) =>
      isRazorSenseMediaTransfer(request),
    ),
  );
  const razorSenseRepresentativeStillTransfersByRequestId = Object.fromEntries(
    Object.entries(toResponsesByRequestId(immutableRequestSnapshot)).filter(([, request]) =>
      isRazorSenseRepresentativeStillTransfer(request),
    ),
  );
  const mediaSummary = summarizeTransfers(razorSenseMediaTransfersByRequestId);
  const representativeStillSummary = summarizeTransfers(
    razorSenseRepresentativeStillTransfersByRequestId,
  );

  return {
    runIndex,
    status: error ? 'failed' : 'passed',
    startedAt,
    durationMs: performance.now() - startedAtMonotonic,
    cacheCondition: 'CDP Network cache disabled and browser cache cleared',
    observationAfterReadyMs: networkObservationMs,
    uniqueMediaAssetUrlCount: mediaSummary.uniqueAssetUrlCount,
    mediaTransferCount: mediaSummary.transferCount,
    observedMediaEncodedBytes: mediaSummary.observedEncodedBytes,
    mediaTransferClassification: mediaSummary.transferClassification,
    uniqueRepresentativeStillAssetUrlCount: representativeStillSummary.uniqueAssetUrlCount,
    representativeStillTransferCount: representativeStillSummary.transferCount,
    observedRepresentativeStillEncodedBytes: representativeStillSummary.observedEncodedBytes,
    representativeStillTransferClassification: representativeStillSummary.transferClassification,
    razorSenseMediaTransfersByRequestId,
    razorSenseRepresentativeStillTransfersByRequestId,
    ...(error ? { error } : {}),
  };
}

function assertSuccessfulNetworkRunsConsistent(result) {
  const inconsistencies = [];
  let checkedRuns = 0;

  result.scenarios.forEach((scenario) => {
    scenario.networkRuns
      .filter((run) => run.status === 'passed')
      .forEach((run) => {
        checkedRuns += 1;
        const transfers = Object.values(run.razorSenseMediaTransfersByRequestId ?? {});
        const representativeStillTransfers = Object.values(
          run.razorSenseRepresentativeStillTransfersByRequestId ?? {},
        );
        const observedMediaEncodedBytes = transfers.reduce(
          (total, transfer) => total + (Number(transfer.encodedDataLength) || 0),
          0,
        );
        const mediaTransferCount = transfers.length;
        const uniqueMediaAssetUrlCount = new Set(transfers.map((transfer) => transfer.url)).size;
        const mediaTransferClassification = classifyMediaTransfers(transfers);
        const classifiedMediaTransferCount = sumTransferClassification(mediaTransferClassification);
        const storedClassification = run.mediaTransferClassification ?? {};
        const classificationMatches = ['completed', 'canceled', 'failed', 'other'].every(
          (key) => storedClassification[key] === mediaTransferClassification[key],
        );
        const representativeStillSummary = summarizeTransfers(
          run.razorSenseRepresentativeStillTransfersByRequestId ?? {},
        );
        const representativeStillClassificationMatches = [
          'completed',
          'canceled',
          'failed',
          'other',
        ].every(
          (key) =>
            run.representativeStillTransferClassification?.[key] ===
            representativeStillSummary.transferClassification[key],
        );
        const classifiedRepresentativeStillTransferCount = sumTransferClassification(
          representativeStillSummary.transferClassification,
        );

        if (
          run.observedMediaEncodedBytes !== observedMediaEncodedBytes ||
          run.mediaTransferCount !== mediaTransferCount ||
          run.uniqueMediaAssetUrlCount !== uniqueMediaAssetUrlCount ||
          !classificationMatches ||
          classifiedMediaTransferCount !== mediaTransferCount ||
          run.observedRepresentativeStillEncodedBytes !==
            representativeStillSummary.observedEncodedBytes ||
          run.representativeStillTransferCount !== representativeStillSummary.transferCount ||
          run.uniqueRepresentativeStillAssetUrlCount !==
            representativeStillSummary.uniqueAssetUrlCount ||
          !representativeStillClassificationMatches ||
          classifiedRepresentativeStillTransferCount !== representativeStillTransfers.length
        ) {
          inconsistencies.push({
            scenario: scenario.slug,
            runIndex: run.runIndex,
            stored: {
              observedMediaEncodedBytes: run.observedMediaEncodedBytes,
              mediaTransferCount: run.mediaTransferCount,
              uniqueMediaAssetUrlCount: run.uniqueMediaAssetUrlCount,
              mediaTransferClassification: run.mediaTransferClassification,
              observedRepresentativeStillEncodedBytes: run.observedRepresentativeStillEncodedBytes,
              representativeStillTransferCount: run.representativeStillTransferCount,
              uniqueRepresentativeStillAssetUrlCount: run.uniqueRepresentativeStillAssetUrlCount,
              representativeStillTransferClassification:
                run.representativeStillTransferClassification,
            },
            derived: {
              observedMediaEncodedBytes,
              mediaTransferCount,
              uniqueMediaAssetUrlCount,
              mediaTransferClassification,
              classifiedMediaTransferCount,
              representativeStillSummary,
              classifiedRepresentativeStillTransferCount,
            },
          });
        }
      });
  });

  if (inconsistencies.length > 0) {
    const error = new Error(
      `${inconsistencies.length} successful network run(s) failed internal consistency checks`,
    );
    error.inconsistencies = inconsistencies;
    throw error;
  }

  return { checkedRuns };
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

async function collectFrameRun({ page, scenario, runIndex }) {
  const startedAt = new Date().toISOString();
  const startedAtMonotonic = performance.now();

  try {
    await page.reload({ waitUntil: 'domcontentloaded', timeout: navigationTimeoutMs });
    await waitForScenarioReady(page, scenario);
    await page.waitForTimeout(frameWarmupMs);
    await page.evaluate(() => {
      if (!window.__razorSenseMetrics) {
        throw new Error('RazorSense runtime instrumentation was not installed');
      }
      window.__razorSenseMetrics.reset();
    });
    await startScenarioInteraction(page, scenario);
    await page.waitForTimeout(frameObservationMs);
    await stopScenarioInteraction(page);
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
    await stopScenarioInteraction(page).catch(() => undefined);
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
      const run = await collectNetworkRun({ context, page, scenario, storyUrl, runIndex });
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
      await waitForScenarioReady(page, scenario);
    } catch (error) {
      scenarioResult.errors.push({ phase: 'frame-cache-prime', ...serializeError(error) });
    }

    for (let runIndex = 1; runIndex <= frameRunCount; runIndex += 1) {
      console.log(`[${scenario.slug}] frame run ${runIndex}/${frameRunCount}`);
      const run = await collectFrameRun({ page, scenario, runIndex });
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
      medianObservedMediaEncodedBytes: medianMetric(
        networkRuns.map((run) => run.observedMediaEncodedBytes),
        0,
      ),
      medianCompletedMediaTransferCount: medianMetric(
        networkRuns.map((run) => run.mediaTransferClassification.completed),
      ),
      medianCanceledMediaTransferCount: medianMetric(
        networkRuns.map((run) => run.mediaTransferClassification.canceled),
      ),
      medianFailedMediaTransferCount: medianMetric(
        networkRuns.map((run) => run.mediaTransferClassification.failed),
      ),
      medianOtherMediaTransferCount: medianMetric(
        networkRuns.map((run) => run.mediaTransferClassification.other),
      ),
      medianUniqueRepresentativeStillAssetUrlCount: medianMetric(
        networkRuns.map((run) => run.uniqueRepresentativeStillAssetUrlCount),
      ),
      medianRepresentativeStillTransferCount: medianMetric(
        networkRuns.map((run) => run.representativeStillTransferCount),
      ),
      medianObservedRepresentativeStillEncodedBytes: medianMetric(
        networkRuns.map((run) => run.observedRepresentativeStillEncodedBytes),
        0,
      ),
      medianCompletedRepresentativeStillTransferCount: medianMetric(
        networkRuns.map((run) => run.representativeStillTransferClassification.completed),
      ),
      medianCanceledRepresentativeStillTransferCount: medianMetric(
        networkRuns.map((run) => run.representativeStillTransferClassification.canceled),
      ),
      medianFailedRepresentativeStillTransferCount: medianMetric(
        networkRuns.map((run) => run.representativeStillTransferClassification.failed),
      ),
      medianOtherRepresentativeStillTransferCount: medianMetric(
        networkRuns.map((run) => run.representativeStillTransferClassification.other),
      ),
    },
    rafCallbackCadenceMs: {
      p50: medianRunPercentile(frameRuns, (metrics) => metrics.raf.callbackCadenceMs, 0.5),
      p95: medianRunPercentile(frameRuns, (metrics) => metrics.raf.callbackCadenceMs, 0.95),
      p99: medianRunPercentile(frameRuns, (metrics) => metrics.raf.callbackCadenceMs, 0.99),
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
    medianTrackedMediaCount: medianMetric(frameRuns.map((run) => run.metrics.media.elementCount)),
    medianOffDOMRetainedSourceCount: medianMetric(
      frameRuns.map((run) => run.metrics.media.offDOMRetainedSourceCount),
    ),
    medianCurrentWebGLContextCount: medianMetric(
      frameRuns.map((run) => run.metrics.webgl.currentContextCount),
    ),
    medianLifetimeWebGLContextCount: medianMetric(
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
  const [gitCommit, gitStatus, macOSProductVersion, collectorContents] = await Promise.all([
    getCommandOutput('git', ['rev-parse', 'HEAD']),
    getCommandOutput('git', ['status', '--porcelain=v1']),
    getCommandOutput('sw_vers', ['-productVersion'], packageRoot),
    fs.readFile(collectorPath),
  ]);
  const collectorSha256 = createHash('sha256').update(collectorContents).digest('hex');

  return {
    capturedAt: new Date().toISOString(),
    git: {
      commit: gitCommit,
      dirty: gitStatus.length > 0,
      status: gitStatus.length > 0 ? gitStatus.split('\n') : [],
    },
    collector: {
      file: 'scripts/measureRazorSenseRuntime.mjs',
      sha256: collectorSha256,
    },
    chrome: {
      executable: chromeExecutable,
      version: null,
      product: null,
      protocolVersion: null,
      headless: !args.headed,
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
    const cadence = summary.rafCallbackCadenceMs;
    const longTasks = summary.longTasks;
    const rvfc = summary.requestVideoFrameCallback;
    const video = summary.videoPlaybackQuality;

    return `| ${escapeMarkdown(scenario.title)} | ${summary.status} | ${formatInteger(
      summary.network.medianUniqueMediaAssetUrlCount,
    )} / ${formatInteger(summary.network.medianMediaTransferCount)} / ${formatBytes(
      summary.network.medianObservedMediaEncodedBytes,
    )} | ${formatInteger(
      summary.network.medianUniqueRepresentativeStillAssetUrlCount,
    )} / ${formatInteger(summary.network.medianRepresentativeStillTransferCount)} / ${formatBytes(
      summary.network.medianObservedRepresentativeStillEncodedBytes,
    )} | ${formatInteger(summary.network.medianCompletedMediaTransferCount)} / ${formatInteger(
      summary.network.medianCanceledMediaTransferCount,
    )} / ${formatInteger(summary.network.medianFailedMediaTransferCount)} / ${formatInteger(
      summary.network.medianOtherMediaTransferCount,
    )} | ${formatInteger(
      summary.network.medianCompletedRepresentativeStillTransferCount,
    )} / ${formatInteger(
      summary.network.medianCanceledRepresentativeStillTransferCount,
    )} / ${formatInteger(
      summary.network.medianFailedRepresentativeStillTransferCount,
    )} / ${formatInteger(
      summary.network.medianOtherRepresentativeStillTransferCount,
    )} | ${formatNumber(cadence.p50)} / ${formatNumber(cadence.p95)} / ${formatNumber(
      cadence.p99,
    )} | ${formatInteger(longTasks.medianCount)} / ${formatNumber(
      longTasks.medianTotalDurationMs,
    )} ms | ${formatInteger(summary.medianTrackedMediaCount)} / ${formatInteger(
      summary.medianPlayingMediaCount,
    )} / ${formatInteger(summary.medianOffDOMRetainedSourceCount)} | ${formatInteger(
      summary.medianCurrentWebGLContextCount,
    )} / ${formatInteger(summary.medianLifetimeWebGLContextCount)} | ${formatInteger(
      rvfc.medianCallbackCount,
    )} / ${formatNumber(rvfc.latenessMs.p95)} ms | ${formatInteger(
      video.medianTotalVideoFrames,
    )} / ${formatInteger(video.medianDroppedVideoFrames)} (${formatNumber(
      video.medianDroppedFramePercentage,
    )}%) |`;
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
    }\`${result.metadata.git.dirty ? ' with a dirty worktree' : ' with a clean worktree'} using ${
      result.metadata.chrome.headless ? 'headless' : 'headed'
    } Chrome ${result.metadata.chrome.version} on macOS ${
      result.metadata.macOSProductVersion
    }. Raw runs: [\`${rawFileName}\`](./${rawFileName}).`,
    '',
    `Collector SHA-256: \`${result.metadata.collector.sha256}\`.`,
    '',
    `Viewport: ${result.metadata.viewport.width}x${result.metadata.viewport.height} at DPR ${result.metadata.deviceScaleFactor}. Each scenario uses three cache-disabled cold network runs, then five cache-enabled frame runs with a 2 s warm-up and 10 s measurement window.`,
    '',
    '| Scenario | Collector status | Video assets / transfers / observed bytes | Representative still assets / transfers / observed bytes | Video transfer states completed / canceled / failed / other | Still transfer states completed / canceled / failed / other | RAF callback cadence p50 / p95 / p99 (ms) | Long tasks count / total | Tracked / playing / off-DOM sourced media | Current / lifetime WebGL contexts | rVFC callbacks / p95 late | Video total / dropped |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
    ...tableRows,
    ...(failureLines.length > 0 ? ['', 'Failures:', '', ...failureLines] : []),
    '',
    'Limitations:',
    '',
    '- This is a single-machine, single-Chrome-version baseline. Use it for before/after comparison under the same protocol, not as a cross-device performance target.',
    '- A passed collector scenario means navigation, readiness, and measurement completed; it does not mean every media transfer completed.',
    '- Video assets are unique URLs and transfers are CDP request IDs. They include only `razorsense-` video MIME responses or `.mp4`/`.webm` URLs observed during the fixed two-second post-ready window.',
    '- Representative-still assets are counted independently. They include image responses under `/razorsense-stills/`; shared shader gradient maps and unrelated Storybook images are excluded.',
    '- Observed bytes sum the immutable CDP `encodedDataLength` snapshot and include partial canceled, failed, or still-in-flight range transfers.',
    '- Transfer states are disjoint with precedence canceled, failed, completed, then other. The failed count therefore excludes canceled transfers, and other means still in flight or otherwise unclassified at snapshot time.',
    '- RAF callback cadence measures time between observed wrapped RAF callback timestamps. It includes intentional idle gaps and is not browser frame-render time.',
    '- Current WebGL contexts are connected to the document and not context-lost at the end of the ten-second frame window. Lifetime contexts are unique allocations observed since page navigation; raw runs also report detached/lost contexts and allocations during the window.',
    '- Tracked media includes connected elements plus detached elements that still retain a source. The off-DOM sourced count makes decoder/resource retention outside the DOM visible instead of silently dropping it from the gauge.',
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

async function atomicWriteImmutable(targetPath, contents) {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  const temporaryPath = path.join(
    path.dirname(targetPath),
    `.${path.basename(targetPath)}.${process.pid}.${Date.now()}.tmp`,
  );

  try {
    await fs.writeFile(temporaryPath, contents, 'utf8');
    try {
      // A hard link publishes the fully written inode atomically and never
      // overwrites an existing content-addressed artifact.
      await fs.link(temporaryPath, targetPath);
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      const existingContents = await fs.readFile(targetPath, 'utf8');
      if (existingContents !== contents) {
        throw new Error(`Content-address collision at ${targetPath}`);
      }
    }
  } finally {
    await fs.rm(temporaryPath, { force: true }).catch(() => undefined);
  }
}

async function writeResults({ args, result }) {
  const prettierConfig = (await prettier.resolveConfig(args.outputPath)) ?? {};
  const rawContents = prettier.format(JSON.stringify(result), {
    ...prettierConfig,
    parser: 'json',
  });
  const rawSha256 = createHash('sha256').update(rawContents).digest('hex');
  const rawOutputPath = `${args.rawOutputPrefix}.${rawSha256.slice(0, 12)}.json`;
  const markdownBlock = prettier
    .format(buildMarkdownBlock(result, args.label, rawOutputPath), {
      ...prettierConfig,
      parser: 'markdown',
    })
    .trimEnd();
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

  // Publish the immutable raw artifact first. Markdown is the mutable pointer
  // and updates last, so an interrupted write leaves the prior pair valid.
  await atomicWriteImmutable(rawOutputPath, rawContents);
  await atomicWrite(args.outputPath, nextMarkdown);
  return { rawOutputPath, rawSha256 };
}

async function run(args) {
  const result = {
    schemaVersion: 2,
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
      headless: !args.headed,
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

  try {
    result.networkConsistency = {
      status: 'passed',
      ...assertSuccessfulNetworkRunsConsistent(result),
    };
  } catch (error) {
    const inconsistencies = error.inconsistencies ?? [];
    result.networkConsistency = {
      status: 'failed',
      checkedRuns: result.scenarios.reduce(
        (total, scenario) =>
          total + scenario.networkRuns.filter((run) => run.status === 'passed').length,
        0,
      ),
      inconsistencies,
    };
    result.errors.push({
      phase: 'network-consistency',
      ...serializeError(error),
      inconsistencies,
    });

    inconsistencies.forEach((inconsistency) => {
      const scenario = result.scenarios.find(
        (candidate) => candidate.slug === inconsistency.scenario,
      );
      const run = scenario?.networkRuns.find(
        (candidate) => candidate.runIndex === inconsistency.runIndex,
      );
      const runError = {
        name: 'Error',
        message: 'Stored RazorSense media aggregates do not match the immutable transfer snapshot',
      };

      if (run) {
        run.status = 'failed';
        run.error = runError;
      }
      if (scenario) {
        scenario.status = 'failed';
        scenario.errors.push({
          phase: 'network-consistency',
          runIndex: inconsistency.runIndex,
          ...runError,
        });
      }
    });
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

  const outputs = await writeResults({ args, result });
  console.log(
    `Raw artifact: ${path.basename(outputs.rawOutputPath)} (sha256 ${outputs.rawSha256})`,
  );
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
