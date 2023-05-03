/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import type { BottomSheetProps } from './';
import {
  BottomSheetBody,
  BottomSheet_PRE_RELEASE as BottomSheetComponent,
  BottomSheetFooter,
  BottomSheetHeader,
} from './';

import {
  ClockIcon,
  HomeIcon,
  InfoIcon,
  PhoneIcon,
  RupeeIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
  UserIcon,
} from '~components/Icons';
import {
  ActionList,
  ActionListItem,
  ActionListItemIcon,
  ActionListSection,
} from '~components/ActionList';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { SelectInput } from '~components/Input/SelectInput';
import { Heading, Text } from '~components/Typography';
import { Badge } from '~components/Badge';
import { TextInput } from '~components/Input/TextInput';
import { Radio, RadioGroup } from '~components/Radio';

export default {
  title: 'Components/BottomSheet (Internal)',
  component: BottomSheetComponent,
} as Meta<BottomSheetProps>;

const BottomSheetStackingTemplate: ComponentStory<typeof BottomSheetComponent> = () => {
  const [isFirstOpen, setFirstOpen] = React.useState(false);
  const [isSecondOpen, setSecondOpen] = React.useState(false);
  const [isThirdOpen, setThirdOpen] = React.useState(false);

  return (
    <BaseBox>
      <Button onClick={() => setFirstOpen(true)}>1 Open short one first</Button>
      <Button onClick={() => setSecondOpen(true)}>2 Open large one first</Button>
      <Button onClick={() => setThirdOpen(true)}>3 Open third first</Button>

      <BottomSheetComponent
        isOpen={isFirstOpen}
        onDismiss={() => {
          setFirstOpen(false);
        }}
      >
        <BottomSheetHeader title="1. Saved Address" />
        <BottomSheetBody>
          <BaseBox padding="spacing.4">
            <RadioGroup label="Addresses">
              <Radio value="home">Home - 11850 Florida 24, Cedar Key, Florida</Radio>
              <Radio value="office">Office - 2033 Florida 21, Cedar Key, Florida</Radio>
            </RadioGroup>
          </BaseBox>
        </BottomSheetBody>

        <BottomSheetFooter
          trailing={{
            primary: {
              text: 'Open Large BottomSheet',
              onClick: () => setSecondOpen(true),
              isDisabled: isSecondOpen,
            },
            secondary: {
              text: 'Open third BottomSheet',
              onClick: () => setThirdOpen(true),
              isDisabled: isThirdOpen,
            },
          }}
        />
      </BottomSheetComponent>

      <BottomSheetComponent isOpen={isSecondOpen} onDismiss={() => setSecondOpen(false)}>
        <BottomSheetHeader
          title="2. Sort By"
          prefix={<ClockIcon color="surface.text.muted.lowContrast" size="large" />}
        />
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
        <BottomSheetFooter
          trailing={{
            primary: {
              text: 'Open Short BottomSheet',
              onClick: () => setFirstOpen(true),
              isDisabled: isFirstOpen,
            },
            secondary: {
              text: 'Open third BottomSheet',
              onClick: () => setThirdOpen(true),
              isDisabled: isThirdOpen,
            },
          }}
        />
      </BottomSheetComponent>

      <BottomSheetComponent isOpen={isThirdOpen} onDismiss={() => setThirdOpen(false)}>
        <BottomSheetHeader
          title="3. Sort By"
          prefix={<ClockIcon color="surface.text.muted.lowContrast" size="large" />}
        />
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
        <BottomSheetFooter
          trailing={{
            primary: {
              text: 'Open Short BottomSheet',
              onClick: () => setFirstOpen(true),
              isDisabled: isFirstOpen,
            },
            secondary: {
              text: 'Open Long BottomSheet',
              onClick: () => setSecondOpen(true),
              isDisabled: isSecondOpen,
            },
          }}
        />
      </BottomSheetComponent>

      <BaseBox>
        {new Array(100).fill(0).map((_, idx) => (
          <p key={idx}>{idx}</p>
        ))}
      </BaseBox>
    </BaseBox>
  );
};

export const BottomSheetStacking = BottomSheetStackingTemplate.bind({});

