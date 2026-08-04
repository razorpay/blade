import type { BladeFileList } from '~components/FileUpload/types';

const getChatInputSubmitDisabled = (textValue: string, files: BladeFileList): boolean => {
  const hasText = textValue.trim().length > 0;
  const hasFiles = files.length > 0;
  const hasErrorFiles = files.some((f) => f.status === 'error' || f.status === 'uploading');
  return (!hasText && !hasFiles) || hasErrorFiles;
};

export { getChatInputSubmitDisabled };
