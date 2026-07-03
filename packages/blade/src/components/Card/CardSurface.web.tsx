import styled from 'styled-components';
import type { CardVariant } from './types';
import type { ColorSchemeNames } from '~tokens/theme';
import { getSurfaceStyles } from '~utils/makeSurfaceStyles';
import BaseBox from '~components/Box/BaseBox';

type CardSurfaceProps = {
  colorScheme: ColorSchemeNames;
  isSelected?: boolean;
  variant?: CardVariant;
};

const CardSurface = styled(BaseBox)<CardSurfaceProps>(
  ({ theme, colorScheme, isSelected, variant = 'primary' }) => ({
    width: '100%',
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    boxSizing: 'border-box',
    ...(variant === 'primary'
      ? getSurfaceStyles(theme, colorScheme, { hideBorder: isSelected })
      : {
          border: 'none',
          boxShadow: 'none',
          backgroundImage: 'none',
          backgroundColor: theme.colors.surface.background.gray.moderate,
        }),
  }),
);

export { CardSurface };
