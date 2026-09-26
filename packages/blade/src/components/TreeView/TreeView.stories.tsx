import React from 'react';
import type { StoryFn, Meta } from '@storybook/react-vite';
import { Title } from '@storybook/addon-docs/blocks';
import type { TreeViewProps } from './types';
import { TreeView as TreeViewComponent } from './TreeView';
import { TreeViewItem } from './TreeViewItem';
import { TreeViewLoadMore } from './TreeViewLoadMore';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Code, Text } from '~components/Typography';
import { Counter } from '~components/Counter';
import { Dropdown, DropdownOverlay, FilterChipSelectInput } from '~components/Dropdown';
import { DropdownFooter } from '~components/Dropdown/DropdownHeaderFooter';
import { SelectInput } from '~components/Input/DropdownInputTriggers';
import {
  CheckCircleIcon,
  FileTextIcon,
  FolderIcon,
  LayoutIcon,
  LoaderIcon,
  LockIcon,
  LogOutIcon,
  PlayCircleIcon,
  RefreshIcon,
  SlashIcon,
} from '~components/Icons';
import { List, ListItem, ListItemCode } from '~components/List';
import { Avatar } from '~components/Avatar';
import { Badge } from '~components/Badge';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="TreeView"
      componentDescription="TreeView renders a hierarchical list of expandable, selectable items. It works standalone on a page, or inside Dropdown (in place of ActionList) where selection is controlled through the trigger's value / onChange."
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=125205-58766"
      note="TreeView is a web-only component. On React Native it throws an error."
    >
      <Title>Usage</Title>
      <Sandbox editorHeight={500}>
        {`
          import { TreeView, TreeViewItem } from '@razorpay/blade/components';

          function App() {
            return (
              <TreeView
                selectionType="multiple"
                onChange={({ values, selectedGroups }) => {
                  console.log(values, selectedGroups);
                }}
              >
                <TreeViewItem title="India" value="india" defaultIsExpanded>
                  <TreeViewItem title="Karnataka" value="karnataka" defaultIsExpanded>
                    <TreeViewItem title="Bengaluru" value="bengaluru" />
                    <TreeViewItem title="Mysuru" value="mysuru" />
                  </TreeViewItem>
                  <TreeViewItem title="Goa" value="goa" />
                </TreeViewItem>
              </TreeView>
            );
          }

          export default App;
        `}
      </Sandbox>
      <Title>Keyboard Interactions</Title>
      <List>
        <ListItem>
          <ListItemCode>ArrowDown</ListItemCode> / <ListItemCode>ArrowUp</ListItemCode> — move focus
          to the next / previous visible row (rows hidden under collapsed branches are skipped)
        </ListItem>
        <ListItem>
          <ListItemCode>ArrowRight</ListItemCode> — expand a collapsed branch; on an expanded
          branch, move to its first child
        </ListItem>
        <ListItem>
          <ListItemCode>ArrowLeft</ListItemCode> — collapse an expanded branch; on a leaf, move to
          its parent
        </ListItem>
        <ListItem>
          <ListItemCode>Home</ListItemCode> / <ListItemCode>End</ListItemCode> — move focus to the
          first / last visible row
        </ListItem>
        <ListItem>
          <ListItemCode>Enter</ListItemCode> / <ListItemCode>Space</ListItemCode> — select the
          focused row (Space is a no-op on TreeViewLoadMore; Enter activates it)
        </ListItem>
      </List>
      <Text marginTop="spacing.4">
        Inside Dropdown, the same map runs through the trigger&apos;s keydown pipeline: focus stays
        on the trigger and the active row is tracked with <Code>aria-activedescendant</Code>.
      </Text>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/TreeView',
  component: TreeViewComponent,
  args: {},
  // without this the `docs.page` below never renders - there is no global autodocs setting
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium'],
      description: 'Visual density of every row in the tree',
      table: { defaultValue: { summary: 'medium' } },
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<TreeViewProps>;

const regionsTree = (
  <TreeViewItem title="India" value="india" defaultIsExpanded>
    <TreeViewItem title="Karnataka" value="karnataka" defaultIsExpanded>
      <TreeViewItem title="Bengaluru" value="bengaluru" />
      <TreeViewItem title="Mysuru" value="mysuru" />
    </TreeViewItem>
    <TreeViewItem title="Goa" value="goa" />
  </TreeViewItem>
);

