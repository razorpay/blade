/**
 * The parts NavStack reads its classes by. One screen is mounted at a time;
 * while one replaces another both exist, and each is stamped with
 * `data-state="open" | "closed"` and `data-side="ahead" | "behind"` — where
 * the screen sits relative to the one on show. A push brings the new screen
 * in from `ahead` and sends the old one `behind`; a pop is the reverse. The
 * CSS transitions key on the pair; the leaving screen stays mounted for its
 * longest computed transition, so `motion-reduce:transition-none` swaps at
 * once.
 */
export interface NavStackClasses {
  root: string;
  screen: string;
  /** Native has no computed styles: the slide's lengths, in ms. */
  nativeMotion: { enter: number; exit: number };
}

/** Style props in, the parts out. */
export type NavStackStyleResolver<P> = (props: P) => NavStackClasses;

/** No axes: the motion differs by breakpoint, not by prop. */
export const NAV_STACK_AXES = {} as const;
export type NavStackStyleProps = Record<never, never>;

// Ported from app/v2/modules/navstack/components/MainStack.svelte: a full
// slide on mobile, a short drift with a fade on desktop; 400ms in, 350ms
// out in v2, Blade's `xmoderate` (360ms) both ways here, expo-out. The leaving screen steps out of the flow so the two overlap.
const SCREEN = [
  'flex min-h-0 w-full flex-1 flex-col outline-none transition-all',
  'duration-xmoderate [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
  'data-[state=closed]:absolute data-[state=closed]:inset-0 data-[state=closed]:duration-xmoderate',
  'data-[state=closed]:data-[side=ahead]:translate-x-full',
  'data-[state=closed]:data-[side=behind]:-translate-x-full',
  'm:data-[state=closed]:opacity-0',
  'm:data-[state=closed]:data-[side=ahead]:translate-x-5',
  'm:data-[state=closed]:data-[side=behind]:-translate-x-5',
].join(' ');

export const resolveNavStack: NavStackStyleResolver<
  NavStackStyleProps
> = () => ({
  root: 'relative flex min-h-0 w-full flex-1 flex-col overflow-hidden',
  screen: SCREEN,
  nativeMotion: { enter: 400, exit: 350 },
});
