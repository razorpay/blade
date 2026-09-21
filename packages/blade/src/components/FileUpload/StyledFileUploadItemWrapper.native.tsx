import React from 'react';
import type { StyledFileUploadItemWrapperProps } from './types';
import type { BoxProps } from '~components/Box';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { fileUploadItemBackgroundColors, fileUploadHeightTokens } from './fileUploadTokens';
import getIn from '~utils/lodashButBetter/get';
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
  children,
  borderRadius = 'medium',
  borderWidth = 'thin',
  width = '100%',
  minWidth,
  maxWidth,
  flexShrink,
  flexGrow,
  flexBasis,
  ...rest
}: NativeProps): React.ReactElement => {
  const { theme, colorScheme } = useTheme();

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
      width={width}
      minWidth={minWidth}
      maxWidth={maxWidth}
      flexShrink={flexShrink}
      flexGrow={flexGrow}
      flexBasis={flexBasis}
      backgroundColor={getIn(
        theme.colors,
        fileUploadItemBackgroundColors[status ?? 'success'].default,
      )}
      borderColor={
        status === 'error'
          ? getIn(theme.colors, 'interactive.border.negative.faded')
          : getIn(theme.colors, 'surface.border.gray.subtle')
      }
      style={{
        minHeight: fileUploadHeightTokens[size === 'variable' ? 'large' : size],
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
