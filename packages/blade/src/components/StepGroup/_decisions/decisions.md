# StepGroup

## Component Structure Skeleton

```jsx
<StepGroup size="medium | large" orientation="horizontal | vertical">
  <StepItem
    leading={<CheckIcon color="positive" /> | <Indicator color="positive" />}
    trailing={<Badge>Label</Badge>}
    title="Step Item Title"
    timestamp="Wed, 27th Mar’24, 12:00pm"
    description="Step item description"
    stepProgress="start | end | full"
    isSelected={true | false}
    // passing href renders item as `a`
    href=""
    // passing onClick or href will automatically turn StepItem into interactive. It will add focus, hover states
    onClick={() => {}}
  >
    <Slot />
  </StemItem>
  <StepItem />
  <StepItem />
  {/* Nested Step. Renders with an indentation. Equivalent of `isIndented` prop on design */}
  <StepGroup>
    <StepItem />
    <StepItem />
    <StepItem />
  </StepGroup>
</StepGroup>
```

## Usage

<table>
<tr><th>Code</th><th>Preview</th></tr>
<tr>
<td>

```jsx
<StepGroup>
  <StepItem title="Disputes Raised" timestamp="Thu, 11th Oct23 | 12:00pm" />
  <StepItem
    title="Disputes Contested"
    timestamp="Mon, 15th Oct23 | 12:00pm"
    description="Amount : ₹5000"
  />
  <StepItem
    title="Disputes Under Review"
    trailing={<Badge color="positive">Received by our team</Badge>}
  />
  <StepItem
    title="Needs Reponse"
    timestamp="Respond latest by Tue, 23rd Oct'24 | 12:00pm"
    description="Description"
  >
    <Button variant="secondary">Submit Documents</Button>
  </StepItem>
  <StepItem
    title="Documents Sent to the Bank"
    description="Bank might take up to 3 months to review"
    trailing={<Badge color="neutral">Pending</Badge>}
  />
  <StepItem
    title="Decision from Bank"
    //
    trailing={<Badge color="neutral">Pending</Badge>}
  />
</StepGroup>
```

</td>
<td><img width="200px" src="./2024-04-12-14-12-50.png" alt=""/></td>
</tr>
</table>

## Open Questions

- Should we use `onClick` and `href` of StepItem to render that item as interactive? or should we take `isInteractive` prop on parent StepGroup to define the entire stepgroup as interactive
