# Card Variants

## Table of Contents
- [Card Variants](#card-variants)
  - [Metric Card](#metric-card)
    - [Design](#design)
  - [Enhancements](#enhancements)
    - [API 1](#api-1)
    - [API 2](#api-2)

    

We are introducing a new variant of card -  Metric and default (currently exists as `Card`)

- Metric Card - Metric card is designed to prominently display key performance indicators, statistics, and measurable data points. They provide merchants with at-a-glance visibility into important business metrics through a structured, scannable format. This card should be used wherever we need to show metrics/data points

<img src="./metric.png" alt="Metric Card" width="380"  />

- Default Card - A card component with a header and content area. (currently exists as `Card`)

<img src="./card-anatomy.png" alt="Default Card"  width="380"/>

*Notes*


- After initial discussion we decided that we would be treating these card variants as enhancements to the existing `Card` component. 
- We also had a layout card variant (which have changes in header) but during discussion we got to know that would be part of the `Layout` pattern
- Earlier we had a plan to move Metric slot to `cardHeader` but during discussion we decided to move it to `cardBody`.  (so not much api changes , enhancement only)

## Metric Card

Metric card is designed to prominently display key performance indicators, statistics, and measurable data points. They provide merchants with at-a-glance visibility into important business metrics through a structured, scannable format. This card should be used wherever we need to show metrics/data points

### Design

- [Figma - Metric Card](https://www.figma.com/design/yKBlpifyZvi28APkmlY5Td/-Research--Cards--v2-?node-id=1448-6614&m=dev)

### API 
* We won't be changing the existing api of the existing card component.
* We can directly pass `MetricSlot` in `CardBody` and it will render the metric card.

```jsx
import { Card ,CardHeader , CardHeaderLeading , CardHeaderTrailing, CardHeaderBadge , CardHeaderLink  } from '@razorpay/blade/components';

<Card>
  <CardHeader>
    <CardHeaderLeading
      title="Header Title"
      subtitle="Header Subtitle"
      />
    <CardHeaderTrailing
     visual={isMobile ? <CardHeaderBadge/> :  <CardHeaderLink>} />
   </CardHeader>
   <CardBody>
   <MetricSlot/>
   //content
   </CardBody>
   <CardFooter>
   //footer
   </CardFooter>
</Card>
```

### Enhancements

We also have a layout card variant (which have changes in header) but during discussion we got to know that would be part of the `Layout` pattern
but still we need to enhancement to support these changes.

- [Figma - Layout Card ](https://www.figma.com/design/yKBlpifyZvi28APkmlY5Td/-Research--Cards--v2-?node-id=1429-61697&p=f&m=dev)


- Changes: 
  - Add Support for ToolTip in Title 
  - Add Support for passing headerLayout in CardHeaderTrailing (will pick this up with layout pattern)
  


#### API-1
* Support passing multiple components in Suffix of CardHeaderLeading. (this way we can pass tooltip and other components in suffix)
```tsx
<CardHeaderLeading
  suffix={
    <CardHeaderBox>
      <Tooltip />
      <Button />
    </CardHeaderBox>
  }
/>


```typescript
type CardHeaderLeading = {
  suffix?: React.ReactNode;
};
```
* Here we are also adding a new component `CardHeaderBox` which is a wrapper on top of `Box` component. it can be only used in `CardHeaderLeading`.

 Benefits:
 - We can pass multiple components in suffix.
 - We can use `Box` props on suffix.
 - Gives more flexibility to the developer to pass any component in suffix.

Drawbacks:
- We are adding a new component `CardHeaderBox` which is a wrapper on top of `Box` component.

So we went ahead with this api and added a new component `CardHeaderBox` which is a wrapper on top of `Box` component.

#### API-2
* Maybe support passing tooltip  in CardHeaderLeading


<CardHeaderLeading
  suffix={<CardHeaderBadge />}
  toolTipTitle="Tooltip Title"
  toolTipContent="Tooltip Content"
/>

```typescript

type CardHeaderLeadingProps = {
   // rest of the props
   toolTipTitle?: string;
   toolTipContent?: string;
  }

```

Benefits:
- We can pass tooltip in suffix.
- Gives more flexibility to the developer to pass any component in suffix.

Drawbacks:
- We are adding a new prop `toolTipTitle` and `toolTipContent` in `CardHeaderLeading`.
- This api is too much restricted to pass any component in suffix.
