import type { RazorSenseEmotionalMode, RazorSenseMode, RazorSenseOperationalMode } from './modes';
import type { ColorSchemeNames } from '~tokens/theme';

type RazorSenseViewport = 'desktop' | 'mobile';

type RazorSenseVideoSource = {
  file: string;
  type: 'video/mp4';
  codec: string;
  width: number;
  height: number;
  bitrate: number;
  framerate: number;
};

type RazorSenseAsset = {
  sources: readonly [RazorSenseVideoSource, ...RazorSenseVideoSource[]];
  fallbackSource: RazorSenseVideoSource;
  representativeFrameFile: string;
  representativePhase: number;
};

type RazorSenseAssetRequest = {
  assetsPath: string;
  mode: RazorSenseMode;
  colorScheme: ColorSchemeNames;
  viewport: RazorSenseViewport;
};

const createVideoSource = (
  file: string,
  codec: string,
  width: number,
  height: number,
  framerate: number,
  bitrate: number,
): RazorSenseVideoSource => ({
  file,
  type: 'video/mp4',
  codec,
  width,
  height,
  bitrate,
  framerate,
});

const OPERATIONAL_SOURCES: Record<
  ColorSchemeNames,
  Record<RazorSenseOperationalMode, RazorSenseVideoSource>
> = {
  light: {
    neutral: createVideoSource(
      'razorsense-states/razorsense-neutral.mp4',
      'avc1.640032',
      1920,
      1280,
      24,
      10660661,
    ),
    typing: createVideoSource(
      'razorsense-states/razorsense-typing.mp4',
      'avc1.4D4029',
      1920,
      1080,
      25,
      1905380,
    ),
    thinking: createVideoSource(
      'razorsense-states/razorsense-thinking.mp4',
      'avc1.640032',
      1920,
      1280,
      24,
      11052569,
    ),
    loading: createVideoSource(
      'razorsense-states/razorsense-loading.mp4',
      'avc1.640032',
      1920,
      1280,
      24,
      3280996,
    ),
  },
  dark: {
    neutral: createVideoSource(
      'razorsense-states/razorsense-neutral-dark.mp4',
      'avc1.640032',
      1920,
      1280,
      24,
      2093927,
    ),
    typing: createVideoSource(
      'razorsense-states/razorsense-typing-dark.mp4',
      'avc1.640028',
      1920,
      1080,
      25,
      585649,
    ),
    thinking: createVideoSource(
      'razorsense-states/razorsense-thinking-dark.mp4',
      'avc1.640032',
      1920,
      1280,
      24,
      4492532,
    ),
    loading: createVideoSource(
      'razorsense-states/razorsense-loading-dark.mp4',
      'avc1.640032',
      1920,
      1280,
      24,
      123446,
    ),
  },
};

const DESKTOP_EMOTIONAL_SOURCES: Record<RazorSenseEmotionalMode, RazorSenseVideoSource> = {
  calm: createVideoSource(
    'razorsense-modes/razorsense-calm.mp4',
    'avc1.4D4020',
    1364,
    440,
    24,
    870025,
  ),
  joyful: createVideoSource(
    'razorsense-modes/razorsense-joyful.mp4',
    'avc1.4D4020',
    1364,
    440,
    30,
    1719441,
  ),
  caution: createVideoSource(
    'razorsense-modes/razorsense-caution.mp4',
    'avc1.4D4020',
    1364,
    440,
    30,
    6352596,
  ),
  regret: createVideoSource(
    'razorsense-modes/razorsense-regret.mp4',
    'avc1.4D4020',
    1364,
    440,
    30,
    1413669,
  ),
};

const MOBILE_EMOTIONAL_SOURCES: Record<
  ColorSchemeNames,
  Record<RazorSenseEmotionalMode, RazorSenseVideoSource>
> = {
  light: {
    calm: createVideoSource(
      'razorsense-modes/razorsense-calm-mobile.mp4',
      'avc1.4D4028',
      360,
      484,
      24,
      175513,
    ),
    joyful: createVideoSource(
      'razorsense-modes/razorsense-joyful-mobile.mp4',
      'avc1.4D4028',
      360,
      484,
      24,
      217663,
    ),
    caution: createVideoSource(
      'razorsense-modes/razorsense-caution-mobile.mp4',
      'avc1.4D4028',
      360,
      484,
      24,
      162291,
    ),
    regret: createVideoSource(
      'razorsense-modes/razorsense-regret-mobile.mp4',
      'avc1.4D4028',
      360,
      484,
      24,
      212710,
    ),
  },
  dark: {
    calm: createVideoSource(
      'razorsense-modes/razorsense-calm-mobile-dark.mp4',
      'avc1.640015',
      360,
      484,
      24,
      443919,
    ),
    joyful: createVideoSource(
      'razorsense-modes/razorsense-joyful-mobile-dark.mp4',
      'avc1.640015',
      360,
      484,
      24,
      406636,
    ),
    caution: createVideoSource(
      'razorsense-modes/razorsense-caution-mobile-dark.mp4',
      'avc1.640015',
      360,
      484,
      24,
      380019,
    ),
    regret: createVideoSource(
      'razorsense-modes/razorsense-regret-mobile-dark.mp4',
      'avc1.640015',
      360,
      484,
      24,
      68357,
    ),
  },
};

