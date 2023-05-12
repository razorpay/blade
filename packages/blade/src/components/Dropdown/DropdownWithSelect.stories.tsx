import React from 'react';
import type { ComponentStory, Meta } from '@storybook/react';
import {
  getSimpleSelectCode,
  WithHeaderFooterScroll,
  WithHTMLFormSubmissionStory,
  WithValueDisplayStory,
} from './docs/stories';
import { Dropdown } from '.';

import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';

const DropdownStoryMeta: Meta = {
  title: 'Components/Dropdown/Stories/With Select',
  component: Dropdown,
  args: {
    selectionType: 'single',
  },
  argTypes: {
    ...getStyledPropsArgTypes(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  },
  parameters: {
    viewMode: 'story',
    options: {
      showPanel: false,
    },
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
  },
};

const DropdownTemplate: ComponentStory<typeof Dropdown> = (args) => {
  return (
    <Sandbox showConsole padding="spacing.0" editorHeight="100vh">
      {getSimpleSelectCode(args.selectionType)}
    </Sandbox>
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

export const WithHeaderFooterScrollbar = (): JSX.Element => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithHeaderFooterScroll}
    </Sandbox>
  );
};

export const WithValueDisplay = (): JSX.Element => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithValueDisplayStory}
    </Sandbox>
  );
};

export const WithHTMLFormSubmission = (): JSX.Element => {
  return (
    <Sandbox padding="spacing.0" editorHeight="100vh">
      {WithHTMLFormSubmissionStory}
    </Sandbox>
  );
};

// const SpaceBetweenSmall = (): JSX.Element => <BaseBox height="18px" />;

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

// export const WithRefUsage = (args: AllDropdownProps): JSX.Element => {
//   const selectRef = React.useRef<HTMLElement>(null);
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
//     <BaseBox minHeight="300px">
//       <Dropdown selectionType={selectionType}>
//         <SelectInput ref={selectRef} label="Top 2 design systems" {...selectInputArgs} />
//         <DropdownOverlay>
//           <ActionList surfaceLevel={surfaceLevel}>
//             <ActionListItem title={title} value={value} />
//             <ActionListItem title="Primer" value="primer" />
//             <ActionListItem title="Geist" description="by Vercel" value="geist" />
//             <ActionListItem title="Airbnb Design" value="airbnb" />
//           </ActionList>
//         </DropdownOverlay>
//       </Dropdown>
//       <BaseBox paddingTop="spacing.3">
//         <Button
//           onClick={() => {
//             selectRef.current?.focus();
//           }}
//         >
//           Click to focus
//         </Button>
//       </BaseBox>
//       <BaseBox paddingTop="spacing.3">
//         <Text>
//           We are using <Code>selectRef.current.focus()</Code> here to focus on input
//         </Text>
//       </BaseBox>
//     </BaseBox>
//   );
// };

// WithRefUsage.args = {
//   selectionType: 'single',
//   label: 'Top 2 design systems',
//   name: 'design-system',
// };

// export const WithMultipleDropdowns = (args: AllDropdownProps): JSX.Element => {
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
//     <BaseBox display="flex" flexDirection="row" minHeight="300px" gap="spacing.2">
//       <BaseBox flex={1}>
//         <Dropdown selectionType={selectionType}>
//           <SelectInput label="Top 2 design systems" {...selectInputArgs} />
//           <DropdownOverlay>
//             <ActionList surfaceLevel={surfaceLevel}>
//               <ActionListItem title={title} value={value} />
//               <ActionListItem title="Primer" value="primer" />
//               <ActionListItem title="Geist" description="by Vercel" value="geist" />
//               <ActionListItem title="Airbnb Design" value="airbnb" />
//             </ActionList>
//           </DropdownOverlay>
//         </Dropdown>
//       </BaseBox>
//       <BaseBox flex={1}>
//         <Dropdown selectionType={selectionType}>
//           <SelectInput {...selectInputArgs} label="Top 2 Languages" />
//           <DropdownOverlay>
//             <ActionList surfaceLevel={surfaceLevel}>
//               <ActionListItem title="HTML" value="html" />
//               <ActionListItem title="CSS" value="css" />
//               <ActionListItem title="JavaScript" value="javascript" />
//             </ActionList>
//           </DropdownOverlay>
//         </Dropdown>
//       </BaseBox>
//     </BaseBox>
//   );
// };

// WithMultipleDropdowns.args = {
//   selectionType: 'single',
//   label: 'Top 2 design systems',
//   name: 'design-system',
// };

// export const InternalSectionListPerformance = (): React.ReactElement => {
//   return (
//     <Dropdown selectionType="multiple">
//       <SelectInput label="Select fruits" />
//       <DropdownOverlay>
//         <ActionList surfaceLevel={3}>
//           <ActionListItem title="Apples" value="Apples" />
//           <ActionListItem title="Appricots" value="Appricots" />
//           <ActionListItem title="Abc" value="Abc" />
//           <ActionListItem title="Def" value="Def" />
//           <ActionListSection title="Recent 1">
//             <ActionListItem title="Avocados" value="Avocados" />
//             <ActionListItem title="Bananas" value="Bananas" />
//             <ActionListItem title="Blueberries" value="Blueberries" />
//           </ActionListSection>

