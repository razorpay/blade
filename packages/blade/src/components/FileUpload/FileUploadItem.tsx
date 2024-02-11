import type { FileUploadItemProps } from './types';
import { Box } from '~components/Box';

const FileUploadItem = ({ file, onPreview, onRemove }: FileUploadItemProps): React.ReactElement => {
  const { name, type, size, percent, errorText } = file;

  return <Box>{name + type + size + percent + errorText}</Box>;
};

export { FileUploadItem };
