# StepGroup

## Component Structure Skeleton

```jsx
<StepGroup>
  <StepItem></StepItem>
  <StepItem></StepItem>
  <StepItem></StepItem>
  <StepGroup>
    <StepItem></StepItem>
    <StepItem></StepItem>
    <StepItem></StepItem>
  </StepGroup>
</StepGroup>
```

```jsx
<StepGroup size="medium | large" orientation="horizontal | vertical">
  <StepItem
    leading={<CheckIcon color="positive" /> | <Indicator color="positive" />}
    title="Step Item Title"
    timestamp="Wed, 27th Mar’24 | 12:00pm"
    description="Step item description"
    stepProgress="start | end | full"
    isSelected={true | false}
    onClick={() => {
      // do something
    }}
  />
  <StepItem />
  <StepItem />
  <StepGroup>
    <StepItem />
    <StepItem />
    <StepItem />
  </StepGroup>
</StepGroup>
```

Open Question:

- Do we want `variant="interactive"` prop if we can guess it from `onClick on StepItem? We can turn item into interactive with focus and hover states if it has onClick
