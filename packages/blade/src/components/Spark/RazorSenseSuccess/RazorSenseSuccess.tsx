import React, { forwardRef, useEffect, useRef, useState } from 'react';
import type { RazorSenseSuccessProps } from './types';
import { LABEL_AFTER, LABEL_DUR, hexRgb, makeOverlay, overlayAt } from './successOverlay';
import type { SuccessOverlay } from './successOverlay';
import { successPieceDark, successPieceLight } from './piece';
import { runFreshStage, toHex } from '../RazorSenseEngine';
import type { FreshStage, FreshSuccessPiece } from '../RazorSenseEngine';
import { useTheme } from '~components/BladeProvider';
import { CheckIcon } from '~components/Icons';
import { Heading } from '~components/Typography';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { useMergeRefs } from '~utils/useMergeRefs';
import { makeAccessible } from '~utils/makeAccessible';

/** its canvas's sharpness (device px per CSS px): the orb is soft all over (blurred ~100 CSS px); the tick and badge are HTML */
const SUCCESS_DPR = 1;
/**
 * how long it may go from its start without its first frame on screen, or have its frames held by its GPU once it draws, before the
 * badge pops in alone (ms, counted while it runs): a success never waits on a GPU, whatever state its engine is in (a Direct3D copy
 * of its shader still compiling: a light Success on Intel UHD drew nothing for 8.8 s)
 */
const FIRST_FRAME_MS = 800;
/**
 * how long it may be on screen without starting (its engine or comps still downloading) before the badge pops in alone (ms). It
 * starts past any other RazorSense in line (an urgent turn: in line behind six others it started ~2.3 s late), and its waits count
 * from its start, not its mount: below the fold, it plays once it's scrolled to
 */
const START_MS = 2000;

/** where it is: playing (the orb drawn), the badge alone (it couldn't animate, or reduced motion), done (the badge with its check) */
type Phase = 'playing' | 'badge' | 'done';

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

/** what's drawn over the orb, put on its elements (CSS px from the badge's middle) */
const putOverlay = (
  o: SuccessOverlay,
  half: number,
  badge: HTMLElement | null,
  tick: SVGSVGElement | null,
  path: SVGPathElement | null,
  label: HTMLElement | null,
): void => {
  if (label) {
    label.style.opacity = String(o.label.opacity);
    label.style.transform = `translateY(${o.label.y}px)`;
  }
  if (badge) {
    badge.style.visibility = o.badge.isShown ? 'visible' : 'hidden';
    badge.style.opacity = String(o.badge.opacity);
    badge.style.transform = `scale(${o.badge.scale})`;
  }
  if (tick && path) {
    const { x, y, size, scale, opacity, d, stroke, color, isRound, dashOffset } = o.tick;
    tick.style.width = `${size}px`;
    tick.style.height = `${size}px`;
    tick.style.opacity = String(opacity);
    tick.style.transform = `translate(${half + x - size / 2}px, ${
      half + y - size / 2
    }px) scale(${scale})`;
    path.setAttribute('d', d);
    path.setAttribute('stroke', `rgb(${color[0]},${color[1]},${color[2]})`);
    path.setAttribute('stroke-width', String(stroke));
    path.setAttribute('stroke-linecap', isRound ? 'round' : 'square');
    path.setAttribute('stroke-linejoin', isRound ? 'round' : 'miter');
    path.setAttribute('stroke-dashoffset', String(dashOffset));
  }
};

/**
 * RazorSenseSuccess
 *
 * RazorSense's success moment: a glass orb rises into place with a white tick on it, then shrinks and fades as Blade's success
 * badge pops in where it was, and the tick turns into the badge's check; its `label`, if it has one, comes in under the badge as it
 * pops in. It's the badge's size in the layout (80 px, and its label under it); the orb rises from below it, over what's there, and
 * goes. Plays once when it mounts, then the badge (and label) stay. Like RazorSense, it follows Blade's
 * color scheme (BladeProvider): light and dark are the same component, each its own tuning. The orb is drawn by the Fresh RazorSense
 * engine on one canvas, freed as soon as the orb is gone; the badge and check are Blade's own.
 *
 * @example
 * ```tsx
 * <RazorSenseSuccess label="Payment received" onComplete={() => setIsDone(true)} />
 * ```
 */
