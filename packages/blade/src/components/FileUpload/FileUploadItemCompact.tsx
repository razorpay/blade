import { StyledFileUploadItemWrapper } from './StyledFileUploadItemWrapper';
import type { FileUploadItemProps } from './types';
import { FileUploadItemIcon } from './FileUploadItemIcon';
import { fileUploadItemCompactTokens } from './fileUploadTokens';
import { FileUploadItemCompactTrigger } from './FileUploadItemCompactTrigger';
import isUndefined from '~utils/lodashButBetter/isUndefined';
import { makeSize } from '~utils';
import { CloseIcon } from '~components/Icons';
import { BaseBox } from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { IconButton } from '~components/Button/IconButton';
import { ProgressBar } from '~components/ProgressBar';
import { Tooltip } from '~components/Tooltip';
import { getStyledProps } from '~components/Box/styledProps';

type FileUploadItemCompactProps = Omit<
  FileUploadItemProps,
  '_isCompact' | 'size' | 'onPreview' | 'onReupload'
>;

/**
 * The 32px one-line chip FileUploadItem renders with `_isCompact`, for tight places such as
 * ChatInput attachments. It shows the file name and a single ×. A failed file has no retry: people
 * remove it and attach it again. Why an upload failed shows in a Tooltip on hover or keyboard focus
 * on web, and on tap on native.
 */
const FileUploadItemCompact = ({
  file,
  onRemove,
  onDismiss,
  width,
  minWidth,
  maxWidth,
  flexShrink,
  flexGrow,
  flexBasis,
  ...rest
}: FileUploadItemCompactProps): React.ReactElement => {
  const { name, uploadPercent, errorText, status } = file;
  const isUploading = status === 'uploading';
  const isError = status === 'error';

  const fileLabel = (
    <BaseBox display="flex" flexDirection="row" alignItems="center" gap="spacing.3" minWidth="0px">
      <FileUploadItemIcon uploadStatus={status} isCompact />
      <BaseBox
        flexShrink={1}
        minWidth="0px"
        maxWidth={makeSize(fileUploadItemCompactTokens.nameMaxWidth)}
      >
        <Text
          size="small"
          weight="medium"
          color={fileUploadItemCompactTokens.name[isUploading ? 'uploading' : 'default']}
          truncateAfterLines={1}
        >
          {name}
        </Text>
      </BaseBox>
    </BaseBox>
  );

  return (
    <StyledFileUploadItemWrapper
      isCompact
      size="medium"
      status={status ?? 'success'}
      borderRadius="small"
      borderWidth="thin"
      width={width}
      minWidth={minWidth}
      maxWidth={maxWidth}
      flexShrink={flexShrink}
      flexGrow={flexGrow}
      flexBasis={flexBasis}
      {...getStyledProps(rest)}
    >
      <BaseBox
        display="flex"
        flexDirection="row"
        alignItems="center"
        gap="spacing.3"
        paddingLeft="spacing.2"
        paddingRight="spacing.3"
        minWidth="0px"
      >
        {isError && errorText ? (
          <Tooltip content={errorText} placement="top">
            <FileUploadItemCompactTrigger
              accessibilityLabel={`${name}, upload failed: ${errorText}`}
            >
              {fileLabel}
            </FileUploadItemCompactTrigger>
          </Tooltip>
        ) : (
          fileLabel
        )}
        {isUploading || onRemove ? (
          <IconButton
            size="small"
            accessibilityLabel={`Remove ${name}`}
            icon={CloseIcon}
            // while uploading, × cancels the upload
            onClick={() => (isUploading ? onDismiss?.({ file }) : onRemove?.({ file }))}
          />
        ) : null}
      </BaseBox>
      {isUploading ? (
        <BaseBox position="absolute" bottom="spacing.0" left="spacing.0" width="100%">
          <ProgressBar
            showPercentage={false}
            value={uploadPercent ?? 0}
            isIndeterminate={isUndefined(uploadPercent)}
          />
        </BaseBox>
      ) : null}
    </StyledFileUploadItemWrapper>
  );
};

export { FileUploadItemCompact };
