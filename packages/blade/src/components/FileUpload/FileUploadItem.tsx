import { StyledFileUploadItemWrapper } from './StyledFileUploadItemWrapper';
import type { FileUploadItemProps } from './types';
import { FileIcon, TrashIcon, EyeIcon, CloseIcon, CheckCircleIcon } from '~components/Icons';
import { BaseBox } from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { Divider } from '~components/Divider';

const FileUploadItem = ({ file, onPreview, onRemove }: FileUploadItemProps): React.ReactElement => {
  const { name, type, size, percent, errorText, status } = file;

  return (
    <StyledFileUploadItemWrapper
      status={status ?? 'success'}
      padding="spacing.3"
      borderRadius="medium"
      borderWidth="thin"
      borderColor="interactive.border.gray.default"
      marginBottom="spacing.3"
    >
      <BaseBox display="flex" flexDirection="row" justifyContent="center" alignItems="center">
        <FileIcon />
        <BaseBox marginLeft="spacing.4" marginRight="spacing.4">
          <BaseBox display="flex" flexDirection="row" alignItems="center">
            <Text
              size="medium"
              weight="medium"
              color="surface.text.gray.subtle"
              truncateAfterLines={1}
            >
              {name}
            </Text>
            <CheckCircleIcon marginLeft="spacing.3" color="interactive.icon.positive.normal" />
          </BaseBox>

          <Text size="small" weight="regular" color="surface.text.gray.muted">
            {errorText ?? `${(size / 1000).toFixed(2)} KB`}
          </Text>
        </BaseBox>
      </BaseBox>
      {status === 'error' || status === 'uploading' ? (
        <BaseBox display="flex" flexDirection="row">
          <BaseBox onClick={() => onRemove?.({ removedFile: file })} style={{ cursor: 'pointer' }}>
            <CloseIcon color="interactive.icon.gray.muted" />
          </BaseBox>
        </BaseBox>
      ) : (
        <BaseBox display="flex" flexDirection="row" alignItems="center">
          <BaseBox
            onClick={() => onPreview?.({ previewedFile: file })}
            style={{ cursor: 'pointer' }}
          >
            <EyeIcon color="interactive.icon.gray.muted" />
          </BaseBox>
          <Divider orientation="vertical" thickness="thinner" variant="normal" />
          <BaseBox onClick={() => onRemove?.({ removedFile: file })} style={{ cursor: 'pointer' }}>
            <TrashIcon color="interactive.icon.gray.muted" />
          </BaseBox>
        </BaseBox>
      )}
    </StyledFileUploadItemWrapper>
  );
};

export { FileUploadItem };
