import { errorDark, errorLight, successDark, successLight } from './outcomeComps';
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
 * The chat's comp with `outcome` spliced onto each of its strip pages' Comp 3 (`comps`: c3, b_c3): t0, its start on the strip's clock,
 * and t1, its end (the strip at rest again)
 */
const spliceOutcome = (
  doc: FreshDoc,
  outcome: Outcome,
  mode: 'light' | 'dark',
  comps: readonly string[],
): { doc: FreshDoc; t0: number; t1: number } => {
  const data = outcomeData(outcome, mode);
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

export { spliceOutcome };
export type { Outcome };
