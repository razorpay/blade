import type { StoryFn, Meta } from '@storybook/react';
import React, { useEffect } from 'react';
import storyRouterDecorator from 'storybook-react-router';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import styled from 'styled-components';
import DonateNow from './assets/donatenow.png';
import PayNow from './assets/paynow.png';
import DonationButton from './assets/donationButton.png';
import cardImage from './assets/card.png';
import ModalSideImage from './assets/sideImage.png';
import { Heading } from '~components/Typography/Heading';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Button } from '~components/Button';
import { Badge } from '~components/Badge';
import {
  FileIcon,
  CheckIcon,
  PhoneIcon,
  MailIcon,
  CalendarIcon,
  LockIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InfoIcon,
  ZapIcon,
} from '~components/Icons';
import { ProgressBar } from '~components/ProgressBar';
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
import { Box } from '~components/Box';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '~components/Modal';
import { Text } from '~components/Typography/Text';
import { Alert } from '~components/Alert';
import { TextInput } from '~components/Input/TextInput';
import { Radio, RadioGroup } from '~components/Radio';
import { Preview, PreviewBody, PreviewHeader, PreviewFooter } from '~components/Preview';
import type { BottomSheetBodyProps } from '~components/BottomSheet';
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetHeader,
  BottomSheetFooter,
} from '~components/BottomSheet';
import { useIsMobile } from '~utils/useIsMobile';
import { StepGroup, StepItem, StepItemIcon } from '~components/StepGroup';
import { Divider } from '~components/Divider';
import { TextArea } from '~components/Input/TextArea';
import { Card, CardBody } from '~components/Card';
import { DatePicker } from '~components/DatePicker';
import type { DateValue } from '~components/DatePicker';
import { Slide } from '~components/Slide';
import type { ModalBodyProps, ModalProps } from '~components/Modal';
import type { SpacingValueType } from '~components/Box/BaseBox';
import { Fade } from '~components/Fade';
import { useBreakpoint, useTheme } from '~utils';
import { ChipGroup, Chip } from '~components/Chip';

