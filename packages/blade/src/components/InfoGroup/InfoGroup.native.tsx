import React from 'react';
import type { ReactElement } from 'react';
import type { LayoutChangeEvent } from 'react-native';
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
import { useTruncationTitle } from '~utils/useTruncationTitle';

/**
 * Native-only context to emulate CSS Grid's `max-content` shared key column.
 *
 * On web, `grid-template-columns: max-content 1fr` sizes the key column to the
 * WIDEST key across all rows, so every value starts at the same x-position.
 * React Native flexbox has no cross-row `max-content`, so each key would size to
 * its own content (ragged value column). We measure every key's natural width via
 * `onLayout`, keep the running max in this context, and apply that fixed width to
 * all keys — reproducing the aligned two-column layout.
 */
type KeyColumnMeasureContextType = {
  /** true only for horizontal orientation where the shared column applies */
  isMeasuring: boolean;
  /** resolved shared key-column width (max of all measured keys), or undefined until measured */
  keyColumnWidth: number | undefined;
  /** each key reports its measured natural width here */
  reportKeyWidth: (id: number, width: number) => void;
};

const KeyColumnMeasureContext = React.createContext<KeyColumnMeasureContextType>({
  isMeasuring: false,
  keyColumnWidth: undefined,
  reportKeyWidth: () => {
    // no-op default implementation
  },
});

const useKeyColumnMeasure = (): KeyColumnMeasureContextType =>
  React.useContext(KeyColumnMeasureContext);

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
      : {
          minHeight: makeSize(itemTitleHeight[size]),
        }),
  };
};

// Helper function to render leading/trailing elements (icons or JSX)
const renderElement = (
  element: IconComponent | React.ReactElement | undefined,
  size: NonNullable<InfoGroupProps['size']>,
): React.ReactNode => {
  if (!element) return null;

  // Check if it's already a JSX element (React element)
  if (React.isValidElement(element)) {
    return element;
  }

  // Otherwise, it's a component function - render it with size prop
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

  // Set hasAvatar context when an avatar is detected
  React.useEffect(() => {
    if (isAvatar) {
      setHasAvatar(true);
    }
  }, [isAvatar, setHasAvatar]);

  // useTruncationTitle on native returns null refs (no-op)
  const { containerRef, textRef } = useTruncationTitle({
    content: typeof children === 'string' ? children : undefined,
  });

  return (
    <BaseBox
      display="flex"
      alignItems="flex-start"
      flexDirection="row"
      gap={elementGap[size]}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
    >
      {leading && (
        <BaseBox {...getCenterBoxProps(size, true)}>{renderElement(leading, size)}</BaseBox>
      )}
      <BaseBox display="flex" flexDirection="column" flexShrink={1}>
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

// Monotonic id generator so each key can report its width against a stable slot.
let keyIdCounter = 0;

const _InfoItemKey = (
  { children, leading, trailing, helpText, truncateAfterLines, testID }: InfoItemKeyProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  const { itemOrientation, size } = useInfoGroup();

  const { hasAvatar, isHighlighted } = useInfoItem();
  const { isMeasuring, keyColumnWidth, reportKeyWidth } = useKeyColumnMeasure();

  const keyId = React.useRef<number>((keyIdCounter += 1)).current;

  const handleLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      if (!isMeasuring) return;
      reportKeyWidth(keyId, event.nativeEvent.layout.width);
    },
    [isMeasuring, keyId, reportKeyWidth],
  );

  return (
    <BaseBox
      ref={ref as never}
      display="flex"
      alignItems="center"
      alignSelf="flex-start"
      justifyContent="flex-start"
      flexDirection="row"
      // Emulate CSS Grid `max-content` key column: once the shared width is known,
      // pin every key to it so values start at a uniform x (aligned two-column layout).
      width={isMeasuring && keyColumnWidth ? makeSize(keyColumnWidth) : undefined}
      paddingY={hasAvatar ? avatarAdjustmentPaddingY[size] : undefined}
      {...metaAttribute({ name: MetaConstants.InfoItemKey, testID })}
    >
      {/*
       * Inner box measures the key's NATURAL width. It must stay unconstrained by the
       * outer pinned width (above), otherwise a key mistakenly pinned narrow could never
       * re-measure back to its true width. `onLayout` stays active for the whole measuring
       * phase (not gated on `keyColumnWidth`) so every key reports even if another key lays
       * out first — the group keeps the running max, so the column self-corrects.
       */}
      <BaseBox
        display="flex"
        alignItems="center"
        alignSelf="flex-start"
        justifyContent="flex-start"
        flexDirection="row"
        onLayout={isMeasuring ? handleLayout : undefined}
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
    </BaseBox>
  );
};

