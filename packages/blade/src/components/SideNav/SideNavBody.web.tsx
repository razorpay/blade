import { classes } from './tokens';
import type { SideNavBodyProps } from './types';
import BaseBox from '~components/Box/BaseBox';

const SideNavBody = ({ children }: SideNavBodyProps): React.ReactElement => {
  return (
    <BaseBox className={classes.L1_ITEM_WRAPPER} overflowY="auto" overflowX="hidden">
      {children}
    </BaseBox>
  );
};

export { SideNavBody };
