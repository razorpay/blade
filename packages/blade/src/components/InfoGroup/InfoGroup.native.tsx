import React from 'react';
import type { ReactElement } from 'react';
import type {
  InfoGroupProps,
  InfoItemProps,
  InfoItemKeyProps,
  InfoItemValueProps,
  TitleCollectionProps,
} from './types';
import {
  elementGap,
  titleTextSize,
  helpTextSize,
  iconSize,
  itemTitleHeight,
  avatarAdjustmentPaddingY,
} from './infoGroupTokens';
import { InfoGroupContext, useInfoGroup, InfoItemContext, useInfoItem } from './InfoGroupContext';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import type { BladeElementRef } from '~utils/types';
import type { IconComponent } from '~components/Icons';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeSize } from '~utils';
import type { BoxProps } from '~components/Box';
import { Divider } from '~components/Divider';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { useIsomorphicLayoutEffect } from '~utils/useIsomorphicLayoutEffect';
import { useTruncationTitle } from '~utils/useTruncationTitle';

const getCenterBoxProps = (
  size: NonNullable<InfoGroupProps['size']>,
  strictHeight = false,
): BoxProps => {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    ...(strictHeight
      ? { height: makeSize(itemTitleHeight[size]) }
      : { minHeight: makeSize(itemTitleHeight[size]) }),
  };
};

const renderElement = (
  element: IconComponent | React.ReactElement | undefined,
  size: NonNullable<InfoGroupProps['size']>,
): React.ReactNode => {
  if (!element) return null;
  if (React.isValidElement(element)) return element;
  const IconComp = element as IconComponent;
  return <IconComp size={iconSize[size]} color="surface.icon.gray.muted" />;
};

const TitleCollection = ({
  children,
  leading,
  trailing,
  helpText,
  titleWeight,
  titleColor,
  paddingLeft,
  paddingRight,
  truncateAfterLines,
}: TitleCollectionProps): React.ReactElement => {
  const { size } = useInfoGroup();
  const { setHasAvatar } = useInfoItem();
  const isAvatar = getComponentId(React.isValidElement(leading) ? leading : undefined) === 'Avatar';

  useIsomorphicLayoutEffect(() => {
    if (isAvatar) setHasAvatar(true);
  }, [isAvatar, setHasAvatar]);

  const { containerRef, textRef } = useTruncationTitle({
    content: typeof children === 'string' ? children : undefined,
  });

  return (
    <BaseBox
      display="flex"
      alignItems="flex-start"
      gap={elementGap[size]}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
    >
      {leading && (
        <BaseBox {...getCenterBoxProps(size, true)}>{renderElement(leading, size)}</BaseBox>
      )}
      <BaseBox display="flex" flexDirection="column" flex="1">
        <BaseBox ref={containerRef} {...getCenterBoxProps(size)}>
          {typeof children === 'string' ? (
            <Text
              ref={textRef}
              variant="body"
              size={titleTextSize[size]}
              weight={titleWeight}
              color={titleColor}
              truncateAfterLines={truncateAfterLines}
            >
              {children}
            </Text>
          ) : (
            children
          )}
        </BaseBox>
        {helpText && (
          <Text
            variant="body"
            size={helpTextSize[size]}
            weight="regular"
            color="surface.text.gray.muted"
          >
            {helpText}
          </Text>
        )}
      </BaseBox>
      {trailing && (
        <BaseBox {...getCenterBoxProps(size, true)}>{renderElement(trailing, size)}</BaseBox>
      )}
    </BaseBox>
  );
};

const _InfoItemKey = (
  { children, leading, trailing, helpText, truncateAfterLines, testID }: InfoItemKeyProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  const { itemOrientation, size } = useInfoGroup();
  const { hasAvatar, isHighlighted } = useInfoItem();

  return (
    <BaseBox
      ref={ref as never}
      display="flex"
      alignItems="center"
      alignSelf="flex-start"
      justifyContent="flex-start"
      paddingY={hasAvatar ? avatarAdjustmentPaddingY[size] : undefined}
      {...metaAttribute({ name: MetaConstants.InfoItemKey, testID })}
    >
      {itemOrientation === 'horizontal' && isHighlighted ? (
        <Divider orientation="vertical" />
      ) : null}
      <TitleCollection
        leading={leading}
        trailing={trailing}
        helpText={helpText}
        titleWeight="medium"
        titleColor="surface.text.gray.muted"
        truncateAfterLines={truncateAfterLines}
        paddingLeft={isHighlighted ? 'spacing.4' : 'spacing.0'}
        paddingRight="spacing.0"
      >
        {children}
      </TitleCollection>
    </BaseBox>
  );
};

const InfoItemKey = assignWithoutSideEffects(React.forwardRef(_InfoItemKey), {
  displayName: 'InfoItemKey',
  componentId: 'InfoItemKey',
});

