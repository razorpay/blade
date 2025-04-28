## Component Name

QuickFilter & QuickFilterGroup

## Description

QuickFilter and QuickFilterGroup components provide a user-friendly interface for displaying and selecting filterable options. They allow users to make single or multiple selections from a set of predefined filters, often displaying counts or other trailing elements. Ideal for dashboards, search interfaces, or any scenario where users need to filter data quickly.

## TypeScript Types

These types represent the props that the component accepts. When using the QuickFilter component along with QuickFilterGroup, you'll need to understand these types to properly configure them.

```typescript
type QuickFilterProps = {
  /*
      title is a string that is displayed as the title of the quick filter.
  */
  title: string;
  /*
        value is a string that is displayed as the value of the quick filter.
  */
  value: string;
  /*
        trailing is a React node that is displayed after the quick filter.
  */
  trailing?: React.ReactNode;
} & TestID &
  DataAnalyticsAttribute;

type QuickFilterGroupProps = {
  /**
   * Specifies the name attribute for the component.
   * When provided, this attribute ensures that the QuickFilter elements within the group are semantically associated, allowing them to be grouped logically for form submission.
   * This can be particularly useful in scenarios where the QuickFilter is part of a larger form and needs to be identified as a distinct entity when the form is submitted.
   * If not provided, a default unique identifier will be generated internally.
   */
  name?: string;
  /**
   * Sets the initial value of the QuickFilter component.
   */
  defaultValue?: string | string[];
  /**
   * Value of the QuickFilter group
   * Acts as a controlled component by specifying the QuickFilter value
   * Use `onChange` to update its value
   */
  value?: string | string[];
  /*
   onChange is a function that is called when the selected quick filter changes.
   it returns an object with the name of the quick filter group and the values of the selected quick filters.
  */
  onChange?: ({ name, values }: { name: string; values: string[] }) => void;
  /*
     selectionType is a string that can be either 'single' or 'multiple'.
  */
  selectionType: 'single' | 'multiple';
  /*
       children is an array of QuickFilter components.
  */
  children: React.ReactNode;
} & TestID &
  DataAnalyticsAttribute;

type QuickFilterContentProps = Pick<QuickFilterProps, 'trailing' | 'value' | 'title'> &
  Pick<QuickFilterGroupProps, 'selectionType'> &
  TestID &
  DataAnalyticsAttribute & {
    isSelected?: boolean;
  };

type QuickFilterGroupContextType = Pick<QuickFilterGroupProps, 'selectionType'> & {
  selectedQuickFilters: string[];
};
```

## Example

### Basic Usage

```tsx
import { QuickFilterGroup, QuickFilter } from '@razorpay/blade/components';
import { Counter } from '@razorpay/blade/components';

function BasicQuickFilterExample() {
  const handleFilterChange = ({ name, values }) => {
    console.log(`Filter group ${name} has selected values: ${values.join(', ')}`);
  };

  return (
    <QuickFilterGroup selectionType="single" onChange={handleFilterChange}>
      <QuickFilter title="All" value="all" trailing={<Counter value={400} color="information" />} />
      <QuickFilter
        title="Captured"
        value="captured"
        trailing={<Counter value={234} color="positive" />}
      />
      <QuickFilter
        title="Failed"
        value="failed"
        trailing={<Counter value={166} color="negative" />}
      />
    </QuickFilterGroup>
  );
}
```
