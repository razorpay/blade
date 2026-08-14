/* eslint-disable react/react-in-jsx-scope */

import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import type { RazorSenseResolvedPlaybackPlan } from './razorSensePrograms';
import { seekToRazorSenseVideoFrame } from './RazorSenseVideoFrame';
import type { CancelVideoFrameWait } from './RazorSenseVideoFrame';
import { useRazorSenseLifecycle } from './useRazorSenseLifecycle';
import { DEFAULT_CDN_PATH } from './utils';

const AUDIO_WAVE_FRAME_RATE = 30;
const AUDIO_WAVE_TERMINAL_TIME_SECONDS = 241 / AUDIO_WAVE_FRAME_RATE;
const SOURCE_HANDOFF_MS = 320;

type RazorSenseAudioWaveProps = {
  assetKey?: 'audioWave' | 'bottomWave';
  sourceFile?: string;
  frameRate?: number;
  terminalTimeSeconds?: number;
  assetsPath?: string;
  occurrenceId: number;
  playback: RazorSenseResolvedPlaybackPlan;
  paused: boolean;
  runtimePriority?: number;
  width?: string | number;
  height?: string | number;
  onReady: () => void;
  onIteration: (iteration: number) => void;
  onTerminal: (iterationCount: number) => void;
  onError: (error: Error) => void;
};

type DirectVideoBuffer = {
  id: number;
  occurrenceId: number;
  source: string;
  startTimeSeconds: number;
  startsTerminal: boolean;
};

type DirectVideoBufferProps = {
  source?: string;
  occurrenceId: number;
  startTimeSeconds: number;
  startsTerminal: boolean;
  frameRate: number;
  terminalTimeSeconds: number;
  playback: RazorSenseResolvedPlaybackPlan;
  paused: boolean;
  setVideoRef?: (video: HTMLVideoElement | null) => void;
  onReady: () => void;
  onIteration: (iteration: number) => void;
  onTerminal: (iterationCount: number) => void;
  onError: (error: Error) => void;
};

const shouldContinueAfterIteration = (
  playback: RazorSenseResolvedPlaybackPlan,
  iterationCount: number,
): boolean =>
  playback.playback === 'loop' ||
  (playback.playback === 'repeat' && iterationCount < playback.repeatCount + 1);

