import React from 'react';
import styled from 'styled-components';
import type { CardGroupItemProps } from './types';
import { ComponentIds } from './componentIds';
import { useCardGroupItem } from './useCardGroupItem';
import BaseBox from '~components/Box/BaseBox';
import { ChevronRightIcon, ChevronDownIcon } from '~components/Icons';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { makeSpace, makeSize, makeBorderSize } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { BladeElementRef } from '~utils/types';

type StyledRowProps = {
  isInteractive: boolean;
  isSelected: boolean;
  isDisabled: boolean;
};

const StyledCardGroupItem = styled.div<StyledRowProps>(
  ({ theme, isInteractive, isSelected, isDisabled }) => ({
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    gap: makeSpace(theme.spacing[4]),
    width: '100%',
    minHeight: makeSize(56),
    padding: `${makeSpace(theme.spacing[4])} ${makeSpace(theme.spacing[5])}`,
    margin: 0,
    border: 'none',
    textAlign: 'left',
    textDecoration: 'none',
    fontFamily: theme.typography.fonts.family.text,
    color: theme.colors.surface.text.gray.normal,
    backgroundColor: isSelected ? theme.colors.surface.background.primary.subtle : 'transparent',
    cursor: isInteractive && !isDisabled ? 'pointer' : 'default',
    opacity: isDisabled ? 0.5 : 1,
    '&:hover':
      isInteractive && !isDisabled
        ? { backgroundColor: theme.colors.surface.background.gray.moderate }
        : undefined,
    '&:focus-visible': {
      outline: 'none',
      boxShadow: `inset 0 0 0 ${makeBorderSize(theme.border.width.thicker)} ${
        theme.colors.surface.border.primary.normal
      }`,
    },
  }),
);

const ChevronWrapper = styled.span<{ isExpanded: boolean }>(({ isExpanded }) => ({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  transition: 'transform 200ms ease',
  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
}));

const _CardGroupItem = (
  {
    children,
    leading,
    trailing,
    href,
    target,
    rel,
    onClick,
    isSelected = false,
    isDisabled = false,
    accessibilityLabel,
    testID,
    ...rest
  }: CardGroupItemProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const {
    isTrigger,
    isNavigation,
    isInteractive,
    isExpanded,
    collapsibleBodyId,
    handlePress,
  } = useCardGroupItem({ href, onClick, isSelected, isDisabled });

  const element = isNavigation
    ? 'a'
    : isTrigger || Boolean(onClick) || isSelected
    ? 'button'
    : 'div';

  const a11yProps = isTrigger
    ? makeAccessible({
        expanded: isExpanded,
        controls: collapsibleBodyId,
        label: accessibilityLabel,
      })
    : makeAccessible({ label: accessibilityLabel });

  return (
    <StyledCardGroupItem
      ref={ref as never}
      as={element}
      isInteractive={isInteractive}
      isSelected={Boolean(isSelected)}
      isDisabled={Boolean(isDisabled)}
      href={isNavigation && !isDisabled ? href : undefined}
      target={isNavigation && !isDisabled ? target : undefined}
      rel={isNavigation && !isDisabled ? rel : undefined}
      type={element === 'button' ? 'button' : undefined}
      disabled={element === 'button' ? isDisabled : undefined}
      aria-disabled={isDisabled ? true : undefined}
      aria-current={isSelected ? true : undefined}
      onClick={handlePress}
      {...a11yProps}
      {...metaAttribute({ name: MetaConstants.CardGroupItem, testID })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      {leading ? (
        <BaseBox display="flex" alignItems="center" flexShrink={0}>
          {leading}
        </BaseBox>
      ) : null}

      <BaseBox flex="1 1 auto" minWidth="0px">
        {children}
      </BaseBox>

      {trailing ? (
        <BaseBox display="flex" alignItems="center" flexShrink={0}>
          {trailing}
        </BaseBox>
      ) : null}

      {isNavigation ? (
        <ChevronWrapper isExpanded={false}>
          <ChevronRightIcon size="medium" color="surface.icon.gray.subtle" />
        </ChevronWrapper>
      ) : isTrigger ? (
        <ChevronWrapper isExpanded={isExpanded}>
          <ChevronDownIcon size="medium" color="surface.icon.gray.subtle" />
        </ChevronWrapper>
      ) : null}
    </StyledCardGroupItem>
  );
};

const CardGroupItem = assignWithoutSideEffects(React.forwardRef(_CardGroupItem), {
  displayName: 'CardGroupItem',
  componentId: ComponentIds.CardGroupItem,
});

export { CardGroupItem };
