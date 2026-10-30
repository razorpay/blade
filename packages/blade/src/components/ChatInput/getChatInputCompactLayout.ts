import type { Theme } from '~components/BladeProvider';
import { minHeight as buttonMinHeight } from '~components/Button/BaseButton/buttonTokens';
import { inputDropdownButtonPadding } from '~components/Input/BaseInput/baseInputTokens';

/**
 * Layout of `size="small"` while it is one row: the "+" and Send sit inline with the text, in
 * BaseInput's leading and trailing slots, centred on the line of text. As the text area grows
 * they stay on the bottom row (BaseInput `visualsAlignment="bottom"`), until the text needs a
 * second line and the input opens into the full layout.
 *
 * BaseInput pads its slots itself: the leading slot gets `spacing.2` on the left and
 * `spacing[inputDropdownButtonPadding.medium]` above and below, the trailing slot gets `spacing.4`
 * on the right. The values below account for that padding.
 */
const getChatInputCompactLayout = (
  theme: Theme,
): {
  textAreaPadding: number;
  singleRowHeight: number;
  leadingPaddingLeft: number;
  leadingMarginRight: number;
  leadingBottomInset: number;
  trailingMarginLeft: number;
  trailingMarginRight: number;
  trailingBottomInset: number;
  textStartWithLeading: number;
  textEndBeforeTrailing: number;
} => {
  // 12 px around one 20 px line: the 44 px row of the AI Elements design
  const textAreaPadding = theme.spacing[4];
  const lineHeight = theme.typography.lineHeights[100];
  const buttonSize = buttonMinHeight.xsmall;
  // Figma: the "+" and Send sit 8 px from the edges, with an 8 px gap to the text
  const edgeInset = theme.spacing[3];
  const gapToText = theme.spacing[3];
  const leadingSlotPaddingLeft = theme.spacing[2];
  const leadingSlotPaddingY = theme.spacing[inputDropdownButtonPadding.medium];
  const trailingSlotPaddingRight = theme.spacing[4];
  const singleRowHeight = textAreaPadding * 2 + lineHeight;

  const leadingPaddingLeft = edgeInset - leadingSlotPaddingLeft;
  const textStartWithLeading = edgeInset + buttonSize + gapToText;
  const textEndBeforeTrailing = edgeInset + buttonSize + gapToText;

  return {
    textAreaPadding,
    singleRowHeight,
    leadingPaddingLeft,
    // pull the text area in so the text starts 8 px after the "+"
    leadingMarginRight:
      textStartWithLeading -
      (leadingSlotPaddingLeft + leadingPaddingLeft + buttonSize) -
      textAreaPadding,
    leadingBottomInset: Math.max(0, (singleRowHeight - buttonSize) / 2 - leadingSlotPaddingY),
    // BaseInput gives the trailing slot 12 px on the right and the text 12 px of padding;
    // Figma wants 8 px for both
    trailingMarginLeft: gapToText - textAreaPadding,
    trailingMarginRight: edgeInset - trailingSlotPaddingRight,
    trailingBottomInset: Math.max(0, (singleRowHeight - buttonSize) / 2),
    textStartWithLeading,
    textEndBeforeTrailing,
  };
};

export { getChatInputCompactLayout };
