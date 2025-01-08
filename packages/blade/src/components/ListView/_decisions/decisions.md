# List View Pattern API Decision

Questions like what is pattern, why are we building these patterns, and scope of pattern are answered in [pattern-terminology.md](./pattern-terminology.md)

## Component Changes

- Enhancements:
  - Searchable Dropdown
  - InputGroup
- New Components
  - QuickFilter
  - FilterChip

## API

### With Layout Component

```jsx
<ListView>
  <ListViewFilters
    quickFilters={[
      {
        title: 'All',
        onClick: () => {},
      },
      {
        title: 'Pending',
        onClick: () => {},
      },
    ]}
    onSearchChange={() => {
      /* filter on search */
    }}
  >
    <FilterChipGroup>
      <Dropdown>
        <FilterChip />
        <DropdownOverlay></DropdownOverlay>
      </Dropdown>

      <Menu>
        <FilterChip />
        <MenuOverlay>
          <TextInput />
        </MenuOverlay>
      </Menu>
    </FilterChipGroup>
  </ListViewFilters>
  <Table data={{ nodes: filteredNodes }} />
</ListView>
```

**Pros:**

- Layout can be controlled on design-system end which means in future if we decide to change layout of the list view pattern, consumers will only have to upgrade version
- Responsive layout can also be defined on design-system layer which other people might miss
- Consistent layout across all pages
- Functionality such as hide / show filters, placement of search, etc comes out of the box
- Less verbose compared to API without layout component

**Cons:**

- Restrictive API in what can be rendered inside the filters section. E.g. Search cannot be removed / moved to other-side (unless we give it as an option)
- Needs learning one more API with props like `quickFilters`, `onSearch`, etc compared to API without layout component where you use existing components and do custom layouts with Box.

### Alternate APIs

<details>
<summary>View alternate APIs like - API Without Layout Component, Config-driven filters, etc</summary>

#### Without Layout Component

```jsx
<Box>
  <Box display="flex" justifyContent="space-between">
    <QuickFilterGroup>
      <QuickFilter title="All" onClick={() => {}} />
      <QuickFilter title="Pending" onClick={() => {}} />
    </QuickFilterGroup>
    <Box>
      <Button icon={FilterIcon} />
      <InputGroup>
        <SearchInput />
        <Dropdown>
          <SelectInput />
          <DropdownOverlay></DropdownOverlay>
        </Dropdown>
      </InputGroup>
      <Button icon={SearchIcon} />
    </Box>
  </Box>
  <Box>
    <FilterChipGroup>
      <Dropdown>
        <FilterChip />
        <DropdownOverlay></DropdownOverlay>
      </Dropdown>

      <Menu>
        <FilterChip />
        <MenuOverlay>
          <TextInput />
        </MenuOverlay>
      </Menu>
    </FilterChipGroup>
  </Box>
  <Table data={{ nodes: filteredNodes }} />
</Box>
```

**Pros**

- No new layout component so consumers can use existing Box and existing components to create custom layouts
- More flexible API so consumers can add / remove / change items inside of filters section if needed

**Cons**

- No control over layout from design-system so tomorrow if we decide to change position of SearchInput for all filters in Razorpay, it cannot be done without a migration on consumer-side.
- Can lead to inconsistent spacings / responsive behaviours across pages if consumers don't handle it correctly.
- More verbose API as it requires handling layout manually
-

#### Config-driven filters

```jsx
<ListView>
  <ListViewFilterGroup
    quickFilters={[
      {
        title: 'All',
        onClick: () => setFilteredTableData(tableDefaultData),
      },
      {
        title: 'Pending',
        onClick: () =>
          setFilteredTableData(
            tableDefaultData.filter((tableData) => tableData.status === 'Pending'),
          ),
      },
    ]}
    filters={[
      {
        label: 'Status',
        options: ['All', 'Pending', 'Completed'],
        trigger: 'select-input',
        onChange: ({ name, value }) => {
          // filter on select
        },
      },
      {
        label: 'Customer Email',
        trigger: 'text-input',
        type: 'email',
        onBlur: () => {
          // filter on email change
        },
      },
      {
        label: 'Date',
        trigger: 'date-range',
        onChange: ({ name, value }) => {
          // filter on date range
        },
      },
    ]}
    onSearch={(searchValue, searchColumn = 'name') => {
      setFilteredTableData(
        tableDefaultData.filter((tableData) => searchValue.includes(tableData[searchColumn])),
      );
    }}
  />

  <Table data={{ nodes: filteredTableData }} />
</ListView>
```

**Pros**

- Less verbose compared to using dropdown and menu inside ListViewFilters

**Cons**

- Very strict API which might cause missing edge cases and rework on blade-side for every product change
- Will have bundle of Dropdown, Menu, DatePicker, BottomSheet, etc even if that particular filter is not used
- Less intuitive because it'll introduce new config. Compared to previous API where consumers will use filters using the components that they already know how to use like Dropdown, Menu, etc.

#### Extension of Table component

In this case, we add quickfilters, filters, search as an option to our existing Table component

