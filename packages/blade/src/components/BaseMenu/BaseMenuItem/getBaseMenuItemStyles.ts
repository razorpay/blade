import type { CSSObject } from 'styled-components';
import type { Theme } from '~components/BladeProvider';
import { isReactNative, makeBorderSize } from '~utils';
import { makeSize } from '~utils/makeSize';

const getBaseMenuItemStyles = (props: { theme: Theme }): CSSObject => {
  return {
    borderWidth: makeBorderSize(props.theme.border.width.none),
    display: 'flex',
    flexDirection: 'column',
    textAlign: isReactNative() ? undefined : 'left',
    backgroundColor: 'transparent',
    borderRadius: makeSize(props.theme.border.radius.medium),
    marginTop: makeSize(props.theme.spacing[1]),
    marginBottom: makeSize(props.theme.spacing[1]),
    textDecoration: 'none',
    cursor: 'pointer',
    width: '100%',
  };
};

export { getBaseMenuItemStyles };
