import React from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Meta, StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import { Morph } from './';
import type { MorphProps } from './';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { TextInput } from '~components/Input/TextInput';
import { Link } from '~components/Link';
import { Display, Heading, Text } from '~components/Typography';
import { Card, CardBody } from '~components/Card';
import { MorphSandbox } from '~components/BaseMotion/docs/codeExamples';
import { Alert } from '~components/Alert';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Morph"
      componentDescription="Morph component is a abstraction on motion react's layout animations. It allows you to morph between 2 elements"
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-85897&t=CvaYT53LNc4OYVKa-1&scaling=min-zoom&page-id=21689%3A381614&mode=design"
    >
      <Alert
        color="notice"
        title="Distortions Note"
        isFullWidth
        isDismissible={false}
        description="Morph animation uses framer-motion's layout animation internally. They work best when you're animating between similar components or animating positions. In case of animating the sizes, you might see distortions in text or children. You can wrap these children in Morph wrapper which might solve it in some cases though it can't completely be avoided in more complex components since blade components internally might have multiple nodes"
        marginBottom="spacing.4"
      />
      <Title>Usage</Title>
      <MorphSandbox />
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
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
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
            <Box>
              <Morph {...args}>
                <Display display="inline-block">Payment Pages</Display>
              </Morph>
            </Box>

            <Morph layoutId="subtext">
              <Text marginTop="spacing.4" display="inline-block">
                Welcome to payment pages!
              </Text>
            </Morph>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" justifyContent="center" height="100%">
            <Card onClick={() => setShowPage(true)} width="300px">
              <CardBody>
                <Morph {...args}>
                  <Heading display="inline-block">Payment Pages</Heading>
                </Morph>

                <Morph layoutId="subtext">
                  <Text marginTop="spacing.4" display="inline-block">
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

export const MorphBorderRadius = (): React.ReactElement => {
  const [showPage, setShowPage] = React.useState(false);

  return (
    <Box minHeight="400px" height="100%">
      <Button marginBottom="spacing.5" onClick={() => setShowPage(!showPage)}>
        Toggle Morph
      </Button>
      <AnimatePresence>
        {showPage ? (
          <Morph layoutId="box-shape">
            <Box height="200px" width="200px" borderRadius="none" borderWidth="thick" />
          </Morph>
        ) : (
          <Morph layoutId="box-shape">
            <Box
              height="200px"
              width="200px"
              borderRadius="round"
              backgroundColor="surface.background.primary.intense"
            />
          </Morph>
        )}
      </AnimatePresence>
    </Box>
  );
};

export const DangerousButton = (): React.ReactElement => {
  const [shouldConfirm, setShouldConfirm] = React.useState(false);

  return (
    <Box>
      <AnimatePresence>
        {shouldConfirm ? (
          <Morph layoutId="box-shape">
            <Button color="negative" onClick={() => setShouldConfirm(!shouldConfirm)}>
              Confirm Deletion
            </Button>
          </Morph>
        ) : (
          <Morph layoutId="box-shape">
            <Button variant="secondary" onClick={() => setShouldConfirm(!shouldConfirm)}>
              Delete This
            </Button>
          </Morph>
        )}
      </AnimatePresence>
    </Box>
  );
};
