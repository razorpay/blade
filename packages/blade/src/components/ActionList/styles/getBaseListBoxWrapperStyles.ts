import type { CSSObject } from 'styled-components';
import type { Theme } from '~components/BladeProvider';
import size from '~tokens/global/size';
import { makeSize } from '~utils';

const getBaseListBoxWrapperStyles = (props: { theme: Theme }): CSSObject => {
  return {
    maxHeight: makeSize(size[300]),
    padding: makeSize(props.theme.spacing[3]),
  };
};

export { getBaseListBoxWrapperStyles };
