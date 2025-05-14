import dayjs from 'dayjs';
import type { StoryFn, Meta } from '@storybook/react';
import React, { useState } from 'react';
import storyRouterDecorator from 'storybook-react-router';
import { Heading } from '~components/Typography/Heading';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import type { TableData } from '~components/Table/types';
import { BaseBox } from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Badge } from '~components/Badge';
import { ArrowRightIcon, CheckIcon, CloseIcon, DownloadIcon } from '~components/Icons';
import { Code } from '~components/Typography/Code';
import { TableEditableCell } from '~components/Table/TableEditableCell';
import { Amount } from '~components/Amount';
import { QuickFilter, QuickFilterGroup } from '~components/QuickFilters';
import { Counter } from '~components/Counter';
import {
  FilterChipSelectInput,
  Dropdown,
  DropdownOverlay,
  FilterChipGroup,
} from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';
import type { DatesRangeValue } from '~components/DatePicker';
import { FilterChipDatePicker } from '~components/DatePicker';
import {
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableFooter,
  TableFooterRow,
  TableFooterCell,
} from '~components/Table';
import { IconButton } from '~components/Button/IconButton';
import { Box } from '~components/Box';
import type { CounterProps } from '~components/Counter';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '~components/Modal';
import { Text } from '~components/Typography/Text';
import { PasswordInput } from '~components/Input/PasswordInput';
import { Alert } from '~components/Alert';
import { TextInput } from '~components/Input/TextInput';
import { Radio, RadioGroup } from '~components/Radio';
import {
  PreviewWindow,
  PreviewBody,
  PreviewHeader,
  PreviewFooter,
} from '~components/PreviewWindow';
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetHeader,
  BottomSheetFooter,
} from '~components/BottomSheet';
import { useBreakpoint } from '~utils/useBreakpoint';
import { useIsMobile } from '~utils/useIsMobile';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="ListView"
      componentDescription="List View is a pattern"
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=100413-32686&t=n9A7LztwEkIsly3v-0"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
      import { useState } from 'react';
      import {
        Amount,
        ListView,
        ListViewFilters,
        Box,
        QuickFilterGroup,
        QuickFilter,
        FilterChipGroup,
        Dropdown,
        DropdownOverlay,
        Counter,
        FilterChipSelectInput,
        ActionList,
        ActionListItem,
        FilterChipDatePicker,
        Table,
        TableHeader,
        TableCell,
        TableRow,
        TableHeaderRow,
        TableHeaderCell,
        TableBody,
        TableFooter,
        TableFooterRow,
        TableFooterCell,
        TableEditableCell,
        Button,
        IconButton,
        CheckIcon,
        CloseIcon,
        Code,
        Badge,
      } from '@razorpay/blade/components';
      import type {
        DatesRangeValue,
        TableData,
        CounterProps,
      } from '@razorpay/blade/components';
      
      type Item = {
        id: string;
        paymentId: string;
        amount: number;
        status: string;
        date: Date;
        type: string;
        method: {
          key: string;
          title: string;
        };
        bank: string;
        account: string;
        name: string;
      };
      
      const MethodFilterValues = [
        { key: 'bank-transfer', title: 'Bank Transfer' },
        { key: 'credit-card', title: 'Credit Card' },
        { key: 'paypal', title: 'PayPal' },
      ];
      
      const nodes = [
        ...Array.from({ length: 30 }, (_, i) => ({
          id: (i + 1).toString(),
          paymentId: Math.floor(Math.random() * 1000000),
          amount: Number((Math.random() * 10000).toFixed(2)),
          status: ['Completed', 'Pending', 'Failed'][Math.floor(Math.random() * 3)],
          date: new Date(
            2025,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          ),
          type: ['Payout', 'Refund'][Math.floor(Math.random() * 2)],
          method: MethodFilterValues[Math.floor(Math.random() * 3)],
          bank: ['HDFC', 'ICICI', 'SBI'][Math.floor(Math.random() * 3)],
          account: Math.floor(Math.random() * 1000000000).toString(),
          name: [
            'John Doe',
            'Jane Doe',
            'Bob Smith',
            'Alice Smith',
            'John Smith',
            'Jane Smith',
            'Bob Doe',
            'Alice Doe',
          ][Math.floor(Math.random() * 8)],
        })),
      ];
      const quickFilters = ['All', 'Pending', 'Failed', 'Completed'];
      const filterChipQuickFilters = ['Pending', 'Failed', 'Completed'];
      const quickFilterColorMapping: Record<Item['status'], CounterProps['color']> = {
        All: 'primary',
        Pending: 'notice',
        Failed: 'negative',
        Completed: 'neutral',
      };
      const data: TableData<Item> = {
        nodes,
      };
      
      function App() {
        const [listViewTableData, setListViewTableData] = useState(data);
        const [selectedQuickFilter, setSelectedQuickFilter] = useState<string>('All');
        const [searchValue, setSearchValue] = useState<string | undefined>('');
        const [methodFilter, setMethodFilter] = useState<string | undefined>('');
        const [filterDateRange, setFilterDateRange] = useState<
          DatesRangeValue | undefined
        >(undefined);
      
        const getQuickFilterValueCount = (value: string): number => {
          if (value === 'All') {
            return data.nodes.length;
          }
          return data.nodes.filter((node) => node.status === value).length;
        };
        const getQuickFilterData = (
          data: TableData<Item>,
          value?: string
        ): TableData<Item> => {
          if (!value || value === 'All') {
            return { nodes: data.nodes };
          }
          return { nodes: data.nodes.filter((node) => node.status === value) };
        };
        const getSearchedData = (
          data: TableData<Item>,
          value?: string
        ): TableData<Item> => {
          if (!value) {
            return { nodes: data.nodes };
          }
          return {
            nodes: data.nodes.filter((node) => node.paymentId.includes(value)),
          };
        };
        const getMethodFilterData = (
          data: TableData<Item>,
          value?: string
        ): TableData<Item> => {
          if (!value) {
            return { nodes: data.nodes };
          }
          return { nodes: data.nodes.filter((node) => node.method.key === value) };
        };
      
        const getFilterRangeData = (
          data: TableData<Item>,
          value?: DatesRangeValue
        ): TableData<Item> => {
          if (!value?.[0]) {
            return { nodes: data.nodes };
          }
          return {
            nodes: data.nodes.filter((node) => {
              if (!value?.[0] || !value?.[1]) return false;
              return node.date >= value[0] && node.date <= value[1];
            }),
          };
        };
        return (
          <Box height="100%">
            <ListView>
              <ListViewFilters
                quickFilters={
                  <QuickFilterGroup
                    selectionType="single"
                    onChange={({ values }) => {
                      const value = values[0];
                      const quickFilterData = getQuickFilterData(data, value);
                      const searchValueData = getSearchedData(
                        quickFilterData,
                        searchValue
                      );
                      const methodFilterData = getMethodFilterData(
                        searchValueData,
                        methodFilter
                      );
                      const dateRangeFilterData = getFilterRangeData(
                        methodFilterData,
                        filterDateRange
                      );
      
                      setListViewTableData(dateRangeFilterData);
                      setSelectedQuickFilter(value);
                    }}
                    defaultValue="All"
                    value={selectedQuickFilter}
                  >
                    {quickFilters.map((status, index) => (
                      <QuickFilter
                        title={status}
                        value={status}
                        trailing={
                          <Counter
                            value={getQuickFilterValueCount(status)}
                            color={quickFilterColorMapping[status]}
                          />
                        }
                        key={status}
                      />
                    ))}
                  </QuickFilterGroup>
                }
                onSearchChange={({ value }) => {
                  const quickFilterData = getQuickFilterData(
                    data,
                    selectedQuickFilter
                  );
                  const searchValueData = getSearchedData(quickFilterData, value);
                  const methodFilterData = getMethodFilterData(
                    searchValueData,
                    methodFilter
                  );
                  const dateRangeFilterData = getFilterRangeData(
                    methodFilterData,
                    filterDateRange
                  );
                  setListViewTableData(dateRangeFilterData);
                  setSearchValue(value);
                }}
                onSearchClear={() => {
                  const quickFilterData = getQuickFilterData(
                    data,
                    selectedQuickFilter
                  );
                  const methodFilterData = getMethodFilterData(
                    quickFilterData,
                    methodFilter
                  );
                  const dateRangeFilterData = getFilterRangeData(
                    methodFilterData,
                    filterDateRange
                  );
                  setListViewTableData(dateRangeFilterData);
                  setSearchValue('');
                }}
                searchValuePlaceholder="Search for Payment Id"
                selectedFiltersCount={
                  (methodFilter ? 1 : 0) +
                  (Array.isArray(filterDateRange) && filterDateRange[0] ? 1 : 0) +
                  (selectedQuickFilter !== 'All' ? 1 : 0)
                }
              >
                <FilterChipGroup
                  onClearButtonClick={() => {
                    const quickFilterData = getQuickFilterData(data, 'All');
                    const searchValueData = getSearchedData(
                      quickFilterData,
                      searchValue
                    );
                    const methodFilterData = getMethodFilterData(searchValueData, '');
                    const dateRangeFilterData = getFilterRangeData(
                      methodFilterData,
                      undefined
                    );
                    setListViewTableData(dateRangeFilterData);
                    setMethodFilter(undefined);
                    setFilterDateRange(undefined);
                    setSelectedQuickFilter('All');
                  }}
                >
                  <Dropdown selectionType="single">
                    <FilterChipSelectInput
                      label="Method"
                      onChange={({ values }) => {
                        const value = values[0];
                        const quickFilterData = getQuickFilterData(
                          data,
                          selectedQuickFilter
                        );
                        const searchValueData = getSearchedData(
                          quickFilterData,
                          searchValue
                        );
                        const methodFilterData = getMethodFilterData(
                          searchValueData,
                          value
                        );
                        const dateRangeFilterData = getFilterRangeData(
                          methodFilterData,
                          filterDateRange
                        );
      
                        setListViewTableData(dateRangeFilterData);
                        setMethodFilter(value);
                      }}
                    />
                    <DropdownOverlay>
                      <ActionList>
                        {MethodFilterValues.map((method, index) => (
                          <ActionListItem
                            key={index}
                            title={method.title}
                            value={method.key}
                          />
                        ))}
                      </ActionList>
                    </DropdownOverlay>
                  </Dropdown>
                  <FilterChipDatePicker
                    label="Date Range"
                    selectionType="range"
                    onChange={(value) => {
                      const quickFilterData = getQuickFilterData(
                        data,
                        selectedQuickFilter
                      );
                      const searchValueData = getSearchedData(
                        quickFilterData,
                        searchValue
                      );
                      const methodFilterData = getMethodFilterData(
                        searchValueData,
                        methodFilter
                      );
                      const dateRangeFilterData = getFilterRangeData(
                        methodFilterData,
                        Array.isArray(value) ? value : undefined
                      );
                      setListViewTableData(dateRangeFilterData);
                      setFilterDateRange(value as DatesRangeValue);
                    }}
                  />
                  <Dropdown selectionType="single">
                    <FilterChipSelectInput
                      label="Status"
                      value={
                        selectedQuickFilter !== 'All'
                          ? selectedQuickFilter
                          : undefined
                      }
                      onChange={({ values }) => {
                        const value = values[0];
                        const quickFilterData = getQuickFilterData(data, value);
                        const searchValueData = getSearchedData(
                          quickFilterData,
                          searchValue
                        );
                        const methodFilterData = getMethodFilterData(
                          searchValueData,
                          methodFilter
                        );
                        const dateRangeFilterData = getFilterRangeData(
                          methodFilterData,
                          filterDateRange
                        );
                        setListViewTableData(dateRangeFilterData);
                        setSelectedQuickFilter(value ? value : 'All');
                      }}
                      onClearButtonClick={() => {
                        const quickFilterData = getQuickFilterData(data, 'All');
                        const searchValueData = getSearchedData(
                          quickFilterData,
                          searchValue
                        );
                        const methodFilterData = getMethodFilterData(
                          searchValueData,
                          methodFilter
                        );
                        const dateRangeFilterData = getFilterRangeData(
                          methodFilterData,
                          filterDateRange
                        );
                        setListViewTableData(dateRangeFilterData);
                        setSelectedQuickFilter('All');
                      }}
                    />
                    <DropdownOverlay>
                      <ActionList>
                        {filterChipQuickFilters.map((method, index) => (
                          <ActionListItem
                            key={index}
                            title={method}
                            value={method}
                            isSelected={selectedQuickFilter === method}
                          />
                        ))}
                      </ActionList>
                    </DropdownOverlay>
                  </Dropdown>
                </FilterChipGroup>
              </ListViewFilters>
              <Table
                data={listViewTableData}
                defaultSelectedIds={['1', '3']}
                onSelectionChange={console.log}
                isFirstColumnSticky
                selectionType="single"
              >
                {(tableData) => (
                  <>
                    <TableHeader>
                      <TableHeaderRow>
                        <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
                        <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                        <TableHeaderCell headerKey="ACCOUNT">Account</TableHeaderCell>
                        <TableHeaderCell headerKey="DATE">Date</TableHeaderCell>
                        <TableHeaderCell headerKey="METHOD">Method</TableHeaderCell>
                        <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
                      </TableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {tableData.map((tableItem, index) => (
                        <TableRow
                          key={index}
                          item={tableItem}
                          hoverActions={
                            <>
                              <Button variant="tertiary" size="xsmall">
                                View Details
                              </Button>
                              <IconButton
                                icon={CheckIcon}
                                isHighlighted
                                accessibilityLabel="Approve"
                                onClick={() => {
                                  console.log('Approved', tableItem.id);
                                }}
                              />
                              <IconButton
                                icon={CloseIcon}
                                isHighlighted
                                accessibilityLabel="Reject"
                                onClick={() => {
                                  console.log('Rejected', tableItem.id);
                                }}
                              />
                            </>
                          }
                          onClick={() => {
                            console.log('where');
                          }}
                        >
                          <TableCell>
                            <Code size="medium">{tableItem.paymentId}</Code>
                          </TableCell>
                          <TableEditableCell
                            accessibilityLabel="Amount"
                            placeholder="Enter text"
                            successText="Amount is valid"
                          />
                          <TableCell>{tableItem.account}</TableCell>
                          <TableCell>
                            {tableItem.date?.toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })}
                          </TableCell>
                          <TableCell>{tableItem.method.title}</TableCell>
                          <TableCell>
                            <Badge
                              size="medium"
                              color={
                                tableItem.status === 'Completed'
                                  ? 'positive'
                                  : tableItem.status === 'Pending'
                                  ? 'notice'
                                  : tableItem.status === 'Failed'
                                  ? 'negative'
                                  : 'primary'
                              }
                            >
                              {tableItem.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableFooterRow>
                        <TableFooterCell>Total</TableFooterCell>
                        <TableFooterCell>-</TableFooterCell>
                        <TableFooterCell>-</TableFooterCell>
                        <TableFooterCell>-</TableFooterCell>
                        <TableFooterCell>-</TableFooterCell>
                        <TableFooterCell>-</TableFooterCell>
                        <TableFooterCell>
                          <Amount value={10} />
                        </TableFooterCell>
                      </TableFooterRow>
                    </TableFooter>
                  </>
                )}
              </Table>
            </ListView>
          </Box>
        );
      }
      
      export default App;

      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Patterns/CreationView',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
    decorators: [storyRouterDecorator(undefined, { initialEntries: ['/'] })] as unknown,
  },
} as Meta<ModalProps>;

