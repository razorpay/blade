import type { Meta } from '@storybook/react';
import { Dropdown, DropdownOverlay } from './Dropdown';
import { SelectInput } from '~components/Input/SelectInput/SelectInput';
import {
  ActionList,
  ActionListFooter,
  ActionListFooterIcon,
  ActionListHeader,
  ActionListHeaderIcon,
  ActionListItem,
  ActionListItemIcon,
  ActionListItemText,
} from '~components/ActionList/ActionList';
import {
  DownloadIcon,
  HomeIcon,
  SettingsIcon,
  InfoIcon,
  ArrowRightIcon,
  HistoryIcon,
  SearchIcon,
} from '~components/Icons';
import { Button } from '~components/Button';

const DropdownStoryMeta: Meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  args: {},
};

export const WithSelect = (): JSX.Element => {
  return (
    <Dropdown>
      <SelectInput
        label="Select Action"
        name="action"
        onChange={({ name, values }) => {
          console.log(name, values);
        }}
      />
      <DropdownOverlay>
        <ActionList>
          <ActionListHeader
            title="Recent Searches"
            leading={<ActionListHeaderIcon icon={HistoryIcon} />}
          />
          <ActionListItem
            leading={<ActionListItemIcon icon={HomeIcon} />}
            trailing={<ActionListItemIcon icon={ArrowRightIcon} />}
            title="Home"
            value="home"
          />
          <ActionListItem
            leading={<ActionListItemIcon icon={SettingsIcon} />}
            trailing={<ActionListItemText>⌘ ⌥ Space</ActionListItemText>}
            title="Settings"
            value="settings"
          />
          <ActionListItem
            leading={<ActionListItemIcon icon={DownloadIcon} />}
            title="Download"
            value="download"
          />
          <ActionListItem
            leading={<ActionListItemIcon icon={InfoIcon} />}
            title="Info"
            value="info"
          />
          <ActionListFooter
            title="Search Tips"
            leading={<ActionListFooterIcon icon={SearchIcon} />}
            trailing={<Button onClick={console.log}>Apply</Button>}
          />
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};

export const WithMultiSelect = (): JSX.Element => {
  return (
    <Dropdown selectionType="multiple">
      <SelectInput
        label="Select your favorite fruit"
        name="fruits"
        onChange={({ name, values }) => {
          console.log(name, values);
        }}
      />
      <DropdownOverlay>
        <ActionList>
          <ActionListItem title="Mango" value="mango" />
          <ActionListItem title="Banana" value="banana" />
          <ActionListItem title="Orange" value="orange" />
          <ActionListItem title="Mingo" value="mingo" />
          <ActionListItem title="Watermelon" value="watermelon" />
          <ActionListItem title="Strawberry" value="strawberry" />
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};
export default DropdownStoryMeta;
