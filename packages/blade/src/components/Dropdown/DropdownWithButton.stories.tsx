import { DropdownButton } from './DropdownButton';
import { Dropdown, DropdownOverlay } from '.';
import { ActionList, ActionListItem } from '~components/ActionList';

const DropdownStoryMeta = {
  title: 'Components/Dropdown/With Button',
  component: Dropdown,
  subcomponents: { DropdownButton },
  args: {},
};

export const Basic = (): JSX.Element => {
  return (
    <Dropdown>
      <DropdownButton>Show Dropdown</DropdownButton>
      <DropdownOverlay>
        <ActionList>
          <ActionListItem title="Settings" value="settings" />
          <ActionListItem
            onClick={() => {
              alert('Log Out Clicked');
            }}
            title="Log Out"
            value="logout"
          />
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};

export default DropdownStoryMeta;
