/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import type { BottomSheetProps } from './BottomSheet';
import { BottomSheetBody, BottomSheet as BottomSheetComponent } from './BottomSheet';

import { BottomSheetFooter } from './BottomSheetFooter';
import { BottomSheetHeader } from './BottomSheetHeader';
import {
  ArrowRightIcon,
  ClockIcon,
  DownloadIcon,
  HomeIcon,
  InfoIcon,
  LogOutIcon,
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
import { Text } from '~components/Typography';
import { Badge } from '~components/Badge';
import { TextInput } from '~components/Input/TextInput';
import { Radio, RadioGroup } from '~components/Radio';

export default {
  title: 'Components/BottomSheet',
  component: BottomSheetComponent,
} as Meta<BottomSheetProps>;

const BottomSheetStackingTemplate: ComponentStory<typeof BottomSheetComponent> = ({ ...args }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSecondOpen, setSecondOpen] = React.useState(false);
  const [isThirdOpen, setThirdOpen] = React.useState(false);

  return (
    <BaseBox>
      <Button onClick={() => setIsOpen(true)}>Open short one first</Button>
      <Button onClick={() => setSecondOpen(true)}>Open large one first</Button>
      <Button onClick={() => setThirdOpen(true)}>Open third first</Button>

      <BottomSheetComponent
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
      >
        <BottomSheetHeader title="Saved Address" />
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
            primary: { text: 'Open Large BottomSheet', onClick: () => setSecondOpen(true) },
            secondary: { text: 'Open third BottomSheet', onClick: () => setThirdOpen(true) },
          }}
        />
      </BottomSheetComponent>

      <BottomSheetComponent isOpen={isSecondOpen} onDismiss={() => setSecondOpen(false)}>
        <BottomSheetHeader
          title="Sort By"
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
            primary: { text: 'Open Short BottomSheet', onClick: () => setIsOpen(true) },
            secondary: { text: 'Open third BottomSheet', onClick: () => setThirdOpen(true) },
          }}
        />
      </BottomSheetComponent>

      <BottomSheetComponent isOpen={isThirdOpen} onDismiss={() => setThirdOpen(false)}>
        <BottomSheetHeader
          title="Sort By"
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
            primary: { text: 'Open Short BottomSheet', onClick: () => setIsOpen(true) },
            secondary: { text: 'Open Long BottomSheet', onClick: () => setSecondOpen(true) },
          }}
        />
      </BottomSheetComponent>
    </BaseBox>
  );
};

export const BottomSheetStacking = BottomSheetStackingTemplate.bind({});

const BottomSheetTemplate: ComponentStory<typeof BottomSheetComponent> = ({ ...args }) => {
  const [isOpen, setIsOpen] = React.useState(true);

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

const BottomSheetWithSelectTemplate: ComponentStory<typeof BottomSheetComponent> = ({
  ...args
}) => {
  const isMobile = true;

  return (
    <BaseBox>
      <BaseBox marginBottom="spacing.5" marginTop="spacing.5">
        <Text>Single Select</Text>
      </BaseBox>

      <Dropdown selectionType="single">
        <SelectInput label="Single Select" />
        {isMobile ? (
          <BottomSheetComponent {...args}>
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
          <BottomSheetComponent {...args}>
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
