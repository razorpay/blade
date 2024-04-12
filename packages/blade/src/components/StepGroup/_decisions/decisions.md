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
<StepGroup size="medium | large" variant="static | interactive" orientation="horizontal | vertical">
  <StepItem
    leading={<CheckIcon color="positive" /> | <Indicator color="positive" />}
    title="Step Item Title"
    timestamp="Wed, 27th Mar’24 | 12:00pm"
    description="Step item description"
    stepProgress="start | end | full"
    isSelected={true | false}
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
