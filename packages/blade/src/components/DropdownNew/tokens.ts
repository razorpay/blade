import type { Theme } from '~components/BladeProvider';
import type { SpacingValueType } from '~components/Box/BaseBox';
import { size } from '~tokens/global';
import { makeSize, makeSpace } from '~utils';
import getIn from '~utils/lodashButBetter/get';

const overlayPaddingX = 'spacing.3';
const overlayPaddingY = 'spacing.4';
const headerMarginBottom = 'spacing.3';
const footerPaddingTop = 'spacing.3';

type GetDividerMarginTokensReturnType = {
  marginLeft: SpacingValueType;
  marginRight: SpacingValueType;
  marginY: SpacingValueType;
};

const getDividerMarginTokens = (theme: Theme): GetDividerMarginTokensReturnType => {
  const overlayPaddingXValue = getIn(theme, overlayPaddingX);
  return {
    marginLeft: `-${makeSpace(overlayPaddingXValue)}`,
    marginRight: `-${makeSpace(overlayPaddingXValue)}`,
    marginY: 'spacing.1',
  };
};

const MENU_MIN_WIDTH = {
  base: makeSize(size['200']),
  s: makeSize(size['240']),
} as const;

export {
  overlayPaddingX,
  overlayPaddingY,
  MENU_MIN_WIDTH,
  getDividerMarginTokens,
  headerMarginBottom,
  footerPaddingTop,
};
