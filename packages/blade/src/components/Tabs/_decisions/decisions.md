# Tabs API Decisions <!-- omit in toc -->

A tab is a navigation component used in the interface to switch between different views in the same context. Tabs are contextual to the section or the page and are triggered by user interaction.

<img src="./tabs-thumbnail.png" width="380" alt="Tabs thumbnail" />

- [Design](#design)
- [Features](#features)
- [Anatomy](#anatomy)
- [`Tabs` API](#tabs-api)
- [`TabItem` API](#TabItem-api)
- [`TabPanel` API](#TabPanel-api)
  - [Examples:](#examples)
- [Basic](#basic)
  - [Controlled, Uncontrolled](#controlled-uncontrolled)
- [Filled Variant](#filled-variant)
- [With Tooltip](#with-tooltip)
- [Motion](#motion)
- [Accessibility](#accessibility)
- [Open Questions](#open-questions)

## Design

[Figma Link](https://www.figma.com/file/LSG77hEeVYDk7j7WV7OMJE/Blade-DSL---Components-Guideline?node-id=3733%3A8981&mode=dev) to all variants of the Tabs component

## Features

- Controlled and Uncontrolled
- Filled and Bordered variants
- Horizontal and Vertical orientation
- Medium and Large size

## Anatomy

<img src="./tabs-anatomy.png" width="100%" alt="Tabs thumbnail" />

```jsx
<Tabs>
  <TabList>
    <TabItem />
  </TabList>
  <TabPanel />
</Tabs>
```

## `Tabs` API

```ts
type TabsProps = {
  /**
   * The content of the component, accepts `TabList` and `TabPanel` components.
   */
  children: React.ReactNode;
  /**
   * The value of the selected tab, If set the component will be controlled.
   */
  value?: string;
  /**
   * The default value of the selected tab, in case the Tabs component is uncontrolled.
   */
  defaultValue?: string;
  /**
   * Callback fired when the value changes.
   */
  onChange?: (value: string) => void;
  /**
   * The orientation of the tabs.
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * The size of the tabs.
   */
  size?: 'medium' | 'large';
  /**
   * The variant of the tabs.
   */
  variant?: 'bordered' | 'filled';
  /**
   * If `true`, the TabItems will grow to use all the available space.
   */
  autoWidth?: boolean;
};
```

## `TabItem` API

```ts
type TabItemProps = {
  /**
   * The label of the tab item.
   */
  children: string;
  /**
   * The value of the tab item.
   */
  value: string;
  /**
   * Leading element of the tab item.
   * Can be used to render an icon.
   */
  leading?: React.ReactNode;
  /**
   * Trailing element of the tab item.
   * Can be used to render an badge/counter.
   */
  trailing?: React.ReactNode;
  /**
   * If `true`, the tab item will be disabled.
   */
  disabled?: boolean;
};
```

## `TabPanel` API

```ts
type TabPanelProps = {
  /**
   * The value of the tab panel. This will be used to match the selected tab.
   */
  value: string;
  /**
   * The content of the tab panel.
   */
  children: React.ReactNode;
};
```

### Examples:

## Basic

```js
<Tabs>
  <TabList>
    <TabItem value="payments">Payments</TabItem>
    <TabItem value="refunds">Refunds</TabItem>
    <TabItem value="disputes">Disputes</TabItem>
    <TabItem value="settlements">Settlements</TabItem>
  </TabList>

  <TabPanel value="payments">
    <Payments />
  </TabPanel>
  <TabPanel value="refunds">
    <Refunds />
  </TabPanel>
  <TabPanel value="disputes">
    <Disputes />
  </TabPanel>
  <TabPanel value="settlements">
    <Settlements />
  </TabPanel>
</Tabs>
```

<img src="./example-1.png" width="380" alt="Tabs Example 1" />

#### Controlled, Uncontrolled

```js
const Controlled = () => {
  const [selected, setSelected] = React.useState('payments');

  return (
    <Tabs value={selected} onChange={(value) => setSelected(value)}>
      <TabList>
        <TabItem value="payments">Payments</TabItem>
        <TabItem value="refunds">Refunds</TabItem>
      </TabList>

      <TabPanel value="payments">
        <Payments />
      </TabPanel>
      <TabPanel value="refunds">
        <Refunds />
      </TabPanel>
    </Tabs>
  );
};

const Uncontrolled = () => {
  return (
    <Tabs defaultValue="refunds">
      <TabList>
        <TabItem value="payments">Payments</TabItem>
        <TabItem value="refunds">Refunds</TabItem>
      </TabList>

      <TabPanel value="payments">
        <Payments />
      </TabPanel>
      <TabPanel value="refunds">
        <Refunds />
      </TabPanel>
    </Tabs>
  );
};
```

## Vertical Orientation

```jsx
<Tabs orientation="vertical">
  <TabList>
    <TabItem value="all-expenses" leading={RupeeIcon}>
      All Expenses
    </TabItem>
    <TabItem
      value="categories"
      leading={EditIcon}
      trailing={<Counter value={26} variant="notice" />}
    >
      Categorise
    </TabItem>
    <TabItem
      value="review"
      leading={TransactionIcon}
      trailing={<Counter value={99} variant="information" />}
    >
      Review
    </TabItem>
    <TabItem value="synced" leading={CheckCircleIcon}>
      Synced
    </TabItem>
    <TabItem
      value="synced-fail"
      leading={WarningIcon}
      trailing={<Counter value={3} variant="negative" />}
    >
      Synced Failed
    </TabItem>
    <TabItem value="excluded" leading={SlashIcon}>
      Excluded
    </TabItem>
  </TabList>
  ...
</Tabs>
```

<img src="./example-4.png" width="380" alt="Tabs Example 2" />

## Filled Variant

```jsx
<Tabs defaultValue="refunds">
  <TabList>
    <TabItem value="week">Week</TabItem>
    <TabItem value="month">Month</TabItem>
    <TabItem value="custom">Custom</TabItem>
  </TabList>

  <TabPanel value="week">
    <WeekGraph />
  </TabPanel>
  <TabPanel value="month">
    <MonthGraph />
  </TabPanel>
  <TabPanel value="custom">
    <CustomGraph />
  </TabPanel>
</Tabs>
```

<img src="./example-2.png" width="380" alt="Tabs Example 2" />

## With Tooltip

```jsx
<Tabs>
  <TabList>
    <TabItem value="payments">Payments</TabItem>
    <TabItem value="refunds">
      <Tooltip content="Return (money) in restitution, repayment, or balancing of accounts.">
        <TooltipInteractiveWrapper>Refunds</TooltipInteractiveWrapper>
      </Tooltip>
    </TabItem>
    <TabItem value="disputes">Disputes</TabItem>
    <TabItem value="settlements">Settlements</TabItem>
  </TabList>
  ...
</Tabs>
```

<img src="./example-3.png" width="380" alt="Tabs Example 3" />

## Motion

Check the motion [documentation](https://www.figma.com/proto/LSG77hEeVYDk7j7WV7OMJE/Blade-DSL---Components-Guideline?type=design&node-id=4005-31894&t=b3OlPHxPuFH1BAIZ-0&scaling=min-zoom&page-id=3698%3A13772) here.

## Accessibility

Tabs will follow the [WAI-ARIA Tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) pattern.

- [Keyboard navigation](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/#keyboardinteraction)

## Open Questions

N/A
