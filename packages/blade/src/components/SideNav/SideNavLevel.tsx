import React from 'react';
import { useNavLink } from './SideNavContext';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';

const SideNavLevel = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const { level: _prevLevel, title: headingTitle } = useNavLink();
  const prevLevel = _prevLevel ?? 0;
  const currentLevel = prevLevel + 1;
  return (
    <BaseBox
      marginLeft={{ base: 'spacing.0', m: currentLevel === 3 ? 'spacing.5' : '52px' }}
      onMouseOver={(e) => {
        e.stopPropagation();
      }}
      onMouseOut={(e) => {
        e.stopPropagation();
      }}
    >
      {currentLevel === 2 && headingTitle ? (
        <BaseBox
          display={{ base: 'none', m: 'block' }}
          padding="spacing.4"
          borderBottomWidth="thin"
          borderBottomColor="surface.border.gray.muted"
        >
          <Text size="large" weight="semibold">
            {headingTitle}
          </Text>
        </BaseBox>
      ) : null}
      <BaseBox padding={{ base: 'spacing.0', m: 'spacing.3' }}>{children}</BaseBox>
    </BaseBox>
  );
};

export { SideNavLevel };
