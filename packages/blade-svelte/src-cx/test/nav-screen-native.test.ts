import { describe, it, expect, vi } from 'vitest';
import { createRawSnippet } from 'svelte';
import { render } from '@testing-library/svelte';
import NavScreenNative from '../components/nav-stack/NavScreen.native.svelte';
import { createNav } from '../runes/nav-stack/nav';
import type { NavDirection, NavDirectionSource } from '../runes/nav-stack/nav';
import { nativeNavSlide } from '../runes/nav-stack/screen.svelte';
import { resolveNavStack } from '../components/nav-stack';
import type { RenderResult } from '@testing-library/svelte';
import type { Mock } from 'vitest';

const children = createRawSnippet(() => ({
  render: () => '<p>Content</p>',
}));

/** A nav that only turns: what NavScreen reads of it. */
function turnable(): NavDirectionSource & { turn(next: NavDirection): void } {
  const listeners = new Set<(direction: NavDirection) => void>();
  const nav = {
    direction: 'forward' as NavDirection,
    onDirection(listener: (direction: NavDirection) => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    turn(next: NavDirection) {
      nav.direction = next;
      listeners.forEach((listener) => listener(next));
    },
  };
  return nav;
}

function setup(
  isFirst: boolean,
): RenderResult<typeof NavScreenNative> & {
  screen: HTMLElement;
  nav: ReturnType<typeof turnable>;
  animateNative: Mock;
} {
  const nav = turnable();
  const animateNative = vi.fn();
  Object.assign(HTMLElement.prototype, { animateNative });
  const view = render(NavScreenNative, {
    props: {
      name: 'card',
      nav,
      isFirst,
      classes: resolveNavStack({}),
      children,
    },
  });
  const screen = view.container.querySelector<HTMLElement>('[data-screen="card"]')!;
  return { ...view, screen, nav, animateNative };
}

const exitTo = (screen: HTMLElement): number =>
  JSON.parse(screen.getAttribute('exit') ?? '{}').props.translateX.to;

// The platform plays the exit after the element is gone, from the spec it
// carries by then: what JS owes it is that spec, kept current.
describe('NavScreen.native', () => {
  it('slides in, and re-declares its exit when the direction turns', () => {
    const { screen, nav, animateNative } = setup(false);
    expect(animateNative).toHaveBeenCalledWith(
      expect.objectContaining({ translateX: { from: '100%', to: '0' } }),
      400,
    );
    expect(exitTo(screen)).toBe('-100%');
    nav.turn('back');
    expect(exitTo(screen)).toBe('100%');
  });

  it('a pop re-declares the leaving screen’s exit before the stack changes', () => {
    const nav = createNav();
    const Screen = (() => undefined) as never;
    nav.push(Screen, { name: 'a' });
    nav.push(Screen, { name: 'b' });
    const writes: string[] = [];
    const node = ({
      setAttribute: (_name: string, value: string) => {
        writes.push(
          `${value.includes('100%') && !value.includes('-100%') ? 'back' : 'forward'}:${
            nav.entries.length
          }`,
        );
      },
    } as unknown) as HTMLElement;
    const stop = nativeNavSlide({
      nav: () => nav,
      isFirst: () => false,
      enter: () => 0,
      exit: () => 0,
    })(node);
    nav.pop();
    // The exit for a backward move was written while both screens were
    // still on the stack: the platform plays it from the spec it carries.
    expect(writes).toEqual(['forward:2', 'back:2']);
    stop?.();
  });

  it('the first screen does not slide in', () => {
    const { animateNative, screen } = setup(true);
    expect(animateNative).not.toHaveBeenCalled();
    expect(exitTo(screen)).toBe('-100%');
  });
});
