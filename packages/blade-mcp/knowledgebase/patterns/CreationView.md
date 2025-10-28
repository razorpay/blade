# CreationView

## Pattern Name

CreationView

## Description

CreationView is a pattern used in creation flows to guide users through the process of creating new entities like QR codes, GRNs, or other business objects. It provides a structured approach with form inputs, validation, preview capabilities, and step-by-step guidance. The pattern adapts to different screen sizes, using modals on desktop and full-screen overlays on mobile, ensuring optimal user experience across devices.

## Components Used

- Modal
- BottomSheet
- Box
- Button
- RadioGroup
- Radio
- TextInput
- TextArea
- Alert
- Preview
- StepGroup
- Table
- DatePicker
- Card
- Badge
- Heading
- Text
- Divider
- ProgressBar
- ChipGroup
- Chip

## Example

### Single Step Creation Flow with Form and Preview

This example demonstrates a simple creation flow with form inputs and real-time preview functionality.

```tsx
import React from 'react';
import {
  Box,
  Button,
  RadioGroup,
  Radio,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Preview,
  PreviewHeader,
  PreviewBody,
  PreviewFooter,
  Heading,
  Alert,
  TextInput,
  Text,
} from '@razorpay/blade/components';

function SingleStepCreationView() {
  const [isOpen, setIsOpen] = React.useState(false);
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

  const renderContent = (): React.ReactElement => (
    <Box display="flex" gap="spacing.4" justifyContent="space-between">
      <Box>
        <form onSubmit={handleSubmit}>
          <Box padding="spacing.4" display="flex" flexDirection="column" gap="spacing.4">
            <Box>
              <Heading size="medium" weight="regular">
                Configure your QR code settings
              </Heading>
            </Box>

            {alert && (
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

              <Button isFullWidth type="submit" iconPosition="right">
                Create QR Code
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
      <Box width="500px">
        <Preview>
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
        </Preview>
      </Box>
    </Box>
  );

  const renderFooter = (): React.ReactElement => (
    <Box display="flex" flexDirection="column" gap="spacing.3" width="100%">
      <Box display="flex" gap="spacing.3" justifyContent="space-between" width="100%">
        <Box display="flex" width="100%" justifyContent="flex-end" gap="spacing.3">
          <Button variant="tertiary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box>
      <Button onClick={() => setIsOpen(!isOpen)}>Create QR Code</Button>
      <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="large">
        <ModalHeader title="Create QR Code" />
        <ModalBody>{renderContent()}</ModalBody>
        <ModalFooter>{renderFooter()}</ModalFooter>
      </Modal>
    </Box>
  );
}

export default SingleStepCreationView;
```

### Multi-Step Creation Flow with Responsive Design

This example shows a comprehensive multi-step creation flow that adapts to mobile and desktop screens with step navigation, validation, and preview capabilities.

