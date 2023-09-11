/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import { Title } from '@storybook/addon-docs';
import { action } from '@storybook/addon-actions';
import { Pressable } from 'react-native';
import type { PopoverTriggerProps } from './types';
import type { PopoverProps } from '.';
import { PopoverInteractiveWrapper, Popover } from '.';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Amount } from '~components/Amount';
import { Divider } from '~components/Divider';
import { Checkbox } from '~components/Checkbox';
import iconMap from '~components/Icons/iconMap';
import { InfoIcon, MoonIcon, SearchIcon, SunIcon } from '~components/Icons';
import { Radio, RadioGroup } from '~components/Radio';
import { Badge } from '~components/Badge';
import { Counter } from '~components/Counter';
import { List, ListItem, ListItemText } from '~components/List';
import { TextInput } from '~components/Input/TextInput';
import { IconButton } from '~components/Button/IconButton';
import { isReactNative } from '~utils';

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
  component: Popover,
  argTypes: {
    titleLeading: {
      name: 'titleLeading',
      type: 'select',
      options: Object.keys(iconMap),
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<Omit<PopoverProps, 'titleLeading'>>;

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

const PopoverTemplate: ComponentStory<typeof Popover> = (args) => {
  const LeadingIcon = iconMap[args.titleLeading as string]!;
  return (
    <Center>
      <Popover
        {...args}
        titleLeading={<LeadingIcon color="surface.text.normal.lowContrast" size="medium" />}
      >
        <Button>Click me</Button>
      </Popover>
    </Center>
  );
};

export const Default = PopoverTemplate.bind({});
Default.storyName = 'Default';
Default.args = {
  title: 'Settlement breakup',
  content: <Content />,
  footer: <FooterContent />,
  titleLeading: 'SettlementsIcon',
};

export const Uncontrolled = PopoverTemplate.bind({});
Uncontrolled.storyName = 'Uncontrolled';
Uncontrolled.args = {
  title: 'Settlement breakup',
  content: <Content />,
  footer: <FooterContent />,
  titleLeading: 'SettlementsIcon',
  defaultIsOpen: true,
  onOpenChange: ({ isOpen }) => {
    action('onOpenChange')({ isOpen });
  },
};

export const Controlled: ComponentStory<typeof Popover> = (args) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const LeadingIcon = iconMap[args.titleLeading as string]!;
  return (
    <Center>
      <Popover
        {...args}
        isOpen={isOpen}
        onOpenChange={({ isOpen }) => {
          setIsOpen(isOpen);
        }}
        footer={<FooterContent onClick={() => setIsOpen(false)} />}
        titleLeading={<LeadingIcon color="surface.text.normal.lowContrast" size="medium" />}
      >
        <Button onClick={() => setIsOpen((prev) => !prev)}>Click me</Button>
      </Popover>
      <Button
        marginLeft="spacing.3"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        {isOpen ? 'Close' : 'Open'}
      </Button>
    </Center>
  );
};
Controlled.args = {
  placement: 'left',
  title: 'Settlement breakup',
  content: <Content />,
  titleLeading: 'SettlementsIcon',
};

const PlacementTemplate: ComponentStory<typeof Popover> = (args) => {
  const allPlacements = [
    'top',
    'top-start',
    'top-end',
    'left',
    'left-start',
    'left-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'right',
    'right-start',
    'right-end',
  ];
  const [placement, setPlacement] = React.useState<PopoverProps['placement']>('bottom');

  return (
    <Box display="flex" flexDirection="row" flexWrap="nowrap">
      <Box flex={1}>
        <RadioGroup
          label="Select Placement"
          onChange={({ value }) => setPlacement(value as PopoverProps['placement'])}
        >
          {allPlacements.map((placement) => {
            return (
              <Radio key={placement} value={placement}>
                {placement}
              </Radio>
            );
          })}
        </RadioGroup>
      </Box>

      <Box flex={1} margin="auto" marginTop="20%">
        <Popover {...args} isOpen={isReactNative() ? undefined : true} placement={placement}>
          <Button>Click me</Button>
        </Popover>
      </Box>
    </Box>
  );
};

export const Placement = PlacementTemplate.bind({});
Placement.storyName = 'Placement';
Placement.args = {
  title: 'Settlement breakup',
  content: <Content />,
};

export const PopoverInteractiveWrapperTemplate: ComponentStory<typeof Popover> = (args) => {
  const LeadingIcon = iconMap[args.titleLeading as string]!;
  return (
    <>
      <Text as="span">
        With{' '}
        <Text weight="bold" as="span">
          PopoverInteractiveWrapper
        </Text>{' '}
        you can make Popover open when clicking non-interactive elements like Icons,Badges,Counter
        etc
      </Text>
      <Text type="muted">Note: PopoverInteractiveWrapper is a button by default.</Text>
      <Center>
        <Box display="flex" flexDirection="row" alignItems="center" gap="spacing.3">
          <Popover
            {...args}
            titleLeading={<LeadingIcon color="surface.text.normal.lowContrast" size="medium" />}
          >
            <PopoverInteractiveWrapper display="inline-block">
              <InfoIcon color="surface.text.normal.lowContrast" size="large" />
            </PopoverInteractiveWrapper>
          </Popover>

          <Popover
            {...args}
            titleLeading={<LeadingIcon color="surface.text.normal.lowContrast" size="medium" />}
          >
            <PopoverInteractiveWrapper>
              <Badge variant="information">NEW</Badge>
            </PopoverInteractiveWrapper>
          </Popover>

          <Popover
            {...args}
            titleLeading={<LeadingIcon color="surface.text.normal.lowContrast" size="medium" />}
          >
            <PopoverInteractiveWrapper>
              <Counter value={20} />
            </PopoverInteractiveWrapper>
          </Popover>
        </Box>
      </Center>
    </>
  );
};
PopoverInteractiveWrapperTemplate.storyName = 'PopoverInteractiveWrapper';
PopoverInteractiveWrapperTemplate.args = {
  placement: 'top',
  title: 'Settlement breakup',
  content: <Content />,
  titleLeading: 'SettlementsIcon',
};

const MyCustomTriggerButton = React.forwardRef<
  HTMLDivElement,
  { children: string } & PopoverTriggerProps
>(({ children, ...props }, ref) => {
  if (isReactNative()) {
    return (
      // just spread the props
      <Pressable ref={ref as never} onTouchEnd={props.onTouchEnd}>
        <Text>{children}</Text>
      </Pressable>
    );
  }
  return (
    // just spread the props
    <div role="button" tabIndex={0} ref={ref} {...props}>
      {children}
    </div>
  );
});

const CustomTriggerDocs = () => {
  if (isReactNative()) return null;
  return (
    <List>
      <ListItem>Forward the ref to the custom trigger</ListItem>
      <ListItem>
        Forward event handlers to the custom trigger (you can import the PopoverTriggerProps type
        from blade when using TypeScript)
        <List>
          <ListItem>onClick</ListItem>
          <ListItem>
            onMouseDown{' '}
            <ListItemText as="span" type="placeholder">
              (not needed if your trigger is a button component)
            </ListItemText>
          </ListItem>
          <ListItem>
            onPointerDown{' '}
            <ListItemText as="span" type="placeholder">
              (not needed if your trigger is a button component)
            </ListItemText>
          </ListItem>
          <ListItem>
            onKeyDown{' '}
            <ListItemText as="span" type="placeholder">
              (not needed if your trigger is a button component)
            </ListItemText>
          </ListItem>
          <ListItem>
            onKeyUp{' '}
            <ListItemText as="span" type="placeholder">
              (not needed if your trigger is a button component)
            </ListItemText>
          </ListItem>
          <ListItem>
            onTouchEnd{' '}
            <ListItemText as="span" type="placeholder">
              (react-native only)
            </ListItemText>
          </ListItem>
        </List>
      </ListItem>
    </List>
  );
};

export const CustomTrigger: ComponentStory<typeof Popover> = (args) => {
  const LeadingIcon = iconMap[args.titleLeading as string]!;

  return (
    <>
      <Text as="span">
        Most of your usecase can be solved using PopoverInteractiveWrapper, but if you want to use a
        custom trigger element you can pass
      </Text>

      <CustomTriggerDocs />
      <Text>
        Alternatively you can just spread the props to the trigger, instead of adding them 1 by 1
      </Text>
      <Center>
        <Popover
          {...args}
          titleLeading={<LeadingIcon color="surface.text.normal.lowContrast" size="medium" />}
        >
          <MyCustomTriggerButton>My Custom Trigger</MyCustomTriggerButton>
        </Popover>
      </Center>
    </>
  );
};
CustomTrigger.args = {
  placement: 'top',
  title: 'Settlement breakup',
  content: <Content />,
  titleLeading: 'SettlementsIcon',
};

export const InitialFocus: ComponentStory<typeof Popover> = (args) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const LeadingIcon = iconMap[args.titleLeading as string]!;
  return (
    <>
      <Text>
        If you wan to focus on a particular element when the popover opens, you can pass the ref of
        the element to the initialFocusRef prop.
      </Text>
      <Center>
        <Popover
          {...args}
          initialFocusRef={buttonRef}
          footer={<FooterContent ref={buttonRef} />}
          titleLeading={<LeadingIcon color="surface.text.normal.lowContrast" size="medium" />}
        >
          <Button>Click me</Button>
        </Popover>
      </Center>
    </>
  );
};
InitialFocus.args = {
  placement: 'left',
  title: 'Settlement breakup',
  titleLeading: 'SettlementsIcon',
  content: <Content />,
};