/**
 * InfoItemKey
 *
 * Displays the key portion of a key-value pair within an InfoItem.
 * Supports leading/trailing elements and customizable text alignment.
 *
 * ----
 *
 * #### Usage
 *
 * ```tsx
 * <InfoItemKey leading={UserIcon}>Account Holder</InfoItemKey>
 * ```
 *
 * ----
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-infogroup InfoGroup Documentation}
 */
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
      display="flex"
      flexDirection="row"
      alignItems="flex-start"
      alignSelf="flex-start"
      justifyContent={valueAlign === 'right' ? 'flex-end' : 'flex-start'}
      flex={1}
      paddingY={hasAvatar ? avatarAdjustmentPaddingY[size] : undefined}
      {...metaAttribute({ name: MetaConstants.InfoItemValue, testID })}
    >
      <TitleCollection
        leading={leading}
        trailing={trailing}
        helpText={helpText}
        titleWeight="medium"
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

/**
 * InfoItemValue
 *
 * Displays the value portion of a key-value pair within an InfoItem.
 * Supports leading/trailing elements and customizable text alignment.
 *
 * ----
 *
 * #### Usage
 *
 * ```tsx
 * <InfoItemValue helpText="Customer name" trailing={CheckIcon}>
 *   Saurabh Daware
 * </InfoItemValue>
 * ```
 *
 * ----
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-infogroup InfoGroup Documentation}
 */
const InfoItemValue = assignWithoutSideEffects(React.forwardRef(_InfoItemValue), {
  displayName: 'InfoItemValue',
  componentId: 'InfoItemValue',
});

/**
 * On native, `display:contents` has no equivalent.
 * For horizontal orientation, each InfoItem renders its children in an explicit row.
 */
const HorizontalItemBox = React.forwardRef<
  BladeElementRef,
  {
    children: React.ReactNode;
    testID?: string;
  }
>(
  ({ children, testID }, ref): React.ReactElement => {
    return (
      <BaseBox
        ref={ref as never}
        display="flex"
        flexDirection="row"
        alignItems="flex-start"
        gap="spacing.6"
        {...metaAttribute({ name: MetaConstants.InfoItem, testID })}
      >
        {children}
      </BaseBox>
    );
  },
);

/**
 * For vertical orientation, items are arranged in columns (flex column with optional divider).
 */
const VerticalItemBox = React.forwardRef<
  BladeElementRef,
  { children: React.ReactNode; testID?: string; isHighlighted?: boolean }
