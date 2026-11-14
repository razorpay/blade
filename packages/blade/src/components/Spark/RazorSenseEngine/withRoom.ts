import type { FreshDoc } from './types';

/**
 * The comp, and every comp stacked on it, with `room` more CSS px on every side (at scale 1; comps are made at 2x). The engine
 * draws nothing past a comp's edges, so whatever reaches past them was cut in a hard line: a stretched strip, a page's glow below
 * the window it was made for. A comp's shapes and bands are laid from its middle, so nothing in it moves; there's just room.
 * Place the comp `room` further up and left (x the drawn scale) to keep it where it was.
 */
const withRoom = (doc: FreshDoc, room: { x: number; y: number }): FreshDoc => {
  const grow = (d: FreshDoc): FreshDoc => ({
    ...d,
    comp: { w: d.comp.w + room.x * 4, h: d.comp.h + room.y * 4 },
  });
  const stack = (doc.stack as { doc: FreshDoc }[] | undefined)?.map((e) => ({
    ...e,
    doc: grow(e.doc),
  }));
  return stack ? { ...grow(doc), stack } : grow(doc);
};

export { withRoom };
