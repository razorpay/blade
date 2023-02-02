import React from 'react';
import type { ReactElement } from 'react';
import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import { Dropdown, DropdownOverlay } from '.';
import type { DropdownProps } from '.';
import {
  ActionList,
  ActionListFooter,
  ActionListFooterIcon,
  ActionListHeader,
  ActionListHeaderIcon,
  ActionListItem,
  ActionListItemAsset,
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
import { Text } from '~components/Typography';
import { isReactNative } from '~utils';

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
        ActionListItemAsset,
        ActionListItemIcon,
        ActionListItemText,
        ActionListSection,
        ActionListFooter,
        ActionListFooterIcon,
      } from '@razorpay/blade/components';
      
      import type {
        DropdownProps,
        SelectInputProps,
        ActionListProps,
        // ... and more
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
                      trailing={
                        <Button onClick={() => {
                          console.log('Apply button clicked')
                        }}>
                          Apply
                        </Button>
                      }
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
  title: 'Components/Dropdown/With Select',
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

export const WithSingleSelect = DropdownTemplate.bind({});
export const WithMultiSelect = DropdownTemplate.bind({});
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

export const WithHeaderFooter = (): JSX.Element => (
  <Box minHeight={400}>
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
            leading={<ActionListItemAsset src="https://flagcdn.com/w20/in.png" alt="india" />}
            title="Pricing"
            value="pricing"
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

export const WithValueDisplay = (): JSX.Element => {
  const [dropdownValues, setDropdownValues] = React.useState('');

  return (
    <Box minHeight={300}>
      <Text>Selected Values: {dropdownValues}</Text>
      <Box marginTop="spacing.5" />
      <Dropdown selectionType="multiple">
        <SelectInput
          label="Select Action"
          name="action"
          onChange={({ values }) => {
            setDropdownValues(values.join(', '));
          }}
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem
              leading={<ActionListItemIcon icon={HomeIcon} />}
              trailing={<ActionListItemIcon icon={ArrowRightIcon} />}
              title="Home"
              value="home"
              description="Home sweet home it is"
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
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export const WithHTMLFormSubmission = (): JSX.Element => {
  const [submissionValues, setSubmissionValues] = React.useState('');

  if (isReactNative()) {
    return <Text>Not available on React Native Story</Text>;
  }
  return (
    <Box minHeight={200}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const formData: Record<string, string> = {};
          for (const [name, value] of data) {
            formData[name] = String(value);
          }
          setSubmissionValues(JSON.stringify(formData));
        }}
      >
        <Dropdown>
          <SelectInput label="Design Systems" name="design-systems" isRequired />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Blade" value="blade" />
              <ActionListItem title="Primer" value="primer" />
              <ActionListItem title="MUI" value="mui" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
        <Box marginBottom="spacing.8" />
        <Button type="submit">Submit</Button>
        <Box marginBottom="spacing.4" />
        <Text>Form Submitted with {submissionValues}</Text>
      </form>
    </Box>
  );
};

export default DropdownStoryMeta;