const BottomSheetTemplate: ComponentStory<typeof BottomSheetComponent> = ({ ...args }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <BaseBox>
      <Button onClick={() => setIsOpen(true)}>{isOpen ? 'close' : 'open'}</Button>
      <BottomSheetComponent
        {...args}
        isOpen={isOpen}
        onDismiss={() => {
          console.log('closed');
          setIsOpen(false);
        }}
      >
        <BottomSheetHeader
          title="Select Account & Update Details"
          subtitle="Header subtitle"
          prefix={<StarIcon color="surface.text.muted.lowContrast" size="large" />}
          suffix={<Badge variant="positive">label</Badge>}
        />
        <BottomSheetBody>
          <BaseBox display="flex" flexDirection="column" gap="spacing.5">
            <TextInput
              type="number"
              label="Edit your mobile number"
              helpText="Your registered mobile number will not get charged"
            />
            <Button isFullWidth onClick={() => setIsOpen(false)}>
              Continue
            </Button>
          </BaseBox>
        </BottomSheetBody>
      </BottomSheetComponent>
    </BaseBox>
  );
};

export const Default = BottomSheetTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Default.storyName = 'Default';

const SingleSelectContent = (): React.ReactElement => {
  return (
    <ActionList>
      <ActionListItem leading={<ActionListItemIcon icon={HomeIcon} />} title="Home" value="Home" />
      <ActionListItem
        leading={<ActionListItemIcon icon={SettingsIcon} />}
        title="Settings"
        value="settings"
      />
      <ActionListItem leading={<ActionListItemIcon icon={InfoIcon} />} title="Info" value="info" />
      <ActionListItem
        leading={<ActionListItemIcon icon={RupeeIcon} />}
        title="Price"
        value="Price"
      />
      <ActionListItem
        leading={<ActionListItemIcon icon={PhoneIcon} />}
        title="Contact"
        value="Contact"
      />
      <ActionListItem
        leading={<ActionListItemIcon icon={UserIcon} />}
        title="About"
        value="About"
      />
    </ActionList>
  );
};

const MultiSelectContent = (): React.ReactElement => {
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
    <ActionList>
      {fruites.map((fruit) => {
        return <ActionListItem key={fruit} title={fruit} value={fruit} />;
      })}
    </ActionList>
  );
};

const BottomSheetWithSelectTemplate: ComponentStory<typeof BottomSheetComponent> = () => {
  const isMobile = true;

  return (
    <BaseBox>
      <BaseBox marginBottom="spacing.5" marginTop="spacing.5">
        <Text>Single Select</Text>
      </BaseBox>

      <Dropdown selectionType="single">
        <SelectInput label="Single Select" />
        {isMobile ? (
          <BottomSheetComponent>
            <BottomSheetHeader
              title="Select Account"
              prefix={<ClockIcon color="surface.text.muted.lowContrast" size="large" />}
            />
            <BottomSheetBody>
              <SingleSelectContent />
            </BottomSheetBody>

            <BottomSheetFooter
              title="Footer Title"
              leading={<SearchIcon color="surface.text.muted.lowContrast" size="large" />}
              trailing={{
                // <- confirm if this BottomSheet Footer should be 2 buttons or anything else?
                primary: { text: 'Apply' },
                secondary: { text: 'Cancel' },
              }}
            />
          </BottomSheetComponent>
        ) : (
          <DropdownOverlay>
            <SingleSelectContent />
          </DropdownOverlay>
        )}
      </Dropdown>

      <BaseBox marginBottom="spacing.5" marginTop="spacing.5">
        <Text>Multi Select</Text>
      </BaseBox>

      <Dropdown selectionType="multiple">
        <SelectInput label="Multi Select" />
        {isMobile ? (
          <BottomSheetComponent>
            <BottomSheetHeader
              title="Select Account"
              prefix={<ClockIcon color="surface.text.muted.lowContrast" size="large" />}
            />
            <BottomSheetBody>
              <MultiSelectContent />
            </BottomSheetBody>
            <BottomSheetFooter
              title="Footer Title"
              leading={<SearchIcon color="surface.text.muted.lowContrast" size="large" />}
              trailing={{
                // <- confirm if this BottomSheet Footer should be 2 buttons or anything else?
                primary: { text: 'Apply' },
                secondary: { text: 'Cancel' },
              }}
            />
          </BottomSheetComponent>
        ) : (
          <DropdownOverlay>
            <MultiSelectContent />
          </DropdownOverlay>
        )}
      </Dropdown>
    </BaseBox>
  );
};

export const WithSelect = BottomSheetWithSelectTemplate.bind({});

// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
WithSelect.storyName = 'WithSelect';

