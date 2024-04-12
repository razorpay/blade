# StepGroup

Step Group visualises sequential processes with a consistent structure. It can be interactive, guiding users through steps, or function as a timeline for reference.

![alt text](image-1.png)

## Design

- [Figma - StepGroup](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=85892%3A80483&mode=design&t=hDxqVI91SqGGed4b-1)

## Props

```ts
type StepGroupProps = {
  /**
   * Size of StepGroup
   */
  size: 'medium' | 'large';

  /**
   * Orientation of StepGroup
   */
  orientation: 'horizontal' | 'vertical';
};

type StepItemProps = {
  /**
   * Title of StepItem
   */
  title: string;

  /**
   * A string that renders in italic font. Made for adding timestamp values
   */
  timestamp?: string;

  /**
   * Description of StepItem
   */
  description?: string;

  /**
   * Progress line of step
   *
   * @default none
   */
  stepProgress?: 'start' | 'end' | 'full' | 'none';

  /**
   * Leading element
   *
   * StepItemIcon or StepItemIndicator components as JSX
   *
   * @default <StepItemIndicator color="neutral" />
   */
  leading?: React.ReactElement;

  /**
   * Trailing element
   *
   * Badge components as JSX
   */
  trailing?: React.ReactElement;

  /**
   * Selected state of item.
   */
  isSelected?: boolean;

  /**
   * Href value
   *
   * Turns StepItem into interactive item and render it as anchor tag
   */
  href?: string;

  /**
   * Click handler
   *
   * Turns StepItem into interactive item and render it as button tag
   */
  onClick?: () => void;
};

type StepItemIconProps = {
  icon: IconComponent;
  color: 'positive' | 'negative' | 'neutral' | 'notice' | 'information' | 'primary';
};

type StepItemIndicatorProps = {
  color: 'positive' | 'negative' | 'neutral' | 'notice' | 'information' | 'primary';
};
```

## Usage

### Static StepGroup

Static StepGroup does not have any hover, focus, and active states. It can't be selected or clicked. It is for static steps only.

<img width="200px" src="./2024-04-12-14-12-50.png" alt=""/>

```jsx
<StepGroup>
  <StepItem
    leading={<StepItemIndicator color="positive" />}
    title="Disputes Raised"
    timestamp="Thu, 11th Oct23 | 12:00pm"
    stepProgress="full"
  />
  <StepItem
    leading={<StepItemIndicator color="notice" />}
    title="Needs Response"
    timestamp="Respond latest by Tue, 23rd Oct'24 | 12:00pm"
    description="Description"
    stepProgress="start"
  >
    <Button variant="secondary">Submit Documents</Button>
  </StepItem>
  <StepItem
    leading={<StepItemIndicator color="neutral" />}
    title="Decision from Bank"
    trailing={<Badge color="neutral">Pending</Badge>}
  />
</StepGroup>
```

### Interactive StepGroup

Interactive StepGroup can be used to add clickable items in StepGroup. When StepItem has `onClick` or `href` prop, it becomes interactive.

<img width="200px" src="./2024-04-12-15-16-25.png" alt="" />

```jsx
const InteractiveStepGroup = () => {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  return (
    <StepGroup>
      <StepItem
        leading={<StepItemIcon icon={CheckIcon} color="positive" />}
        title="Introduction"
        timestamp="Thu, 11th Oct23 | 12:00pm"
        isSelected={selectedIndex === 0}
        // `onClick` prop turns item into Interactive item
        onClick={() => {
          setSelectedIndex(0);
        }}
      />
      <StepItem
        leading={<StepItemIcon icon={ClockIcon} color="primary" />}
        title="Compliance Details"
        description="Provide documentation of reports"
        isSelected={selectedIndex === 1}
        onClick={() => {
          setSelectedIndex(1);
        }}
      />
    </StepGroup>
  );
};
```

### Nested StepGroup

<img width="200px" src="./2024-04-12-15-22-54.png" alt="" />

```jsx
<StepGroup>
  <StepItem
    leading={<StepItemIcon icon={CheckIcon} color="positive" />}
    title="Disputes Raised"
    timestamp="Thu, 11th Oct23 | 12:00pm"
    stepProgress="full"
    trailing={<Badge>Label</Badge>}
  />
  {/* Nested StepGroup */}
  <StepGroup>
    <StepItem
      leading={<StepItemIcon icon={CheckIcon} color="primary" />}
      title="Needs Response"
      timestamp="Respond latest by Tue, 23rd Oct'24 | 12:00pm"
      description="Description"
      stepProgress="start"
    />
    <StepItem
      leading={<StepItemIcon icon={CheckIcon} color="neutral" />}
      title="Needs Response"
      timestamp="Respond latest by Tue, 23rd Oct'24 | 12:00pm"
      description="Description"
    />
  </StepGroup>
  <StepItem
    leading={<StepItemIcon icon={CheckIcon} color="neutral" />}
    title="Decision from Bank"
    trailing={<Badge color="neutral">Pending</Badge>}
  />
</StepGroup>
```

### Horizontal Orientation

<img width="400px" src="./image.png" />

```jsx
<StepGroup orientation="horizontal">{/* StepItem components */}</StepGroup>
```

## Accessibility

- Make all steps visitable with `TAB` in interactive StepGroup
  - Render StepItem as `a` tag when `href` is used
  - Render StepItem as `button` tag when `onClick` is used without `href`
- StepGroup does not need any separate role to be defined or special tag to be used.

## Open Questions

- **Should we add `isInteractive` prop?**

  In the proposed API, I have proposed that we can turn item into interactive or static based on whether it has `onClick` or `href` or nothing. Is it intuitive enough? or should we add more explict prop called `isInteractive` like we have in design

- **Alternative to `leading`**

  Currently I have proposed `leading` prop where we can add Icon or indicator. Although in horizontal orientation, its not exactly "leading". It comes on top. Its also not very equivalent to leading we have in other components.

  Alternatives

  - `marker={<StepItemIndicator color="positive" />}`
