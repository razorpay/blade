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

/** The 32px chip `FileUploadItem` renders with `_isCompact` */
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
    <BaseBox
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap="spacing.3"
      minWidth="0px"
      // React Native doesn't shrink flex items by default
      flexShrink={1}
    >
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
      maxWidth={maxWidth ?? '100%'}
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
        flexShrink={1}
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
        {isError && onReupload ? (
          <IconButton
            size="small"
            accessibilityLabel={`Reupload ${name}`}
            icon={RotateClockWiseIcon}
            onClick={() => onReupload({ file })}
            data-analytics-name={MAKE_ANALYTICS_CONSTANTS.FILE_UPLOAD.REUPLOAD_BUTTON}
          />
        ) : null}
        {/* × stays next to retry so a failed file can always be removed */}
        {isUploading || onRemove ? (
          <IconButton
            size="small"
            accessibilityLabel={`Remove ${name}`}
            icon={CloseIcon}
            onClick={() => (isUploading ? onDismiss?.({ file }) : onRemove?.({ file }))}
          />
        ) : null}
      </BaseBox>
      {isUploading ? (
        <BaseBox position="absolute" bottom="spacing.0" left="spacing.0" width="100%">
          <ProgressBar
            // the chip shows no "Uploading" text
            accessibilityLabel={`Uploading ${name}`}
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
