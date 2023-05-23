const Playground = `
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
`;

const ActionList = `
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
`;

const ActionListItem = `
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
`;

const ActionListSection = `
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
`;

export { Playground, ActionList, ActionListItem, ActionListSection };
