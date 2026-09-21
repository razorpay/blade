import React from 'react';
import styled from 'styled-components/native';
import { Pressable, View, Linking } from 'react-native';
import type { CardGroupItemProps } from './types';
import { ComponentIds } from './componentIds';
import { useCardGroupItem } from './useCardGroupItem';
import BaseBox from '~components/Box/BaseBox';
import { ChevronRightIcon, ChevronDownIcon } from '~components/Icons';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import type { BladeElementRef } from '~utils/types';

type StyledRowProps = {
  isSelected: boolean;
  isDisabled: boolean;
};

const StyledCardGroupItem = styled(Pressable)<StyledRowProps>(
  ({ theme, isSelected, isDisabled }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: theme.spacing[4],
    width: '100%',
    minHeight: 56,
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[4],
    paddingLeft: theme.spacing[5],
    paddingRight: theme.spacing[5],
    opacity: isDisabled ? 0.5 : 1,
    backgroundColor: isSelected ? theme.colors.surface.background.primary.subtle : 'transparent',
  }),
);

const StyledStaticRow = styled(View)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  columnGap: theme.spacing[4],
  width: '100%',
  minHeight: 56,
  paddingTop: theme.spacing[4],
  paddingBottom: theme.spacing[4],
  paddingLeft: theme.spacing[5],
  paddingRight: theme.spacing[5],
}));

const _CardGroupItem = (
  {
    children,
    leading,
    trailing,
    href,
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

  const handleNativePress = (event: unknown): void => {
    if (isNavigation && href && !isDisabled) {
      void Linking.openURL(href);
      return;
    }
    handlePress(event);
  };

  const a11yProps = isTrigger
    ? makeAccessible({
        role: 'button',
        expanded: isExpanded,
        controls: collapsibleBodyId,
        label: accessibilityLabel,
        disabled: isDisabled,
      })
    : makeAccessible({
        role: isInteractive ? (isNavigation ? 'link' : 'button') : undefined,
        selected: isSelected ? true : undefined,
        label: accessibilityLabel,
        disabled: isInteractive ? isDisabled : undefined,
      });

  const content = (
    <>
      {leading ? (
        <BaseBox display="flex" alignItems="center" flexShrink={0}>
          {leading}
        </BaseBox>
      ) : null}

      <BaseBox flex={1} minWidth="0px">
        {children}
      </BaseBox>

      {trailing ? (
        <BaseBox display="flex" alignItems="center" flexShrink={0}>
          {trailing}
        </BaseBox>
      ) : null}

      {isNavigation ? (
        <BaseBox display="flex" alignItems="center" flexShrink={0}>
          <ChevronRightIcon size="medium" color="surface.icon.gray.subtle" />
        </BaseBox>
      ) : isTrigger ? (
        <BaseBox display="flex" alignItems="center" flexShrink={0}>
          {isExpanded ? (
            <ChevronDownIcon size="medium" color="surface.icon.gray.subtle" />
          ) : (
            <ChevronRightIcon size="medium" color="surface.icon.gray.subtle" />
          )}
        </BaseBox>
      ) : null}
    </>
  );

  const commonProps = {
    ...a11yProps,
    ...metaAttribute({ name: MetaConstants.CardGroupItem, testID }),
    ...getStyledProps(rest),
    ...makeAnalyticsAttribute(rest),
  };

  if (!isInteractive) {
    return (
      <StyledStaticRow ref={ref as never} {...commonProps}>
        {content}
      </StyledStaticRow>
    );
  }

  return (
    <StyledCardGroupItem
      ref={ref as never}
      isSelected={Boolean(isSelected)}
      isDisabled={Boolean(isDisabled)}
      disabled={isDisabled}
      onPress={handleNativePress}
      {...commonProps}
    >
      {content}
    </StyledCardGroupItem>
  );
};

const CardGroupItem = assignWithoutSideEffects(React.forwardRef(_CardGroupItem), {
  displayName: 'CardGroupItem',
  componentId: ComponentIds.CardGroupItem,
});

export { CardGroupItem };
