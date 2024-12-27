# ListView Pattern

## Context on Patterns

We at Blade team have been building tokens, components, and utilities in the past few years. Now it's time to go one step forward of reusability by building more higher-level patterns.

### Why patterns for end-users

While components, tokens bring consistency on UI-level by ensuring that buttons, spacings, colors, etc are consistent. It does not necessarily cover much of the user experience aspects.

E.g. We can still use buttons, text, badge from blade but build "how we show transaction details to consumers" in 10 different ways or how the data in table is filtered in multiple ways. As we move towards Razorpay Connected Experience, a consistent user experience is critical to teach end users "how to do things" and make them more productive.

### Why patterns for developers and designers

While it helps our end-users for having consistent experience on "how to do things", patterns will help designers and developers of Razorpay ship pages faster by removing the effort required to design the common patterns we see across razorpay products like table filter pattern, detailed view pattern, step wizards, forms, and more.

## What are patterns though?

> 7. Start building your first patterns: This is the task that will never end. Patterns should always either reflect the truth about the product, or reflect the aspirational state of the product in the near future.
>
> ~ [Design System vs Pattern Libraries](https://www.uxpin.com/studio/blog/design-systems-vs-pattern-libraries-vs-style-guides-whats-difference/#:~:text=7.%20Start%20building%20your%20first%20patterns%3A%C2%A0%20This%20is%20the%20task%20that%20will%20never%20end.%20Patterns%20should%20always%20either%20reflect%20the%20truth%20about%20the%20product%2C%20or%20reflect%20the%20aspirational%20state%20of%20the%20product%20in%20the%20near%20future.)

> "The elements of this language are entities called patterns. Each pattern describes a problem that occurs over and over again in our environment, and then describes the core of the solution to that problem, in such a way that you can use this solution a million times over..."
>
> ~ Christopher Alexander, Author of a Pattern Language

- [As per BBC](https://www.bbc.com/gel/guidelines/category/design-patterns), Accordion, Card, BottomNav are patterns
- [As per GOV.UK](https://design-system.service.gov.uk/patterns/), Phone Number Confirmation Screen, Finding Service, Contact Support, etc are patterns
- [Salesforce Design System](https://www.lightningdesignsystem.com/guidelines/builder/zoom/) on the other hand, calls it Design Guidelines instead of patterns and only has it as guidelines

**Goals of Patterns**

- ✅ To bring consistency in the UI
- ✅ To simplify building and designing reusable patterns in UI

**Goals of Templates**

- ⚠️ To bring consistency in the UI
- ✅ To simplify building and designing reusable patterns in UI

### Patterns vs Templates

### Patterns vs Components

## Component Changes

- Enhancement: Searchable Dropdown
- New Component: New Filter Chip component with support to be trigger of Dropdown and DatePicker
- New Component / Quick filter card (TODO: see if existing card can be used)

## API

```jsx
const tableDefaultData = [
  { id: 1, name: 'Saurabh', status: 'Pending' },
  { id: 2, name: 'Anurag', status: 'Completed' },
  { id: 3, name: 'Kamlesh', status: 'Completed' },
  { id: 4, name: 'Chaitanya', status: 'In Progress' },
];

const [filteredTableData, setFilteredTableData] = React.useState(tableDefaultData);

const filterTable = () => {};

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
    onSearch={(searchValue, searchColumn = 'name') => {
      setFilteredTableData(
        tableDefaultData.filter((tableData) => searchValue.includes(tableData[searchColumn])),
      );
    }}
  >
    <Dropdown>
      <ListViewFilter title="Status" />
      <DropdownOverlay>
        <ActionList>
          <ActionListItem title="All" />
          <ActionListItem title="Pending" />
          <ActionListItem title="Completed" />
        </ActionList>
      </DropdownOverlay>
    </Dropdown>

    <Menu>
      <ListViewFilter title="Customer Email" />
      <MenuOverlay>
        <Box display="flex" gap="spacing.4">
          <TextInput type="email" onChange={({ value }) => setEmailFilterText(value)} />
          <Button
            icon={CheckIcon}
            onClick={() => {
              setFilteredTableData(
                tableDefaultData.filter((tableData) => emailFilterText.includes(tableData.email)),
              );
            }}
          />
          <Button icon={CrossIcon} />
        </Box>
      </MenuOverlay>
    </Menu>
  </ListViewFilterGroup>

  <Table data={{ nodes: filteredTableData }} />
</ListView>;
```

### Alternate APIs

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

This API is similar to above one except here we use defined config for adding filters

##### Pros

- Less verbose compared to using dropdown and menu inside ListViewFilterGroup

##### Cons

- Very strict API which might cause missing edge cases and rework on blade-side for every product change
- Will have bundle of Dropdown, Menu, DatePicker, BottomSheet, etc even if that particular filter is not used
- Less intuitive because it'll introduce new config. Compared to previous API where consumers will use filters using the components that they already know how to use.

## References

- #### Patterns as Guideline

  - Some design-systems like Atlassian, Carbon, build patterns as guidelines for designers
  - https://atlassian.design/patterns

  For Atlassian, patterns are reusable combinations of components. It's more of a guidelines on how to build certain reusable combinations like Forms, or First Impressions than an actual reusable examples or react component

- #### Different types of Patterns

  This articles on [Patterns in Design Systems](https://iknowdavehouse.medium.com/patterns-in-design-systems-0afc4249bae6) by Dave House talks about how the distinction between patterns and component is not very clear and talks about different types of patterns like UI patterns, functional patterns,
