/* eslint-disable react/jsx-no-useless-fragment */
import { throwBladeError } from '~utils/logger';

import type { FileUploadProps } from './types';

const FileUpload = (_props: FileUploadProps): React.ReactElement => {
  throwBladeError({
    message: 'FileUpload is not yet implemented for React Native',
    moduleName: 'FileUpload',
  });

  return <></>;
};

export { FileUpload };