const StandaloneSingleTemplate: StoryFn<typeof TreeViewComponent> = () => {
  const [selected, setSelected] = React.useState<string[]>([]);
  return (
    <Box maxWidth="400px">
      <TreeViewComponent selectionType="single" onChange={({ values }) => setSelected(values)}>
        {regionsTree}
      </TreeViewComponent>
      <Text marginTop="spacing.4">Selected: {selected.join(', ') || 'none'}</Text>
    </Box>
  );
};
export const SingleSelect = StandaloneSingleTemplate.bind({});
SingleSelect.storyName = 'Single Select';

const StandaloneMultipleTemplate: StoryFn<typeof TreeViewComponent> = () => {
  const [payload, setPayload] = React.useState<{ values: string[]; selectedGroups: string[] }>({
    // pre-selection: bengaluru makes Karnataka (and India) indeterminate
    values: ['bengaluru'],
    selectedGroups: [],
  });
  return (
    <Box maxWidth="400px">
      <TreeViewComponent
        selectionType="multiple"
        defaultValue={['bengaluru']}
        onChange={({ values, selectedGroups }) => setPayload({ values, selectedGroups })}
      >
        {regionsTree}
      </TreeViewComponent>
      <Text marginTop="spacing.4">values: [{payload.values.join(', ')}]</Text>
      <Text>selectedGroups: [{payload.selectedGroups.join(', ')}]</Text>
    </Box>
  );
};
export const MultipleSelect = StandaloneMultipleTemplate.bind({});
MultipleSelect.storyName = 'Multiple Select';

const ControlledTemplate: StoryFn<typeof TreeViewComponent> = () => {
  const [values, setValues] = React.useState<string[]>(['mysuru']);
  const [isKarnatakaExpanded, setIsKarnatakaExpanded] = React.useState(true);
  return (
    <Box maxWidth="400px" display="flex" flexDirection="column" gap="spacing.4">
      <Box display="flex" gap="spacing.3">
        <Button size="small" onClick={() => setValues(['bengaluru', 'mysuru'])}>
          Select Karnataka
        </Button>
        <Button size="small" variant="tertiary" onClick={() => setValues([])}>
          Clear
        </Button>
        <Button
          size="small"
          variant="secondary"
          onClick={() => setIsKarnatakaExpanded((previous) => !previous)}
        >
          Toggle Karnataka Expansion
        </Button>
      </Box>
      <TreeViewComponent
        selectionType="multiple"
        value={values}
        onChange={({ values: nextValues }) => setValues(nextValues)}
      >
        <TreeViewItem title="India" value="india" defaultIsExpanded>
          <TreeViewItem
            title="Karnataka"
            value="karnataka"
            isExpanded={isKarnatakaExpanded}
            onExpandChange={({ isExpanded }) => setIsKarnatakaExpanded(isExpanded)}
          >
            <TreeViewItem title="Bengaluru" value="bengaluru" />
            <TreeViewItem title="Mysuru" value="mysuru" />
          </TreeViewItem>
          <TreeViewItem title="Goa" value="goa" />
        </TreeViewItem>
      </TreeViewComponent>
    </Box>
  );
};
export const Controlled = ControlledTemplate.bind({});
Controlled.storyName = 'Controlled';

const DisabledBranchTemplate: StoryFn<typeof TreeViewComponent> = () => (
  <Box maxWidth="400px">
    <TreeViewComponent selectionType="multiple">
      <TreeViewItem title="India" value="india" defaultIsExpanded>
        <TreeViewItem title="Karnataka" value="karnataka" isDisabled defaultIsExpanded>
          <TreeViewItem title="Bengaluru" value="bengaluru" />
          <TreeViewItem title="Mysuru" value="mysuru" />
        </TreeViewItem>
        <TreeViewItem title="Goa" value="goa" />
      </TreeViewItem>
    </TreeViewComponent>
  </Box>
);
export const DisabledBranch = DisabledBranchTemplate.bind({});
DisabledBranch.storyName = 'Disabled Branch';

