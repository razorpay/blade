import React from 'react';
import styled from 'styled-components/native';
import { useTheme } from '~components/BladeProvider';
import Box from '~components/Box';

const CardSurfaceStyled = styled(Box)<{ elevation: number }>(({ theme }) => {
  return {
    shadowOpacity: '1',
    shadowRadius: theme.shadows.blurRadius.level[1],
    shadowColor: theme.shadows.color.level[1],
    shadowOffset: `0px ${theme.shadows.offsetY.level[1]}px`,
  };
});

const CardSurface = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <CardSurfaceStyled elevation={theme.shadows.androidElevation.level[1]}>
      {children}
    </CardSurfaceStyled>
  );
};

export { CardSurface };
