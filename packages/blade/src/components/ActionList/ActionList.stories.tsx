import type { ComponentStory, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ActionListProps } from './ActionList';
import { ActionList as ActionListComponent } from './ActionList';
import {
  ActionListItem,
  ActionListItemBadge,
  ActionListItemBadgeGroup,
  ActionListItemIcon,
  ActionListItemText,
  ActionListSection,
} from './ActionListItem';
import { ActionListItemAsset } from './ActionListItemAsset';
import BaseBox from '~components/Box/BaseBox';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import {
  DownloadIcon,
  SettingsIcon,
  BankIcon,
  LogOutIcon,
  UserIcon,
  ActivityIcon,
  TransactionsIcon,
} from '~components/Icons';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="ActionList"
      componentDescription="ActionList contains list of ActionList Items with or without in sections to perform particular actions."
    >
      <Title>Usage</Title>
      <Sandbox editorHeight={500}>
        {`
          import { 
              Box, 
              ActionList, 
              ActionListItem,
              ActionListSection,
              ActionListItemIcon,
              ActionListItemAsset,
              ActionListItemText,
              LogOutIcon,
              SettingsIcon,
              DownloadIcon,
              Button 
          } from '@razorpay/blade/components';

          function App(): React.ReactElement {
              return (
                  <Box backgroundColor="surface.background.level2.lowContrast">
                  <ActionList>
                    <ActionListItem
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
                  </ActionList>
                  </Box>
              )
          }

          export default App;
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Dropdown/ActionList/Stories',
  component: ActionListComponent,
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ActionListProps>;

const ActionListExample: ComponentStory<typeof ActionListComponent> = () => (
  <BaseBox display="flex" flexDirection="column">
    <Box backgroundColor="surface.background.level2.lowContrast">
      <ActionListComponent>
        <ActionListItem title="Item 1" value="item1" />
        <ActionListItem title="Item 2" value="item2" />
      </ActionListComponent>
    </Box>
  </BaseBox>
);
export const ActionList = ActionListExample.bind({});
ActionList.storyName = 'Default';
ActionList.parameters = {
  docs: {
    description: {
      story: 'Action List has Items inside as a list',
    },
  },
};

const ActionListWithLeadingComponentsExample: ComponentStory<typeof ActionListComponent> = () => {
  return (
    <BaseBox display="flex" flexDirection="column">
      <Box backgroundColor="surface.background.level2.lowContrast">
        <ActionListComponent>
          <ActionListItem
            leading={<ActionListItemIcon icon={SettingsIcon} />}
            title="Settings"
            value="settings"
          />
          <ActionListItem
            leading={<ActionListItemIcon icon={DownloadIcon} />}
            title="Download"
            value="download"
          />
          <ActionListItem
            leading={<ActionListItemAsset src="https://flagcdn.com/w20/in.png" alt="india" />}
            title="Pricing"
            value="pricing"
          />
        </ActionListComponent>
      </Box>
    </BaseBox>
  );
};
export const ActionListWithLeadingComponents = ActionListWithLeadingComponentsExample.bind({});
ActionListWithLeadingComponents.storyName = 'Leading icons/images on Items';
ActionListWithLeadingComponents.parameters = {
  docs: {
    description: {
      story: 'Items in Action List can have leading components for better look',
    },
  },
};

const ActionListWithTrailingComponentsExample: ComponentStory<typeof ActionListComponent> = () => {
  return (
    <BaseBox display="flex" flexDirection="column">
      <Box backgroundColor="surface.background.level2.lowContrast">
        <ActionListComponent>
          <ActionListItem
            title="Bank Settings"
            value="bank_settings"
            trailing={<ActionListItemIcon icon={BankIcon} />}
          />
          <ActionListItem
            title="FAQs, Live Chat"
            value="faqs"
            trailing={<ActionListItemText>⌘ + H</ActionListItemText>}
          />
        </ActionListComponent>
      </Box>
    </BaseBox>
  );
};
export const ActionListWithTrailingComponents = ActionListWithTrailingComponentsExample.bind({});
ActionListWithTrailingComponents.storyName = 'Trailing icons/texts on Items';
ActionListWithTrailingComponents.parameters = {
  docs: {
    description: {
      story: 'Items in Action List can have trailing icons and texts',
    },
  },
};

const ActionListWithSectionsExample: ComponentStory<typeof ActionListComponent> = () => {
  return (
    <BaseBox display="flex" flexDirection="column">
      <Box backgroundColor="surface.background.level2.lowContrast">
        <ActionListComponent>
          <ActionListItem
            title="Profile"
            value="profile"
            leading={<ActionListItemIcon icon={UserIcon} />}
          />
          <ActionListSection title="Account @profile">
            <ActionListItem
              title="Transactions"
              value="transactions"
              leading={<ActionListItemIcon icon={TransactionsIcon} />}
            />
            <ActionListItem
              title="Banks"
              value="banks"
              leading={<ActionListItemIcon icon={BankIcon} />}
            />
          </ActionListSection>
          <ActionListItem
            title="Logout"
            value="logout"
            intent="negative"
            leading={<ActionListItemIcon icon={LogOutIcon} />}
          />
        </ActionListComponent>
      </Box>
    </BaseBox>
  );
};
export const ActionListWithSections = ActionListWithSectionsExample.bind({});
ActionListWithSections.storyName = 'With Sections';
ActionListWithSections.parameters = {
  docs: {
    description: {
      story: 'Items in Action List can be within a section',
    },
  },
};

const ActionListWithCustomItemsExample: ComponentStory<typeof ActionListComponent> = () => {
  return (
    <BaseBox display="flex" flexDirection="column">
      <Box backgroundColor="surface.background.level2.lowContrast">
        <ActionListComponent>
          <ActionListSection title="Account">
            <ActionListItem
              title="Profile"
              value="profile"
              leading={<ActionListItemIcon icon={UserIcon} />}
            />
            <ActionListItem title="Credit" value="credit" description="check your credit here!" />
            <ActionListItem title="Disabled" value="disabled" isDisabled />
          </ActionListSection>
          <ActionListItem
            title="Go to Home"
            value="home"
            href="https://razorpay.com"
            target="_blank"
          />
          <ActionListItem
            title="Alert user"
            value="alert_user"
            onClick={() => {
              // eslint-disable-next-line no-alert
              alert('Alert user is clicked!');
            }}
          />
          <ActionListItem
            title="Systems"
            value="systems"
            href="https://razorpay.com/careers"
            target="_blank"
            titleSuffix={
              <ActionListItemBadgeGroup>
                <ActionListItemBadge icon={ActivityIcon} color="information">
                  unstable
                </ActionListItemBadge>
                <ActionListItemBadge>last updated: 2hr ago</ActionListItemBadge>
              </ActionListItemBadgeGroup>
            }
          />
          <ActionListItem
            leading={<ActionListItemIcon icon={LogOutIcon} />}
            title="Log Out"
            value="logout"
            intent="negative"
          />
        </ActionListComponent>
      </Box>
    </BaseBox>
  );
};
export const ActionListWithCustomItems = ActionListWithCustomItemsExample.bind({});
ActionListWithCustomItems.storyName = 'Custom Items';
ActionListWithCustomItems.parameters = {
  docs: {
    description: {
      story: 'Items in Action List can be customized based on various ways',
    },
  },
};
