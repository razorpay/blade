import {
  claimRazorSensePreloadedVideo,
  clearRazorSensePreloads,
  preloadRazorSenseVideo,
} from '../RazorSensePreloadBroker';
import { preloadRazorSenseAssets } from '../utils';

const flushPromises = async (): Promise<void> => {
  await Promise.resolve();
  await Promise.resolve();
};

describe('RazorSensePreloadBroker', () => {
  const videos: HTMLVideoElement[] = [];

  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
    jest
      .spyOn(HTMLMediaElement.prototype, 'load')
      .mockImplementation(function mockLoad(this: HTMLMediaElement) {
        const video = this as HTMLVideoElement;
        if (!videos.includes(video) && video.getAttribute('src')) videos.push(video);
      });
  });

  afterEach(() => {
    clearRazorSensePreloads();
    videos.length = 0;
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('does not release loaded data while a stronger readiness caller is pending', async () => {
    const preload = preloadRazorSenseVideo('/strong-readiness.mp4', 'canplaythrough');
    const video = videos[0];

    video.dispatchEvent(new Event('loadeddata'));
    jest.advanceTimersByTime(10_001);
    await flushPromises();

    expect(video.getAttribute('src')).toBe('/strong-readiness.mp4');
    expect(claimRazorSensePreloadedVideo('/strong-readiness.mp4')).toBeUndefined();

    video.dispatchEvent(new Event('canplaythrough'));
    await expect(preload).resolves.toBeUndefined();
    expect(claimRazorSensePreloadedVideo('/strong-readiness.mp4')).toBe(video);
  });

  it('keeps at most two broker videos live while queued preloads progress', async () => {
    const first = preloadRazorSenseVideo('/first.mp4', 'canplaythrough');
    const second = preloadRazorSenseVideo('/second.mp4', 'canplaythrough');
    const third = preloadRazorSenseVideo('/third.mp4', 'canplaythrough');

    expect(videos).toHaveLength(2);
    const firstVideo = videos[0];
    const secondVideo = videos[1];
    firstVideo.dispatchEvent(new Event('loadeddata'));
    secondVideo.dispatchEvent(new Event('loadeddata'));
    expect(videos).toHaveLength(2);

    firstVideo.dispatchEvent(new Event('canplaythrough'));
    await first;
    expect(videos).toHaveLength(3);
    expect(videos.filter((video) => video.getAttribute('src'))).toHaveLength(2);

    const thirdVideo = videos[2];
    secondVideo.dispatchEvent(new Event('canplaythrough'));
    thirdVideo.dispatchEvent(new Event('canplaythrough'));
    await expect(Promise.all([second, third])).resolves.toEqual([undefined, undefined]);
  });

  it('times out stalled readiness, releases the video, and permits retry', async () => {
    const first = preloadRazorSenseVideo('/stalled.mp4', 'loadeddata');
    const firstVideo = videos[0];

    jest.advanceTimersByTime(30_001);
    await expect(first).rejects.toMatchObject({ name: 'TimeoutError' });
    expect(firstVideo.getAttribute('src')).toBeNull();

    const retry = preloadRazorSenseVideo('/stalled.mp4', 'loadeddata');
    expect(videos).toHaveLength(2);
    const retryVideo = videos[1];
    retryVideo.dispatchEvent(new Event('loadeddata'));
    await expect(retry).resolves.toBeUndefined();
  });

  it('does not touch browser image globals when preset preload runs on the server', async () => {
    const documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'document');
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: undefined,
    });

    try {
      await expect(preloadRazorSenseAssets('default', '/assets/spark')).resolves.toBeUndefined();
    } finally {
      if (documentDescriptor) {
        Object.defineProperty(globalThis, 'document', documentDescriptor);
      }
    }
  });
});
