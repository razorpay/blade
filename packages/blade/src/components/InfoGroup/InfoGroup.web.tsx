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
} from './infoGroupTokens';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import type { BladeElementRef } from '~utils/types';
import type { IconComponent } from '~components/Icons';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeSize } from '~utils';
// import { iconSizeMap } from '~components/Icons/useIconProps/iconSizeMap';
// import getIn from '~utils/lodashButBetter/get';
// import { useTheme } from '~components/BladeProvider';
import type { BoxProps } from '~components/Box';
import { Divider } from '~components/Divider';

const getCenterBoxProps = (size: NonNullable<InfoGroupProps['size']>): BoxProps => {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: makeSize(itemTitleHeight[size]),
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
  const IconComponent = element as IconComponent;
  return <IconComponent size={iconSize[size]} color="surface.icon.gray.muted" />;
};

// Create React Context for InfoGroup configuration
const InfoGroupContext = React.createContext<{
  size: NonNullable<InfoGroupProps['size']>;
  itemOrientation: NonNullable<InfoGroupProps['itemOrientation']>;
}>({
  size: 'medium',
  itemOrientation: 'horizontal',
});

const TitleCollection = ({
  children,
  leading,
  trailing,
  helpText,
  titleWeight,
  titleColor,
}: TitleCollectionProps): React.ReactElement => {
  const { size } = React.useContext(InfoGroupContext);

  return (
    <BaseBox display="flex" alignItems="flex-start" gap={elementGap[size]}>
      {leading && <BaseBox {...getCenterBoxProps(size)}>{renderElement(leading, size)}</BaseBox>}
      <BaseBox display="flex" flexDirection="column" flex="1">
        <BaseBox {...getCenterBoxProps(size)}>
          {typeof children === 'string' ? (
            <Text variant="body" size={titleTextSize[size]} weight={titleWeight} color={titleColor}>
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
      {trailing && <BaseBox {...getCenterBoxProps(size)}>{renderElement(trailing, size)}</BaseBox>}
    </BaseBox>
  );
};

// InfoItemKey Component
const _InfoItemKey = (
  { children, leading, trailing, helpText, testID }: InfoItemKeyProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  // const { theme } = useTheme();
  // const leadingWidth = makeSize(iconSizeMap[size] + getIn(theme, elementGap[size]));

  return (
    <BaseBox
      ref={ref as never}
      display="flex"
      alignItems="center"
      {...metaAttribute({ name: MetaConstants.InfoItemKey, testID })}
    >
      <TitleCollection
        leading={leading}
        trailing={trailing}
        helpText={helpText}
        titleWeight="medium"
        titleColor="surface.text.gray.muted"
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

// InfoItemValue Component
const _InfoItemValue = (
  { children, leading, trailing, helpText, testID }: InfoItemValueProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  return (
    <BaseBox
      ref={ref as never}
      display="flex"
      alignItems="center"
      justifyContent="flex-start" // set to flex-end when textAlign is right
      {...metaAttribute({ name: MetaConstants.InfoItemValue, testID })}
    >
      <TitleCollection
        leading={leading}
        trailing={trailing}
        helpText={helpText}
        titleWeight="semibold"
        titleColor="surface.text.gray.subtle"
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

// InfoItem Component
const _InfoItem = (
  { children, testID }: InfoItemProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  const { itemOrientation } = React.useContext(InfoGroupContext);

  return (
    <BaseBox
      display="flex"
      ref={ref as never}
      {...metaAttribute({ name: MetaConstants.InfoItem, testID })}
    >
      <Divider orientation="vertical" />
      <BaseBox
        display="grid"
        gridTemplateColumns={itemOrientation === 'horizontal' ? '50% 50%' : '1fr'}
        gap="spacing.2"
        alignItems="flex-start"
        paddingX="spacing.4"
        width="100%"
      >
        {children}
      </BaseBox>
    </BaseBox>
  );
};

const InfoItem = assignWithoutSideEffects(React.forwardRef(_InfoItem), {
  displayName: 'InfoItem',
  componentId: 'InfoItem',
});

// InfoGroup Component
const _InfoGroup = (
  {
    children,
    itemOrientation = 'horizontal',
    size = 'medium',
    testID,
    width,
    maxWidth,
    minWidth,
    ...rest
  }: InfoGroupProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  const contextValue = React.useMemo(
    () => ({
      size,
      itemOrientation,
    }),
    [size, itemOrientation],
  );

  return (
    <InfoGroupContext.Provider value={contextValue}>
      <BaseBox
        ref={ref as never}
        display="flex"
        flexDirection="column"
        gap="spacing.4"
        width={width}
        maxWidth={maxWidth}
        minWidth={minWidth}
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
