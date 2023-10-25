import type { CSSObject } from 'styled-components';
import type { Theme } from '~components/BladeProvider';
import { makeSize } from '~utils/makeSize';
import { size } from '~tokens/global';

const getBaseListBoxWrapperStyles = (props: {
  theme: Theme;
  isInBottomSheet: boolean;
}): CSSObject => {
  return {
    maxHeight: props.isInBottomSheet ? undefined : makeSize(size[300]),
    padding: props.isInBottomSheet ? undefined : makeSize(props.theme.spacing[3]),
  };
};

export { getBaseListBoxWrapperStyles };