const _InfoItemValue = (
  { children, leading, trailing, helpText, truncateAfterLines, testID }: InfoItemValueProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  const { itemOrientation, valueAlign, size } = useInfoGroup();
  const { hasAvatar, isHighlighted } = useInfoItem();

  return (
    <BaseBox
      ref={ref as never}
      margin="spacing.0"
      display="flex"
      alignItems="center"
      alignSelf="flex-start"
      justifyContent={valueAlign === 'right' ? 'flex-end' : 'flex-start'}
      paddingY={hasAvatar ? avatarAdjustmentPaddingY[size] : undefined}
      {...metaAttribute({ name: MetaConstants.InfoItemValue, testID })}
    >
      <TitleCollection
        leading={leading}
        trailing={trailing}
        helpText={helpText}
        titleWeight="semibold"
        titleColor="surface.text.gray.subtle"
        truncateAfterLines={truncateAfterLines}
        paddingLeft={isHighlighted && itemOrientation === 'vertical' ? 'spacing.4' : 'spacing.0'}
        paddingRight={isHighlighted ? 'spacing.4' : 'spacing.0'}
      >
        {children}
      </TitleCollection>
    </BaseBox>
  );
};

const InfoItemValue = assignWithoutSideEffects(React.forwardRef(_InfoItemValue), {
  displayName: 'InfoItemValue',
  componentId: 'InfoItemValue',
});

// Native: Horizontal uses flex row (replaces CSS display:contents)
const HorizontalItemBox = React.forwardRef<
  BladeElementRef,
  { children: React.ReactNode; testID?: string }
>(
  ({ children, testID }, ref): React.ReactElement => {
    return (
      <BaseBox
        display="flex"
        flexDirection="row"
        gap="spacing.6"
        alignItems="flex-start"
        ref={ref as never}
        {...metaAttribute({ name: MetaConstants.InfoItem, testID })}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && getComponentId(child) === 'InfoItemValue') {
            return <BaseBox flex="1">{child}</BaseBox>;
          }
          return child;
        })}
      </BaseBox>
    );
  },
);

// Native: Vertical stacks key above value
const VerticalItemBox = React.forwardRef<
  BladeElementRef,
  { children: React.ReactNode; testID?: string; isHighlighted?: boolean }
>(
  ({ children, testID, isHighlighted = false }, ref): React.ReactElement => {
    return (
      <BaseBox
        display="flex"
        flex="1"
        ref={ref as never}
        {...metaAttribute({ name: MetaConstants.InfoItem, testID })}
      >
        {isHighlighted && <Divider orientation="vertical" />}
        <BaseBox display="flex" flexDirection="column" gap="spacing.2">
          {children}
        </BaseBox>
      </BaseBox>
    );
  },
);

const _InfoItem = (
  { children, testID, isHighlighted }: InfoItemProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  const { itemOrientation, isHighlighted: contextIsHighlighted } = useInfoGroup();
  const [hasAvatar, setHasAvatar] = React.useState(false);
  const isVertical = itemOrientation === 'vertical';
  const shouldHighlight = isHighlighted ?? contextIsHighlighted;

  const infoItemContextValue = React.useMemo(
    () => ({ hasAvatar, setHasAvatar, isHighlighted: shouldHighlight }),
    [hasAvatar, shouldHighlight],
  );

  if (isVertical) {
    return (
      <InfoItemContext.Provider value={infoItemContextValue}>
        <VerticalItemBox ref={ref as never} testID={testID} isHighlighted={shouldHighlight}>
          {children}
        </VerticalItemBox>
      </InfoItemContext.Provider>
    );
  }

  return (
    <InfoItemContext.Provider value={infoItemContextValue}>
      <HorizontalItemBox ref={ref as never} testID={testID}>
        {children}
      </HorizontalItemBox>
    </InfoItemContext.Provider>
  );
};

const InfoItem = assignWithoutSideEffects(React.forwardRef(_InfoItem), {
  displayName: 'InfoItem',
  componentId: 'InfoItem',
});

// Native InfoGroup: flexbox replaces CSS Grid
const _InfoGroup = (
  {
    children,
    itemOrientation = 'horizontal',
    size = 'medium',
    valueAlign = 'left',
    isHighlighted = false,
    width,
    maxWidth,
    minWidth,
    testID,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    padding,
    paddingX,
    paddingY,
    ...rest
  }: InfoGroupProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  const contextValue = React.useMemo(() => ({ size, itemOrientation, valueAlign, isHighlighted }), [
    size,
    itemOrientation,
    valueAlign,
    isHighlighted,
  ]);

  const isVertical = itemOrientation === 'vertical';

  return (
    <InfoGroupContext.Provider value={contextValue}>
      <BaseBox
        ref={ref as never}
        display="flex"
        flexDirection={isVertical ? 'row' : 'column'}
        flexWrap={isVertical ? 'wrap' : undefined}
        rowGap="spacing.4"
        columnGap="spacing.6"
        margin="spacing.0"
        width={width}
        maxWidth={maxWidth}
        minWidth={minWidth}
        paddingLeft={paddingLeft}
        paddingRight={paddingRight}
        paddingTop={paddingTop}
        paddingBottom={paddingBottom}
        padding={padding}
        paddingX={paddingX}
        paddingY={paddingY}
        {...metaAttribute({ name: MetaConstants.InfoGroup, testID })}
        {...getStyledProps(rest)}
      >
        {children}
      </BaseBox>
    </InfoGroupContext.Provider>
  );
};

const InfoGroup = assignWithoutSideEffects(React.forwardRef(_InfoGroup), {
  displayName: 'InfoGroup',
  componentId: 'InfoGroup',
});

export type { InfoGroupProps, InfoItemProps, InfoItemKeyProps, InfoItemValueProps };
export { InfoGroup, InfoItem, InfoItemKey, InfoItemValue };