const MethodFilterValues = [
  { key: 'bank-transfer', title: 'Bank Transfer' },
  { key: 'credit-card', title: 'Credit Card' },
  { key: 'paypal', title: 'PayPal' },
];

const nodes: Item[] = [
  ...Array.from({ length: 20 }, (_, i) => ({
    id: (i + 1).toString(),
    paymentId: `rzp${Math.floor(Math.random() * 1000000)}`,
    amount: Number((Math.random() * 10000).toFixed(2)),
    status: ['Completed', 'Pending', 'Failed'][Math.floor(Math.random() * 3)],
    date: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    type: ['Payout', 'Refund'][Math.floor(Math.random() * 2)],
    method: MethodFilterValues[Math.floor(Math.random() * 3)],
    bank: ['HDFC', 'ICICI', 'SBI'][Math.floor(Math.random() * 3)],
    account: Math.floor(Math.random() * 1000000000).toString(),
    name: [
      'John Doe',
      'Jane Doe',
      'Bob Smith',
      'Alice Smith',
      'John Smith',
      'Jane Smith',
      'Bob Doe',
      'Alice Doe',
    ][Math.floor(Math.random() * 8)],
  })),
  // to make sure one item from last week's date is always present
  {
    id: '21',
    paymentId: 'rzp123456',
    amount: 1000,
    status: 'Pending',
    date: new Date(new Date().setDate(new Date().getDate() - 4)),
    type: 'Payout',
    method: {
      key: 'bank-transfer',
      title: 'Bank Transfer',
    },
    bank: 'HDFC',
    account: '1234567890',
    name: 'John Doe',
  },
];

