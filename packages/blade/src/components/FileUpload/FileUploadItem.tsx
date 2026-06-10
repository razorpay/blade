import { memo } from 'react';
import { StyledFileUploadItemWrapper } from './StyledFileUploadItemWrapper';
import type { FileUploadItemProps, InternalFileUploadItemSize } from './types';

type InternalFileUploadItemProps = Omit<FileUploadItemProps, 'size'> & {
  size?: InternalFileUploadItemSize;
};
import { FileUploadItemIcon } from './FileUploadItemIcon';
import { MAKE_ANALYTICS_CONSTANTS } from '~utils/makeAnalyticsAttribute';
import isUndefined from '~utils/lodashButBetter/isUndefined';
import {
  TrashIcon,
  EyeIcon,
  CloseIcon,
  CheckCircleIcon,
  RotateClockWiseIcon,
} from '~components/Icons';
import { BaseBox } from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { Divider } from '~components/Divider';
import { IconButton } from '~components/Button/IconButton';
import { ProgressBar } from '~components/ProgressBar';
import { BaseLink } from '~components/Link/BaseLink';
import { getStyledProps } from '~components/Box/styledProps';

const FileUploadItem = memo(
  ({
    file,
    onPreview,
    onRemove,
    onReupload,
    onDismiss,
    size: containerSize,
    width,
    minWidth,
    maxWidth,
    flexShrink,
    flexGrow,
    flexBasis,
    ...rest
  }: InternalFileUploadItemProps): React.ReactElement => {
    const { name, size, uploadPercent, errorText, status } = file;
    const isUploading = status === 'uploading';
    const sizeInKB = size / 1024;
    const sizeInMB = sizeInKB / 1024;
    const showSizeInKB = sizeInKB < 1024;
    const isSmall = containerSize === 'small';

    const fileSizeText = `${(showSizeInKB ? sizeInKB : sizeInMB).toFixed(2)} ${
      showSizeInKB ? 'KB' : 'MB'
    } ${isUploading && uploadPercent ? `(${uploadPercent}%)` : ''}`;

    return (
      <StyledFileUploadItemWrapper
        size={containerSize ?? 'medium'}
        status={status ?? 'success'}
        borderRadius={isSmall ? 'small' : 'medium'}
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
          width="100%"
          display="flex"
          flexDirection="column"
          justifyContent={isSmall ? 'center' : undefined}
        >
          {/* Small variant intentionally omits CheckCircleIcon on success — at 36px height, the compact layout prioritizes file name and actions over status iconography */}
          {isSmall ? (
            <BaseBox
              display="flex"
              flexDirection="row"
              alignItems="center"
              margin={['spacing.2', 'spacing.3', 'spacing.2', 'spacing.3']}
            >
              {/* paddingTop is intentional for visual balance with the text baseline at this icon size */}
              <BaseBox marginRight="spacing.3" paddingTop="spacing.2">
                <FileUploadItemIcon fileName={name} uploadStatus={status} iconSize="small" />
              </BaseBox>
              <BaseBox flexGrow={1} display="flex" flexDirection="row" alignItems="baseline">
                <Text
                  size="medium"
                  weight="medium"
                  color="surface.text.gray.subtle"
                  truncateAfterLines={1}
                >
                  {name}
                </Text>
                <Text
                  size="small"
                  weight="regular"
                  marginLeft="spacing.3"
                  color={
                    status === 'error'
                      ? 'feedback.text.negative.intense'
                      : 'surface.text.gray.muted'
                  }
                  truncateAfterLines={1}
                >
                  {errorText ?? fileSizeText}
                </Text>
              </BaseBox>
              {status === 'uploading' ? (
                <IconButton
                  size="small"
                  accessibilityLabel={`Remove ${name}`}
                  icon={CloseIcon}
                  onClick={() => onDismiss?.({ file })}
                />
              ) : status === 'error' ? (
                <BaseBox display="flex" flexDirection="row" alignItems="center" gap="spacing.3">
                  <BaseLink
                    variant="button"
                    icon={RotateClockWiseIcon}
                    color="negative"
                    size="small"
                    onClick={() => {
                      onReupload?.({ file });
                    }}
                    data-analytics-name={MAKE_ANALYTICS_CONSTANTS.FILE_UPLOAD.REUPLOAD_BUTTON}
                  />
                  {onRemove ? (
                    <>
                      <Divider orientation="vertical" thickness="thin" variant="normal" />
                      <IconButton
                        size="small"
                        accessibilityLabel={`Remove ${name}`}
                        icon={TrashIcon}
                        onClick={() => onRemove({ file })}
                      />
                    </>
                  ) : null}
                </BaseBox>
              ) : (
                <BaseBox display="flex" flexDirection="row" alignItems="center" gap="spacing.3">
                  {onPreview ? (
                    <>
                      <IconButton
                        size="small"
                        accessibilityLabel={`Preview ${name}`}
                        icon={EyeIcon}
                        onClick={() => onPreview?.({ file })}
                      />
                      <Divider orientation="vertical" thickness="thinner" variant="normal" />
                    </>
                  ) : null}
                  <IconButton
                    size="small"
                    accessibilityLabel={`Remove ${name}`}
                    icon={TrashIcon}
                    onClick={() => onRemove?.({ file })}
                  />
                </BaseBox>
              )}
            </BaseBox>
          ) : (
            <BaseBox
              display="flex"
              flexDirection="row"
              margin={
                containerSize === 'large'
                  ? 'spacing.4'
                  : ['spacing.3', 'spacing.4', 'spacing.3', 'spacing.3']
              }
            >
              <BaseBox marginRight="spacing.4">
                <FileUploadItemIcon fileName={name} uploadStatus={status} />
              </BaseBox>
              <BaseBox flexGrow={1}>
                <BaseBox alignItems="center" display="flex">
                  <BaseBox
                    alignItems="center"
                    maxWidth="70%"
                    display="flex"
                    marginRight="spacing.3"
                  >
                    <Text
                      size="medium"
                      weight="medium"
                      color="surface.text.gray.subtle"
                      truncateAfterLines={1}
                    >
                      {name}
                    </Text>
                  </BaseBox>
                  {status === 'success' && (
                    <CheckCircleIcon
                      size="medium"
                      marginRight="spacing.2"
                      color="interactive.icon.positive.normal"
                    />
                  )}
                </BaseBox>
                <Text
                  size="small"
                  weight="regular"
                  color={
                    status === 'error'
                      ? 'feedback.text.negative.intense'
                      : 'surface.text.gray.muted'
                  }
                  truncateAfterLines={1}
                >
                  {errorText ?? fileSizeText}
                </Text>
              </BaseBox>
              {status === 'uploading' ? (
                <BaseBox display="flex" alignItems="center">
                  <IconButton
                    accessibilityLabel={`Remove ${name}`}
                    icon={CloseIcon}
                    onClick={() => onDismiss?.({ file })}
                  />
                </BaseBox>
              ) : status === 'error' ? (
                <BaseBox display="flex" flexDirection="row" alignItems="center" gap="spacing.3">
                  <BaseLink
                    marginX="spacing.1"
                    variant="button"
                    icon={RotateClockWiseIcon}
                    color="negative"
                    size="medium"
                    onClick={() => {
                      onReupload?.({ file });
                    }}
                    data-analytics-name={MAKE_ANALYTICS_CONSTANTS.FILE_UPLOAD.REUPLOAD_BUTTON}
                  />
                  {onRemove ? (
                    <BaseBox display="flex" flexDirection="row" alignItems="center" gap="spacing.3">
                      <Divider orientation="vertical" thickness="thin" variant="normal" />
                      <IconButton
                        accessibilityLabel={`Remove ${name}`}
                        icon={TrashIcon}
                        onClick={() => onRemove({ file })}
                      />
                    </BaseBox>
                  ) : null}
                </BaseBox>
              ) : (
                <BaseBox display="flex" flexDirection="row" alignItems="center">
                  {onPreview ? (
                    <BaseBox
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      padding="spacing.0"
                      gap="spacing.3"
                    >
                      <IconButton
                        accessibilityLabel={`Preview ${name}`}
                        icon={EyeIcon}
                        onClick={() => onPreview?.({ file })}
                      />
                      <Divider orientation="vertical" thickness="thinner" variant="normal" />
                      <IconButton
                        accessibilityLabel={`Remove ${name}`}
                        icon={TrashIcon}
                        onClick={() => onRemove?.({ file })}
                      />
                    </BaseBox>
                  ) : (
                    <IconButton
                      accessibilityLabel={`Remove ${name}`}
                      icon={TrashIcon}
                      onClick={() => onRemove?.({ file })}
                    />
                  )}
                </BaseBox>
              )}
            </BaseBox>
          )}
          {isUploading && (
            <BaseBox width="100%" position="absolute" bottom="spacing.0">
              <ProgressBar
                left="spacing.0"
                showPercentage={false}
                value={uploadPercent ?? 0}
                isIndeterminate={isUndefined(uploadPercent)}
              />
            </BaseBox>
          )}
        </BaseBox>
      </StyledFileUploadItemWrapper>
    );
  },
);

export type { FileUploadItemProps } from './types';
export { FileUploadItem };
