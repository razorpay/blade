import React from 'react';
import styled from 'styled-components/native';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { Elevation } from '~tokens/global';
import { castNativeType, makeBorderSize } from '~utils';

const CardSurfaceStyled = styled(BaseBox)<{
  elevation: keyof Elevation;
}>(({ elevation, theme }) => {
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderWidth: elevation === 'none' ? makeBorderSize(theme.border.width.thin) : undefined,
    borderStyle: elevation === 'none' ? 'solid' : undefined,
    borderColor: elevation === 'none' ? `${theme.colors.surface.border.gray.muted}` : undefined,
  };
});

type CardSurfaceProps = {
  children: React.ReactNode;
  elevation: keyof Elevation;
} & Omit<BaseBoxProps, 'elevation'>;

const CardSurface = ({
  children,
  elevation,
  backgroundColor,
  onTouchEnd,
  onTouchStart,
  onPointerDown,
  onPointerEnter,
  pointerEvents,
  ...props
}: CardSurfaceProps): React.ReactElement => {
  return (
    <CardSurfaceStyled
      {...props}
      backgroundColor={backgroundColor}
      elevation={elevation}
      onPointerEnter={castNativeType(onPointerEnter)}
      onPointerDown={castNativeType(onPointerDown)}
      onTouchStart={castNativeType(onTouchStart)}
      onTouchEnd={castNativeType(onTouchEnd)}
      pointerEvents={castNativeType(pointerEvents)}
    >
      {children}
    </CardSurfaceStyled>
  );
};

export { CardSurface };
