/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import isChromatic from 'chromatic/isChromatic';
import type { BottomSheetHeaderProps, BottomSheetProps } from './';
import {
  BottomSheetBody,
  BottomSheet as BottomSheetComponent,
  BottomSheetFooter,
  BottomSheetHeader,
} from './';
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  CloseIcon,
  CustomersIcon,
  InfoIcon,
  ThumbsUpIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Heading, Text } from '~components/Typography';
import { Badge } from '~components/Badge';
import { List, ListItem } from '~components/List';
import { Counter } from '~components/Counter';
import { Box } from '~components/Box';
import { Link } from '~components/Link';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { isReactNative } from '~utils';
import { SandboxHighlighter } from '~utils/storybook/Sandbox/SandpackEditor';
import {
  ActionList,
  ActionListItem,
  ActionListItemIcon,
  ActionListSection,
} from '~components/ActionList';
import { Dropdown, DropdownButton } from '~components/Dropdown';
import { SelectInput } from '~components/Input/DropdownInputTriggers';
import { OTPInput } from '~components/Input/OTPInput';
import { Radio, RadioGroup } from '~components/Radio';
import { Checkbox } from '~components/Checkbox';
import { TextInput } from '~components/Input/TextInput';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="A bottom sheet is a component commonly used in mobile applications to display additional information or actions without obstructing the main content of the screen."
      componentName="BottomSheet"
      imports={`
      import {
        BottomSheet,
        BottomSheetBody,
        BottomSheetFooter,
        BottomSheetHeader,
      } from '@razorpay/blade/components';
      
      import type {
        BottomSheetProps, 
        BottomSheetFooterProps,
        BottomSheetHeaderProps
      } from '@razorpay/blade/components';
      `}
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=76140-1564627&t=eMQWVawMPyhCdtgv-1&scaling=min-zoom&page-id=25042%3A498654&mode=design"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole editorHeight={600}>
        {`
          import React from 'react';
          import { 
            BottomSheet,
            BottomSheetBody,
            BottomSheetFooter,
            BottomSheetHeader,
            Button,
            Box,
            Checkbox,
            Text,
          } from '@razorpay/blade/components';

          function App() {
            const [isOpen, setIsOpen] = React.useState(false);

            return (
              <Box>
                <Button onClick={() => setIsOpen(true)}>{isOpen ? 'close' : 'open'}</Button>
                <BottomSheet
                  isOpen={isOpen}
                  onDismiss={() => {
                    setIsOpen(false);
                  }}
                >
                  <BottomSheetHeader title="Terms & Conditions" subtitle="Read carefully before accepting." />
                  <BottomSheetBody>
                    <Text>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                      Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                      when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
                      It has survived not only five centuries, but also the leap into electronic typesetting, 
                      remaining essentially unchanged. It was popularised in the 1960s with the release of 
                      Letraset sheets containing Lorem Ipsum passages, and more recently with desktop 
                      publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                    </Text>
                  </BottomSheetBody>
                  <BottomSheetFooter>
                    <Box
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box flexShrink={0}>
                        <Checkbox>I accept terms and condition</Checkbox>
                      </Box>
                      <Button>Continue</Button>
                    </Box>
                  </BottomSheetFooter>
                </BottomSheet>
              </Box>
            )
          }

          export default App;
        `}
      </Sandbox>
      <Heading size="large">iOS Safari Specific Setup</Heading>
      <Text marginTop="spacing.4">
        When using BottomSheet or SpotlightPopoverTour, Make sure to set a width/height to the
        `body` otherwise when they open, the page will get clipped. This happens due to a bug in iOS
        safari where it won't compute the height of the body correctly.
      </Text>
      <SandboxHighlighter showLineNumbers={false} theme="light">
        {`
          body {
            width: 100%;
            height: 100%;
          }
        `}
      </SandboxHighlighter>
    </StoryPageWrapper>
  );
};

const propsCategory = { HEADER: 'Header Props' };
const headerTrailingMap = {
  Badge: <Badge color="positive">Action Needed</Badge>,
  Text: <Text>$12,000</Text>,
  Link: <Link href="#">Link</Link>,
  IconButton: <Button icon={InfoIcon} accessibilityLabel="Trailing icon" />,
};

const headerTitleSuffixMap = {
  None: undefined,
  Counter: <Counter value={12} color="positive" />,
};

