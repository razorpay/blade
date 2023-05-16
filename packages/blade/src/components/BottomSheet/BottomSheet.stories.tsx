/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import type { BottomSheetProps } from './';
import {
  BottomSheetBody,
  BottomSheet as BottomSheetComponent,
  BottomSheetFooter,
  BottomSheetHeader,
} from './';

import {
  ClockIcon,
  CustomersIcon,
  ThumbsUpIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from '~components/Icons';
import {
  ActionList,
  ActionListFooter,
  ActionListItem,
  ActionListItemIcon,
  ActionListSection,
} from '~components/ActionList';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Dropdown } from '~components/Dropdown';
import { SelectInput } from '~components/Input/SelectInput';
import { Text, Title } from '~components/Typography';
import { Badge } from '~components/Badge';
import { TextInput } from '~components/Input/TextInput';
import { Radio, RadioGroup } from '~components/Radio';
import { List, ListItem } from '~components/List';
import { Counter } from '~components/Counter';
import { Box } from '~components/Box';
import { Checkbox } from '~components/Checkbox';
import { OTPInput } from '~components/Input/OTPInput';
import { Link } from '~components/Link';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';

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
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?type=design&node-id=26477-578228&t=agFItKEmWAzA4N13-0',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?type=design&node-id=16767-706689&t=6FVL3Ha33gwM45Cm-0',
      }}
    >
      <Title>Usage</Title>
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

          function App(): JSX.Element {
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
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/BottomSheet',
  component: BottomSheetComponent,
  parameters: {
    docs: {
      page: () => <Page />,
    },
  },
} as Meta<BottomSheetProps>;

const BottomSheetTemplate: ComponentStory<typeof BottomSheetComponent> = ({ ...args }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <BaseBox>
      <Button onClick={() => setIsOpen(true)}>{isOpen ? 'close' : 'open'}</Button>
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

const WithHeaderFooterTemplate: ComponentStory<typeof BottomSheetComponent> = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <BaseBox>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <BottomSheetComponent isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
        <BottomSheetHeader
          title="Address Details"
          subtitle="Saving addresses will improve your checkout experience"
          trailing={<Badge variant="positive">Action Needed</Badge>}
          titleSuffix={<Counter intent="positive" value={2} />}
        />
        <BottomSheetBody>
          <RadioGroup label="Addresses">
            <Radio value="home">Home - 11850 Florida 24, Cedar Key, Florida</Radio>
            <Radio value="office-1">Office - 2033 Florida 21, Cedar Key, Florida</Radio>
            <Radio value="office-2">Work - 5938 New York, Main Street</Radio>
          </RadioGroup>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Button isFullWidth variant="secondary">
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

const WithDropdownSingleSelectTemplate: ComponentStory<typeof BottomSheetComponent> = () => {
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

const WithDropdownMultiSelectTemplate: ComponentStory<typeof BottomSheetComponent> = () => {
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

const WithDropdownSectionsTemplate: ComponentStory<typeof BottomSheetComponent> = () => {
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

const BottomSheetStackingTemplate: ComponentStory<typeof BottomSheetComponent> = () => {
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
            variant="secondary"
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
            <ActionListFooter />
          </ActionList>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Button
            isFullWidth
            variant="secondary"
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
            variant="secondary"
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

const InitialFocusTemplate: ComponentStory<typeof BottomSheetComponent> = () => {
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

const SnapPointsTemplate: ComponentStory<typeof BottomSheetComponent> = () => {
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
      <Text marginBottom="spacing.5">Custom SnapPoints at 50%, 80%, 100%</Text>
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
    </BaseBox>
  );
};

export const CustomSnapPoints = SnapPointsTemplate.bind({});

const WithOTPInputTemplate: ComponentStory<typeof BottomSheetComponent> = () => {
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
          <Button isFullWidth variant="secondary">
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