const RazorSenseSuccess = forwardRef<HTMLDivElement, RazorSenseSuccessProps>(
  function RazorSenseSuccess(
    {
      isPaused = false,
      label,
      accessibilityLabel = 'Success',
      onComplete,
      onLoad,
      onError,
      className,
      style,
      testID,
    },
    forwardedRef,
  ) {
    const { colorScheme, theme } = useTheme();
    const mode = colorScheme === 'dark' ? 'dark' : 'light';
    const piece: FreshSuccessPiece = mode === 'dark' ? successPieceDark : successPieceLight;
    const circle = theme.colors.feedback.background.positive.subtle;
    const ink = theme.colors.feedback.icon.positive.intense;
    const size = piece.badge.size;
    const z = piece.cssPerComp;
    const boxRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(forwardedRef, boxRef);
    const orbRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const tickRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<FreshStage | null>(null);
    const isPausedRef = useRef(isPaused);
    isPausedRef.current = isPaused;
    const onCompleteRef = useRef(onComplete);
    onCompleteRef.current = onComplete;
    const onLoadRef = useRef(onLoad);
    onLoadRef.current = onLoad;
    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;
    const [phase, setPhase] = useState<Phase>('playing');
    const phaseRef = useRef<Phase>('playing');
    const isCompleteRef = useRef(false);
    const completeTimerRef = useRef(0);

    const complete = (): void => {
      if (isCompleteRef.current) return;
      isCompleteRef.current = true;
      onCompleteRef.current?.();
    };
    // onComplete once its end comes (not after it's gone: unmounted first, it's never called)
    const completeIn = (ms: number): void => {
      window.clearTimeout(completeTimerRef.current);
      completeTimerRef.current = window.setTimeout(complete, ms);
    };
    useEffect(() => () => window.clearTimeout(completeTimerRef.current), []);
    // the orb gone: its GPU context and memory go now (after this frame: the stage may be the one calling)
    const freeStage = (): void => {
      const stage = stageRef.current;
      stage?.setDriver(null);
      window.setTimeout(() => {
        stage?.destroy();
        if (stageRef.current === stage) stageRef.current = null;
      }, 0);
    };
    const toPhase = (next: Phase): void => {
      if (phaseRef.current === 'done' || phaseRef.current === next) return;
      phaseRef.current = next;
      setPhase(next);
    };

    useEffect(() => {
      // (played, or showing the badge alone: a new color scheme only recolours it)
      if (phaseRef.current !== 'playing') return undefined;
      const overlay = makeOverlay();
      // (the check's colour, for the tick's turn into it: Blade's emerald where there's no canvas to read the token)
      const inkRgb = hexRgb(toHex(ink) ?? '#00753b');
      const m = piece.moments;
      // (couldn't animate, or still had nothing drawn after a moment: a success doesn't wait on a GPU; the badge pops in alone)
      const toBadge = (): void => {
        freeStage();
        toPhase('badge');
      };
      // reduced motion: the badge as it ends, with its check, and nothing drawn by the GPU
      if (prefersReducedMotion()) {
        toPhase('badge');
        return undefined;
      }
      let hasDrawn = false;
      let isStarted = false;
      let startWait = 0;
      let frameWait = 0;
      // (never started, or started and never drew, or its GPU held its frames: the badge pops in alone, and onError says why)
      const giveUp = (why: string): void => {
        if (phaseRef.current !== 'playing') return;
        onErrorRef.current?.(new Error(`RazorSenseSuccess: ${why}`));
        toBadge();
      };
      // its first frame within FIRST_FRAME_MS of its start, counted while it runs (paused, in a hidden tab or scrolled away, it waits)
      const waitForFrame = (): void => {
        frameWait = window.setTimeout(() => {
          frameWait = 0;
          if (hasDrawn || phaseRef.current !== 'playing') return;
          if (stageRef.current?.hasEngine() && !stageRef.current.isRunning()) waitForFrame();
          else giveUp(`no first frame within ${FIRST_FRAME_MS} ms of its start`);
        }, FIRST_FRAME_MS);
      };
      // on screen and not started within START_MS: the badge
      const armStart = (): void => {
        if (startWait || isStarted) return;
        startWait = window.setTimeout(() => {
          if (!isStarted) giveUp(`not started within ${START_MS} ms on screen`);
        }, START_MS);
      };
      const orb = orbRef.current;
      let seen: IntersectionObserver | null = null;
      if (typeof IntersectionObserver === 'undefined' || !orb) armStart();
      else {
        seen = new IntersectionObserver((entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          seen?.disconnect();
          seen = null;
          armStart();
        });
        seen.observe(orb);
      }
      const stop = runFreshStage({
        moduleName: 'RazorSenseSuccess',
        getBox: () => orbRef.current,
        stageRef,
        loadComps: () => import('./comps'),
        shouldStart: () => phaseRef.current === 'playing',
        // (its comp asks for a clear canvas: its engine is made ahead, a step at a time)
        engineAlpha: true,
        start: (stage, comps) => {
          const doc = mode === 'dark' ? comps.successDark : comps.successLight;
          const engine = stage.mount({
            doc,
            opts: { fit: 'fixed', scale: z, alpha: true, paused: true, dpr: SUCCESS_DPR },
          });
          if (!engine) return false;
          let t = 0;
          let heldMs = 0;
          stage.setDriver((eng, dt) => {
            // its clock holds till its first frame is on screen, and while its GPU holds its frames back (a Direct3D copy of its shader
            // compiling): the orb plays whole from its start. Held past FIRST_FRAME_MS once it has drawn, the badge
            if (!hasDrawn || eng.waitsOnGpu?.()) {
              if (hasDrawn) heldMs += dt * 1000;
              if (heldMs > FIRST_FRAME_MS) {
                giveUp(`its GPU held its frames for ${FIRST_FRAME_MS} ms`);
                return;
              }
              eng.player.seek(t, t);
              return;
            }
            t += dt;
            // the orb gone: its canvas goes, and what's left is the badge with Blade's own check
            if (t >= m.gone) {
              freeStage();
              phaseRef.current = 'done';
              setPhase('done');
              completeIn(Math.max(0, m.end - t) * 1000);
              return;
            }
            eng.player.seek(t, t);
            putOverlay(
              overlayAt(piece, t, inkRgb, overlay),
              size / 2,
              badgeRef.current,
              tickRef.current,
              pathRef.current,
              labelRef.current,
            );
          });
          stage.setPaused(isPausedRef.current);
          return true;
        },
        onFail: (error) => {
          window.clearTimeout(startWait);
          window.clearTimeout(frameWait);
          onErrorRef.current?.(error);
          toBadge();
        },
        onRelease: () => undefined,
        // (past any other RazorSense in line; its waits count from here)
        isUrgent: true,
        onStarted: () => {
          isStarted = true;
          window.clearTimeout(startWait);
          if (!hasDrawn && !frameWait) waitForFrame();
        },
        onDrawn: () => {
          hasDrawn = true;
          onLoadRef.current?.();
        },
      });
      return () => {
        window.clearTimeout(startWait);
        window.clearTimeout(frameWait);
        seen?.disconnect();
        stop();
      };
      // isPaused is read live (its own effect); ink and the piece are read when it starts
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    useEffect(() => {
      stageRef.current?.setPaused(isPaused);
    }, [isPaused]);

    // the badge alone (no orb): it pops in as Blade's does, with its check, then it's done (at once for reduced motion)
    useEffect(() => {
      if (phase !== 'badge') return undefined;
      if (prefersReducedMotion()) {
        phaseRef.current = 'done';
        setPhase('done');
        complete();
        return undefined;
      }
      const overlay = makeOverlay();
      const alone = { ...piece, tick: { ...piece.tick, on: false } };
      const t0 = performance.now();
      let raf = 0;
      // (till its label is in too)
      const until = Math.max(piece.moments.badgeEnd, piece.moments.badge + LABEL_AFTER + LABEL_DUR);
      const step = (now: number): void => {
        const t = piece.moments.badge + (now - t0) / 1000;
        if (t >= until) {
          phaseRef.current = 'done';
          setPhase('done');
          completeIn(Math.max(0, piece.moments.end - until) * 1000);
          return;
        }
        putOverlay(
          overlayAt(alone, t, [0, 0, 0], overlay),
          size / 2,
          badgeRef.current,
          null,
          null,
          labelRef.current,
        );
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      return () => cancelAnimationFrame(raf);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase]);

    const isDone = phase === 'done';
    return (
      <div
        ref={mergedRef}
        className={className}
        {...metaAttribute({ name: MetaConstants.RazorSenseSuccess, testID })}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: `${theme.spacing[6]}px`,
          ...style,
        }}
      >
        <div
          {...makeAccessible({ role: 'img', label: accessibilityLabel })}
          style={{ position: 'relative', width: `${size}px`, height: `${size}px`, flexShrink: 0 }}
        >
          {/* the orb's canvas, laid so the orb's place is the badge's middle; it rises from below, over what's there */}
          {phase === 'playing' ? (
            <div
              ref={orbRef}
              style={{
                position: 'absolute',
                left: `${size / 2 - piece.anchor.x * z}px`,
                top: `${size / 2 - piece.anchor.y * z}px`,
                width: `${piece.comp.w * z}px`,
                height: `${piece.comp.h * z}px`,
                pointerEvents: 'none',
              }}
            />
          ) : null}
          <div
            ref={badgeRef}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              backgroundColor: circle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              visibility: isDone ? 'visible' : 'hidden',
              ...(isDone ? { opacity: 1, transform: 'none' } : null),
            }}
          >
            {isDone || phase === 'badge' ? (
              <CheckIcon size="xlarge" color="feedback.icon.positive.intense" />
            ) : null}
          </div>
          {phase === 'playing' ? (
            <svg
              ref={tickRef}
              viewBox="0 0 100 100"
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                overflow: 'visible',
                pointerEvents: 'none',
                opacity: 0,
                transformOrigin: 'center',
              }}
            >
              <path ref={pathRef} fill="none" pathLength={1} strokeDasharray="1 1" />
            </svg>
          ) : null}
        </div>
        {/* its label: in its place from the start (nothing moves when it comes in), shown as the badge pops in */}
        {label ? (
          <div
            ref={labelRef}
            style={{
              textAlign: 'center',
              opacity: isDone ? 1 : 0,
              transform: isDone ? 'none' : 'translateY(20px)',
            }}
          >
            <Heading as="span" size="large" textAlign="center">
              {label}
            </Heading>
          </div>
        ) : null}
      </div>
    );
  },
);

export { RazorSenseSuccess };