```tsx
import React from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { useTheme, useBreakpoint } from '@razorpay/blade/utils';
import {
  Box,
  Button,
  RadioGroup,
  Radio,
  Modal,
  ModalHeader,
  ModalBody,
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  Preview,
  PreviewHeader,
  PreviewBody,
  PreviewFooter,
  Heading,
  Alert,
  TextInput,
  TextArea,
  Text,
  StepGroup,
  StepItem,
  StepItemIcon,
  Card,
  CardBody,
  Badge,
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TableFooterRow,
  TableFooterCell,
  DatePicker,
  Divider,
  ProgressBar,
  Slide,
  Fade,
  CheckIcon,
  FileIcon,
  LockIcon,
  InfoIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@razorpay/blade/components';

const steps = [
  { title: 'Select Vendor', description: 'Choose a vendor for the GRN', stepNumber: 1 },
  { title: 'Link PO', description: 'Link Purchase Order to GRN', stepNumber: 2 },
  { title: 'GRN Details', description: 'Add GRN details and notes', stepNumber: 3 },
  { title: 'Line Item Details', description: 'Add line items and quantities', stepNumber: 4 },
  { title: 'Review GRN Details', description: 'Review and confirm GRN details', stepNumber: 5 },
];

const vendors = [
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
];

const purchaseOrders = [
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
];

const tableData = {
  nodes: [
    { id: '1', name: 'Laptop Dell XPS 13', quantity: 2, unitPrice: 85000 },
    { id: '2', name: 'Wireless Mouse', quantity: 5, unitPrice: 1200 },
    { id: '3', name: 'Mechanical Keyboard', quantity: 3, unitPrice: 4500 },
  ],
};

function MultiStepCreationView({
  withProgressBar = false,
  modalSize = 'full',
}: {
  withProgressBar?: boolean;
  modalSize?: 'small' | 'medium' | 'large' | 'full';
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';
  const [currentStep, setCurrentStep] = React.useState(1);
  const [showStepGroup, setShowStepGroup] = React.useState(false);
  const [selectedVendor, setSelectedVendor] = React.useState<string | null>(null);
  const [selectedPO, setSelectedPO] = React.useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState<boolean>(false);
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

  const onStepGroupChange = (): void => {
    setAlert(null);
    setErrors({});
  };

  const handleStepClick = (stepNumber: number): void => {
    // Allow clicking on any previous step or the current step
    if (stepNumber <= currentStep) {
      setCurrentStep(stepNumber);
    }
    setShowStepGroup(false);
    onStepGroupChange();
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
        // Check date format and validity using dayjs
        const date = dayjs(grnDetails.date, 'YYYY-MM-DD', true);

        if (!date.isValid()) {
          newErrors.date = 'Please enter a valid date in YYYY-MM-DD format';
        } else {
          // Check if date is in the past
          const today = dayjs().startOf('day');
          if (date.isBefore(today)) {
            newErrors.date = 'Date cannot be in the past';
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (): void => {
    if (currentStep < steps.length) {
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
      onStepGroupChange();
    }
  };

  const getStepIcon = (stepNumber: number): React.ReactElement => {
    if (alert?.type === 'negative' && stepNumber === currentStep) {
      return <StepItemIcon icon={InfoIcon} color="negative" />;
    }
    if (completedSteps.includes(stepNumber)) {
      return <StepItemIcon icon={CheckIcon} color="positive" />;
    }
    if (stepNumber === currentStep) {
      return <StepItemIcon icon={FileIcon} color="primary" />;
    }
    return <StepItemIcon icon={LockIcon} color="primary" />;
  };

  // Dynamically filter steps for mobile (remove review step)
  const visibleSteps = isMobile ? steps.filter((s) => s.stepNumber !== 5) : steps;
  const lastStep = visibleSteps[visibleSteps.length - 1].stepNumber;
  const currentStepObj = visibleSteps.find((s) => s.stepNumber === currentStep);

  const resetState = (): void => {
    setCurrentStep(1);
    setSelectedVendor(null);
    setSelectedPO(null);
    setCompletedSteps([]);
    setErrors({});
    setAlert(null);
    setGrnDetails({
      grnNumber: `GRN-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`,
      date: '',
      notes: '',
    });
  };

  const handleDateChange = (value: Date | undefined): void => {
    setGrnDetails((prev) => ({
      ...prev,
      date: value ? dayjs(value).format('YYYY-MM-DD') : '',
    }));
    if (errors.date) {
      setErrors((prev) => ({ ...prev, date: undefined }));
    }
  };

  const deskTopFooter = ({ isLastStep }: { isLastStep?: boolean }): React.ReactElement => {
    return (
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
          <Button
            variant="primary"
            onClick={
              isLastStep
                ? () => {
                    resetState();
                    setIsOpen(false);
                  }
                : handleNextStep
            }
          >
            {isLastStep ? 'Submit' : 'Next'}
          </Button>
        </Box>
      </Box>
    );
  };

  // Move user from step 5 to step 4 when switching to mobile (mobile doesn't show review step)
  React.useEffect(() => {
    if (isMobile && currentStep === 5) {
      setCurrentStep(4);
    }
  }, [isMobile]);

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

  const renderReviewContent = (): React.ReactElement => (
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
        flexDirection={isMobile ? 'column' : 'row'}
        padding="spacing.7"
        gap="spacing.4"
        width="100%"
        height="100%"
        justifyContent="space-between"
      >
        <Divider />
        <Box width="100%" height={isMobile ? '400px' : '600px'}>
          <Preview defaultZoom={0.5}>
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
                    backgroundColor="surface.background.gray.intense"
                    borderRadius="medium"
                  >
                    {selectedVendor && (
                      <>
                        <Box display="flex" justifyContent="space-between">
                          <Box>
                            <Text weight="semibold" size="large">
                              {vendors.find((v) => v.id === selectedVendor)?.name}
                            </Text>
                            <Text size="small" color="surface.text.gray.muted">
                              {vendors.find((v) => v.id === selectedVendor)?.email}
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
                            Phone: {vendors.find((v) => v.id === selectedVendor)?.phone}
                          </Text>
                          <Text size="small">
                            Address: {vendors.find((v) => v.id === selectedVendor)?.address}
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
                              {purchaseOrders.find((p) => p.id === selectedPO)?.number}
                            </Text>
                            <Text size="small" color="surface.text.gray.muted">
                              Date: {purchaseOrders.find((p) => p.id === selectedPO)?.date}
                            </Text>
                          </Box>
                          <Badge
                            size="medium"
                            color={
                              purchaseOrders.find((p) => p.id === selectedPO)?.status === 'Approved'
                                ? 'positive'
                                : 'notice'
                            }
                          >
                            {purchaseOrders.find((p) => p.id === selectedPO)?.status ?? ''}
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
                                  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
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
          </Preview>
        </Box>
      </Box>
      {!isMobile && deskTopFooter({ isLastStep: true })}
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
                  {vendors.map((vendor) => (
                    <Card
                      key={vendor.id}
                      padding="spacing.4"
                      borderRadius="medium"
                      elevation="none"
                      as="label"
                      accessibilityLabel={vendor.name}
                      marginBottom="spacing.2"
                    >
                      <CardBody>
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
                      </CardBody>
                    </Card>
                  ))}
                </RadioGroup>
              </Box>
            </Box>
            {!isMobile && deskTopFooter({})}
          </Box>
        );
      case 2:
        return (
          <Box display="flex" width="100%" height="100%">
            <Box display="flex" flexDirection="column" width="100%" justifyContent="space-between">
              <Box display="flex" width="100%" justifyContent="space-between" height="100%">
                <Box
                  flex={6}
                  display="flex"
                  flexDirection="column"
                  height="100%"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Box display="flex" alignItems="center" justifyContent="center" width="100%">
                    <Box padding="spacing.5" width="500px">
                      <Box display="flex" flexDirection="column" gap="spacing.2">
                        <Heading size="medium">Link PO</Heading>
                        <Text>Select a Purchase Order to link with this GRN.</Text>
                      </Box>

                      <Box flex={1} gap="spacing.2" marginTop="spacing.2">
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
                          {purchaseOrders.map((po) => (
                            <Card
                              as="label"
                              accessibilityLabel={po.number}
                              isSelected={selectedPO === po.id}
                              marginBottom="spacing.2"
                              key={po.id}
                              elevation="none"
                            >
                              <CardBody>
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
                              </CardBody>
                            </Card>
                          ))}
                        </RadioGroup>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                {!isMobile && (
                  <Box flex={4}>
                    <Preview isDragAndZoomDisabled>
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
                                  {vendors.find((v) => v.id === selectedVendor)?.name}
                                </Text>
                                <Text size="small" color="surface.text.gray.muted">
                                  {vendors.find((v) => v.id === selectedVendor)?.email}
                                </Text>
                              </Box>
                              <Box display="flex" flexDirection="column" gap="spacing.2">
                                <Text size="small">
                                  Phone: {vendors.find((v) => v.id === selectedVendor)?.phone}
                                </Text>
                                <Text size="small">
                                  Address: {vendors.find((v) => v.id === selectedVendor)?.address}
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
                                  {purchaseOrders.find((p) => p.id === selectedPO)?.number}
                                </Text>
                                <Text size="small">
                                  Amount: ₹
                                  {purchaseOrders
                                    .find((p) => p.id === selectedPO)
                                    ?.amount.toLocaleString()}
                                </Text>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </PreviewBody>
                    </Preview>
                  </Box>
                )}
              </Box>
              {!isMobile && deskTopFooter({})}
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
                <DatePicker
                  label="Date"
                  name="date"
                  value={grnDetails.date ? dayjs(grnDetails.date).toDate() : undefined}
                  onApply={(value) => {
                    handleDateChange(value);
                  }}
                  onChange={(value) => {
                    handleDateChange(value);
                  }}
                  onOpenChange={() => {
                    setIsDatePickerOpen((prev) => !prev);
                  }}
                  validationState={errors.date ? 'error' : 'none'}
                  errorText={errors.date}
                  helpText="Select the GRN date"
                  isRequired
                  necessityIndicator="required"
                  minDate={new Date()} // Prevents selecting past dates
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
            {!isMobile && deskTopFooter({})}
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
                            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                            .reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
                            .toLocaleString()}
                        </TableFooterCell>
                      </TableFooterRow>
                    </TableFooter>
                  </>
                )}
              </Table>
            </Box>
            {!isMobile && deskTopFooter({})}
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
  const renderFooter = (): React.ReactElement => {
    const showPreview = isMobile && currentStep === lastStep;
    return (
      <Box
        display="flex"
        flexDirection="column"
        gap="spacing.4"
        padding="spacing.4"
        backgroundColor="surface.background.gray.subtle"
        borderTopWidth="thin"
        borderTopColor="surface.border.gray.muted"
        position="fixed"
        bottom="spacing.0"
        zIndex={1001}
        width="100%"
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
          <Box display="flex" gap="spacing.2">
            {showPreview && (
              <Button
                variant="tertiary"
                icon={FileIcon}
                onClick={() => setIsPreviewOpen(true)}
                iconPosition="left"
              >
                Preview
              </Button>
            )}
            <Button variant="tertiary" onClick={handlePreviousStep} isDisabled={currentStep === 1}>
              Previous
            </Button>
          </Box>
          <Button
            variant="primary"
            onClick={
              currentStep === lastStep
                ? () => {
                    resetState();
                    setIsOpen(false);
                  }
                : handleNextStep
            }
          >
            {currentStep === lastStep ? 'Submit' : 'Next'}
          </Button>
        </Box>
      </Box>
    );
  };

  const renderStepGroup = (): React.ReactElement => {
    return (
      <StepGroup orientation="vertical" size="medium">
        {visibleSteps.map((step) => (
          <StepItem
            key={step.stepNumber}
            title={step.title}
            description={step.description}
            titleColor={
              alert?.type === 'negative' && step.stepNumber === currentStep
                ? 'feedback.text.negative.intense'
                : undefined
            }
            marker={getStepIcon(step.stepNumber)}
            isSelected={alert?.type === 'negative' ? false : currentStep === step.stepNumber}
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
    );
  };

  const BackdropContainer = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.overlay.background.subtle};
    z-index: 1004;
  `;
  return (
    <Box>
      <Button onClick={() => setIsOpen(!isOpen)}>Create GNR Details</Button>
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
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                if (!withProgressBar) {
                  setShowStepGroup((prev: boolean) => !prev);
                }
              }}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onKeyDown={() => {}}
              style={{
                zIndex: 1006,
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                padding="spacing.4"
                backgroundColor="surface.background.gray.subtle"
                borderBottomWidth="thin"
                borderBottomColor="surface.border.gray.muted"
                position="relative"
              >
                <Box display="flex" alignItems="center" gap="spacing.4">
                  {alert?.type === 'negative' && (
                    <InfoIcon color="feedback.icon.negative.intense" />
                  )}
                  {withProgressBar ? (
                    <Heading
                      as="h2"
                      size="medium"
                      weight="semibold"
                      color="surface.text.gray.normal"
                      wordBreak="break-word"
                    >
                      New GRN
                    </Heading>
                  ) : (
                    <>
                      <Badge color={alert?.type === 'negative' ? 'negative' : undefined}>
                        {' '}
                        {currentStep} / {lastStep}{' '}
                      </Badge>
                      <Heading size="small">{currentStepObj?.title}</Heading>
                      {showStepGroup ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </>
                  )}
                </Box>
              </Box>
            </div>
            <ProgressBar
              value={(currentStep / lastStep) * 100}
              showPercentage={false}
              size="medium"
              color={alert?.type === 'negative' ? 'negative' : undefined}
            />

            <Box>
              <Slide
                direction="top"
                fromOffset="100%"
                motionTriggers={['mount']}
                isVisible={showStepGroup}
              >
                <Box
                  position="fixed"
                  top="51px"
                  left="spacing.0"
                  backgroundColor="surface.background.gray.intense"
                  zIndex={1005}
                  width="100%"
                  height="272px"
                  borderBottomLeftRadius="2xlarge"
                  borderBottomRightRadius="2xlarge"
                  padding="spacing.7"
                  paddingTop="spacing.0"
                >
                  {renderStepGroup()}
                </Box>
              </Slide>
              <Fade motionTriggers={['mount']} isVisible={showStepGroup} shouldUnmountWhenHidden>
                <BackdropContainer onClick={() => setShowStepGroup((prev: boolean) => !prev)} />
              </Fade>
            </Box>
            {/* Step content */}
            <Box
              overflow="auto"
              height="calc(100vh - 100px)"
              padding="spacing.4"
              paddingBottom="spacing.8"
            >
              {renderStepContent(isMobile)}
            </Box>
            {!isDatePickerOpen && !isPreviewOpen && renderFooter()}
            {/* Preview BottomSheet for mobile */}
            {isPreviewOpen && isMobile && (
              <BottomSheet
                isOpen={isPreviewOpen}
                onDismiss={() => setIsPreviewOpen(false)}
                snapPoints={[0.9, 0.9, 0.9]}
              >
                <BottomSheetHeader title="Review GRN Details" />
                <BottomSheetBody padding="spacing.0">{renderReviewContent()}</BottomSheetBody>
              </BottomSheet>
            )}
          </Box>
        )
      ) : (
        <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size={modalSize}>
          <ModalHeader title="New GRN" />
          {withProgressBar && (
            <ProgressBar
              value={(currentStep / lastStep) * 100}
              showPercentage={false}
              size="medium"
              color={alert?.type === 'negative' ? 'negative' : undefined}
            />
          )}
          <ModalBody height="100%" padding="spacing.0">
            <Box width="100%" height="100%" display="flex" flexDirection="column">
              <Box display="flex" flex={1}>
                {!withProgressBar && (
                  <Box
                    width="300px"
                    padding="spacing.7"
                    backgroundColor="surface.background.gray.moderate"
                  >
                    {renderStepGroup()}
                  </Box>
                )}

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
}

export default MultiStepCreationView;

// With StepGroup + full size modal
const MultiStepCreationViewStepGroup = () => {
  return <MultiStepCreationView />;
};

// With ProgressBar + full size modal
const MultiStepCreationViewProgressBar = () => {
  return <MultiStepCreationView withProgressBar />;
};

// With StepGroup + medium size modal
const MultiStepCreationViewMediumSizeModal = () => {
  return <MultiStepCreationView modalSize="medium" />;
};
```

### Edit and Add Modal Example

This example demonstrates a simple edit and add modal with responsive design that adapts to mobile and desktop screens.

```tsx
import React from 'react';
import {
  Box,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  BottomSheetFooter,
  Text,
  TextInput,
} from '@razorpay/blade/components';
import { useBreakpoint, useTheme } from '@razorpay/blade/utils';

function ResponsiveModalWrapper({
  children,
  footer,
  isOpen,
  onDismiss,
  modalBodyPadding,
  modalSize = 'small',
  wrapInBottomSheetFooter = false,
  customSnapPoints = [0.35, 0.5, 0.85],
}: {
  children: React.ReactElement | React.ReactElement[];
  footer?: React.ReactElement;
  isOpen: boolean;
  onDismiss: () => void;
  modalBodyPadding?: 'spacing.0' | 'spacing.6' | undefined;
  modalSize?: 'small' | 'medium' | 'large' | 'full';
  wrapInBottomSheetFooter?: boolean;
  customSnapPoints?: [number, number, number];
}): React.ReactNode {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onDismiss={onDismiss} snapPoints={customSnapPoints}>
        <BottomSheetHeader />
        <BottomSheetBody padding="spacing.5">
          {children}
          {footer && !wrapInBottomSheetFooter && <Box marginTop="spacing.6">{footer}</Box>}
        </BottomSheetBody>
        {footer && wrapInBottomSheetFooter && <BottomSheetFooter>{footer}</BottomSheetFooter>}
      </BottomSheet>
    );
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} size={modalSize}>
      <ModalHeader />
      <ModalBody padding={modalBodyPadding}>{children}</ModalBody>
      {footer && <ModalFooter>{footer}</ModalFooter>}
    </Modal>
  );
}

function EditAndAddModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ResponsiveModalWrapper
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        footer={
          <Box display="flex" gap="spacing.5" justifyContent="flex-end" width="100%">
            <Button variant="tertiary" isFullWidth={isMobile}>
              Cancel
            </Button>
            <Button isFullWidth={isMobile}>Update</Button>
          </Box>
        }
      >
        <Box display="flex" flexDirection="column" gap="spacing.2">
          <Text size="large" weight="semibold">
            Edit display name
          </Text>
          <Text size="medium" weight="regular" color="surface.text.gray.muted">
            The new display name will reflect immediately on your dashboard after you update it. It
            will be visible to you and your team on the Razorpay dashboard.
          </Text>
        </Box>
        <Box marginTop="spacing.5">
          <TextInput label="Enter new display name" placeholder="Enter your display name" />
        </Box>
      </ResponsiveModalWrapper>
    </Box>
  );
}

export default EditAndAddModal;
```

### Flow Selection Modal Example

This example demonstrates how to create flow selection modals with varying card counts and corresponding modal sizes:.

```tsx
import React from 'react';
import {
  Box,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  BottomSheetFooter,
  Card,
  CardBody,
  Text,
  Heading,
  ZapIcon,
} from '@razorpay/blade/components';
import { useBreakpoint, useTheme } from '@razorpay/blade/utils';

