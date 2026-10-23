import React from 'react';
import { ChatInputSubmitButton, ChatInputUploadButton } from './ChatInputActionBar';
import type { ChatInputActionBarProps } from './ChatInputActionBar';
import { useTheme } from '~components/BladeProvider';
import type { Theme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { minHeight as buttonMinHeight } from '~components/Button/BaseButton/buttonTokens';
import { highlightedButtonSizeMap } from '~components/Button/IconButton/tokens';
import { iconSizeMap } from '~components/Icons/useIconProps/iconSizeMap';
import { inputDropdownButtonPadding } from '~components/Input/BaseInput/baseInputTokens';
import { isReactNative, makeSpace } from '~utils';

/**
 * Layout of `size="small"`: upload and submit sit inline with the text, in BaseInput's leading and
 * trailing slots. On a single row both buttons are centred on the line of text. As the text area
 * grows they stay on the bottom row (BaseInput `visualsAlignment="bottom"`).
 *
 * BaseInput pads its slots itself (see `getInteractionElementStyles` and the leading slot in
 * `BaseInputVisuals`): the leading slot gets `spacing.2` on the left and
 * `spacing[inputDropdownButtonPadding.medium]` above and below, the trailing slot gets `spacing.4`
 * on the right. The values below account for that padding.
 */
const getChatInputInlineLayout = (
  theme: Theme,
): {
  singleRowHeight: number;
  uploadPaddingLeft: number;
  uploadBottomInset: number;
  submitBottomInset: number;
  textStartWithUpload: number;
  textEndBeforeSubmit: number;
} => {
  // Same padding as ChatInput passes to BaseInput, on all four sides of the text area
  const textAreaPadding = theme.spacing[5];
  const lineHeight = theme.typography.lineHeights[100];
  // Icon-only `small` Button: a square as wide as it is tall
  const submitSize = buttonMinHeight.small;
  // Web: highlighted `medium` IconButton, a square container around the icon. Native: `large`
  // IconButton, the icon alone (see ChatInputUploadButton)
  const uploadSize = isReactNative() ? iconSizeMap.large : highlightedButtonSizeMap.medium;
  const leadingSlotPaddingLeft = theme.spacing[2];
  const leadingSlotPaddingY = theme.spacing[inputDropdownButtonPadding.medium];
  const trailingSlotPaddingRight = theme.spacing[4];
  // Puts the upload button as far from the left edge as submit is from the right edge
  const uploadPaddingLeft = trailingSlotPaddingRight - leadingSlotPaddingLeft;
  const singleRowHeight = textAreaPadding * 2 + lineHeight;

  return {
    singleRowHeight,
    uploadPaddingLeft,
    uploadBottomInset: (singleRowHeight - uploadSize) / 2 - leadingSlotPaddingY,
    submitBottomInset: (singleRowHeight - submitSize) / 2,
    textStartWithUpload: leadingSlotPaddingLeft + uploadPaddingLeft + uploadSize + textAreaPadding,
    textEndBeforeSubmit: textAreaPadding + submitSize + trailingSlotPaddingRight,
  };
};

type ChatInputInlineUploadProps = Pick<ChatInputActionBarProps, 'isDisabled' | 'onUploadClick'>;

const ChatInputInlineUpload = ({
  isDisabled,
  onUploadClick,
}: ChatInputInlineUploadProps): React.ReactElement => {
  const { theme } = useTheme();
  const { uploadPaddingLeft, uploadBottomInset } = getChatInputInlineLayout(theme);

  return (
    <BaseBox
      display="flex"
      paddingLeft={makeSpace(uploadPaddingLeft)}
      paddingBottom={makeSpace(uploadBottomInset)}
    >
      <ChatInputUploadButton isDisabled={isDisabled} onUploadClick={onUploadClick} />
    </BaseBox>
  );
};

type ChatInputInlineSubmitProps = Pick<
  ChatInputActionBarProps,
  'isDisabled' | 'isGenerating' | 'isSubmitDisabled' | 'onSubmit' | 'onStop'
>;

const ChatInputInlineSubmit = (props: ChatInputInlineSubmitProps): React.ReactElement => {
  const { theme } = useTheme();
  const { submitBottomInset } = getChatInputInlineLayout(theme);

  return (
    <BaseBox display="flex" paddingBottom={makeSpace(submitBottomInset)}>
      <ChatInputSubmitButton {...props} />
    </BaseBox>
  );
};

export { getChatInputInlineLayout, ChatInputInlineUpload, ChatInputInlineSubmit };
