import React from 'react';
import type { ReactElement } from 'react';
import type {
  InfoGroupProps,
  InfoItemProps,
  InfoItemKeyProps,
  InfoItemValueProps,
  InfoItemIconProps,
} from './types';
import {
  itemSpacing,
  keyValueGap,
  elementGap,
  keyTypography,
  valueTypography,
  helpTextSize,
  iconSize,
  dividerSpacing,
} from './infoGroupTokens';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { Divider } from '~components/Divider';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import type { BladeElementRef } from '~utils/types';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { throwBladeError } from '~utils/logger';

// Create React Context for InfoGroup configuration
const InfoGroupContext = React.createContext<{
  size: NonNullable<InfoGroupProps['size']>;
  itemOrientation: NonNullable<InfoGroupProps['itemOrientation']>;
  textAlign: NonNullable<InfoGroupProps['textAlign']>;
}>({
  size: 'medium',
  itemOrientation: 'horizontal',
  textAlign: 'left',
});

// InfoItemIcon Component
const _InfoItemIcon = (
  { icon: Icon, testID }: InfoItemIconProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  const { size } = React.useContext(InfoGroupContext);

  return (
    <BaseBox
      ref={ref as never}
      display="flex"
      alignItems="center"
      {...metaAttribute({ name: MetaConstants.InfoItemIcon, testID })}
    >
      <Icon size={iconSize[size]} />
    </BaseBox>
  );
};

const InfoItemIcon = assignWithoutSideEffects(React.forwardRef(_InfoItemIcon), {
  displayName: 'InfoItemIcon',
  componentId: 'InfoItemIcon',
});

// InfoItemKey Component
const _InfoItemKey = (
  { children, leading, trailing, helpText, testID }: InfoItemKeyProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  const { size } = React.useContext(InfoGroupContext);
  const keyTyping = keyTypography[size];

  return (
    <BaseBox
      ref={ref as never}
      display="flex"
      alignItems="center"
      gap={elementGap[size]}
      flex="1"
      {...metaAttribute({ name: MetaConstants.InfoItemKey, testID })}
    >
      {leading}
      <BaseBox display="flex" flexDirection="column" flex="1">
        {children && (
          <Text
            variant="body"
            size={keyTyping.size}
            weight={keyTyping.weight}
            color="surface.text.gray.muted"
          >
            {children}
          </Text>
        )}
        {helpText && (
          <Text
            variant="body"
            size={helpTextSize[size]}
            weight="regular"
            color="surface.text.gray.subtle"
          >
            {helpText}
          </Text>
        )}
      </BaseBox>
      {trailing}
    </BaseBox>
  );
};

const InfoItemKey = assignWithoutSideEffects(React.forwardRef(_InfoItemKey), {
  displayName: 'InfoItemKey',
  componentId: 'InfoItemKey',
});

// InfoItemValue Component
const _InfoItemValue = (
  { children, leading, trailing, testID }: InfoItemValueProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  const { size, textAlign } = React.useContext(InfoGroupContext);
  const valueTyping = valueTypography[size];

  return (
    <BaseBox
      ref={ref as never}
      display="flex"
      alignItems="center"
      gap={elementGap[size]}
      flex="1"
      justifyContent={textAlign === 'right' ? 'flex-end' : 'flex-start'}
      {...metaAttribute({ name: MetaConstants.InfoItemValue, testID })}
    >
      {leading}
      <BaseBox
        display="flex"
        alignItems="center"
        flex="1"
        justifyContent={textAlign === 'right' ? 'flex-end' : 'flex-start'}
      >
        {typeof children === 'string' ? (
          <Text
            variant="body"
            size={valueTyping.size}
            weight={valueTyping.weight}
            color="surface.text.gray.subtle"
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </BaseBox>
      {trailing}
    </BaseBox>
  );
};

const InfoItemValue = assignWithoutSideEffects(React.forwardRef(_InfoItemValue), {
  displayName: 'InfoItemValue',
  componentId: 'InfoItemValue',
});

// InfoItem Component
const _InfoItem = (
  { children, showDivider = false, testID }: InfoItemProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  const { size, itemOrientation } = React.useContext(InfoGroupContext);

  return (
    <BaseBox ref={ref as never} {...metaAttribute({ name: MetaConstants.InfoItem, testID })}>
      <BaseBox
        display="flex"
        flexDirection={itemOrientation === 'horizontal' ? 'row' : 'column'}
        gap={keyValueGap[size]}
        alignItems={itemOrientation === 'horizontal' ? 'center' : 'flex-start'}
      >
        {children}
      </BaseBox>
      {showDivider && <Divider marginY={dividerSpacing[size]} />}
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
    textAlign = 'left',
    testID,
    ...props
  }: InfoGroupProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
  if (__DEV__) {
    if (!children) {
      throwBladeError({
        message: 'InfoGroup requires InfoItem children.',
        moduleName: 'InfoGroup',
      });
    }
  }

  const contextValue = React.useMemo(
    () => ({
      size,
      itemOrientation,
      textAlign,
    }),
    [size, itemOrientation, textAlign],
  );

  return (
    <InfoGroupContext.Provider value={contextValue}>
      <BaseBox
        ref={ref as never}
        display="flex"
        flexDirection="column"
        gap={itemSpacing[size]}
        {...metaAttribute({ name: MetaConstants.InfoGroup, testID })}
        {...getStyledProps(props)}
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

export type {
  InfoGroupProps,
  InfoItemProps,
  InfoItemKeyProps,
  InfoItemValueProps,
  InfoItemIconProps,
};

export { InfoGroup, InfoItem, InfoItemKey, InfoItemValue, InfoItemIcon };
