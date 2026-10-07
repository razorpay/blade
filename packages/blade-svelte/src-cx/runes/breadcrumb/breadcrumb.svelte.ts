import { onDestroy } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { createOrderedEntries, registerEntry } from '../base/ordered-entries.svelte';
import type { OrderedEntry } from '../base/ordered-entries.svelte';
import { defineContext } from '../context';

/** What a Breadcrumb offers its items. `Shared` is the library's payload (size, colour, classes). */
export interface BreadcrumbContext<Shared> {
  readonly shared: Shared;
  register(entry: OrderedEntry): () => void;
  reorder(): void;
  /** The item is the trail's last: no separator after it, unless asked for. */
  isLast(entry: OrderedEntry): boolean;
}

export interface BreadcrumbOptions<Shared> {
  shared: () => Shared;
}

/**
 * A Breadcrumb's trail: its items register and are read back in document
 * order, so each knows whether it's the last (the separator goes between
 * items). Call during component initialisation; provide the result.
 */
export function createBreadcrumb<Shared>(options: BreadcrumbOptions<Shared>): BreadcrumbContext<Shared> {
  const entries = createOrderedEntries<OrderedEntry>();
  return {
    get shared() {
      return options.shared();
    },
    register: entries.register,
    reorder: entries.reorder,
    isLast(entry) {
      const ordered = entries.ordered;
      return ordered.length > 0 && ordered[ordered.length - 1] === entry;
    },
  };
}

export interface BreadcrumbItem {
  /** The trail's last item. */
  readonly isLast: boolean;
  /** On the item's `<li>`: its place in the trail. */
  readonly attach: Attachment<HTMLElement>;
}

/** One item's place in its Breadcrumb. Call during component initialisation. */
export function createBreadcrumbItem<Shared>(host: BreadcrumbContext<Shared> | undefined): BreadcrumbItem {
  const registered = registerEntry(host, {});
  onDestroy(registered.unregister);
  return {
    get isLast() {
      return host ? host.isLast(registered.entry) : true;
    },
    attach: registered.attach,
  };
}

const BREADCRUMB = defineContext<unknown>('blade-breadcrumb');

export function provideBreadcrumb<Shared>(breadcrumb: BreadcrumbContext<Shared>): void {
  BREADCRUMB.set(breadcrumb);
}

export function getBreadcrumb<Shared>(): BreadcrumbContext<Shared> | undefined {
  return BREADCRUMB.get() as BreadcrumbContext<Shared> | undefined;
}