export const ProductUseCase1: ComponentStory<typeof Popover> = () => {
  const integrateButtonRef = React.useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [actionTaken, setActionTaken] = React.useState(false);

  const close = () => {
    setIsOpen(false);
    setActionTaken(true);
  };

  return (
    <Box>
      <Text as="span">
        <Text as="span" weight="bold">
          Product Usecase Example:
        </Text>
        <Text>
          A popover that opens when the user focuses on the input field and asks the user to do an
          action. It only opens once and never again.
        </Text>
      </Text>
      <Box width="fit-content" marginTop="spacing.8">
        <Popover
          placement="left"
          isOpen={isOpen}
          initialFocusRef={integrateButtonRef}
          title="Use items from ZohoBooks"
          onOpenChange={({ isOpen }) => {
            setIsOpen(isOpen);
            if (!isOpen) {
              close();
            }
          }}
          content={
            <Text>
              Integrate with your accounting tool ZohoBooks to use items directly from it.
            </Text>
          }
          footer={
            <Box display="flex" flexDirection="row">
              <Box marginLeft="auto" display="flex" flexDirection="row" gap="spacing.3">
                <Button onClick={() => close()} size="small" variant="secondary">
                  I'll do it later
                </Button>
                <Button
                  ref={integrateButtonRef}
                  onClick={() => close()}
                  size="small"
                  variant="primary"
                >
                  Integrate now
                </Button>
              </Box>
            </Box>
          }
        >
          <TextInput
            onFocus={() => {
              if (!actionTaken) {
                setIsOpen(true);
              }
            }}
            label="Item Name"
          />
        </Popover>
      </Box>
    </Box>
  );
};
ProductUseCase1.storyName = 'Product Usecase: Input with action';

