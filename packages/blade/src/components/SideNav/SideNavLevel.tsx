import React from 'react';
import BaseBox from '~components/Box/BaseBox';

const SideNavLevel = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <BaseBox
      marginLeft={{ base: 'spacing.0', m: '52px' }}
      padding={{ base: 'spacing.0', m: ['spacing.3', 'spacing.4'] }}
      onMouseOver={(e) => {
        e.stopPropagation();
      }}
      onMouseOut={(e) => {
        e.stopPropagation();
      }}
    >
      {children}
    </BaseBox>
  );
};

export { SideNavLevel };