type StoryControlProps = BottomSheetProps & BottomSheetHeaderProps;
export default {
  title: 'Components/BottomSheet',
  component: BottomSheetComponent,
  args: {
    isOpen: undefined,
    children: undefined,
    snapPoints: undefined,
    initialFocusRef: undefined,
    onDismiss: undefined,
    showBackButton: undefined,
    leading: undefined,
    onBackButtonClick: undefined,
    subtitle: undefined,
    title: undefined,
    titleSuffix: undefined,
    trailing: undefined,
  },
  tags: ['autodocs'],
  argTypes: {
    showBackButton: {
      defaultValue: false,
      table: {
        category: propsCategory.HEADER,
      },
    },
    title: {
      table: {
        category: propsCategory.HEADER,
      },
    },
    subtitle: {
      table: {
        category: propsCategory.HEADER,
      },
    },
    trailing: {
      control: {
        type: 'select',
      },
      mapping: headerTrailingMap,
      options: Object.keys(headerTrailingMap),
      defaultValue: 'Badge',
      description:
        'Trailing element to be rendered in the Header, Accepts one of `Badge`, `Text`, `Button`, `Link`',
      table: {
        category: propsCategory.HEADER,
      },
    },
    titleSuffix: {
      control: {
        type: 'select',
      },
      mapping: headerTitleSuffixMap,
      options: Object.keys(headerTitleSuffixMap),
      defaultValue: 'Counter',
      description: 'Renders an adornment besides the title, Accepts `Counter`',
      table: {
        category: propsCategory.HEADER,
      },
    },
  },
  parameters: {
    docs: {
      page: () => <Page />,
    },
  },
} as Meta<StoryControlProps>;

const BottomSheetTemplate: StoryFn<typeof BottomSheetComponent> = ({ ...args }) => {
  const [isOpen, setIsOpen] = React.useState(isReactNative() ? false : isChromatic());

  return (
    <BaseBox>
      <Button onClick={() => setIsOpen(true)}>{isOpen ? 'close' : 'open'}</Button>
      <Text marginY="spacing.11">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
        galley of type and scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
        passages, and more recently with desktop publishing software like Aldus PageMaker including
        versions of Lorem Ipsum.
      </Text>
      <Text marginY="spacing.11">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
        galley of type and scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
        passages, and more recently with desktop publishing software like Aldus PageMaker including
        versions of Lorem Ipsum.
      </Text>
      <Text marginY="spacing.11">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
        galley of type and scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
        passages, and more recently with desktop publishing software like Aldus PageMaker including
        versions of Lorem Ipsum.
      </Text>
      <Text marginY="spacing.11">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
        galley of type and scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
        passages, and more recently with desktop publishing software like Aldus PageMaker including
        versions of Lorem Ipsum.
      </Text>
      <Text marginY="spacing.11">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
        been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
        galley of type and scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
        passages, and more recently with desktop publishing software like Aldus PageMaker including
        versions of Lorem Ipsum.
      </Text>
      <BottomSheetComponent
        {...args}
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
      >
        <BottomSheetHeader title="Terms & Conditions" subtitle="Read carefully before accepting." />
        <BottomSheetBody>
          <List>
            <ListItem>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
              has been the industry's standard dummy text ever since the 1500s, when an unknown
              printer took a galley of type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into electronic typesetting,
              remaining essentially unchanged. It was popularised in the 1960s with the release of
              Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </ListItem>
            <ListItem>
              It is a long established fact that a reader will be distracted by the readable content
              of a page when looking at its layout. The point of using Lorem Ipsum is that it has a
              more-or-less normal distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English. Many desktop publishing packages
              and web page editors now use Lorem Ipsum as their default model text, and a search for
              'lorem ipsum' will uncover many web sites still in their infancy. Various versions
              have evolved over the years, sometimes by accident, sometimes on purpose (injected
              humour and the like).
            </ListItem>
            <ListItem>
              Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a
              piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard
              McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of
              the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going
              through the cites of the word in classical literature, discovered the undoubtable
              source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et
              Malorum" (If you don't use blade we will haunt you) by Cicero, written in 45 BC. This
              book is a treatise on the theory of ethics, very popular during the Renaissance. The
              first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in
              section 1.10.32.
            </ListItem>
            <ListItem>
              The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those
              interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by
              Cicero are also reproduced in their exact original form, accompanied by English
              versions from the 1914 translation by H. Rackham.
            </ListItem>
          </List>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box flexShrink={0}>
              <Checkbox>I accept terms and condition</Checkbox>
            </Box>
            <Button>Continue</Button>
          </Box>
        </BottomSheetFooter>
      </BottomSheetComponent>
    </BaseBox>
  );
};

