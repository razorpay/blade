/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { Title } from '@storybook/addon-docs';
import { action } from '@storybook/addon-actions';
import type { PopoverTriggerProps } from './types';
import type { PopoverProps } from '.';
import { PopoverInteractiveWrapper, Popover } from '.';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { Code, Text } from '~components/Typography';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Amount } from '~components/Amount';
import { Divider } from '~components/Divider';
import iconMap from '~components/Icons/iconMap';
import { InfoIcon, MoonIcon, SearchIcon, SunIcon } from '~components/Icons';
import { Badge } from '~components/Badge';
import { Counter } from '~components/Counter';
import { List, ListItem, ListItemLink, ListItemText } from '~components/List';
import { IconButton } from '~components/Button/IconButton';
import { isReactNative } from '~utils';
import { Alert } from '~components/Alert';
import BaseBox from '~components/Box/BaseBox';
import { PopoverVsTooltip } from '~utils/storybook/PopoverVsTooltip';
import { TextInput } from '~components/Input/TextInput';
import { Radio, RadioGroup } from '~components/Radio';
import { Checkbox } from '~components/Checkbox';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Popover"
      componentDescription="The popover typically provides additional context about the element or its function. A popover is always triggered by a mouse hover on desktop and on tap on mobile."
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74881-74441&t=pUgmEvKFltc22Yap-1&scaling=min-zoom&page-id=55505%3A14506&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Popover, Button } from '@razorpay/blade/components'
        
        function App() {
          return (
            <Popover content="Hello world" placement="bottom">
              <Button>Hover over me</Button>
            </Popover>
          )
        }

        export default App;
      `}
      </Sandbox>
      <Title>Popover Vs Tooltip Vs Guided Popover</Title>
      <PopoverVsTooltip />
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
  argTypes: {
    titleLeading: {
      name: 'titleLeading',
      type: 'select',
      options: Object.keys(iconMap),
    },
    content: {
      control: {
        disable: true,
      },
    },
    footer: {
      control: {
        disable: true,
      },
    },
    initialFocusRef: {
      control: {
        disable: true,
      },
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
    <Box width="100%" height="70vh" display="flex" alignItems="center" justifyContent="center">
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
        backgroundColor="surface.background.gray.intense"
        borderWidth="thin"
        borderColor="surface.border.gray.subtle"
      >
        <Box display="flex" justifyContent="space-between" gap="spacing.5">
          <Text size="medium">Gross Settlements</Text>
          <Amount size="medium" value={5000} />
        </Box>
        <Box display="flex" justifyContent="space-between" gap="spacing.5">
          <Text size="medium">Deductions</Text>
          <Amount color="negative" size="medium" value={250} />
        </Box>
        <Divider variant="subtle" />
        <Box display="flex" justifyContent="space-between" gap="spacing.5">
          <Text weight="semibold" size="medium">
            Net Settlements
          </Text>
          <Amount size="medium" weight="semibold" value={4750} />
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

const PopoverTemplate: StoryFn<typeof Popover> = (args) => {
  const LeadingIcon = iconMap[args.titleLeading as string]!;
  return (
    <Center>
      <Popover
        {...args}
        titleLeading={<LeadingIcon color="interactive.icon.gray.normal" size="medium" />}
      >
        <Button>View Settlement</Button>
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

export const Controlled: StoryFn<typeof Popover> = (args) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const LeadingIcon = iconMap[args.titleLeading as string]!;
  return (
    <Box>
      <Text marginBottom="spacing.5">
        You can make the popover controlled by passing the <Code>isOpen</Code>, and{' '}
        <Code>onOpenChange</Code> props.
      </Text>
      <Center>
        <Box textAlign="center">
          <Text marginBottom="spacing.4">Is Popover Open? {isOpen ? 'Yes' : 'No'}</Text>
          <Popover
            {...args}
            isOpen={isOpen}
            onOpenChange={({ isOpen }) => {
              setIsOpen(isOpen);
            }}
            footer={<FooterContent onClick={() => setIsOpen(false)} />}
            titleLeading={<LeadingIcon color="interactive.icon.gray.normal" size="medium" />}
          >
            <Button onClick={() => setIsOpen((prev) => !prev)}>View Settlement</Button>
          </Popover>
        </Box>
      </Center>
    </Box>
  );
};
Controlled.args = {
  placement: 'left',
  title: 'Settlement breakup',
  content: <Content />,
  titleLeading: 'SettlementsIcon',
};

const PlacementTemplate: StoryFn<typeof Popover> = (args, context) => {
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
  const isInDocsMode = context.viewMode === 'docs';

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
        <Popover
          {...args}
          isOpen={isInDocsMode || isReactNative() ? undefined : true}
          placement={placement}
        >
          <Button>View Settlement</Button>
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

export const PopoverInteractiveWrapperTemplate: StoryFn<typeof Popover> = (args) => {
  const LeadingIcon = iconMap[args.titleLeading as string]!;
  return (
    <>
      <Text as="span">
        With{' '}
        <Text weight="semibold" as="span">
          PopoverInteractiveWrapper
        </Text>{' '}
        you can make Popover open when clicking non-interactive elements like Icons,Badges,Counter
        etc
      </Text>
      <Text color="surface.text.gray.muted">
        Note: PopoverInteractiveWrapper is a button by default.
      </Text>
      <Center>
        <Box display="flex" flexDirection="row" alignItems="center" gap="spacing.3">
          <Popover
            {...args}
            titleLeading={<LeadingIcon color="interactive.icon.gray.normal" size="medium" />}
          >
            <PopoverInteractiveWrapper display="inline-block">
              <InfoIcon color="interactive.icon.gray.normal" size="large" />
            </PopoverInteractiveWrapper>
          </Popover>

          <Popover
            {...args}
            titleLeading={<LeadingIcon color="interactive.icon.gray.normal" size="medium" />}
          >
            <PopoverInteractiveWrapper>
              <Badge color="information">NEW</Badge>
            </PopoverInteractiveWrapper>
          </Popover>

          <Popover
            {...args}
            titleLeading={<LeadingIcon color="interactive.icon.gray.normal" size="medium" />}
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
>(({ children, onTouchEnd, ...props }, ref) => {
  if (isReactNative()) {
    return (
      // just spread the props
      <Button ref={ref as never} onClick={props.onClick as never}>
        {children}
      </Button>
    );
  }

  return (
    // just spread the props
    <BaseBox
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      borderRadius="medium"
      role="button"
      tabIndex={0}
      ref={ref}
      style={{ cursor: 'pointer' }}
      {...props}
    >
      {children}
    </BaseBox>
  );
});

const CustomTriggerDocs = () => {
  if (isReactNative()) return null;
  return (
    <List>
      <ListItem>
        Make sure to expose ref from the custom component via{' '}
        <ListItemLink href="https://react.dev/reference/react/forwardRef">
          React.forwardRef
        </ListItemLink>
      </ListItem>
      <ListItem>
        Make sure that your component can receive focus{' '}
        <ListItemText as="span" color="surface.text.gray.muted">
          (eg: have tabIndex:0)
        </ListItemText>
      </ListItem>
      <ListItem>
        Forward event handlers to the custom trigger{' '}
        <ListItemText as="span" color="surface.text.gray.muted">
          (you can import the PopoverTriggerProps type from blade when using TypeScript)
        </ListItemText>
        <List>
          <ListItem>onClick</ListItem>
          <ListItem>
            onMouseDown{' '}
            <ListItemText as="span" color="surface.text.gray.muted">
              (not needed if your trigger is a button component)
            </ListItemText>
          </ListItem>
          <ListItem>
            onPointerDown{' '}
            <ListItemText as="span" color="surface.text.gray.muted">
              (not needed if your trigger is a button component)
            </ListItemText>
          </ListItem>
          <ListItem>
            onKeyDown{' '}
            <ListItemText as="span" color="surface.text.gray.muted">
              (not needed if your trigger is a button component)
            </ListItemText>
          </ListItem>
          <ListItem>
            onKeyUp{' '}
            <ListItemText as="span" color="surface.text.gray.muted">
              (not needed if your trigger is a button component)
            </ListItemText>
          </ListItem>
          <ListItem>
            onTouchEnd{' '}
            <ListItemText as="span" color="surface.text.gray.muted">
              (react-native only)
            </ListItemText>
          </ListItem>
        </List>
      </ListItem>
    </List>
  );
};

export const CustomTrigger: StoryFn<typeof Popover> = (args) => {
  const LeadingIcon = iconMap[args.titleLeading as string]!;

  return (
    <>
      <Text as="span">
        Most of your usecase can be solved using PopoverInteractiveWrapper, but if you want to use a
        custom trigger element you do this:
      </Text>

      <CustomTriggerDocs />
      <Text marginBottom="spacing.4">
        Alternatively you can just spread the props to the trigger, instead of adding them 1 by 1
      </Text>
      <Center>
        <Popover
          {...args}
          titleLeading={<LeadingIcon color="interactive.icon.gray.normal" size="medium" />}
        >
          <MyCustomTriggerButton>View Settlements</MyCustomTriggerButton>
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

export const InitialFocus: StoryFn<typeof Popover> = (args) => {
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
          titleLeading={<LeadingIcon color="interactive.icon.gray.normal" size="medium" />}
        >
          <Button>View Settlement</Button>
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

const StoriesPanelSwitchAlert = ({ shouldShow }: { shouldShow: boolean }) => {
  return shouldShow ? (
    <Alert
      title="Please switch to stories panel"
      marginBottom="spacing.5"
      description="Open this example in the 'Stories' panel and reload the page for better experince"
      color="notice"
    />
  ) : null;
};

export const ProductUseCase1: StoryFn<typeof Popover> = (args, context) => {
  const isInDocsMode = context.viewMode === 'docs';
  const integrateButtonRef = React.useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [actionTaken, setActionTaken] = React.useState(false);

  const close = () => {
    setIsOpen(false);
    setActionTaken(true);
  };

  return (
    <Box>
      <StoriesPanelSwitchAlert shouldShow={isInDocsMode} />
      <Text as="span">
        <Text as="span" weight="semibold">
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

export const ProductUseCase2: StoryFn<typeof Popover> = (args, context) => {
  const isInDocsMode = context.viewMode === 'docs';
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
      <StoriesPanelSwitchAlert shouldShow={isInDocsMode} />
      <Text as="span">
        <Text as="span" weight="semibold">
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
          titleLeading={<SunIcon color="interactive.icon.gray.normal" size="small" />}
          content={
            <Text as="span">
              Want a more comfortable reading experience?{' '}
              <Text as="span" weight="semibold">
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

export const ProductUseCase3: StoryFn<typeof Popover> = (args, context) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const isInDocsMode = context.viewMode === 'docs';

  return (
    <Box>
      <StoriesPanelSwitchAlert shouldShow={isInDocsMode} />
      <Text as="span">
        <Text as="span" weight="semibold">
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