const REPRESENTATIVE_PHASES: Record<RazorSenseMode, number> = {
  neutral: 5.8,
  typing: 8.64,
  thinking: 2.25,
  loading: 1.5,
  calm: 2.48,
  joyful: 0.98,
  caution: 1.22,
  regret: 1.97,
};

const OPERATIONAL_MODE_SET: ReadonlySet<RazorSenseMode> = new Set([
  'neutral',
  'typing',
  'thinking',
  'loading',
]);

const isOperationalMode = (mode: RazorSenseMode): mode is RazorSenseOperationalMode =>
  OPERATIONAL_MODE_SET.has(mode);

const getRazorSenseAsset = (request: RazorSenseAssetRequest): RazorSenseAsset => {
  const { mode, colorScheme, viewport } = request;
  const isOperational = isOperationalMode(mode);
  const source = isOperational
    ? OPERATIONAL_SOURCES[colorScheme][mode]
    : viewport === 'mobile'
    ? MOBILE_EMOTIONAL_SOURCES[colorScheme][mode]
    : DESKTOP_EMOTIONAL_SOURCES[mode];
  const stillViewport = isOperational ? 'desktop' : viewport;

  return {
    sources: [source],
    fallbackSource: source,
    representativeFrameFile: `razorsense-stills/${stillViewport}-${colorScheme}-${mode}.png`,
    representativePhase: REPRESENTATIVE_PHASES[mode],
  };
};

const joinAssetPath = (assetsPath: string, file: string): string => {
  const normalizedPath = assetsPath.replace(/\/+$/, '');
  const normalizedFile = file.replace(/^\/+/, '');
  return normalizedPath ? `${normalizedPath}/${normalizedFile}` : `/${normalizedFile}`;
};

const getRazorSenseFallbackVideoSource = (
  request: RazorSenseAssetRequest,
): { src: string; source: RazorSenseVideoSource } => {
  const source = getRazorSenseAsset(request).fallbackSource;
  return { src: joinAssetPath(request.assetsPath, source.file), source };
};

const capabilityPromiseByKey = new Map<string, Promise<MediaCapabilitiesDecodingInfo | null>>();

const getCapability = async (
  source: RazorSenseVideoSource,
): Promise<MediaCapabilitiesDecodingInfo | null> => {
  if (typeof navigator === 'undefined') return null;
  let mediaCapabilities: MediaCapabilities | undefined;
  try {
    mediaCapabilities = navigator.mediaCapabilities;
  } catch {
    return null;
  }
  if (!mediaCapabilities?.decodingInfo) return null;
  const supportedMediaCapabilities = mediaCapabilities;

  const configuration: MediaDecodingConfiguration = {
    type: 'file',
    video: {
      contentType: `${source.type}; codecs="${source.codec}"`,
      width: source.width,
      height: source.height,
      bitrate: source.bitrate,
      framerate: source.framerate,
    },
  };
  const key = JSON.stringify(configuration);
  const existing = capabilityPromiseByKey.get(key);
  if (existing) return existing;

  const promise = Promise.resolve()
    .then(() => supportedMediaCapabilities.decodingInfo(configuration))
    .catch(() => null);
  capabilityPromiseByKey.set(key, promise);
  return promise;
};

const selectRazorSenseVideoSource = async (
  request: RazorSenseAssetRequest,
): Promise<{ src: string; source: RazorSenseVideoSource }> => {
  const asset = getRazorSenseAsset(request);
  const checked = await Promise.all(
    asset.sources.map(async (source) => ({ source, capability: await getCapability(source) })),
  );
  const selected =
    checked.find(
      ({ capability }) => capability?.supported && capability.smooth && capability.powerEfficient,
    ) ??
    checked.find(({ capability }) => capability?.supported && capability.smooth) ??
    checked.find(({ capability }) => capability?.supported);
  const source = selected?.source ?? asset.fallbackSource;

  return { src: joinAssetPath(request.assetsPath, source.file), source };
};

export {
  getRazorSenseAsset,
  getRazorSenseFallbackVideoSource,
  joinAssetPath,
  selectRazorSenseVideoSource,
};

export type { RazorSenseAsset, RazorSenseAssetRequest, RazorSenseVideoSource, RazorSenseViewport };
