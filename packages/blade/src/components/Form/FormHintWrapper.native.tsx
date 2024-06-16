import React from 'react';
import BaseBox from '~components/Box/BaseBox';

const FormHintWrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <BaseBox display="flex" flexDirection="row" alignItems="center">
      {children}
    </BaseBox>
  );
};

export { FormHintWrapper };
