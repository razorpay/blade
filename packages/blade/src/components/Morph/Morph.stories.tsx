import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import { Morph } from './';
import type { MorphProps } from './';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { AnimatePresence } from 'motion/react';
import { TextInput } from '~components/Input/TextInput';
import { Link } from '~components/Link';
import { Display, Heading, Text } from '~components/Typography';
import { Card, CardBody } from '~components/Card';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Morph"
      componentDescription="Morph component is a abstraction on motion react's layout animations. It allows you to morph between 2 elements"
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-85897&t=CvaYT53LNc4OYVKa-1&scaling=min-zoom&page-id=21689%3A381614&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
          import { Morph, Box, TextInput } from '@razorpay/blade/components';

          const App = () => {
            const [showNameButton, setShowNameButton] = React.useState(true);

            return (
              <AnimatePresence>
                {showNameButton ? (
                  <Morph {...args}>
                    <Button onClick={() => setShowNameButton(false)}>Click to Enter Name</Button>
                  </Morph>
                ) : (
                  <Morph {...args}>
                    <Box display="block" width="240px">
                      <TextInput
                        accessibilityLabel="Name"
                        placeholder="Enter your Name"
                        trailingButton={
                          <Link onClick={() => setShowNameButton(true)} variant="button">
                            Submit
                          </Link>
                        }
                      />
                    </Box>
                  </Morph>
                )}
              </AnimatePresence>
            )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Motion/Morph',
  component: Morph,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<MorphProps>;

const MorphTemplate: StoryFn<typeof Morph> = (args) => {
  const [showNameButton, setShowNameButton] = React.useState(true);
  return (
    <Box minHeight="350px">
      <AnimatePresence>
        {showNameButton ? (
          <Morph {...args}>
            <Button onClick={() => setShowNameButton(false)}>Click to Enter Name</Button>
          </Morph>
        ) : (
          <Morph {...args}>
            <Box display="block" width="240px">
              <TextInput
                accessibilityLabel="Name"
                placeholder="Enter your Name"
                trailingButton={
                  <Link onClick={() => setShowNameButton(true)} variant="button">
                    Submit
                  </Link>
                }
              />
            </Box>
          </Morph>
        )}
      </AnimatePresence>
    </Box>
  );
};

export const Default = MorphTemplate.bind({});
Default.args = {
  layoutId: 'button-to-input-morph',
};

export const MorphOnText = (args: MorphProps): React.ReactElement => {
  const [showPage, setShowPage] = React.useState(false);

  return (
    <Box minHeight="400px" height="100%">
      <AnimatePresence>
        {showPage ? (
          <Box textAlign="center">
            <Morph {...args}>
              <Display>Payment Pages</Display>
            </Morph>

            <Morph layoutId="subtext">
              <Text marginTop="spacing.4">Welcome to payment pages!</Text>
            </Morph>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" justifyContent="center" height="100%">
            <Card onClick={() => setShowPage(true)} width="300px">
              <CardBody>
                <Morph {...args}>
                  <Heading>Payment Pages</Heading>
                </Morph>

                <Morph layoutId="subtext">
                  <Text marginTop="spacing.4">
                    Payment Pages allow you to build pages without writing any code. Click this card
                    to know more (and see some motion magic)
                  </Text>
                </Morph>
              </CardBody>
            </Card>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
};

MorphOnText.args = {
  layoutId: 'card-heading',
};
