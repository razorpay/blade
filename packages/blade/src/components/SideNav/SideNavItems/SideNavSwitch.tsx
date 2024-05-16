import styled from 'styled-components';
import { classes, NAV_ITEM_HEIGHT, useSideNavTransition } from '../tokens';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { Indicator } from '~components/Indicator';
import { Switch } from '~components/Switch';
import { Text } from '~components/Typography';
import { makeSize, makeSpace } from '~utils';

const StyledNavSwitch = styled(BaseBox)((props) => {
  const { collapseItemPadding } = useSideNavTransition();
  return {
    transition: collapseItemPadding,
    [`.${classes.COLLAPSED} &`]: {
      padding: `${makeSpace(props.theme.spacing[0])} ${makeSpace(props.theme.spacing[3])}`,
      transition: collapseItemPadding,
    },
  };
});

const SideNavSwitch = (): React.ReactElement => {
  return (
    <StyledNavSwitch
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      paddingX="spacing.4"
      height={makeSize(NAV_ITEM_HEIGHT)}
      as="label"
    >
      <Box display="inline-flex" alignItems="center" gap="spacing.3">
        <Indicator accessibilityLabel="" color="positive" emphasis="intense" />
        <BaseBox className={classes.HIDE_WHEN_COLLAPSED}>
          <Text
            truncateAfterLines={1}
            weight="medium"
            size="medium"
            color="surface.text.gray.subtle"
          >
            Test Mode
          </Text>
        </BaseBox>
      </Box>

      <BaseBox className={classes.HIDE_WHEN_COLLAPSED}>
        <Switch accessibilityLabel="" />
      </BaseBox>
    </StyledNavSwitch>
  );
};

export { SideNavSwitch };
