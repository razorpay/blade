import { errorDark, errorLight, successDark, successLight } from './outcomeComps';
import { COMP, stripOrigin } from './chatDriver';
import type { Rect } from './placement';
import type { FreshDoc, FreshKey, FreshOutcome, FreshStops } from '../RazorSenseEngine/types';

/**
 * Success and error on the chat's bottom strip (send/razorsense-blade: success 2 and error 4): Comp 3's effect shapes (a splash and its
 * ring behind the strip, two halves over it) and their keys, spliced onto the strip pages' Comp 3 after the strip's own end, as flow
 * 10.5 splices them (s1Doc). At rest the strip is held at its end, so nothing past it shows; an outcome plays the strip's clock on
 * through its piece and ends where it started, at the strip's rest. The Colorama goes rest -> its colour -> rest, rest being the
 * strip's own. Its own chunk: fetched while the page is idle once the chat starts thinking.
 */

type Outcome = 'success' | 'error';

type StackEntry = { id: string; doc: FreshDoc; [key: string]: unknown };

/** the piece starts this long after the strip's end, so the strip at rest is never a frame of it (s) */
const LEAD = 0.02;

/**
 * Where an outcome's effects go on the strip's comp: success-blob's place for them (the piece's comp centred on the chat's box,
 * cover-fitted at k) as comp px from the strip comp's middle, x' = k x + dx, y' = k y + dy, its size x k (flow 10.5's s1Map).
 */
type OutcomeMap = { k: number; dx: number; dy: number };
/**
 * the map outcomeComps.ts is laid with: flow 10.5's at its reference size (its chat panel in a 1512 x 982 window). flow 10.5 works
 * its map out for the window it's in, so in a shorter one its splash and the halves' rise sit lower (in a short one, mostly below
 * its bottom edge); laid again from this for the box it plays in, Blade's do too (the user: on a laptop, success and error rose
 * higher than flow 10.5's; in Storybook's short canvas, "super inflated")
 */
const REF_MAP: OutcomeMap = { k: 0.9603174603174603, dx: 62, dy: 42 };
/** the effects success-blob places: the splash and its ring moved and sized, the halves only up or down (flow 10.5's FX9) */
const PLACED: Partial<Record<string, 'xy' | 'y'>> = {
  eSplash: 'xy',
  eRing: 'xy',
  eHalfL: 'y',
  eHalfR: 'y',
};

/**
 * success-blob's map for an outcome on a chat whose box is `box` and whose chat input anchor is `input` (its middle across, its
 * bar's top), the strip's comp drawn at `scale` (CSS px, one frame for all), its page moved down `shift` px: flow 10.5's s1Map, its
 * strip comp placed from the chat input as Blade's is
 */
const outcomeMap = (box: Rect, input: [number, number], scale: number, shift = 0): OutcomeMap => {
  const cover = Math.max(box.width / COMP.w, box.height / COMP.h);
  const k = cover / scale;
  // (CSS px a comp px, as the strip draws: comps are made at 2x)
  const px = 0.5 * scale;
  const [stripLeft, restTop] = stripOrigin(input, scale);
  const stripTop = restTop + shift;
  const pieceLeft = box.left + box.width / 2 - (COMP.w * cover) / 2;
  const pieceTop = box.top + box.height / 2 - (COMP.h * cover) / 2;
  return {
    k,
    dx: (k - 1) * COMP.w + (pieceLeft - stripLeft) / px,
    dy: (k - 1) * COMP.h + (pieceTop - stripTop) / px,
  };
};

/** the strip's height on its comp at rest (comp px from the middle): its Comp 3's s2, held at its last key */
const stripRestY = (doc: FreshDoc, comp: string): number => {
  const c3 = ((doc.stack as StackEntry[] | undefined) ?? []).find((e) => e.id === comp)?.doc;
  const keys = (c3?.K as Record<string, FreshKey[]> | undefined)?.['s:s2:y'];
  if (keys?.length) return keys[keys.length - 1].v as number;
  const s2 = ((c3?.shapes as { id: string; y?: number }[] | undefined) ?? []).find(
    (s) => s.id === 's2',
  );
  return s2?.y ?? 0;
};

/**
 * Where an outcome plays (the user: "the bottom remnant is the base, but when success or error starts it does it like it looks in
 * success-blob ... and comes back to the remnant base"): the strip page moves `shift` CSS px down as it starts (up, if negative), so the
 * strip sits where success-blob shows it, and back as it ends; `map` lays its effects where success-blob shows them, on the moved page.
 * At rest the strip is flow 10.5's remnant, on the chat input. success-blob lays its whole piece cover-fitted and centred in its chat
 * area, so in a window shorter than the comp's it sits lower than flow 10.5's remnant
 */
const outcomePlace = (
  box: Rect,
  input: [number, number],
  scale: number,
  stripY: number,
): { map: OutcomeMap; shift: number } => {
  const cover = Math.max(box.width / COMP.w, box.height / COMP.h);
  const restTop = stripOrigin(input, scale)[1];
  const pieceTop = box.top + box.height / 2 - (COMP.h * cover) / 2;
  // (the strip's y on screen, comp px from its comp's top: as success-blob draws it, less as the page draws it at rest)
  const shift = pieceTop - restTop + (stripY + COMP.h) * 0.5 * (cover - scale);
  return { map: outcomeMap(box, input, scale, shift), shift };
};

