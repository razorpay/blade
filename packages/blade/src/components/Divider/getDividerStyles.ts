import type { CSSObject } from 'styled-components';
import type { Theme } from '~components/BladeProvider';
import { makeSize } from '~utils';

const getDividerStyles = (theme: Theme): CSSObject => {
  return {
    borderBottomWidth: makeSize(theme.border.width.thin),
    borderBottomStyle: 'solid',
    borderColor: theme.colors.surface.border.normal.lowContrast,
  };
};

export { getDividerStyles };
