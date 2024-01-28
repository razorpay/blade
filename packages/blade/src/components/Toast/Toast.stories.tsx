/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Title } from '@storybook/addon-docs';
import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { useToast } from './useToast';
import type { ToastProps } from './';
import { Toast as ToastComponent, ToastContainer } from './';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Sandbox } from '~utils/storybook/Sandbox';
import { Box } from '~components/Box';
import { Button } from '~components/Button';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Toast"
      componentDescription="A switch component is used to quickly switch between two possible states. These are only used for binary actions that occur immediately after the user turn the switch on/off."
      figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=13227%3A163026"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        import { Switch } from '@razorpay/blade/components';

        function App(): React.ReactElement {
          return (
            // Check console
            <Switch
              onChange={(e) => console.log(e.isChecked)}
              accessibilityLabel="Toggle DarkMode"
            />
          );
        }
        
        export default App;        
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Toast',
  component: ToastComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ToastProps>;

const ToastTemplate: StoryFn<typeof ToastComponent> = ({ ...args }) => {
  const toast = useToast();

  return (
    <Box>
      <ToastContainer />
      <Button
        onClick={() =>
          toast.show({
            content: 'Payment Successful',
            color: ['positive', 'negative', 'warning', 'information', 'neutral'][
              Math.floor(Math.random() * 5)
            ],
            action: {
              text: 'Okay',
              onClick: () => console.log(1),
            },
            onDismissButtonClick: () => console.log(1),
          })
        }
      >
        show
      </Button>
      {/* <ToastComponent
        color="neutral"
        content="Payment Successful Thank you for your purchase Thank you for your purchase"
        action={{ text: 'Okay', onClick: () => alert(1) }}
        leading={CheckIcon}
        onDismissButtonClick={() => alert(1)}
      />
      <br />
      <ToastComponent
        type="promotional"
        color="neutral"
        content={
          <Box>
            <Text weight="medium" size="small">
              Payment Successful
            </Text>
            <Text size="small">Thank you for your purchase</Text>
          </Box>
        }
        action={{ text: 'Okay', onClick: () => alert(1) }}
        leading={CheckIcon}
        onDismissButtonClick={() => alert(1)}
      /> */}
    </Box>
  );
};

export const Default = ToastTemplate.bind({});
Default.storyName = 'Default';
