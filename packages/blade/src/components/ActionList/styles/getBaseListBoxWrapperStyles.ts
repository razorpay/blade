import type { CSSObject } from 'styled-components';
import type { Theme } from '~components/BladeProvider';
import { makeSize } from '~utils';

const getBaseListBoxWrapperStyles = (props: { theme: Theme }): CSSObject => {
  return {
    maxHeight: makeSize(300),
    padding: makeSize(props.theme.spacing[3]),
  };
};

export { getBaseListBoxWrapperStyles };
