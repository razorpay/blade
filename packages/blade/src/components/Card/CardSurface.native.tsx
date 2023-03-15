import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';

const isAndroid = Platform.OS === 'android';
// TODO: Temporary workaround to make android shadows look as close as iOS
const androidShadow = {
  color: undefined,
  elevation: 2,
};

const CardSurfaceStyled = styled(BaseBox)<{ elevation: number; surfaceLevel: 2 | 3 }>(
  ({ surfaceLevel, theme }) => {
    const backgroundColor = theme.colors.surface.background[`level${surfaceLevel}`].lowContrast;
    return {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      shadowOpacity: '1',
      shadowRadius: theme.shadows.blurRadius.level[1],
      shadowColor: isAndroid ? androidShadow.color : theme.shadows.color.level[1],
      shadowOffset: `0px ${theme.shadows.offsetY.level[1]}px`,
      backgroundColor,
    };
  },
);

type CardSurfaceProps = {
  children: React.ReactNode;
  surfaceLevel: 2 | 3;
} & BaseBoxProps;

const CardSurface = ({
  children,
  surfaceLevel,
  ...props
}: CardSurfaceProps): React.ReactElement => {
  const { theme } = useTheme();

  return (
    <CardSurfaceStyled
      {...props}
      surfaceLevel={surfaceLevel}
      elevation={isAndroid ? androidShadow.elevation : theme.shadows.androidElevation.level[1]}
    >
      {children}
    </CardSurfaceStyled>
  );
};

export { CardSurface };
