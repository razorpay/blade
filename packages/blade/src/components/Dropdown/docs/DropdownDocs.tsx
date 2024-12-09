import React from 'react';
import {
  getSimpleSelectCode,
  Playground,
  WithControlledMenuStory,
  WithControlledSelectStory,
  WithSimpleMenuStory,
} from './stories';
import { getSimpleAutoComplete } from './autoCompleteStories';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Code, Heading, Text } from '~components/Typography';
import { Sandbox, VerticalSandbox } from '~utils/storybook/Sandbox/SandpackEditor';
import { Box } from '~components/Box';
import { ArgsTable } from '~utils/storybook/ArgsTable';
import { List, ListItem, ListItemLink } from '~components/List';
import BaseBox from '~components/Box/BaseBox';
import { Link } from '~components/Link';

const DropdownDocs = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Dropdown"
      componentDescription="Dropdown component to help you create select menu or action menu. To create a menu, you would have to use this component + Trigger (SelectInput, AutoComplete, DropdownButton, DropdownLink) + ActionList"
      imports=""
      showStorybookControls={false}
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=76148-112797&t=52JyBlYu2aTTWc8p-1&scaling=min-zoom&page-id=21342%3A380660&mode=design"
    >
      <Box as="section">
        <Heading size="xlarge">Playground</Heading>
        <Sandbox editorHeight={400}>{Playground}</Sandbox>
      </Box>
      <BaseBox id="dropdown" as="section">
        <Heading size="xlarge" marginBottom="spacing.4">
          Dropdown
        </Heading>
        <Text>A Dropdown in Blade is usually a composite of 3 elements -</Text>
        <List variant="ordered-filled" marginY="spacing.5">
          <ListItem>
            <ListItemLink href="/?path=/docs/components-dropdown-dropdown--docs">
              Dropdown
            </ListItemLink>{' '}
            - Handles opening / closing of Dropdown
          </ListItem>
          <ListItem>
            A Trigger - Can be{' '}
            <ListItemLink href="/?path=/docs/components-dropdown-with-select-stories--props-playground">
              SelectInput
            </ListItemLink>
            ,{' '}
            <ListItemLink href="/?path=/docs/components-dropdown-with-autocomplete-stories--props-playground">
              AutoComplete
            </ListItemLink>
            , DropdownButton (Has same props as{' '}
            <ListItemLink href="/?path=/docs/components-button--default">Button</ListItemLink>), or
            DropdownLink (Has same props as{' '}
            <ListItemLink href="/?path=/docs/components-link--link-button">Link</ListItemLink>)
          </ListItem>
          <ListItem>
            <ListItemLink href="/?path=/docs/components-dropdown-actionlist-docs--docs">
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
                [<Code>{'<SelectInput />'}</Code> | <Code>{'<DropdownButton />'}</Code> |{' '}
                <Code>{'<DropdownLink />'}</Code>, <Code>{'<DropdownOverlay />'}</Code>]
              </Text>
            ),
          }}
        />
        <Text>Also, Check out</Text>
        <List marginBottom="spacing.8">
          <ListItem>
            <ListItemLink
              target="_blank"
              href="/?path=/docs/components-dropdown-with-select-stories--props-playground"
            >
              SelectInput Props
            </ListItemLink>
          </ListItem>

          <ListItem>
            <ListItemLink
              target="_blank"
              href="/?path=/docs/components-dropdown-with-autocomplete-stories--props-playground"
            >
              AutoComplete Props
            </ListItemLink>
          </ListItem>

          <ListItem>
            <ListItemLink
              target="_blank"
              href="?path=/docs/components-dropdown-actionlist-docs--docs"
            >
              ActionList Props
            </ListItemLink>
          </ListItem>
          <ListItem>
            DropdownButton (Has same props as{' '}
            <ListItemLink href="/?path=/docs/components-button--default">Button</ListItemLink>)
          </ListItem>
          <ListItem>
            DropdownLink (Has same props as{' '}
            <ListItemLink href="/?path=/docs/components-link--link-button">Link</ListItemLink>)
          </ListItem>
        </List>
      </BaseBox>
      <BaseBox as="section" id="dropdownheader">
        <Heading size="xlarge">DropdownHeader</Heading>
        <ArgsTable
          data={{
            title: 'string',
            subtitle: 'string',
            leading: 'ReactNode',
            titleSuffix: 'ReactNode',
            trailing: 'ReactNode',
          }}
        />
      </BaseBox>
      <BaseBox as="section" id="dropdownfooter">
        <Heading size="xlarge">DropdownFooter</Heading>
        <ArgsTable
          data={{
            children: 'ReactNode',
          }}
        />
      </BaseBox>
      <BaseBox as="section">
        <Heading size="large">With SelectInput</Heading>
        <Text marginY="spacing.3">
          Check out more Select examples at{' '}
          <Link href="/?path=/docs/components-dropdown-with-select--with-single-select">
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
        <VerticalSandbox minHeight="250px" code={WithControlledSelectStory} />
      </BaseBox>
      <BaseBox as="section">
        <Heading size="large">With AutoComplete</Heading>
        <Text marginY="spacing.3">
          Check out more AutoComplete examples at{' '}
          <Link href="/?path=/docs/components-dropdown-with-autocomplete--with-single-select">
            Dropdown with AutoComplete Stories
          </Link>
        </Text>
        <Heading size="large" marginBottom="spacing.3">
          Simple Single Select
        </Heading>
        <VerticalSandbox minHeight="250px" code={getSimpleAutoComplete('single')} />
        <Heading size="large" marginBottom="spacing.3">
          Simple Multi Select
        </Heading>
        <VerticalSandbox minHeight="250px" code={getSimpleAutoComplete('multiple')} />
      </BaseBox>
      <BaseBox as="section">
        <Heading size="large" marginBottom="spacing.3">
          With Button
        </Heading>
        <Text marginY="spacing.3">
          Check out more Menu examples at{' '}
          <Link href="/?path=/docs/components-dropdown-with-button-and-link--default">
            Dropdown with Button Stories
          </Link>
        </Text>
        <Heading size="large" marginBottom="spacing.3">
          Action Menu
        </Heading>
        <VerticalSandbox minHeight="300px" code={WithSimpleMenuStory} />
        <Heading size="large" marginBottom="spacing.3">
          Selectable Menu
        </Heading>
        <VerticalSandbox minHeight="250px" code={WithControlledMenuStory} />
      </BaseBox>
    </StoryPageWrapper>
  );
};

export { DropdownDocs };