const AsyncChildrenTemplate: StoryFn<typeof TreeViewComponent> = () => {
  const [cities, setCities] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isKarnatakaExpanded, setIsKarnatakaExpanded] = React.useState(false);
  return (
    <Box maxWidth="400px" display="flex" flexDirection="column" gap="spacing.4">
      <Box>
        <Button
          size="small"
          variant="tertiary"
          onClick={() => {
            // collapse and drop the loaded children so the next expansion re-triggers the fetch + spinner
            setIsKarnatakaExpanded(false);
            setCities([]);
            setIsLoading(false);
          }}
        >
          Reset (check spinner again)
        </Button>
      </Box>
      <TreeViewComponent selectionType="multiple">
        <TreeViewItem
          title="Karnataka"
          value="karnataka"
          hasChildren
          isLoading={isLoading}
          isExpanded={isKarnatakaExpanded}
          onExpandChange={({ isExpanded }) => {
            setIsKarnatakaExpanded(isExpanded);
            if (isExpanded && cities.length === 0) {
              setIsLoading(true);
              setTimeout(() => {
                setCities(['Bengaluru', 'Mysuru', 'Hubballi']);
                setIsLoading(false);
              }, 1500);
            }
          }}
        >
          {cities.map((city) => (
            <TreeViewItem key={city} title={city} value={city.toLowerCase()} />
          ))}
        </TreeViewItem>
        <TreeViewItem title="Goa" value="goa" />
      </TreeViewComponent>
    </Box>
  );
};
export const AsyncChildren = AsyncChildrenTemplate.bind({});
AsyncChildren.storyName = 'Async Children';

// fixed pools sliced by a visible count: repeated "Show more" clicks can never
// produce duplicate values, and the LoadMore row disappears once exhausted
const ALL_CITIES = ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Kalaburagi'];
const OTHER_STATES = ['Goa', 'Kerala', 'Maharashtra', 'Tamil Nadu'];
const PAGE_SIZE = 2;

const LoadMoreTemplate: StoryFn<typeof TreeViewComponent> = () => {
  const [visibleCityCount, setVisibleCityCount] = React.useState(PAGE_SIZE);
  const [visibleStateCount, setVisibleStateCount] = React.useState(1);
  const [isLoadingCities, setIsLoadingCities] = React.useState(false);
  const [isLoadingStates, setIsLoadingStates] = React.useState(false);

  return (
    <Box maxWidth="400px">
      <TreeViewComponent selectionType="multiple">
        <TreeViewItem title="Karnataka" value="karnataka" defaultIsExpanded>
          {ALL_CITIES.slice(0, visibleCityCount).map((city) => (
            <TreeViewItem key={city} title={city} value={city.toLowerCase()} />
          ))}
          {visibleCityCount < ALL_CITIES.length ? (
            <TreeViewLoadMore
              isLoading={isLoadingCities}
              onClick={() => {
                setIsLoadingCities(true);
                setTimeout(() => {
                  setVisibleCityCount((count) => Math.min(count + PAGE_SIZE, ALL_CITIES.length));
                  setIsLoadingCities(false);
                }, 1500);
              }}
            />
          ) : null}
        </TreeViewItem>
        {OTHER_STATES.slice(0, visibleStateCount).map((state) => (
          <TreeViewItem key={state} title={state} value={state.toLowerCase()} />
        ))}
        {/* LoadMore at the root */}
        {visibleStateCount < OTHER_STATES.length ? (
          <TreeViewLoadMore
            isLoading={isLoadingStates}
            onClick={() => {
              setIsLoadingStates(true);
              setTimeout(() => {
                setVisibleStateCount((count) => Math.min(count + PAGE_SIZE, OTHER_STATES.length));
                setIsLoadingStates(false);
              }, 1500);
            }}
          >
            Show more states
          </TreeViewLoadMore>
        ) : null}
      </TreeViewComponent>
    </Box>
  );
};
export const LoadMore = LoadMoreTemplate.bind({});
LoadMore.storyName = 'Load More';

