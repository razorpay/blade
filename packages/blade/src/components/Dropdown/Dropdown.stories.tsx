import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import { Dropdown, DropdownOverlay } from '.';
import type { DropdownProps } from '.';
import {
  ActionList,
  ActionListFooter,
  ActionListFooterIcon,
  ActionListHeader,
  ActionListHeaderIcon,
  ActionListItem,
  ActionListItemIcon,
  ActionListItemText,
  ActionListSection,
} from '~components/ActionList';
import {
  DownloadIcon,
  HomeIcon,
  SettingsIcon,
  InfoIcon,
  ArrowRightIcon,
  HistoryIcon,
  SearchIcon,
} from '~components/Icons';

import Box from '~components/Box';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { SelectInput } from '~components/Input/SelectInput';
import { Button } from '~components/Button';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="Dropdown component is generic component that controls the dropdown functionality. It can be used with multiple triggers and mostly contains ActionList component inside it"
      componentName="Dropdown"
      imports={`
      import { 
        Dropdown, 
        DropdownOverlay,
        SelectInput,
        ActionList,
        ActionListHeader,
        ActionListHeaderIcon,
        ActionListItem,
        ActionListItemIcon,
        ActionListItemText,
        ActionListSection,
        ActionListFooter,
        ActionListFooterIcon,
      } from '@razorpay/blade/components';
      
      import type {
        DropdownProps,
        SelectInputProps,
        ActionListProps
      } from '@razorpay/blade/components';
      `}
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=21342%3A380662&t=J5jLUzTZrBQ1FLDq-0',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=13175%3A368930&t=MlqqfKTt89tIgEr3-0',
      }}
    >
      <Title>Usage</Title>
      <Sandbox editorHeight={600}>
        {`
          import { 
            Dropdown, 
            DropdownOverlay,
            SelectInput,
            ActionList,
            ActionListHeader,
            ActionListHeaderIcon,
            ActionListItem,
            ActionListItemIcon,
            ActionListItemText,
            ActionListSection,
            ActionListFooter,
            ActionListFooterIcon,
            HistoryIcon,
            HomeIcon,
            ArrowRightIcon,
            SettingsIcon,
            DownloadIcon,
            InfoIcon,
            SearchIcon,
            Button
          } from '@razorpay/blade/components';

          function App(): JSX.Element {
            return (
              <Dropdown 
                // Uncomment next line to make it multiselectable
                // selectionType="multiple"
              >
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
                      description="Home sweet home it is"
                    />
                    <ActionListSection title="Options">
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
                    </ActionListSection>
                    <ActionListFooter
                      title="Search"
                      leading={<ActionListFooterIcon icon={SearchIcon} />}
                      trailing={<Button onClick={console.log}>Apply</Button>}
                    />
                  </ActionList>
                </DropdownOverlay>
              </Dropdown>
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const DropdownStoryMeta: Meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  args: {
    selectionType: 'single',
  } as DropdownProps,
  argTypes: {
    selectionType: {
      name: 'selectionType',
      control: { type: 'radio' },
      options: ['single', 'multiple'],
      description: 'decides whether to render multiselect dropdown or single select dropdown',
      defaultValue: '"single"',
    },
  },
  parameters: {
    docs: {
      page: () => <Page />,
    },
  },
};

const DropdownTemplate: ComponentStory<typeof Dropdown> = (args) => {
  return (
    <Box minHeight={200}>
      <Dropdown {...args}>
        <SelectInput
          label="Select Action"
          name="action"
          onChange={({ name, values }) => {
            console.log(name, values);
          }}
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem
              leading={<ActionListItemIcon icon={HomeIcon} />}
              title="Home"
              value="home"
            />
            <ActionListItem
              leading={<ActionListItemIcon icon={SettingsIcon} />}
              trailing={<ActionListItemText>⌘ + S</ActionListItemText>}
              title="Settings"
              value="settings"
            />
            <ActionListItem
              leading={<ActionListItemIcon icon={InfoIcon} />}
              title="Info"
              value="info"
            />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

const WithHeaderFooter = (): JSX.Element => (
  <Box minHeight={400}>
    <Dropdown selectionType="multiple">
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
            description="Home sweet home it is"
          />
          <ActionListSection title="Options">
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
          </ActionListSection>
          <ActionListItem
            leading={<ActionListItemIcon icon={InfoIcon} />}
            title="Info"
            value="info"
          />
          <ActionListFooter
            title="Search"
            leading={<ActionListFooterIcon icon={SearchIcon} />}
            trailing={<Button onClick={console.log}>Apply</Button>}
          />
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  </Box>
);

const WithSingleSelect = DropdownTemplate.bind({});
const WithMultiSelect = DropdownTemplate.bind({});
WithMultiSelect.args = {
  selectionType: 'multiple',
};
WithMultiSelect.parameters = {
  docs: {
    description: {
      story:
        'Add `selectionType="multiple"` to `<Dropdown />` component to make it multi-selectable',
    },
  },
};
export default DropdownStoryMeta;

export { WithSingleSelect, WithMultiSelect, WithHeaderFooter };
