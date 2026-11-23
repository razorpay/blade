import type { BladeFile } from './types';
import {
  fileUploadItemIconTokens,
  fileUploadItemCompactTokens,
  fileUploadDropAreaIconTokens,
} from './fileUploadTokens';
import BaseBox from '~components/Box/BaseBox';
import { FileTextIcon, InfoIcon } from '~components/Icons';
import { makeSize } from '~utils';

type FileUploadItemIconProps = {
  uploadStatus?: BladeFile['status'];
  /**
   * The smaller 24px tile used by the compact chip
   */
  isCompact?: boolean;
};

/**
 * Leading tile of an uploaded file row. Shows a generic file icon, or an info icon when the upload failed.
 */
const FileUploadItemIcon = ({
  uploadStatus,
  isCompact = false,
}: FileUploadItemIconProps): React.ReactElement => {
  const variant = uploadStatus === 'error' ? 'error' : 'default';
  const Icon = variant === 'error' ? InfoIcon : FileTextIcon;
  const tileSize = makeSize(
    isCompact ? fileUploadItemCompactTokens.iconTileSize : fileUploadItemIconTokens.size,
  );

  return (
    <BaseBox
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      width={tileSize}
      height={tileSize}
      borderRadius={isCompact ? 'xsmall' : 'small'}
      backgroundColor={
        isCompact
          ? fileUploadItemCompactTokens.iconTileBackground[variant]
          : fileUploadItemIconTokens.background[variant]
      }
    >
      <Icon size={isCompact ? 'medium' : 'large'} color={fileUploadItemIconTokens.icon[variant]} />
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
