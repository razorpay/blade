const Playground = `
  import { 
    Box, 
    ActionList, 
    ActionListItem,
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

  function App() {
    return (
    <Box backgroundColor="surface.background.gray.intense">
      <ActionList>
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
      </ActionList>
    </Box>
    )
  }

  export default App;
`;

const ActionList = `
  import { Box, ActionList, ActionListItem } from '@razorpay/blade/components';

  function App() {
    return (
    <Box backgroundColor="surface.background.gray.intense">
      <ActionList>
        <ActionListItem title="Mumbai" value="mumbai" />
        <ActionListItem title="Bangalore" value="bangalore" />
      </ActionList>
    </Box>
    )
  }

  export default App;
`;

const ActionListItem = `
  import { 
    Box, 
    ActionList, 
    ActionListItem, 
    ActionListItemIcon, 
    ActionListItemText, 
    ActionListItemBadgeGroup,
    ActionListItemBadge,
    HomeIcon 
  } from '@razorpay/blade/components';

  function App() {
    return (
    <Box backgroundColor="surface.background.gray.intense">
      <ActionList>
        <ActionListItem 
          title="Title"
          titleSuffix={(
            <ActionListItemBadgeGroup>
              <ActionListItemBadge>as: Keyword</ActionListItemBadge>
              <ActionListItemBadge>in: Something</ActionListItemBadge>
            </ActionListItemBadgeGroup>
          )}
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
`;

const ActionListSection = `
  import { 
    Box, 
    ActionList, 
    ActionListItem, 
    ActionListSection,
  } from '@razorpay/blade/components';

  function App() {
    return (
    <Box backgroundColor="surface.background.gray.intense">
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
`;

export { Playground, ActionList, ActionListItem, ActionListSection };