const DirectVideoBuffer = ({
  source,
  occurrenceId,
  startTimeSeconds,
  startsTerminal,
  frameRate,
  terminalTimeSeconds,
  playback,
  paused,
  setVideoRef,
  onReady,
  onIteration,
  onTerminal,
  onError,
}: DirectVideoBufferProps): React.ReactElement => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cancelFrameWaitRef = useRef<CancelVideoFrameWait>();
  const generationRef = useRef(0);
  const iterationRef = useRef(0);
  const resumeTimeRef = useRef(startTimeSeconds);
  const isPreparedRef = useRef(false);
  const isTerminalRef = useRef(startsTerminal);
  const pausedRef = useRef(paused);
  const playbackRef = useRef(playback);
  const onReadyRef = useRef(onReady);
  const onIterationRef = useRef(onIteration);
  const onTerminalRef = useRef(onTerminal);
  const onErrorRef = useRef(onError);

  pausedRef.current = paused;
  playbackRef.current = playback;
  onReadyRef.current = onReady;
  onIterationRef.current = onIteration;
  onTerminalRef.current = onTerminal;
  onErrorRef.current = onError;

  const assignVideoRef = useCallback(
    (video: HTMLVideoElement | null): void => {
      videoRef.current = video;
      setVideoRef?.(video);
    },
    [setVideoRef],
  );

  const prepareStartFrame = useCallback((): void => {
    const video = videoRef.current;
    if (!video || !source) return;
    const generation = generationRef.current;
    cancelFrameWaitRef.current?.();
    cancelFrameWaitRef.current = seekToRazorSenseVideoFrame({
      video,
      targetTime: resumeTimeRef.current,
      frameRate,
      shouldRemainPaused: true,
      onReady: () => {
        if (generation !== generationRef.current) return;
        cancelFrameWaitRef.current = undefined;
        isPreparedRef.current = true;
        onReadyRef.current();
        if (!pausedRef.current && !isTerminalRef.current) {
          video.play().catch(() => undefined);
        }
      },
    });
  }, [frameRate, source]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    generationRef.current += 1;
    isPreparedRef.current = false;
    cancelFrameWaitRef.current?.();
    cancelFrameWaitRef.current = undefined;
    video.pause();

    if (!source) {
      if (Number.isFinite(video.currentTime)) resumeTimeRef.current = video.currentTime;
      video.removeAttribute('src');
      video.load();
      return undefined;
    }
    if (video.readyState >= video.HAVE_METADATA) prepareStartFrame();

    return () => {
      generationRef.current += 1;
      cancelFrameWaitRef.current?.();
      cancelFrameWaitRef.current = undefined;
      video.pause();
    };
  }, [occurrenceId, prepareStartFrame, source]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isPreparedRef.current || isTerminalRef.current) return;
    if (paused) video.pause();
    else video.play().catch(() => undefined);
  }, [paused]);

  const handleEnded = (): void => {
    const video = videoRef.current;
    if (!video || isTerminalRef.current) return;
    const iterationCount = ++iterationRef.current;
    onIterationRef.current(iterationCount);
    if (shouldContinueAfterIteration(playbackRef.current, iterationCount)) {
      video.currentTime = 0;
      if (!pausedRef.current) video.play().catch(() => undefined);
      return;
    }

    isTerminalRef.current = true;
    const generation = generationRef.current;
    const terminalTime =
      playbackRef.current.playback !== 'loop' &&
      playbackRef.current.endBehavior === 'reset-to-start'
        ? 0
        : terminalTimeSeconds;
    cancelFrameWaitRef.current?.();
    cancelFrameWaitRef.current = seekToRazorSenseVideoFrame({
      video,
      targetTime: terminalTime,
      frameRate,
      shouldRemainPaused: true,
      onReady: () => {
        if (generation !== generationRef.current) return;
        cancelFrameWaitRef.current = undefined;
        resumeTimeRef.current = terminalTime;
        onTerminalRef.current(iterationCount);
      },
    });
  };

  return (
    <video
      ref={assignVideoRef}
      aria-hidden="true"
      src={source}
      crossOrigin="anonymous"
      muted={true}
      playsInline={true}
      preload={source ? 'auto' : 'none'}
      onLoadedData={prepareStartFrame}
      onEnded={handleEnded}
      onError={() => {
        if (source) onErrorRef.current(new Error(`RazorSense: Failed to load ${source}`));
      }}
      style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
};

