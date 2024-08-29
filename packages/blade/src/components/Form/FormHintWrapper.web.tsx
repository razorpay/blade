import React from 'react';
import BaseBox from '~components/Box/BaseBox';

const FormHintWrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <BaseBox as="span" display="flex" flexDirection="row" alignItems="flex-start" gap="spacing.2">
      {children}
    </BaseBox>
  );
};

export { FormHintWrapper };
