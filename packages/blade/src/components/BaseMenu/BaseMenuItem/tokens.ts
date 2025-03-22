import type { Theme } from '~components/BladeProvider';
import { size } from '~tokens/global';

const itemFirstRowHeight = size[20];
const actionListItemPadding = 8;
const dividerYMargin = 1;
// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
const actionListSectionTitleHeight = size[18] + actionListItemPadding * 2;
// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
const actionListDividerHeight = size[1] + dividerYMargin * 2;

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

const getActionListItemHeight = (
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

export {
  actionListSectionTitleHeight,
  actionListDividerHeight,
  itemFirstRowHeight,
  getItemPadding,
  getItemMargin,
  getActionListItemHeight,
};
