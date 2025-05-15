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
import {
  FileIcon,
  CheckIcon,
  ClockIcon,
  PhoneIcon,
  MailIcon,
  CalendarIcon,
  LockIcon,
} from '~components/Icons';
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
import { StepGroup, StepItem, StepItemIcon } from '~components/StepGroup';
import { Divider } from '~components/Divider';
import { TextArea } from '~components/Input/TextArea';

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

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>): void => {
    e?.preventDefault();
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
      <Box display="flex" gap="spacing.3" justifyContent="space-between" width="100%">
        {isMobile && (
          <Button
            variant="tertiary"
            icon={FileIcon}
            onClick={() => setIsPreviewOpen(true)}
            iconPosition="left"
          />
        )}
        <Box display="flex" width="100%" justifyContent="flex-end" gap="spacing.3">
          <Button variant="tertiary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          {isMobile && !isQrGenerated && (
            <Button onClick={() => handleSubmit()} iconPosition="right">
              Create QR Code
            </Button>
          )}

          {!isMobile && (
            <Button variant="primary" onClick={() => handleSubmit()} isDisabled={!isQrGenerated}>
              Save
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box>
      <Button onClick={() => setIsOpen(!isOpen)}>Create QR Code</Button>
      {isMobile ? (
        isOpen && (
          <Box
            width="100%"
            minHeight="100%"
            backgroundColor="surface.background.gray.moderate"
            display="flex"
            flexDirection="column"
            position="fixed"
            top="spacing.0"
            left="spacing.0"
            zIndex={1000}
          >
            {/* Header with current step name */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              padding="spacing.4"
              backgroundColor="surface.background.gray.subtle"
              borderBottomWidth="thin"
              borderBottomColor="surface.border.gray.muted"
              position="relative"
            >
              <Button
                variant="tertiary"
                size="small"
                onClick={() => setIsOpen(false)}
                accessibilityLabel="Close"
              >
                ×
              </Button>
              <Box flex={1} display="flex" justifyContent="center">
                <Button
                  variant="tertiary"
                  size="small"
                  onClick={() => setShowStepGroup((prev: boolean) => !prev)}
                >
                  {currentStepObj?.title}
                </Button>
              </Box>
              <Box width="spacing.10" /> {/* Spacer for symmetry */}
              {/* StepGroup dropdown/overlay */}
              {showStepGroup && (
                <Box
                  position="absolute"
                  top="100%"
                  left="spacing.0"
                  width="100%"
                  backgroundColor="surface.background.gray.subtle"
                  zIndex={1100}
                  borderBottomLeftRadius="medium"
                  borderBottomRightRadius="medium"
                >
                  <StepGroup orientation="vertical" size="medium">
                    {GRNSteps.filter((s) => s.stepNumber !== 5).map((step) => (
                      <StepItem
                        key={step.stepNumber}
                        title={step.title}
                        description={step.description}
                        marker={getStepIcon(step.stepNumber)}
                        isSelected={currentStep === step.stepNumber}
                        isDisabled={step.stepNumber > currentStep}
                        onClick={() => {
                          if (step.stepNumber <= currentStep) {
                            setCurrentStep(step.stepNumber);
                            setShowStepGroup(false);
                          }
                        }}
                        stepProgress={
                          completedSteps.includes(step.stepNumber)
                            ? 'full'
                            : currentStep === step.stepNumber
                            ? 'start'
                            : 'none'
                        }
                      />
                    ))}
                  </StepGroup>
                </Box>
              )}
            </Box>
            {/* Step content */}
            <Box flex={1} overflow="auto" padding="spacing.4">
              {renderStepContent(isMobile)}
            </Box>
            {/* Navigation buttons always at bottom */}
            {renderFooter({ isMobile })}
            {/* Preview Modal for mobile */}
            {isPreviewOpen && (
              <Modal isOpen onDismiss={() => setIsPreviewOpen(false)} size="full">
                <ModalHeader title="Review GRN Details" />
                <ModalBody height="100%" padding="spacing.0">
                  {renderReviewContent()}
                </ModalBody>
              </Modal>
            )}
          </Box>
        )
      ) : (
        <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="full">
          <ModalHeader title="New GRN" />
          <ModalBody height="100%" padding="spacing.0">
            <Box width="100%" height="100%" display="flex" flexDirection="column">
              <Box display="flex" flex={1}>
                <Box
                  width="300px"
                  padding="spacing.7"
                  backgroundColor="surface.background.gray.moderate"
                >
                  <StepGroup orientation="vertical" size="medium">
                    {GRNSteps.map((step) => (
                      <StepItem
                        key={step.stepNumber}
                        title={step.title}
                        description={step.description}
                        marker={getStepIcon(step.stepNumber)}
                        isSelected={currentStep === step.stepNumber}
                        isDisabled={step.stepNumber > currentStep}
                        onClick={() => handleStepClick(step.stepNumber)}
                        stepProgress={
                          completedSteps.includes(step.stepNumber)
                            ? 'full'
                            : currentStep === step.stepNumber
                            ? 'start'
                            : 'none'
                        }
                      />
                    ))}
                  </StepGroup>
                </Box>
                <Box width="100%" display="flex" flexDirection="column">
                  <Box flex={1} overflow="auto">
                    {renderStepContent(isMobile)}
                  </Box>
                </Box>
              </Box>
            </Box>
          </ModalBody>
        </Modal>
      )}
    </Box>
  );
};
export const Default = DefaultExample.bind({});
Default.storyName = 'Single Step With Form Group and Preview';

const GRNSteps = [
  {
    title: 'Select Vendor',
    description: 'Choose a vendor for the GRN',
    stepNumber: 1,
  },
  {
    title: 'Link PO',
    description: 'Link Purchase Order to GRN',
    stepNumber: 2,
  },
  {
    title: 'GRN Details',
    description: 'Add GRN details and notes',
    stepNumber: 3,
  },
  {
    title: 'Line Item Details',
    description: 'Add line items and quantities',
    stepNumber: 4,
  },
  {
    title: 'Review GRN Details',
    description: 'Review and confirm GRN details',
    stepNumber: 5,
  },
];

const GRNVendors = [
  {
    id: '1',
    name: 'ABC Suppliers',
    email: 'contact@abcsuppliers.com',
    phone: '+91 9876543210',
    address: '123 Business Park, Mumbai',
  },
  {
    id: '2',
    name: 'XYZ Trading Co.',
    email: 'info@xyztrading.com',
    phone: '+91 9876543211',
    address: '456 Corporate Hub, Delhi',
  },
  {
    id: '3',
    name: 'Global Imports Ltd',
    email: 'support@globalimports.com',
    phone: '+91 9876543212',
    address: '789 Trade Center, Bangalore',
  },
  {
    id: '4',
    name: 'Local Distributors',
    email: 'sales@localdist.com',
    phone: '+91 9876543213',
    address: '321 Market Street, Chennai',
  },
];

const GRNPurchaseOrders = [
  {
    id: 'PO-001',
    number: 'PO-2024-001',
    date: '2024-03-15',
    amount: 15000,
    status: 'Pending',
    items: 5,
    vendor: 'ABC Suppliers',
  },
  {
    id: 'PO-002',
    number: 'PO-2024-002',
    date: '2024-03-14',
    amount: 25000,
    status: 'Approved',
    items: 8,
    vendor: 'XYZ Trading Co.',
  },
  {
    id: 'PO-003',
    number: 'PO-2024-003',
    date: '2024-03-13',
    amount: 18000,
    status: 'Pending',
    items: 3,
    vendor: 'Global Imports Ltd',
  },
  {
    id: 'PO-004',
    number: 'PO-2024-004',
    date: '2024-03-12',
    amount: 32000,
    status: 'Approved',
    items: 6,
    vendor: 'Local Distributors',
  },
];

const RadioCard = ({
  value,
  label,
  children,
}: {
  value: string;
  label: string;
  children?: React.ReactNode;
}): React.ReactElement => {
  return (
    <Box display="flex" flexDirection="row" gap="spacing.3" alignItems="flex-start">
      <Radio value={value} />
      <Box display="flex" flexDirection="column" gap="spacing.3">
        <Box display="flex" flexDirection="row" gap="spacing.4">
          <Text weight="medium" color="surface.text.gray.subtle">
            {label}
          </Text>
        </Box>
        {children}
      </Box>
    </Box>
  );
};

const MultiStepExample: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [showStepGroup, setShowStepGroup] = React.useState(false);
  const [selectedVendor, setSelectedVendor] = React.useState<string | null>(null);
  const [selectedPO, setSelectedPO] = React.useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
  const [errors, setErrors] = React.useState<{
    vendor?: string;
    purchaseOrder?: string;
    grnDetails?: string;
    date?: string;
  }>({});
  const [grnDetails, setGrnDetails] = React.useState({
    grnNumber: `GRN-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')}`,
    date: '',
    notes: '',
  });
  const [alert, setAlert] = React.useState<{
    type: 'positive' | 'negative';
    title: string;
    description: string;
  } | null>(null);

  const handleStepClick = (stepNumber: number): void => {
    // Allow clicking on any previous step or the current step
    if (stepNumber <= currentStep) {
      setCurrentStep(stepNumber);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: typeof errors = {};

    if (step === 1 && !selectedVendor) {
      newErrors.vendor = 'Please select a vendor to proceed';
    }

    if (step === 2 && !selectedPO) {
      newErrors.purchaseOrder = 'Please select a purchase order to proceed';
    }

    if (step === 3) {
      if (!grnDetails.date) {
        newErrors.date = 'Date is required';
      } else {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(grnDetails.date)) {
          newErrors.date = 'Please enter a valid date in YYYY-MM-DD format';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (): void => {
    if (currentStep < GRNSteps.length) {
      if (validateStep(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
        setCurrentStep(currentStep + 1);
        if (currentStep === 3) {
          setAlert({
            type: 'positive',
            title: 'Success!',
            description: 'GRN details have been saved successfully.',
          });
        }
      } else if (currentStep === 3) {
        setAlert({
          type: 'negative',
          title: 'Validation Failed',
          description: 'Please fix the errors in the form and try again.',
        });
      }
    }
  };

  const handlePreviousStep = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepIcon = (stepNumber: number): React.ReactElement => {
    if (completedSteps.includes(stepNumber)) {
      return <StepItemIcon icon={CheckIcon} color="positive" />;
    }
    if (stepNumber === currentStep) {
      return <StepItemIcon icon={FileIcon} color="primary" />;
    }
    return <StepItemIcon icon={LockIcon} color="primary" />;
  };
  const tableData = {
    nodes: [
      {
        id: '1',
        name: 'Laptop Dell XPS 13',
        quantity: 2,
        unitPrice: 85000,
      },
      {
        id: '2',
        name: 'Wireless Mouse',
        quantity: 5,
        unitPrice: 1200,
      },
      {
        id: '3',
        name: 'Mechanical Keyboard',
        quantity: 3,
        unitPrice: 4500,
      },
      {
        id: '4',
        name: 'External SSD 1TB',
        quantity: 4,
        unitPrice: 6500,
      },
      {
        id: '5',
        name: 'USB-C Hub',
        quantity: 2,
        unitPrice: 2500,
      },
    ],
  };

  // Dynamically filter steps for mobile (remove review step)
  const visibleSteps = isMobile ? GRNSteps.filter((s) => s.stepNumber !== 5) : GRNSteps;
  const lastStep = visibleSteps[visibleSteps.length - 1].stepNumber;
  const currentStepObj = visibleSteps.find((s) => s.stepNumber === currentStep);

  // Extract review content as a function for reuse
  const renderReviewContent = (): React.ReactElement => (
    <Box
      padding="spacing.7"
      display="flex"
      flexDirection="column"
      gap="spacing.4"
      width="100%"
      height="100%"
      justifyContent="space-between"
    >
      <Box display="flex" flexDirection="column" gap="spacing.2">
        <Heading size="medium">Review GRN Details</Heading>
        <Text>Review and confirm all GRN details before submission.</Text>
      </Box>
      <Divider />
      <Box width="100%">
        <PreviewWindow initialZoom={0.5}>
          <PreviewHeader />
          <PreviewBody>
            <Box
              padding="spacing.4"
              display="flex"
              flexDirection="column"
              gap="spacing.6"
              backgroundColor="surface.background.gray.intense"
            >
              {/* GRN Details Section */}
              <Box
                padding="spacing.4"
                borderBottomWidth="thin"
                borderBottomColor="surface.border.gray.muted"
              >
                <Heading size="large">Goods Receipt Note</Heading>
                <Text size="small" color="surface.text.gray.muted">
                  {grnDetails.grnNumber}
                </Text>
                <Text size="small" color="surface.text.gray.muted">
                  Date: {grnDetails.date}
                </Text>
              </Box>
              {/* Vendor Details Section */}
              <Box>
                <Heading size="medium">Vendor Details</Heading>
                <Box
                  marginTop="spacing.3"
                  padding="spacing.4"
                  backgroundColor="surface.background.gray.moderate"
                  borderRadius="medium"
                >
                  {selectedVendor && (
                    <>
                      <Box display="flex" justifyContent="space-between">
                        <Box>
                          <Text weight="semibold" size="large">
                            {GRNVendors.find((v) => v.id === selectedVendor)?.name}
                          </Text>
                          <Text size="small" color="surface.text.gray.muted">
                            {GRNVendors.find((v) => v.id === selectedVendor)?.email}
                          </Text>
                        </Box>
                      </Box>
                      <Box
                        marginTop="spacing.3"
                        display="flex"
                        flexDirection="column"
                        gap="spacing.2"
                      >
                        <Text size="small">
                          Phone: {GRNVendors.find((v) => v.id === selectedVendor)?.phone}
                        </Text>
                        <Text size="small">
                          Address: {GRNVendors.find((v) => v.id === selectedVendor)?.address}
                        </Text>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
              {/* PO Details Section */}
              <Box>
                <Heading size="medium">Purchase Order Details</Heading>
                <Box
                  marginTop="spacing.3"
                  padding="spacing.4"
                  backgroundColor="surface.background.gray.moderate"
                  borderRadius="medium"
                >
                  {selectedPO && (
                    <>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Text weight="semibold" size="large">
                            {GRNPurchaseOrders.find((p) => p.id === selectedPO)?.number}
                          </Text>
                          <Text size="small" color="surface.text.gray.muted">
                            Date: {GRNPurchaseOrders.find((p) => p.id === selectedPO)?.date}
                          </Text>
                        </Box>
                        <Badge
                          size="medium"
                          color={
                            GRNPurchaseOrders.find((p) => p.id === selectedPO)?.status ===
                            'Approved'
                              ? 'positive'
                              : 'notice'
                          }
                        >
                          {GRNPurchaseOrders.find((p) => p.id === selectedPO)?.status ?? ''}
                        </Badge>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
              {/* Notes Section */}
              {grnDetails.notes && (
                <Box>
                  <Heading size="medium">Notes</Heading>
                  <Box
                    marginTop="spacing.3"
                    padding="spacing.4"
                    backgroundColor="surface.background.gray.moderate"
                    borderRadius="medium"
                  >
                    <Text>{grnDetails.notes}</Text>
                  </Box>
                </Box>
              )}
              {/* Line Items Section */}
              <Box>
                <Heading size="medium">Line Items</Heading>
                <Box marginTop="spacing.3">
                  <Table data={tableData}>
                    {(tableData) => (
                      <>
                        <TableHeader>
                          <TableHeaderRow>
                            <TableHeaderCell>Item Name</TableHeaderCell>
                            <TableHeaderCell>Quantity</TableHeaderCell>
                            <TableHeaderCell>Unit Price</TableHeaderCell>
                            <TableHeaderCell>Total Amount</TableHeaderCell>
                          </TableHeaderRow>
                        </TableHeader>
                        <TableBody>
                          {tableData.map((item) => (
                            <TableRow key={item.id} item={item}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>₹{item.unitPrice.toLocaleString()}</TableCell>
                              <TableCell>
                                ₹{(item.quantity * item.unitPrice).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableFooterRow>
                            <TableFooterCell>Total Amount</TableFooterCell>
                            <TableFooterCell>-</TableFooterCell>
                            <TableFooterCell>-</TableFooterCell>
                            <TableFooterCell>
                              ₹
                              {tableData
                                .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
                                .toLocaleString()}
                            </TableFooterCell>
                          </TableFooterRow>
                        </TableFooter>
                      </>
                    )}
                  </Table>
                </Box>
              </Box>
            </Box>
          </PreviewBody>
          <PreviewFooter />
        </PreviewWindow>
      </Box>
    </Box>
  );

  // In renderStepContent, do not show step 5 on mobile
  const renderStepContent = (isMobile: boolean): React.ReactElement | null => {
    if (isMobile && currentStep === 5) return null;
    switch (currentStep) {
      case 1:
        return (
          <Box
            display="flex"
            flexDirection="column"
            gap="spacing.4"
            width="100%"
            height="100%"
            justifyContent="space-between"
          >
            <Box
              display="flex"
              flexDirection="column"
              padding="spacing.7"
              justifyContent="center"
              alignItems="center"
            >
              <Box display="flex" flexDirection="column" gap="spacing.4">
                <Box>
                  <Heading size="medium">Select Vendor</Heading>
                  <Text>Choose a vendor from the list below to proceed with GRN creation.</Text>
                </Box>
                <Divider />
                <RadioGroup
                  label="Vendors"
                  name="vendor"
                  value={selectedVendor ?? ''}
                  onChange={({ value }) => {
                    setSelectedVendor(value);
                    if (errors.vendor) {
                      setErrors((prev) => ({ ...prev, vendor: undefined }));
                    }
                  }}
                  validationState={errors.vendor ? 'error' : 'none'}
                  errorText={errors.vendor}
                >
                  {GRNVendors.map((vendor) => (
                    <Box
                      key={vendor.id}
                      padding="spacing.4"
                      borderWidth="thin"
                      borderColor={
                        selectedVendor === vendor.id
                          ? 'surface.border.primary.normal'
                          : 'surface.border.gray.muted'
                      }
                      borderRadius="medium"
                    >
                      <RadioCard value={vendor.id} label={vendor.name}>
                        <Box
                          display="flex"
                          gap="spacing.2"
                          flexDirection={isMobile ? 'column' : 'row'}
                        >
                          <Box display="flex" gap="spacing.2">
                            <MailIcon color="interactive.icon.gray.muted" />
                            <Text size="small" color="surface.text.gray.muted">
                              {vendor.email}
                            </Text>
                            {!isMobile && (
                              <Text size="small" color="surface.text.gray.muted">
                                •
                              </Text>
                            )}
                          </Box>
                          <Box display="flex" gap="spacing.2">
                            <PhoneIcon color="interactive.icon.gray.muted" />
                            <Text size="small" color="surface.text.gray.muted">
                              {vendor.phone}
                            </Text>
                          </Box>
                        </Box>
                      </RadioCard>
                    </Box>
                  ))}
                </RadioGroup>
              </Box>
            </Box>
            {!isMobile && (
              <Box
                display="flex"
                justifyContent="space-between"
                marginTop="spacing.4"
                padding="spacing.4"
                borderTopColor="surface.border.gray.muted"
              >
                <Button variant="tertiary" onClick={() => setIsOpen(!isOpen)}>
                  Save and Close
                </Button>
                <Box display="flex" gap="spacing.4">
                  <Button
                    variant="tertiary"
                    onClick={handlePreviousStep}
                    isDisabled={currentStep === 1}
                  >
                    Previous
                  </Button>
                  <Button variant="primary" onClick={handleNextStep}>
                    Next
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        );
      case 2:
        return (
          <Box display="flex" width="100%" height="100%" width="100%">
            <Box display="flex" width="100%" justifyContent="space-between">
              <Box
                flex={6}
                display="flex"
                flexDirection="column"
                height="100%"
                justifyContent="space-between"
                width="100%"
              >
                <Box display="flex" alignItems="center" justifyContent="center" width="100%">
                  <Box padding="spacing.7" width="500px">
                    <Heading size="medium">Link PO</Heading>
                    <Text>Select a Purchase Order to link with this GRN.</Text>
                    <Box flex={1}>
                      <RadioGroup
                        label="Purchase Orders"
                        name="purchaseOrder"
                        value={selectedPO ?? ''}
                        onChange={({ value }) => {
                          setSelectedPO(value);
                          if (errors.purchaseOrder) {
                            setErrors((prev) => ({ ...prev, purchaseOrder: undefined }));
                          }
                        }}
                        validationState={errors.purchaseOrder ? 'error' : 'none'}
                        errorText={errors.purchaseOrder}
                      >
                        {GRNPurchaseOrders.map((po) => (
                          <Box
                            key={po.id}
                            padding="spacing.4"
                            borderWidth="thin"
                            borderColor={
                              selectedPO === po.id
                                ? 'surface.border.primary.normal'
                                : 'surface.border.gray.muted'
                            }
                            borderRadius="medium"
                          >
                            <RadioCard value={po.id} label={po.number}>
                              <Box display="flex" flexDirection="column" gap="spacing.2">
                                <Box display="flex" gap="spacing.2" alignItems="center">
                                  <Text size="small" color="surface.text.gray.muted">
                                    {po.vendor}
                                  </Text>
                                  <Badge
                                    size="medium"
                                    color={po.status === 'Approved' ? 'positive' : 'notice'}
                                  >
                                    {po.status || ''}
                                  </Badge>
                                </Box>
                                <Box display="flex" gap="spacing.2">
                                  <Box display="flex" gap="spacing.2">
                                    <CalendarIcon color="interactive.icon.gray.muted" />
                                    <Text size="small" color="surface.text.gray.muted">
                                      {po.date}
                                    </Text>
                                  </Box>
                                  <Text size="small" color="surface.text.gray.muted">
                                    •
                                  </Text>

                                  <Text size="small" color="surface.text.gray.muted">
                                    {po.items} Items
                                  </Text>
                                  <Text size="small" color="surface.text.gray.muted">
                                    •
                                  </Text>
                                  <Text size="small" color="surface.text.gray.muted">
                                    ₹ {po.amount.toLocaleString()}
                                  </Text>
                                </Box>
                              </Box>
                            </RadioCard>
                          </Box>
                        ))}
                      </RadioGroup>
                    </Box>
                  </Box>
                </Box>
                {!isMobile && (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    marginTop="spacing.4"
                    padding="spacing.4"
                    borderTopColor="surface.border.gray.muted"
                  >
                    <Button variant="tertiary" onClick={() => setIsOpen(!isOpen)}>
                      Save and Close
                    </Button>

                    <Box display="flex" gap="spacing.4">
                      <Button variant="tertiary" onClick={handlePreviousStep}>
                        Previous
                      </Button>
                      <Button variant="primary" onClick={handleNextStep}>
                        Next
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
              <Box flex={4}>
                <PreviewWindow isDragAndZoomDisabled>
                  <PreviewBody>
                    <Box
                      padding="spacing.4"
                      display="flex"
                      flexDirection="column"
                      gap="spacing.4"
                      backgroundColor="surface.background.gray.moderate"
                    >
                      {selectedVendor && (
                        <>
                          <Box>
                            <Text weight="semibold" size="large">
                              {GRNVendors.find((v) => v.id === selectedVendor)?.name}
                            </Text>
                            <Text size="small" color="surface.text.gray.muted">
                              {GRNVendors.find((v) => v.id === selectedVendor)?.email}
                            </Text>
                          </Box>
                          <Box display="flex" flexDirection="column" gap="spacing.2">
                            <Text size="small">
                              Phone: {GRNVendors.find((v) => v.id === selectedVendor)?.phone}
                            </Text>
                            <Text size="small">
                              Address: {GRNVendors.find((v) => v.id === selectedVendor)?.address}
                            </Text>
                          </Box>
                        </>
                      )}
                      {selectedPO && (
                        <Box
                          marginTop="spacing.4"
                          paddingTop="spacing.4"
                          borderTopWidth="thin"
                          borderTopColor="surface.border.gray.muted"
                        >
                          <Text weight="semibold" size="medium">
                            Selected PO
                          </Text>
                          <Box marginTop="spacing.2">
                            <Text size="small">
                              PO Number:{' '}
                              {GRNPurchaseOrders.find((p) => p.id === selectedPO)?.number}
                            </Text>
                            <Text size="small">
                              Amount: ₹
                              {GRNPurchaseOrders.find(
                                (p) => p.id === selectedPO,
                              )?.amount.toLocaleString()}
                            </Text>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </PreviewBody>
                </PreviewWindow>
              </Box>
            </Box>
          </Box>
        );
      case 3:
        return (
          <Box
            display="flex"
            flexDirection="column"
            gap="spacing.4"
            width="100%"
            height="100%"
            justifyContent="space-between"
          >
            <Box padding="spacing.7" display="flex" flexDirection="column" gap="spacing.4">
              <Box>
                <Heading size="medium">GRN Details</Heading>
                <Text>Add additional details for this GRN.</Text>
              </Box>
              <Divider />
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
                <TextInput
                  label="GRN Number"
                  name="grnNumber"
                  value={grnDetails.grnNumber}
                  onChange={({ value }) =>
                    setGrnDetails((prev) => ({ ...prev, grnNumber: value ?? '' }))
                  }
                  isDisabled
                  helpText="Auto-generated GRN number"
                />
                <TextInput
                  label="Date"
                  name="date"
                  value={grnDetails.date}
                  onChange={({ value }) => {
                    setGrnDetails((prev) => ({ ...prev, date: value ?? '' }));
                    if (errors.date) {
                      setErrors((prev) => ({ ...prev, date: undefined }));
                    }
                  }}
                  placeholder="YYYY-MM-DD"
                  validationState={errors.date ? 'error' : 'none'}
                  errorText={errors.date}
                  helpText="Enter date in YYYY-MM-DD format"
                />
                <TextArea
                  label="Notes"
                  name="notes"
                  value={grnDetails.notes}
                  onChange={({ value }) =>
                    setGrnDetails((prev) => ({ ...prev, notes: value ?? '' }))
                  }
                  numberOfLines={4}
                  placeholder="Add any additional notes or comments"
                />
              </Box>
            </Box>
            {!isMobile && (
              <Box
                display="flex"
                justifyContent="space-between"
                marginTop="spacing.4"
                padding="spacing.4"
                borderTopColor="surface.border.gray.muted"
              >
                <Button variant="tertiary" onClick={() => setIsOpen(!isOpen)}>
                  Save and Close
                </Button>
                <Box display="flex" gap="spacing.4">
                  <Button variant="tertiary" onClick={handlePreviousStep}>
                    Previous
                  </Button>
                  <Button variant="primary" onClick={handleNextStep}>
                    Next
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        );
      case 4:
        return (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            gap="spacing.4"
            height="100%"
          >
            <Box padding="spacing.7" display="flex" flexDirection="column" gap="spacing.4">
              <Box>
                <Heading size="medium">Line Item Details</Heading>
                <Text>Add line items and quantities for this GRN.</Text>
              </Box>
              <Divider />
              <Table data={tableData}>
                {(tableData) => (
                  <>
                    <TableHeader>
                      <TableHeaderRow>
                        <TableHeaderCell>Item Name</TableHeaderCell>
                        <TableHeaderCell>Quantity</TableHeaderCell>
                        <TableHeaderCell>Unit Price</TableHeaderCell>
                        <TableHeaderCell>Total Amount</TableHeaderCell>
                      </TableHeaderRow>
                    </TableHeader>
                    <TableBody>
                      {tableData.map((item) => (
                        <TableRow key={item.id} item={item}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>₹{item.unitPrice.toLocaleString()}</TableCell>
                          <TableCell>
                            ₹{(item.quantity * item.unitPrice).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableFooterRow>
                        <TableFooterCell>Total Amount</TableFooterCell>
                        <TableFooterCell>-</TableFooterCell>
                        <TableFooterCell>-</TableFooterCell>
                        <TableFooterCell>
                          ₹
                          {tableData
                            .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
                            .toLocaleString()}
                        </TableFooterCell>
                      </TableFooterRow>
                    </TableFooter>
                  </>
                )}
              </Table>
            </Box>
            {!isMobile && (
              <Box
                display="flex"
                justifyContent="space-between"
                marginTop="spacing.4"
                padding="spacing.4"
                borderTopColor="surface.border.gray.muted"
              >
                <Button variant="tertiary" onClick={() => setIsOpen(!isOpen)}>
                  Save and Close
                </Button>
                <Box display="flex" gap="spacing.4">
                  <Button variant="tertiary" onClick={handlePreviousStep}>
                    Previous
                  </Button>
                  <Button variant="primary" onClick={handleNextStep}>
                    Next
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        );
      case 5:
        // Only show on desktop
        if (!isMobile) {
          return renderReviewContent();
        }
        return null;
      default:
        return null;
    }
  };

  // In the footer, show Preview button on mobile for step 2 and 4
  const renderFooter = (): React.ReactElement => {
    const showPreview = isMobile && (currentStep === 2 || currentStep === 4);
    return (
      <Box
        display="flex"
        flexDirection="column"
        gap="spacing.4"
        padding="spacing.4"
        backgroundColor="surface.background.gray.subtle"
        borderTopWidth="thin"
        borderTopColor="surface.border.gray.muted"
        position="sticky"
        bottom="spacing.0"
        zIndex={1001}
      >
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
        <Box display="flex" gap="spacing.4" justifyContent="space-between">
          <Button variant="tertiary" onClick={handlePreviousStep} isDisabled={currentStep === 1}>
            Previous
          </Button>
          {showPreview && (
            <Button variant="tertiary" onClick={() => setIsPreviewOpen(true)}>
              Preview
            </Button>
          )}
          <Button variant="primary" onClick={handleNextStep}>
            {currentStep === lastStep ? 'Submit GRN' : 'Next'}
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Box>
      <Button onClick={() => setIsOpen(!isOpen)}>Create QR Code</Button>
      {isMobile ? (
        isOpen && (
          <Box
            width="100%"
            minHeight="100%"
            backgroundColor="surface.background.gray.moderate"
            display="flex"
            flexDirection="column"
            position="fixed"
            top="spacing.0"
            left="spacing.0"
            zIndex={1000}
          >
            {/* Header with current step name */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              padding="spacing.4"
              backgroundColor="surface.background.gray.subtle"
              borderBottomWidth="thin"
              borderBottomColor="surface.border.gray.muted"
              position="relative"
            >
              <Button
                variant="tertiary"
                size="small"
                onClick={() => setIsOpen(false)}
                accessibilityLabel="Close"
              >
                ×
              </Button>
              <Box flex={1} display="flex" justifyContent="center">
                <Button
                  variant="tertiary"
                  size="small"
                  onClick={() => setShowStepGroup((prev: boolean) => !prev)}
                >
                  {currentStepObj?.title}
                </Button>
              </Box>
              <Box width="spacing.10" /> {/* Spacer for symmetry */}
              {/* StepGroup dropdown/overlay */}
              {showStepGroup && (
                <Box
                  position="absolute"
                  top="100%"
                  left="spacing.0"
                  width="100%"
                  backgroundColor="surface.background.gray.subtle"
                  zIndex={1100}
                  borderBottomLeftRadius="medium"
                  borderBottomRightRadius="medium"
                >
                  <StepGroup orientation="vertical" size="medium">
                    {GRNSteps.filter((s) => s.stepNumber !== 5).map((step) => (
                      <StepItem
                        key={step.stepNumber}
                        title={step.title}
                        description={step.description}
                        marker={getStepIcon(step.stepNumber)}
                        isSelected={currentStep === step.stepNumber}
                        isDisabled={step.stepNumber > currentStep}
                        onClick={() => {
                          if (step.stepNumber <= currentStep) {
                            setCurrentStep(step.stepNumber);
                            setShowStepGroup(false);
                          }
                        }}
                        stepProgress={
                          completedSteps.includes(step.stepNumber)
                            ? 'full'
                            : currentStep === step.stepNumber
                            ? 'start'
                            : 'none'
                        }
                      />
                    ))}
                  </StepGroup>
                </Box>
              )}
            </Box>
            {/* Step content */}
            <Box flex={1} overflow="auto" padding="spacing.4">
              {renderStepContent(isMobile)}
            </Box>
            {/* Navigation buttons always at bottom */}
            {renderFooter()}
            {/* Preview Modal for mobile */}
            {isPreviewOpen && (
              <Modal isOpen onDismiss={() => setIsPreviewOpen(false)} size="full">
                <ModalHeader title="Review GRN Details" />
                <ModalBody height="100%" padding="spacing.0">
                  {renderReviewContent()}
                </ModalBody>
              </Modal>
            )}
          </Box>
        )
      ) : (
        <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="full">
          <ModalHeader title="New GRN" />
          <ModalBody height="100%" padding="spacing.0">
            <Box width="100%" height="100%" display="flex" flexDirection="column">
              <Box display="flex" flex={1}>
                <Box
                  width="300px"
                  padding="spacing.7"
                  backgroundColor="surface.background.gray.moderate"
                >
                  <StepGroup orientation="vertical" size="medium">
                    {GRNSteps.map((step) => (
                      <StepItem
                        key={step.stepNumber}
                        title={step.title}
                        description={step.description}
                        marker={getStepIcon(step.stepNumber)}
                        isSelected={currentStep === step.stepNumber}
                        isDisabled={step.stepNumber > currentStep}
                        onClick={() => handleStepClick(step.stepNumber)}
                        stepProgress={
                          completedSteps.includes(step.stepNumber)
                            ? 'full'
                            : currentStep === step.stepNumber
                            ? 'start'
                            : 'none'
                        }
                      />
                    ))}
                  </StepGroup>
                </Box>
                <Box width="100%" display="flex" flexDirection="column">
                  <Box flex={1} overflow="auto">
                    {renderStepContent(isMobile)}
                  </Box>
                </Box>
              </Box>
            </Box>
          </ModalBody>
        </Modal>
      )}
    </Box>
  );
};

export const MultiStep = MultiStepExample.bind({});
MultiStep.storyName = 'Multi Step Example';
