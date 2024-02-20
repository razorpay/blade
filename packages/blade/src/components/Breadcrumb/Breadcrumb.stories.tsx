/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Title } from '@storybook/addon-docs';
import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import type { BreadcrumbProps } from './types';
import { Breadcrumb } from './Breadcrumb';
import { BreadcrumbItem } from './BreadcrumbItem';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Box } from '~components/Box';
import { HomeIcon } from '~components/Icons';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Breadcrumb"
      componentDescription="Toast is a feedback element to display temporary short messages in the interface"
      figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=75839-1125191&mode=design&t=SLxhqgKm27oCjSYV-4"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { ToastContainer, useToast } from '@razorpay/blade/components';

        function App(): React.ReactElement {
          const toast = useToast();

          // Integrating Blade Toast in your App
          // 1. Render the ToastContainer component at the root of your app
          // 2. Utilize the methods exposed via useToast hook to show/dismiss toasts
          return (
            <Box>
              <ToastContainer />
              <Button 
                onClick={() => {
                  toast.show({ content: 'Payment successful', color: 'positive' })
                }}
              >
                Show Toast
              </Button>
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
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<BreadcrumbProps>;

const BasicToastTemplate: StoryFn<BreadcrumbProps> = () => {
  return (
    <Box>
      <Box display="flex" flexDirection="column" gap="spacing.6">
        <Breadcrumb size="small" showLastSeparator>
          <BreadcrumbItem accessibilityLabel="Home" icon={HomeIcon} href="/home" />
          <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage href="/settlements">
            Settlements
          </BreadcrumbItem>
        </Breadcrumb>
        <Breadcrumb size="medium" showLastSeparator>
          <BreadcrumbItem icon={HomeIcon} href="/home" />
          <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage href="/settlements">
            Settlements
          </BreadcrumbItem>
        </Breadcrumb>
        <Breadcrumb size="large" showLastSeparator>
          <BreadcrumbItem icon={HomeIcon} href="/home" />
          <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage href="/settlements">
            Settlements
          </BreadcrumbItem>
        </Breadcrumb>
      </Box>
      <Box marginTop="spacing.11" display="flex" flexDirection="column" gap="spacing.6">
        <Breadcrumb size="large" showLastSeparator color="neutral">
          <BreadcrumbItem href="/home">Home</BreadcrumbItem>
          <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage href="/settlements">
            Settlements
          </BreadcrumbItem>
        </Breadcrumb>
        <Breadcrumb size="large" showLastSeparator color="primary">
          <BreadcrumbItem href="/home">Home</BreadcrumbItem>
          <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage href="/settlements">
            Settlements
          </BreadcrumbItem>
        </Breadcrumb>
        <Box padding="spacing.5" backgroundColor="surface.background.cloud.intense">
          <Breadcrumb size="large" showLastSeparator color="white">
            <BreadcrumbItem icon={HomeIcon} href="/home" />
            <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
            <BreadcrumbItem isCurrentPage href="/settlements">
              Settlements
            </BreadcrumbItem>
          </Breadcrumb>
        </Box>
      </Box>
    </Box>
  );
};

BasicToastTemplate.storyName = 'Basic';
export const Basic = BasicToastTemplate.bind({});