// Initialize dayjs plugins
dayjs.extend(customParseFormat);

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Creation View"
      componentDescription="Creation View is a pattern that is used in creation flows"
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/design/ZZ2dpcIAsPCEGPwQ2UdgL1/Blade-Cheatsheet?node-id=949-178337&m=dev"
      codeUrl="https://github.com/razorpay/blade/blob/master/packages/blade/src/components/CreationView/CreationView.stories.tsx"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
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
        function App() {
          const [isOpen, setIsOpen] = React.useState(false);
          const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
        
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
              newErrors.acceptFixedAmount =
                'Please select if you want to accept fixed amount';
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
                  <Box
                    padding="spacing.4"
                    display="flex"
                    flexDirection="column"
                    gap="spacing.4"
                  >
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
                        onChange={({ value }) =>
                          handleChange('acceptFixedAmount', value)
                        }
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
              <Box
                display="flex"
                gap="spacing.3"
                justifyContent="space-between"
                width="100%"
              >
                <Box
                  display="flex"
                  width="100%"
                  justifyContent="flex-end"
                  gap="spacing.3"
                >
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

const DefaultExample: StoryFn<typeof Modal> = () => {
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
      )}
    </Box>
  );

  const renderPreview = (): React.ReactElement => (
    <Box display="flex" flexDirection="column" gap="spacing.4">
      <Preview>
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
      </Preview>
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
        <>
          <BottomSheet
            isOpen={isOpen}
            onDismiss={() => setIsOpen(false)}
            snapPoints={[0.75, 0.75, 0.75]}
          >
            <BottomSheetHeader title="Create QR Code" />
            <BottomSheetBody>{renderContent({ isMobile })}</BottomSheetBody>
            <BottomSheetFooter>{renderFooter({ isMobile })}</BottomSheetFooter>
          </BottomSheet>
          <BottomSheet
            isOpen={isPreviewOpen}
            onDismiss={() => setIsPreviewOpen(false)}
            snapPoints={[1, 1, 1]}
          >
            <BottomSheetHeader title="QR Code Preview" />
            <BottomSheetBody>{renderPreview()}</BottomSheetBody>
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
Default.storyName = 'Single Step (Form Group + Preview)';

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

const MultiStepExample: StoryFn = ({ withProgressBar = false }: { withProgressBar?: boolean }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const isMobile = useIsMobile();
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

  const handleDateChange = (value: DateValue | undefined): void => {
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
  useEffect(() => {
    if (isMobile && currentStep === 5) {
      setCurrentStep(4);
    }
  }, [isMobile]);

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
                  {GRNVendors.map((vendor) => (
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
            <Box width="100%">
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
                          {GRNPurchaseOrders.map((po) => (
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
                                  Address:{' '}
                                  {GRNVendors.find((v) => v.id === selectedVendor)?.address}
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
        <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="full">
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
};

export const MultiStep = MultiStepExample.bind({});
MultiStep.storyName = 'Multi Steps with StepGroup (Form Group + Preview + Full Page Modal)';

export const MultiStepProgressBar = MultiStepExample.bind({});
MultiStepProgressBar.args = {
  withProgressBar: true,
};
MultiStepProgressBar.storyName =
  'Multi Steps with Progress Bar (Form Group + Preview + Full Page Modal)';

const CompactMultiStepExample: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [selectedVendor, setSelectedVendor] = React.useState<string | null>(null);
  const [selectedPO, setSelectedPO] = React.useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
  const [showStepGroup, setShowStepGroup] = React.useState(false);
  const isMobile = useIsMobile();

  // Dynamically filter steps for mobile (remove review step)
  const visibleSteps = GRNSteps;
  const lastStep = visibleSteps[visibleSteps.length - 1].stepNumber;
  const currentStepObj = visibleSteps.find((s) => s.stepNumber === currentStep);
  const [errors, setErrors] = React.useState<{
    vendor?: string;
    purchaseOrder?: string;
    referenceNumber?: string;
  }>({});
  const [grnDetails, setGrnDetails] = React.useState({
    grnNumber: `GRN-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')}`,
    referenceNumber: '',
  });
  const [alert, setAlert] = React.useState<{
    type: 'positive' | 'negative';
    title: string;
    description: string;
  } | null>(null);

  const validateStep = (step: number): boolean => {
    const newErrors: typeof errors = {};

    if (step === 1 && !selectedVendor) {
      newErrors.vendor = 'Please select a vendor to proceed';
    }
    if (step === 2 && !selectedPO) {
      newErrors.purchaseOrder = 'Please select a purchase order to proceed';
    }
    if (step === 3 && !grnDetails.referenceNumber) {
      newErrors.referenceNumber = 'Reference number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = (): void => {
    if (currentStep < GRNSteps.length) {
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
      referenceNumber: '',
    });
  };

  const compactTableData = {
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
    ],
  };

  const renderStepContent = (): React.ReactElement | null => {
    switch (currentStep) {
      case 1:
        return (
          <Box padding="spacing.5" display="flex" flexDirection="column" gap="spacing.4">
            <Box>
              <Heading size="medium">Select Vendor</Heading>
              <Text size="medium" color="surface.text.gray.muted">
                Choose a vendor from the list below
              </Text>
            </Box>
            <RadioGroup
              label="Available Vendors"
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
              {GRNVendors.slice(0, 3).map((vendor) => (
                <Radio key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </Radio>
              ))}
            </RadioGroup>
          </Box>
        );
      case 2:
        return (
          <Box padding="spacing.5" display="flex" flexDirection="column" gap="spacing.4">
            <Box>
              <Heading size="medium">Link Purchase Order</Heading>
              <Text size="medium" color="surface.text.gray.muted">
                Select a Purchase Order to link with this GRN
              </Text>
            </Box>
            <RadioGroup
              label="Available Purchase Orders"
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
              {GRNPurchaseOrders.slice(0, 3).map((po) => (
                <Radio key={po.id} value={po.id}>
                  {po.number} - ₹{po.amount.toLocaleString()}
                </Radio>
              ))}
            </RadioGroup>
          </Box>
        );
      case 3:
        return (
          <Box padding="spacing.5" display="flex" flexDirection="column" gap="spacing.4">
            <Box>
              <Heading size="medium">GRN Details</Heading>
              <Text size="medium" color="surface.text.gray.muted">
                Add basic details for this GRN
              </Text>
            </Box>
            <TextInput
              label="GRN Number"
              value={grnDetails.grnNumber}
              isDisabled
              helpText="Auto-generated"
            />
            <TextInput
              label="Reference Number"
              value={grnDetails.referenceNumber}
              onChange={({ value }) => {
                setGrnDetails((prev) => ({
                  ...prev,
                  referenceNumber: value ?? '',
                }));
                if (errors.referenceNumber) {
                  setErrors((prev) => ({ ...prev, referenceNumber: undefined }));
                }
              }}
              validationState={errors.referenceNumber ? 'error' : 'none'}
              errorText={errors.referenceNumber}
              placeholder="Enter reference number"
              isRequired
              necessityIndicator="required"
            />
          </Box>
        );
      case 4:
        return (
          <Box padding="spacing.5" display="flex" flexDirection="column" gap="spacing.4">
            <Box>
              <Heading size="medium">Line Items</Heading>
              <Text size="medium" color="surface.text.gray.muted">
                Review the items for this GRN
              </Text>
            </Box>
            <Box>
              <Text weight="medium" marginBottom="spacing.3">
                Selected Items:
              </Text>
              {compactTableData.nodes.slice(0, 3).map((item) => (
                <Box
                  key={item.id}
                  padding="spacing.3"
                  borderWidth="thin"
                  borderColor="surface.border.gray.muted"
                  borderRadius="medium"
                  marginBottom="spacing.3"
                >
                  <Box display="flex" justifyContent="space-between">
                    <Text>{item.name}</Text>
                    <Text>Qty: {item.quantity}</Text>
                  </Box>
                  <Text size="small" color="surface.text.gray.muted">
                    ₹{item.unitPrice.toLocaleString()} × {item.quantity} = ₹
                    {(item.quantity * item.unitPrice).toLocaleString()}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>
        );
      case 5:
        return (
          <Box padding="spacing.5" display="flex" flexDirection="column" gap="spacing.4">
            <Box>
              <Heading size="medium">Review & Submit</Heading>
            </Box>

            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Box display="grid" gridTemplateColumns="1fr 1fr">
                <Box>
                  <Text weight="medium">Vendor:</Text>
                  <Text>{GRNVendors.find((v) => v.id === selectedVendor)?.name}</Text>
                </Box>
                <Box>
                  <Text weight="medium">Purchase Order:</Text>
                  <Text>{GRNPurchaseOrders.find((p) => p.id === selectedPO)?.number}</Text>
                </Box>
              </Box>
              <Box display="grid" gridTemplateColumns="1fr 1fr">
                <Box>
                  <Text weight="medium">GRN Number:</Text>
                  <Text>{grnDetails.grnNumber}</Text>
                </Box>
                <Box>
                  <Text weight="medium">Reference Number:</Text>
                  <Text>{grnDetails.referenceNumber}</Text>
                </Box>
              </Box>

              <Box>
                <Text weight="medium">Total Amount:</Text>
                <Text>
                  ₹
                  {compactTableData.nodes
                    .reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)
                    .toLocaleString()}
                </Text>
              </Box>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  const renderStepGroup = (): React.ReactElement => {
    return (
      <StepGroup orientation="vertical" size="medium">
        {GRNSteps.map((step) => (
          <StepItem
            key={step.stepNumber}
            title={step.title}
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
  };

  const renderFooter = (): React.ReactElement => (
    <>
      <Box display="flex" gap="spacing.4" justifyContent="space-between">
        <Button variant="tertiary" onClick={handlePreviousStep} isDisabled={currentStep === 1}>
          Previous
        </Button>
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
    </>
  );

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Create GRN</Button>
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
              onClick={() => setShowStepGroup((prev: boolean) => !prev)}
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
                  <Badge color={alert?.type === 'negative' ? 'negative' : undefined}>
                    {currentStep} / {lastStep}
                  </Badge>
                  <Heading size="small">{currentStepObj?.title}</Heading>
                  {showStepGroup ? <ChevronUpIcon /> : <ChevronDownIcon />}
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
                  height="240px"
                  borderBottomLeftRadius="2xlarge"
                  borderBottomRightRadius="2xlarge"
                  padding="spacing.7"
                  paddingTop="spacing.0"
                >
                  {renderStepGroup()}
                </Box>
              </Slide>
              <Fade motionTriggers={['mount']} isVisible={showStepGroup} shouldUnmountWhenHidden>
                <div
                  style={{
                    position: 'fixed',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1004,
                  }}
                  onClick={() => setShowStepGroup((prev: boolean) => !prev)}
                />
              </Fade>
            </Box>
            {/* Step content */}
            <Box
              overflow="auto"
              height="calc(100vh - 100px)"
              padding="spacing.4"
              paddingBottom="spacing.8"
            >
              {renderStepContent()}
            </Box>
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
              {renderFooter()}
            </Box>
          </Box>
        )
      ) : (
        <Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)} size="medium">
          <ModalHeader title="Create GRN" />
          <ModalBody padding="spacing.0">
            <Box display="flex" height="100%">
              <Box
                width="250px"
                padding="spacing.5"
                backgroundColor="surface.background.gray.moderate"
              >
                {renderStepGroup()}
              </Box>
              <Box flex={1} display="flex" flexDirection="column">
                <Box flex={1} overflow="auto">
                  {renderStepContent()}
                </Box>
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>{renderFooter()}</ModalFooter>
        </Modal>
      )}
    </Box>
  );
};

export const CompactMultiStep = CompactMultiStepExample.bind({});
CompactMultiStep.storyName = 'Multi Steps with StepGroup (Form Group + Medium Modal)';

const ResponsiveModalWrapper = ({
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
  modalBodyPadding?: ModalBodyProps['padding'];
  modalSize?: ModalProps['size'];
  wrapInBottomSheetFooter?: boolean;
  customSnapPoints?: [number, number, number];
}): React.ReactNode => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onDismiss={onDismiss} snapPoints={customSnapPoints}>
        <BottomSheetHeader />
        <BottomSheetBody padding={modalBodyPadding as BottomSheetBodyProps['padding']}>
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
};

const EditAndAddModalTemplate: StoryFn<typeof Modal> = () => {
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
            <Button isFullWidth={isMobile}> Update</Button>
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
};

export const EditAndAddModal = EditAndAddModalTemplate.bind({});
EditAndAddModal.storyName = 'Edit and Add Modal';

const FlowSelectionModalTemplateWithIcon: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedMethod, setSelectedMethod] = React.useState('');

  const paymentMethods = [
    {
      value: 'quickpay',
      title: 'Quick Pay Button',
      subtitle:
        'Accepting fixed price payments?  Customers make quick payments of fixed price through this button',
      icon: ZapIcon,
    },
    {
      value: 'buynow',
      title: 'Buy Now Button',
      subtitle:
        'Selling products or event tickets?  Sell multiple items with support for quantity using this button.',
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
        onDismiss={() => {
          setIsOpen(false);
        }}
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
                      <ZapIcon
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
};

export const FlowSelectionModalWithIcon = FlowSelectionModalTemplateWithIcon.bind({});
FlowSelectionModalWithIcon.storyName = 'Flow Selection Modal - with Icon Cards';

const FlowSelectionModalTemplate: StoryFn = ({ cardCount = 3 }: { cardCount?: number }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedMethod, setSelectedMethod] = React.useState('');
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  // Get modal size based on card count
  const getModalSize = (): 'small' | 'medium' | 'large' => {
    if (cardCount === 2) return 'small';
    if (cardCount === 3) return 'medium';
    return 'large';
  };

  // Get grid layout based on card count
  const getGridLayout = (): { base: string; m: string } => {
    if (cardCount === 2) {
      return {
        base: '1fr 1fr',
        m: '1fr 1fr',
      };
    }
    if (cardCount === 3) {
      return {
        base: '1fr 1fr',
        m: '1fr 1fr 1fr',
      };
    }
    return {
      base: '1fr 1fr',
      m: '1fr 1fr 1fr 1fr',
    };
  };

  // Get card width based on count and device
  const getCardWidth = (): SpacingValueType => {
    if (cardCount === 2) return isMobile ? '165px' : '160px';
    if (cardCount === 3) return isMobile ? '165px' : '230px';
    return isMobile ? '165px' : '220px';
  };

  // Get card height based on count and device
  const getCardHeight = (): SpacingValueType => {
    if (cardCount === 2) return isMobile ? '250px' : '300px';
    if (cardCount === 3) return isMobile ? '250px' : '250px';
    return isMobile ? '250px' : '260px';
  };

  const standardButtons = [
    {
      value: 'quickpay',
      title: 'Quick Pay Button',
      subtitle:
        'Accepting fixed price payments?  Customers make quick payments of fixed price through this button',
      img: DonateNow,
      isDisabled: false,
    },
    {
      value: 'buynow',
      title: 'Buy Now Button',
      subtitle: 'Selling products or event tickets?  Sell multiple items with  quantity supported.',
      img: DonationButton,
      isDisabled: false,
    },
    {
      value: 'donations',
      title: 'Donations Button',
      subtitle:
        'Raising money for a good cause?  Supporters can pick from presets or donate amount of their choice',
      img: PayNow,
      isDisabled: false,
    },
  ];
  const customButton = {
    value: 'custom',
    title: 'Custom Button',
    subtitle:
      'Build your own button with your own design and branding. You can also use our pre-built templates.',
    img: cardImage,
    isDisabled: true,
  };

  // Create all buttons array and slice based on cardCount
  const allButtons = [...standardButtons, customButton];
  const paymentMethods = allButtons.slice(0, cardCount);
  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <ResponsiveModalWrapper
        isOpen={isOpen}
        onDismiss={() => {
          setIsOpen(false);
        }}
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
                height={getCardHeight()}
                borderRadius="medium"
                elevation="none"
                cursor={method.isDisabled ? 'not-allowed' : 'pointer'}
              >
                <CardBody>
                  <Box overflow="hidden">
                    <Box>
                      <img
                        src={method.img}
                        alt={method.title}
                        width={isMobile ? '160px' : '230px'}
                        height={isMobile ? '93px' : '130px'}
                        style={{ borderRadius: '4px' }}
                      />
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      gap="spacing.4"
                      alignItems="center"
                      paddingX="spacing.5"
                      paddingY="spacing.4"
                      alignContent="center"
                      justifyContent="center"
                    >
                      <Box display="flex" flexDirection="column" gap="spacing.2">
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

                        <Text size="small" color="surface.text.gray.muted">
                          {method.subtitle}
                        </Text>
                      </Box>
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
};

export const FlowSelectionModal2Cards = FlowSelectionModalTemplate.bind({});
FlowSelectionModal2Cards.args = { cardCount: 2 };
FlowSelectionModal2Cards.storyName = 'Flow Selection - 2 Cards (Small Modal)';

export const FlowSelectionModal3Cards = FlowSelectionModalTemplate.bind({});
FlowSelectionModal3Cards.args = { cardCount: 3 };
FlowSelectionModal3Cards.storyName = 'Flow Selection - 3 Cards (Medium Modal)';

export const FlowSelectionModal4Cards = FlowSelectionModalTemplate.bind({});
FlowSelectionModal4Cards.args = { cardCount: 4 };
FlowSelectionModal4Cards.storyName = 'Flow Selection - 4 Cards (Large Modal)';

const SingleStepFormTemplate: StoryFn<typeof Modal> = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint(theme);
  const isMobile = matchedDeviceType === 'mobile';

  const shippingTime = [
    {
      value: '1-2 days',
      label: '1-2 days',
    },
    {
      value: '3-5 days',
      label: '3-5 days',
    },
    {
      value: '6-8 days',
      label: '6-8 days',
    },
    {
      value: '9-15 days',
      label: '9-15 days',
    },
    {
      value: 'not applicable',
      label: 'Not Applicable',
    },
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
              <img src={ModalSideImage} height="596px" width="100%" alt="random graphics" />
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
};

export const SingleStepForm = SingleStepFormTemplate.bind({});
SingleStepForm.storyName = 'Single Step Form Modal';
