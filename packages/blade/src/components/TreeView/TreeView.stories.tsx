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
import { FolderIcon } from '~components/Icons';
import { List, ListItem } from '~components/List';

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
          <Code>ArrowDown</Code> / <Code>ArrowUp</Code> — move focus to the next / previous visible
          row (rows hidden under collapsed branches are skipped)
        </ListItem>
        <ListItem>
          <Code>ArrowRight</Code> — expand a collapsed branch; on an expanded branch, move to its
          first child
        </ListItem>
        <ListItem>
          <Code>ArrowLeft</Code> — collapse an expanded branch; on a leaf, move to its parent
        </ListItem>
        <ListItem>
          <Code>Home</Code> / <Code>End</Code> — move focus to the first / last visible row
        </ListItem>
        <ListItem>
          <Code>Enter</Code> / <Code>Space</Code> — select the focused row (Space is a no-op on
          TreeViewLoadMore; Enter activates it)
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
export const StandaloneSingle = StandaloneSingleTemplate.bind({});
StandaloneSingle.storyName = 'Standalone: Single Select';

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
export const StandaloneMultiple = StandaloneMultipleTemplate.bind({});
StandaloneMultiple.storyName = 'Standalone: Multiple with Pre-selection';

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
export const ControlledStandalone = ControlledTemplate.bind({});
ControlledStandalone.storyName = 'Standalone: Controlled Selection & Expansion';

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
AsyncChildren.storyName = 'Async Children with Spinner';

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
LoadMore.storyName = 'LoadMore at Branch and Root';

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
export const DropdownWithSelectInput = DropdownSingleTemplate.bind({});
DropdownWithSelectInput.storyName = 'Dropdown: SelectInput (Single)';

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
                trailing={<Counter value={2} color="information" />}
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
export const DropdownWithFilterChip = DropdownFilterChipTemplate.bind({});
DropdownWithFilterChip.storyName = 'Dropdown: FilterChip + Footer (Optimiser case)';

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
export const Depth3Truncation = TruncationTemplate.bind({});
Depth3Truncation.storyName = 'Depth-3 Truncation at 360px';
