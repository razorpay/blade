import { StyledFileUploadItemWrapper } from './StyledFileUploadItemWrapper';
import type { FileUploadItemProps } from './types';
import { FileUploadItemIcon } from './FileUploadItemIcon';
import { fileUploadItemCompactTokens } from './fileUploadTokens';
import { FileUploadItemCompactTrigger } from './FileUploadItemCompactTrigger';
import { MAKE_ANALYTICS_CONSTANTS } from '~utils/makeAnalyticsAttribute';
import isUndefined from '~utils/lodashButBetter/isUndefined';
import { makeSize } from '~utils';
import { CloseIcon, RotateClockWiseIcon } from '~components/Icons';
import { BaseBox } from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { IconButton } from '~components/Button/IconButton';
import { ProgressBar } from '~components/ProgressBar';
import { Tooltip } from '~components/Tooltip';
import { getStyledProps } from '~components/Box/styledProps';

type FileUploadItemCompactProps = Omit<FileUploadItemProps, '_isCompact' | 'size' | 'onPreview'>;

/**
 * The 32px one-line chip FileUploadItem renders with `_isCompact`, for tight places such as
 * ChatInput attachments. It shows the file name and ×, plus retry on a failed file. Why an upload
 * failed shows in a Tooltip on hover or keyboard focus on web, and on tap on native.
 */
const FileUploadItemCompact = ({
  file,
  onRemove,
  onReupload,
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
            <FileUploadItemCompactTrigger>{fileLabel}</FileUploadItemCompactTrigger>
          </Tooltip>
        ) : (
          fileLabel
        )}
        {/* While uploading, × cancels the upload */}
        {isUploading ? (
          <IconButton
            size="small"
            accessibilityLabel={`Remove ${name}`}
            icon={CloseIcon}
            onClick={() => onDismiss?.({ file })}
          />
        ) : null}
        {isError && onReupload ? (
          <IconButton
            size="small"
            accessibilityLabel={`Reupload ${name}`}
            icon={RotateClockWiseIcon}
            onClick={() => onReupload({ file })}
            data-analytics-name={MAKE_ANALYTICS_CONSTANTS.FILE_UPLOAD.REUPLOAD_BUTTON}
          />
        ) : null}
        {/* A failed file keeps × next to retry: ChatInput can't send while a file has failed, so a
            file that keeps failing must stay removable */}
        {!isUploading && onRemove ? (
          <IconButton
            size="small"
            accessibilityLabel={`Remove ${name}`}
            icon={CloseIcon}
            onClick={() => onRemove({ file })}
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
