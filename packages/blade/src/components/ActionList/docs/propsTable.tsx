import type { ActionListItemProps, ActionListSectionProps } from '../ActionListItem';
import type { ActionListProps } from '../ActionList';
import { Code } from '~components/Typography';
import { ScrollLink } from '~utils/storybook/ScrollLink';

type PropsTableType<T> = Record<
  keyof Omit<T, 'testID' | '_hideDivider' | '_sectionChildValues' | '_index'>,
  string | React.ReactElement | { note: string; type: string | React.ReactElement }
>;
const actionListPropsTables: {
  ActionList: PropsTableType<ActionListProps>;
  ActionListItem: PropsTableType<ActionListItemProps>;
  ActionListSection: PropsTableType<ActionListSectionProps>;
} = {
  ActionList: {
    children: (
      <>
        <ScrollLink href="#actionlistitem">&lt;ActionListItem[] /&gt;</ScrollLink> |{' '}
        <ScrollLink href="#actionlistsection">&lt;ActionListSection[] /&gt;</ScrollLink>
      </>
    ),
    isVirtualized: {
      note:
        'Currently only works in ActionList with static height items (items without description) and when ActionList has more than 10 items',
      type: 'boolean',
    },
  },
  ActionListItem: {
    title: 'string',
    description: 'string',
    value: 'string',
    titleSuffix: (
      <>
        <ScrollLink href="#actionlistitembadge">&lt;ActionListItemBadge /&gt;</ScrollLink> |{' '}
        <ScrollLink href="#actionlistitembadgegroup">&lt;ActionListItemBadgeGroup /&gt;</ScrollLink>
      </>
    ),
    leading: (
      <>
        <ScrollLink href="#actionlistitemicon">&lt;ActionListItemIcon /&gt;</ScrollLink> |{' '}
        <ScrollLink href="#actionlistitemasset">&lt;ActionListItemAsset /&gt;</ScrollLink>
      </>
    ),
    trailing: (
      <>
        <ScrollLink href="#actionlistitemicon">&lt;ActionListItemIcon /&gt;</ScrollLink> |{' '}
        <ScrollLink href="#actionlistitemtext">&lt;ActionListItemText /&gt;</ScrollLink>
      </>
    ),
    isDisabled: 'boolean',
    intent: {
      note: 'For non-select menu triggers',
      type: "undefined | 'negative'",
    },
    href: {
      note: 'For non-select menu triggers',
      type: 'string',
    },
    target: 'string',
    onClick: {
      note: 'For controlled menu',
      type: <Code>{'({name, value}) => {}'}</Code>,
    },
    isSelected: { note: 'For controlled menu', type: 'boolean' },
  },
  ActionListSection: {
    title: 'string',
    children: <ScrollLink href="#actionlistitem">&lt;ActionListItem[] /&gt;</ScrollLink>,
  },
};

export { actionListPropsTables };
