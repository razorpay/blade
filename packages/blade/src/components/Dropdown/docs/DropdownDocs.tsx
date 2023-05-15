import React from 'react';
import {
  getSimpleSelectCode,
  Playground,
  WithControlledMenuStory,
  WithControlledSelectStory,
  WithSimpleMenuStory,
} from './stories';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { Code, Heading, Text, Title } from '~components/Typography';
import { Sandbox, VerticalSandbox } from '~src/_helpers/storybook/Sandbox';
import { Box } from '~components/Box';
// import BaseBox from '~components/Box/BaseBox';
import { ArgsTable } from '~src/_helpers/storybook/ArgsTable';
import { List, ListItem, ListItemLink } from '~components/List';
import BaseBox from '~components/Box/BaseBox';
import { Link } from '~components/Link';

const DropdownDocs = (): JSX.Element => {
  return (
    <StoryPageWrapper
      componentName="Dropdown"
      componentDescription="Dropdown component to help you create select menu or action menu. To create a menu, you would have to use this component + Trigger (SelectInput, DropdownButton) + ActionList"
      imports=""
      showStorybookControls={false}
    >
      <Box as="section">
        <Title size="medium">Playground</Title>
        <Sandbox editorHeight={400}>{Playground}</Sandbox>
      </Box>
      <BaseBox id="dropdown" as="section">
        <Title size="medium" marginBottom="spacing.4">
          Dropdown
        </Title>
        <Text>A Dropdown in Blade is usually a composite of 3 elements -</Text>
        <List variant="ordered-filled" marginY="spacing.5">
          <ListItem>
            <ListItemLink href="/?path=/docs/components-dropdown-dropdown--page#dropdown">
              Dropdown
            </ListItemLink>{' '}
            - Handles opening / closing of Dropdown
          </ListItem>
          <ListItem>
            A Trigger - Can be{' '}
            <ListItemLink href="/?path=/docs/components-dropdown-selectinput--default">
              SelectInput
            </ListItemLink>
            , or <ListItemLink>DropdownButton</ListItemLink>
          </ListItem>
          <ListItem>
            <ListItemLink href="/?path=/docs/components-dropdown-actionlist--page">
              ActionList
            </ListItemLink>{' '}
            - List of Actionable items inside Dropdown
          </ListItem>
        </List>
        <ArgsTable
          marginBottom="spacing.3"
          marginTop="spacing.8"
          data={{
            selectionType: "'single' | 'multiple'",
            children: (
              <Text>
                [<Code>{'<SelectInput />'}</Code> | <Code>{'<DropdownButton />'}</Code>,{' '}
                <Code>{'<DropdownOverlay />'}</Code>]
              </Text>
            ),
          }}
        />
        <Text>Also, Check out</Text>
        <List marginBottom="spacing.8">
          <ListItem>
            <ListItemLink
              target="_blank"
              href="/?path=/docs/components-dropdown-selectinput--default"
            >
              SelectInput Props
            </ListItemLink>
          </ListItem>
          <ListItem>
            <ListItemLink target="_blank" href="/?path=/docs/components-dropdown-actionlist--page">
              ActionList Props
            </ListItemLink>
          </ListItem>
        </List>
      </BaseBox>
      <BaseBox as="section">
        <Title size="small">With SelectInput</Title>
        <Text marginY="spacing.3">
          Check out more Select examples at{' '}
          <Link href="/?path=/docs/components-dropdown-stories-with-select--with-single-select">
            Dropdown with SelectInput Stories
          </Link>
        </Text>
        <Heading size="large" marginBottom="spacing.3">
          Simple Select
        </Heading>
        <VerticalSandbox minHeight="250px" code={getSimpleSelectCode('single')} />
        <Heading size="large" marginBottom="spacing.3">
          Controlled Select
        </Heading>
        <Text>TODO: add example</Text>
        <VerticalSandbox minHeight="250px" code={WithControlledSelectStory} />
      </BaseBox>
      <BaseBox as="section">
        <Title size="small" marginBottom="spacing.3">
          With Button
        </Title>
        <Text marginY="spacing.3">
          Check out more Menu examples at{' '}
          <Link href="/?path=/docs/components-dropdown-stories-with-button--default">
            Dropdown with Button Stories
          </Link>
        </Text>
        <Heading size="large" marginBottom="spacing.3">
          Action Menu
        </Heading>
        <Text>TODO: add example</Text>
        <VerticalSandbox minHeight="250px" code={WithSimpleMenuStory} />
        <Heading size="large" marginBottom="spacing.3">
          Selectable Menu
        </Heading>
        <Text>TODO: add example</Text>
        <VerticalSandbox minHeight="250px" code={WithControlledMenuStory} />
      </BaseBox>
      {/* <BaseBox as="section" paddingBottom="spacing.9" id="actionlistitem">
        <Title size="medium">ActionListItem</Title>
        <VerticalSandbox code={ActionListItem} />
        <ArgsTable data={actionListPropsTables.ActionListItem} />
        <BaseBox id="actionlistitemicon">
          <Title size="small">ActionListItemIcon</Title>
          <ArgsTable
            data={{
              icon: <Code>IconComponent</Code>,
            }}
          />
        </BaseBox>
        <BaseBox id="actionlistitemtext">
          <Title size="small">ActionListItemText</Title>
          <ArgsTable data={{ children: 'string' }} />
        </BaseBox>
        <BaseBox id="actionlistitemasset">
          <Title size="small">ActionListItemAsset</Title>
          <ArgsTable data={{ href: 'string', alt: 'string' }} />
        </BaseBox>
      </BaseBox>
      <BaseBox as="section" id="actionlistsection">
        <Title size="medium">ActionListSection</Title>
        <VerticalSandbox minHeight="250px" code={ActionListSection} />
        <ArgsTable data={actionListPropsTables.ActionListSection} />
      </BaseBox> */}
    </StoryPageWrapper>
  );
};

export { DropdownDocs };
