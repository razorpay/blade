import React from 'react';
import { useNavLink } from './SideNavContext';
import { COLLAPSED_L1_WIDTH } from './tokens';
import type { SideNavLevelProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import { makeSize } from '~utils';

const SideNavLevel = ({ children, titleSuffix }: SideNavLevelProps): React.ReactElement => {
  const { level: _prevLevel, title: headingTitle } = useNavLink();

  const prevLevel = _prevLevel ?? 0;
  const currentLevel = prevLevel + 1;
  const hasTrailing = !!titleSuffix;
  return (
    <BaseBox
      marginLeft={
        currentLevel === 3
          ? { base: 'spacing.7', m: 'spacing.6' }
          : { base: 'spacing.0', m: makeSize(COLLAPSED_L1_WIDTH) }
      }
      // When we're in level 2 or 3, we want to stop propagation of hover from its items.
      // L1 is only expected to open / close on hover of L1 menu and L1 items
      onMouseOver={(e) => {
        e.stopPropagation();
      }}
      // Although we don't use `onMouseOut` on SideNav, keeping it here in case we start using it in future as stopping propagation in child
      // is expected behaviour for us. Checkout https://react.dev/reference/react-dom/createPortal#caveats
      onMouseOut={(e) => {
        e.stopPropagation();
      }}
      height="100%"
      display="flex"
      flexDirection="column"
    >
      {currentLevel === 2 && headingTitle ? (
        <BaseBox
          // In mobile, we use DrawerHeader for this heading
          display={{ base: 'none', m: hasTrailing ? 'flex' : 'block' }}
          padding="spacing.4"
          borderBottomWidth="thin"
          borderBottomColor="surface.border.gray.muted"
          gap={hasTrailing ? 'spacing.2' : 'spacing.0'}
          alignItems={hasTrailing ? 'center' : undefined}
        >
          <Text size="large" weight="semibold">
            {headingTitle}
          </Text>
          {titleSuffix}
        </BaseBox>
      ) : null}
      <BaseBox padding={{ base: 'spacing.0', m: 'spacing.3' }} overflowY="auto">
        {children}
      </BaseBox>
    </BaseBox>
  );
};

export { SideNavLevel };
