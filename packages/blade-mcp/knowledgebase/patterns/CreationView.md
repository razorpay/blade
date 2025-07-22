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
  BottomSheetFooter,
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
} from '@razorpay/blade/components';
import {
  CheckIcon,
  FileIcon,
  LockIcon,
  InfoIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@razorpay/blade/tokens';
import { useIsMobile } from '@razorpay/blade/utils';
import dayjs from 'dayjs';

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

function MultiStepCreationView() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [showStepGroup, setShowStepGroup] = React.useState(false);
  const [selectedVendor, setSelectedVendor] = React.useState<string | null>(null);
  const [selectedPO, setSelectedPO] = React.useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
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

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1 && !selectedVendor) {
      newErrors.vendor = 'Please select a vendor to proceed';
    }
    if (step === 2 && !selectedPO) {
      newErrors.purchaseOrder = 'Please select a purchase order to proceed';
    }
    if (step === 3 && !grnDetails.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (): void => {
    if (currentStep < steps.length) {
      if (validateStep(currentStep)) {
        setCompletedSteps((prev) => [...prev, currentStep]);
        setCurrentStep(currentStep + 1);
        setAlert({
          type: 'positive',
          title: 'Success!',
          description: 'Step completed successfully.',
        });
      } else {
        setAlert({
          type: 'negative',
          title: 'Validation Failed',
          description: 'Please fix the errors and try again.',
        });
      }
    }
  };

  const handlePreviousStep = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setAlert(null);
      setErrors({});
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

  const renderStepContent = (): React.ReactElement | null => {
    switch (currentStep) {
      case 1:
        return (
          <Box padding="spacing.4" display="flex" flexDirection="column" gap="spacing.4">
            <Heading size="medium">Select Vendor</Heading>
            <Text>Choose a vendor from the list below to proceed with GRN creation.</Text>

            <RadioGroup
              label="Vendors"
              name="vendor"
              value={selectedVendor ?? ''}
              onChange={({ value }) => setSelectedVendor(value)}
              validationState={errors.vendor ? 'error' : 'none'}
              errorText={errors.vendor}
            >
              {vendors.map((vendor) => (
                <Card key={vendor.id} padding="spacing.4" as="label">
                  <CardBody>
                    <Box display="flex" gap="spacing.3" alignItems="flex-start">
                      <Radio value={vendor.id} />
                      <Box>
                        <Text weight="medium">{vendor.name}</Text>
                        <Box display="flex" gap="spacing.2" alignItems="center">
                          <MailIcon size="small" />
                          <Text size="small" color="surface.text.gray.muted">
                            {vendor.email}
                          </Text>
                        </Box>
                        <Box display="flex" gap="spacing.2" alignItems="center">
                          <PhoneIcon size="small" />
                          <Text size="small" color="surface.text.gray.muted">
                            {vendor.phone}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  </CardBody>
                </Card>
              ))}
            </RadioGroup>
          </Box>
        );

      case 2:
        return (
          <Box padding="spacing.4" display="flex" flexDirection="column" gap="spacing.4">
            <Heading size="medium">Link Purchase Order</Heading>
            <Text>Select a Purchase Order to link with this GRN.</Text>

            <RadioGroup
              label="Purchase Orders"
              name="purchaseOrder"
              value={selectedPO ?? ''}
              onChange={({ value }) => setSelectedPO(value)}
              validationState={errors.purchaseOrder ? 'error' : 'none'}
              errorText={errors.purchaseOrder}
            >
              {purchaseOrders.map((po) => (
                <Card key={po.id} padding="spacing.4" as="label">
                  <CardBody>
                    <Box display="flex" gap="spacing.3" alignItems="flex-start">
                      <Radio value={po.id} />
                      <Box>
                        <Text weight="medium">{po.number}</Text>
                        <Box display="flex" gap="spacing.2" alignItems="center">
                          <CalendarIcon size="small" />
                          <Text size="small" color="surface.text.gray.muted">
                            {po.date}
                          </Text>
                          <Badge color={po.status === 'Approved' ? 'positive' : 'notice'}>
                            {po.status}
                          </Badge>
                        </Box>
                        <Text size="small" color="surface.text.gray.muted">
                          {po.items} Items • ₹{po.amount.toLocaleString()}
                        </Text>
                      </Box>
                    </Box>
                  </CardBody>
                </Card>
              ))}
            </RadioGroup>
          </Box>
        );

      case 3:
        return (
          <Box padding="spacing.4" display="flex" flexDirection="column" gap="spacing.4">
            <Heading size="medium">GRN Details</Heading>
            <Text>Add additional details for this GRN.</Text>

            <TextInput
              label="GRN Number"
              value={grnDetails.grnNumber}
              isDisabled
              helpText="Auto-generated GRN number"
            />

            <DatePicker
              label="Date"
              value={grnDetails.date ? dayjs(grnDetails.date).toDate() : undefined}
              onApply={(value) => {
                setGrnDetails((prev) => ({
                  ...prev,
                  date: value ? dayjs(value).format('YYYY-MM-DD') : '',
                }));
              }}
              validationState={errors.date ? 'error' : 'none'}
              errorText={errors.date}
              isRequired
              necessityIndicator="required"
            />

            <TextArea
              label="Notes"
              value={grnDetails.notes}
              onChange={({ value }) => setGrnDetails((prev) => ({ ...prev, notes: value ?? '' }))}
              numberOfLines={4}
              placeholder="Add any additional notes or comments"
            />
          </Box>
        );

      case 4:
        return (
          <Box padding="spacing.4" display="flex" flexDirection="column" gap="spacing.4">
            <Heading size="medium">Line Item Details</Heading>
            <Text>Review and confirm line items for this GRN.</Text>

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
                        <TableCell>₹{(item.quantity * item.unitPrice).toLocaleString()}</TableCell>
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
        );

      case 5:
        return (
          <Box padding="spacing.4">
            <Preview>
              <PreviewHeader />
              <PreviewBody>
                <Box padding="spacing.4" display="flex" flexDirection="column" gap="spacing.4">
                  <Heading size="large">Goods Receipt Note</Heading>
                  <Text>GRN Number: {grnDetails.grnNumber}</Text>
                  <Text>Date: {grnDetails.date}</Text>

                  <Divider />

                  <Box>
                    <Heading size="medium">Vendor Details</Heading>
                    {selectedVendor && (
                      <Box marginTop="spacing.2">
                        <Text weight="semibold">
                          {vendors.find((v) => v.id === selectedVendor)?.name}
                        </Text>
                        <Text size="small" color="surface.text.gray.muted">
                          {vendors.find((v) => v.id === selectedVendor)?.email}
                        </Text>
                      </Box>
                    )}
                  </Box>

                  <Box>
                    <Heading size="medium">Purchase Order</Heading>
                    {selectedPO && (
                      <Box marginTop="spacing.2">
                        <Text weight="semibold">
                          {purchaseOrders.find((p) => p.id === selectedPO)?.number}
                        </Text>
                        <Text size="small" color="surface.text.gray.muted">
                          Amount: ₹
                          {purchaseOrders.find((p) => p.id === selectedPO)?.amount.toLocaleString()}
                        </Text>
                      </Box>
                    )}
                  </Box>

                  {grnDetails.notes && (
                    <Box>
                      <Heading size="medium">Notes</Heading>
                      <Text>{grnDetails.notes}</Text>
                    </Box>
                  )}
                </Box>
              </PreviewBody>
              <PreviewFooter />
            </Preview>
          </Box>
        );

      default:
        return null;
    }
  };

  const renderStepGroup = (): React.ReactElement => (
    <StepGroup orientation="vertical" size="medium">
      {steps.map((step) => (
        <StepItem
          key={step.stepNumber}
          title={step.title}
          description={step.description}
          marker={getStepIcon(step.stepNumber)}
          isSelected={currentStep === step.stepNumber}
          isDisabled={step.stepNumber > currentStep}
          onClick={() => step.stepNumber <= currentStep && setCurrentStep(step.stepNumber)}
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

  const renderFooter = (): React.ReactElement => (
    <Box display="flex" gap="spacing.3" justifyContent="space-between" width="100%">
      {isMobile && currentStep === steps.length && (
        <Button variant="tertiary" icon={FileIcon} onClick={() => setIsPreviewOpen(true)}>
          Preview
        </Button>
      )}

      <Box display="flex" gap="spacing.3">
        <Button variant="tertiary" onClick={handlePreviousStep} isDisabled={currentStep === 1}>
          Previous
        </Button>
        <Button
          variant="primary"
          onClick={currentStep === steps.length ? () => setIsOpen(false) : handleNextStep}
        >
          {currentStep === steps.length ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </Box>
  );

  const visibleSteps = isMobile ? steps.filter((s) => s.stepNumber !== 5) : steps;
  const currentStepObj = visibleSteps.find((s) => s.stepNumber === currentStep);

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Create GRN</Button>

      {isMobile ? (
        isOpen && (
          <Box
            position="fixed"
            top="spacing.0"
            left="spacing.0"
            width="100%"
            height="100%"
            backgroundColor="surface.background.gray.moderate"
            zIndex={1000}
          >
            {/* Mobile Header */}
            <Box
              padding="spacing.4"
              backgroundColor="surface.background.gray.subtle"
              borderBottomWidth="thin"
              borderBottomColor="surface.border.gray.muted"
              onClick={() => setShowStepGroup(!showStepGroup)}
            >
              <Box display="flex" alignItems="center" justifyContent="center" gap="spacing.2">
                <Badge>
                  {currentStep} / {visibleSteps.length}
                </Badge>
                <Heading size="small">{currentStepObj?.title}</Heading>
                {showStepGroup ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </Box>
            </Box>

            <ProgressBar value={(currentStep / visibleSteps.length) * 100} />

            {/* Step Group Overlay */}
            <Slide direction="top" isVisible={showStepGroup}>
              <Box
                position="fixed"
                top="60px"
                left="spacing.0"
                width="100%"
                backgroundColor="surface.background.gray.intense"
                padding="spacing.4"
                zIndex={1001}
              >
                {renderStepGroup()}
              </Box>
            </Slide>

            {/* Content */}
            <Box overflow="auto" height="calc(100vh - 140px)">
              {alert && (
                <Box padding="spacing.4">
                  <Alert
                    color={alert.type}
                    title={alert.title}
                    description={alert.description}
                    isDismissible
                    onDismiss={() => setAlert(null)}
                  />
                </Box>
              )}
              {renderStepContent()}
            </Box>

            {/* Footer */}
            <Box
              position="fixed"
              bottom="spacing.0"
              left="spacing.0"
              width="100%"
              padding="spacing.4"
              backgroundColor="surface.background.gray.subtle"
              borderTopWidth="thin"
              borderTopColor="surface.border.gray.muted"
            >
              {renderFooter()}
            </Box>

            {/* Preview BottomSheet */}
            <BottomSheet
              isOpen={isPreviewOpen}
              onDismiss={() => setIsPreviewOpen(false)}
              snapPoints={[0.9]}
            >
              <BottomSheetHeader title="Review GRN Details" />
              <BottomSheetBody>{renderStepContent()}</BottomSheetBody>
            </BottomSheet>
          </Box>
        )
      ) : (
        <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="full">
          <ModalHeader title="Create GRN" />
          <ModalBody padding="spacing.0">
            <Box display="flex" height="100%">
              {/* Desktop Sidebar */}
              <Box
                width="300px"
                padding="spacing.4"
                backgroundColor="surface.background.gray.moderate"
              >
                {renderStepGroup()}
              </Box>

              {/* Desktop Content */}
              <Box flex={1} display="flex" flexDirection="column">
                {alert && (
                  <Box padding="spacing.4">
                    <Alert
                      color={alert.type}
                      title={alert.title}
                      description={alert.description}
                      isDismissible
                      onDismiss={() => setAlert(null)}
                    />
                  </Box>
                )}

                <Box flex={1} overflow="auto">
                  {renderStepContent()}
                </Box>

                <Box
                  padding="spacing.4"
                  borderTopWidth="thin"
                  borderTopColor="surface.border.gray.muted"
                >
                  {renderFooter()}
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
  modalBodyPadding?: string;
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
        <BottomSheetBody padding={modalBodyPadding}>
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

This example shows a flow selection modal with icon cards and responsive grid layout.

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
} from '@razorpay/blade/components';
import { ZapIcon } from '@razorpay/blade/tokens';
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
  modalBodyPadding?: string;
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
        <BottomSheetBody padding={modalBodyPadding}>
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

function FlowSelectionModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedMethod, setSelectedMethod] = React.useState('');

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
  ];

  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ResponsiveModalWrapper
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        modalSize="medium"
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
            gridTemplateColumns={{
              base: '1fr 1fr',
              m: '1fr 1fr 1fr',
              l: '1fr 1fr 1fr',
            }}
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
                width={isMobile ? '165px' : '228px'}
                height={isMobile ? '184px' : undefined}
                borderRadius="medium"
                elevation="none"
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
                          method.isDisabled
                            ? 'surface.text.gray.muted'
                            : 'surface.text.gray.normal'
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
  modalBodyPadding?: string;
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
        <BottomSheetBody padding={modalBodyPadding}>
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
