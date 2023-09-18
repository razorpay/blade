import React from 'react';
import { ActionList, ActionListItem, ActionListSection, Playground } from './stories';
import { actionListPropsTables } from './propsTable';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Code, Text, Title } from '~components/Typography';
import { Sandbox, VerticalSandbox } from '~utils/storybook/Sandbox';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import { ArgsTable } from '~utils/storybook/ArgsTable';
import { ScrollLink } from '~utils/storybook/ScrollLink';
import { Link } from '~components/Link';

const ActionListDocs = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="A list of action items that can be rendered inside Dropdown. Composite of multiple components like ActionList, ActionListItem, ActionListSection, and more"
      componentName="ActionList"
      showStorybookControls={false}
      imports=""
      note="ActionList is meant to be used only inside the Dropdown component. Things will not work as expected if you are using this without Dropdown"
      figmaURL={{
        paymentTheme:
          'https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=30043-576428',
        bankingTheme:
          'https://www.figma.com/file/sAdplk2uYnI2ILnDKUxycW/Blade---Banking-Dark?node-id=15113-508481',
      }}
    >
      <Box as="section">
        <Title size="medium">Playground</Title>
        <Sandbox editorHeight={400}>{Playground}</Sandbox>
      </Box>
      <Box as="section" paddingBottom="spacing.9">
        <Title size="medium">ActionList</Title>
        <VerticalSandbox code={ActionList} />
        <ArgsTable data={actionListPropsTables.ActionList} />
      </Box>
      <BaseBox as="section" paddingBottom="spacing.9" id="actionlistitem">
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
        <BaseBox id="actionlistitembadgegroup">
          <Title size="small">ActionListItemBadgeGroup</Title>
          <ArgsTable
            data={{
              children: (
                <ScrollLink href="#actionlistitembadge">&lt;ActionListItemBadge /&gt;[]</ScrollLink>
              ),
            }}
          />
        </BaseBox>
        <BaseBox id="actionlistitembadge">
          <Title size="small">ActionListItemBadge</Title>
          <Text marginTop="spacing.3">
            Shares same props as <Link href="/?path=/docs/components-badge--badge">Badge</Link>
          </Text>
          <Text marginTop="spacing.3">
            Checkout{' '}
            <Link href="/?path=/story/components-dropdown-with-autocomplete--controlled-filtering">
              Custom Filtering with AutoComplete
            </Link>{' '}
            for usage of ActionListItemBadge
          </Text>
        </BaseBox>
      </BaseBox>
      <BaseBox as="section" id="actionlistsection">
        <Title size="medium">ActionListSection</Title>
        <VerticalSandbox minHeight="250px" code={ActionListSection} />
        <ArgsTable data={actionListPropsTables.ActionListSection} />
      </BaseBox>
    </StoryPageWrapper>
  );
};

export { ActionListDocs };
