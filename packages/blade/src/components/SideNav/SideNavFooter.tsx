import React from 'react';
import { FloatingPortal } from '@floating-ui/react';
import type { SideNavFooterProps } from './types';
import { Box } from '~components/Box';

const SideNavFooter = ({ children }: SideNavFooterProps): React.ReactElement => {
  return (
    <FloatingPortal id="footer-portal-container">
      <Box>{children}</Box>
    </FloatingPortal>
  );
};

export { SideNavFooter };