const DropdownSingleTemplate: StoryFn<typeof TreeViewComponent> = () => (
  <Box display="flex" gap="spacing.8" flexWrap="wrap" minHeight="400px">
    <Box maxWidth="300px" flexGrow={1}>
      <Text size="small" weight="semibold" marginBottom="spacing.3">
        Branches selectable (default)
      </Text>
      <Dropdown selectionType="single">
        <SelectInput label="Region" placeholder="Select region" />
        <DropdownOverlay>
          <TreeViewComponent>{regionsTree}</TreeViewComponent>
        </DropdownOverlay>
      </Dropdown>
    </Box>
    <Box maxWidth="300px" flexGrow={1}>
      <Text size="small" weight="semibold" marginBottom="spacing.3">
        Leaf-only selection (branches use isSelectable={'{false}'})
      </Text>
      {/* branches opt out of selection with isSelectable={false}: clicking them (or Enter/Space)
          toggles expansion, so only leaf items can become the selected value */}
      <Dropdown selectionType="single">
        <SelectInput label="City" placeholder="Select city" />
        <DropdownOverlay>
          <TreeViewComponent>
            <TreeViewItem title="India" value="india" isSelectable={false} defaultIsExpanded>
              <TreeViewItem title="Karnataka" value="karnataka" isSelectable={false}>
                <TreeViewItem title="Bengaluru" value="bengaluru" />
                <TreeViewItem title="Mysuru" value="mysuru" />
              </TreeViewItem>
              <TreeViewItem title="Goa" value="goa" isSelectable={false}>
                <TreeViewItem title="Panaji" value="panaji" />
                <TreeViewItem title="Margao" value="margao" />
              </TreeViewItem>
            </TreeViewItem>
          </TreeViewComponent>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  </Box>
);
export const InDropdown = DropdownSingleTemplate.bind({});
InDropdown.storyName = 'In Dropdown';

const DropdownFilterChipTemplate: StoryFn<typeof TreeViewComponent> = () => {
  const [values, setValues] = React.useState<string[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Box minHeight="500px">
      {/* the overlay is controlled so the footer's Apply can close it */}
      <Dropdown selectionType="multiple" isOpen={isOpen} onOpenChange={setIsOpen}>
        <FilterChipSelectInput
          label="Regions"
          value={values}
          onChange={({ values: nextValues }) => setValues(nextValues)}
          onClearButtonClick={() => setValues([])}
        />
        <DropdownOverlay>
          <TreeViewComponent>
            <TreeViewItem
              title="India"
              value="india"
              defaultIsExpanded
              leading={<FolderIcon color="interactive.icon.gray.muted" size="medium" />}
            >
              <TreeViewItem
                title="Karnataka"
                value="karnataka"
                defaultIsExpanded
                trailing={<Counter value={2} color="information" size="small" />}
              >
                <TreeViewItem title="Bengaluru" value="bengaluru" />
                <TreeViewItem title="Mysuru" value="mysuru" />
              </TreeViewItem>
              <TreeViewItem title="Goa" value="goa" />
            </TreeViewItem>
          </TreeViewComponent>
          <DropdownFooter>
            <Box display="flex" gap="spacing.3" width="100%">
              <Button isFullWidth size="small" variant="tertiary" onClick={() => setValues([])}>
                Clear
              </Button>
              <Button isFullWidth size="small" onClick={() => setIsOpen(false)}>
                Apply
              </Button>
            </Box>
          </DropdownFooter>
        </DropdownOverlay>
      </Dropdown>
      <Text marginTop="spacing.4">
        Selecting all of Karnataka shows the chip as &quot;Karnataka&quot;, not a leaf count
      </Text>
    </Box>
  );
};
export const InDropdownWithFilterChip = DropdownFilterChipTemplate.bind({});
InDropdownWithFilterChip.storyName = 'In Dropdown with Filter Chip';

const TruncationTemplate: StoryFn<typeof TreeViewComponent> = () => (
  // 360px viewport simulation: depth-3 titles truncate instead of wrapping
  <Box maxWidth="360px" borderWidth="thin" borderColor="surface.border.gray.muted">
    <TreeViewComponent selectionType="multiple">
      <TreeViewItem title="Payment Gateway Configuration" value="pg-config" defaultIsExpanded>
        <TreeViewItem
          title="International Payment Methods and Wallets"
          value="intl-methods"
          defaultIsExpanded
        >
          <TreeViewItem
            title="A very long leaf title that should truncate with ellipsis at depth 3 on small screens"
            value="long-leaf"
            description="Truncation instead of wrapping at 360px"
          />
          <TreeViewItem title="Short leaf" value="short-leaf" />
        </TreeViewItem>
      </TreeViewItem>
    </TreeViewComponent>
  </Box>
);
export const Truncation = TruncationTemplate.bind({});
Truncation.storyName = 'Truncation';

