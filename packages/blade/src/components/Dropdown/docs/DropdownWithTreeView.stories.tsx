import React from 'react';
import { Dropdown, DropdownFooter, DropdownOverlay } from '..';
import { FilterChipSelectInput } from '../FilterChipSelectInput';
import { TreeView, TreeViewItem, TreeViewLoadMore } from '~components/TreeView';
import { SelectInput } from '~components/Input/DropdownInputTriggers';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Button } from '~components/Button';
import { Counter } from '~components/Counter';
import { FolderIcon } from '~components/Icons';

const DropdownStoryMeta = {
  title: 'Components/Dropdown/With TreeView',
  component: Dropdown,
  subcomponents: { TreeView, TreeViewItem, TreeViewLoadMore },
  args: {},
  parameters: {
    viewMode: 'story',
    options: {
      showPanel: false,
    },
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
    chromatic: { disableSnapshot: true },
  },
};

const regionsTree = (
  <TreeViewItem title="India" value="india" defaultIsExpanded>
    <TreeViewItem title="Karnataka" value="karnataka" defaultIsExpanded>
      <TreeViewItem title="Bengaluru" value="bengaluru" />
      <TreeViewItem title="Mysuru" value="mysuru" />
    </TreeViewItem>
    <TreeViewItem title="Goa" value="goa" />
  </TreeViewItem>
);

export const Default = (): React.ReactElement => {
  const [selected, setSelected] = React.useState<string[]>([]);

  return (
    <Box maxWidth="300px" minHeight="400px">
      <Dropdown selectionType="single">
        <SelectInput
          label="Region"
          placeholder="Select region"
          onChange={({ values }) => setSelected(values)}
        />
        <DropdownOverlay>
          <TreeView>{regionsTree}</TreeView>
        </DropdownOverlay>
      </Dropdown>
      <Text marginTop="spacing.4">Selected: {selected.join(', ') || 'none'}</Text>
    </Box>
  );
};

export const WithLeafOnlySelection = (): React.ReactElement => {
  return (
    <Box maxWidth="300px" minHeight="400px">
      {/* branches opt out of selection with isSelectable={false}: clicking them (or Enter/Space)
          toggles expansion, so only leaf items can become the selected value */}
      <Dropdown selectionType="single">
        <SelectInput label="City" placeholder="Select city" />
        <DropdownOverlay>
          <TreeView>
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
          </TreeView>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export const WithMultiSelect = (): React.ReactElement => {
  const [payload, setPayload] = React.useState<{ values: string[]; selectedGroups: string[] }>({
    values: [],
    selectedGroups: [],
  });

  return (
    <Box maxWidth="300px" minHeight="400px">
      <Dropdown selectionType="multiple">
        <SelectInput
          label="Regions"
          placeholder="Select regions"
          onChange={({ values, selectedGroups }) =>
            setPayload({ values, selectedGroups: selectedGroups ?? [] })
          }
        />
        <DropdownOverlay>
          <TreeView>{regionsTree}</TreeView>
        </DropdownOverlay>
      </Dropdown>
      {/* selecting a branch cascades to its leaves: `values` carries the leaves,
          `selectedGroups` the topmost fully-selected branches */}
      <Text marginTop="spacing.4">values: [{payload.values.join(', ')}]</Text>
      <Text>selectedGroups: [{payload.selectedGroups.join(', ')}]</Text>
    </Box>
  );
};

export const WithControlledSelection = (): React.ReactElement => {
  const [values, setValues] = React.useState<string[]>([]);

  return (
    <Box maxWidth="300px" minHeight="400px" display="flex" flexDirection="column" gap="spacing.4">
      <Box display="flex" gap="spacing.3">
        <Button size="small" onClick={() => setValues(['bengaluru', 'mysuru'])}>
          Select Karnataka
        </Button>
        <Button size="small" variant="tertiary" onClick={() => setValues([])}>
          Clear
        </Button>
      </Box>
      <Dropdown selectionType="multiple">
        <SelectInput
          label="Regions"
          placeholder="Select regions"
          value={values}
          onChange={({ values: nextValues }) => setValues(nextValues)}
        />
        <DropdownOverlay>
          <TreeView>{regionsTree}</TreeView>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export const WithFilterChip = (): React.ReactElement => {
  const [values, setValues] = React.useState<string[]>([]);

  return (
    <Box minHeight="500px">
      <Dropdown selectionType="multiple">
        <FilterChipSelectInput
          label="Regions"
          value={values}
          onChange={({ values: nextValues }) => setValues(nextValues)}
          onClearButtonClick={() => setValues([])}
        />
        <DropdownOverlay>
          <TreeView>
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
          </TreeView>
          <DropdownFooter>
            <Box display="flex" gap="spacing.3" width="100%">
              <Button isFullWidth size="small" variant="tertiary" onClick={() => setValues([])}>
                Clear
              </Button>
              <Button isFullWidth size="small">
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

export const WithAsyncChildren = (): React.ReactElement => {
  const [cities, setCities] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isKarnatakaExpanded, setIsKarnatakaExpanded] = React.useState(false);

  return (
    <Box maxWidth="300px" minHeight="400px" display="flex" flexDirection="column" gap="spacing.4">
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
      <Dropdown selectionType="multiple">
        <SelectInput label="Regions" placeholder="Select regions" />
        <DropdownOverlay>
          {/* children arriving late re-register as Dropdown options, so keyboard
              traversal and selection pick them up without reopening the overlay */}
          <TreeView>
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
          </TreeView>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

// fixed pools sliced by a visible count: repeated "Show more" clicks can never
// produce duplicate values, and the LoadMore row disappears once exhausted
const ALL_CITIES = ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Kalaburagi'];
const OTHER_STATES = ['Goa', 'Kerala', 'Maharashtra', 'Tamil Nadu'];
const PAGE_SIZE = 2;

export const WithLoadMore = (): React.ReactElement => {
  const [visibleCityCount, setVisibleCityCount] = React.useState(PAGE_SIZE);
  const [visibleStateCount, setVisibleStateCount] = React.useState(1);
  const [isLoadingCities, setIsLoadingCities] = React.useState(false);
  const [isLoadingStates, setIsLoadingStates] = React.useState(false);

  return (
    <Box maxWidth="300px" minHeight="500px">
      <Dropdown selectionType="multiple">
        <SelectInput label="Regions" placeholder="Select regions" />
        <DropdownOverlay>
          <TreeView>
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
                      setVisibleCityCount((count) =>
                        Math.min(count + PAGE_SIZE, ALL_CITIES.length),
                      );
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
                    setVisibleStateCount((count) =>
                      Math.min(count + PAGE_SIZE, OTHER_STATES.length),
                    );
                    setIsLoadingStates(false);
                  }, 1500);
                }}
              >
                Show more states
              </TreeViewLoadMore>
            ) : null}
          </TreeView>
        </DropdownOverlay>
      </Dropdown>
    </Box>
  );
};

export default DropdownStoryMeta;
