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
  ActionListItemAsset,
  ActionListItem,
  ActionListItemIcon,
  ActionListSection,
} from '~components/ActionList';
import type { ActionListProps, ActionListItemProps } from '~components/ActionList';
import {
  DownloadIcon,
  SettingsIcon,
  InfoIcon,
  ArrowRightIcon,
  HistoryIcon,
  FileTextIcon,
} from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { SelectInput } from '~components/Input/SelectInput';
import type { SelectInputProps } from '~components/Input/SelectInput';
import { Button } from '~components/Button';
import { Alert } from '~components/Alert';
import { Code, Text } from '~components/Typography';
import { isReactNative } from '~utils';
import iconMap from '~components/Icons/iconMap';

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
      <Sandbox showConsole editorHeight={600}>
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
            ActionListSection,
            ActionListFooter,
            ActionListFooterIcon,
            HistoryIcon,
            HomeIcon,
            ArrowRightIcon,
            SettingsIcon,
            DownloadIcon,
            InfoIcon,
            FileTextIcon,
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
                  placeholder="Select Option"
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
                      title="Search Tips"
                      leading={<ActionListFooterIcon icon={FileTextIcon} />}
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

type AllDropdownProps = Partial<DropdownProps> &
  Partial<ActionListProps> &
  Partial<SelectInputProps> &
  Partial<ActionListItemProps> & {
    actionListItemIcon: string;
    actionListItemIsDisabled: boolean;
  };

const Playground = (_args: AllDropdownProps): JSX.Element => {
  return <BaseBox>{null}</BaseBox>;
};

type DefaultPropTypes = string | number | boolean | (() => void) | Record<string, string>;
type CategoryTypes = 'Dropdown' | 'ActionList' | 'SelectInput' | 'ActionListItem[0]';

type ArgsTable = Partial<
  Record<
    keyof AllDropdownProps | `${CategoryTypes}/${keyof AllDropdownProps}`,
    DefaultPropTypes[] | DefaultPropTypes
  >
>;

const getCategory = (key: string): string => {
  if (key.includes('/')) {
    return key.slice(0, key.indexOf('/'));
  }

  return 'SelectInput';
};

const argsTable: ArgsTable = {
  'Dropdown/selectionType': ['single', 'multiple'],
  'ActionList/surfaceLevel': [2, 3],
  'ActionListItem[0]/title': 'Home',
  'ActionListItem[0]/description': '',
  'ActionListItem[0]/value': 'home',
  'ActionListItem[0]/isDefaultSelected': false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  'ActionListItem[0]/onClick': () => {},
  'ActionListItem[0]/trailing': {},
  validationState: ['none', 'error', 'success'],
  label: 'Select Action',
  labelPosition: ['top', 'left'],
  helpText: '',
  errorText: 'Ops. What did you do human?',
  successText: 'Yay! Nice choice',
  autoFocus: true,
  name: 'action',
  isRequired: false,
  placeholder: 'Select Option',
  isDisabled: false,
  prefix: {},
  suffix: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onFocus: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onBlur: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: () => {},
};

const makeArgTypes = (argTable: ArgsTable): Meta['argTypes'] => {
  const argTableArray = Object.entries(argTable).map(([key, value]) => {
    const newKey = key.includes('/') ? key.slice(key.lastIndexOf('/') + 1) : key;

    const getControlType = (): string => {
      if (Array.isArray(value)) {
        return 'radio';
      }

      if (typeof value === 'boolean') {
        return 'boolean';
      }

      if (typeof value === 'string') {
        return 'text';
      }

      return 'object';
    };

    return [
      newKey,
      {
        name: newKey,
        control: { type: getControlType() },
        table: { category: getCategory(key) },
        options: Array.isArray(value) ? value : undefined,
        defaultValue: Array.isArray(value) ? value[0] : undefined,
      },
    ];
  });

  return Object.fromEntries(argTableArray);
};

