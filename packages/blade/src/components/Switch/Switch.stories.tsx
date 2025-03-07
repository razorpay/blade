/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Title } from '@storybook/addon-docs';
import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import type { SwitchProps } from './';
import { Switch as SwitchComponent } from './';
import { Text } from '~components/Typography';
import { BaseBox } from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { GlobeIcon, MapPinIcon, WifiIcon } from '~components/Icons';
import { Card, CardBody } from '~components/Card';
import { Alert } from '~components/Alert';
import { Link } from '~components/Link';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import type { BladeElementRef } from '~utils/types';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Switch"
      componentDescription="A switch component is used to quickly switch between two possible states. These are only used for binary actions that occur immediately after the user turn the switch on/off."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-85736&t=k8yrOO74u7fLzkIE-1&scaling=min-zoom&page-id=30100%3A565839&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Switch } from '@razorpay/blade/components';

        function App() {
          return (
            // Check console
            <Switch
              onChange={(e) => console.log(e.isChecked)}
              accessibilityLabel="Toggle DarkMode"
            />
          );
        }
        
        export default App;        
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Switch',
  component: SwitchComponent,
  args: {
    defaultChecked: undefined,
    isChecked: undefined,
    isDisabled: undefined,
    name: undefined,
    onChange: undefined,
    value: undefined,
    size: 'medium',
    accessibilityLabel: 'Toggle DarkMode',
  },
  tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<SwitchProps>;

const SwitchTemplate: StoryFn<typeof SwitchComponent> = ({ ...args }) => {
  return <SwitchComponent {...args} />;
};

export const Default = SwitchTemplate.bind({});
Default.storyName = 'Default';

export const Checked = SwitchTemplate.bind({});
Checked.storyName = 'Checked';
Checked.args = {
  isChecked: true,
};

export const DefaultCheckedSwitch = SwitchTemplate.bind({});
DefaultCheckedSwitch.storyName = 'DefaultChecked';
DefaultCheckedSwitch.args = {
  defaultChecked: true,
};

export const Small = SwitchTemplate.bind({});
Small.storyName = 'Small Size';
Small.args = {
  size: 'small',
};

const WithLabelTemplate: StoryFn<typeof SwitchComponent> = () => {
  return (
    <Box>
      <Alert
        marginBottom="spacing.6"
        isFullWidth
        color="notice"
        title="Note"
        description={
          <>
            Switch doesn't come with a label out of the box, consumers can create custom label if
            needed, see the switch{' '}
            <Link href="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?type=design&node-id=31919-629519&t=9TijeCLrhExSrH1z-0">
              guidelines for more details
            </Link>{' '}
            on how to use labels.
          </>
        }
      />
      <Text marginBottom="spacing.3">Right position:</Text>
      <Box as="label" display="flex" alignItems="center" gap="spacing.2">
        <SwitchComponent accessibilityLabel="Toggle Darkmode" size="small" />
        <Text weight="regular" variant="body" size="medium">
          Toggle Darkmode
        </Text>
      </Box>
      <Text marginTop="spacing.7" marginBottom="spacing.3">
        Left position:
      </Text>
      <Box as="label" display="flex" alignItems="center" gap="spacing.2">
        <Text weight="regular" variant="body" size="medium">
          Toggle Darkmode
        </Text>
        <SwitchComponent accessibilityLabel="Toggle Darkmode" size="small" />
      </Box>

      <Text marginTop="spacing.7" marginBottom="spacing.3">
        Multiple Groups:
      </Text>
      <Box width="350px">
        <Card>
          <CardBody>
            <Text size="small" weight="semibold" marginBottom="spacing.4">
              Activate/lock the below methods for card transactions
            </Text>
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Box
                as="label"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap="spacing.2"
              >
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <MapPinIcon color="surface.icon.gray.subtle" size="small" />
                  <Text weight="regular" variant="body" size="medium">
                    International transaction
                  </Text>
                </Box>
                <SwitchComponent accessibilityLabel="International transaction" size="small" />
              </Box>
              <Box
                as="label"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap="spacing.2"
              >
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <GlobeIcon color="surface.icon.gray.muted" size="small" />
                  <Text weight="regular" variant="body" size="medium">
                    Online transaction
                  </Text>
                </Box>
                <SwitchComponent accessibilityLabel="Online transaction" size="small" />
              </Box>
              <Box
                as="label"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap="spacing.2"
              >
                <Box display="flex" alignItems="center" gap="spacing.2">
                  <WifiIcon color="surface.icon.gray.muted" size="small" />
                  <Text weight="regular" variant="body" size="medium">
                    Contactless Transaction
                  </Text>
                </Box>
                <SwitchComponent accessibilityLabel="Contactless Transaction" size="small" />
              </Box>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </Box>
  );
};
export const WithLabel = WithLabelTemplate.bind({});

const ControlledAndUncontrolledComp = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <>
      <Box as="label" display="flex" alignItems="center" gap="spacing.2">
        <SwitchComponent
          accessibilityLabel="Toggle darkmode"
          defaultChecked
          onChange={(e) => console.log(e)}
        />
        <Text weight="regular" variant="body" size="medium">
          Uncontrolled
        </Text>
      </Box>

      <Box as="label" display="flex" alignItems="center" gap="spacing.2">
        <SwitchComponent
          accessibilityLabel="Toggle darkmode"
          isChecked={checked}
          onChange={(e) => setChecked(e.isChecked)}
        />
        <Text weight="regular" variant="body" size="medium">
          Controlled - Checked: {checked ? 'True' : 'False'}
        </Text>
      </Box>
    </>
  );
};
const _ControlledAndUncontrolled: StoryFn<typeof SwitchComponent> = () => {
  return <ControlledAndUncontrolledComp />;
};
export const ControlledAndUncontrolled = _ControlledAndUncontrolled.bind({});

export const SwitchRef: StoryFn<typeof SwitchComponent> = () => {
  const switchRef = React.useRef<BladeElementRef>(null);

  return (
    <BaseBox gap="spacing.3" display="flex" alignItems="center">
      <SwitchComponent accessibilityLabel="Toggle darkmode" ref={switchRef} />
      <Button onClick={() => switchRef?.current?.focus()}>Click to focus the switch</Button>
    </BaseBox>
  );
};

SwitchRef.storyName = 'Switch Ref';
SwitchRef.parameters = {
  docs: {
    description: {
      story:
        'Switch component exposes the `ref` prop. The `ref` exposes two methods `focus` & `scrollIntoView` which can be used to programatically control the DOM element',
    },
  },
};