export const Default = BottomSheetTemplate.bind({});

const WithHeaderFooterTemplate: StoryFn<any> = (args: StoryControlProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <BaseBox>
      <Text marginBottom="spacing.4">
        Play around with the Header props in the storybook controls panel
      </Text>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <BottomSheetComponent {...args} isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <BottomSheetHeader
          showBackButton={args.showBackButton}
          title={args.title}
          subtitle={args.subtitle}
          trailing={args.trailing}
          titleSuffix={args.titleSuffix}
        />
        <BottomSheetBody>
          <RadioGroup label="Addresses">
            <Radio value="home">Home - 11850 Florida 24, Cedar Key, Florida</Radio>
            <Radio value="office-1">Office - 2033 Florida 21, Cedar Key, Florida</Radio>
            <Radio value="office-2">Work - 5938 New York, Main Street</Radio>
          </RadioGroup>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Button isFullWidth variant="tertiary">
            Remove address
          </Button>
          <Button isFullWidth marginTop="spacing.5">
            Add address
          </Button>
        </BottomSheetFooter>
      </BottomSheetComponent>
    </BaseBox>
  );
};

export const WithHeaderFooter = WithHeaderFooterTemplate.bind({});
WithHeaderFooter.args = {
  title: 'Address Details',
  subtitle: 'Saving addresses will improve your checkout experience',
  trailing: 'Badge',
  titleSuffix: 'Counter',
  showBackButton: false,
};

const WithDropdownSingleSelectTemplate: StoryFn<typeof BottomSheetComponent> = () => {
  return (
    <Dropdown selectionType="single">
      <SelectInput label="Sort Dishes" />
      <BottomSheetComponent>
        <BottomSheetHeader title="Sort By" />
        <BottomSheetBody>
          <ActionList>
            <ActionListItem
              leading={<ActionListItemIcon icon={CustomersIcon} />}
              title="Relevance (Default)"
              value="relavance"
            />
            <ActionListItem
              leading={<ActionListItemIcon icon={ClockIcon} />}
              title="Delivery Time"
              value="delveiry-time"
            />
            <ActionListItem
              leading={<ActionListItemIcon icon={ThumbsUpIcon} />}
              title="Rating"
              value="rating"
            />
            <ActionListItem
              leading={<ActionListItemIcon icon={TrendingUpIcon} />}
              title="Cost: Low to High"
              value="Cost: Low to High"
            />
            <ActionListItem
              leading={<ActionListItemIcon icon={TrendingDownIcon} />}
              title="Cost: High to Low"
              value="Cost: High to Low"
            />
          </ActionList>
        </BottomSheetBody>
      </BottomSheetComponent>
    </Dropdown>
  );
};

export const WithDropdownSingleSelect = WithDropdownSingleSelectTemplate.bind({});

const WithDropdownButtonTemplate: StoryFn<typeof BottomSheetComponent> = () => {
  const [status, setStatus] = React.useState<string | undefined>('approve');

  return (
    <Box minHeight="200px">
      <Dropdown>
        <DropdownButton variant="tertiary">Status: {status ?? ''}</DropdownButton>
        <BottomSheetComponent>
          <BottomSheetBody>
            <BottomSheetHeader />
            <ActionList>
              <ActionListItem
                onClick={({ name, value }) => {
                  console.log({ name, value });
                  setStatus(name);
                }}
                leading={<ActionListItemIcon icon={CheckIcon} />}
                isSelected={status === 'approve'}
                title="Approve"
                value="approve"
              />
              <ActionListItem
                onClick={({ name, value }) => {
                  console.log({ name, value });
                  setStatus(name);
                }}
                leading={<ActionListItemIcon icon={ClockIcon} />}
                isSelected={status === 'in-progress'}
                title="In Progress"
                value="in-progress"
              />

              <ActionListItem
                onClick={({ name, value }) => {
                  console.log({ name, value });
                  setStatus(name);
                }}
                leading={<ActionListItemIcon icon={CloseIcon} />}
                isSelected={status === 'reject'}
                title="Reject"
                value="reject"
                intent="negative"
              />
            </ActionList>
          </BottomSheetBody>
        </BottomSheetComponent>
      </Dropdown>
    </Box>
  );
};

export const WithDropdownButton = WithDropdownButtonTemplate.bind({});

