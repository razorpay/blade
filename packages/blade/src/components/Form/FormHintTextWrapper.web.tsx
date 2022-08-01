import React from 'react';

const FormHintTextWrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>{children}</span>
  );
};

export { FormHintTextWrapper };
