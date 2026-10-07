import { onDestroy } from 'svelte';
import type { Attachment } from 'svelte/attachments';
import { createOrderedEntries, registerEntry } from '../base/ordered-entries.svelte';
import type { OrderedEntries, OrderedEntry } from '../base/ordered-entries.svelte';
import { defineContext } from '../context';

/** One Avatar inside an AvatarGroup. */
export type AvatarGroupEntry = OrderedEntry;

/** What an AvatarGroup offers its Avatars. `Shared` is the library's payload (its size, its overlap class). */
export interface AvatarGroupContext<Shared> extends Pick<OrderedEntries<AvatarGroupEntry>, 'register' | 'reorder'> {
  readonly shared: Shared;
  /** The avatar's place in the stack, in document order; -1 before it registers. */
  indexOf(entry: AvatarGroupEntry): number;
  /** Past `maxCount`: the "+N" avatar stands for it. */
  isOverflow(entry: AvatarGroupEntry): boolean;
}

export interface AvatarGroupOptions<Shared> {
  /** How many avatars show before the rest fold into "+N". */
  maxCount: () => number | undefined;
  shared: () => Shared;
}

export interface AvatarGroup<Shared> extends AvatarGroupContext<Shared> {
  /** How many avatars fold into the "+N" one; 0 for none. */
  readonly overflow: number;
}

/**
 * An AvatarGroup's stack: its Avatars register and are read back in
 * document order, so the group knows each one's place (the first sits
 * flush, the rest overlap the one before) and which fold into "+N" past
 * `maxCount`. Call during component initialisation; the component provides
 * the result (`provideAvatarGroup`).
 */
export function createAvatarGroup<Shared>(options: AvatarGroupOptions<Shared>): AvatarGroup<Shared> {
  const entries = createOrderedEntries<AvatarGroupEntry>();
  const count = $derived(entries.ordered.length);
  const overflow = $derived.by(() => {
    const max = options.maxCount();
    return max !== undefined && max >= 0 && count > max ? count - max : 0;
  });
  return {
    get shared() {
      return options.shared();
    },
    get overflow() {
      return overflow;
    },
    register: entries.register,
    reorder: entries.reorder,
    indexOf: entries.indexOf,
    isOverflow(entry) {
      const max = options.maxCount();
      return max !== undefined && overflow > 0 && entries.indexOf(entry) >= max;
    },
  };
}

const AVATAR_GROUP = defineContext<unknown>('blade-avatar-group');

export function provideAvatarGroup<Shared>(group: AvatarGroupContext<Shared>): void {
  AVATAR_GROUP.set(group);
}

export function getAvatarGroup<Shared>(): AvatarGroupContext<Shared> | undefined {
  return AVATAR_GROUP.get() as AvatarGroupContext<Shared> | undefined;
}

/** React's initials: the first two letters of one name, else the first and last names' first letters. */
export function initialsOf(name: string): string {
  const names = name.trim().toUpperCase().split(/\s+/).filter(Boolean);
  if (names.length === 0) {
    return '';
  }
  if (names.length === 1) {
    return names[0].substring(0, 2);
  }
  return names[0][0] + names[names.length - 1][0];
}

export interface AvatarOptions {
  src: () => string | undefined;
}

export interface Avatar {
  /** Past the first in a group: it overlaps the one before. */
  readonly isOverlapping: boolean;
  /** Past the group's `maxCount`: "+N" stands for it. */
  readonly isHidden: boolean;
  /** An image is given and hasn't failed: a broken one falls back, a new `src` gets its chance. */
  readonly showsImage: boolean;
  /** On the image: it failed to load. */
  handleImageError(): void;
  /** On the root: the avatar's place in its group. */
  readonly attach: Attachment<HTMLElement>;
}

/**
 * One Avatar: its place in an AvatarGroup (when inside one) and its image's
 * fallback. Call during component initialisation, with `getAvatarGroup()`.
 */
export function createAvatar<Shared>(
  group: AvatarGroupContext<Shared> | undefined,
  options: AvatarOptions,
): Avatar {
  const registered = registerEntry(group, {});
  onDestroy(registered.unregister);
  let brokenSrc = $state<string>();
  return {
    get isOverlapping() {
      return Boolean(group && group.indexOf(registered.entry) > 0);
    },
    get isHidden() {
      return Boolean(group?.isOverflow(registered.entry));
    },
    get showsImage() {
      const src = options.src();
      return Boolean(src) && src !== brokenSrc;
    },
    handleImageError() {
      brokenSrc = options.src();
    },
    attach: registered.attach,
  };
}