const WithDropdownMultiSelectTemplate: StoryFn<typeof BottomSheetComponent> = () => {
  return (
    <Dropdown selectionType="multiple">
      <SelectInput label="Cuisines Filter" />
      <BottomSheetComponent>
        <BottomSheetHeader title="Filter By Cuisines" />
        <BottomSheetBody>
          <ActionList>
            <ActionListItem title="Chinese" value="Chinese" />
            <ActionListItem title="Italian" value="Italian" />
            <ActionListItem title="Mexican" value="Mexican" />
            <ActionListItem title="Indian" value="Indian" />
            <ActionListItem title="Thai" value="Thai" />
            <ActionListItem title="French" value="French" />
            <ActionListItem title="Japanese" value="Japanese" />
            <ActionListItem title="Spanish" value="Spanish" />
            <ActionListItem title="Middle Eastern" value="Middle Eastern" />
            <ActionListItem title="Korean" value="Korean" />
            <ActionListItem title="Greek" value="Greek" />
            <ActionListItem title="Vietnamese" value="Vietnamese" />
            <ActionListItem title="Brazilian" value="Brazilian" />
            <ActionListItem title="Moroccan" value="Moroccan" />
            <ActionListItem title="Caribbean" value="Caribbean" />
            <ActionListItem title="Turkish" value="Turkish" />
            <ActionListItem title="Lebanese" value="Lebanese" />
            <ActionListItem title="Malaysian" value="Malaysian" />
            <ActionListItem title="Indonesian" value="Indonesian" />
            <ActionListItem title="Peruvian" value="Peruvian" />
            <ActionListItem title="Ethiopian" value="Ethiopian" />
            <ActionListItem title="Filipino" value="Filipino" />
            <ActionListItem title="Cuban" value="Cuban" />
            <ActionListItem title="German" value="German" />
            <ActionListItem title="Nigerian" value="Nigerian" />
          </ActionList>
        </BottomSheetBody>
      </BottomSheetComponent>
    </Dropdown>
  );
};

export const WithDropdownMultiSelect = WithDropdownMultiSelectTemplate.bind({});

const WithDropdownSectionsTemplate: StoryFn<typeof BottomSheetComponent> = () => {
  return (
    <Dropdown selectionType="multiple">
      <SelectInput label="Cuisines Filter" />
      <BottomSheetComponent>
        <BottomSheetHeader title="Filter By Cuisines" />
        <BottomSheetBody>
          <ActionList>
            <ActionListSection title="Asia">
              <ActionListItem title="Chinese" value="Chinese" />
              <ActionListItem title="Indian" value="Indian" />
              <ActionListItem title="Thai" value="Thai" />
              <ActionListItem title="Japanese" value="Japanese" />
              <ActionListItem title="Korean" value="Korean" />
              <ActionListItem title="Vietnamese" value="Vietnamese" />
              <ActionListItem title="Malaysian" value="Malaysian" />
              <ActionListItem title="Indonesian" value="Indonesian" />
            </ActionListSection>

            <ActionListSection title="Europe">
              <ActionListItem title="Italian" value="Italian" />
              <ActionListItem title="French" value="French" />
              <ActionListItem title="Spanish" value="Spanish" />
              <ActionListItem title="Greek" value="Greek" />
              <ActionListItem title="German" value="German" />
            </ActionListSection>

            <ActionListSection title="North America">
              <ActionListItem title="Mexican" value="Mexican" />
              <ActionListItem title="Caribbean" value="Caribbean" />
            </ActionListSection>

            <ActionListSection title="South America">
              <ActionListItem title="Brazilian" value="Brazilian" />
              <ActionListItem title="Peruvian" value="Peruvian" />
            </ActionListSection>

            <ActionListSection title="Africa">
              <ActionListItem title="Middle Eastern" value="Middle Eastern" />
              <ActionListItem title="Moroccan" value="Moroccan" />
              <ActionListItem title="Ethiopian" value="Ethiopian" />
              <ActionListItem title="Nigerian" value="Nigerian" />
            </ActionListSection>
          </ActionList>
        </BottomSheetBody>
      </BottomSheetComponent>
    </Dropdown>
  );
};

export const WithDropdownSectionsSelect = WithDropdownSectionsTemplate.bind({});

