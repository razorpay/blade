import { FilmHost } from './FilmHost';

/**
 * Ray's films, kept warm for a moment and handed from Ray to Ray, as the Spark buttons' stages are (useLazyLayer's stagePool). A
 * film's start is the costly part of a Ray that appears: its script mounted, its first pass simulated (51 ms at 4x CPU on a Mac for
 * Searching's), and Searching's WebGL lens made and its program built. An Investigate button's Ray is made on each hover, so a
 * pointer sweeping a table made all of that each time: a new WebGL context a hover, and 50-85 ms frames at 4x CPU (#4101's device
 * test). A film let go of isn't disposed at once: it's parked (asleep, out of the page) for LINGER_MS, and the next Ray wanting
 * the same film takes it, ready, with its script, its first pass and its lens kept (filmHost.adopt).
 *
 * The page's GPU stays capped: at most one of each film is parked, MAX_PARKED in all (the oldest is let go first), a Ray takes a
 * parked film before any new one is made, and a film with a WebGL context (Searching's lens) is parked only while the page holds
 * MAX_LENSES of them at most, parked ones included: as many as the hovers that may hold a Ray at once (#4101's slots, 3).
 */
const LINGER_MS = 1500;
const MAX_PARKED = 2;
const MAX_LENSES = 3;

type Parked = { id: string; host: FilmHost; parkedAt: number };

const parked: Parked[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

/** lets go of the films parked longer than LINGER_MS, and looks again while any are left */
const freeLingering = (): void => {
  timer = null;
  const now = performance.now();
  for (let i = parked.length - 1; i >= 0; i--) {
    if (now - parked[i].parkedAt >= LINGER_MS) parked.splice(i, 1)[0].host.dispose();
  }
  if (parked.length) {
    const next = Math.min(...parked.map((p) => p.parkedAt + LINGER_MS - now));
    timer = setTimeout(freeLingering, Math.max(0, next) + 1);
  }
};

/** A film its Ray has let go of: parked for the next Ray, or disposed (one that failed a frame, or one already parked). */
const parkFilm = (id: string, host: FilmHost): void => {
  if (
    !host.canPark ||
    parked.some((p) => p.id === id) ||
    (host.hasLens && FilmHost.lenses > MAX_LENSES)
  ) {
    host.dispose();
    return;
  }
  while (parked.length >= MAX_PARKED) parked.shift()!.host.dispose();
  host.park();
  parked.push({ id, host, parkedAt: performance.now() });
  if (!timer) timer = setTimeout(freeLingering, LINGER_MS + 1);
};

/** The film `id` parked by another Ray, taken out of the pool (the taker adopts it), or null. */
const takeFilm = (id: string): FilmHost | null => {
  const i = parked.findIndex((p) => p.id === id);
  return i >= 0 ? parked.splice(i, 1)[0].host : null;
};

/** How many films are parked (the tests). */
const parkedFilms = (): number => parked.length;

export { parkFilm, takeFilm, parkedFilms, LINGER_MS as FILM_LINGER_MS };
