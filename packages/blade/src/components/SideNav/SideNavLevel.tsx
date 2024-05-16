import React from 'react';
import { useNavLink } from './SideNavContext';
import { COLLAPSED_L1_WIDTH } from './tokens';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { makeSize } from '~utils';

const SideNavLevel = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const { level: _prevLevel, title: headingTitle } = useNavLink();
  const prevLevel = _prevLevel ?? 0;
  const currentLevel = prevLevel + 1;
  return (
    <BaseBox
      marginLeft={
        currentLevel === 3
          ? { base: 'spacing.7', m: 'spacing.6' }
          : { base: 'spacing.0', m: makeSize(COLLAPSED_L1_WIDTH) }
      }
      onMouseOver={(e) => {
        e.stopPropagation();
      }}
      onMouseOut={(e) => {
        e.stopPropagation();
      }}
    >
      {currentLevel === 2 && headingTitle ? (
        <BaseBox
          // In mobile, we use DrawerHeader for this heading
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
