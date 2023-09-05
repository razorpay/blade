/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { Title } from '@storybook/addon-docs';
import type { PopoverProps } from '.';
import { PopoverInteractiveWrapper, Popover as PopoverComponent } from '.';
import { Button } from '~components/Button';
import { BankIcon, InfoIcon, SettlementsIcon } from '~components/Icons';
import { Link } from '~components/Link';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { isReactNative } from '~utils';
import { List, ListItem } from '~components/List';
import { IconButton } from '~components/Button/IconButton';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import BaseBox from '~components/Box/BaseBox';
import type { BladeCommonEvents } from '~components/types';
import { Amount } from '~components/Amount';
import { Divider } from '~components/Divider';
import { Checkbox } from '~components/Checkbox';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Popover"
      componentDescription="The popover typically provides additional context about the element or its function. A popover is always triggered by a mouse hover on desktop and on tap on mobile."
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?type=design&node-id=40636-559188&t=vaK9ZJskCpoIS07l-0',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?type=design&node-id=17121-718899&t=TtGMAUvsH8pUzTq9-0',
      }}
    >
      <Title>Usage</Title>
      <Sandbox showConsole>
        {`
        import { Popover, Button } from '@razorpay/blade/components'
        
        function App(): React.ReactElement {
          return (
            <Popover content="Hello world" placement="bottom">
              <Button>Hover over me</Button>
            </Popover>
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Popover',
  component: PopoverComponent,
  args: {
    placement: 'bottom',
    content: 'Amount reversed to customer bank account',
    onOpenChange: ({ isOpen }) => {
      console.log(isOpen);
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<PopoverProps>;

const Center = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return (
    <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
      {children}
    </Box>
  );
};

const Content = () => {
  return (
    <Box>
      <Box
        display="flex"
        gap="spacing.3"
        padding="spacing.3"
        flexDirection="column"
        borderRadius="medium"
        backgroundColor="surface.background.level2.lowContrast"
        borderWidth="thin"
        borderColor="surface.border.normal.lowContrast"
      >
        <Box display="flex" justifyContent="space-between" gap="spacing.5">
          <Text size="medium">Gross Settlements</Text>
          <Amount size="body-medium" value={5000} />
        </Box>
        <Box display="flex" justifyContent="space-between" gap="spacing.5">
          <Text size="medium">Deductions</Text>
          <Amount intent="negative" size="body-medium" value={250} />
        </Box>
        <Divider />
        <Box display="flex" justifyContent="space-between" gap="spacing.5">
          <Text weight="bold" size="medium">
            Net Settlements
          </Text>
          <Amount size="body-medium-bold" value={4750} />
        </Box>
      </Box>
    </Box>
  );
};

const FooterContent = React.forwardRef<HTMLButtonElement, { onClick?: () => void }>(
  (props, ref) => {
    return (
      <Box
        display="flex"
        flexDirection="row"
        gap="spacing.5"
        alignItems="center"
        justifyContent="space-between"
      >
        <Checkbox size="medium">Settle with refunds</Checkbox>
        <Button ref={ref} onClick={props.onClick} size="small" variant="tertiary">
          Settle amount
        </Button>
      </Box>
    );
  },
);

const PopoverTemplate: ComponentStory<typeof PopoverComponent> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Center>
      <PopoverComponent
        placement="left"
        initialFocusRef={buttonRef}
        headerTitle="Settlement breakup for setl_LB2H1j"
        headerLeading={<SettlementsIcon color="surface.text.normal.lowContrast" size="large" />}
        content={<Content />}
        footerContent={<FooterContent ref={buttonRef} />}
      >
        <Button>Click me</Button>
      </PopoverComponent>
      <PopoverComponent
        isOpen={isOpen}
        onOpenChange={({ isOpen }) => setIsOpen(isOpen)}
        headerTitle="Settlement breakup for setl_LB2H1j"
        headerLeading={<SettlementsIcon color="surface.text.normal.lowContrast" size="large" />}
        content={<Content />}
        footerContent={<FooterContent onClick={() => setIsOpen(false)} ref={buttonRef} />}
      >
        <Button>Click me controlled {isOpen ? 'yes' : 'no'}</Button>
      </PopoverComponent>
      <PopoverComponent
        headerTitle="International Payments"
        content={
          <Text>
            Your business can go international with support for transactions in 100 foreign
            currencies.
          </Text>
        }
      >
        <PopoverInteractiveWrapper>
          <Text>hello</Text>
          <InfoIcon marginTop="spacing.2" size="medium" color="surface.text.muted.lowContrast" />
        </PopoverInteractiveWrapper>
      </PopoverComponent>
    </Center>
  );
};

export const Default = PopoverTemplate.bind({});
Default.storyName = 'Default';

const PlacementBox = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode } & BladeCommonEvents
>(({ children, ...props }, ref) => {
  console.log(props);
  return (
    <PopoverInteractiveWrapper
      {...props}
      ref={ref}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flex={isReactNative() ? undefined : 1}
      width={isReactNative() ? '40%' : '100%'}
      flexShrink={0}
      padding="spacing.5"
      backgroundColor="surface.background.level3.lowContrast"
    >
      <Text contrast="low">{children}</Text>
    </PopoverInteractiveWrapper>
  );
});

const PlacementTemplate: ComponentStory<typeof PopoverComponent> = () => {
  const popoverContent = 'Hello world';

  if (isReactNative()) {
    return (
      <Center>
        <Box alignItems="center" justifyContent="center" flexDirection="row" flexWrap="wrap">
          <PopoverComponent placement="top-start" content={popoverContent}>
            <PlacementBox>top-start</PlacementBox>
          </PopoverComponent>
          <PopoverComponent placement="left" content={popoverContent}>
            <PlacementBox>left</PlacementBox>
          </PopoverComponent>
          <PopoverComponent placement="bottom-start" content={popoverContent}>
            <PlacementBox>bottom-start</PlacementBox>
          </PopoverComponent>
          <PopoverComponent placement="top" content={popoverContent}>
            <PlacementBox>top</PlacementBox>
          </PopoverComponent>
          <PopoverComponent placement="bottom" content={popoverContent}>
            <PlacementBox>bottom</PlacementBox>
          </PopoverComponent>
          <PopoverComponent placement="top-end" content={popoverContent}>
            <PlacementBox>top-end</PlacementBox>
          </PopoverComponent>
          <PopoverComponent placement="right" content={popoverContent}>
            <PlacementBox>right</PlacementBox>
          </PopoverComponent>
          <PopoverComponent placement="bottom-end" content={popoverContent}>
            <PlacementBox>bottom-end</PlacementBox>
          </PopoverComponent>
        </Box>
      </Center>
    );
  }

  return (
    <Center>
      <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap="spacing.4">
        <Box display="flex" alignItems="center" flexDirection="column" gap="spacing.4">
          <PopoverComponent placement="top-start" content={popoverContent}>
            <PlacementBox>top-start</PlacementBox>
          </PopoverComponent>
          <PopoverComponent placement="left" content={popoverContent}>
            <PlacementBox>left</PlacementBox>
          </PopoverComponent>
          <PopoverComponent placement="bottom-start" content={popoverContent}>
            <PlacementBox>bottom-start</PlacementBox>
          </PopoverComponent>
        </Box>
        <Box display="flex" alignItems="center" flexDirection="column" gap="spacing.4">
          <PopoverComponent placement="top" content={popoverContent}>
            <PlacementBox>top</PlacementBox>
          </PopoverComponent>
          <PopoverComponent placement="bottom" content={popoverContent}>
            <PlacementBox>bottom</PlacementBox>
          </PopoverComponent>
        </Box>
        <Box display="flex" alignItems="center" flexDirection="column" gap="spacing.4">
          <PopoverComponent placement="top-end" content={popoverContent}>
            <PlacementBox>top-end</PlacementBox>
          </PopoverComponent>
          <PopoverComponent placement="right" content={popoverContent}>
            <PlacementBox>right</PlacementBox>
          </PopoverComponent>
          <PopoverComponent placement="bottom-end" content={popoverContent}>
            <PlacementBox>bottom-end</PlacementBox>
          </PopoverComponent>
        </Box>
      </Box>
    </Center>
  );
};

export const Placement = PlacementTemplate.bind({});
Placement.storyName = 'Placement';

const NonInteractiveTriggerTemplate: ComponentStory<typeof PopoverComponent> = (args) => {
  return (
    <Box>
      <Text>
        When using non-interactive elements as Popover triggers, like Icons, Badges, Counters
      </Text>
      <Text>You can wrap the element in PopoverInteractiveWrapper component provided by blade</Text>
      <Box marginTop="spacing.5" display="flex" alignItems="center" gap="spacing.2">
        <Text>Refunds</Text>
        <PopoverComponent
          headerTitle="Hello world"
          content={<Text>Hello world</Text>}
          placement="bottom-start"
        >
          <PopoverInteractiveWrapper>
            <InfoIcon marginTop="spacing.2" size="medium" color="surface.text.muted.lowContrast" />
          </PopoverInteractiveWrapper>
        </PopoverComponent>
      </Box>
    </Box>
  );
};

export const NonInteractiveTrigger = NonInteractiveTriggerTemplate.bind({});

const PopoverTriggersTemplate: ComponentStory<typeof PopoverComponent> = (args) => {
  return (
    <Center>
      <Box display="flex" gap="spacing.11" alignItems="center" flexWrap="wrap">
        <PopoverComponent {...args} placement="top">
          <Button>Button</Button>
        </PopoverComponent>
        <Box marginTop="spacing.8" />
        <PopoverComponent {...args} placement="top">
          <Link onClick={() => console.log(1)} href="#">
            Link
          </Link>
        </PopoverComponent>
        <Box marginTop="spacing.8" />

        <PopoverComponent {...args} content="With IconButton" placement="top-end">
          <IconButton
            size="large"
            onClick={() => console.log(1)}
            icon={BankIcon}
            accessibilityLabel="IconButton"
          />
        </PopoverComponent>
        <Box marginTop="spacing.8" />
        <PopoverComponent {...args} content="With non-interactive icon" placement="bottom">
          <PopoverInteractiveWrapper>
            <InfoIcon size="large" color="surface.text.muted.lowContrast" />
          </PopoverInteractiveWrapper>
        </PopoverComponent>
      </Box>
    </Center>
  );
};

export const PopoverTriggers = PopoverTriggersTemplate.bind({});

const CustomTrigger = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode } & BladeCommonEvents
>(({ children, ...props }, ref) => {
  return (
    <BaseBox
      ref={ref}
      tabIndex={-1}
      display={isReactNative() ? 'flex' : 'inline-block'}
      alignSelf="flex-start"
      padding="spacing.4"
      borderRadius="medium"
      backgroundColor={
        isReactNative()
          ? 'surface.background.level1.lowContrast'
          : 'surface.background.level2.lowContrast'
      }
      {...props}
    >
      <Text contrast="low">{children}</Text>
    </BaseBox>
  );
});

const CustomTriggerTemplate = () => {
  return (
    <Box>
      <Text>
        To create a custom trigger, the popover component expects the trigger component to expose:
      </Text>
      <List>
        <ListItem>To expose ref</ListItem>
        <ListItem>To accept BladeCommonEvents (You can import this type from blade)</ListItem>
        <ListItem>
          tabIndex={'{'}-1{'}'} to be set on the trigger
        </ListItem>
      </List>
      <PopoverComponent placement="bottom" content="A custom trigger">
        <CustomTrigger>Hover over me</CustomTrigger>
      </PopoverComponent>
    </Box>
  );
};

export const WithCustomTrigger = CustomTriggerTemplate.bind({});