type Item = {
  id: string;
  paymentId: string;
  amount: number;
  status: string;
  date: Date;
  type: string;
  method: {
    key: string;
    title: string;
  };
  bank: string;
  account: string;
  name: string;
};
const data: TableData<Item> = {
  nodes,
};

const quickFilters = ['All', 'Pending', 'Failed', 'Completed'];
const filterChipQuickFilters = ['Pending', 'Failed', 'Completed'];
const quickFilterColorMapping: Record<Item['status'], CounterProps['color']> = {
  All: 'primary',
  Pending: 'notice',
  Failed: 'negative',
  Completed: 'neutral',
};

const DefaultExample: StoryFn<typeof Modal> = (args) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const [formData, setFormData] = React.useState({
    qrUsage: '',
    acceptFixedAmount: '',
    description: '',
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [alert, setAlert] = React.useState<{
    type: 'positive' | 'negative';
    title: string;
    description: string;
  } | null>(null);
  const [isQrGenerated, setIsQrGenerated] = React.useState(false);

  const handleChange = (name: string, value: string | undefined): void => {
    setFormData((prev) => ({ ...prev, [name]: value ?? '' }));
    // Clear error when typing
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.qrUsage) {
      newErrors.qrUsage = 'Please select QR usage type';
    }

    if (!formData.acceptFixedAmount) {
      newErrors.acceptFixedAmount = 'Please select if you want to accept fixed amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (validateForm()) {
      setAlert({
        type: 'positive',
        title: 'Success!',
        description: 'Your QR code has been created successfully.',
      });
      setIsQrGenerated(true);
    } else {
      setAlert({
        type: 'negative',
        title: 'QR Generation Failed',
        description: 'Please fill all the fields correctly',
      });
      setIsQrGenerated(false);
    }
  };

  const renderContent = ({ isMobile }: { isMobile: boolean }): React.ReactElement => (
    <Box display="flex" gap="spacing.4" justifyContent="space-between">
      <Box>
        <form onSubmit={handleSubmit}>
          <Box padding="spacing.4" display="flex" flexDirection="column" gap="spacing.4">
            <Box>
              <Heading size="medium" weight="regular">
                Configure your QR code settings
              </Heading>
            </Box>

            {!isMobile && alert && (
              <Alert
                color={alert.type}
                title={alert.title}
                description={alert.description}
                emphasis="subtle"
                isDismissible
                onDismiss={() => setAlert(null)}
                isFullWidth
              />
            )}

            <Box display="flex" flexDirection="column" gap="spacing.4">
              <RadioGroup
                label="QR Usage"
                name="qrUsage"
                value={formData.qrUsage}
                onChange={({ value }) => handleChange('qrUsage', value)}
                validationState={errors.qrUsage ? 'error' : 'none'}
                errorText={errors.qrUsage}
              >
                <Radio value="single">Single Payment</Radio>
                <Radio value="multiple">Multiple Payments</Radio>
              </RadioGroup>

              <RadioGroup
                label="Accept Fixed Amount"
                name="acceptFixedAmount"
                value={formData.acceptFixedAmount}
                onChange={({ value }) => handleChange('acceptFixedAmount', value)}
                validationState={errors.acceptFixedAmount ? 'error' : 'none'}
                errorText={errors.acceptFixedAmount}
              >
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
              </RadioGroup>

              <TextInput
                label="Description"
                name="description"
                value={formData.description}
                onChange={({ value }) => handleChange('description', value)}
                placeholder="Enter description (optional)"
                helpText="Add a description to identify this QR code"
              />

              {!isMobile && (
                <Button isFullWidth type="submit" iconPosition="right">
                  Create QR Code
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Box>
      {!isMobile && (
        <Box width="500px">
          <PreviewWindow>
            <PreviewHeader />
            <PreviewBody>
              {isQrGenerated ? (
                <Box>
                  <img
                    src="https://blog.razorpay.in/blog-content/uploads/2021/11/QR-codes-blog-header.png"
                    alt="QR Code"
                    height="400px"
                  />
                </Box>
              ) : (
                <Box>
                  <Text>QR Code Preview</Text>
                </Box>
              )}
            </PreviewBody>
            <PreviewFooter />
          </PreviewWindow>
        </Box>
      )}
    </Box>
  );

  const renderPreview = (): React.ReactElement => (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <PreviewWindow>
        <PreviewHeader />
        <PreviewBody>
          <Box display="flex" flexDirection="column" gap="spacing.4">
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
              <img
                src="https://blog.razorpay.in/blog-content/uploads/2021/11/QR-codes-blog-header.png"
                alt="QR Code"
                height="400px"
              />
            </Box>
            <Box padding="spacing.4">
              <Text>QR Code Details:</Text>
              <Box marginTop="spacing.3">
                <Text>
                  Usage: {formData.qrUsage === 'single' ? 'Single Payment' : 'Multiple Payments'}
                </Text>
                <Text>Fixed Amount: {formData.acceptFixedAmount === 'yes' ? 'Yes' : 'No'}</Text>
                {formData.description && <Text>Description: {formData.description}</Text>}
              </Box>
            </Box>
          </Box>
        </PreviewBody>
        <PreviewFooter />
      </PreviewWindow>
    </Box>
  );

  const renderFooter = ({ isMobile }: { isMobile: boolean }): React.ReactElement => (
    <Box display="flex" flexDirection="column" gap="spacing.3" width="100%">
      {isMobile && alert && (
        <Alert
          color={alert.type}
          title={alert.title}
          description={alert.description}
          emphasis="subtle"
          isDismissible
          onDismiss={() => setAlert(null)}
          isFullWidth
        />
      )}
      <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
        <Button variant="secondary" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>

        {isMobile && isQrGenerated && (
          <Button isFullWidth onClick={() => setIsPreviewOpen(true)} iconPosition="right">
            Preview
          </Button>
        )}
        {isMobile && !isQrGenerated && (
          <Button onClick={handleSubmit} iconPosition="right">
            Create QR Code
          </Button>
        )}

        {!isMobile && (
          <Button variant="primary" onClick={handleSubmit} isDisabled={!isQrGenerated}>
            Save
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <Box>
      <Button onClick={() => setIsOpen(!isOpen)}>Create QR Code</Button>
      {isMobile ? (
        <>
          <BottomSheet isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
            <BottomSheetHeader title="Create QR Code" />
            <BottomSheetBody>{renderContent({ isMobile })}</BottomSheetBody>
            <BottomSheetFooter>{renderFooter({ isMobile })}</BottomSheetFooter>
          </BottomSheet>
          <BottomSheet isOpen={isPreviewOpen} onDismiss={() => setIsPreviewOpen(false)}>
            <BottomSheetHeader title="QR Code Preview" />
            <BottomSheetBody>{renderPreview()}</BottomSheetBody>
            <BottomSheetFooter>
              <Box display="flex" gap="spacing.3" justifyContent="flex-end" width="100%">
                <Button variant="secondary" onClick={() => setIsPreviewOpen(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={() => setIsOpen(false)}>
                  Save
                </Button>
              </Box>
            </BottomSheetFooter>
          </BottomSheet>
        </>
      ) : (
        <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="large">
          <ModalHeader title="Create QR Code" />
          <ModalBody>{renderContent({ isMobile })}</ModalBody>
          <ModalFooter>{renderFooter({ isMobile })}</ModalFooter>
        </Modal>
      )}
    </Box>
  );
};
export const Default = DefaultExample.bind({});
Default.storyName = 'Single Step With Form Group and Preview';