const BottomSheetStackingTemplate: StoryFn<typeof BottomSheetComponent> = () => {
  const [isFirstOpen, setFirstOpen] = React.useState(false);
  const [isSecondOpen, setSecondOpen] = React.useState(false);
  const [isThirdOpen, setThirdOpen] = React.useState(false);

  return (
    <BaseBox>
      <Box display="flex" gap="spacing.2" flexWrap="wrap">
        <Button onClick={() => setFirstOpen(true)}>Open 1st BottomSheet</Button>
        <Button onClick={() => setSecondOpen(true)}>Open 2nd BottomSheet</Button>
        <Button onClick={() => setThirdOpen(true)}>Open 3rd BottomSheet</Button>
      </Box>

      <BottomSheetComponent
        isOpen={isFirstOpen}
        onDismiss={() => {
          setFirstOpen(false);
        }}
      >
        <BottomSheetHeader title="1. Saved Address" />
        <BottomSheetBody>
          <RadioGroup label="Addresses" marginBottom="spacing.4">
            <Radio value="home">Home - 11850 Florida 24, Cedar Key, Florida</Radio>
            <Radio value="office">Office - 2033 Florida 21, Cedar Key, Florida</Radio>
          </RadioGroup>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Button
            isFullWidth
            variant="tertiary"
            onClick={() => setSecondOpen(true)}
            isDisabled={isSecondOpen}
          >
            Open 2nd BottomSheet
          </Button>
          <Button
            isFullWidth
            marginTop="spacing.5"
            onClick={() => setThirdOpen(true)}
            isDisabled={isThirdOpen}
          >
            Open third BottomSheet
          </Button>
        </BottomSheetFooter>
      </BottomSheetComponent>

      <BottomSheetComponent isOpen={isSecondOpen} onDismiss={() => setSecondOpen(false)}>
        <BottomSheetHeader title="2. Sort By" />
        <BottomSheetBody>
          <ActionList>
            <ActionListItem title="Chinese" value="Chinese" />
            <ActionListItem title="Italian" value="Italian" />
            <ActionListItem title="Mexican" value="Mexican" />
            <ActionListItem title="Indian" value="Indian" />
            <ActionListItem title="Thai" value="Thai" />
            <ActionListItem title="French" value="French" />
            <ActionListItem title="Japanese" value="Japanese" />
            <ActionListItem title="Spanish" value="Spanish" />
            <ActionListItem title="Middle Eastern" value="Middle Eastern" />
            <ActionListItem title="Korean" value="Korean" />
            <ActionListItem title="Greek" value="Greek" />
            <ActionListItem title="Vietnamese" value="Vietnamese" />
            <ActionListItem title="Brazilian" value="Brazilian" />
            <ActionListItem title="Moroccan" value="Moroccan" />
            <ActionListItem title="Caribbean" value="Caribbean" />
            <ActionListItem title="Turkish" value="Turkish" />
            <ActionListItem title="Lebanese" value="Lebanese" />
            <ActionListItem title="Malaysian" value="Malaysian" />
            <ActionListItem title="Indonesian" value="Indonesian" />
            <ActionListItem title="Peruvian" value="Peruvian" />
            <ActionListItem title="Ethiopian" value="Ethiopian" />
            <ActionListItem title="Filipino" value="Filipino" />
            <ActionListItem title="Cuban" value="Cuban" />
            <ActionListItem title="German" value="German" />
            <ActionListItem title="Nigerian" value="Nigerian" />
          </ActionList>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Button
            isFullWidth
            variant="tertiary"
            onClick={() => setFirstOpen(true)}
            isDisabled={isFirstOpen}
          >
            Open 1st BottomSheet
          </Button>
          <Button
            isFullWidth
            marginTop="spacing.5"
            onClick={() => setThirdOpen(true)}
            isDisabled={isThirdOpen}
          >
            Open 3rd BottomSheet
          </Button>
        </BottomSheetFooter>
      </BottomSheetComponent>

      <BottomSheetComponent isOpen={isThirdOpen} onDismiss={() => setThirdOpen(false)}>
        <BottomSheetHeader title="3. Sort By" />
        <BottomSheetBody>
          <ActionList>
            <ActionListSection title="Asia">
              <ActionListItem title="Chinese" value="Chinese" />
              <ActionListItem title="Indian" value="Indian" />
              <ActionListItem title="Thai" value="Thai" />
              <ActionListItem title="Japanese" value="Japanese" />
              <ActionListItem title="Korean" value="Korean" />
              <ActionListItem title="Vietnamese" value="Vietnamese" />
              <ActionListItem title="Malaysian" value="Malaysian" />
              <ActionListItem title="Indonesian" value="Indonesian" />
            </ActionListSection>

            <ActionListSection title="Europe">
              <ActionListItem title="Italian" value="Italian" />
              <ActionListItem title="French" value="French" />
              <ActionListItem title="Spanish" value="Spanish" />
              <ActionListItem title="Greek" value="Greek" />
              <ActionListItem title="German" value="German" />
            </ActionListSection>

            <ActionListSection title="North America">
              <ActionListItem title="Mexican" value="Mexican" />
              <ActionListItem title="Caribbean" value="Caribbean" />
            </ActionListSection>

            <ActionListSection title="South America">
              <ActionListItem title="Brazilian" value="Brazilian" />
              <ActionListItem title="Peruvian" value="Peruvian" />
            </ActionListSection>

            <ActionListSection title="Africa">
              <ActionListItem title="Middle Eastern" value="Middle Eastern" />
              <ActionListItem title="Moroccan" value="Moroccan" />
              <ActionListItem title="Ethiopian" value="Ethiopian" />
              <ActionListItem title="Nigerian" value="Nigerian" />
            </ActionListSection>
          </ActionList>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Button
            isFullWidth
            variant="tertiary"
            onClick={() => setFirstOpen(true)}
            isDisabled={isFirstOpen}
          >
            Open 1st BottomSheet
          </Button>
          <Button
            isFullWidth
            marginTop="spacing.5"
            onClick={() => setSecondOpen(true)}
            isDisabled={isSecondOpen}
          >
            Open 2nd BottomSheet
          </Button>
        </BottomSheetFooter>
      </BottomSheetComponent>
    </BaseBox>
  );
};