/**
 * Every slot of TreeViewItem in one tree: `leading` (icon / avatar), `description`, and
 * all four trailing types the design supports - Counter, Badge, Icon and Text.
 *
 * `leading` and `trailing` are consumer-provided nodes, so their size is set here rather
 * than by TreeView:
 * - icons (`leading`, and a trailing icon) track the tree's `size`
 * - trailing Counter / Badge / Text are always `small`, at both tree sizes - they are
 *   secondary markers and should never out-weigh the title they annotate
 */
const anatomyTree = ({
  iconSize,
  avatarSize,
  extraTitles = [],
  loadMore = null,
}: {
  iconSize: 'small' | 'medium';
  avatarSize: 'xsmall' | 'small';
  /**
   * Extra leaves appended by the Sizes story's "Show more"
   */
  extraTitles?: string[];
  /**
   * A TreeViewLoadMore element, rendered last. Kept as a prop (rather than state inside
   * this helper) because TreeView validates its children, so this has to stay a function
   * returning TreeViewItem / TreeViewLoadMore elements rather than become a component
   */
  loadMore?: React.ReactNode;
}): React.ReactElement => (
  <TreeViewItem
    title="Reports"
    value="reports"
    description="Branch with a leading icon and a trailing counter"
    leading={<FolderIcon color="interactive.icon.gray.muted" size={iconSize} />}
    // trailing: Counter
    trailing={<Counter value={12} color="information" size="small" />}
    defaultIsExpanded
  >
    <TreeViewItem
      title="Settlements"
      value="settlements"
      leading={<FileTextIcon color="interactive.icon.gray.muted" size={iconSize} />}
      // trailing: Badge
      trailing={
        <Badge color="positive" size="small">
          Live
        </Badge>
      }
    />
    <TreeViewItem
      title="Payouts"
      value="payouts"
      description="Leaf with a description and plain trailing text"
      leading={<FileTextIcon color="interactive.icon.gray.muted" size={iconSize} />}
      // trailing: Text
      trailing={
        <Text size="small" color="surface.text.gray.muted">
          Updated 2d ago
        </Text>
      }
    />
    <TreeViewItem
      title="Shared with Saurabh"
      value="shared"
      leading={<Avatar name="Saurabh Daware" size={avatarSize} />}
      // trailing: Icon - the one trailing type that tracks the tree's size
      trailing={<LockIcon color="surface.icon.gray.muted" size={iconSize} />}
    />
    {extraTitles.map((title) => (
      <TreeViewItem
        key={title}
        title={title}
        value={title.toLowerCase().replace(/\s+/g, '-')}
        leading={<FileTextIcon color="interactive.icon.gray.muted" size={iconSize} />}
      />
    ))}
    {loadMore}
  </TreeViewItem>
);

const ItemAnatomyTemplate: StoryFn<typeof TreeViewComponent> = () => (
  <Box display="flex" gap="spacing.8" flexWrap="wrap">
    <Box maxWidth="400px" flexGrow={1}>
      <Text size="small" weight="semibold" marginBottom="spacing.3">
        Single select
      </Text>
      <TreeViewComponent selectionType="single">
        {anatomyTree({ iconSize: 'medium', avatarSize: 'small' })}
      </TreeViewComponent>
    </Box>
    <Box maxWidth="400px" flexGrow={1}>
      <Text size="small" weight="semibold" marginBottom="spacing.3">
        Multiple select (leading renders after the checkbox)
      </Text>
      <TreeViewComponent selectionType="multiple" defaultValue={['payouts']}>
        {anatomyTree({ iconSize: 'medium', avatarSize: 'small' })}
      </TreeViewComponent>
    </Box>
  </Box>
);
export const LeadingAndTrailing = ItemAnatomyTemplate.bind({});
LeadingAndTrailing.storyName = 'Leading & Trailing';

// same fixed-pool-sliced-by-visible-count approach as the LoadMore story, so repeated
// clicks can never produce duplicate values and the row disappears once exhausted
const MORE_REPORTS = ['Refunds', 'Disputes', 'Invoices', 'Tax deductions'];

/**
 * One labelled column of the Sizes story. The load-more state lives here rather than in
 * `anatomyTree`, because that helper has to stay a function returning TreeViewItem /
 * TreeViewLoadMore elements - TreeView rejects any other component as a child
 */
