/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentStory, Meta } from '@storybook/react';
import React from 'react';
import type { BottomSheetProps } from './types';
import {
  BottomSheetHeader,
  BottomSheetFooter,
  BottomSheetBody,
  BottomSheet as BottomSheetComponent,
} from './BottomSheet';

import {
  BookIcon,
  ClockIcon,
  CustomersIcon,
  SearchIcon,
  StarIcon,
  ThumbsUpIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from '~components/Icons';
import {
  ActionList,
  ActionListItem,
  ActionListItemIcon,
  ActionListSection,
} from '~components/ActionList';
import BaseBox from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Dropdown } from '~components/Dropdown';
import { SelectInput } from '~components/Input/SelectInput';
import { Text } from '~components/Typography';
import { Badge } from '~components/Badge';
import { TextInput } from '~components/Input/TextInput';
import { Radio, RadioGroup } from '~components/Radio';
import { List, ListItem } from '~components/List';

export default {
  title: 'Components/BottomSheet',
  component: BottomSheetComponent,
} as Meta<BottomSheetProps>;

const WithHeaderTemplate: ComponentStory<typeof BottomSheetComponent> = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <BaseBox>
      <Button onClick={() => setIsOpen(true)}>Add address</Button>
      <BottomSheetComponent
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
      >
        <BottomSheetHeader
          title="Address Details"
          subtitle="Saving addresses will improve your checkout experience"
          prefix={<BookIcon color="surface.text.muted.lowContrast" size="large" />}
          suffix={<Badge variant="positive">2 Saved</Badge>}
        />
        <BottomSheetBody>
          <BaseBox padding="spacing.4" gap="spacing.4" display="flex" flexDirection="column">
            <RadioGroup label="Addresses">
              <Radio value="home">Home - 11850 Florida 24, Cedar Key, Florida</Radio>
              <Radio value="office">Office - 2033 Florida 21, Cedar Key, Florida</Radio>
            </RadioGroup>
            <Button isFullWidth onClick={() => setIsOpen(false)}>
              Add Another
            </Button>
          </BaseBox>
        </BottomSheetBody>
      </BottomSheetComponent>
    </BaseBox>
  );
};

export const WithHeader = WithHeaderTemplate.bind({});

const WithFooterTemplate: ComponentStory<typeof BottomSheetComponent> = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <BaseBox>
      <Button onClick={() => setIsOpen(true)}>Add address</Button>
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
          trailing={{ primary: { text: 'Add address' }, secondary: { text: 'Remove address' } }}
        />
      </BottomSheetComponent>
    </BaseBox>
  );
};

export const WithFooter = WithFooterTemplate.bind({});

const WithDropdownSingleSelectTemplate: ComponentStory<typeof BottomSheetComponent> = () => {
  return (
    <Dropdown selectionType="single">
      <SelectInput label="Sort Dishes" />
      <BottomSheetComponent>
        <BottomSheetHeader
          title="Sort By"
          prefix={<ClockIcon color="surface.text.muted.lowContrast" size="large" />}
        />
        <BottomSheetBody>
          <ActionList>
            <ActionListItem
              leading={<ActionListItemIcon icon={CustomersIcon} />}
              title="Relevance (Default)"
              value="relavance"
            />
            <ActionListItem
              leading={<ActionListItemIcon icon={ClockIcon} />}
              title="Delivery Time"
              value="delveiry-time"
            />
            <ActionListItem
              leading={<ActionListItemIcon icon={ThumbsUpIcon} />}
              title="Rating"
              value="rating"
            />
            <ActionListItem
              leading={<ActionListItemIcon icon={TrendingUpIcon} />}
              title="Cost: Low to High"
              value="Cost: Low to High"
            />
            <ActionListItem
              leading={<ActionListItemIcon icon={TrendingDownIcon} />}
              title="Cost: High to Low"
              value="Cost: High to Low"
            />
          </ActionList>
        </BottomSheetBody>
      </BottomSheetComponent>
    </Dropdown>
  );
};

export const WithDropdownSingleSelect = WithDropdownSingleSelectTemplate.bind({});

const WithDropdownMultiSelectTemplate: ComponentStory<typeof BottomSheetComponent> = () => {
  return (
    <Dropdown selectionType="multiple">
      <SelectInput label="Cuisines Filter" />
      <BottomSheetComponent>
        <BottomSheetHeader
          title="Filter By Cuisines"
          prefix={<SearchIcon color="surface.text.muted.lowContrast" size="large" />}
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
      </BottomSheetComponent>
    </Dropdown>
  );
};

export const WithDropdownMultiSelect = WithDropdownMultiSelectTemplate.bind({});

const WithDropdownSectionsTemplate: ComponentStory<typeof BottomSheetComponent> = () => {
  return (
    <Dropdown selectionType="multiple">
      <SelectInput label="Cuisines Filter" />
      <BottomSheetComponent>
        <BottomSheetHeader
          title="Filter By Cuisines"
          prefix={<SearchIcon color="surface.text.muted.lowContrast" size="large" />}
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
      </BottomSheetComponent>
    </Dropdown>
  );
};

export const WithDropdownSectionsSelect = WithDropdownSectionsTemplate.bind({});

const InitialFocusTemplate: ComponentStory<typeof BottomSheetComponent> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const initialFocusRef = React.useRef<HTMLButtonElement>(null);

  return (
    <BaseBox>
      <Button onClick={() => setIsOpen(true)}>Add address</Button>
      <BottomSheetComponent
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
        initialFocusRef={initialFocusRef}
      >
        <BottomSheetHeader title="Users" />
        <BottomSheetBody>
          <BaseBox padding="spacing.4" gap="spacing.4" display="flex" flexDirection="column">
            <List>
              <ListItem>Anurag Hazra</ListItem>
              <ListItem>Kamlesh Chandnani</ListItem>
              <ListItem>Divyanshu Maithani</ListItem>
            </List>
            <TextInput label="Search Users" ref={initialFocusRef} />
          </BaseBox>
        </BottomSheetBody>
      </BottomSheetComponent>
    </BaseBox>
  );
};

export const InitialFocus = InitialFocusTemplate.bind({});

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

const SnapPointsTemplate: ComponentStory<typeof BottomSheetComponent> = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <BaseBox display="flex" gap="spacing.3" flexDirection="column">
      <Text>Custom SnapPoints at 50%, 80%, 100%</Text>
      <Button onClick={() => setIsOpen(true)}>Open</Button>
      <BottomSheetComponent
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        snapPoints={[0.5, 0.8, 1]}
      >
        <BottomSheetHeader
          title="Fruits"
          prefix={<ClockIcon color="surface.text.muted.lowContrast" size="large" />}
        />
        <BottomSheetBody>
          <MultiSelectContent />
        </BottomSheetBody>
      </BottomSheetComponent>
    </BaseBox>
  );
};

export const CustomSnapPoints = SnapPointsTemplate.bind({});

const BottomSheetTemplate: ComponentStory<typeof BottomSheetComponent> = ({ ...args }) => {
  const [isOpen, setIsOpen] = React.useState(false);

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
