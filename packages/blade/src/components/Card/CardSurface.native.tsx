import React from 'react';
import styled from 'styled-components/native';
import { useTheme } from '~components/BladeProvider';
import Box from '~components/Box';
import type { BoxProps } from '~components/Box/types';

const CardSurfaceStyled = styled(Box)<{ elevation: number; surfaceLevel: 2 | 3 }>(
  ({ surfaceLevel, theme }) => {
    const backgroundColor = theme.colors.surface.background[`level${surfaceLevel}`].lowContrast;
    return {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      shadowOpacity: '1',
      shadowRadius: theme.shadows.blurRadius.level[1],
      shadowColor: theme.shadows.color.level[1],
      shadowOffset: `0px ${theme.shadows.offsetY.level[1]}px`,
      backgroundColor,
    };
  },
);

type CardSurfaceProps = {
  children: React.ReactNode;
  surfaceLevel: 2 | 3;
} & BoxProps;

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
      elevation={theme.shadows.androidElevation.level[1]}
    >
      {children}
    </CardSurfaceStyled>
  );
};

export { CardSurface };
