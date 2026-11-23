import React from 'react';
import type { StyledFileUploadItemWrapperProps } from './types';
import type { BoxProps } from '~components/Box';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import {
  fileUploadItemColorTokens,
  fileUploadItemCompactTokens,
  fileUploadItemHeightTokens,
} from './fileUploadTokens';
import getIn from '~utils/lodashButBetter/get';
import { makeSize } from '~utils';
import { useTheme } from '~components/BladeProvider';
import { colors as globalColors } from '~tokens/global';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';

type NativeProps = Omit<StyledFileUploadItemWrapperProps, 'theme'> &
  Pick<
    BoxProps,
    | 'width'
    | 'minWidth'
    | 'maxWidth'
    | 'flexShrink'
    | 'flexGrow'
    | 'flexBasis'
    | 'borderRadius'
    | 'borderWidth'
  > &
  StyledPropsBlade & {
    children: React.ReactNode;
  };

const StyledFileUploadItemWrapper = ({
  status,
  size,
  isCompact = false,
  children,
  borderRadius = 'medium',
  borderWidth = 'thin',
  width,
  minWidth,
  maxWidth,
  flexShrink,
  flexGrow,
  flexBasis,
  ...rest
}: NativeProps): React.ReactElement => {
  const { theme, colorScheme } = useTheme();
  const errorOrDefault = status === 'error' ? 'error' : 'default';

  if (isCompact) {
    // As wide as its content, so a row of chips stays compact. No shadow and no hover on touch.
    return (
      <BaseBox
        position="relative"
        overflow="hidden"
        display="flex"
        flexDirection="row"
        alignItems="center"
        alignSelf="flex-start"
        borderStyle="solid"
        borderWidth={borderWidth}
        borderRadius={borderRadius}
        minHeight={makeSize(fileUploadItemCompactTokens.height)}
        width={width}
        minWidth={minWidth}
        maxWidth={maxWidth}
        flexShrink={flexShrink}
        flexGrow={flexGrow}
        flexBasis={flexBasis}
        backgroundColor={getIn(theme.colors, fileUploadItemCompactTokens.background.default)}
        borderColor={getIn(theme.colors, fileUploadItemCompactTokens.border[errorOrDefault])}
        {...getStyledProps(rest)}
      >
        {children}
      </BaseBox>
    );
  }

  const shadowColor =
    colorScheme === 'light'
      ? globalColors.neutral.blueGrayLight.a906
      : globalColors.neutral.black[50];

  return (
    <BaseBox
      position="relative"
      overflow="hidden"
      display="flex"
      justifyContent="space-between"
      borderStyle="solid"
      borderWidth={borderWidth}
      borderRadius={borderRadius}
      minHeight={makeSize(fileUploadItemHeightTokens[size])}
      width={width ?? '100%'}
      minWidth={minWidth}
      maxWidth={maxWidth}
      flexShrink={flexShrink}
      flexGrow={flexGrow}
      flexBasis={flexBasis}
      backgroundColor={getIn(theme.colors, fileUploadItemColorTokens.background)}
      borderColor={getIn(theme.colors, fileUploadItemColorTokens.border[errorOrDefault])}
      style={{
        shadowColor,
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 1,
      }}
      {...getStyledProps(rest)}
    >
      {children}
    </BaseBox>
  );
};

export { StyledFileUploadItemWrapper };