export const BottomSheetStacking = BottomSheetStackingTemplate.bind({});

const InitialFocusTemplate: StoryFn<typeof BottomSheetComponent> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const initialFocusRef = React.useRef<HTMLButtonElement>(null);

  return (
    <BaseBox>
      <Button onClick={() => setIsOpen(true)}>Add address</Button>
      <BottomSheetComponent
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
        initialFocusRef={initialFocusRef}
      >
        <BottomSheetHeader title="Users" />
        <BottomSheetBody>
          <TextInput label="Search Users" ref={initialFocusRef} />
          <Button ref={initialFocusRef}>Search Users</Button>

          <Text marginTop="spacing.5">
            By default the initial focus is set to the close button, but you can modify it by
            passing the `initialFocusRef` prop
          </Text>

          <List marginTop="spacing.5">
            <ListItem>Anurag Hazra</ListItem>
            <ListItem>Kamlesh Chandnani</ListItem>
            <ListItem>Divyanshu Maithani</ListItem>
          </List>
        </BottomSheetBody>
      </BottomSheetComponent>
    </BaseBox>
  );
};

export const InitialFocus = InitialFocusTemplate.bind({});

const HeadingBanner = (): React.ReactElement => {
  if (isReactNative()) {
    return (
      <Box position="relative" height="250px" overflow="hidden">
        <Box
          position="absolute"
          top="spacing.0"
          left="spacing.0"
          width="100%"
          height="100%"
          backgroundColor="surface.background.cloud.subtle"
        />
        <Box position="absolute" bottom="spacing.4" left="spacing.5">
          <Heading color="surface.text.gray.normal">All-in-one Escrow management platform</Heading>
        </Box>
      </Box>
    );
  }

  return (
    <Box position="relative" height="250px" overflow="hidden">
      <Box position="absolute" top="-150px" left="spacing.0" width="100%">
        <video
          autoPlay
          style={{ objectFit: 'cover' }}
          width="100%"
          height="100%"
          src="https://cdn.razorpay.com/static/assets/razorpay.com/x/escrow-accounts/hero-illustration.mp4"
        />
      </Box>
      <Box position="absolute" bottom="spacing.4" left="spacing.5">
        <Heading color="surface.text.staticWhite.normal">
          All-in-one Escrow management platform
        </Heading>
      </Box>
    </Box>
  );
};

const ZeroPaddingTemplate: StoryFn<typeof BottomSheetComponent> = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <BaseBox>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <BottomSheetComponent
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
      >
        <BottomSheetHeader />
        <BottomSheetBody padding="spacing.0">
          <Box display="flex" flexDirection="column">
            <HeadingBanner />
            <Box padding="spacing.5" display="flex" flexDirection="column">
              <Text>
                We bring together Escrow account, Banks, Trusteeship services & Automation - all in
                ONE place to deliver a seamless user experience for you. Work with our experts to
                ensure your escrow money transfers are always compliant, safe & effortless.
              </Text>
              <Text marginTop="spacing.3" color="surface.text.gray.muted">
                100% secure | Instant payouts | Unbeatable pricing
              </Text>
            </Box>
          </Box>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Button isFullWidth>Talk To Our Escrow Experts</Button>
        </BottomSheetFooter>
      </BottomSheetComponent>
    </BaseBox>
  );
};

