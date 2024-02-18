import { StyledFileUploadItemWrapper } from './StyledFileUploadItemWrapper';
import type { FileUploadItemProps } from './types';
import { FileUploadItemIcon } from './FileUploadItemIcon';
import { TrashIcon, EyeIcon, CloseIcon, CheckCircleIcon } from '~components/Icons';
import { BaseBox } from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { Divider } from '~components/Divider';
import { IconButton } from '~components/Button/IconButton';
import { ProgressBar } from '~components/ProgressBar';

// TODO: 1. Fix upload progress sync with the file upload item,
const FileUploadItem = ({ file, onPreview, onRemove }: FileUploadItemProps): React.ReactElement => {
  const { name, size, percent, errorText, status } = file;
  const isUploading = status === 'uploading';

  return (
    <StyledFileUploadItemWrapper
      status={status ?? 'success'}
      borderRadius="medium"
      borderWidth="thin"
      borderColor="interactive.border.gray.default"
      marginBottom="spacing.3"
    >
      <BaseBox width="100%">
        <BaseBox
          display="flex"
          flexDirection="row"
          alignItems="center"
          margin="spacing.3"
          marginBottom={isUploading ? 'spacing.2' : 'spacing.3'}
        >
          <FileUploadItemIcon fileName={name} />
          <BaseBox marginLeft="spacing.4" marginRight="spacing.4" flexGrow={1}>
            <BaseBox display="flex" flexDirection="row" width="100%">
              <BaseBox alignItems="center" maxWidth={name.length > 30 ? '90%' : '100%'}>
                <Text
                  size="medium"
                  weight="medium"
                  color="surface.text.gray.subtle"
                  truncateAfterLines={1}
                  marginRight="spacing.3"
                >
                  {name}
                </Text>
              </BaseBox>
              <CheckCircleIcon color="interactive.icon.positive.normal" />
            </BaseBox>

            <Text size="small" weight="regular" color="surface.text.gray.muted">
              {errorText ??
                `${(size / 1000).toFixed(2)} KB ${isUploading && percent ? `${percent}%` : ''}`}
            </Text>
          </BaseBox>
          {status === 'error' || status === 'uploading' ? (
            <BaseBox display="flex" flexDirection="row">
              <IconButton
                accessibilityLabel="Remove File"
                icon={CloseIcon}
                onClick={() => onRemove?.({ removedFile: file })}
              />
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
                    accessibilityLabel="Preview File"
                    icon={EyeIcon}
                    onClick={() => onPreview?.({ previewedFile: file })}
                  />
                  <Divider orientation="vertical" thickness="thinner" variant="normal" />
                  <IconButton
                    accessibilityLabel="Remove File"
                    icon={TrashIcon}
                    onClick={() => onRemove?.({ removedFile: file })}
                  />
                </BaseBox>
              ) : (
                <IconButton
                  accessibilityLabel="Remove File"
                  icon={TrashIcon}
                  onClick={() => onRemove?.({ removedFile: file })}
                />
              )}
            </BaseBox>
          )}
        </BaseBox>
        {isUploading && (
          <ProgressBar showPercentage={false} value={percent} isIndeterminate={!Boolean(percent)} />
        )}
      </BaseBox>
    </StyledFileUploadItemWrapper>
  );
};

export { FileUploadItem };