Similar to [react-data-grid](https://mui.com/x/react-data-grid/filtering/quick-filter/) by MUI

```jsx
<Table
  data={{ nodes }}
  hasSearch
  quickFilters={[
    { title: 'All', onClick: (nodes) => nodes },
    {
      title: 'Pending',
      onClick: (nodes) => nodes.filter((node) => node.status === 'Pending'),
    },
  ]}
  filters={[
    {
      label: 'Status',
      options: ['All', 'Pending', 'Completed'],
      trigger: 'select-input',
      onChange: ({ name, value }) => {
        // filter on select
      },
    },
    {
      label: 'Customer Email',
      trigger: 'text-input',
      type: 'email',
      onBlur: () => {
        // filter on email change
      },
    },
    {
      label: 'Date',
      trigger: 'date-range',
      onChange: ({ name, value }) => {
        // filter on date range
      },
    },
  ]}
/>
```

**Pros**

- Less verbose API
- Consistent filtering experience on all tables

**Cons**

- Too strict with very little flexibility
- Adds up more things in tables which can make table difficult to maintain and will contain bundle of filters even when they are not used

</details>

## Enhancements / Components

### Dropdown with AutoComplete in Overlay

![alt text](image-1.png)

```jsx
<Dropdown>
  <SelectInput />
  <DropdownOverlay>
    <DropdownHeader>
      <AutoComplete />
    </DropdownHeader>
    <ActionList>
      <ActionListItem />
      <ActionListItem />
      <ActionListItem />
    </ActionList>
</Dropdown>
```

### FilterChipGroup

![alt text](image-3.png)

#### Usage

```jsx
const [duration, setDuration] = React.useState();
const [utrNumber, setUtrNumber] = React.useState();
const utrNumberInputValueRef = React.useRef(null);

<FilterChipGroup>
  <Dropdown>
    <FilterChip value={duration} onClearButtonClick={({ value }) => setDuration(undefined)}>
      Duration
    </FilterChip>
    <DropdownOverlay>
      <ActionList>
        <ActionListItem
          title="2 days"
          value="2d"
          onClick={({ name, value }) => setDuration(name)}
        />
        <ActionListItem
          title="1 week"
          value="1w"
          onClick={({ name, value }) => setDuration(name)}
        />
        <ActionListItem
          title="1 month"
          value="1m"
          onClick={({ name, value }) => setDuration(name)}
        />
      </ActionList>
    </DropdownOverlay>
  </Dropdown>

  <Menu>
    <FilterChip value={utrNumber} onClearButtonClick={({ value }) => setUtrNumber(undefined)}>
      UTR Number
    </FilterChip>
    <MenuOverlay>
      <TextInput ref={utrNumberInputValueRef} />
      <Button onClick={() => setUtrNumber(utrNumberInputValueRef.current.value)}>Submit</Button>
    </MenuOverlay>
  </Menu>

  <Dropdown>
    <FilterChip
      value={status}
      defaultValue="Initiated"
      onClearButtonClick={({ value }) => setStatus(undefined)}
    >
      Status
    </FilterChip>
    <DropdownOverlay>
      <ActionList>
        <ActionListItem title="All" onClick={({ name, value }) => setStatus(name)} />
        <ActionListItem title="Pending" onClick={({ name, value }) => setStatus(name)} />
        <ActionListItem title="Completed" onClick={({ name, value }) => setStatus(name)} />
      </ActionList>
    </DropdownOverlay>
  </Dropdown>
</FilterChipGroup>;
```

#### Props

##### FilterChipGroup

```ts
type FilterChipGroupProps = {
  /**
   * Children prop. Supports Dropdown, Menu components
   *
   */
  children: React.ReactNode;
};
```

##### FilterChip

FilterChip can be used as a trigger for Dropdown and Menu

```ts
type FilterChipProps = {
  /**
   * Controlled value of FilterChip.
   *
   * FilterChip is always a controlled component since selected state of it comes from other components like Menu, Dropdown.
   */
  value: string;

  /**
   * Change handler when FilterChip's value is cleared
   */
  onClearButtonClick: ({ value }: { value: string }) => void;

  /**
   * Children. Title of the Chip
   */
  children: string;

  /**
   * Disabled state for Chip
   */
  isDisabled?: boolean;
};
```

### ListView (Layout Component)

Layout Component for handling the overall layout of ListView and Filters

```jsx
<ListView>
  <ListViewFilters
    quickFilters={[
      {
        title: 'All',
        onClick: () => {},
      },
      {
        title: 'Pending',
        onClick: () => {},
      },
    ]}
    onSearch={({ value, searchType }) => {
      /* filter on search */
    }}
  >
    <FilterGroup />
  </ListViewFilters>
  <Table />
</ListView>
```

#### Props

##### ListView

```ts
type ListViewProps = {
  children: React.ReactNode;
};
```

##### ListViewFilters

![alt text](image-4.png)

```ts
type QuickFilter = {
  title: string;
  onClick: (e: React.MouseEvent) => void;
};

type OnSearchArgs = {
  /**
   * Value of the search input field
   */
  value: string;

  /**
   * Value of the Dropdown next to search input
   */
  searchType: string;
};

type ListViewFiltersProps = {
  /**
   * Config of QuickFilters
   */
  quickFilters: QuickFilter[];

  /**
   * Callback when user clicks search button
   */
  onSearch: ({ value, searchType }: OnSearchArgs) => void;
};
```

## References

- [Material UI Data Grid](https://mui.com/x/react-data-grid/filtering-recipes/)
