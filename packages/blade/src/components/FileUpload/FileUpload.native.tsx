/* eslint-disable react/jsx-no-useless-fragment */
import { throwBladeError } from '~utils/logger';

const FileUpload = (): React.ReactElement => {
  throwBladeError({
    message: 'FileUpload is not yet implemented for React Native',
    moduleName: 'FileUpload',
  });

  return <></>;
};

export { FileUpload };
