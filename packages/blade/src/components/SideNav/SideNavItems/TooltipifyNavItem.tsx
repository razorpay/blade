import React from 'react';
import type { SideNavLinkProps } from '../types';
import { Tooltip } from '~components/Tooltip';

const TooltipifyNavItem = ({
  children,
  tooltip,
}: {
  children: React.ReactElement;
  tooltip: SideNavLinkProps['tooltip'];
}): React.ReactElement => {
  if (!tooltip) {
    return children;
  }

  return (
    <Tooltip {...tooltip} placement="top">
      {children}
    </Tooltip>
  );
};

export { TooltipifyNavItem };
