import type { CSSObject } from 'styled-components';
import type { Theme } from '~components/BladeProvider';
import getTextStyles from '~components/Typography/Text/getTextStyles';
import { makeBorderSize, makeSpace } from '~utils';

const getBaseInputStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  ...getTextStyles({
    size: 'medium',
    variant: 'body',
    type: 'subtle',
    weight: 'regular',
    contrast: 'low',
    theme,
  }),
  backgroundColor: theme.colors.brand.gray[200],
  paddingTop: makeSpace(theme.spacing[2]),
  paddingBottom: makeSpace(theme.spacing[2]),
  paddingLeft: makeSpace(theme.spacing[3]),
  paddingRight: makeSpace(theme.spacing[3]),
  borderTopLeftRadius: makeBorderSize(theme.border.radius.small),
  borderTopRightRadius: makeBorderSize(theme.border.radius.small),
  borderBottomWidth: makeBorderSize(theme.border.width.thin),
  borderBottomColor: theme.colors.brand.gray[400],
  width: '100%',
});

export default getBaseInputStyles;
