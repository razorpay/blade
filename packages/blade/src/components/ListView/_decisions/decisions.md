# ListView Pattern

## Context on Patterns

We at Blade team have been building tokens, components, and utilities in the past few years. Now it's time to go one step forward of reusability by building more higher-level patterns.

### Why patterns for end-users

While components, tokens bring consistency on UI-level by ensuring that buttons, spacings, colors, etc are consistent. It does not necessarily cover much of the user experience aspects.

E.g. We can still use buttons, text, badge from blade but build "how we show transaction details to consumers" in 10 different ways or how the data in table is filtered in multiple ways. As we move towards Razorpay Connected Experience, a consistent user experience is critical to teach end users "how to do things" and make them more productive.

### Why patterns for developers and designers

While it helps our end-users for having consistent experience on "how to do things", patterns will help designers and developers of Razorpay ship pages faster by removing the effort required to design the common patterns we see across razorpay products like table filter pattern, detailed view pattern, step wizards, forms, and more.

## What are patterns though?

Patterns

## Component Changes

- Searchable Dropdown
- New Filter Chip component with support to be trigger of Dropdown and DatePicker

## API

### Rough API

#### Mostly Controlled on Consumer

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
  <ListViewQuickActions
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
  />

  <ListViewFilterGroup>
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
          <TextInput onChange={({ value }) => setEmailFilterText(value)} />
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

## References

- #### Patterns as Guideline

  - Some design-systems like Atlassian, Carbon, build patterns as guidelines for designers
  - https://atlassian.design/patterns

  For Atlassian, patterns are reusable combinations of components. It's more of a guidelines on how to build certain reusable combinations like Forms, or First Impressions than an actual reusable examples or react component

- #### Different types of Patterns

  This articles on [Patterns in Design Systems](https://iknowdavehouse.medium.com/patterns-in-design-systems-0afc4249bae6) by Dave House talks about how the distinction between patterns and component is not very clear and talks about different types of patterns like UI patterns, functional patterns,
