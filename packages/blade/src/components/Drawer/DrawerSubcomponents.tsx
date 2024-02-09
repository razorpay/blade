import React from 'react';
import { BaseHeader } from '~components/BaseHeaderFooter/BaseHeader';
import { Box } from '~components/Box';
import { DrawerContext } from './DrawerContext';
import { DrawerHeaderProps } from './types';

const DrawerHeader = ({ title, subtitle, leading, trailing, titleSuffix }: DrawerHeaderProps) => {
  const { close, defaultInitialFocusRef, stackingLevel } = React.useContext(DrawerContext);
  return (
    <BaseHeader
      showCloseButton={stackingLevel < 2}
      showBackButton={stackingLevel >= 2}
      closeButtonRef={defaultInitialFocusRef}
      onCloseButtonClick={() => close()}
      onBackButtonClick={() => close()}
      title={title}
      titleSuffix={titleSuffix}
      subtitle={subtitle}
      leading={leading}
      trailing={trailing}
    />
  );
};

const DrawerBody = ({ children }: { children: React.ReactNode }) => {
  return <Box padding="spacing.6">{children}</Box>;
};

export { DrawerHeader, DrawerBody };
