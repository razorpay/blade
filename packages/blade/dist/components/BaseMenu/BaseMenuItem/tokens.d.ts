import { Theme } from '../../BladeProvider';
declare const itemFirstRowHeight: 20;
declare const actionListSectionTitleHeight: number;
declare const actionListDividerHeight: number;
declare const getItemPadding: (theme: Theme) => {
    itemPaddingMobile: 4;
    itemPaddingDesktop: 8;
};
declare const getItemMargin: (theme: Theme) => number;
declare const getActionListItemHeight: (theme: Theme) => {
    itemHeightMobile: number;
    itemHeightDesktop: number;
};
export { actionListSectionTitleHeight, actionListDividerHeight, itemFirstRowHeight, getItemPadding, getItemMargin, getActionListItemHeight, };
