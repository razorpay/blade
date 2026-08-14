import type { Meta, StoryFn } from '@storybook/react-vite';
import React, { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactElement, ReactNode } from 'react';
import { RazorSense } from '../';
import { seekToRazorSenseVideoFrame } from '../RzpGlass/RazorSenseVideoFrame';

const ASSETS_PATH = '/assets/spark';
const RIPPLE_WAVE_SOURCE_TIME_SECONDS = 1.9;
const CIRCLE_SLIDE_UP_SOURCE_TIME_SECONDS = 0.75;
const AUDIO_WAVE_SOURCE_TIME_SECONDS = 4;

const pageStyle: CSSProperties = {
  alignItems: 'center',
  background: '#F5F7F9',
  display: 'flex',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '32px',
};

const CalibrationSurface = ({
  children,
  calibrationId,
  height,
  isReady,
  sourceTime,
  width,
}: {
  children: ReactNode;
  calibrationId: string;
  height: number;
  isReady: boolean;
  sourceTime: number;
  width: number;
}): ReactElement => (
  <main style={pageStyle}>
    <div
      data-razor-sense-calibration={calibrationId}
      data-calibration-frame-ready={isReady ? 'true' : 'false'}
      data-calibration-source-time-seconds={sourceTime.toFixed(2)}
      style={{
        background: '#FFFFFF',
        height,
        overflow: 'hidden',
        position: 'relative',
        width,
      }}
    >
      {children}
    </div>
  </main>
);

const LegacyPresetFrame = ({
  calibrationId,
  preset,
  sourceTime,
}: {
  calibrationId: string;
  preset: 'rippleWave' | 'circleSlideUp';
  sourceTime: number;
}): ReactElement => {
  const [isReady, setIsReady] = useState(false);

  return (
    <CalibrationSurface
      calibrationId={calibrationId}
      height={600}
      isReady={isReady}
      sourceTime={sourceTime}
      width={966}
    >
      <RazorSense
        width="100%"
        height="100%"
        assetsPath={ASSETS_PATH}
        preset={preset}
        paused={true}
        startTime={sourceTime}
        animateLightIndependently={false}
        onLoad={() => setIsReady(true)}
      />
    </CalibrationSurface>
  );
};

const AudioWaveFrame = (): ReactElement => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    let cancelFrameWait: (() => void) | undefined;
    const seekToCalibrationFrame = (): void => {
      cancelFrameWait?.();
      cancelFrameWait = seekToRazorSenseVideoFrame({
        video,
        targetTime: AUDIO_WAVE_SOURCE_TIME_SECONDS,
        frameRate: 30,
        shouldRemainPaused: true,
        onReady: () => setIsReady(true),
      });
    };

    if (video.readyState >= video.HAVE_METADATA) seekToCalibrationFrame();
    else video.addEventListener('loadedmetadata', seekToCalibrationFrame, { once: true });

    return () => {
      video.removeEventListener('loadedmetadata', seekToCalibrationFrame);
      cancelFrameWait?.();
    };
  }, []);

  return (
    <CalibrationSurface
      calibrationId="packaged-audio-wave"
      height={540}
      isReady={isReady}
      sourceTime={AUDIO_WAVE_SOURCE_TIME_SECONDS}
      width={960}
    >
      <video
        ref={videoRef}
        aria-hidden="true"
        muted={true}
        playsInline={true}
        preload="auto"
        src={`${ASSETS_PATH}/razorsense-presets/audio-wave.mp4`}
        style={{ display: 'block', height: '100%', objectFit: 'cover', width: '100%' }}
      />
    </CalibrationSurface>
  );
};

export default {
  title: 'Components/RazorSense/Internal Calibration',
  parameters: {
    controls: { disable: true },
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
} as Meta;

export const LegacyRippleWaveFrame: StoryFn = () => (
  <LegacyPresetFrame
    calibrationId="legacy-ripple-wave"
    preset="rippleWave"
    sourceTime={RIPPLE_WAVE_SOURCE_TIME_SECONDS}
  />
);
LegacyRippleWaveFrame.storyName = 'Legacy Ripple Wave · 1.90s';

export const LegacyCircleSlideUpFrame: StoryFn = () => (
  <LegacyPresetFrame
    calibrationId="legacy-circle-slide-up"
    preset="circleSlideUp"
    sourceTime={CIRCLE_SLIDE_UP_SOURCE_TIME_SECONDS}
  />
);
LegacyCircleSlideUpFrame.storyName = 'Legacy Circle Slide Up · 0.75s';

export const PackagedAudioWaveFrame: StoryFn = () => <AudioWaveFrame />;
PackagedAudioWaveFrame.storyName = 'Packaged Audio Wave · 4.00s';
