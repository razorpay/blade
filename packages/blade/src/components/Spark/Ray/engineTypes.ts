/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Types for the generated engine (`./engine`, written by ray-spec/studio/blade/export.mjs) and the host films run against.
 * The engine itself is plain JavaScript from Ray Studio, so these describe its edges only.
 */
import type { FilmHost } from './FilmHost';

/** A message between a film and the component, as the film pages and their host page exchanged them: `{ ray: 'ready' }` ... */
type FilmMessage = { ray: string; [key: string]: any };

/** One Ray Studio film: its page's script as a function, its canvases (bottom to top), its page markup, the helpers it uses. */
type FilmModule = {
  mount: (host: FilmHost) => void;
  canvases: string[];
  ui: string;
  shared: Record<string, SharedFactory>;
};

/** A stateful shared module (wardrobe, nightcap, tour, flip), made once per film. */
type SharedFactory = (host: FilmHost) => Record<string, any>;

/** A frame of him, as the engine makes and draws it (his pose, eyes, props, …). */
type RayFrame = Record<string, any>;

/** Where he's drawn on a canvas: his scale and his origin, in device px. */
type RayView = { scale: number; ox: number; oy: number };

/** The part of a stage a film draws on (ray-core's stageCrop): the stage W x H, the part at x, y, w x h, in device px. */
type StagePart = { x: number; y: number; w: number; h: number; W: number; H: number };

/**
 * The engine's surface the component uses (RayMount, RayPlayer, RayEntrance, FilmHost). The engine is generated from Ray Studio, so this
 * is checked against what it exports: an export that renames or drops one of these fails the type check (the PR review, 2026-11-16).
 */
type RayCoreApi = {
  BASE: number[][];
  FIG: number;
  HOVER: Record<string, any>;
  LOOK: Record<string, any>;
  MATERIALS: Record<string, any>;
  bezier: (points: [number, number, number, number]) => (t: number) => number;
  draw: (
    ctx: CanvasRenderingContext2D,
    frame: RayFrame,
    view: RayView,
    options?: Record<string, unknown>,
  ) => void;
  frameAt: (sim: any, t: number) => RayFrame;
  hoverInit: () => Record<string, any>;
  hoverStep: (hover: any, dt: number, frame: RayFrame, pointer: number[] | null) => void;
  idleFrame: (...args: any[]) => RayFrame;
  keyFrame: (...args: any[]) => RayFrame;
  simulate: (script: any, options?: Record<string, unknown>) => any;
  stageCrop: (
    W: number,
    H: number,
    d: number,
    crop: { left: number; top: number; right: number; bottom: number } | null,
  ) => StagePart;
  toWorld: (view: RayView, point: number[]) => number[];
  withHover: (frame: RayFrame, hover: any) => RayFrame;
};

export type { FilmMessage, FilmModule, SharedFactory, RayCoreApi, RayFrame, RayView, StagePart };
