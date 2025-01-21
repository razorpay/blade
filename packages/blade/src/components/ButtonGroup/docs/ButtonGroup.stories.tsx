import type { StoryFn, Meta } from '@storybook/react';
import type { ButtonGroupProps } from '../ButtonGroup';
import { ButtonGroup as ButtonGroupComponent } from '../ButtonGroup';
import { Heading } from '~components/Typography/Heading';
import { Box } from '~components/Box';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { RefreshIcon, ShareIcon, DownloadIcon, ChevronDownIcon, PlusIcon } from '~components/Icons';
import { Dropdown, DropdownButton, DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Tooltip } from '~components/Tooltip';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="ButtonGroup"
      componentDescription="The ButtonGroup component is used to group related buttons together."
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=80753%3A108070&mode=design&t=iGYw4ygZL8cErFIL-1"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import {
          Button,
          ButtonGroup,
          RefreshIcon,
          ShareIcon,
          DownloadIcon,
        } from '@razorpay/blade/components';
        
        function App() {
          return (
            <ButtonGroup>
              <Button icon={RefreshIcon}>Sync</Button>
              <Button icon={ShareIcon}>Share</Button>
              <Button icon={DownloadIcon}>Download</Button>
            </ButtonGroup>
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/ButtonGroup',
  component: ButtonGroupComponent,
  tags: ['autodocs'],
  argTypes: getStyledPropsArgTypes(),
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ButtonGroupProps>;

const ButtonGroupTemplate: StoryFn<typeof ButtonGroupComponent> = (args) => {
  return (
    <ButtonGroupComponent {...args}>
      <Button icon={RefreshIcon}>Sync</Button>
      <Button icon={ShareIcon}>Share</Button>
      <Button icon={DownloadIcon}>Download</Button>
    </ButtonGroupComponent>
  );
};

export const Default = ButtonGroupTemplate.bind({});
Default.storyName = 'Default';

const ButtonGroupDropdownTemplate: StoryFn<typeof ButtonGroupComponent> = (args) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <ButtonGroupComponent {...args}>
        <Tooltip content="Create a new payout">
          <Button icon={PlusIcon}>Payout</Button>
        </Tooltip>
        <Dropdown>
          <DropdownButton icon={ChevronDownIcon} />
          <DropdownOverlay defaultPlacement="bottom-end">
            <ActionList>
              <ActionListItem title="Bulk Payout" value="bulk-payout" />
              <ActionListItem title="Upload Invoice" value="upload-invoice" />
              <ActionListItem title="Add Contact" value="add-contact" />
              <ActionListItem title="Team Member" value="team-member" />
            </ActionList>
          </DropdownOverlay>
        </Dropdown>
      </ButtonGroupComponent>
    </Box>
  );
};

export const WithDropdown = ButtonGroupDropdownTemplate.bind({});
WithDropdown.storyName = 'With Dropdown';

const ButtonGroupVariantsTemplate: StoryFn<typeof ButtonGroupComponent> = (args) => {
  const variants: ButtonGroupProps['variant'][] = ['primary', 'secondary', 'tertiary'];
  return (
    <>
      {variants.map((variant) => (
        <Box key={variant} marginBottom="spacing.8">
          <Heading marginBottom="spacing.3">{variant}</Heading>
          <ButtonGroupComponent {...args} variant={variant}>
            <Button icon={RefreshIcon}>Sync</Button>
            <Button icon={ShareIcon}>Share</Button>
            <Button icon={DownloadIcon}>Download</Button>
          </ButtonGroupComponent>
        </Box>
      ))}
    </>
  );
};

export const AllVariants = ButtonGroupVariantsTemplate.bind({});
AllVariants.storyName = 'All Variants';

const ButtonGroupSizesTemplate: StoryFn<typeof ButtonGroupComponent> = (args) => {
  const sizes: ButtonGroupProps['size'][] = ['xsmall', 'small', 'medium', 'large'];
  return (
    <>
      {sizes.map((size) => (
        <Box key={size} marginBottom="spacing.8">
          <Heading marginBottom="spacing.3">{size}</Heading>
          <ButtonGroupComponent {...args} size={size}>
            <Button icon={RefreshIcon}>Sync</Button>
            <Button icon={ShareIcon}>Share</Button>
            <Button icon={DownloadIcon}>Download</Button>
          </ButtonGroupComponent>
        </Box>
      ))}
    </>
  );
};

export const AllSizes = ButtonGroupSizesTemplate.bind({});
AllSizes.storyName = 'All Sizes';

const ButtonGroupIconOnlyTemplate: StoryFn<typeof ButtonGroupComponent> = (args) => {
  return (
    <ButtonGroupComponent {...args}>
      <Button icon={RefreshIcon} />
      <Button icon={ShareIcon} />
      <Button icon={DownloadIcon} />
    </ButtonGroupComponent>
  );
};

export const IconsOnly = ButtonGroupIconOnlyTemplate.bind({});
IconsOnly.storyName = 'Icons Only';
