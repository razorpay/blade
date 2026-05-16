import { isReactNative, makeBorderSize } from '~utils';
import { makeSize } from '~utils/makeSize';
import type { CSSObject } from 'styled-components';
import type { Theme } from '~components/BladeProvider';

const getBaseMenuItemStyles = (props: { theme: Theme }): CSSObject => {
  return {
    borderWidth: makeBorderSize(props.theme.border.width.none),
    display: 'flex',
    flexDirection: 'column',
    textAlign: isReactNative() ? undefined : 'left',
    backgroundColor: 'transparent',
    borderRadius: makeSize(props.theme.border.radius.small),
    textDecoration: 'none',
    cursor: 'pointer',
    width: '100%',
  };
};

export { getBaseMenuItemStyles };