//           <ActionListSection title="Recent 2">
//             <ActionListItem title="Cherries" value="Cherries" />
//             <ActionListItem title="Crab apples" value="Crab apples" />
//             <ActionListItem title="Jambolan" value="Jambolan" />
//           </ActionListSection>
//         </ActionList>
//       </DropdownOverlay>
//     </Dropdown>
//   );
// };

// export const InternalDropdownPerformance = (): React.ReactElement => {
//   const fruits = [
//     'Apples',
//     'Apricots',
//     { name: 'Avocados', description: 'Avocados description' },
//     'Bananas',
//     'Boysenberries',
//     'Blueberries',
//     'Bing Cherry',
//     'Cherries',
//     'Cantaloupe',
//     'Crab apples',
//     { name: 'Clementine', description: 'Clementine description' },
//     'Cucumbers',
//     'Damson plum',
//     'Dinosaur Eggs',
//     'Dates',
//     'Dewberries',
//     'Dragon',
//     'Elderberry',
//     'Eggfruit',
//     'Evergreen',
//     'Huckleberry',
//     'Entawak',
//     'Fig',
//     'Farkleberry',
//     'Finger Lime',
//     'Grapefruit',
//     'Grapes',
//     'Gooseberries',
//     'Guava',
//     'Honeydew melon',
//     'Hackberry',
//     'Honeycrisp Apples',
//     'Indian Prune',
//     'Indonesian Lime',
//     'Imbe',
//     'Indian Fig',
//     'Jackfruit',
//     'Java Apple',
//     'Jambolan',
//     { name: 'Kaffir Lime', description: 'Kaffir description' },
//     'Kumquat',
//     'Lime',
//     'Longan',
//     'Lychee',
//     'Loquat',
//     'Mango',
//     'Mandarin',
//     'Orange',
//     'Mulberry',
//   ];

//   return (
//     <Dropdown selectionType="multiple">
//       <SelectInput label="Select fruits" />
//       <DropdownOverlay>
//         <ActionList>
//           {fruits.map((fruit) => {
//             if (typeof fruit === 'string') {
//               return <ActionListItem key={fruit} title={fruit} value={fruit} />;
//             }

//             return (
//               <ActionListItem
//                 trailing={<ActionListItemText>⌘ + S</ActionListItemText>}
//                 leading={<ActionListItemIcon icon={HomeIcon} />}
//                 description={fruit.description}
//                 key={fruit.name}
//                 title={fruit.name}
//                 value={fruit.name}
//               />
//             );
//           })}
//         </ActionList>
//       </DropdownOverlay>
//     </Dropdown>
//   );
// };

// export const ControlledDropdown = (args: AllDropdownProps): JSX.Element => {
//   const [currentSelection, setCurrentSelection] = React.useState<undefined | string>();

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
//     <>
//       <Button onClick={() => setCurrentSelection('bangalore')}>Select Bangalore</Button>
//       <Dropdown selectionType="single">
//         <SelectInput
//           label="Select City"
//           {...selectInputArgs}
//           value={currentSelection}
//           onChange={(args) => {
//             if (args) {
//               setCurrentSelection(args.values[0]);
//               console.log('onChange triggered');
//             }
//           }}
//         />
//         <DropdownOverlay>
//           <ActionList>
//             <ActionListItem title={title} value={value} />
//             <ActionListItem title="Bangalore" value="bangalore" />
//             <ActionListItem title="Pune" value="pune" />
//             <ActionListItem title="Chennai" value="chennai" />
//           </ActionList>
//         </DropdownOverlay>
//       </Dropdown>
//     </>
//   );
// };

// ControlledDropdown.args = {
//   label: 'Select City',
//   title: 'Mumbai',
//   value: 'mumbai',
// };

// export const ControlledDropdownMultiSelect = (args: AllDropdownProps): JSX.Element => {
//   const [currentSelection, setCurrentSelection] = React.useState<string[]>([]);

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
//     <>
//       <Button
//         onClick={() => {
//           if (!currentSelection.includes('bangalore')) {
//             setCurrentSelection([...currentSelection, 'bangalore']);
//           }
//         }}
//       >
//         Select Bangalore
//       </Button>
//       <Dropdown selectionType="multiple">
//         <SelectInput
//           label="Select City"
//           {...selectInputArgs}
//           value={currentSelection}
//           onChange={(args) => {
//             if (args) {
//               setCurrentSelection(args.values);
//               console.log('onChange triggered');
//             }
//           }}
//         />
//         <DropdownOverlay>
//           <ActionList>
//             <ActionListItem title={title} value={value} />
//             <ActionListItem title="Bangalore" value="bangalore" />
//             <ActionListItem title="Pune" value="pune" />
//             <ActionListItem title="Chennai" value="chennai" />
//           </ActionList>
//         </DropdownOverlay>
//       </Dropdown>
//     </>
//   );
// };

// ControlledDropdownMultiSelect.args = {
//   label: 'Select City',
//   title: 'Mumbai',
//   value: 'mumbai',
// };

export default DropdownStoryMeta;
