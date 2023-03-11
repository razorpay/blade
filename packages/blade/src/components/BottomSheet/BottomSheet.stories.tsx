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

export default {
  title: 'Components/BottomSheet',
  component: BottomSheetComponent,
} as Meta<BottomSheetProps>;

const BottomSheetTemplate: ComponentStory<typeof BottomSheetComponent> = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <BaseBox>
      <Button
        onClick={() => {
          setOpen((prev) => {
            return !prev;
          });
        }}
      >
        {open ? 'Open yes' : 'Open noe'}
      </Button>
      <BottomSheetComponent isOpen={open} onDismiss={() => setOpen(false)}>
        <BottomSheetHeader
          title="Select Account"
          leading={<ClockIcon color="surface.text.muted.lowContrast" size="large" />}
          trailing={<ClockIcon color="surface.text.muted.lowContrast" size="large" />}
        />
        <BottomSheetBody>
          <ActionList>
            <ActionListSection title="Section Heading">
              <ActionListItem
                leading={<ActionListItemIcon icon={UserIcon} />}
                trailing={<ActionListItemIcon icon={ArrowRightIcon} />}
                title="View Profile"
                value="view-profile"
              />
              <ActionListItem
                leading={<ActionListItemIcon icon={SettingsIcon} />}
                title="Settings"
                value="settings"
              />
              <ActionListItem
                leading={<ActionListItemIcon icon={DownloadIcon} />}
                title="Download"
                value="download"
              />
            </ActionListSection>
            <ActionListItem
              intent="negative"
              leading={<ActionListItemIcon icon={LogOutIcon} />}
              title="Sign Out"
              value="sign-out"
            />

            <ActionListItem
              intent="negative"
              leading={<ActionListItemIcon icon={LogOutIcon} />}
              title="Sign Out"
              value="sign-out"
            />
            <ActionListItem
              intent="negative"
              leading={<ActionListItemIcon icon={LogOutIcon} />}
              title="Sign Out"
              value="sign-out"
            />
            <ActionListItem
              intent="negative"
              leading={<ActionListItemIcon icon={LogOutIcon} />}
              title="Sign Out"
              value="sign-out"
            />
            <ActionListItem
              intent="negative"
              leading={<ActionListItemIcon icon={LogOutIcon} />}
              title="Sign Out"
              value="sign-out"
            />
            <ActionListItem
              intent="negative"
              leading={<ActionListItemIcon icon={LogOutIcon} />}
              title="Sign Out"
              value="sign-out"
            />
            <ActionListItem
              intent="negative"
              leading={<ActionListItemIcon icon={LogOutIcon} />}
              title="Sign Out"
              value="sign-out"
            />
            <ActionListItem
              intent="negative"
              leading={<ActionListItemIcon icon={LogOutIcon} />}
              title="Sign Out"
              value="sign-out"
            />

            <ActionListItem
              intent="negative"
              leading={<ActionListItemIcon icon={LogOutIcon} />}
              title="Sign Out"
              value="sign-out"
            />
            <ActionListItem
              intent="negative"
              leading={<ActionListItemIcon icon={LogOutIcon} />}
              title="Sign Out"
              value="sign-out"
            />
            <ActionListItem
              intent="negative"
              leading={<ActionListItemIcon icon={LogOutIcon} />}
              title="Sign Out"
              value="sign-out"
            />
            <ActionListItem
              intent="negative"
              leading={<ActionListItemIcon icon={LogOutIcon} />}
              title="Sign Out"
              value="sign-out"
            />
            <ActionListItem
              intent="negative"
              leading={<ActionListItemIcon icon={LogOutIcon} />}
              title="Sign Out"
              value="sign-out"
            />
            <ActionListItem
              intent="negative"
              leading={<ActionListItemIcon icon={LogOutIcon} />}
              title="Sign Out"
              value="sign-out"
            />
            <ActionListItem
              intent="negative"
              leading={<ActionListItemIcon icon={LogOutIcon} />}
              title="Sign Out"
              value="sign-out"
            />
            <ActionListItem
              intent="negative"
              leading={<ActionListItemIcon icon={LogOutIcon} />}
              title="Sign Out"
              value="sign-out"
            />
            <ActionListItem
              intent="negative"
              leading={<ActionListItemIcon icon={LogOutIcon} />}
              title="Sign Out"
              value="sign-out"
            />
            <ActionListItem
              leading={<ActionListItemIcon icon={LogOutIcon} />}
              title="Done"
              value="done"
            />
          </ActionList>
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
  // const sheet = React.useRef<any>();
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
              title="Single Select"
              leading={<ClockIcon color="surface.text.muted.lowContrast" size="large" />}
              trailing={<ClockIcon color="surface.text.muted.lowContrast" size="large" />}
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
              title="Multi Select"
              leading={<ClockIcon color="surface.text.muted.lowContrast" size="large" />}
              trailing={<ClockIcon color="surface.text.muted.lowContrast" size="large" />}
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
