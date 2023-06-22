import React from 'react';
import BaseBox from '~components/Box/BaseBox';

const FormHintWrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      alignItems="center"
      style={{
        wordBreak: 'break-all',
      }}
    >
      {children}
    </BaseBox>
  );
};

export { FormHintWrapper };
