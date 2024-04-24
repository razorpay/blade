import type { StoryFn, Meta } from '@storybook/react';
import type { SearchInputProps } from '../SearchInput';
import { SearchInput as SearchInputComponent } from '../SearchInput';
import { Heading } from '~components/Typography/Heading';
import { Box } from '~components/Box';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { RefreshIcon, ShareIcon, DownloadIcon, ChevronDownIcon, PlusIcon } from '~components/Icons';
import { Dropdown, DropdownButton, DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="SearchInput"
      componentDescription="The SearchInput component is used to group related buttons together."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=80753%3A108070&mode=design&t=iGYw4ygZL8cErFIL-1"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import {
          Button,
          SearchInput,
          RefreshIcon,
          ShareIcon,
          DownloadIcon,
        } from '@razorpay/blade/components';
        
        function App(): React.ReactElement {
          return (
            <SearchInput>
              <Button icon={RefreshIcon}>Sync</Button>
              <Button icon={ShareIcon}>Share</Button>
              <Button icon={DownloadIcon}>Download</Button>
            </SearchInput>
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Input/SearchInput',
  component: SearchInputComponent,
  tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<SearchInputProps>;

const SearchInputTemplate: StoryFn<typeof SearchInputComponent> = (args) => {
  return <SearchInputComponent {...args} />;
};

export const Default = SearchInputTemplate.bind({});
Default.storyName = 'Default';

// const SearchInputDropdownTemplate: StoryFn<typeof SearchInputComponent> = (args) => {
//   return (
//     <Box display="flex" alignItems="center" justifyContent="center">
//       <SearchInputComponent {...args}>
//         <Button icon={PlusIcon}>Payout</Button>
//         <Dropdown>
//           <DropdownButton icon={ChevronDownIcon} />
//           <DropdownOverlay defaultPlacement="bottom-end">
//             <ActionList>
//               <ActionListItem title="Bulk Payout" value="bulk-payout" />
//               <ActionListItem title="Upload Invoice" value="upload-invoice" />
//               <ActionListItem title="Add Contact" value="add-contact" />
//               <ActionListItem title="Team Member" value="team-member" />
//             </ActionList>
//           </DropdownOverlay>
//         </Dropdown>
//       </SearchInputComponent>
//     </Box>
//   );
// };

// export const WithDropdown = SearchInputDropdownTemplate.bind({});
// WithDropdown.storyName = 'With Dropdown';

// const SearchInputVariantsTemplate: StoryFn<typeof SearchInputComponent> = (args) => {
//   const variants: SearchInputProps['variant'][] = ['primary', 'secondary', 'tertiary'];
//   return (
//     <>
//       {variants.map((variant) => (
//         <Box key={variant} marginBottom="spacing.8">
//           <Heading marginBottom="spacing.3">{variant}</Heading>
//           <SearchInputComponent {...args} variant={variant}>
//             <Button icon={RefreshIcon}>Sync</Button>
//             <Button icon={ShareIcon}>Share</Button>
//             <Button icon={DownloadIcon}>Download</Button>
//           </SearchInputComponent>
//         </Box>
//       ))}
//     </>
//   );
// };

// export const AllVariants = SearchInputVariantsTemplate.bind({});
// AllVariants.storyName = 'All Variants';

// const SearchInputSizesTemplate: StoryFn<typeof SearchInputComponent> = (args) => {
//   const sizes: SearchInputProps['size'][] = ['xsmall', 'small', 'medium', 'large'];
//   return (
//     <>
//       {sizes.map((size) => (
//         <Box key={size} marginBottom="spacing.8">
//           <Heading marginBottom="spacing.3">{size}</Heading>
//           <SearchInputComponent {...args} size={size}>
//             <Button icon={RefreshIcon}>Sync</Button>
//             <Button icon={ShareIcon}>Share</Button>
//             <Button icon={DownloadIcon}>Download</Button>
//           </SearchInputComponent>
//         </Box>
//       ))}
//     </>
//   );
// };

// export const AllSizes = SearchInputSizesTemplate.bind({});
// AllSizes.storyName = 'All Sizes';
const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const menuItems = [
    'Settings',
    'Profile',
    'Transactions',
    'Help',
    'Refunds',
    'Settlements',
    'Payouts',
  ];
  const popularItems = ['Transactions', 'Settlements'];

  return (
    <Dropdown>
      <SearchInput
        label="Search"
        onChange={({ value }) => setSearchTerm(value)}
        placeholder="Search here"
      />
      <DropdownOverlay>
        <ActionList>
          {searchTerm.length === 0
            ? popularItems.map((item, index) => (
                <ActionListItem key={index} title={item} value={item} />
              ))
            : menuItems
                .filter((item) => item.includes(searchTerm))
                .map((item, index) => <ActionListItem key={index} title={item} value={item} />)}
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};
