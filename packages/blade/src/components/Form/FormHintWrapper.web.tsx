import React from 'react';

const FormHintWrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>{children}</span>
  );
};

export { FormHintWrapper };
