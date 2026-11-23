import { spliceOutcome } from '../outcome';
import { chatDark, chatLight } from '../comps';
import { errorLight, successDark, successLight } from '../outcomeComps';
import type { FreshDoc, FreshKey } from '../../RazorSenseEngine/types';

type Entry = { id: string; doc: FreshDoc };
const comp = (doc: FreshDoc, id: string): FreshDoc => {
  const entry = (doc.stack as Entry[]).find((e) => e.id === id);
  if (!entry) throw new Error(`no ${id} in the comp`);
  return entry.doc;
};
const shapeIds = (doc: FreshDoc): string[] =>
  ((doc.shapes as { id: string }[] | undefined) ?? []).map((s) => s.id);
const keys = (doc: FreshDoc): Record<string, FreshKey[]> =>
  (doc.K as Record<string, FreshKey[]> | undefined) ?? {};

describe('spliceOutcome', () => {
  it("puts the piece after the strip's own end, on both strip pages, and lengthens every comp's timeline", () => {
    const { doc, t0, t1 } = spliceOutcome(chatLight, 'success', 'light', ['c3', 'b_c3']);
    expect(t0).toBeGreaterThan(chatLight.tl.dur);
    expect(t1 - t0).toBeCloseTo(successLight.dur, 5);
    expect(doc.tl.dur).toBeGreaterThanOrEqual(t1);
    for (const e of doc.stack as Entry[]) expect(e.doc.tl.dur).toBeGreaterThanOrEqual(t1);
    for (const id of ['c3', 'b_c3']) {
      const ids = shapeIds(comp(doc, id));
      // the splash and its ring behind the strip, the halves over it
      expect(ids.indexOf('eSplash')).toBeLessThan(ids.indexOf('s2'));
      expect(ids.indexOf('eRing')).toBeLessThan(ids.indexOf('s2'));
      expect(ids.indexOf('eHalfL')).toBeGreaterThan(ids.indexOf('s2'));
    }
    // (the base is left as it was)
    expect(shapeIds(comp(chatLight, 'c3'))).not.toContain('eSplash');
  });

  it("leaves the strip at rest as it was: nothing of the piece shows at or before the strip's end", () => {
    const { doc, t0 } = spliceOutcome(chatDark, 'error', 'dark', ['c3', 'b_c3']);
    const K = keys(comp(doc, 'c3'));
    for (const id of ['eSplash', 'eRing', 'eHalfL', 'eHalfR']) {
      const op = K[`s:${id}:op`];
      expect(op[0].t).toBeGreaterThan(chatDark.tl.dur);
      expect(op[0].v).toBe(0);
    }
    // every key of the piece is after the strip's end, but the Colorama's hold at it
    for (const [key, track] of Object.entries(K)) {
      if (!key.startsWith('s:e')) continue;
      for (const k of track) expect(k.t).toBeGreaterThanOrEqual(t0 - 0.011);
    }
  });

  it("ends the Colorama at the strip's own rest colour, the same as its end before it", () => {
    const { doc, t1 } = spliceOutcome(chatLight, 'success', 'light', ['c3']);
    const before = keys(comp(chatLight, 'c3')).stops;
    const after = keys(comp(doc, 'c3')).stops;
    const rest = before[before.length - 1].v;
    expect(after.slice(0, before.length)).toEqual(before);
    expect(after[after.length - 1]).toEqual({ t: t1, v: rest, e: 'hold' });
    // its rest keys took the strip's colour; its colour keys are the piece's
    const piece = after.slice(before.length + 1, -1);
    expect(piece.filter((k) => k.v === rest)).toHaveLength(
      successLight.stops.filter((k) => k.rest).length,
    );
  });

  it('keeps light and dark their own tunings', () => {
    expect(successLight).not.toEqual(successDark);
    expect(JSON.stringify(successLight.K)).not.toEqual(JSON.stringify(errorLight.K));
  });
});
