import type { DropdownProps } from '../Dropdown';

const Playground = `
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
              title="Footer Tips"
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
`;

const getSimpleSelectCode = (selectionType: DropdownProps['selectionType']): string => `
  import { 
    Dropdown, 
    DropdownOverlay,
    SelectInput,
    ActionList,
    ActionListItem,
  } from '@razorpay/blade/components';

  function App(): JSX.Element {
    return (
      <Dropdown 
        selectionType="${selectionType}"
      >
        <SelectInput
          label="City"
          placeholder="Select your City"
          name="action"
          onChange={({ name, values }) => {
            console.log({ name, values });
          }}
        />
        <DropdownOverlay>
          <ActionList>
            <ActionListItem title="Mumbai" value="mumbai" />
            <ActionListItem title="Pune" value="pune" />
            <ActionListItem title="Bangalore" value="bangalore" />
            <ActionListItem title="Mysore" value="mysore" />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    )
  }

  export default App;
`;

const WithHeaderFooterScroll = `
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
      <Dropdown>
        <SelectInput
          label="Select Action"
          onChange={({ name, values }) => {
            console.log({ name, values });
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
              description="This is Home"
              value="home"
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
              title="Footer Tips"
              leading={<ActionListFooterIcon icon={FileTextIcon} />}
              trailing={<Button onClick={console.log}>Apply</Button>}
            />
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    )
  }

  export default App;
`;

const WithValueDisplayStory = `
  import React from 'react';
  import { 
    Dropdown, 
    DropdownOverlay,
    SelectInput,
    ActionList,
    ActionListItem,
    Badge,
    Box,
  } from '@razorpay/blade/components';

  function App(): JSX.Element {
    const [currentSelections, setCurrentSelections] = React.useState([]);
    
    console.log({currentSelections});

    return (
      <>
        <Box paddingY="spacing.4" display="flex" gap="spacing.4">
          {
            currentSelections.map((currentSelection) => 
              // @todo for blade team: Remove this check once onChange triggers fix goes to production
              currentSelection ? <Badge key={currentSelection}>{currentSelection}</Badge> : null
            )
          }
        </Box>
        <Dropdown 
          selectionType="multiple"
        >
          <SelectInput
            label="City"
            placeholder="Select your City"
            name="action"
            onChange={({ name, values }) => {
              setCurrentSelections(values)
            }}
          />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Mumbai" value="mumbai" />
              <ActionListItem title="Pune" value="pune" />
              <ActionListItem title="Bangalore" value="bangalore" />
              <ActionListItem title="Mysore" value="mysore" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </>
    )
  }

  export default App;
`;

const WithHTMLFormSubmissionStory = `
  import React from 'react';
  import { 
    Dropdown, 
    DropdownOverlay,
    SelectInput,
    ActionList,
    ActionListItem,
    Button,
    Text,
  } from '@razorpay/blade/components';

  function App(): JSX.Element {
    const [submissionValues, setSubmissionValues] = React.useState('');
    
    return (
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
        <Dropdown 
          selectionType="multiple"
        >
          <SelectInput
            label="Cities"
            placeholder="Select Cities"
            name="cities"
          />
          <DropdownOverlay>
            <ActionList>
              <ActionListItem title="Mumbai" value="mumbai" />
              <ActionListItem title="Pune" value="pune" />
              <ActionListItem title="Bangalore" value="bangalore" />
              <ActionListItem title="Mysore" value="mysore" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
        <Button 
          marginTop="spacing.8" 
          marginBottom="spacing.4" 
          type="submit"
        >
          Submit
        </Button>
        <Text>Form Submitted with {submissionValues}</Text>
      </form>
    )
  }

  export default App;
`;

const WithValidationStateStory = `
  import React from 'react';
  import {
    Dropdown,
    DropdownOverlay,
    SelectInput,
    ActionList,
    ActionListItem,
    Box,
    Alert
  } from '@razorpay/blade/components';
  import type { SelectInputProps } from '@razorpay/blade/components';

  function App(): JSX.Element {
    const [validationState, setValidationState] = React.useState<SelectInputProps['validationState']>('none');

    return (
      <Box minHeight="300px" paddingBottom="spacing.5">
        <Alert
          intent="information"
          description="Select more than 2 options to see error state"
          isFullWidth
          isDismissible={false}
          marginBottom="spacing.4"
        />
        <Dropdown selectionType="multiple">
          <SelectInput
            name="design-systems"
            label="Top 2 design systems"
            validationState={validationState}
            errorText="You selected more than 2 options"
            successText="Yay! Nice choice"
            helpText="Select only two"
            label="Top 2 design systems"
            placeholder="Select Multiple Options"
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
            <ActionList surfaceLevel={2}>
              <ActionListItem title="Blade" value="blade" />
              <ActionListItem title="Primer" value="primer" />
              <ActionListItem title="Geist" description="by Vercel" value="geist" />
              <ActionListItem title="Airbnb Design" value="airbnb" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </Box>
    )
  }

  export default App;
`;

// export const WithValidationState = (args: AllDropdownProps): JSX.Element => {
//   const [validationState, setValidationState] = React.useState<SelectInputProps['validationState']>(
//     'none',
//   );
//   const {
//     selectionType,
//     surfaceLevel,
//     title = '',
//     description,
//     value = '',
//     actionListItemIcon,
//     ...selectInputArgs
//   } = args;

//   return (
//     <BaseBox minHeight="300px" paddingBottom="spacing.5">
//       <Alert
//         intent="information"
//         description="Select more than 2 options to see error state"
//         isFullWidth
//         isDismissible={false}
//       />
//       <SpaceBetweenSmall />
//       <Dropdown selectionType={selectionType}>
//         <SelectInput
//           label="Top 2 design systems"
//           {...selectInputArgs}
//           validationState={validationState}
//           onChange={({ values }) => {
//             if (values.length === 2) {
//               setValidationState('success');
//             } else if (values.length > 2) {
//               setValidationState('error');
//             } else {
//               setValidationState('none');
//             }
//           }}
//         />
//         <DropdownOverlay>
//           <ActionList surfaceLevel={surfaceLevel}>
//             <ActionListItem title={title} value={value} />
//             <ActionListItem title="Primer" value="primer" />
//             <ActionListItem title="Geist" description="by Vercel" value="geist" />
//             <ActionListItem title="Airbnb Design" value="airbnb" />
//           </ActionList>
//         </DropdownOverlay>
//       </Dropdown>
//     </BaseBox>
//   );
// };
// WithValidationState.args = {
//   selectionType: 'multiple',
//   title: 'Blade',
//   value: 'blade',
//   isRequired: true,
//   errorText: 'You selected more than 2 options',
//   successText: 'Yay! Nice choice',
//   helpText: 'Select only two',
//   label: 'Top 2 design systems',
//   name: 'design-systems',
//   placeholder: 'Select Multiple Options',
// };

export {
  Playground,
  getSimpleSelectCode,
  WithHeaderFooterScroll,
  WithValueDisplayStory,
  WithHTMLFormSubmissionStory,
  WithValidationStateStory,
};
