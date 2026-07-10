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
  titleColumnWidth,
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
      // Allow this row to shrink to its parent (the fixed-width label column in horizontal,
      // or the grid cell in vertical) so the inner text column can wrap instead of overflow.
      flexShrink={1}
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

const _InfoItemKey = (
  { children, leading, trailing, helpText, truncateAfterLines, testID }: InfoItemKeyProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  const { itemOrientation, size } = useInfoGroup();

  const { hasAvatar, isHighlighted } = useInfoItem();

  const isHorizontal = itemOrientation === 'horizontal';

  return (
    <BaseBox
      ref={ref as never}
      display="flex"
      alignItems="center"
      // Horizontal: hug content in a fixed-width label column. Vertical: stretch to the full
      // grid-cell width so the label anchors to the left edge (directly above the value) and
      // can wrap to multiple lines instead of sitting content-width/staggered.
      alignSelf={isHorizontal ? 'flex-start' : 'stretch'}
      justifyContent="flex-start"
      flexDirection="row"
      // Fixed label-column width (horizontal only) so every value column lines up across rows,
      // matching web's grid key column. Deterministic — no onLayout/measurement, so it cannot
      // oscillate. Vertical orientation stacks key above value and needs no shared width.
      width={isHorizontal ? makeSize(titleColumnWidth[size]) : undefined}
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

  const isHorizontal = itemOrientation === 'horizontal';

  return (
    <BaseBox
      ref={ref as never}
      display="flex"
      flexDirection="row"
      alignItems="flex-start"
      // Horizontal: `flex={1}` grows the value to fill the row beside the fixed label column.
      // Vertical: the value sits BELOW the label inside a flex COLUMN, where `flex={1}` would
      // (wrongly) grow it along the vertical axis; instead stretch it to the full cell width so
      // it aligns left directly under the label and wraps within the cell.
      alignSelf={isHorizontal ? 'flex-start' : 'stretch'}
      justifyContent={valueAlign === 'right' ? 'flex-end' : 'flex-start'}
      flex={isHorizontal ? 1 : undefined}
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
        {/* `flex={1}` bounds this column to the grid cell's width so the key/value text
            wraps to multiple lines instead of overflowing on a single line (RN defaults
            flexShrink to 0, which otherwise lets the content stay one long line). */}
        <BaseBox display="flex" flexDirection="column" gap="spacing.2" flex={1}>
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
 * Derive the number of grid columns for vertical orientation from a CSS
 * `gridTemplateColumns` value. RN/Yoga has no CSS grid, so we emulate the intended
 * column count with an equal-width wrapping flex layout (each cell gets width `100 / N %`).
 *
 * We only need to handle the two shapes InfoGroup actually uses:
 *   - `repeat(N, ...)` / `repeat(min(N, ...), ...)`  -> N  (web default is `repeat(min(4, count), 1fr)`)
 *   - an explicit track list, e.g. `1fr`, `1fr 1fr`, `50% 50%` -> number of tracks
 *   - undefined / unrecognized -> `min(4, childCount)` (mirrors the web default)
 */
const getVerticalColumnCount = (
  gridTemplateColumns: InfoGroupProps['gridTemplateColumns'],
  childCount: number,
): number => {
  const fallback = Math.min(4, Math.max(1, childCount || 1));

  const template = String(gridTemplateColumns ?? '').trim();
  if (!template) return fallback;

  // `repeat(N, ...)` / `repeat(min(N, ...), ...)` -> the leading integer is the column count.
  const repeatMatch = /repeat\(\s*(?:min|max|minmax)?\(?\s*(\d+)/i.exec(template);
  if (repeatMatch) {
    const parsed = parseInt(repeatMatch[1], 10);
    return parsed > 0 ? parsed : fallback;
  }

  // Explicit track list -> number of whitespace-separated tracks.
  const tracks = template.split(/\s+/).filter(Boolean).length;
  return tracks > 0 ? tracks : fallback;
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

  // ── Vertical: emulate CSS grid `repeat(N, 1fr)` with a wrapping flex row ──
  // RN/Yoga has no CSS grid, so we parse the intended column count from
  // `gridTemplateColumns` and give every cell an equal `width` of `100 / N %`.
  // Cells tile left-to-right and wrap to the next row after N items (row-major flow),
  // matching the web grid. Both gaps are applied as border-box padding INSIDE each cell
  // (RN is border-box by default) so they do NOT eat into the width math the way a
  // container `columnGap`/`rowGap` would — that overflow is what previously pushed cells
  // onto the wrong row and made them collide, and a container `rowGap` on a wrapping row
  // produced no visible separation between the wrapped rows on this RN version. Instead
  // each cell reserves its own `paddingRight` (column gap) and `paddingBottom` (row gap).
  // To match web's grid gaps (which only sit BETWEEN tracks), the last column of each row
  // gets no `paddingRight` and the last row gets no `paddingBottom` — otherwise native would
  // add an extra trailing gap on the right edge of every row and below the final row.
  // Gap tokens mirror the web grid (columnGap base = spacing.6, rowGap = spacing.4).
  const verticalColumnCount = getVerticalColumnCount(gridTemplateColumns, childCount);
  const verticalRowCount = Math.ceil(childCount / verticalColumnCount);
  const itemWidth = `${100 / verticalColumnCount}%` as BoxProps['width'];
  const columnGapToken: BoxProps['paddingRight'] = 'spacing.6';
  const rowGapToken: BoxProps['paddingBottom'] = 'spacing.4';

  return (
    <InfoGroupContext.Provider value={contextValue}>
      <BaseBox
        ref={ref as never}
        display="flex"
        flexDirection={isHorizontal ? 'column' : 'row'}
        flexWrap={isHorizontal ? undefined : 'wrap'}
        gap={isHorizontal ? 'spacing.4' : undefined}
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
        {!isHorizontal
          ? React.Children.map(children, (child, index) => {
              if (!React.isValidElement(child)) return child;
              const isLastColumn = index % verticalColumnCount === verticalColumnCount - 1;
              const isLastRow =
                Math.floor(index / verticalColumnCount) === verticalRowCount - 1;
              return (
                <BaseBox
                  width={itemWidth}
                  flexDirection="column"
                  paddingRight={
                    verticalColumnCount > 1 && !isLastColumn ? columnGapToken : undefined
                  }
                  paddingBottom={isLastRow ? undefined : rowGapToken}
                >
                  {child}
                </BaseBox>
              );
            })
          : children}
      </BaseBox>
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
