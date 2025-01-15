import type { Theme } from '~components/BladeProvider';
import { size } from '~tokens/global';

const itemFirstRowHeight = size[20];

const getItemPadding = (
  theme: Theme,
): {
  itemPaddingMobile: 4;
  itemPaddingDesktop: 8;
} => {
  return {
    itemPaddingMobile: theme.spacing[2],
    itemPaddingDesktop: theme.spacing[3],
  };
};

const getItemMargin = (theme: Theme): number => {
  return theme.spacing[1];
};

const getItemHeight = (
  theme: Theme,
): {
  itemHeightMobile: number;
  itemHeightDesktop: number;
} => {
  return {
    itemHeightMobile:
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      itemFirstRowHeight + getItemPadding(theme).itemPaddingMobile * 2 + getItemMargin(theme) * 2,
    itemHeightDesktop:
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      itemFirstRowHeight + getItemPadding(theme).itemPaddingDesktop * 2 + getItemMargin(theme) * 2,
  };
};

export { itemFirstRowHeight, getItemPadding, getItemMargin, getItemHeight };
