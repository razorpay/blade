import type { CSSObject } from 'styled-components';
import type { Theme } from '~components/BladeProvider';
import { isReactNative } from '~utils';
import { makeSize } from '~utils/makeSize';
import { makeSpace } from '~utils/makeSpace';
import { size, ZIndex } from '~tokens/global';

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
const getBottomSheetGrabHandleStyles = ({
  theme,
  isHeaderFloating,
}: {
  theme: Theme;
  isHeaderFloating?: boolean;
}): CSSObject => {
  return {
    position: isHeaderFloating ? 'absolute' : 'relative',
    flexShrink: 0,
    paddingTop: makeSpace(theme.spacing[4]),
    marginBottom: makeSpace(theme.spacing[2]),
    touchAction: 'none',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: ZIndex[100],
    ...(isReactNative() ? undefined : { ':after': getHandlePartStyles({ theme }) }),
  };
};

export { getBottomSheetGrabHandleStyles, getHandlePartStyles };
