import React from 'react';
import styled from 'styled-components/native';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { ColorSchemeNames } from '~tokens/theme';
import { castNativeType, makeBorderSize } from '~utils';

const CardSurfaceStyled = styled(BaseBox)(({ theme }) => {
  return {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderWidth: makeBorderSize(theme.border.width.thin),
    borderStyle: 'solid',
    borderColor: `${theme.colors.surface.border.gray.muted}`,
  };
});

type CardSurfaceProps = {
  children: React.ReactNode;
  colorScheme?: ColorSchemeNames;
  isSelected?: boolean;
} & BaseBoxProps;

const CardSurface = ({
  children,
  backgroundColor,
  onTouchEnd,
  onTouchStart,
  onPointerDown,
  onPointerEnter,
  pointerEvents,
  colorScheme: _colorScheme,
  isSelected: _isSelected,
  ...props
}: CardSurfaceProps): React.ReactElement => {
  return (
    <CardSurfaceStyled
      {...props}
      backgroundColor={backgroundColor}
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