const SizedAnatomyTree = ({
  size,
  label,
  iconSize,
  avatarSize,
}: {
  size: NonNullable<TreeViewProps['size']>;
  label: string;
  iconSize: 'small' | 'medium';
  avatarSize: 'xsmall' | 'small';
}): React.ReactElement => {
  const [visibleCount, setVisibleCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Box maxWidth="400px" flexGrow={1}>
      <Text size="small" weight="semibold" marginBottom="spacing.3">
        {label}
      </Text>
      <TreeViewComponent selectionType="multiple" size={size}>
        {anatomyTree({
          iconSize,
          avatarSize,
          extraTitles: MORE_REPORTS.slice(0, visibleCount),
          loadMore:
            visibleCount < MORE_REPORTS.length ? (
              <TreeViewLoadMore
                isLoading={isLoading}
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setVisibleCount((count) => Math.min(count + PAGE_SIZE, MORE_REPORTS.length));
                    setIsLoading(false);
                  }, 1500);
                }}
              />
            ) : null,
        })}
      </TreeViewComponent>
    </Box>
  );
};

const SizesTemplate: StoryFn<typeof TreeViewComponent> = () => (
  // icons scale down with the tree - Counter / Badge / Text stay small at both sizes
  <Box display="flex" gap="spacing.8" flexWrap="wrap">
    <SizedAnatomyTree
      size="medium"
      label={'size="medium" (default)'}
      iconSize="medium"
      avatarSize="small"
    />
    <SizedAnatomyTree size="small" label={'size="small"'} iconSize="small" avatarSize="xsmall" />
  </Box>
);
export const Sizes = SizesTemplate.bind({});
Sizes.storyName = 'Sizes';

/**
 * Stand-in for a screen preview image - in a real product this would usually be an `<img>`
 */
const ScreenPreview = ({ label }: { label: string }): React.ReactElement => (
  <Box
    width="220px"
    height="280px"
    borderRadius="medium"
    backgroundColor="feedback.background.positive.intense"
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    gap="spacing.4"
  >
    <CheckCircleIcon size="2xlarge" color="surface.icon.staticWhite.normal" />
    <Text weight="semibold" color="surface.text.staticWhite.normal">
      {label}
    </Text>
  </Box>
);

const HoverPreviewTemplate: StoryFn<typeof TreeViewComponent> = () => (
  <Box maxWidth="320px">
    <TreeViewComponent selectionType="single" defaultValue={['payment-success']}>
      <TreeViewItem
        title="Checkout"
        value="checkout"
        leading={<LayoutIcon />}
        isSelectable={false}
        defaultIsExpanded
      >
        <TreeViewItem
          title="Payment Animation"
          value="payment-animation"
          leading={<PlayCircleIcon />}
          tooltip={{ content: 'Plays between payment confirmation and the result screen' }}
        />
        <TreeViewItem
          title="Payment Processing"
          value="payment-processing"
          leading={<LoaderIcon />}
          tooltip={{ title: 'Payment Processing', content: 'Shown while the bank confirms' }}
        />
        <TreeViewItem
          title="Payment Success"
          value="payment-success"
          leading={<CheckCircleIcon />}
          popover={{
            title: 'Payment Success',
            content: <ScreenPreview label="Payment Successful" />,
          }}
        />
        <TreeViewItem
          title="Retry Payment"
          value="retry-payment"
          leading={<RefreshIcon />}
          popover={{
            title: 'Retry Payment',
            content: <ScreenPreview label="Retry Payment" />,
          }}
        />
        <TreeViewItem
          title="Cancel Payment"
          value="cancel-payment"
          leading={<SlashIcon />}
          isDisabled
          tooltip={{ content: 'Not available for this checkout' }}
        />
        <TreeViewItem title="Exit Payment" value="exit-payment" leading={<LogOutIcon />} />
      </TreeViewItem>
    </TreeViewComponent>
  </Box>
);
export const HoverPreview = HoverPreviewTemplate.bind({});
HoverPreview.storyName = 'With Tooltip and Popover';
HoverPreview.parameters = {
  docs: {
    description: {
      story:
        'Pass `tooltip` for a short text hint (opens on hover and keyboard focus) or `popover` for a rich preview (opens on mouse hover). Both open to the right of the row by default so they do not cover the rows above or below.',
    },
  },
};
