import React from 'react';
import styled from 'styled-components/native';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { Elevation } from '~tokens/global';
import type { SurfaceLevels } from '~tokens/theme/theme';

const CardSurfaceStyled = styled(BaseBox)<{
  surfaceLevel: Exclude<SurfaceLevels, 1>;
  elevation: keyof Elevation;
}>(({ surfaceLevel, elevation, theme }) => {
  const backgroundColor = theme.colors.surface.background[`level${surfaceLevel}`].lowContrast;
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderWidth: elevation === 'none' ? `${theme.border.width.thin}` : undefined,
    borderStyle: elevation === 'none' ? 'solid' : undefined,
    borderColor:
      elevation === 'none' ? `${theme.colors.surface.border.normal.lowContrast}` : undefined,
    backgroundColor,
  };
});

type CardSurfaceProps = {
  children: React.ReactNode;
  surfaceLevel: Exclude<SurfaceLevels, 1>;
  elevation: keyof Elevation;
} & Omit<BaseBoxProps, 'elevation'>;

const CardSurface = ({
  children,
  surfaceLevel,
  elevation,
  ...props
}: CardSurfaceProps): React.ReactElement => {
  return (
    <CardSurfaceStyled {...props} surfaceLevel={surfaceLevel} elevation={elevation}>
      {children}
    </CardSurfaceStyled>
  );
};

export { CardSurface };
