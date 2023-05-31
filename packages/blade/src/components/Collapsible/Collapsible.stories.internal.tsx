import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';

import type { CollapsibleProps } from './Collapsible';
import { Collapsible as CollapsibleComponent } from './Collapsible';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Collapsible"
      componentDescription="A"
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=6922%3A17789',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=11098%3A286031',
      }}
    >
      <Title>Usage</Title>
      <Sandbox editorHeight={500}>
        {`
        import { useState } from 'react';
        import { Alert, Button, Box } from '@razorpay/blade/components';

        function App() {
          const [showAlert, setShowAlert] = useState(false);
          return (
            <Box>
              <Button onClick={() => setShowAlert(!showAlert)}>
                Click to be alerted!
              </Button>
              { 
                showAlert 
                ? <Alert 
                    title="The Button is Clicked 👀" 
                    description="Click the Button again to hide alert"
                    marginTop="spacing.4"
                    actions={{
                      primary: {
                        onClick: () => {
                          alert('Alert from the alert hehe')
                        },
                        text: 'Primary Action'
                      },
                      secondary: {
                        href: 'https://razorpay.com',
                        target: '_blank',
                        text: 'Go to Razorpay.com'
                      }
                    }}
                  /> 
                : null 
              }
            </Box>
          )
        }

        export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

const meta: Meta<CollapsibleProps> = {
  title: 'Components/Collapsible (Internal)',
  component: CollapsibleComponent,
  args: {},
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
};

const CollapsibleTemplate: ComponentStory<typeof CollapsibleComponent> = ({ ...args }) => {
  return <CollapsibleComponent {...args} />;
};

export const Default = CollapsibleTemplate.bind({});

export default meta;
