import { classes } from './tokens';
import BaseBox from '~components/Box/BaseBox';

const SideNavBody = ({
  children,
}: {
  children: React.ReactElement | React.ReactElement[];
}): React.ReactElement => {
  return (
    <BaseBox className={classes.L1_ITEM_WRAPPER} overflowY="auto">
      {children}
    </BaseBox>
  );
};

export { SideNavBody };
