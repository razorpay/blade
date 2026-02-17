import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Link } from '~components/Link';
import { ArrowUpIcon, StopCircleIcon, PlusIcon } from '~components/Icons';

type ChatInputActionBarProps = {
  isDisabled?: boolean;
  isGenerating?: boolean;
  isSubmitDisabled?: boolean;
  onUploadClick: () => void;
  onSubmit: () => void;
  onStop?: () => void;
};

const ChatInputActionBar = ({
  isDisabled,
  isGenerating,
  isSubmitDisabled,
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
      padding="spacing.3"
    >
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
      <BaseBox>
        {isGenerating ? (
          <Button
            icon={StopCircleIcon}
            variant="secondary"
            accessibilityLabel="Stop generation"
            onClick={() => onStop?.()}
            size="medium"
          />
        ) : (
          <Button
            icon={ArrowUpIcon}
            variant="primary"
            color="primary"
            accessibilityLabel="Submit"
            onClick={onSubmit}
            isDisabled={isSubmitDisabled || isDisabled}
            size="medium"
          />
        )}
      </BaseBox>
    </BaseBox>
  );
};

export { ChatInputActionBar };
export type { ChatInputActionBarProps };
