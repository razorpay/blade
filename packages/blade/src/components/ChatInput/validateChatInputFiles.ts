import type { ChatInputFileError, ChatInputProps } from './types';
import type { BladeFile } from '~components/FileUpload/types';
import { isFileAccepted } from '~components/FileUpload/isFileAccepted';

const formatFileSize = (bytes: number): string => {
  if (bytes >= 1024 * 1024) {
    const megabytes = bytes / (1024 * 1024);
    return `${Number.isInteger(megabytes) ? megabytes : megabytes.toFixed(1)} MB`;
  }
  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${bytes} bytes`;
};

/**
 * Checks files against `accept`, `maxFileSize` and `maxFileCount` before they are attached.
 * Every way in (the file picker, paste and drop) goes through this, so the rules are the same.
 * These checks only guide people in the browser; the server must still check every file.
 */
const validateChatInputFiles = ({
  incomingFiles,
  existingFileCount,
  accept,
  maxFileCount,
  maxFileSize,
}: {
  incomingFiles: BladeFile[];
  existingFileCount: number;
} & Pick<ChatInputProps, 'accept' | 'maxFileCount' | 'maxFileSize'>): {
  acceptedFiles: BladeFile[];
  fileErrors: ChatInputFileError[];
} => {
  const acceptedFiles: BladeFile[] = [];
  const fileErrors: ChatInputFileError[] = [];

  for (const file of incomingFiles) {
    if (accept && !isFileAccepted(file, accept)) {
      fileErrors.push({
        code: 'accept',
        message: `${file.name} isn't a supported file type`,
        file,
      });
    } else if (maxFileSize !== undefined && file.size > maxFileSize) {
      fileErrors.push({
        code: 'maxFileSize',
        message: `${file.name} is larger than ${formatFileSize(maxFileSize)}`,
        file,
      });
    } else if (
      maxFileCount !== undefined &&
      existingFileCount + acceptedFiles.length >= maxFileCount
    ) {
      fileErrors.push({
        code: 'maxFileCount',
        message: `You can attach up to ${maxFileCount} ${maxFileCount === 1 ? 'file' : 'files'}`,
        file,
      });
    } else {
      acceptedFiles.push(file);
    }
  }

  return { acceptedFiles, fileErrors };
};

export { validateChatInputFiles, formatFileSize };
