# Table API Decisions <!-- omit in toc -->

A table component helps in displaying data in a grid format, through rows and columns of cells. Table facilitates data organisation and allow users to: scan, sort, compare, and take action on large amounts of data.

<img src="./table-thumbnail.png" width="380" alt="Table thumbnail" />

## Features
- Column Sorting
- Row Selection - Single & Multiple
- Pagination
- Bulk Actions Toolbar
- Horizontally Scrollable
- Sticky Columns
- Sticky Header
- Sticky Footer
- Cell Density - Normal & Comfortable

## Out of scope
We don't have enough use-cases for the following features at Razorpay and hence scoped them out of our Table component. If you are aware of any of these features being used at Razorpay, please let us know by creating an issue - we will evaluate it and scope it for future releases.

- Column Reordering
- Column Resizing
- Column Filtering
- Search
- Row Expansion
- Nested Tables
- Hiding Columns
- Editable Rows

## Anatomy
[To be added]

## API

### API Design
While evaluating what kind of API we want for our table, we discovered 2 approaches:

#### 1. Composable API
Composable API is a pattern where we have a set of components that can be composed together to create a table. This approach allows us to stitch together a table very similar to how you would do it with native HTML. However, it is also more verbose and requires more effort to create a table.

```jsx
const data = [{
    firstName: 'John',
    lastName: 'Doe',
    balance: 1000
},
{
    firstName: 'Jane',
    lastName: 'Doe',
    balance: 2000
}];

const sortFunctions = {
  firstName: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
};

const onSelectionChange = (selectedItems) => {
  console.log(selectedItems);
};

const onSortChange = ({ headerKey, sortType }) => {
  console.log({headerKey, sortType});
};


```


```jsx
<Table 
    data={data} // This contains the actual data to be rendered in the table which would be retrieved from some API
    selectionType='single' 
    onSelectionChange={onSelectionChange} 
    sortFunctions={sortFunctions} 
    onSortChange={onSortChange}
    isLoading={false}
    cellDensity='normal'
    showZebraStripes={true}
    pagination={{
      limit: 10,
      offset: 0,
    }}
>
{(tableData) => (
  <>
    <TableToolbar title="Users" itemsSelectedTitle={`${selectedUsersCount} Users selected`}>
        <ToolbarActions>
            <Button>Export</Button>
        </ToolbarActions>
    </TableToolbar>

    <TableHeader isSticky={true}>
      <TableHeaderRow>
         <TableHeaderCell headerKey='firstName'>
          First Name
        </TableHeaderCell>
        <TableHeaderCell headerKey='lastName'>
          Last Name
        </TableHeaderCell>
        <TableHeaderCell headerKey='balance'>
          Balance
          <Tooltip content='Current bank balance'>
            <InfoIcon size='medium' />
          </Tooltip>
        </TableHeaderCell>
       </TableHeaderRow>
     </TableHeader>

    <TableBody>
      <TableRow onClick={console.log} isDisabled={false}>
        <TableCell>
          {tableData.firstName}
        </TableCell>
        <TableCell>
          {tableData.lastName}
        </TableCell>
        <TableCell>
          {tableData.balance}
          <Badge>Low</Badge>
        </TableCell>
      <TableRow>
    </TableBody>

    <TableFooter>
      <TableFooterRow>
        <TableFooterCell columnStart='1' columnEnd='4'>
          Total
        </TableFooterCell>
        <TableFooterCell>
          {computedTotalBalance}
        </TableFooterCell>
      </TableFooterRow>
    </TableFooter>

    <TablePagination 
      navigationType='compact' 
      label='1-10 of 100'
      labelPosition='left'
      showRowCountPicker
      rowCount='25'
      onPaginationChange={console.log}
      onRowCountPickerChange={console.log}
      /> 
   </>
  )
}
</Table>
```

#### 2. Compact API
Compact API is a pattern where we have a single component that takes in all the data and renders a table. This approach is more concise and requires less effort to create a table. However, it is also less intuitive and does not resemble the native HTML structure of a table.

```jsx
const data = [{
    firstName: 'John',
    lastName: 'Doe',
    balance: 1000
},
{
    firstName: 'Jane',
    lastName: 'Doe',
    balance: 2000
}];


const sortFunctions = {
  firstName: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
};

const onSelectionChange = (selectedItems) => {
  console.log(selectedItems);
};

const columnDefinition = [
    {
        header: 'First Name',
        headerKey: 'firstName',
        cell: (row) => row.firstName,
        isSticky: true,
        columnStart: undefined,
        columnEnd: undefined,
    },
    {
        header: 'Last Name',
        headerKey: 'lastName',
        cell: (row) => row.lastName,
        isSticky: true,
        columnStart: undefined,
        columnEnd: undefined,
    },
    {
        header: () => (
            <>
                Balance
                <Tooltip content='Current bank balance'>
                    <InfoIcon size='medium' />
                </Tooltip>
            </>),
        headerKey: 'balance',
        cell: (row) => (
            <>
                {row.balance}
                <Badge>Low</Badge>
            </>),
        isSticky: true,
        columnStart: undefined,
        columnEnd: undefined,
    }
];

const footerDefinition = [
    {
        footer: 'Total',
        columnStart: 1,
        columnEnd: 4,
    },
    {
        footer: computedTotalBalance,
    }
];

const pagination = {
  showRowCountPicker?: boolean
  onRowCountPickerChange?: ({ count }) => void
  navigationType?: 'compact' | 'expanded'
	label?: string
	labelPosition?: 'left' | 'right'
	limit: number
	offset: number
	onPaginationChange?: ({ offset }) => void
};
```

```jsx
<DataTable
    data={data} // This contains the actual data to be rendered in the table which would be retrieved from some API
    columns={columns} // This contains the column definition for the table
    footerRow={footerRow} // This contains the footer definition for the table
    selectionType='single'
    onSelectionChange={onSelectionChange}
    sortFunctions={sortFunctions}
    onSortChange={onSortChange}
    isLoading={false}
    cellDensity='normal'
    showZebraStripes={true}
    toolbarTitle="Users"
    toolbarItemsSelectedTitle={`${selectedUsersCount} Users selected`}
    toolbarActions={<Button>Export</Button>}
    isStickyHeader={true}
    isStickyFooter={true}
/>
```