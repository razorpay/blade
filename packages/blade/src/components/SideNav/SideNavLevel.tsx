import React from 'react';
import BaseBox from '~components/Box/BaseBox';

const SideNavLevel = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <BaseBox
      marginLeft="52px"
      padding={['spacing.3', 'spacing.4']}
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