>(
  ({ children, testID, isHighlighted = false }, ref): React.ReactElement => {
    return (
      <BaseBox
        display="flex"
        flexDirection="row"
        alignItems="flex-start"
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
    () => ({
      hasAvatar,
      setHasAvatar,
      isHighlighted: shouldHighlight,
    }),
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

/**
 * InfoItem
 *
 * Container component that wraps InfoItemKey and InfoItemValue pairs.
 * Manages the layout and visual connection between key-value elements.
 *
 * ----
 *
 * #### Usage
 *
 * ```tsx
 * <InfoItem>
 *   <InfoItemKey>Account Holder</InfoItemKey>
 *   <InfoItemValue>Saurabh Daware</InfoItemValue>
 * </InfoItem>
 * ```
 *
 * ----
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-infogroup InfoGroup Documentation}
 */
const InfoItem = assignWithoutSideEffects(React.forwardRef(_InfoItem), {
  displayName: 'InfoItem',
  componentId: 'InfoItem',
});

/**
 * Derive the number of columns for vertical orientation.
 *
 * On web the default is `repeat(min(4, count), 1fr)` and callers can override with
 * `gridTemplateColumns` (e.g. the vertical story passes `repeat(3, 1fr)`). RN cannot
 * consume a CSS grid string, so we parse the intended column count from it:
 *   - `repeat(N, 1fr)`      -> N
 *   - `1fr 1fr 1fr`         -> 3 (count of space-separated tracks)
 * Falling back to `min(4, count)` to match the web default.
 */
const getVerticalColumnCount = (
  gridTemplateColumns: InfoGroupProps['gridTemplateColumns'],
  childCount: number,
): number => {
  const fallback = Math.min(4, Math.max(1, childCount));

  if (typeof gridTemplateColumns !== 'string') return fallback;

  const template = gridTemplateColumns as string;

  const repeatMatch = template.match(/repeat\(\s*(?:min\(\s*)?(\d+)/i);
  if (repeatMatch) {
    const parsed = parseInt(repeatMatch[1], 10);
    return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, childCount || parsed) : fallback;
  }

  const tracks = template.trim().split(/\s+/).filter(Boolean).length;
  return tracks > 0 ? Math.min(tracks, childCount || tracks) : fallback;
};

// InfoGroup Component
const _InfoGroup = (
  {
    children,
    itemOrientation = 'horizontal',
    size = 'medium',
    valueAlign = 'left',
    isHighlighted = false,
    gridTemplateColumns,
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
  const contextValue = React.useMemo(
    () => ({
      size,
      itemOrientation,
      valueAlign,
      isHighlighted,
    }),
    [size, itemOrientation, valueAlign, isHighlighted],
  );

  const childCount = React.Children.count(children);
  const isHorizontal = itemOrientation === 'horizontal';

  // ── Horizontal: shared key-column width (emulates CSS Grid `max-content 1fr`) ──
  const keyWidthsRef = React.useRef<Map<number, number>>(new Map());
  const [keyColumnWidth, setKeyColumnWidth] = React.useState<number | undefined>(undefined);

  const reportKeyWidth = React.useCallback(
    (id: number, measuredWidth: number) => {
      const rounded = Math.ceil(measuredWidth);
      const previous = keyWidthsRef.current.get(id);
      if (previous === rounded) return;
      keyWidthsRef.current.set(id, rounded);
      const nextMax = Math.max(...keyWidthsRef.current.values());
      setKeyColumnWidth((current) => (current === nextMax ? current : nextMax));
    },
    [],
  );

  // Reset measurement whenever the children set changes so stale widths don't leak.
  React.useEffect(() => {
    keyWidthsRef.current = new Map();
    setKeyColumnWidth(undefined);
  }, [childCount, isHorizontal]);

  const keyColumnContextValue = React.useMemo<KeyColumnMeasureContextType>(
    () => ({
      isMeasuring: isHorizontal,
      keyColumnWidth: isHorizontal ? keyColumnWidth : undefined,
      reportKeyWidth,
    }),
    [isHorizontal, keyColumnWidth, reportKeyWidth],
  );

  // ── Vertical: derive column count and equal flexBasis (emulates repeat(N, 1fr)) ──
  const verticalColumnCount = getVerticalColumnCount(gridTemplateColumns, childCount);
  const itemFlexBasis = !isHorizontal
    ? (`${100 / verticalColumnCount}%` as BoxProps['flexBasis'])
    : undefined;

  return (
    <InfoGroupContext.Provider value={contextValue}>
      <KeyColumnMeasureContext.Provider value={keyColumnContextValue}>
        <BaseBox
          ref={ref as never}
          display="flex"
          flexDirection={isHorizontal ? 'column' : 'row'}
          flexWrap={isHorizontal ? undefined : 'wrap'}
          gap="spacing.4"
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
          {!isHorizontal && itemFlexBasis
            ? React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return child;
                return (
                  <BaseBox flexBasis={itemFlexBasis} flexDirection="column">
                    {child}
                  </BaseBox>
                );
              })
            : children}
        </BaseBox>
      </KeyColumnMeasureContext.Provider>
    </InfoGroupContext.Provider>
  );
};

/**
 * InfoGroup
 *
 * A structured component for displaying key-value pairs in a consistent, organized format.
 * Provides standardized presentation for transaction details, user data, or any related data pairs.
 *
 * ----
 *
 * #### Usage
 *
 * ```tsx
 * <InfoGroup itemOrientation="horizontal" size="medium">
 *   <InfoItem>
 *     <InfoItemKey leading={UserIcon}>Account Holder</InfoItemKey>
 *     <InfoItemValue>Saurabh Daware</InfoItemValue>
 *   </InfoItem>
 * </InfoGroup>
 * ```
 *
 * ----
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-infogroup InfoGroup Documentation}
 */
const InfoGroup = assignWithoutSideEffects(React.forwardRef(_InfoGroup), {
  displayName: 'InfoGroup',
  componentId: 'InfoGroup',
});

export type { InfoGroupProps, InfoItemProps, InfoItemKeyProps, InfoItemValueProps };

export { InfoGroup, InfoItem, InfoItemKey, InfoItemValue };