export const ZeroPadding = ZeroPaddingTemplate.bind({});

const SnapPointsTemplate: StoryFn<typeof BottomSheetComponent> = () => {
  const fruites = [
    'Apple',
    'Apricot',
    'Avocado',
    'Banana',
    'Blackberry',
    'Blueberry',
    'Cherry',
    'Coconut',
    'Cucumber',
    'Durian',
    'Dragonfruit',
    'Fig',
    'Gooseberry',
    'Grape',
    'Guava',
    'Jackfruit',
    'Plum',
    'Kiwifruit',
    'Kumquat',
    'Lemon',
    'Lime',
    'Mango',
    'Watermelon',
    'Mulberry',
    'Orange',
    'Papaya',
    'Passionfruit',
    'Peach',
    'Pear',
    'Persimmon',
    'Pineapple',
    'Pineberry',
    'Quince',
    'Raspberry',
    'Soursop',
    'Star fruit',
    'Strawberry',
    'Tamarind',
    'Yuzu',
  ];

  return (
    <BaseBox>
      <Box marginBottom="spacing.5">
        <Text marginBottom="spacing.4">Example of Custom SnapPoints at [50%, 80%, 100%]</Text>
        <Dropdown selectionType="multiple">
          <SelectInput label="Cuisines Filter" />
          <BottomSheetComponent snapPoints={[0.5, 0.8, 1]}>
            <BottomSheetHeader title="Fruits" />
            <BottomSheetBody>
              <ActionList>
                {fruites.map((fruit) => {
                  return <ActionListItem key={fruit} title={fruit} value={fruit} />;
                })}
              </ActionList>
            </BottomSheetBody>
          </BottomSheetComponent>
        </Dropdown>
      </Box>
      <Heading marginBottom="spacing.3">SnapPoint Behaviour</Heading>

      <Box display="flex" gap="spacing.2" flexWrap="wrap">
        <Text>By default BottomSheet's SnapPoints are</Text>
        <Text weight="semibold">[35%, 50%, 85%]</Text>
      </Box>

      <Text>
        Below is the behaviour BottomSheet follows to inteligently open the content at the optimal
        SnapPoint initially
      </Text>

      <Box marginTop="spacing.3">
        <Text weight="semibold">At SnapPoint 1: 35% Screen Height</Text>
        <List>
          <ListItem>
            If content height is less than 35% of screen height - then bottom sheet takes the height
            of the content.
          </ListItem>
          <ListItem>
            If content height is {'>'}35% screen height (and {'<'}50% of screen’s height) - then
            bottom sheet’s initial snap point should be 35%.
            <List>
              <ListItem>
                Bottom sheet will extend till the height of the content on upwards drag.
              </ListItem>
            </List>
          </ListItem>
        </List>

        <Text weight="semibold">At SnapPoint 2: 50% Screen Height</Text>
        <List>
          <ListItem>
            If content height {'>'}35% but {'<'}50% screen height - the bottom sheet extends till
            the height of the content.
          </ListItem>
          <ListItem>
            If content height {'>'}50% (but {'<'}85% screen height) then bottom sheet’s initial snap
            point should be at 50% screen height.
            <List>
              <ListItem>
                The bottom sheet extends till the height of the content on upwards drag.
              </ListItem>
            </List>
          </ListItem>
        </List>

        <Text weight="semibold">At SnapPoint 3: 85% Screen Height</Text>
        <List>
          <ListItem>
            If content height {'>'}50% but {'<'}85% screen height - the bottom sheet extends till
            the height of the content.
          </ListItem>
          <ListItem>Bottom Sheet’s height can extend maximum until 85% screen size.</ListItem>
          <ListItem>
            If content height {'>'}85% of screen height then bottom sheet’s initial snap point
            should be at 85% of screen height.
            <List>
              <ListItem>On further scroll or drag, contents scrolls internally.</ListItem>
            </List>
          </ListItem>
        </List>

        <Text>
          Checkout the{' '}
          <Link href="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=76785-1455819&t=eMQWVawMPyhCdtgv-1&scaling=min-zoom&page-id=25042%3A498654&mode=design">
            design guideline
          </Link>{' '}
          here for more details
        </Text>
      </Box>
    </BaseBox>
  );
};

export const CustomSnapPoints = SnapPointsTemplate.bind({});

