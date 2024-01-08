import type { CSSProperties } from 'styled-components';
import type { Theme } from '../../components/BladeProvider';

function getFocusRingStyles(theme: Theme): CSSProperties {
  return {
    outline: `4px solid ${theme.colors.surface.border.primary.muted}`,
    outlineOffset: '1px',
  };
}

export { getFocusRingStyles };
