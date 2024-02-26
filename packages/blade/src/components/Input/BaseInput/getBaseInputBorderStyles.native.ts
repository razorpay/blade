import type { CSSObject } from 'styled-components';
import type { Theme } from '~components/BladeProvider';
import { makeBorderSize } from '~utils';

const getBaseInputBorderStyles = ({
  theme,
  borderColor,
}: {
  theme: Theme;
  borderWidth: number;
  borderColor: string;
}): CSSObject => ({
  borderColor,
  borderWidth: makeBorderSize(theme.border.width.thin),
});

export { getBaseInputBorderStyles };
