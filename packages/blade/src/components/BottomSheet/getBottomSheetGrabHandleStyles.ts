import type { CSSObject } from 'styled-components';
import type { Theme } from '~components/BladeProvider';
import size from '~tokens/global/size';
import { isReactNative } from '~utils';
import { makeSize } from '~utils/makeSize';
import { makeSpace } from '~utils/makeSpace';

const getHandlePartStyles = ({ theme }: { theme: Theme }): CSSObject => {
  return {
    margin: 'auto',
    content: "''",
    width: makeSize(size[56]),
    height: makeSize(size[4]),
    backgroundColor: theme.colors.brand.gray.a100.lowContrast,
    // TODO: we do not have 16px radius token
    borderRadius: makeSpace(theme.spacing[5]),
  };
};
const getBottomSheetGrabHandleStyles = ({ theme }: { theme: Theme }): CSSObject => {
  return {
    flexShrink: 0,
    paddingTop: makeSpace(theme.spacing[4]),
    marginBottom: makeSpace(theme.spacing[2]),
    touchAction: 'none',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    ...(isReactNative() ? undefined : { ':after': getHandlePartStyles({ theme }) }),
  };
};

export { getBottomSheetGrabHandleStyles, getHandlePartStyles };