export const ProductUseCase2: ComponentStory<typeof Popover> = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [hasSeen, setHasSeen] = React.useState(false);

  const toggleDarkMode = () => {
    // close the popover and toggle darkmode
    setIsOpen(false);
    setIsDarkMode((prev) => !prev);
  };

  return (
    <Box>
      <Text as="span">
        <Text as="span" weight="bold">
          Product Usecase Example:
        </Text>
        <Text>
          A darkmode popover that opens on page load and asks the user to try dark mode. It only
          opens once and never again.
        </Text>
      </Text>
      <Text marginY="spacing.5">isDarkMode On? {isDarkMode ? 'Yes' : 'No'}</Text>

      <Box marginTop="spacing.8">
        <Popover
          placement="bottom-end"
          isOpen={hasSeen ? false : isOpen}
          onOpenChange={({ isOpen }) => {
            setIsOpen(isOpen);
            // if the popover is closed, it means the user has seen it
            if (!isOpen) {
              setHasSeen(true);
            }
          }}
          title="Dark Mode"
          titleLeading={<SunIcon color="surface.text.normal.lowContrast" size="small" />}
          content={
            <Text as="span">
              Want a more comfortable reading experience?{' '}
              <Text as="span" weight="bold">
                Try dark mode
              </Text>
            </Text>
          }
          footer={
            <Box display="flex" flexDirection="row">
              <Box marginLeft="auto" display="flex" flexDirection="row" gap="spacing.3">
                <Button onClick={() => setIsOpen(false)} size="small" variant="secondary">
                  Not now
                </Button>
                <Button onClick={toggleDarkMode} size="small" variant="primary">
                  Yes
                </Button>
              </Box>
            </Box>
          }
        >
          <IconButton
            onClick={toggleDarkMode}
            accessibilityLabel="Toggle Darkmode"
            icon={isDarkMode ? SunIcon : MoonIcon}
          />
        </Popover>
      </Box>
    </Box>
  );
};
ProductUseCase2.storyName = 'Product Usecase: Dark Mode';

export const ProductUseCase3: ComponentStory<typeof Popover> = () => {
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <Box>
      <Text as="span">
        <Text as="span" weight="bold">
          Product Usecase Example:
        </Text>
        <Text>
          A popover that opens on page load and lets user know about the new search feature. It only
          opens once and never again.
        </Text>
      </Text>

      <Box width="400px" marginTop="spacing.8">
        <Popover
          isOpen={isOpen}
          onOpenChange={({ isOpen }) => {
            setIsOpen(isOpen);
          }}
          placement="bottom"
          title="Introducing Search"
          content={
            <Text as="span">
              Your can search for Payments products, Account & Settings, and more.
            </Text>
          }
          footer={
            <Box display="flex" flexDirection="row">
              <Box marginLeft="auto">
                <Button
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  size="small"
                  variant="tertiary"
                >
                  Got it
                </Button>
              </Box>
            </Box>
          }
        >
          <TextInput
            icon={SearchIcon}
            label="Search"
            placeholder="Search payments prodcts, settings and more"
          />
        </Popover>
      </Box>
    </Box>
  );
};
ProductUseCase3.storyName = 'Product Usecase: Introducing Search';
