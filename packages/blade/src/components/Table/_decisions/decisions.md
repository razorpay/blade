# Table API Decisions <!-- omit in toc -->

A table component helps in displaying data in a grid format, through rows and columns of cells. Table facilitates data organisation and allow users to: scan, sort, compare, and take action on large amounts of data.

<img src="./table-thumbnail.png" width="760" alt="Table thumbnail" />

- [Features](#features)
- [Out of scope](#out-of-scope)
- [Anatomy](#anatomy)
- [API](#api)
  - [API Design Approaches](#api-design-approaches)
    - [1. Composable API](#1-composable-api)
      - [Pros](#pros)
      - [Cons](#cons)
    - [2. Compact API](#2-compact-api)
      - [Pros](#pros-1)
      - [Cons](#cons-1)
    - [Decision](#decision)
      - [Only Composable API](#only-composable-api)
      - [Only Compact API](#only-compact-api)
      - [Both Composable \& Compact API](#both-composable--compact-api)
      - [Conclusion](#conclusion)
  - [Final API](#final-api)
- [Table Library Evaluation](#table-library-evaluation)
  - [Why a library?](#why-a-library)
  - [What are we looking for in a library?](#what-are-we-looking-for-in-a-library)
  - [Libraries evaluated](#libraries-evaluated)
    - [Heavy sized library - AG Grid](#heavy-sized-library---ag-grid)
    - [Medium sized library - Tanstack's React Table](#medium-sized-library---tanstacks-react-table)
    - [Small sized library - React Table Library](#small-sized-library---react-table-library)


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
<img src="./table-anatomy.png" width="760" alt="Table thumbnail" />

## API

### API Design Approaches
While evaluating what kind of API we want for our table, we discovered 2 approaches:

#### 1. Composable API
Composable API is a pattern where we have a set of components that can be composed together to create a table. This approach allows us to stitch together a table very similar to how you would do it with native HTML. However, it is also more verbose and requires more effort to create a table.

```jsx
// Mock data & functions

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
// Composable Table

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

##### Pros
- Composable API is more intuitive and resembles the native HTML structure of a table
- It is easier to understand since the API design is similar to rest of the Blade components
- It is easier to extend and add new feature to individual table components
- We could leverage tree-shaking to only import the components that are being used in the consumer's table

##### Cons
- Composable API is more verbose and requires more effort to create a table by composing together multiple components
- Most popular table libraries like AG Grid, React Table, etc. use a compact API which is battle tested and developers are more familiar with the same

#### 2. Compact API
Compact API is a pattern where we have a single component that takes in all the data and renders a table. This approach is more concise and requires less effort to create a table. However, it is also less intuitive and does not resemble the native HTML structure of a table.

```jsx
// Mock data & functions
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
// Compact Table

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

##### Pros
- Compact API is more concise and requires less effort to create a table
- Most popular table libraries like AG Grid, React Table, etc. use a compact API which is battle tested and developers are more familiar with the same
- It would be relatively easier to swap out the table library in the future if we decide to do so since the API design is similar to other popular table libraries

##### Cons
- Compact API is less intuitive and does not resemble the native HTML structure of a table
- It is harder to extend and add new feature to the table component since it is a single component
- We would have to import the entire table component even if we are using only a few features of the table resulting in a higher bundle size for the consumer
- Internally, we would have to use a composable API to create the compact API anyway since the library we have chosen has a composable API

#### Decision
##### Only Composable API
- We could expose only the Composable API to the consumers 
- This would take the least amount of implementation time and effort
- Strong reasons to go with this approach would be the composability and tree-shaking benefits
- Strong reasons to not go with this approach would be the verbosity and the fact that it is not the most popular approach within Table libraries ecosystem

##### Only Compact API
- We could expose only the Compact API to the consumers
- This would take the relatively more time and effort since internally we will have to build individual components and stitch them together to create the compact API
- Internally we might not need to put in heavy efforts to ensure composable API is very well structured since we will not be exposing it to the consumers. We would use the composable API internally only to derive the final outcome of a compact API.
- Strong reasons to go with this approach would be the popularity of the compact API within the Table libraries ecosystem
- Strong reasons to not go with this approach would be the lack of composability and tree-shaking benefits

##### Both Composable & Compact API
- We could expose both the Composable & Compact API to the consumers
- This would take the most amount of implementation time and effort since we will have to build both the APIs
- This will add a lot of complexity to the library and will make it harder to maintain. Any changes to the Table component, we will have to ensure both APIs are updated accordingly and always maintain parity
- Swapping out the table library in the future would be challenging since any library we choose we will have to ensure that its feasible to build both kinds of APIs
- Strong reasons to go with this approach would be to give our consumers complete flexibility to choose the API that they are most comfortable with
- Strong reasons to not go with this approach would be the complexity and maintainability issues as well as education efforts required to educate the consumers about both the APIs

##### Conclusion
[To be concluded]

### Final API
- To be concluded. This section will change depending on whether we choose Composable or Compact API. Most things would remain the same as proposed in the above sections for both APIs but this section will contain a bit more detailed API design for the chosen API.

## Table Library Evaluation
### Why a library?
- The primary reason for using a library is to use a battle-tested solution that has been used by a lot of people and has been proven to work well instead of figuring out all the edge cases ourselves
- On a long term we could evaluate swapping it out and building our own solution when the bandwidth and requirements align but until then using an open source library would be the best option

### What are we looking for in a library?
We had a few requirements that we were looking for in a library:
- Well maintained and has a good community around it
- Reasonable bundle size
- Supports all the features that we need today and in the future (including features marked out of scope)
- Flexible styling to ensure we can match the Razorpay's design language
- Flexible API to ensure we can build both the Composable & Compact APIs

### Libraries evaluated
While evaluating multiple libraries we identified 3 categories: 
- **Heavy sized library** with every feature under the sun
- **Medium size library** with all of the features we could need plus some more
- **Small size library** with all the core features we could need

#### Heavy sized library - AG Grid
- [AG Grid](https://www.ag-grid.com/) is the best example of a heavy sized library. It has a lot of features and is very well maintained. However, it is also very heavy and has a lot of features that we don't need.
- As of today, AG Grid's bundle size is 75kb (15kb gzipped) but along with this we also need to install some additional dependency libraries like ag-grid-community which would eventually increase the overall bundle size
- Replicating the Composable API would be a challenging task with React Table since it internally uses API similar to the Compact API. We would have to build a lot of abstractions to ensure we can build the Composable API on top of the Compact API.
- AG Grid is possibly the most battle-tested library but has a ton of features that we won't need and hence would be an overkill for us as of now

#### Medium sized library - Tanstack's React Table
- [Tanstack's React Table](https://react-table.tanstack.com/) is the best example of a medium sized library. It has all the features we need and is very well maintained. However, it is also relatively heavy and has a lot of features that we don't need.
- As of today, React Table's bundle size is 60kb (14kb gzipped).
- Tanstack's React  Table has been around for a longer duration and is extremely well maintained. It has relatively less features than AG Grid but also has a lot of features that we don't need.
- Tanstack's React Table is built in a framework agnostic manner which meant they had to use a lot of abstractions to ensure it works well with all the frameworks. This makes it harder to understand, maintain and extend the library.
- Replicating the Composable API would be a challenging task with React Table since it internally uses API similar to the Compact API. We would have to build a lot of abstractions to ensure we can build the Composable API on top of the Compact API.
- React Table is possibly our 2nd best option if we ever need more complex tables in the future but as of now it would be an overkill for us

#### Small sized library - React Table Library
- [React Table Library (@table-library/react-table-library)](https://github.com/table-library/react-table-library) is the best example of a small sized library. It has all the features we need and is relatively well maintained.
- It contains all the features we need today as well as the ones we can forsee needing in the future
- As of today, React Table Library's bundle size is 23kb (7kb gzipped).
- React Table Library has a Composable API using which we can build our Composable as well as Compact API
- React Table Library also exposes a minimal Compact API but we cannot use that directly to build our Compact API since there isn't a parity between their own Composable & Compact APIs
- React Table Library is our best option as of today since it has all the features we could need and is relatively lightweight