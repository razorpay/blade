import React from 'react';
import { Playground } from './stories';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { Code, Heading, Text, Title } from '~components/Typography';
import { Sandbox } from '~src/_helpers/storybook/Sandbox';
import { Box } from '~components/Box';
import { ArgsTable } from '~src/_helpers/storybook/ArgsTable';
import { List, ListItem } from '~components/List';
import BaseBox from '~components/Box/BaseBox';
import { Link } from '~components/Link';

const ModalDocs = (): JSX.Element => {
  return (
    <StoryPageWrapper
      componentName="Modal"
      componentDescription="Modals are often used to present information, notifications, or requests that require immediate attention or confirmation from the user"
      imports=""
      showStorybookControls={false}
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?type=design&node-id=39809-559333&t=j3ZK6zZSwP5CJ8Al-0',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?type=design&node-id=16459-684636&t=7KYEW7ENNS5GmLIO-0',
      }}
    >
      <Box as="section">
        <Title size="medium">Playground</Title>
        <Sandbox editorHeight={400}>{Playground}</Sandbox>
      </Box>

      <Title size="medium" marginBottom="spacing.4">
        ⚠️ Modal for mWeb and React Native
      </Title>
      <Text>
        Modals should not be used on mWeb & React Native Apps. Instead we should use{' '}
        <Link href="/?path=/story/components-bottomsheet--default">BottomSheet Component</Link> for
        all the use-cases where you might want a Modal on mWeb or mobile apps built with React
        Native.
      </Text>
      <List>
        <ListItem>
          We will not be exposing the Modal component for native apps (this is a design guideline)
          instead we would encourage our teams be use BottomSheet for mWeb and native apps.
        </ListItem>
        <ListItem>
          Even though usage on mWeb is discouraged by our design guideline, Modal will be responsive
          and will not visually break till 320px on mWeb.
        </ListItem>
        <ListItem>
          Designers would need to be mindful of this while designing for mWeb and native apps.
        </ListItem>
        <ListItem>
          On Figma, we have added guardrails to ensure that when screenSize is selected Mobile on
          Figma, Modal component will turn into a BottomSheet component.
        </ListItem>
        <ListItem>
          We are not automatically changing our Modal to BottomSheet on code to avoid bundle size
          overhead as well as to avoid any flow to break unless mindfully implemented with
          BottomSheet on code.
        </ListItem>
      </List>

      <BaseBox id="modal" as="section">
        <Title size="medium" marginBottom="spacing.4">
          Modal
        </Title>
        <Text>A Modal in Blade is usually a composite of 4 elements -</Text>
        <List variant="ordered-filled" marginY="spacing.5">
          <ListItem>Modal - Handles opening / closing of Modal</ListItem>
          <ListItem>ModalHeader - Renders the header for the Modal</ListItem>
          <ListItem>ModalBody - Renders the body of the Modal</ListItem>
          <ListItem>ModalFooter - Renders the footer for the Modal</ListItem>
        </List>
      </BaseBox>
      <Heading size="medium">Modal Props</Heading>
      <ArgsTable
        marginBottom="spacing.4"
        data={{
          isOpen: (
            <Text size="small" type="subdued">
              <Text size="small" type="subdued">
                <Code size="medium">boolean</Code> (required)
              </Text>
              Toggles modal state
            </Text>
          ),
          onDismiss: (
            <Text size="small" type="subdued">
              <Text size="small" type="subdued">
                <Code size="medium">function</Code> (required)
              </Text>
              Called when the modal is closed, either by user state, hitting esc or tapping backdrop
            </Text>
          ),
          size: (
            <Text size="small" type="subdued">
              <Text size="small">{`'small' | 'medium' | 'large'`}</Text>
              Size of the modal
            </Text>
          ),
          initialFocusRef: (
            <Text size="small" type="subdued">
              <Text size="small" type="subdued">
                <Code size="medium">function</Code>
              </Text>
              ref element you want to get keyboard focus when opening the modal
            </Text>
          ),
          accessibilityLabel: (
            <Text size="small" type="subdued">
              <Text size="small" type="subdued">
                <Code size="medium">string</Code>
              </Text>
              The accessibility label (aria-label) for the Modal.
            </Text>
          ),
          children: (
            <Text>
              [<Code>{'<ModalBody />'}</Code>, <Code>{'<ModalHeader />'}</Code>,
              <Code>{'<ModalHeader />'}</Code>]
            </Text>
          ),
        }}
      />
      <Heading size="medium">ModalHeader Props</Heading>
      <ArgsTable
        marginBottom="spacing.4"
        data={{
          title: (
            <Text size="small" type="subdued">
              <Text size="small" type="subdued">
                <Code size="medium">string</Code>
              </Text>
              Title of the Header
            </Text>
          ),
          subTitle: (
            <Text size="small" type="subdued">
              <Text size="small" type="subdued">
                <Code size="medium">string</Code>
              </Text>
              Subtitle of the Header
            </Text>
          ),
          leading: (
            <Text size="small" type="subdued">
              <Text size="small" type="subdued">
                <Code size="medium">React.ReactNode</Code>
              </Text>
              leading asset or icon to be placed at the left most side of the ModalHeader
            </Text>
          ),
          trailing: (
            <Text size="small" type="subdued">
              <Text size="small" type="subdued">
                <Code size="medium">Badge</Code>,<Code>Link</Code>,<Code>Text</Code>,
                <Code>IconButton</Code>
              </Text>
              trailing component to be placed at the right most side of the ModalHeader
            </Text>
          ),
          titleSuffix: (
            <Text size="small" type="subdued">
              <Text size="small" type="subdued">
                <Code size="medium">Counter</Code>
              </Text>
              A component to be placed adjacent to the title text
            </Text>
          ),
        }}
      />

      <Heading size="medium">ModalBody Props</Heading>
      <ArgsTable
        marginBottom="spacing.4"
        data={{
          children: (
            <Text>
              [<Code>{'<ModalBody />'}</Code>, <Code>{'<ModalHeader />'}</Code>,
              <Code>{'<ModalHeader />'}</Code>]
              <Text size="small" type="subdued">
                (required)
              </Text>
            </Text>
          ),
          padding: (
            <Text size="small" type="subdued">
              <Text size="small">{`'spacing.0' | 'spacing.6'`}</Text>
              {`Padding for the Modal Body. Default : 'spacing.6'`}
            </Text>
          ),
        }}
      />

      <Heading size="medium">ModalFooter Props</Heading>
      <ArgsTable
        marginBottom="spacing.4"
        data={{
          children: (
            <Text>
              <Code>{'JSX.Element'}</Code>
              <Text size="small" type="subdued">
                (required)
              </Text>
            </Text>
          ),
        }}
      />
    </StoryPageWrapper>
  );
};

export { ModalDocs };
