import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Link } from '~components/Link';
import { ArrowUpIcon, StopCircleIcon, PlusIcon } from '~components/Icons';

type ChatInputActionBarProps = {
  /**
   * Replaces the upload link on the left of the bar.
   *
   * Used when the composer is doing something other than composing a message — collecting
   * feedback, say — where offering an attachment would be meaningless and the space is better
   * spent saying what mode you are in and how to leave it.
   */
  leadingSlot?: React.ReactNode;
  isDisabled?: boolean;
  isGenerating?: boolean;
  isSubmitDisabled?: boolean;
  hideFileUpload?: boolean;
  onUploadClick: () => void;
  onSubmit: () => void;
  onStop?: () => void;
};

const ChatInputActionBar = ({
  isDisabled,
  isGenerating,
  isSubmitDisabled,
  hideFileUpload = false,
  onUploadClick,
  onSubmit,
  onStop,
  leadingSlot,
}: ChatInputActionBarProps): React.ReactElement => {
  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      padding="spacing.5"
    >
      {leadingSlot ??
        (hideFileUpload ? (
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
        ))}
      <BaseBox>
        {isGenerating ? (
          <Button
            icon={StopCircleIcon}
            variant="secondary"
            accessibilityLabel="Stop generation"
            onClick={() => onStop?.()}
            size="small"
          />
        ) : (
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
        )}
      </BaseBox>
    </BaseBox>
  );
};

export { ChatInputActionBar };
export type { ChatInputActionBarProps };
