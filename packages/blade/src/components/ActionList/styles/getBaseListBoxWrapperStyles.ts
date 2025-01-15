import type { CSSObject } from 'styled-components';
import type { Theme } from '~components/BladeProvider';
import { makeSize } from '~utils/makeSize';
import { size } from '~tokens/global';

const actionListMaxHeight = size[300];

const getActionListPadding = (theme: Theme): number => {
  return theme.spacing[3];
};

const getBaseListBoxWrapperStyles = (props: {
  theme: Theme;
  isInBottomSheet: boolean;
}): CSSObject => {
  return {
    maxHeight: props.isInBottomSheet ? undefined : makeSize(actionListMaxHeight),
    padding: props.isInBottomSheet ? undefined : makeSize(getActionListPadding(props.theme)),
  };
};

export { getBaseListBoxWrapperStyles, actionListMaxHeight, getActionListPadding };
