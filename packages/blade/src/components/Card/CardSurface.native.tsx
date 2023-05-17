import React from 'react';
import styled from 'styled-components/native';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import { castNativeType } from '~utils';

const CardSurfaceStyled = styled(BaseBox)<{ elevation: number; surfaceLevel: 2 | 3 }>(
  ({ surfaceLevel, theme }) => {
    const backgroundColor = theme.colors.surface.background[`level${surfaceLevel}`].lowContrast;
    return {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      ...castNativeType(theme.shadows.lowRaised),
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
      elevation={castNativeType(theme.shadows.lowRaised).elevation}
    >
      {children}
    </CardSurfaceStyled>
  );
};

export { CardSurface };