/** an outcome's data laid again from REF_MAP for `map` */
const placeOutcome = (data: FreshOutcome, map: OutcomeMap): FreshOutcome => {
  const r = map.k / REF_MAP.k;
  const y = (v: number): number => r * (v - REF_MAP.dy) + map.dy;
  // what each kind of placing moves: a shape's value, or its keys'
  const by: Record<'xy' | 'y', Record<string, (v: number) => number>> = {
    xy: { x: (v) => r * (v - REF_MAP.dx) + map.dx, y, s: (v) => v * r },
    y: { y },
  };
  const shape = (sh: Record<string, unknown>): Record<string, unknown> => {
    const how = PLACED[sh.id as string];
    if (!how) return sh;
    // (a shape's size is 1 unless it says)
    const o: Record<string, unknown> = how === 'xy' ? { s: 1, ...sh } : { ...sh };
    for (const [prop, f] of Object.entries(by[how])) {
      const v = o[prop];
      if (typeof v === 'number') o[prop] = f(v);
    }
    return o;
  };
  const K: Record<string, FreshKey[]> = {};
  for (const [key, keys] of Object.entries(data.K)) {
    const m = /^s:([^:]+):(.+)$/.exec(key);
    const how = m && PLACED[m[1]];
    const f = how && m ? by[how][m[2]] : undefined;
    K[key] = f ? keys.map((k) => ({ ...k, v: f(k.v as number) })) : keys;
  }
  return { ...data, before: data.before.map(shape), after: data.after.map(shape), K };
};

const outcomeData = (outcome: Outcome, mode: 'light' | 'dark'): FreshOutcome => {
  if (outcome === 'error') return mode === 'dark' ? errorDark : errorLight;
  return mode === 'dark' ? successDark : successLight;
};

/** the stops a track holds at its end (the strip at rest) */
const stopsAtEnd = (doc: FreshDoc): FreshStops | undefined => {
  const keys = (doc.K as Record<string, FreshKey[]> | undefined)?.stops;
  if (keys?.length) return keys[keys.length - 1].v as FreshStops;
  return doc.p.stops as FreshStops | undefined;
};

const shift = (k: FreshKey, by: number): FreshKey => ({
  ...k,
  t: Math.round((k.t + by) * 1e4) / 1e4,
});

/**
 * The chat's comp with `outcome` spliced onto each of its strip pages' Comp 3 (`comps`: c3, b_c3), its effects where `map` lays
 * them (outcomeMap; at flow 10.5's reference size without one): t0, its start on the strip's clock, and t1, its end (the strip at
 * rest again)
 */
const spliceOutcome = (
  doc: FreshDoc,
  outcome: Outcome,
  mode: 'light' | 'dark',
  comps: readonly string[],
  map?: OutcomeMap,
): { doc: FreshDoc; t0: number; t1: number } => {
  const data = map ? placeOutcome(outcomeData(outcome, mode), map) : outcomeData(outcome, mode);
  const end0 = doc.tl.dur;
  const t0 = end0 + LEAD;
  const t1 = t0 + data.dur;
  const dur = Math.round((t1 + 0.05) * 1e3) / 1e3;
  const withDur = (d: FreshDoc): FreshDoc => ({
    ...d,
    tl: { ...d.tl, dur: Math.max(d.tl.dur, dur) },
  });
  const splice = (d: FreshDoc): FreshDoc => {
    const shapes = (d.shapes as { id: string }[] | undefined) ?? [];
    const at = Math.max(
      0,
      shapes.findIndex((s) => s.id === 's2'),
    );
    const K: Record<string, FreshKey[]> = {
      ...((d.K as Record<string, FreshKey[]> | undefined) ?? {}),
    };
    for (const [key, keys] of Object.entries(data.K)) {
      K[key] = [...(K[key] ?? []), ...keys.map((k) => shift(k, t0))];
    }
    // the Colorama: held at rest to the strip's end (so nothing before it changes), the piece's keys, rest again at its end
    const rest = stopsAtEnd(d);
    if (rest) {
      const ease = [0.33, 0, 0.67, 1];
      K.stops = [
        ...(K.stops ?? []),
        { t: end0, v: rest, e: ease },
        ...data.stops.map(({ rest: isRest, ...k }) => shift(isRest ? { ...k, v: rest } : k, t0)),
        { t: t1, v: rest, e: 'hold' },
      ];
    }
    return withDur({
      ...d,
      shapes: [...shapes.slice(0, at), ...data.before, ...shapes.slice(at), ...data.after],
      K,
    });
  };
  const stack = ((doc.stack as StackEntry[] | undefined) ?? []).map((e) => ({
    ...e,
    doc: comps.includes(e.id) ? splice(e.doc) : withDur(e.doc),
  }));
  return { doc: { ...withDur(doc), stack }, t0, t1 };
};

export { outcomeMap, outcomePlace, spliceOutcome, stripRestY };
export type { Outcome, OutcomeMap };
