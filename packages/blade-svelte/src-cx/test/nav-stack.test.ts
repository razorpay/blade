import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import type { ComponentProps } from 'svelte';
import type { Overlays } from '../components/modal/overlays';
import type { Nav } from '../runes/nav-stack/nav';
import ModalStackContent from './fixtures/ModalStackContent.svelte';
import NavStackHarness from './fixtures/NavStackHarness.svelte';
import NavStackScreen from './fixtures/NavStackScreen.svelte';
import { expectClass } from './classes';

function setup(
  props: {
    captureError?: (error: unknown) => void;
    onChange?: (...args: unknown[]) => void;
  } = {}
) {
  let nav: Nav | undefined;
  let overlays: Overlays | undefined;
  const view = render(NavStackHarness, {
    props: {
      ...props,
      onReady: (readyNav: Nav, readyOverlays: Overlays) => {
        nav = readyNav;
        overlays = readyOverlays;
      },
    },
  });
  return { ...view, nav: nav as Nav, overlays: overlays as Overlays };
}

const titles = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('[data-testid="title"]')).map(
    (node) => node.textContent
  );

describe('NavStack', () => {
  it('shows the top screen and settles a pusher with what the screen pops with', () => {
    const { nav, container, getByTestId } = setup();
    nav.push(NavStackScreen, { props: { title: 'Home' }, name: 'home' });
    const handle = nav.push<ComponentProps<typeof NavStackScreen>, string>(
      NavStackScreen,
      { props: { title: 'Card' }, name: 'card' }
    );

    return waitFor(() => expect(titles(container)).toEqual(['Card']))
      .then(() => {
        const screen = getByTestId('title').parentElement;
        expect(screen?.dataset.screen).toBe('card');
        expectClass(screen, 'transition-all');
        expectClass(getByTestId('stack'), 'overflow-hidden');
        return fireEvent.click(getByTestId('done'));
      })
      .then(() => handle.result)
      .then((result) => {
        expect(result).toBe('done');
        expect(nav.depth()).toBe(1);
        return waitFor(() => expect(titles(container)).toEqual(['Home']));
      });
  });

  it('the first screen does not slide; later ones enter from their side', () => {
    const { nav, container } = setup();
    nav.push(NavStackScreen, { props: { title: 'Home' }, name: 'home' });

    return waitFor(() => expect(titles(container)).toEqual(['Home']))
      .then(() => {
        const home = container.querySelector<HTMLElement>('[data-screen]');
        expect(home?.dataset.state).toBe('open');
        expect(home?.dataset.side).toBeUndefined();
        nav.push(NavStackScreen, { props: { title: 'Card' }, name: 'card' });
        return waitFor(() =>
          expect(
            container.querySelector<HTMLElement>('[data-screen="card"]')
          ).toBeTruthy()
        );
      })
      .then(() => {
        const card = container.querySelector<HTMLElement>(
          '[data-screen="card"]'
        );
        expect(card?.dataset.side).toBe('ahead');
        expect(card?.dataset.state).toBe('open');
        expect(document.activeElement).toBe(card);
        nav.pop();
        return waitFor(() => expect(titles(container)).toEqual(['Home']));
      })
      .then(() => {
        const home = container.querySelector<HTMLElement>('[data-screen]');
        expect(home?.dataset.side).toBe('behind');
      });
  });

  it('update passes new props to the mounted screen', () => {
    const { nav, container } = setup();
    const handle = nav.push(NavStackScreen, { props: { title: 'Home' } });
    return waitFor(() => expect(titles(container)).toEqual(['Home'])).then(
      () => {
        handle.update({ title: 'Welcome' });
        return waitFor(() => expect(titles(container)).toEqual(['Welcome']));
      }
    );
  });

  it('a promised screen keeps the current one until it loads', () => {
    const { nav, container, getByTestId } = setup();
    nav.push(NavStackScreen, { props: { title: 'Home' } });
    let load: (value: { default: typeof NavStackScreen }) => void = () => {};
    const pending = new Promise<{ default: typeof NavStackScreen }>(
      (resolve) => {
        load = resolve;
      }
    );
    nav.push(pending, { props: { title: 'Lazy' } });

    return waitFor(() => expect(titles(container)).toEqual(['Home']))
      .then(() => {
        expect(nav.depth()).toBe(2);
        expect(getByTestId('stack').getAttribute('aria-busy')).toBe('true');
        load({ default: NavStackScreen });
        return waitFor(() => expect(titles(container)).toEqual(['Lazy']));
      })
      .then(() => {
        expect(getByTestId('stack').getAttribute('aria-busy')).toBe('false');
      });
  });

  it('a screen that fails to load leaves the stack and is reported', () => {
    const captureError = vi.fn();
    const onLoadError = vi.fn();
    const { nav } = setup({ captureError });
    nav.push(NavStackScreen, { props: { title: 'Home' } });
    const failure = new Error('chunk');
    const handle = nav.push(
      Promise.reject<{ default: typeof NavStackScreen }>(failure),
      { onLoadError }
    );

    return handle.result.then((result) => {
      expect(result).toBeUndefined();
      expect(nav.depth()).toBe(1);
      expect(onLoadError).toHaveBeenCalledWith(failure);
      expect(captureError).toHaveBeenCalledWith(failure);
    });
  });

  it('replace leaves only the new screen', () => {
    const { nav, container } = setup();
    nav.push(NavStackScreen, { props: { title: 'Home' } });
    nav.push(NavStackScreen, { props: { title: 'Card' } });
    nav.replace(NavStackScreen, { props: { title: 'Status' } });

    expect(nav.depth()).toBe(1);
    return waitFor(() => expect(titles(container)).toEqual(['Status']));
  });

  it('popTo returns to a named screen', () => {
    const { nav, container } = setup();
    nav.push(NavStackScreen, { props: { title: 'Home' }, name: 'home' });
    nav.push(NavStackScreen, { props: { title: 'Card' }, name: 'card' });
    nav.push(NavStackScreen, { props: { title: 'OTP' }, name: 'otp' });

    expect(nav.popTo('home')).toBe(true);
    expect(nav.popTo('missing')).toBe(false);
    return waitFor(() => expect(titles(container)).toEqual(['Home']));
  });

  it('back: a screen may veto, the stack pops, and the root is the app’s', () => {
    const { nav } = setup();
    let isGuarded = true;
    nav.push(NavStackScreen, { props: { title: 'Home' } });
    nav.push(NavStackScreen, {
      props: { title: 'Card' },
      onBack: () => (isGuarded ? true : undefined),
    });

    expect(nav.back()).toBe(true);
    expect(nav.depth()).toBe(2);
    isGuarded = false;
    expect(nav.back()).toBe(true);
    expect(nav.depth()).toBe(1);
    expect(nav.back()).toBe(false);
    expect(nav.depth()).toBe(1);
  });

  it('a screen answers back for itself', () => {
    const { nav, container } = setup();
    nav.push(NavStackScreen, { props: { title: 'Home' } });
    nav.push(NavStackScreen, { props: { title: 'Card', isGuarded: true } });

    return waitFor(() => expect(titles(container)).toEqual(['Card'])).then(
      () => {
        expect(nav.back()).toBe(true);
        expect(nav.depth()).toBe(2);
      }
    );
  });

  it('back closes an open modal before it pops a screen', () => {
    const { nav, overlays, getByTestId, queryByTestId } = setup();
    nav.push(NavStackScreen, { props: { title: 'Home' } });
    nav.push(NavStackScreen, { props: { title: 'Card' } });
    overlays.openModal(ModalStackContent, {
      props: { bank: 'HDFC' },
      testID: 'notice',
    });

    return waitFor(() => expect(getByTestId('notice')).toBeTruthy())
      .then(() => {
        expect(nav.back()).toBe(true);
        expect(nav.depth()).toBe(2);
        return waitFor(() => expect(queryByTestId('notice')).toBeNull());
      })
      .then(() => {
        expect(nav.back()).toBe(true);
        expect(nav.depth()).toBe(1);
      });
  });

  it('reports the screen on show and the direction it came from', () => {
    const onChange = vi.fn();
    const { nav } = setup({ onChange });
    nav.push(NavStackScreen, { props: { title: 'Home' }, name: 'home' });
    nav.push(NavStackScreen, { props: { title: 'Card' }, name: 'card' });

    return waitFor(() =>
      expect(onChange.mock.lastCall?.[0]?.entry.name).toBe('card')
    )
      .then(() => {
        expect(onChange.mock.lastCall?.[1]).toBe('forward');
        nav.pop();
        return waitFor(() =>
          expect(onChange.mock.lastCall?.[0]?.entry.name).toBe('home')
        );
      })
      .then(() => {
        expect(onChange.mock.lastCall?.[1]).toBe('back');
      });
  });
});
