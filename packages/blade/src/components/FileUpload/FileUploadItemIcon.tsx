import type { BladeFile } from './types';
import { fileUploadItemIconTokens, fileUploadDropAreaIconTokens } from './fileUploadTokens';
import BaseBox from '~components/Box/BaseBox';
import { FileTextIcon, InfoIcon } from '~components/Icons';
import { makeSize } from '~utils';

type FileUploadItemIconProps = { uploadStatus?: BladeFile['status'] };

/**
 * Leading tile of an uploaded file row. Shows a generic file icon, or an info icon when the upload failed.
 */
const FileUploadItemIcon = ({ uploadStatus }: FileUploadItemIconProps): React.ReactElement => {
  const variant = uploadStatus === 'error' ? 'error' : 'default';
  const Icon = variant === 'error' ? InfoIcon : FileTextIcon;

  return (
    <BaseBox
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      width={makeSize(fileUploadItemIconTokens.size)}
      height={makeSize(fileUploadItemIconTokens.size)}
      borderRadius="small"
      backgroundColor={fileUploadItemIconTokens.background[variant]}
    >
      <Icon size="large" color={fileUploadItemIconTokens.icon[variant]} />
    </BaseBox>
  );
};

type FileUploadDropAreaIconProps = { isDisabled?: boolean };

/**
 * Generic file icon shown above the drop area text when FileUpload has size="variable"
 */
const FileUploadDropAreaIcon = ({
  isDisabled,
}: FileUploadDropAreaIconProps): React.ReactElement => {
  const state = isDisabled ? 'disabled' : 'default';

  return (
    <BaseBox
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      width={makeSize(fileUploadDropAreaIconTokens.size)}
      height={makeSize(fileUploadDropAreaIconTokens.size)}
      borderRadius="max"
      borderWidth="thin"
      borderColor={fileUploadDropAreaIconTokens.border[state]}
      backgroundColor={fileUploadDropAreaIconTokens.background}
    >
      <FileTextIcon size="large" color={fileUploadDropAreaIconTokens.icon[state]} />
    </BaseBox>
  );
};

export { FileUploadItemIcon, FileUploadDropAreaIcon };
