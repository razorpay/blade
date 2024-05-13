import React from 'react';
import { useNavLink } from './SideNavContext';
import BaseBox from '~components/Box/BaseBox';

const SideNavLevel = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const { level } = useNavLink();

  console.log({ level });
  return (
    <BaseBox
      marginLeft={{ base: 'spacing.0', m: level === 2 ? 'spacing.0' : '52px' }}
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
