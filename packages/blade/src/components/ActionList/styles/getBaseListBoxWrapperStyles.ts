import type { CSSObject } from 'styled-components';
import type { Theme } from '~components/BladeProvider';
import sizes from '~tokens/global/sizes';
import { makeSize } from '~utils';

const getBaseListBoxWrapperStyles = (props: { theme: Theme }): CSSObject => {
  return {
    maxHeight: makeSize(sizes[4000]),
    padding: makeSize(props.theme.spacing[3]),
  };
};

export { getBaseListBoxWrapperStyles };
