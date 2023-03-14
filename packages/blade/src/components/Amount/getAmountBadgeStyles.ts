import type { CSSObject } from 'styled-components';
import { makeSpace } from '../../utils';
import type { Theme } from '../BladeProvider';

const getAmountStyles = ({ theme }: { theme: Theme }): CSSObject => ({
  paddingLeft: `${makeSpace(theme.spacing[2])}`,
  paddingRight: `${makeSpace(theme.spacing[2])}`,
});

export { getAmountStyles };
