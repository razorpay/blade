import React from 'react';
import styled from 'styled-components/native';
import type { CardVariant } from './types';
import BaseBox from '~components/Box/BaseBox';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import type { ColorSchemeNames } from '~tokens/theme';
import { castNativeType, makeBorderSize } from '~utils';

const CardSurfaceStyled = styled(BaseBox)<{ variant?: CardVariant }>(
  ({ theme, variant = 'primary' }) => {
    return {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      ...(variant === 'primary'
        ? {
            borderWidth: makeBorderSize(theme.border.width.thin),
            borderStyle: 'solid',
            borderColor: `${theme.colors.surface.border.gray.muted}`,
          }
        : {
            borderWidth: 0,
            backgroundColor: theme.colors.surface.background.gray.moderate,
          }),
    };
  },
);

type CardSurfaceProps = {
  children: React.ReactNode;
  colorScheme?: ColorSchemeNames;
  isSelected?: boolean;
  variant?: CardVariant;
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
  variant,
  ...props
}: CardSurfaceProps): React.ReactElement => {
  return (
    <CardSurfaceStyled
      {...props}
      backgroundColor={backgroundColor}
      variant={variant}
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
