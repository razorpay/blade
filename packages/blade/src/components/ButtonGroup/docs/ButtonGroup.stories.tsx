import type { StoryFn, Meta } from '@storybook/react';
import type { ButtonGroupProps } from '../ButtonGroup';
import { ButtonGroup as ButtonGroupComponent } from '../ButtonGroup';
import { Heading } from '~components/Typography/Heading';
import { Box } from '~components/Box';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import {
  RefreshIcon,
  ShareIcon,
  DownloadIcon,
  ChevronDownIcon,
  PlusIcon,
  TrashIcon,
} from '~components/Icons';
import { Dropdown, DropdownButton, DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';
import { Tooltip } from '~components/Tooltip';
import { Popover } from '~components/Popover';
import { Text } from '~components/Typography';

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

const ButtonGroupVariantsTemplateWithLoading: StoryFn<typeof ButtonGroupComponent> = (args) => {
  const variants: ButtonGroupProps['variant'][] = ['primary', 'secondary', 'tertiary'];
  return (
    <>
      {variants.map((variant) => (
        <Box key={variant} marginBottom="spacing.8">
          <Heading marginBottom="spacing.3">{variant}</Heading>
          <ButtonGroupComponent {...args} variant={variant}>
            <Button icon={RefreshIcon} isLoading>
              Sync
            </Button>
            <Button icon={ShareIcon}>Share</Button>
            <Button icon={DownloadIcon}>Download</Button>
          </ButtonGroupComponent>
        </Box>
      ))}
    </>
  );
};

export const AllVariantsWithLoading = ButtonGroupVariantsTemplateWithLoading.bind({});
AllVariantsWithLoading.storyName = 'All Variants With Loading';

const ButtonGroupSizesTemplate: StoryFn<typeof ButtonGroupComponent> = (args) => {
  const sizes: ButtonGroupProps['size'][] = ['xsmall', 'small', 'medium', 'large'];
  return (
    <>
      {sizes.map((size) => (
        <Box key={size} marginBottom="spacing.8">
          <Heading marginBottom="spacing.3">{size}</Heading>
          <ButtonGroupComponent {...args} size={size}>
            <Button icon={RefreshIcon}>Sync</Button>
            <Button isLoading icon={ShareIcon}>
              Share
            </Button>
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

const ShowcaseTemplate: StoryFn<typeof ButtonGroupComponent> = () => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.8">
      {/* Variants */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Variants
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <Box>
            <Text size="small" marginBottom="spacing.2">
              Primary
            </Text>
            <ButtonGroupComponent variant="primary">
              <Button icon={RefreshIcon}>Sync</Button>
              <Button icon={ShareIcon}>Share</Button>
              <Button icon={DownloadIcon}>Download</Button>
            </ButtonGroupComponent>
          </Box>
          <Box>
            <Text size="small" marginBottom="spacing.2">
              Secondary
            </Text>
            <ButtonGroupComponent variant="secondary">
              <Button icon={RefreshIcon}>Sync</Button>
              <Button icon={ShareIcon}>Share</Button>
              <Button icon={DownloadIcon}>Download</Button>
            </ButtonGroupComponent>
          </Box>
          <Box>
            <Text size="small" marginBottom="spacing.2">
              Tertiary
            </Text>
            <ButtonGroupComponent variant="tertiary">
              <Button icon={RefreshIcon}>Sync</Button>
              <Button icon={ShareIcon}>Share</Button>
              <Button icon={DownloadIcon}>Download</Button>
            </ButtonGroupComponent>
          </Box>
        </Box>
      </Box>

      {/* Sizes */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Sizes
        </Text>
        <Box
          display="flex"
          flexDirection="row"
          gap="spacing.5"
          flexWrap="wrap"
          alignItems="flex-end"
        >
          <Box>
            <Text size="small" marginBottom="spacing.2">
              XSmall
            </Text>
            <ButtonGroupComponent size="xsmall">
              <Button icon={RefreshIcon}>Sync</Button>
              <Button icon={ShareIcon}>Share</Button>
            </ButtonGroupComponent>
          </Box>
          <Box>
            <Text size="small" marginBottom="spacing.2">
              Small
            </Text>
            <ButtonGroupComponent size="small">
              <Button icon={RefreshIcon}>Sync</Button>
              <Button icon={ShareIcon}>Share</Button>
            </ButtonGroupComponent>
          </Box>
          <Box>
            <Text size="small" marginBottom="spacing.2">
              Medium
            </Text>
            <ButtonGroupComponent size="medium">
              <Button icon={RefreshIcon}>Sync</Button>
              <Button icon={ShareIcon}>Share</Button>
            </ButtonGroupComponent>
          </Box>
          <Box>
            <Text size="small" marginBottom="spacing.2">
              Large
            </Text>
            <ButtonGroupComponent size="large">
              <Button icon={RefreshIcon}>Sync</Button>
              <Button icon={ShareIcon}>Share</Button>
            </ButtonGroupComponent>
          </Box>
        </Box>
      </Box>

      {/* Colors */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Colors
        </Text>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <Box>
            <Text size="small" marginBottom="spacing.2">
              Primary Color
            </Text>
            <ButtonGroupComponent color="primary">
              <Button icon={RefreshIcon}>Sync</Button>
              <Button icon={ShareIcon}>Share</Button>
              <Button icon={DownloadIcon}>Download</Button>
            </ButtonGroupComponent>
          </Box>
          <Box>
            <Text size="small" marginBottom="spacing.2">
              Positive Color
            </Text>
            <ButtonGroupComponent color="positive">
              <Button icon={RefreshIcon}>Sync</Button>
              <Button icon={ShareIcon}>Share</Button>
              <Button icon={DownloadIcon}>Download</Button>
            </ButtonGroupComponent>
          </Box>
          <Box>
            <Text size="small" marginBottom="spacing.2">
              Negative Color
            </Text>
            <ButtonGroupComponent color="negative">
              <Button icon={RefreshIcon}>Sync</Button>
              <Button icon={ShareIcon}>Share</Button>
              <Button icon={DownloadIcon}>Download</Button>
            </ButtonGroupComponent>
          </Box>
          <Box
            padding="spacing.4"
            backgroundColor="surface.background.primary.intense"
            borderRadius="medium"
          >
            <Text size="small" marginBottom="spacing.2" color="surface.text.staticWhite.normal">
              White Color (on dark background)
            </Text>
            <ButtonGroupComponent color="white">
              <Button icon={RefreshIcon}>Sync</Button>
              <Button icon={ShareIcon}>Share</Button>
              <Button icon={DownloadIcon}>Download</Button>
            </ButtonGroupComponent>
          </Box>
        </Box>
      </Box>

      {/* Disabled State */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Disabled State
        </Text>
        <Box display="flex" flexDirection="row" gap="spacing.5" flexWrap="wrap">
          <Box>
            <Text size="small" marginBottom="spacing.2">
              Primary Disabled
            </Text>
            <ButtonGroupComponent variant="primary" isDisabled>
              <Button icon={RefreshIcon}>Sync</Button>
              <Button icon={TrashIcon}>Delete</Button>
            </ButtonGroupComponent>
          </Box>
          <Box>
            <Text size="small" marginBottom="spacing.2">
              Secondary Disabled
            </Text>
            <ButtonGroupComponent variant="secondary" isDisabled>
              <Button icon={RefreshIcon}>Sync</Button>
              <Button icon={TrashIcon}>Delete</Button>
            </ButtonGroupComponent>
          </Box>
          <Box>
            <Text size="small" marginBottom="spacing.2">
              Tertiary Disabled
            </Text>
            <ButtonGroupComponent variant="tertiary" isDisabled>
              <Button icon={RefreshIcon}>Sync</Button>
              <Button icon={TrashIcon}>Delete</Button>
            </ButtonGroupComponent>
          </Box>
        </Box>
      </Box>

      {/* Icon Only */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Icon Only
        </Text>
        <Box
          display="flex"
          flexDirection="row"
          gap="spacing.5"
          flexWrap="wrap"
          alignItems="flex-end"
        >
          <Box>
            <Text size="small" marginBottom="spacing.2">
              XSmall
            </Text>
            <ButtonGroupComponent size="xsmall">
              <Button icon={RefreshIcon} />
              <Button icon={ShareIcon} />
              <Button icon={DownloadIcon} />
            </ButtonGroupComponent>
          </Box>
          <Box>
            <Text size="small" marginBottom="spacing.2">
              Small
            </Text>
            <ButtonGroupComponent size="small">
              <Button icon={RefreshIcon} />
              <Button icon={ShareIcon} />
              <Button icon={DownloadIcon} />
            </ButtonGroupComponent>
          </Box>
          <Box>
            <Text size="small" marginBottom="spacing.2">
              Medium
            </Text>
            <ButtonGroupComponent size="medium">
              <Button icon={RefreshIcon} />
              <Button icon={ShareIcon} />
              <Button icon={DownloadIcon} />
            </ButtonGroupComponent>
          </Box>
          <Box>
            <Text size="small" marginBottom="spacing.2">
              Large
            </Text>
            <ButtonGroupComponent size="large">
              <Button icon={RefreshIcon} />
              <Button icon={ShareIcon} />
              <Button icon={DownloadIcon} />
            </ButtonGroupComponent>
          </Box>
        </Box>
      </Box>

      {/* Full Width */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          Full Width
        </Text>
        <ButtonGroupComponent isFullWidth>
          <Button icon={RefreshIcon}>Sync</Button>
          <Button icon={ShareIcon}>Share</Button>
          <Button icon={DownloadIcon}>Download</Button>
        </ButtonGroupComponent>
      </Box>

      {/* With Tooltip */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          With Tooltip
        </Text>
        <ButtonGroupComponent>
          <Tooltip content="Sync your data">
            <Button icon={RefreshIcon}>Sync</Button>
          </Tooltip>
          <Tooltip content="Share with others">
            <Button icon={ShareIcon}>Share</Button>
          </Tooltip>
          <Tooltip content="Download file">
            <Button icon={DownloadIcon}>Download</Button>
          </Tooltip>
        </ButtonGroupComponent>
      </Box>

      {/* With Dropdown */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          With Dropdown (Split Button)
        </Text>
        <ButtonGroupComponent>
          <Tooltip content="Create a new payout">
            <Button icon={PlusIcon}>Payout</Button>
          </Tooltip>
          <Dropdown>
            <DropdownButton icon={ChevronDownIcon} />
            <DropdownOverlay>
              <ActionList>
                <ActionListItem title="Bulk Payout" value="bulk-payout" />
                <ActionListItem title="Upload Invoice" value="upload-invoice" />
                <ActionListItem title="Add Contact" value="add-contact" />
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        </ButtonGroupComponent>
      </Box>

      {/* With Popover */}
      <Box>
        <Text
          size="large"
          weight="semibold"
          marginBottom="spacing.4"
          color="feedback.text.information.intense"
        >
          With Popover
        </Text>
        <ButtonGroupComponent>
          <Popover
            title="Sync Data"
            content={<Text>Are you sure you want to sync all data?</Text>}
            footer={
              <Box display="flex" gap="spacing.3" justifyContent="flex-end">
                <Button variant="secondary" size="xsmall">
                  Cancel
                </Button>
                <Button size="xsmall">Confirm</Button>
              </Box>
            }
          >
            <Button icon={RefreshIcon}>Sync</Button>
          </Popover>
          <Button icon={ShareIcon}>Share</Button>
          <Button icon={DownloadIcon}>Download</Button>
        </ButtonGroupComponent>
      </Box>
    </Box>
  );
};

export const Showcase = ShowcaseTemplate.bind({});
Showcase.storyName = 'Showcase';
Showcase.parameters = {
  docs: {
    description: {
      story:
        'A comprehensive showcase of all ButtonGroup variants including variants, sizes, colors, disabled states, icon-only buttons, full width, and integration with Tooltip, Dropdown, and Popover.',
    },
  },
};