function ResponsiveModalWrapper({
  children,
  footer,
  isOpen,
  onDismiss,
  modalBodyPadding,
  modalSize = 'small',
  wrapInBottomSheetFooter = false,
  customSnapPoints = [0.35, 0.5, 0.85],
}: {
  children: React.ReactElement | React.ReactElement[];
  footer?: React.ReactElement;
  isOpen: boolean;
  onDismiss: () => void;
  modalBodyPadding?: 'spacing.0' | 'spacing.6' | undefined;
  modalSize?: 'small' | 'medium' | 'large' | 'full';
  wrapInBottomSheetFooter?: boolean;
  customSnapPoints?: [number, number, number];
}): React.ReactNode {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onDismiss={onDismiss} snapPoints={customSnapPoints}>
        <BottomSheetHeader />
        <BottomSheetBody padding="spacing.5">
          {children}
          {footer && !wrapInBottomSheetFooter && <Box marginTop="spacing.6">{footer}</Box>}
        </BottomSheetBody>
        {footer && wrapInBottomSheetFooter && <BottomSheetFooter>{footer}</BottomSheetFooter>}
      </BottomSheet>
    );
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} size={modalSize}>
      <ModalHeader />
      <ModalBody padding={modalBodyPadding}>{children}</ModalBody>
      {footer && <ModalFooter>{footer}</ModalFooter>}
    </Modal>
  );
}

