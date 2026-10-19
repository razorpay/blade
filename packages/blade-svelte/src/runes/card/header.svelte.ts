import { defineContext } from '../context';
import type { HeaderRegistry } from '../base/header-registry.svelte';

const CARD_HEADERS = defineContext<HeaderRegistry>('blade-card-headers');

/** Called by a Card: a CardHeader inside names it. */
export function provideCardHeaders(registry: HeaderRegistry): void {
  CARD_HEADERS.set(registry);
}

export interface CardHeaderOptions {
  /** The header draws anything: else it registers nothing. */
  hasContent: () => boolean;
  hasTitle: () => boolean;
  hasSubtitle: () => boolean;
  /**
   * Its ids come from elsewhere (an overlay's header passes them): it is
   * not the Card's header.
   */
  isWired: () => boolean;
}

export interface CardHeaderWiring {
  readonly titleId: string | undefined;
  readonly subtitleId: string | undefined;
}

/**
 * A CardHeader directly in a Card: registered with it, so its title names
 * the card (or the card's overlay, when it is clickable). Elsewhere, or
 * wired by an overlay's header, it registers nothing. Call during component
 * initialisation.
 */
export function useCardHeader(options: CardHeaderOptions): CardHeaderWiring {
  const card = CARD_HEADERS.get();
  $effect.pre(() => {
    if (!card || options.isWired() || !options.hasContent()) {
      return undefined;
    }
    return card.add({ title: options.hasTitle(), subtitle: options.hasSubtitle() });
  });
  return {
    get titleId() {
      return card && !options.isWired() ? card.titleId : undefined;
    },
    get subtitleId() {
      return card && !options.isWired() ? card.subtitleId : undefined;
    },
  };
}
