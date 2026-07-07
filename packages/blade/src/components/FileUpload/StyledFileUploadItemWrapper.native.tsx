import React from 'react';
import { View } from 'react-native';
import type { StyledFileUploadItemWrapperProps } from './types';
import { fileUploadItemBackgroundColors, fileUploadHeightTokens } from './fileUploadTokens';
import getIn from '~utils/lodashButBetter/get';
import { useTheme } from '~components/BladeProvider';
import { colors as globalColors } from '~tokens/global';

type NativeProps = Omit<StyledFileUploadItemWrapperProps, 'theme'> & {
  borderRadius?: string;
  borderWidth?: string;
  children: React.ReactNode;
  [key: string]: unknown;
};

const StyledFileUploadItemWrapper = ({
  status,
  size,
  children,
}: NativeProps): React.ReactElement => {
  const { theme, colorScheme } = useTheme();

  const shadowColor =
    colorScheme === 'light'
      ? globalColors.neutral.blueGrayLight[900]
      : globalColors.neutral.black[50];

  return (
    <View
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 8,
        minHeight: fileUploadHeightTokens[size === 'variable' ? 'large' : size],
        width: '100%',
        backgroundColor: getIn(theme.colors, fileUploadItemBackgroundColors[status].default),
        borderColor:
          status === 'error'
            ? getIn(theme.colors, 'interactive.border.negative.faded')
            : getIn(theme.colors, 'surface.border.gray.subtle'),
        shadowColor,
        shadowOffset: { width: 0, height: 0.5 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 1,
      }}
    >
      {children}
    </View>
  );
};

export { StyledFileUploadItemWrapper };
