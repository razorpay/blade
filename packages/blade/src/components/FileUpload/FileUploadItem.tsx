import { memo } from 'react';
import { StyledFileUploadItemWrapper } from './StyledFileUploadItemWrapper';
import type { FileUploadItemProps } from './types';
import { FileUploadItemIcon } from './FileUploadItemIcon';
import { MAKE_ANALYTICS_CONSTANTS } from '~utils/makeAnalyticsAttribute';
import isUndefined from '~utils/lodashButBetter/isUndefined';
import {
  TrashIcon,
  EyeIcon,
  CloseIcon,
  CheckCircle2Icon,
  RotateClockWiseIcon,
} from '~components/Icons';
import { BaseBox } from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { Divider } from '~components/Divider';
import { IconButton } from '~components/Button/IconButton';
import { ProgressBar } from '~components/ProgressBar';
import { BaseLink } from '~components/Link/BaseLink';
import { getStyledProps } from '~components/Box/styledProps';

const fileNameTextProps = {
  size: 'small',
  weight: 'medium',
  color: 'surface.text.gray.subtle',
} as const;

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
    _isCompact = false,
    ...rest
  }: FileUploadItemProps): React.ReactElement => {
    const { name, size, uploadPercent, errorText, status } = file;
    const isUploading = status === 'uploading';
    const sizeInKB = size / 1024;
    const sizeInMB = sizeInKB / 1024;
    const showSizeInKB = sizeInKB < 1024;
    const isLargeItem = containerSize === 'large' || containerSize === 'variable';
    // Reupload shows its label only when it is the row's sole action, so narrow rows keep room for the file name
    const shouldShowReuploadLabel = !onRemove;

    const reuploadLink = onReupload ? (
      <BaseLink
        marginX="spacing.1"
        variant="button"
        icon={RotateClockWiseIcon}
        color="negative"
        size={shouldShowReuploadLabel ? 'small' : 'medium'}
        accessibilityProps={{ label: `Reupload ${name}` }}
        onClick={() => {
          onReupload({ file });
        }}
        data-analytics-name={MAKE_ANALYTICS_CONSTANTS.FILE_UPLOAD.REUPLOAD_BUTTON}
      >
        {shouldShowReuploadLabel ? 'Reupload' : undefined}
      </BaseLink>
    ) : null;

    const removeButton = (
      <IconButton
        accessibilityLabel={`Remove ${name}`}
        icon={TrashIcon}
        onClick={() => onRemove?.({ file })}
      />
    );

    return (
      <StyledFileUploadItemWrapper
        size={containerSize ?? 'medium'}
        status={status ?? 'success'}
        borderRadius="medium"
        borderWidth="thin"
        width={width}
        minWidth={minWidth}
        maxWidth={maxWidth}
        flexShrink={flexShrink}
        flexGrow={flexGrow}
        flexBasis={flexBasis}
        {...getStyledProps(rest)}
      >
        <BaseBox width="100%" display="flex" flexDirection="column" justifyContent="center">
          <BaseBox
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap="spacing.4"
            // The wrapper's min height centres this row, so the 1px border doesn't add to the 56px / 64px height.
            // Vertical padding only keeps a minimum gap from the border.
            padding={
              isLargeItem
                ? ['spacing.2', 'spacing.4']
                : ['spacing.2', 'spacing.4', 'spacing.2', 'spacing.3']
            }
          >
            <FileUploadItemIcon uploadStatus={status} />
            <BaseBox
              display="flex"
              flexDirection="column"
              gap="spacing.1"
              flexGrow={1}
              flexShrink={1}
              minWidth="0px"
            >
              <BaseBox display="flex" flexDirection="row" alignItems="center" gap="spacing.2">
                <BaseBox flexShrink={1} minWidth="0px">
                  {isUploading && !_isCompact ? (
                    <Text {...fileNameTextProps} truncateAfterLines={1}>
                      Uploading{' '}
                      <Text {...fileNameTextProps} as="span">
                        {name}
                      </Text>{' '}
                      ...
                    </Text>
                  ) : (
                    <Text {...fileNameTextProps} truncateAfterLines={1}>
                      {name}
                    </Text>
                  )}
                </BaseBox>
                {status === 'success' && (
                  <BaseBox display="flex" flexShrink={0}>
                    <CheckCircle2Icon size="small" color="interactive.icon.positive.normal" />
                  </BaseBox>
                )}
              </BaseBox>
              <Text
                variant="caption"
                size="small"
                color={
                  status === 'error' ? 'feedback.text.negative.intense' : 'surface.text.gray.muted'
                }
                truncateAfterLines={1}
              >
                {errorText ??
                  `${(showSizeInKB ? sizeInKB : sizeInMB).toFixed(2)} ${
                    showSizeInKB ? 'KB' : 'MB'
                  } ${isUploading && uploadPercent ? `(${uploadPercent}%)` : ''}`}
              </Text>
            </BaseBox>
            {status === 'uploading' ? (
              <BaseBox display="flex" alignItems="center" flexShrink={0}>
                <IconButton
                  accessibilityLabel={`Remove ${name}`}
                  icon={CloseIcon}
                  onClick={() => onDismiss?.({ file })}
                />
              </BaseBox>
            ) : status === 'error' ? (
              <BaseBox
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap="spacing.3"
                flexShrink={0}
              >
                {reuploadLink}
                {onRemove ? (
                  <>
                    {reuploadLink ? (
                      <Divider orientation="vertical" thickness="thin" variant="normal" />
                    ) : null}
                    {removeButton}
                  </>
                ) : null}
              </BaseBox>
            ) : (
              <BaseBox
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap="spacing.3"
                flexShrink={0}
              >
                {onPreview ? (
                  <>
                    <IconButton
                      accessibilityLabel={`Preview ${name}`}
                      icon={EyeIcon}
                      onClick={() => onPreview({ file })}
                    />
                    <Divider orientation="vertical" thickness="thinner" variant="normal" />
                  </>
                ) : null}
                {removeButton}
              </BaseBox>
            )}
          </BaseBox>
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
