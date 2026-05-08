/* eslint-disable react/jsx-no-useless-fragment */
import type { FileUploadProps } from './types';
import { logger } from '~utils/logger';

const FileUpload = (_props: FileUploadProps): React.ReactElement => {
  logger({
    type: 'warn',
    message: 'FileUpload is not yet implemented for React Native',
    moduleName: 'FileUpload',
  });

  return <></>;
};

export { FileUpload };
