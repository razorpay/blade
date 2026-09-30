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
import { makeSpace, makeBorderSize, makeTypographySize } from '~utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { BladeElementRef } from '~utils/types';

type StyledRowProps = {
  isInteractive: boolean;
  isSelected: boolean;
  isDisabled: boolean;
};

const StyledCardGroupItem = styled.div<StyledRowProps>(
  ({ theme, isInteractive, isSelected, isDisabled }) => {
    // Rings are inset so the group's `overflow: hidden` does not clip them.
    const selectedRing = `inset 0 0 0 ${makeBorderSize(theme.border.width.thick)} ${
      theme.colors.surface.border.primary.normal
    }`;
    const focusRing = `inset 0 0 0 ${makeSpace(theme.spacing[2])} ${
      theme.colors.interactive.border.primary.faded
    }`;

    return {
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      gap: makeSpace(theme.spacing[3]),
      width: '100%',
      padding: makeSpace(theme.spacing[5]),
      margin: 0,
      border: 'none',
      textAlign: 'left',
      textDecoration: 'none',
      fontFamily: theme.typography.fonts.family.text,
      fontSize: makeTypographySize(theme.typography.fonts.size[100]),
      fontWeight: theme.typography.fonts.weight.medium,
      lineHeight: makeTypographySize(theme.typography.lineHeights[100]),
      color: theme.colors.surface.text.gray.normal,
      backgroundColor: isDisabled
        ? theme.colors.interactive.background.gray.disabled
        : 'transparent',
      cursor: isDisabled ? 'not-allowed' : isInteractive ? 'pointer' : 'default',
      opacity: isDisabled ? 0.5 : 1,
      boxShadow: isSelected ? selectedRing : undefined,
      // Selected/focused rows sit above the group's border overlay
      // (StyledCardGroupSurface ::after) so their ring replaces the gray border.
      ...(isSelected ? { position: 'relative', zIndex: 2 } : {}),
      // Selected rows keep the plain surface on hover; the ring is the whole affordance.
      '&:hover':
        isInteractive && !isDisabled && !isSelected
          ? { backgroundColor: theme.colors.surface.background.gray.moderate }
          : undefined,
      '&:focus-visible': {
        outline: 'none',
        position: 'relative',
        zIndex: 2,
        boxShadow: isSelected ? `${selectedRing}, ${focusRing}` : focusRing,
      },
    };
  },
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
