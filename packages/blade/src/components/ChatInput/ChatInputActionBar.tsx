import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { IconButton } from '~components/Button/IconButton';
import { Link } from '~components/Link';
import { ArrowUpIcon, StopCircleIcon, PlusIcon } from '~components/Icons';

type ChatInputActionBarProps = {
  isDisabled?: boolean;
  isGenerating?: boolean;
  isSubmitDisabled?: boolean;
  hideFileUpload?: boolean;
  onUploadClick: () => void;
  onSubmit: () => void;
  onStop?: () => void;
};

type ChatInputSubmitActionProps = Pick<
  ChatInputActionBarProps,
  'isDisabled' | 'isGenerating' | 'isSubmitDisabled' | 'onSubmit' | 'onStop'
>;

type ChatInputUploadActionProps = Pick<ChatInputActionBarProps, 'isDisabled' | 'onUploadClick'>;

/**
 * Submit button, or the stop button while `isGenerating` is true.
 * Shared by the action bar (`size="medium"`) and the inline row (`size="small"`).
 */
const ChatInputSubmitAction = ({
  isDisabled,
  isGenerating,
  isSubmitDisabled,
  onSubmit,
  onStop,
}: ChatInputSubmitActionProps): React.ReactElement => {
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

/**
 * Icon-only upload button for the inline row of `size="small"`.
 * Keeps the same accessible name as the "Upload file" link in the action bar.
 */
const ChatInputUploadAction = ({
  isDisabled,
  onUploadClick,
}: ChatInputUploadActionProps): React.ReactElement => {
  return (
    <IconButton
      icon={PlusIcon}
      size="large"
      emphasis="intense"
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
        <ChatInputSubmitAction
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

export { ChatInputActionBar, ChatInputSubmitAction, ChatInputUploadAction };
export type { ChatInputActionBarProps, ChatInputSubmitActionProps, ChatInputUploadActionProps };
