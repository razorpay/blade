import { classes } from './tokens';
import type { SideNavBodyProps } from './types';
import { useSideNav } from './SideNavContext';
import BaseBox from '~components/Box/BaseBox';

const SideNavBody = ({ children }: SideNavBodyProps): React.ReactElement => {
  const { isL1Collapsed, isL1Hovered } = useSideNav();

  return (
    <BaseBox
      className={classes.L1_ITEM_WRAPPER}
      overflowY={isL1Collapsed && !isL1Hovered ? 'hidden' : 'auto'}
      overflowX="hidden"
    >
      {children}
    </BaseBox>
  );
};

export { SideNavBody };
