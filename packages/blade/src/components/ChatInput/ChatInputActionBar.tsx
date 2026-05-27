import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Link } from '~components/Link';
import { ArrowUpIcon, StopCircleIcon, PlusIcon } from '~components/Icons';

type ChatInputActionBarProps = {
  isDisabled?: boolean;
  isUploadDisabled?: boolean;
  isGenerating?: boolean;
  isSubmitDisabled?: boolean;
  hideFileUpload?: boolean;
  onUploadClick: () => void;
  onSubmit: () => void;
  onStop?: () => void;
};

const ChatInputActionBar = ({
  isDisabled,
  isUploadDisabled = false,
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
        <Link
          variant="button"
          color="neutral"
          size="small"
          icon={PlusIcon}
          onClick={onUploadClick}
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          isDisabled={isDisabled || isUploadDisabled}
        >
          Upload file
        </Link>
      )}
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
