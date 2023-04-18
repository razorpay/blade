/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import type { BottomSheetProps } from './types';
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

export default {
  title: 'Components/BottomSheet',
  component: BottomSheetComponent,
} as Meta<BottomSheetProps>;

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
  console.log(fruites.length);

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

export const AOnlyActionList = (): React.ReactElement => {
  return (
    <Dropdown selectionType="multiple">
      <SelectInput
        label="Select Action"
        onChange={({ name, values }) => {
          console.log(name, values);
        }}
      />
      <DropdownOverlay>
        <MultiSelectContent />
      </DropdownOverlay>
    </Dropdown>
  );
};
AOnlyActionList.storyName = 'AOnlyActionList';
