import React from 'react';
import styled from 'styled-components/native';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { Elevation } from '~tokens/global';
import type { SurfaceLevels } from '~tokens/theme/theme';
import { castNativeType } from '~utils';

const CardSurfaceStyled = styled(BaseBox)<{ surfaceLevel: Exclude<SurfaceLevels, 1> }>(
  ({ surfaceLevel, theme }) => {
    const backgroundColor = theme.colors.surface.background[`level${surfaceLevel}`].lowContrast;
    return {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor,
    };
  },
);

type CardSurfaceProps = {
  children: React.ReactNode;
  surfaceLevel: Exclude<SurfaceLevels, 1>;
  elevation: keyof Elevation;
} & BaseBoxProps;

const CardSurface = ({
  children,
  surfaceLevel,
  elevation,
  ...props
}: CardSurfaceProps): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <CardSurfaceStyled
      {...props}
      surfaceLevel={surfaceLevel}
      style={castNativeType(theme.elevation[elevation])}
    >
      {children}
    </CardSurfaceStyled>
  );
};

export { CardSurface };
