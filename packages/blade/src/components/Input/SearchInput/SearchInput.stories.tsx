/* eslint-disable react-native-a11y/has-valid-accessibility-descriptors */
import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import React from 'react';
import type { SearchInputProps } from './SearchInput';
import { SearchInput as SearchInputComponent } from './SearchInput';
import BaseBox from '~components/Box/BaseBox';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import { Text, Code } from '~components/Typography';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import {
  ActionList,
  ActionListItem,
  ActionListSection,
  ActionListItemIcon,
} from '~components/ActionList';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableToolbar,
  TableToolbarActions,
} from '~components/Table';
import { Amount } from '~components/Amount';
import {
  SettingsIcon,
  UserIcon,
  SettlementsIcon,
  TransactionsIcon,
  HelpCircleIcon,
  BulkPayoutsIcon,
} from '~components/Icons';
import { Spinner } from '~components/Spinner';

const propsCategory = {
  BASE_PROPS: 'Search Input Props',
  LABEL_PROPS: 'Label Props',
  TRAILING_VISUAL_PROPS: 'Trailing Visual Props',
  KEYBOARD_PROPS: 'Keyboard Props',
};

export default {
  title: 'Components/Input/SearchInput',
  component: SearchInputComponent,
  args: {
    defaultValue: undefined,
    placeholder: 'Search payment products, settings, and more',
    name: 'search',
    isDisabled: false,
    value: undefined,
    autoFocus: false,
    size: 'medium',
    onChange: ({ name, value }): void => {
      console.log(`input field ${name} content changed to ${value}`);
    },
    onFocus: ({ name, value }): void => {
      console.log(`input field ${name} received focus. The value is ${value}`);
    },
    onBlur: ({ name, value }): void => {
      console.log(`input field ${name} content lost focus. The value is ${value}`);
    },
    label: 'Search here',
    labelPosition: 'top',
    helpText: undefined,
    autoCapitalize: undefined,
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    testID: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    size: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    placeholder: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    name: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    isDisabled: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    value: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    autoFocus: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onSubmit: {
      control: {
        disable: true,
      },
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onClick: {
      control: {
        disable: true,
      },
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onChange: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onFocus: {
      control: {
        disable: true,
      },
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onBlur: {
      control: {
        disable: true,
      },
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    label: {
      table: {
        category: propsCategory.LABEL_PROPS,
      },
    },
    accessibilityLabel: {
      table: {
        category: propsCategory.LABEL_PROPS,
      },
    },
    labelPosition: {
      table: {
        category: propsCategory.LABEL_PROPS,
      },
    },
    helpText: {
      table: {
        category: propsCategory.BASE_PROPS,
      },
    },
    onClearButtonClick: {
      table: {
        category: propsCategory.TRAILING_VISUAL_PROPS,
      },
    },
    isLoading: {
      table: {
        category: propsCategory.TRAILING_VISUAL_PROPS,
      },
    },
    autoCapitalize: {
      table: {
        category: propsCategory.KEYBOARD_PROPS,
      },
    },
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="The SearchInput component is a component that can be used to input name, email, telephone, url, search or plain text."
          componentName="SearchInput"
          apiDecisionLink="https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Input/SearchInput/_decisions/decisions.md"
          figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=85072%3A160345&mode=design&t=Pv93G8LK6OtL4wwk-1"
        >
          <Title>Usage</Title>
          <Sandbox>
            {`
              import { SearchInput } from '@razorpay/blade/components';

              function App() {
                return (
                  <SearchInput 
                    label="Name" 
                    placeholder="Enter Name" 
                    onChange={(e) => console.log(e)} 
                  />
                )
              }

              export default App;
            `}
          </Sandbox>
        </StoryPageWrapper>
      ),
    },
  },
} as Meta<SearchInputProps>;

const menuItems = [
  { title: 'Account & Settings', icon: SettingsIcon },
  { title: 'Profile', icon: UserIcon },
  { title: 'Transactions', icon: TransactionsIcon },
  { title: 'Help', icon: HelpCircleIcon },
  { title: 'Settlements', icon: SettlementsIcon },
  { title: 'Payouts', icon: BulkPayoutsIcon },
];

const SearchInputTemplate: StoryFn<typeof SearchInputComponent> = (args) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const filteredItems = menuItems.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <BaseBox>
      <SearchInputComponent {...args} onChange={({ value }) => setSearchTerm(value as string)} />
      <ActionList>
        <ActionListSection title={`${filteredItems.length} items found`}>
          {filteredItems.map((item, index) => (
            <ActionListItem
              key={index}
              title={item.title}
              value={item.title}
              leading={<ActionListItemIcon icon={item.icon} />}
            />
          ))}
        </ActionListSection>
      </ActionList>
    </BaseBox>
  );
};

export const Default = SearchInputTemplate.bind({});
Default.storyName = 'Default';

