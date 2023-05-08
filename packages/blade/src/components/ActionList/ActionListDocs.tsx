import React from 'react';
import styled from 'styled-components';
import { SandpackCodeEditor, SandpackPreview } from '@codesandbox/sandpack-react';
import StoryPageWrapper from '~src/_helpers/storybook/StoryPageWrapper';
import { Code, Text, Title } from '~components/Typography';
import { Sandbox, SandboxProvider } from '~src/_helpers/storybook/Sandbox';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import BaseBox from '~components/Box/BaseBox';

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

const ArgsTable = styled.table(
  (props) => `
  font-family: ${props.theme.typography.fonts.family.text};
  text-align: left;
  min-width: 500px;

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

const ActionListDocs = (): JSX.Element => {
  return (
    <StoryPageWrapper
      componentDescription="A list of action items that can be rendered inside Dropdown. Composite of multiple components like ActionList, ActionListItem, ActionListSection, and more"
      componentName="ActionList"
      showStorybookControls={false}
      imports=""
    >
      <Box as="section">
        <Title size="medium">Playground</Title>
        <Sandbox editorHeight={400}>
          {`
          import { 
            Box, 
            ActionList, 
            ActionListItem,
            ActionListHeader,
            ActionListHeaderIcon,
            ActionListFooter,
            ActionListFooterIcon,
            ActionListSection,
            ActionListItemIcon,
            ActionListItemAsset,
            ActionListItemText,
            // Icons
            LogOutIcon,
            UserIcon,
            MyAccountIcon,
            SettingsIcon,
            DownloadIcon,
            FileTextIcon,
            Button 
          } from '@razorpay/blade/components';

          function App(): JSX.Element {
            return (
            <Box>
              <ActionList surfaceLevel={2}>
                <ActionListHeader
                  title="Your Account"
                  leading={<ActionListHeaderIcon icon={MyAccountIcon} />}
                />
                <ActionListItem
                  leading={<ActionListItemIcon icon={UserIcon} />}
                  title="Profile"
                  value="profile"
                />
                <ActionListSection title="Help">
                  <ActionListItem
                    leading={<ActionListItemIcon icon={SettingsIcon} />}
                    title="Settings"
                    value="settings"
                    isDisabled={true}
                  />
                  <ActionListItem
                    leading={<ActionListItemIcon icon={DownloadIcon} />}
                    title="Download"
                    value="download"
                  />
                  
                </ActionListSection>
                <ActionListItem
                    leading={<ActionListItemAsset src="https://flagcdn.com/w20/in.png" alt="india" />}
                    title="Pricing"
                    value="pricing"
                  />
                <ActionListItem
                  leading={<ActionListItemIcon icon={LogOutIcon} />}
                  title="Log Out"
                  value="logout"
                  intent="negative"
                />
                <ActionListFooter
                  title="Footer Tips"
                  leading={<ActionListFooterIcon icon={FileTextIcon} />}
                  trailing={<Button onClick={console.log}>Apply</Button>}
                />
              </ActionList>
            </Box>
            )
          }

          export default App;
        `}
        </Sandbox>
      </Box>
      <Box as="section" paddingBottom="spacing.9">
        <Title size="medium">ActionList</Title>
        <VerticalEditor
          code={`
        import { Box, ActionList, ActionListItem } from '@razorpay/blade/components';

        function App(): JSX.Element {
          return (
          <Box>
            <ActionList surfaceLevel={2}>
              <ActionListItem title="Mumbai" value="mumbai" />
              <ActionListItem title="Bangalore" value="bangalore" />
            </ActionList>
          </Box>
          )
        }

        export default App;
      `}
        />
        <ArgsTable>
          <tr>
            <th>
              <Text weight="bold">Prop</Text>
            </th>
            <th>
              <Text weight="bold">Type</Text>
            </th>
          </tr>
          <tr>
            <td>
              <Code size="medium">surfaceLevel</Code>
            </td>
            <td>
              <Text>2 | 3</Text>
            </td>
          </tr>
        </ArgsTable>
      </Box>
      <Box as="section" paddingBottom="spacing.9">
        <Title size="medium">ActionListItem</Title>
        <VerticalEditor
          code={`
        import { 
          Box, 
          ActionList, 
          ActionListItem, 
          ActionListItemIcon, 
          ActionListItemText, 
          HomeIcon 
        } from '@razorpay/blade/components';

        function App(): JSX.Element {
          return (
          <Box>
            <ActionList>
              <ActionListItem 
                title="Title"
                value="actionlist-value" 
                description="Description of the ActionListItem" 
                leading={<ActionListItemIcon icon={HomeIcon} />} 
                trailing={<ActionListItemText>⌘ + H</ActionListItemText>}
              />
            </ActionList>
          </Box>
          )
        }

        export default App;
      `}
        />
        <ArgsTable>
          <tr>
            <th>
              <Text weight="bold">Prop</Text>
            </th>
            <th>
              <Text weight="bold">Type</Text>
            </th>
          </tr>
          <tr>
            <td>
              <Code size="medium">title</Code>
            </td>
            <td>
              <Text>string</Text>
            </td>
          </tr>
          <tr>
            <td>
              <Code size="medium">description</Code>
            </td>
            <td>
              <Text>string</Text>
            </td>
          </tr>
          <tr>
            <td>
              <Code size="medium">value</Code>
            </td>
            <td>
              <Text>string</Text>
            </td>
          </tr>
          <tr>
            <td>
              <Code size="medium">leading</Code>
            </td>
            <td>
              <Code>&lt;ActionListItemIcon /&gt;</Code> | <Code>&lt;ActionListItemAsset /&gt;</Code>
            </td>
          </tr>
          <tr>
            <td>
              <Code size="medium">trailing</Code>
            </td>
            <td>
              <Code>&lt;ActionListItemIcon /&gt;</Code> | <Code>&lt;ActionListItemText /&gt;</Code>
            </td>
          </tr>
        </ArgsTable>
      </Box>
      <Box as="section">
        <Title size="medium">ActionListSection</Title>
        <VerticalEditor
          minHeight="250px"
          code={`
        import { 
          Box, 
          ActionList, 
          ActionListItem, 
          ActionListSection,
        } from '@razorpay/blade/components';

        function App(): JSX.Element {
          return (
          <Box>
            <ActionList>
              {/* You can multiple sections like this 👇🏼 */}
              <ActionListSection title="Account @blade">
                <ActionListItem 
                  title="Your Profile"
                  value="your-profile" 
                />
                <ActionListItem 
                  title="Settings"
                  value="settings" 
                />
              </ActionListSection>
              <ActionListItem 
                title="Log Out"
                value="logout"
                intent="negative"
              />
            </ActionList>
          </Box>
          )
        }

        export default App;
      `}
        />
      </Box>
    </StoryPageWrapper>
  );
};

export { ActionListDocs };
