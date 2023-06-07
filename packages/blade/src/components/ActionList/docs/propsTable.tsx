import type { ActionListItemProps, ActionListSectionProps } from '../ActionListItem';
import type { ActionListProps } from '../ActionList';
import { Code } from '~components/Typography';
import { ScrollLink } from '~src/_helpers/storybook/ScrollLink';

type PropsTableType<T> = Record<
  keyof Omit<T, 'testID' | '_hideDivider' | '_index'>,
  string | JSX.Element | { note: string; type: string | JSX.Element }
>;
const actionListPropsTables: {
  ActionList: PropsTableType<ActionListProps>;
  ActionListItem: PropsTableType<ActionListItemProps>;
  ActionListSection: PropsTableType<ActionListSectionProps>;
} = {
  ActionList: {
    surfaceLevel: '2 | 3',
    children: (
      <>
        <ScrollLink href="#actionlistitem">&lt;ActionListItem[] /&gt;</ScrollLink> |{' '}
        <ScrollLink href="#actionlistsection">&lt;ActionListSection[] /&gt;</ScrollLink>
      </>
    ),
  },
  ActionListItem: {
    title: 'string',
    description: 'string',
    value: 'string',
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
