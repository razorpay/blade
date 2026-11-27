import { outcomeMap, spliceOutcome } from '../outcome';
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

describe('outcomeMap: the splash laid as flow 10.5 lays it, for the window it plays in', () => {
  // flow 10.5's own s1Map, read off its page after "success 2" (its chat panel #chat, its chat input #cfield), at two window sizes
  const flow = [
    {
      window: '1512 x 982',
      box: { left: 54, top: 48, width: 1452, height: 928 },
      input: { left: 360, width: 840, bottom: 931 },
      map: { k: 0.9603174603174603, dx: 62, dy: 42 },
    },
    {
      window: '1440 x 800',
      box: { left: 54, top: 48, width: 1380, height: 746 },
      input: { left: 324, width: 840, bottom: 749 },
      map: { k: 0.9126984126984127, dx: 62, dy: 224 },
    },
  ];

  it.each(flow)('is flow 10.5’s own at $window', ({ box, input, map }) => {
    // (the anchor: the chat input's middle across, its 60 px bar's top)
    const m = outcomeMap(box, [input.left + input.width / 2, input.bottom - 60], 1);
    expect(m.k).toBeCloseTo(map.k, 6);
    expect(m.dx).toBeCloseTo(map.dx, 3);
    expect(m.dy).toBeCloseTo(map.dy, 3);
  });

  const splash = (doc: FreshDoc): { y: number; s: number } => {
    const c3 = comp(doc, 'c3');
    const s = ((c3.shapes as { id: string; y: number; s: number }[]) ?? []).find(
      (x) => x.id === 'eSplash',
    );
    if (!s) throw new Error('no splash');
    return s;
  };

  it('leaves the piece as made at flow 10.5’s reference size, and lays it lower in a shorter window, as flow 10.5 does', () => {
    const made = spliceOutcome(chatLight, 'success', 'light', ['c3', 'b_c3']).doc;
    const [ref, short] = flow.map(
      ({ box, input }) =>
        spliceOutcome(chatLight, 'success', 'light', ['c3', 'b_c3'], {
          ...outcomeMap(box, [input.left + input.width / 2, input.bottom - 60], 1),
        }).doc,
    );
    expect(splash(ref).y).toBeCloseTo(splash(made).y, 6);
    expect(splash(ref).s).toBeCloseTo(splash(made).s, 6);
    // (comp px from the middle, down: further down, and a little smaller)
    expect(splash(short).y).toBeGreaterThan(splash(made).y + 100);
    expect(splash(short).s).toBeLessThan(splash(made).s);
    // the splash's growth keyed smaller by the same map; the strip itself untouched
    const grows = (doc: FreshDoc): number[] =>
      keys(comp(doc, 'c3'))['s:eSplash:s'].map((k) => k.v as number);
    grows(short).forEach((v, i) => expect(v).toBeLessThan(grows(made)[i]));
    expect(keys(comp(short, 'c3'))['s:s2:y']).toEqual(keys(comp(made, 'c3'))['s:s2:y']);
    // the halves (the strip's swell) stay on the strip, their swell shorter: at the reference size as success-blob draws it (its piece
    // at 0.96), and shorter still in a shorter window, its top where success-blob's is
    const half = (doc: FreshDoc): number =>
      ((comp(doc, 'c3').shapes as { id: string; y: number }[]) ?? []).find((x) => x.id === 'eHalfL')
        ?.y ?? NaN;
    expect(half(short)).toBe(half(made));
    const swell = (doc: FreshDoc): number[] =>
      keys(comp(doc, 'c3'))['s:eHalfL:sy'].map((k) => k.v as number);
    swell(ref).forEach((v, i) => expect(v).toBeCloseTo(swell(made)[i] * 0.9603, 3));
    swell(short).forEach((v, i) => expect(v).toBeLessThan(swell(ref)[i] - 1));
    // (the swell's top, comp px from the middle: success-blob's at 1440 x 800, its whole piece at k round the chat's box)
    const k = 0.9126984126984127;
    const raw = (half(made) - 42) / 0.9603174603174603;
    swell(short).forEach((v, i) =>
      expect(half(short) - 100 * v).toBeCloseTo(k * (raw - 100 * swell(made)[i]) + 224, 1),
    );
  });
});
