import type { Attachment } from 'svelte/attachments';
import type { NavDirectionSource } from './nav';

type NativeElement = HTMLElement & {
  animateNative?: (props: Record<string, unknown>, duration: number) => void;
};

export interface NativeNavScreenOptions {
  nav: () => NavDirectionSource;
  /** The first screen does not slide in. */
  isFirst: () => boolean;
  /** Motion durations, ms. */
  enter: () => number;
  exit: () => number;
}

/**
 * The native screen's slide. Native plays an exit after the element
 * unmounts, from the `exit` spec it carries by then — so every change of
 * direction re-declares it. Goes on the screen element.
 */
export function nativeNavSlide(options: NativeNavScreenOptions): Attachment<NativeElement> {
  function exitSpec(isForward: boolean): string {
    return JSON.stringify({
      props: {
        translateX: { from: '0', to: isForward ? '-100%' : '100%' },
        opacity: { from: '1', to: '0' },
      },
      duration: options.exit(),
      easing: 'expoOut',
      position: 'absolute',
    });
  }

  return (node) => {
    const nav = options.nav();
    if (!options.isFirst()) {
      node.animateNative?.(
        {
          $easing: 'expoOut',
          translateX: {
            from: nav.direction === 'forward' ? '100%' : '-100%',
            to: '0',
          },
        },
        options.enter(),
      );
    }
    node.setAttribute('exit', exitSpec(nav.direction === 'forward'));
    return nav.onDirection((next) => {
      node.setAttribute('exit', exitSpec(next === 'forward'));
    });
  };
}
