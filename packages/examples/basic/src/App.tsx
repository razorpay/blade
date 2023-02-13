import {
  BladeProvider,
  Dropdown,
  DropdownOverlay,
  SelectInput,
  ActionList,
  // ActionListFooter,
  // ActionListFooterIcon,
  // ActionListHeader,
  ActionListItem,
  // ActionListHeaderIcon,
  // ActionListSection,
  // ActionListItemAsset,
  ActionListItemIcon,
  // Button,
  // HistoryIcon,
  ArrowRightIcon,
  SettingsIcon,
  // DownloadIcon,
  // SearchIcon,
  HomeIcon,
} from '@razorpay/blade/components';
import { paymentTheme } from '@razorpay/blade/tokens';
import '@fontsource/lato/400.css';
import '@fontsource/lato/400-italic.css';
import '@fontsource/lato/700.css';
import '@fontsource/lato/700-italic.css';

function App(): JSX.Element {
  return (
    <BladeProvider themeTokens={paymentTheme} colorScheme="light">
      <Dropdown>
        <SelectInput
          label="Select Action"
          onChange={({ name, values }) => {
            console.log(name, values);
          }}
        />
        <DropdownOverlay>
          <ActionList>
            {/* <ActionListHeader
              title="Recent Searches"
              leading={<ActionListHeaderIcon icon={HistoryIcon} />}
            /> */}
            <ActionListItem
              leading={<ActionListItemIcon icon={HomeIcon} />}
              trailing={<ActionListItemIcon icon={ArrowRightIcon} />}
              title="Home"
              value="home"
              description="Home sweet home"
            />
            <ActionListItem
              leading={<ActionListItemIcon icon={SettingsIcon} />}
              title="Settings"
              value="settings"
              isDisabled={true}
            />
            {/* <ActionListSection title="Options">
              
              <ActionListItem
                leading={<ActionListItemIcon icon={DownloadIcon} />}
                title="Download"
                value="download"
              />
            </ActionListSection> */}
            {/* <ActionListItem
              leading={<ActionListItemAsset src="https://flagcdn.com/w20/in.png" alt="india" />}
              title="Pricing"
              value="pricing"
            /> */}
            {/* <ActionListFooter
              title="Search"
              leading={<ActionListFooterIcon icon={SearchIcon} />}
              trailing={<Button onClick={console.log}>Apply</Button>}
            /> */}
          </ActionList>
        </DropdownOverlay>
      </Dropdown>
    </BladeProvider>
  );
}

export default App;
