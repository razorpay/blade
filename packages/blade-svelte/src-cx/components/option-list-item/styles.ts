/** One look: no style axes yet. */
export type OptionListItemStyleProps = Record<never, never>;

export interface OptionListItemClasses {
  root: string;
  leading: string;
  text: string;
  title: string;
  description: string;
  trailing: string;
}

export function resolveOptionListItem(): OptionListItemClasses {
  return {
    root: 'flex w-full min-w-0 items-center gap-3',
    // Blade's ActionList item: the leading icon is
    // `interactive.icon.gray.normal` — the row's text colour, so it inherits.
    leading: 'flex shrink-0 items-center',
    text: 'flex min-w-0 flex-1 flex-col',
    // No colour of its own: the row's pick state colours the title.
    title: 'truncate text-100 leading-100',
    description: 'text-75 leading-50 text-interactive-gray-muted',
    trailing: 'flex shrink-0 items-center text-75 leading-50 text-interactive-gray-muted',
  };
}
