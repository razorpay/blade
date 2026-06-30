import React from 'react';
import { AppBar, AppBarActions, AppBarLeading } from '../AppBar';
import { IconButton } from '~components/Button/IconButton';
import { BellIcon, RazorpayIcon, UserIcon } from '~components/Icons';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

const AppBarExample = (): React.ReactElement => {
  return (
    <AppBar
      backButton={{ onClick: noop, accessibilityLabel: 'Go back' }}
      accessibilityLabel="Mavenshop store header"
      data-analytics-appbar="demo"
      testID="appbar-demo"
    >
      <AppBarLeading
        title="Mavenshop"
        logo={<RazorpayIcon size="large" color="surface.icon.staticWhite.normal" />}
        rtbBadge="full"
      />
      <AppBarActions>
        <IconButton icon={UserIcon} accessibilityLabel="Profile" onClick={noop} />
        <IconButton icon={BellIcon} accessibilityLabel="Notifications" onClick={noop} />
      </AppBarActions>
    </AppBar>
  );
};

export { AppBarExample, noop };