const RazorSenseAudioWave = forwardRef<HTMLVideoElement, RazorSenseAudioWaveProps>(
  function RazorSenseAudioWave(props, forwardedRef) {
    const {
      assetKey = 'audioWave',
      sourceFile = 'razorsense-presets/audio-wave.mp4',
      frameRate = AUDIO_WAVE_FRAME_RATE,
      terminalTimeSeconds = AUDIO_WAVE_TERMINAL_TIME_SECONDS,
      assetsPath = DEFAULT_CDN_PATH,
      occurrenceId,
      playback,
      paused,
      runtimePriority,
      width = '100%',
      height = '100%',
      onReady,
      onIteration,
      onTerminal,
      onError,
    } = props;
    const source = `${assetsPath.replace(/\/$/, '')}/${sourceFile.replace(/^\//, '')}`;
    const hostRef = useRef<HTMLDivElement>(null);
    const bufferCounterRef = useRef(0);
    const cleanupTimerRef = useRef<number>();
    const initialBuffer = useRef<DirectVideoBuffer>({
      id: 0,
      occurrenceId,
      source,
      startTimeSeconds: 0,
      startsTerminal: false,
    });
    const [buffers, setBuffers] = useState<DirectVideoBuffer[]>([initialBuffer.current]);
    const [requestedBufferId, setRequestedBufferId] = useState(0);
    const [visibleBufferId, setVisibleBufferId] = useState(0);
    const [playableBufferId, setPlayableBufferId] = useState<number>();
    const requestedBufferIdRef = useRef(requestedBufferId);
    const requestedVideoRef = useRef<HTMLVideoElement | null>(null);
    const terminalBufferIdsRef = useRef(new Set<number>());
    const lifecycle = useRazorSenseLifecycle(hostRef, {
      family: 'authored',
      isInteractive: false,
      priority: runtimePriority,
    });
    const retainsSource =
      lifecycle.state === 'warm' ||
      lifecycle.state === 'suspended' ||
      (lifecycle.state === 'active' && lifecycle.isAdmitted);
    const canPlay = lifecycle.state === 'active' && lifecycle.isAdmitted && !paused;

    requestedBufferIdRef.current = requestedBufferId;

    const assignForwardedRef = useCallback(
      (video: HTMLVideoElement | null): void => {
        requestedVideoRef.current = video;
        if (typeof forwardedRef === 'function') forwardedRef(video);
        else if (forwardedRef) forwardedRef.current = video;
      },
      [forwardedRef],
    );

    useEffect(() => {
      const current = buffers.find((buffer) => buffer.id === requestedBufferIdRef.current);
      if (current?.source === source && current.occurrenceId === occurrenceId) return;
      const id = ++bufferCounterRef.current;
      const isAppearanceHandoff =
        current?.source !== source && current?.occurrenceId === occurrenceId;
      const startTimeSeconds = isAppearanceHandoff
        ? requestedVideoRef.current?.currentTime ?? 0
        : 0;
      const buffer = {
        id,
        occurrenceId,
        source,
        startTimeSeconds,
        startsTerminal:
          isAppearanceHandoff && terminalBufferIdsRef.current.has(requestedBufferIdRef.current),
      };
      setRequestedBufferId(id);
      setBuffers((existing) => [
        ...existing.filter((candidate) => candidate.id === visibleBufferId),
        buffer,
      ]);
    }, [buffers, occurrenceId, source, visibleBufferId]);

    useEffect(
      () => () => {
        if (cleanupTimerRef.current !== undefined) {
          window.clearTimeout(cleanupTimerRef.current);
          cleanupTimerRef.current = undefined;
        }
      },
      [],
    );

    const handleBufferReady = (bufferId: number): void => {
      if (bufferId !== requestedBufferIdRef.current) return;
      if (buffers.find((buffer) => buffer.id === bufferId)?.startsTerminal) {
        terminalBufferIdsRef.current.add(bufferId);
      }
      if (bufferId === visibleBufferId) {
        setPlayableBufferId(bufferId);
        onReady();
        return;
      }
      setVisibleBufferId(bufferId);
      if (cleanupTimerRef.current !== undefined) window.clearTimeout(cleanupTimerRef.current);
      cleanupTimerRef.current = window.setTimeout(() => {
        cleanupTimerRef.current = undefined;
        setPlayableBufferId(bufferId);
        setBuffers((current) => current.filter((buffer) => buffer.id === bufferId));
        onReady();
      }, SOURCE_HANDOFF_MS + 32);
    };

    const widthStyle = typeof width === 'number' ? `${width}px` : width;
    const heightStyle = typeof height === 'number' ? `${height}px` : height;

    return (
      <div
        ref={hostRef}
        data-razor-sense-authored-asset={assetKey}
        data-razor-sense-runtime-state={lifecycle.state}
        data-razor-sense-runtime-admitted={lifecycle.isAdmitted ? 'true' : 'false'}
        style={{ position: 'relative', width: widthStyle, height: heightStyle }}
      >
        {buffers.map((buffer) => {
          const isRequested = buffer.id === requestedBufferId;
          const isVisible = buffer.id === visibleBufferId;
          return (
            <div
              key={buffer.id}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: isVisible ? 1 : 0,
                transition: `opacity ${SOURCE_HANDOFF_MS}ms linear`,
                pointerEvents: 'none',
              }}
            >
              <DirectVideoBuffer
                source={retainsSource ? buffer.source : undefined}
                occurrenceId={buffer.occurrenceId}
                startTimeSeconds={buffer.startTimeSeconds}
                startsTerminal={buffer.startsTerminal}
                frameRate={frameRate}
                terminalTimeSeconds={terminalTimeSeconds}
                playback={playback}
                paused={!canPlay || !isRequested || buffer.id !== playableBufferId}
                setVideoRef={isRequested ? assignForwardedRef : undefined}
                onReady={() => handleBufferReady(buffer.id)}
                onIteration={(iteration) => {
                  if (buffer.id === requestedBufferIdRef.current) onIteration(iteration);
                }}
                onTerminal={(iterationCount) => {
                  if (buffer.id === requestedBufferIdRef.current) {
                    terminalBufferIdsRef.current.add(buffer.id);
                    onTerminal(iterationCount);
                  }
                }}
                onError={(error) => {
                  if (buffer.id === requestedBufferIdRef.current) onError(error);
                }}
              />
            </div>
          );
        })}
      </div>
    );
  },
);

export { RazorSenseAudioWave };
export type { RazorSenseAudioWaveProps };
