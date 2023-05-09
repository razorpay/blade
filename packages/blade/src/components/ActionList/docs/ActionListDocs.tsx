import React from 'react';
import styled from 'styled-components';
import { SandpackCodeEditor, SandpackPreview } from '@codesandbox/sandpack-react';
import { ActionList, ActionListItem, ActionListSection, Playground } from './stories';
import { actionListPropsTables } from './propsTable';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { Code, Text, Title } from '~components/Typography';
import { Sandbox, SandboxProvider } from '~src/_helpers/storybook/Sandbox';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import BaseBox from '~components/Box/BaseBox';
import { Alert } from '~components/Alert';

const VerticalEditor = ({
  code,
  minHeight = undefined,
}: {
  code: string;
  minHeight?: string;
}): JSX.Element => {
  const [showCode, setShowCode] = React.useState(false);

  return (
    <Box paddingY="spacing.2">
      <SandboxProvider code={code} border="none">
        <BaseBox backgroundColor="surface.background.level1.lowContrast" border="1px solid #EFEFEF">
          <SandpackPreview style={{ width: '100%', minHeight }} />
        </BaseBox>
        <Box display="flex" justifyContent="flex-end">
          <Button
            alignSelf="flex-end"
            variant="tertiary"
            size="small"
            onClick={() => setShowCode(!showCode)}
          >
            {showCode ? 'Hide' : 'Show'} Code
          </Button>
        </Box>
        {showCode ? (
          <BaseBox border="1px solid #EFEFEF">
            <SandpackCodeEditor />
          </BaseBox>
        ) : null}
      </SandboxProvider>
    </Box>
  );
};

const StyledArgsTable = styled.table(
  (props) => `
  font-family: ${props.theme.typography.fonts.family.text};
  text-align: left;
  min-width: 500px;
  margin-bottom: ${props.theme.spacing[8]}px;
  margin-top: ${props.theme.spacing[4]}px;

  &,
  & th,
  & td {
    border: 1px solid ${props.theme.colors.surface.border.normal.lowContrast};
    border-collapse: collapse;
  }

  & td,
  & th {
    padding: ${props.theme.spacing[3]}px;
  }
`,
);

const ArgsTable = ({
  data,
}: {
  data: Record<string, string | { note: string; type: string | JSX.Element } | JSX.Element>;
}): JSX.Element => {
  return (
    <StyledArgsTable>
      <tr>
        <th>
          <Text weight="bold">Prop</Text>
        </th>
        <th>
          <Text weight="bold">Type</Text>
        </th>
      </tr>
      {Object.entries(data).map(([propName, propType]) => {
        const isTypeObject = typeof propType === 'object' && 'note' in propType;
        const propNote = isTypeObject ? `(${propType.note})` : undefined;
        const propTypeJSX = (() => {
          if (typeof propType === 'string') {
            return <Text>{propType}</Text>;
          }

          if (isTypeObject) {
            return <Text>{propType.type}</Text>;
          }

          return propType;
        })();

        return (
          <tr key={propName}>
            <td>
              <Text size="medium" variant="caption">
                <Code size="medium">{propName}</Code> {propNote}
              </Text>
            </td>

            <td>{propTypeJSX}</td>
          </tr>
        );
      })}
    </StyledArgsTable>
  );
};

const ActionListDocs = (): JSX.Element => {
  return (
    <StoryPageWrapper
      componentDescription="A list of action items that can be rendered inside Dropdown. Composite of multiple components like ActionList, ActionListItem, ActionListSection, and more"
      componentName="ActionList"
      showStorybookControls={false}
      imports=""
    >
      <Alert
        intent="notice"
        description="ActionList is meant to be used only inside the Dropdown component. Things will not work as expected if you are using this without Dropdown"
        isFullWidth
        isDismissible={false}
        marginBottom="spacing.5"
      />
      <Box as="section">
        <Title size="medium">Playground</Title>
        <Sandbox editorHeight={400}>{Playground}</Sandbox>
      </Box>
      <Box as="section" paddingBottom="spacing.9">
        <Title size="medium">ActionList</Title>
        <VerticalEditor code={ActionList} />
        <ArgsTable data={actionListPropsTables.ActionList} />
      </Box>
      <BaseBox as="section" paddingBottom="spacing.9" id="actionlistitem">
        <Title size="medium">ActionListItem</Title>
        <VerticalEditor code={ActionListItem} />
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
        <VerticalEditor minHeight="250px" code={ActionListSection} />
        <ArgsTable data={actionListPropsTables.ActionListSection} />
      </BaseBox>
    </StoryPageWrapper>
  );
};

export { ActionListDocs };
