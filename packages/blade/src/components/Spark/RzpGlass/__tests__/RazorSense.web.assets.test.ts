import { getRazorSenseAsset, selectRazorSenseVideoSource } from '../razorSenseAssets';

describe('RazorSense assets', () => {
  afterEach(() => {
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
      bitrate: 585649,
      framerate: 25,
    });
    expect(operational.representativeFrameFile).toBe('razorsense-stills/desktop-dark-typing.png');
    expect(operational.representativePhase).toBe(8.64);
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

  it('uses the explicit H.264 fallback when capability detection fails', async () => {
    Object.defineProperty(navigator, 'mediaCapabilities', {
      configurable: true,
      value: {
        decodingInfo: jest.fn().mockImplementation(() => {
          throw new Error('unsupported');
        }),
      },
    });

    await expect(
      selectRazorSenseVideoSource({
        assetsPath: 'https://cdn.example.com/spark///',
        mode: 'regret',
        colorScheme: 'dark',
        viewport: 'mobile',
      }),
    ).resolves.toEqual({
      src: 'https://cdn.example.com/spark/razorsense-modes/razorsense-regret-mobile-dark.mp4',
      source: expect.objectContaining({
        file: 'razorsense-modes/razorsense-regret-mobile-dark.mp4',
        codec: 'avc1.640015',
      }),
    });
  });
});
