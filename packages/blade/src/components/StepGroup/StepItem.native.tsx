import React from 'react';
import { Linking, Pressable } from 'react-native';
import { StepLine } from './StepLine';
import type { StepLineProps } from './StepLine';
import { useStepGroup } from './StepGroupContext';
import type { StepGroupContextType, StepGroupProps, StepItemProps } from './types';
import { componentIds } from './componentIds';
import { itemLineGap, stepItemHeaderTokens } from './tokens';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import BaseBox from '~components/Box/BaseBox';
import { makeSize } from '~utils';
import { size as sizeTokens } from '~tokens/global';
import { throwBladeError } from '~utils/logger';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

type GetStepTypeFromIndexProps = {
  _index: StepItemProps['_index'];
  _nestingLevel: StepGroupProps['_nestingLevel'];
  itemsCount: StepGroupContextType['itemsInGroupCount'];
};

const getStepTypeFromIndex = ({
  _index,
  _nestingLevel,
  itemsCount,
}: GetStepTypeFromIndexProps): StepLineProps['stepType'] => {
  if (_nestingLevel === 0) {
    return 'default';
  }

  if (itemsCount === 1) {
    return 'single-item';
  }

  if (_index === 0) {
    return 'start';
  }

  if (_index === itemsCount - 1) {
    return 'end';
  }

  return 'middle';
};

const _StepItem = ({
  title,
  titleColor,
  timestamp,
  description,
  stepProgress = 'none',
  marker,
  trailing,
  isSelected,
  isDisabled,
  href,
  onClick,
  children,
  _index = 0,
  _totalIndex = 0,
  _nestingLevel = 0,
  minWidth,
  ...rest
}: StepItemProps): React.ReactElement => {
  const {
    itemsInGroupCount: itemsCount,
    totalItemsInParentGroupCount,
    orientation,
    size,
  } = useStepGroup();
  const stepType = React.useMemo(
    () => getStepTypeFromIndex({ _index, _nestingLevel, itemsCount }),
    [_index, _nestingLevel, itemsCount],
  );

  const isFirstItem = _totalIndex === 0;
  const isLastItem = _totalIndex === totalItemsInParentGroupCount - 1;
  const isInteractive = Boolean(href) || Boolean(onClick);
  const isVertical = orientation === 'vertical';
  const isNested = _nestingLevel > 0;

  if (__DEV__) {
    if (trailing && orientation === 'horizontal') {
      throwBladeError({
        message: 'trailing is not allowed in horizontal StepGroup',
        moduleName: 'StepItem',
      });
    }

    if (_nestingLevel >= 1 && orientation === 'horizontal') {
      throwBladeError({
        message: 'Nested StepGroup components are not allowed in horizontal orientation',
        moduleName: 'StepItem',
      });
    }
  }

  const handlePress = React.useCallback((): void => {
    if (isDisabled) return;

    if (href) {
      void Linking.openURL(href);
    }

    if (onClick) {
      // @ts-expect-error native doesn't have MouseEvent, calling with undefined
      onClick(undefined);
    }
  }, [isDisabled, href, onClick]);

  const stepItemHeaderJSX = (
    <Box display="flex" flexDirection="row" justifyContent="space-between" gap="spacing.4">
      <Box flexShrink={1}>
        <Text
          size={stepItemHeaderTokens[size].title}
          color={
            isDisabled
              ? 'surface.text.gray.disabled'
              : isSelected
              ? 'surface.text.primary.normal'
              : titleColor ?? 'surface.text.gray.subtle'
          }
          weight={isNested ? 'regular' : 'medium'}
        >
          {title}
        </Text>
        {timestamp ? (
          <Text
            size={stepItemHeaderTokens[size].timestamp}
            marginY="spacing.2"
            color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.muted'}
            variant="caption"
          >
            {timestamp}
          </Text>
        ) : null}
        {description ? (
          <Text
            size={stepItemHeaderTokens[size].description}
            color={isDisabled ? 'surface.text.gray.disabled' : 'surface.text.gray.muted'}
          >
            {description}
          </Text>
        ) : null}
      </Box>
      {trailing ? <Box>{trailing}</Box> : null}
    </Box>
  );

  const enhancedMarker = marker
    ? React.cloneElement(marker, {
        isDisabled: isDisabled ?? marker?.props?.isDisabled,
      })
    : undefined;

  const headerContent = isInteractive ? (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      {...metaAttribute({ name: MetaConstants.StepItemButton })}
    >
      <Box paddingY="spacing.3" paddingX="spacing.4">
        {stepItemHeaderJSX}
      </Box>
    </Pressable>
  ) : (
    <Box paddingY="spacing.3" paddingX="spacing.4">
      {stepItemHeaderJSX}
    </Box>
  );

  return (
    <BaseBox
      display="flex"
      flexDirection={isVertical ? 'row' : 'column'}
      gap={itemLineGap[size]}
      alignItems={isVertical ? undefined : 'center'}
      minWidth={isVertical ? undefined : minWidth ?? makeSize(sizeTokens['120'])}
      // Horizontal items need a definite width (not flex:'1') because the horizontal
      // ScrollView gives an unbounded main axis; without it the header text never wraps,
      // the item collapses vertically and grows arbitrarily wide.
      width={isVertical ? '100%' : makeSize(sizeTokens['160'])}
      marginX={isVertical ? 'spacing.4' : 'spacing.0'}
      {...metaAttribute({ name: MetaConstants.StepItem })}
      {...makeAnalyticsAttribute(rest)}
    >
      <StepLine
        shouldShowStartBranch={!isFirstItem}
        shouldShowEndBranch={!isLastItem}
        stepType={stepType}
        marker={enhancedMarker}
        stepProgress={stepProgress}
      />
      {/*
        Vertical items are a row, so the header uses flex:'1' to fill the remaining width.
        Horizontal items are a column with auto height; flex:'1' there would set flex-basis:0
        on the vertical axis and collapse the header (and its text) to height 0, so it instead
        takes a definite full-item width and content-driven height.
      */}
      <Box flex={isVertical ? '1' : undefined} width={isVertical ? undefined : '100%'}>
        {headerContent}
        {children ? (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
            flexWrap="wrap"
            paddingX="spacing.4"
            paddingBottom="spacing.3"
          >
            {children}
          </Box>
        ) : null}
      </Box>
    </BaseBox>
  );
};

const StepItem = assignWithoutSideEffects(_StepItem, {
  componentId: componentIds.StepItem,
  displayName: componentIds.StepItem,
});

export { StepLine, StepItem };