function FlowSelectionModal({ cardCount = 3 }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedMethod, setSelectedMethod] = React.useState('');

  // Dynamic modal size and grid layout based on card count
  const getModalSize = () => {
    if (cardCount === 2) return 'small';
    if (cardCount === 3) return 'medium';
    return 'large';
  };

  const getGridLayout = () => {
    if (cardCount === 2) return { base: '1fr 1fr', m: '1fr 1fr' };
    if (cardCount === 3) return { base: '1fr 1fr', m: '1fr 1fr 1fr' };
    return { base: '1fr 1fr', m: '1fr 1fr 1fr 1fr' };
  };

  const getCardWidth = () => {
    if (cardCount === 2) return isMobile ? '165px' : '160px';
    if (cardCount === 3) return isMobile ? '165px' : '230px';
    return isMobile ? '165px' : '220px';
  };

  const paymentMethods = [
    {
      value: 'quickpay',
      title: 'Quick Pay Button',
      subtitle:
        'Accepting fixed price payments? Customers make quick payments of fixed price through this button',
      icon: ZapIcon,
    },
    {
      value: 'buynow',
      title: 'Buy Now Button',
      subtitle:
        'Selling products or event tickets? Sell multiple items with support for quantity using this button.',
      icon: ZapIcon,
    },
    {
      value: 'custom',
      title: 'Custom Button',
      subtitle:
        'Build your own button with your own design and branding or use our pre-built templates.',
      icon: ZapIcon,
      isDisabled: true,
    },
  ].slice(0, cardCount); // Dynamic content based on cardCount

  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ResponsiveModalWrapper
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        modalSize={getModalSize()}
        footer={
          <Box display="flex" gap="spacing.5" justifyContent="flex-end" width="100%">
            <Button variant="tertiary" isFullWidth={isMobile} onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              isDisabled={!selectedMethod}
              onClick={() => {
                console.log('Selected payment method:', selectedMethod);
                setIsOpen(false);
              }}
              isFullWidth={isMobile}
            >
              Proceed
            </Button>
          </Box>
        }
        modalBodyPadding="spacing.0"
        wrapInBottomSheetFooter
        customSnapPoints={[0.8, 0.9, 0.95]}
      >
        <Box
          paddingX="spacing.6"
          paddingTop="spacing.6"
          display="flex"
          flexDirection="column"
          gap="spacing.1"
        >
          <Heading size="small" weight="semibold">
            Pick a Button Type
          </Heading>
          <Text color="surface.text.gray.muted" size="small" weight="regular">
            Pick a button which meets your requirements and get a head start on collecting payments
            or you could build your own
          </Text>
        </Box>
        <Box padding="spacing.6">
          <Box
            display="grid"
            gridTemplateColumns={getGridLayout()}
            justifyItems="center"
            gap="spacing.5"
            width="100%"
          >
            {paymentMethods.map((method, index) => (
              <Card
                key={`${method.value}-${index}`}
                isSelected={selectedMethod === method.value}
                onClick={method.isDisabled ? undefined : () => setSelectedMethod(method.value)}
                padding="spacing.0"
                accessibilityLabel={`Select ${method.title}`}
                width={getCardWidth()}
                height={isMobile ? '184px' : undefined}
                borderRadius="medium"
                elevation="none"
                cursor={method.isDisabled ? 'not-allowed' : 'pointer'}
              >
                <CardBody>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    marginTop="spacing.6"
                    marginX="spacing.5"
                  >
                    <Box
                      padding="10px"
                      backgroundColor={
                        method.isDisabled
                          ? 'surface.background.gray.subtle'
                          : 'surface.background.primary.subtle'
                      }
                      width="40px"
                      height="40px"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      borderRadius="medium"
                    >
                      <method.icon
                        color={
                          method.isDisabled
                            ? 'surface.icon.gray.muted'
                            : 'surface.icon.primary.normal'
                        }
                        size="large"
                      />
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="row"
                    gap="spacing.4"
                    alignItems="center"
                    paddingX="spacing.5"
                    paddingY="spacing.4"
                  >
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                      maxHeight="95px"
                      gap="spacing.2"
                    >
                      <Text
                        size="medium"
                        weight="semibold"
                        color={
                          method.isDisabled ? 'surface.text.gray.muted' : 'surface.text.gray.normal'
                        }
                      >
                        {method.title}
                      </Text>
                      <Text size="small" color="surface.text.gray.muted" textAlign="center">
                        {method.subtitle}
                      </Text>
                    </Box>
                  </Box>
                </CardBody>
              </Card>
            ))}
          </Box>
        </Box>
      </ResponsiveModalWrapper>
    </Box>
  );
}

