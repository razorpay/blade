import { getRazorSenseAsset, selectRazorSenseVideoSource } from '../razorSenseAssets';
import { preloadRazorSense, preloadRazorSenseModeAssets } from '../utils';

const flushPromises = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 0));
};

describe('RazorSense assets', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    Object.defineProperty(navigator, 'mediaCapabilities', {
      configurable: true,
      value: undefined,
    });
  });

  it('resolves viewport and appearance-specific video and still metadata', () => {
    const operational = getRazorSenseAsset({
      assetsPath: '/assets/spark',
      mode: 'typing',
      colorScheme: 'dark',
      viewport: 'mobile',
    });
    const emotional = getRazorSenseAsset({
      assetsPath: '/assets/spark',
      mode: 'joyful',
      colorScheme: 'dark',
      viewport: 'mobile',
    });

    expect(operational.fallbackSource).toEqual({
      file: 'razorsense-states/razorsense-typing-dark.mp4',
      type: 'video/mp4',
      codec: 'avc1.640028',
      width: 1920,
      height: 1080,
      bitrate: 857733,
      framerate: 25,
    });
    expect(operational.representativeFrameFile).toBe('razorsense-stills/desktop-dark-typing.png');
    expect(operational.representativePhase).toBe(1.96);
    expect(emotional.fallbackSource.file).toBe(
      'razorsense-modes/razorsense-joyful-mobile-dark.mp4',
    );
    expect(emotional.representativeFrameFile).toBe('razorsense-stills/mobile-dark-joyful.png');
  });

  it('caches capability checks per exact decoding configuration and joins URLs safely', async () => {
    const decodingInfo = jest.fn().mockResolvedValue({
      supported: true,
      smooth: true,
      powerEfficient: true,
      keySystemAccess: null,
    });
    Object.defineProperty(navigator, 'mediaCapabilities', {
      configurable: true,
      value: { decodingInfo },
    });
    const request = {
      assetsPath: '/assets/spark/',
      mode: 'calm',
      colorScheme: 'light',
      viewport: 'desktop',
    } as const;

    const [first, second] = await Promise.all([
      selectRazorSenseVideoSource(request),
      selectRazorSenseVideoSource(request),
    ]);

    expect(first).toEqual(second);
    expect(first.src).toBe('/assets/spark/razorsense-modes/razorsense-calm.mp4');
    expect(decodingInfo).toHaveBeenCalledTimes(1);
    expect(decodingInfo).toHaveBeenCalledWith({
      type: 'file',
      video: {
        contentType: 'video/mp4; codecs="avc1.4D4020"',
        width: 1364,
        height: 440,
        bitrate: 870025,
        framerate: 24,
      },
    });
  });

  it('uses the explicit H.264 fallback and retries a transient capability failure', async () => {
    const decodingInfo = jest
      .fn()
      .mockImplementationOnce(() => {
        throw new Error('unsupported');
      })
      .mockResolvedValueOnce({
        supported: true,
        smooth: true,
        powerEfficient: true,
        keySystemAccess: null,
      });
    Object.defineProperty(navigator, 'mediaCapabilities', {
      configurable: true,
      value: { decodingInfo },
    });
    const request = {
      assetsPath: 'https://cdn.example.com/spark///',
      mode: 'regret',
      colorScheme: 'dark',
      viewport: 'mobile',
    } as const;

    await expect(selectRazorSenseVideoSource(request)).resolves.toEqual({
      src: 'https://cdn.example.com/spark/razorsense-modes/razorsense-regret-mobile-dark.mp4',
      source: expect.objectContaining({
        file: 'razorsense-modes/razorsense-regret-mobile-dark.mp4',
        codec: 'avc1.640015',
      }),
    });
    await selectRazorSenseVideoSource(request);

    expect(decodingInfo).toHaveBeenCalledTimes(2);
  });

  it.each(['object-first', 'compatibility-first'] as const)(
    'shares one video without weakening canplaythrough readiness when called %s',
    async (order) => {
      const videos: HTMLVideoElement[] = [];
      const loadVideo = jest
        .spyOn(HTMLMediaElement.prototype, 'load')
        .mockImplementation(function mockLoad(this: HTMLMediaElement) {
          videos.push(this as HTMLVideoElement);
        });
      const assetsPath = `/assets/spark/${order}`;
      const callObjectApi = (): Promise<void> =>
        preloadRazorSense({ modes: 'neutral', assetsPath });
      const callCompatibilityApi = (): Promise<void> =>
        preloadRazorSenseModeAssets('neutral', assetsPath, 'light');
      const firstPromise = order === 'object-first' ? callObjectApi() : callCompatibilityApi();
      let firstResolved = false;
      void firstPromise.then(() => {
        firstResolved = true;
      });

      await flushPromises();
      expect(loadVideo).toHaveBeenCalledTimes(1);
      const video = videos[0];
      video.dispatchEvent(new Event('loadeddata'));
      await flushPromises();

      expect(firstResolved).toBe(order === 'object-first');

      const secondPromise = order === 'object-first' ? callCompatibilityApi() : callObjectApi();
      let secondResolved = false;
      void secondPromise.then(() => {
        secondResolved = true;
      });
      await flushPromises();

      expect(loadVideo).toHaveBeenCalledTimes(1);
      expect(secondResolved).toBe(order === 'compatibility-first');

      video.dispatchEvent(new Event('canplaythrough'));
      await Promise.all([firstPromise, secondPromise]);
    },
  );
});
