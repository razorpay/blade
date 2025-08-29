import { Theme } from '../BladeProvider';
import { SpacingValueType } from '../Box/BaseBox';
declare const overlayPaddingX = "spacing.3";
declare const overlayPaddingY = "spacing.4";
declare const headerMarginBottom = "spacing.3";
declare const footerPaddingTop = "spacing.3";
type GetDividerMarginTokensReturnType = {
    marginLeft: SpacingValueType;
    marginRight: SpacingValueType;
    marginY: SpacingValueType;
};
declare const getDividerMarginTokens: (theme: Theme) => GetDividerMarginTokensReturnType;
declare const MENU_MIN_WIDTH: {
    readonly base: "200px";
    readonly s: "240px";
};
export { overlayPaddingX, overlayPaddingY, MENU_MIN_WIDTH, getDividerMarginTokens, headerMarginBottom, footerPaddingTop, };
