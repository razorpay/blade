/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Title } from '@storybook/addon-docs';
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { Text } from '../Typography';
import type { SwitchProps } from './';
import { Switch as SwitchComponent } from './';
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
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=13227%3A163026',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=11169%3A230354',
      }}
    >
      <Title>Usage</Title>
      <Sandbox showConsole>
        {`
        import { Switch } from '@razorpay/blade/components'
        
        function App(): React.ReactElement {
          return (
            // Check console
            <Switch onChange={(e) => console.log(e.isChecked)} accessibilityLabel="Toggle DarkMode" />
          )
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
  argTypes: getStyledPropsArgTypes(),
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<SwitchProps>;

const SwitchTemplate: ComponentStory<typeof SwitchComponent> = ({ ...args }) => {
  return <SwitchComponent {...args} />;
};

export const Default = SwitchTemplate.bind({});
Default.storyName = 'Default';

export const Checked = SwitchTemplate.bind({});
Checked.storyName = 'Checked';
Checked.args = {
  isChecked: true,
};

export const DefaultChecked = SwitchTemplate.bind({});
DefaultChecked.storyName = 'DefaultChecked';
DefaultChecked.args = {
  defaultChecked: true,
};

export const Small = SwitchTemplate.bind({});
Small.storyName = 'Small Size';
Small.args = {
  size: 'small',
};

const WithLabelTemplate: ComponentStory<typeof SwitchComponent> = () => {
  return (
    <Box>
      <Alert
        marginBottom="spacing.6"
        isFullWidth
        intent="notice"
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
            <Text size="small" weight="bold" marginBottom="spacing.4">
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
                  <MapPinIcon color="surface.text.subdued.lowContrast" size="small" />
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
                  <GlobeIcon color="surface.text.subdued.lowContrast" size="small" />
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
                  <WifiIcon color="surface.text.subdued.lowContrast" size="small" />
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
const _ControlledAndUncontrolled: ComponentStory<typeof SwitchComponent> = () => {
  return <ControlledAndUncontrolledComp />;
};
export const ControlledAndUncontrolled = _ControlledAndUncontrolled.bind({});

export const SwitchRef: ComponentStory<typeof SwitchComponent> = () => {
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
