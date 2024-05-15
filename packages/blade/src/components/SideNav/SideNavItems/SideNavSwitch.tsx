import styled from 'styled-components';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { Indicator } from '~components/Indicator';
import { Switch } from '~components/Switch';
import { Text } from '~components/Typography';
import { makeSpace } from '~utils';

const StyledNavSwitch = styled(BaseBox)((props) => {
  return {
    '.collapsed &': {
      padding: `${makeSpace(props.theme.spacing[0])} ${makeSpace(props.theme.spacing[3])}`,
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
      height="36px"
      as="label"
    >
      <Box display="inline-flex" alignItems="center" gap="spacing.3">
        <Indicator accessibilityLabel="" color="positive" emphasis="intense" />
        <BaseBox className="hide-when-collapsed">
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

      <BaseBox className="hide-when-collapsed">
        <Switch accessibilityLabel="" />
      </BaseBox>
    </StyledNavSwitch>
  );
};

export { SideNavSwitch };