const WithOTPInputTemplate: StoryFn<typeof BottomSheetComponent> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const submitOTP = React.useCallback(() => {
    setIsLoading(true);
    window.setTimeout(() => {
      setIsLoading(false);
      setIsOpen(false);
    }, 2000);
  }, []);

  return (
    <BaseBox>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <BottomSheetComponent
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
      >
        <BottomSheetHeader title="1. Saved Address" />
        <BottomSheetBody>
          <Box display="flex" flexDirection="column" alignItems="center">
            <OTPInput
              onOTPFilled={submitOTP}
              marginBottom="spacing.5"
              label="Enter the OTP sent to +9190909090"
            />
            <Text textAlign="center">
              By clicking “Submit OTP”, I agree to <Link href="#">Terms and Conditions</Link>,
              <Link href="#">Privacy Policy</Link>, and <Link href="#">Service Agreement</Link>.
            </Text>
          </Box>
        </BottomSheetBody>

        <BottomSheetFooter>
          <Button isFullWidth variant="tertiary">
            Cancel
          </Button>
          <Button isLoading={isLoading} onClick={submitOTP} isFullWidth marginTop="spacing.5">
            Submit
          </Button>
        </BottomSheetFooter>
      </BottomSheetComponent>
    </BaseBox>
  );
};

export const WithOTPInput = WithOTPInputTemplate.bind({});

type ValidationState = 'none' | 'success' | 'error';

interface Props {
  isOpen?: boolean;
  onDismiss: () => void;
  onCtaClick: (selectedPhoneNumber: string) => void;
  isCtaLoading?: boolean;
  phoneNumbers: Array<string>;
}

// Example by: https://github.com/razorpay/blade/issues/1777
const SimSelectionBottomSheet: React.FC<Props> = ({
  isOpen = false,
  onCtaClick,
  isCtaLoading = false,
  phoneNumbers = [],
  onDismiss,
}) => {
  const [isCtaDisabled, setIsCtaDisabled] = React.useState(true);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = React.useState<string | undefined>(
    undefined,
  );
  const [simSelectionError, setSimSelectionError] = React.useState<string | undefined>(undefined);

  // should be able to handle content changes inside bottomsheet
  const handleSimChange = ({ value }: { value: string }): void => {
    setSimSelectionError(undefined);
    setSelectedPhoneNumber(value);
    setIsCtaDisabled(false);
  };

  const handleCtaClick = (): void => {
    if (selectedPhoneNumber !== undefined && selectedPhoneNumber.length > 0) {
      setSimSelectionError(undefined);
      setIsCtaDisabled(false);
      onCtaClick(selectedPhoneNumber);
    } else {
      setSimSelectionError('Please select a SIM to verify mobile number');
      setIsCtaDisabled(true);
    }
  };

  const radioGroupValidationState: ValidationState = simSelectionError ? 'error' : 'none';
  return (
    <Box>
      <BottomSheetComponent isOpen={isOpen} onDismiss={onDismiss}>
        <BottomSheetHeader title="Select SIM" showBackButton onBackButtonClick={onDismiss} />
        <BottomSheetBody>
          <RadioGroup
            name="select-sim"
            label="Please select a SIM to verify your mobile number"
            value={selectedPhoneNumber}
            onChange={handleSimChange}
            size="medium"
            errorText={simSelectionError}
            validationState={radioGroupValidationState}
          >
            {phoneNumbers.map((number, index) => {
              return (
                <Radio value={number} key={`sim-${index}`}>
                  {number}
                </Radio>
              );
            })}
          </RadioGroup>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
            gap="spacing.4"
          >
            <Button
              icon={ArrowRightIcon}
              iconPosition="right"
              isLoading={isCtaLoading}
              isDisabled={isCtaDisabled}
              isFullWidth
              onClick={handleCtaClick}
            >
              Verify
            </Button>
            <Button
              onClick={() => {
                // should be able to close the bottom sheet
                onDismiss();
              }}
              variant="tertiary"
              isFullWidth
            >
              Close
            </Button>
          </Box>
        </BottomSheetFooter>
      </BottomSheetComponent>
    </Box>
  );
};

const ProductUseCase1Example: StoryFn<typeof BottomSheetComponent> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>{isOpen ? 'close' : 'open'}</Button>
      <SimSelectionBottomSheet
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
        phoneNumbers={['1234567890', '0987654321']}
        onCtaClick={(selectedPhoneNumber) => {
          console.log('selectedPhoneNumber', selectedPhoneNumber);
        }}
      />
    </>
  );
};

export const ProductUseCase1 = ProductUseCase1Example.bind({});