export const SearchInputHelpText = SearchInputTemplate.bind({});
SearchInputHelpText.storyName = 'SearchInput with Help Text';
SearchInputHelpText.args = {
  helpText: 'Please enter an item to search',
};

export const SearchInputWithoutLabel = SearchInputTemplate.bind({});
SearchInputWithoutLabel.storyName = 'SearchInput without label';
SearchInputWithoutLabel.args = {
  defaultValue: 'Transactions',
  label: undefined,
  accessibilityLabel: 'Search payment products, settings, and more.',
};

const SearchInputSizesTemplate: StoryFn<typeof SearchInputComponent> = ({ ...args }) => {
  return (
    <Box display="flex" flexDirection="column">
      <Text size="large" marginBottom="spacing.4">
        Medium Size:
      </Text>
      <SearchInputComponent {...args} size="medium" />
      <Text size="large" marginTop="spacing.4" marginBottom="spacing.4">
        Large Size:
      </Text>
      <SearchInputComponent {...args} size="large" />
    </Box>
  );
};
export const SearchInputSizes = SearchInputSizesTemplate.bind({});

const SearchInputWithDropdownTemplate: StoryFn<typeof SearchInputComponent> = (args) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isFetching, setIsFetching] = React.useState(false);

  // Set a timeout to simulate fetching data
  React.useEffect(() => {
    if (searchTerm.length > 0) {
      setIsFetching(true);
      setTimeout(() => {
        setIsFetching(false);
      }, 1000);
    }
  }, [searchTerm]);

  const popularItems = [
    { title: 'Transactions', icon: TransactionsIcon },
    { title: 'Settlements', icon: SettlementsIcon },
    { title: 'Account & Settings', icon: SettingsIcon },
  ];
  const filteredItems = menuItems.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Dropdown>
      <SearchInputComponent
        label="Search"
        placeholder="Search here"
        {...args}
        onChange={({ value }) => setSearchTerm(value as string)}
      />

      <DropdownOverlay>
        {isFetching ? (
          <BaseBox display="flex" justifyContent="center" padding="spacing.4">
            <Spinner accessibilityLabel="Fetching data" />
          </BaseBox>
        ) : (
          <ActionList>
            {searchTerm.length === 0 ? (
              <ActionListSection title="Popular Searches">
                {popularItems.map((item, index) => (
                  <ActionListItem
                    key={index}
                    title={item.title}
                    value={item.title}
                    leading={<ActionListItemIcon icon={item.icon} />}
                  />
                ))}
              </ActionListSection>
            ) : (
              <ActionListSection title={`${filteredItems.length} items found`}>
                {filteredItems.map((item, index) => (
                  <ActionListItem
                    key={index}
                    title={item.title}
                    value={item.title}
                    leading={<ActionListItemIcon icon={item.icon} />}
                  />
                ))}
              </ActionListSection>
            )}
          </ActionList>
        )}
      </DropdownOverlay>
    </Dropdown>
  );
};

export const SearchInputWithDropdown = SearchInputWithDropdownTemplate.bind({});
SearchInputWithDropdown.storyName = 'With Dropdown';

const SearchInputWithTableTemplate: StoryFn<typeof SearchInputComponent> = () => {
  const [searchTerm, setSearchTerm] = React.useState('');

  type Item = {
    id: string;
    paymentId: string;
    amount: number;
    date: Date;
    method: string;
  };

  const nodes: Item[] = [
    ...Array.from({ length: 10 }, (_, i) => ({
      id: (i + 1).toString(),
      paymentId: `rzp${Math.floor(Math.random() * 1000000)}`,
      amount: Number((Math.random() * 10000).toFixed(2)),
      date: new Date(2021, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      method: ['Bank Transfer', 'Credit Card', 'UPI', 'PayPal'][Math.floor(i / 4)],
      account: Math.floor(Math.random() * 1000000000).toString(),
    })),
  ];

  const data: TableData<Item> = {
    nodes,
  };

  return (
    <Table
      data={data}
      toolbar={
        <TableToolbar>
          <TableToolbarActions>
            <BaseBox width="300px">
              <SearchInputComponent
                label="Search Transaction"
                onChange={({ value }) => setSearchTerm(value as string)}
                placeholder="Transaction method"
                helpText='Search by "Credit Card", "UPI", "Paypal", etc.'
              />
            </BaseBox>
          </TableToolbarActions>
        </TableToolbar>
      }
    >
      {(tableData: Item[]) => (
        <>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Method</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {tableData
              // Filter item based on the search input value
              .filter((tableItem) =>
                tableItem.method.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
                  </TableCell>
                  <TableCell>
                    <Amount value={tableItem.amount} />
                  </TableCell>
                  <TableCell>
                    {tableItem.date?.toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </>
      )}
    </Table>
  );
};

export const SearchInputWithTable = SearchInputWithTableTemplate.bind({});
SearchInputWithTable.storyName = 'With Table';