const BottomSheetScrollingContentTemplate: ComponentStory<typeof BottomSheetComponent> = () => {
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
        <BottomSheetHeader title="1. Saved Address" />
        <BottomSheetBody>
          <BaseBox marginBottom="spacing.4">
            <RadioGroup label="Addresses">
              <Radio value="home">Home - 11850 Florida 24, Cedar Key, Florida</Radio>
              <Radio value="office">Office - 2033 Florida 21, Cedar Key, Florida</Radio>
            </RadioGroup>
          </BaseBox>

          <Heading>Lorem Ipsum</Heading>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent auctor tellus ut arcu
            porttitor, non ultrices libero accumsan. Proin eget leo sed neque tristique tincidunt.
            Sed vel ultrices leo, eu auctor magna. Vivamus a ligula interdum, auctor nibh quis,
            dapibus nisl. Donec efficitur sed ante ac molestie. Pellentesque pharetra, tortor eu
            vestibulum consectetur, diam ex condimentum enim, sit amet fringilla tellus neque ut
            risus. Maecenas magna lectus, feugiat vitae blandit eget, iaculis non lectus. Cras
            aliquet massa id augue vulputate, non lobortis massa aliquet. Nullam facilisis justo et
          </Text>
          <Heading>Lorem Ipsum</Heading>
          <Text>
            vestibulum sodales. Duis accumsan posuere lorem eget semper. Nam congue, mi sit amet
            ultrices interdum, quam orci fringilla elit, vitae malesuada lorem elit tristique elit.
            Aenean bibendum dui ex, sit amet elementum est elementum sit amet. Proin massa orci,
            tempus a rutrum ac, egestas sit amet tortor. Morbi dictum ultricies ex finibus blandit.
            Sed luctus quam nec eros convallis fringilla. Duis dignissim nulla neque, eu dapibus
            metus dignissim at. Nullam imperdiet augue ex, posuere fermentum lectus dapibus vitae.
            Nullam ultricies libero cursus turpis tincidunt egestas. Vestibulum interdum auctor
            massa laoreet sollicitudin. Nunc lobortis ullamcorper leo, a imperdiet purus ultricies
            volutpat. Aliquam erat volutpat. Donec tempus enim nec semper imperdiet. Nullam
            porttitor enim dui. Curabitur at orci lobortis, faucibus tellus id, malesuada leo.
            Curabitur fermentum massa a ligula feugiat hendrerit. Ut tincidunt arcu sed ultrices
            consectetur. Nulla suscipit tortor lacus, id accumsan libero sodales a. Suspendisse in
            congue massa, sit amet laoreet nisi. Suspendisse at libero eu tortor posuere sodales.
            Sed suscipit, diam vitae pharetra vestibulum, erat enim pulvinar tortor, ut consectetur
            sem nibh vitae arcu. Integer lorem leo, lacinia non congue ac, efficitur eu justo.
            Phasellus quis odio lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus.
          </Text>
          <Heading>Lorem Ipsum</Heading>
          <Text>
            Vestibulum ac purus non justo commodo tincidunt. Pellentesque hendrerit sollicitudin
            nunc, quis eleifend eros vulputate eu. Ut in nulla et velit rhoncus venenatis quis eu
            neque. Ut mattis massa risus. Praesent at erat non arcu rhoncus feugiat et eu enim.
            Etiam sodales nec turpis id placerat. Donec dignissim elit id fringilla faucibus.
            Suspendisse eu turpis at nulla iaculis tincidunt vitae ut sem. Nulla egestas nunc et
            lobortis aliquam. Integer nec metus at mauris vestibulum tristique vitae vitae risus.
            Mauris faucibus vitae eros id consectetur. Sed tincidunt egestas felis sit amet gravida.
            Donec tincidunt varius varius. Nunc lacinia orci et eros congue, a hendrerit nisi
            fermentum. Pellentesque vel ligula sit amet dolor ultrices vulputate. Donec arcu leo,
            interdum et dapibus eu, suscipit quis velit. Pellentesque porta nec quam non finibus.
            Suspendisse sed ex efficitur lectus mollis faucibus. Quisque viverra eget sapien non
            ultrices. Quisque eget rutrum lacus. Nulla porta viverra felis, non eleifend nisi
            convallis at. Pellentesque consectetur, neque laoreet venenatis molestie, metus velit
            feugiat purus, ut maximus dolor metus ut nisi. Suspendisse consequat enim at odio
            eleifend mattis.
          </Text>
        </BottomSheetBody>

        <BottomSheetFooter
          trailing={{
            primary: {
              text: 'Primary',
            },
          }}
        />
      </BottomSheetComponent>
    </BaseBox>
  );
};

export const WithScrollingContent = BottomSheetScrollingContentTemplate.bind({});