const DropdownStoryMeta: Meta = {
  title: 'Components/Dropdown/With Select',
  component: Playground,
  subcomponents: { SelectInputReference: SelectInput },
  args: {
    selectionType: 'single',
    surfaceLevel: 2,
    label: 'Select Action',
    name: 'action',
    title: 'Home',
    value: 'home',
    actionListItemIcon: 'HomeIcon',
    placeholder: 'Select Option',
  } as AllDropdownProps,
  argTypes: {
    ...makeArgTypes(argsTable),
    actionListItemIsDisabled: {
      table: { category: 'ActionListItem[0]' },
      control: { type: 'boolean' },
    },
    actionListItemIcon: {
      table: { category: 'ActionListItem[0]' },
      control: { type: 'select' },
      description:
        'Usage should be as `<ActionListItem leading={<ActionListItemIcon icon={HomeIcon}>} />`',
      options: Object.keys(iconMap),
      mapping: iconMap,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as Record<keyof AllDropdownProps, any>,
  parameters: {
    docs: {
      page: () => <Page />,
    },
  },
};

const DropdownTemplate: ComponentStory<typeof Playground> = (args) => {
  const {
    selectionType,
    surfaceLevel,
    title = 'Home',
    description = '',
    value = 'home',
    isDefaultSelected,
    actionListItemIcon,
    actionListItemIsDisabled,
    ...selectInputArgs
  } = args;
  return (
    <BaseBox minHeight="200px">
      <Dropdown selectionType={selectionType}>
        <SelectInput
          label="Select Action"
          onChange={({ name, values }) => {
            console.log(name, values);
          }}
          {...selectInputArgs}
        />
        <DropdownOverlay>
          <ActionList surfaceLevel={surfaceLevel}>
            <ActionListItem
              // @ts-expect-error: for storybook we're typing icon as sting but its actually IconComponent
              leading={<ActionListItemIcon icon={actionListItemIcon} />}
              title={title}
              description={description}
              value={value}
              isDefaultSelected={isDefaultSelected}
              isDisabled={actionListItemIsDisabled}
            />
            <ActionListItem
              leading={<ActionListItemIcon icon={SettingsIcon} />}
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
    </BaseBox>
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

export const WithHeaderFooter = (args: AllDropdownProps): JSX.Element => {
  const {
    selectionType,
    surfaceLevel,
    title = '',
    description,
    value = '',
    actionListItemIcon,
    ...selectInputArgs
  } = args;
  return (
    <BaseBox minHeight="400px">
      <Dropdown selectionType={selectionType}>
        <SelectInput
          label="Select Action"
          onChange={({ name, values }) => {
            console.log(name, values);
          }}
          {...selectInputArgs}
        />
        <DropdownOverlay>
          <ActionList surfaceLevel={surfaceLevel}>
            <ActionListHeader
              title="Recent Searches"
              leading={<ActionListHeaderIcon icon={HistoryIcon} />}
            />
            <ActionListItem
              // @ts-expect-error: for storybook we're typing icon as sting but its actually IconComponent
              leading={<ActionListItemIcon icon={actionListItemIcon} />}
              trailing={<ActionListItemIcon icon={ArrowRightIcon} />}
              title={title}
              value={value}
              description={description}
            />
            <ActionListSection title="Options">
              <ActionListItem
                leading={<ActionListItemIcon icon={SettingsIcon} />}
                title="Settings"
                value="settings"
                isDisabled={true}
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
              title="Search Tips"
              leading={<ActionListFooterIcon icon={FileTextIcon} />}
              trailing={<Button onClick={console.log}>Apply</Button>}
            />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </BaseBox>
  );
};
WithHeaderFooter.args = {
  description: 'Home sweet home it is',
};

export const WithScrollbar = (args: AllDropdownProps): JSX.Element => {
  const {
    selectionType,
    surfaceLevel,
    title = '',
    description,
    value = '',
    actionListItemIcon,
    ...selectInputArgs
  } = args;
  return (
    <BaseBox minHeight="500px">
      <Dropdown selectionType={selectionType}>
        <SelectInput
          label="Select Action"
          onChange={({ name, values }) => {
            console.log(name, values);
          }}
          {...selectInputArgs}
        />
        <DropdownOverlay>
          <ActionList surfaceLevel={surfaceLevel}>
            <ActionListHeader
              title="Recent Searches"
              leading={<ActionListHeaderIcon icon={HistoryIcon} />}
            />
            <ActionListItem
              // @ts-expect-error: for storybook we're typing icon as sting but its actually IconComponent
              leading={<ActionListItemIcon icon={actionListItemIcon} />}
              trailing={<ActionListItemIcon icon={ArrowRightIcon} />}
              title={title}
              value={value}
              description={description}
            />
            <ActionListSection title="Options">
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
              leading={<ActionListItemAsset src="https://flagcdn.com/w20/in.png" alt="india" />}
              title="Pricing"
              value="pricing"
            />
            <ActionListSection title="Options">
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
            <ActionListSection title="Options">
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
              leading={<ActionListItemAsset src="https://flagcdn.com/w20/in.png" alt="india" />}
              title="Pricing"
              value="pricing"
            />
            <ActionListItem
              leading={<ActionListItemAsset src="https://flagcdn.com/w20/in.png" alt="india" />}
              title="Pricing"
              value="pricing"
            />
            <ActionListFooter
              title="Search Tips"
              leading={<ActionListFooterIcon icon={FileTextIcon} />}
              trailing={<Button onClick={console.log}>Apply</Button>}
            />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </BaseBox>
  );
};
WithScrollbar.args = {
  description: 'Home sweet home it is',
};

export const WithValueDisplay = (args: AllDropdownProps): JSX.Element => {
  const [dropdownValues, setDropdownValues] = React.useState<Record<string, string[]>>({});
  const {
    selectionType,
    surfaceLevel,
    title = '',
    description,
    value = '',
    actionListItemIcon,
    ...selectInputArgs
  } = args;

  return (
    <BaseBox minHeight="300px">
      <Text>Selected Values: {JSON.stringify(dropdownValues)}</Text>
      <BaseBox marginTop="spacing.5" />
      <Dropdown selectionType={selectionType}>
        <SelectInput
          label="Select Action"
          onChange={({ name, values }) => {
            if (name) {
              setDropdownValues({ [name]: values });
            }
          }}
          {...selectInputArgs}
        />
        <DropdownOverlay>
          <ActionList surfaceLevel={surfaceLevel}>
            <ActionListItem
              // @ts-expect-error: for storybook we're typing icon as sting but its actually IconComponent
              leading={<ActionListItemIcon icon={actionListItemIcon} />}
              trailing={<ActionListItemIcon icon={ArrowRightIcon} />}
              title={title}
              value={value}
              description={description}
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
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </BaseBox>
  );
};
WithValueDisplay.args = {
  selectionType: 'multiple',
  description: 'Home sweet home it is',
};

export const WithHTMLFormSubmission = (args: AllDropdownProps): JSX.Element => {
  const [submissionValues, setSubmissionValues] = React.useState('');
  const {
    selectionType,
    surfaceLevel,
    title = '',
    description,
    value = '',
    actionListItemIcon,
    ...selectInputArgs
  } = args;

  if (isReactNative()) {
    return <Text>Not available on React Native Story</Text>;
  }
  return (
    <BaseBox minHeight="200px">
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
        <Dropdown selectionType={selectionType}>
          <SelectInput label="Design Systems" {...selectInputArgs} />
          <DropdownOverlay>
            <ActionList surfaceLevel={surfaceLevel}>
              <ActionListItem title={title} value={value} />
              <ActionListItem title="Primer" value="primer" />
              <ActionListItem title="MUI" value="mui" isDisabled />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
        <BaseBox marginBottom="spacing.8" />
        <Button type="submit">Submit</Button>
        <BaseBox marginBottom="spacing.4" />
        <Text>Form Submitted with {submissionValues}</Text>
      </form>
    </BaseBox>
  );
};
WithHTMLFormSubmission.args = {
  title: 'Blade',
  value: 'blade',
  isRequired: true,
  label: 'Design Systems',
  name: 'design-system',
  placeholder: 'Select Design System',
};

const SpaceBetweenSmall = (): JSX.Element => <BaseBox height="18px" />;

export const WithValidationState = (args: AllDropdownProps): JSX.Element => {
  const [validationState, setValidationState] = React.useState<SelectInputProps['validationState']>(
    'none',
  );
  const {
    selectionType,
    surfaceLevel,
    title = '',
    description,
    value = '',
    actionListItemIcon,
    ...selectInputArgs
  } = args;

  return (
    <BaseBox minHeight="300px" paddingBottom="spacing.5">
      <Alert
        intent="information"
        description="Select more than 2 options to see error state"
        isFullWidth
        isDismissible={false}
      />
      <SpaceBetweenSmall />
      <Dropdown selectionType={selectionType}>
        <SelectInput
          label="Top 2 design systems"
          {...selectInputArgs}
          validationState={validationState}
          onChange={({ values }) => {
            if (values.length === 2) {
              setValidationState('success');
            } else if (values.length > 2) {
              setValidationState('error');
            } else {
              setValidationState('none');
            }
          }}
        />
        <DropdownOverlay>
          <ActionList surfaceLevel={surfaceLevel}>
            <ActionListItem title={title} value={value} />
            <ActionListItem title="Primer" value="primer" />
            <ActionListItem title="Geist" description="by Vercel" value="geist" />
            <ActionListItem title="Airbnb Design" value="airbnb" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </BaseBox>
  );
};
WithValidationState.args = {
  selectionType: 'multiple',
  title: 'Blade',
  value: 'blade',
  isRequired: true,
  errorText: 'You selected more than 2 options',
  successText: 'Yay! Nice choice',
  helpText: 'Select only two',
  label: 'Top 2 design systems',
  name: 'design-systems',
  placeholder: 'Select Multiple Options',
};

export const WithRefUsage = (args: AllDropdownProps): JSX.Element => {
  const selectRef = React.useRef<HTMLElement>(null);
  const {
    selectionType,
    surfaceLevel,
    title = '',
    description,
    value = '',
    actionListItemIcon,
    ...selectInputArgs
  } = args;

  return (
    <BaseBox minHeight="300px">
      <Dropdown selectionType={selectionType}>
        <SelectInput ref={selectRef} label="Top 2 design systems" {...selectInputArgs} />
        <DropdownOverlay>
          <ActionList surfaceLevel={surfaceLevel}>
            <ActionListItem title={title} value={value} />
            <ActionListItem title="Primer" value="primer" />
            <ActionListItem title="Geist" description="by Vercel" value="geist" />
            <ActionListItem title="Airbnb Design" value="airbnb" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
      <BaseBox paddingTop="spacing.3">
        <Button
          onClick={() => {
            selectRef.current?.focus();
          }}
        >
          Click to focus
        </Button>
      </BaseBox>
      <BaseBox paddingTop="spacing.3">
        <Text>
          We are using <Code>selectRef.current.focus()</Code> here to focus on input
        </Text>
      </BaseBox>
    </BaseBox>
  );
};

WithRefUsage.args = {
  selectionType: 'single',
  label: 'Top 2 design systems',
  name: 'design-system',
};

export const WithMultipleDropdowns = (args: AllDropdownProps): JSX.Element => {
  const {
    selectionType,
    surfaceLevel,
    title = '',
    description,
    value = '',
    actionListItemIcon,
    ...selectInputArgs
  } = args;

  return (
    <BaseBox display="flex" flexDirection="row" minHeight="300px" gap="spacing.2">
      <BaseBox flex={1}>
        <Dropdown selectionType={selectionType}>
          <SelectInput label="Top 2 design systems" {...selectInputArgs} />
          <DropdownOverlay>
            <ActionList surfaceLevel={surfaceLevel}>
              <ActionListItem title={title} value={value} />
              <ActionListItem title="Primer" value="primer" />
              <ActionListItem title="Geist" description="by Vercel" value="geist" />
              <ActionListItem title="Airbnb Design" value="airbnb" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </BaseBox>
      <BaseBox flex={1}>
        <Dropdown selectionType={selectionType}>
          <SelectInput {...selectInputArgs} label="Top 2 Languages" />
          <DropdownOverlay>
            <ActionList surfaceLevel={surfaceLevel}>
              <ActionListItem title="HTML" value="html" />
              <ActionListItem title="CSS" value="css" />
              <ActionListItem title="JavaScript" value="javascript" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </BaseBox>
    </BaseBox>
  );
};

WithMultipleDropdowns.args = {
  selectionType: 'single',
  label: 'Top 2 design systems',
  name: 'design-system',
};

export default DropdownStoryMeta;