export default FlowSelectionModal;

// 2 Cards - Small Modal
const FlowSelection2Cards = () => {
  return <FlowSelectionModal cardCount={2} />;
};

// 3 Cards - Medium Modal
const FlowSelection3Cards = () => {
  return <FlowSelectionModal cardCount={3} />;
};

// 4+ Cards - Large Modal
const FlowSelection4Cards = () => {
  return <FlowSelectionModal cardCount={4} />;
};
```

### Single Step Form Modal Example

This example demonstrates a single step form with chip groups and responsive layout.

```tsx
import React from 'react';
import {
  Box,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  BottomSheet,
  BottomSheetHeader,
  BottomSheetBody,
  BottomSheetFooter,
  Text,
  Heading,
  ChipGroup,
  Chip,
  TextInput,
} from '@razorpay/blade/components';
import { useBreakpoint, useTheme } from '@razorpay/blade/utils';

function ResponsiveModalWrapper({
  children,
  footer,
  isOpen,
  onDismiss,
  modalBodyPadding,
  modalSize = 'small',
  wrapInBottomSheetFooter = false,
  customSnapPoints = [0.35, 0.5, 0.85],
}: {
  children: React.ReactElement | React.ReactElement[];
  footer?: React.ReactElement;
  isOpen: boolean;
  onDismiss: () => void;
  modalBodyPadding?: 'spacing.0' | 'spacing.6' | undefined;
  modalSize?: 'small' | 'medium' | 'large' | 'full';
  wrapInBottomSheetFooter?: boolean;
  customSnapPoints?: [number, number, number];
}): React.ReactNode {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onDismiss={onDismiss} snapPoints={customSnapPoints}>
        <BottomSheetHeader />
        <BottomSheetBody padding="spacing.0">
          {children}
          {footer && !wrapInBottomSheetFooter && <Box marginTop="spacing.6">{footer}</Box>}
        </BottomSheetBody>
        {footer && wrapInBottomSheetFooter && <BottomSheetFooter>{footer}</BottomSheetFooter>}
      </BottomSheet>
    );
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} size={modalSize}>
      <ModalHeader />
      <ModalBody padding={modalBodyPadding}>{children}</ModalBody>
      {footer && <ModalFooter>{footer}</ModalFooter>}
    </Modal>
  );
}

function SingleStepFormModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  const shippingTime = [
    { value: '1-2 days', label: '1-2 days' },
    { value: '3-5 days', label: '3-5 days' },
    { value: '6-8 days', label: '6-8 days' },
    { value: '9-15 days', label: '9-15 days' },
    { value: 'not applicable', label: 'Not Applicable' },
  ];

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ResponsiveModalWrapper
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        modalSize="large"
        modalBodyPadding="spacing.0"
        customSnapPoints={[0.8, 0.9, 0.95]}
        wrapInBottomSheetFooter
        footer={
          isMobile ? (
            <Box display="flex" justifyContent="flex-end" gap="spacing.5">
              <Button variant="tertiary" isFullWidth={isMobile} onClick={() => setIsOpen(false)}>
                Back
              </Button>
              <Button variant="primary" isFullWidth={isMobile} onClick={() => setIsOpen(false)}>
                Continue
              </Button>
            </Box>
          ) : undefined
        }
      >
        <Box
          display="grid"
          gridTemplateColumns={isMobile ? '1fr' : 'auto 1fr'}
          gridTemplateRows={isMobile ? '1fr' : 'auto 1fr'}
          width="100%"
          height="100%"
        >
          {!isMobile && (
            <Box
              backgroundColor="surface.background.gray.subtle"
              height="596px"
              width="400px"
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
              overflow="hidden"
              gridRow="span 2"
            >
              <img src="side-image.png" height="596px" width="100%" alt="Side illustration" />
            </Box>
          )}
          <Box
            height="596px"
            paddingTop="spacing.6"
            width="100%"
            overflow="auto"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Box paddingX="spacing.6">
              <Heading size="medium" weight="semibold">
                Create policy pages with Razorpay
              </Heading>
              <Text size="medium" weight="regular" color="surface.text.gray.muted">
                We need a few details to create the missing policy pages for you
              </Text>
              <Box
                marginTop="spacing.6"
                display="flex"
                gap="spacing.7"
                flexDirection="column"
                height="100%"
                width="100%"
              >
                <ChipGroup label="Shipping time">
                  {shippingTime.map((time) => (
                    <Chip key={time.value} value={time.value}>
                      {time.label}
                    </Chip>
                  ))}
                </ChipGroup>
                <ChipGroup label="Cancellation request time">
                  {shippingTime.map((time) => (
                    <Chip key={time.value} value={time.value}>
                      {time.label}
                    </Chip>
                  ))}
                </ChipGroup>
                <ChipGroup label="Refund processing time">
                  {shippingTime.map((time) => (
                    <Chip key={time.value} value={time.value}>
                      {time.label}
                    </Chip>
                  ))}
                </ChipGroup>
                <TextInput label="Support contact number" prefix="+91" placeholder="9XXXXXXXXX" />
                <TextInput label="Support Email ID" placeholder="support@razorpay.com" />
              </Box>
            </Box>
            {!isMobile && (
              <Box>
                <ModalFooter>
                  <Box display="flex" justifyContent="flex-end" gap="spacing.5">
                    <Button variant="tertiary" onClick={() => setIsOpen(false)}>
                      Back
                    </Button>
                    <Button variant="primary" onClick={() => setIsOpen(false)}>
                      Continue
                    </Button>
                  </Box>
                </ModalFooter>
              </Box>
            )}
          </Box>
        </Box>
      </ResponsiveModalWrapper>
    </Box>
  );
}

export default SingleStepFormModal;
```
