import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { IconButton } from '~components/Button/IconButton';
import type { IconButtonProps } from '~components/Button/IconButton';
import { Link } from '~components/Link';
import { ArrowUpIcon, StopCircleIcon, PlusIcon } from '~components/Icons';
import { isReactNative } from '~utils';

type ChatInputActionBarProps = {
  isDisabled?: boolean;
  isGenerating?: boolean;
  isSubmitDisabled?: boolean;
  hideFileUpload?: boolean;
  onUploadClick: () => void;
  onSubmit: () => void;
  onStop?: () => void;
};

/**
 * Submit button, or the stop button while `isGenerating` is true.
 * Shared by the action bar (`size="medium"`) and the inline row (`size="small"`).
 */
const ChatInputSubmitButton = ({
  isDisabled,
  isGenerating,
  isSubmitDisabled,
  onSubmit,
  onStop,
}: Pick<
  ChatInputActionBarProps,
  'isDisabled' | 'isGenerating' | 'isSubmitDisabled' | 'onSubmit' | 'onStop'
>): React.ReactElement => {
  if (isGenerating) {
    return (
      <Button
        icon={StopCircleIcon}
        variant="secondary"
        accessibilityLabel="Stop generation"
        onClick={() => onStop?.()}
        size="small"
      />
    );
  }

  return (
    <Button
      icon={ArrowUpIcon}
      variant="primary"
      color="primary"
      accessibilityLabel="Submit"
      onClick={onSubmit}
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      isDisabled={isSubmitDisabled || isDisabled}
      size="small"
    />
  );
};

// Web: a highlighted IconButton, so the hit area is a 32px square like the submit button and not
// only the icon. React Native has no highlighted IconButton, so it keeps the larger plain icon.
const uploadButtonSizeProps = (isReactNative()
  ? { size: 'large' }
  : { size: 'medium', isHighlighted: true }) as Pick<IconButtonProps, 'size' | 'isHighlighted'>;

/**
 * Icon-only upload button for the inline row of `size="small"`.
 * Keeps the accessible name of the "Upload file" link in the action bar.
 */
const ChatInputUploadButton = ({
  isDisabled,
  onUploadClick,
}: Pick<ChatInputActionBarProps, 'isDisabled' | 'onUploadClick'>): React.ReactElement => {
  return (
    <IconButton
      icon={PlusIcon}
      {...uploadButtonSizeProps}
      accessibilityLabel="Upload file"
      onClick={onUploadClick}
      isDisabled={isDisabled}
    />
  );
};

const ChatInputActionBar = ({
  isDisabled,
  isGenerating,
  isSubmitDisabled,
  hideFileUpload = false,
  onUploadClick,
  onSubmit,
  onStop,
}: ChatInputActionBarProps): React.ReactElement => {
  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      padding="spacing.5"
    >
      {hideFileUpload ? (
        <BaseBox />
      ) : (
        <BaseBox display="flex" alignItems="center">
          <Link
            variant="button"
            color="neutral"
            size="small"
            icon={PlusIcon}
            onClick={onUploadClick}
            isDisabled={isDisabled}
          >
            Upload file
          </Link>
        </BaseBox>
      )}
      <BaseBox>
        <ChatInputSubmitButton
          isDisabled={isDisabled}
          isGenerating={isGenerating}
          isSubmitDisabled={isSubmitDisabled}
          onSubmit={onSubmit}
          onStop={onStop}
        />
      </BaseBox>
    </BaseBox>
  );
};

export { ChatInputActionBar, ChatInputSubmitButton, ChatInputUploadButton };
export type { ChatInputActionBarProps };
