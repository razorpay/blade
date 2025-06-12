# Card Variants

## Table of Contents
- [Card Variants](#card-variants)
  - [Layout Card](#layout-card)
    - [Design](#design)
    - [API](#api)
    - [Typescript Types](#typescript-types)
    - [Alternative APIs](#alternative-apis)
  - [Metric Card](#metric-card)
    - [Design](#design-1)
    - [API](#api-1)
    - [Typescript Types](#typescript-types-1)

We are introducing 2 new variants of cards - Layout, Metric and default (currently exists as `Card`)

- Layout Card - Layout cards serve as comprehensive content containers that guide users through multi-step processes, feature highlights, or detailed information sections. They're particularly effective in scenarios where users need to consume information and take specific actions, such as dashboards, detailed information sections or settings pages.

<img src="./layout.png" width="380"  alt="Layout Card" />

- Metric Card - Metric card is designed to prominently display key performance indicators, statistics, and measurable data points. They provide merchants with at-a-glance visibility into important business metrics through a structured, scannable format. This card should be used wherever we need to show metrics/data points

<img src="./metric.png" alt="Metric Card" width="380"  />

- Default Card - A card component with a header and content area. (currently exists as `Card`)

<img src="./card-anatomy.png" alt="Default Card"  width="380"/>

*Note*


After initial discussion we decided that we would be treating these card variants as enhancements to the existing `Card` component. 

## Layout Card

Layout cards serve as comprehensive content containers that guide users through multi-step processes, feature highlights, or detailed information sections. They're particularly effective in scenarios where users need to consume information and take specific actions, such as dashboards, detailed information sections or settings pages.



### Design

- [Figma - Layout Card](https://www.figma.com/design/yKBlpifyZvi28APkmlY5Td/-Research--Cards--v2-?node-id=1429-61697&p=f&m=dev)


### API

```jsx
import { Card, CardHeader , CardHeaderLeading , CardHeaderTrailing, CardHeaderBox , CardHeaderLink ,CardHeaderButton  } from '@razorpay/blade/components';

<Card>
  <CardHeader>
    <CardHeaderLeading
      title="Header Title"
      subtitle="Header Subtitle"
      suffix={<Link />}
      prefix={<Icon />}
      toolTipTitle="Total Payment Volume"
      toolTipContent="This is a tooltip"
    />
    <CardHeaderTrailing
      visual={
        <CardHeaderBox>
          <CardHeaderLink />
          <CardHeaderLink />
          <CardHeaderButton />
          <CardHeaderButton />
        </CardHeaderBox>
      }
    ></CardHeaderTrailing>
  </CardHeader>
  <CardBody>//content</CardBody>
  <CardFooter>//footer</CardFooter>
</Card>;
```

## Typescript Types

```typescript
type CardHeaderTrailingProps = {
  children?: React.ReactNode;
  visual?: React.ReactNode;
};

type CardHeaderLeadingProps = {
   // rest of the props
   toolTipTitle?: string;
   toolTipContent?: string;
  }

type CardHeaderBoxProps extends BoxProps {}

type CardHeaderLinkProps extends LinkProps {}

type CardHeaderButtonProps extends ButtonProps {}


```

- we can add internal check to verify if the children prop is a valid component.

### Alternative APIs

```jsx
import { Card, CardHeader , CardHeaderLeading , CardHeaderTrailing, CardHeaderBox , CardHeaderLink ,CardHeaderButton } from '@razorpay/blade/components';

<Card>
  <CardHeader>
    <CardHeaderLeading
      title="Header Title"
      subtitle="Header Subtitle"
      suffix={<Link />}
      prefix={<Icon />}
    />
    <CardHeaderTrailing>
      <CardHeaderBox>
        // first link
        <CardHeaderLink href="https://github.com" />
        // second link
        <CardHeaderLink href="https://github.com" />
        // primary action
        <CardHeaderButton  />
        // secondary action
        <CardHeaderButton />
      </CardHeaderBox>
    </CardHeaderTrailing>
  </CardHeader>
  <CardBody>//content</CardBody>
  <CardFooter>//footer</CardFooter>
</Card>;
```

```typescript
type CardHeaderTrailingProps = {
  children?: React.ReactNode;
  visual?: React.ReactNode;
};
```

- we can add internal check to verify if the children prop is a valid component ( Link , Button) or add check in eslint plugin.

- we might need to modify the visual prop to accept more components. maybe move checks to the component itself ? or eslint plugin

-  need to do JSX parsing in case of mobile and render action list.

## Benefis of this approach
  - Since we are not building new components, we are not introducing breaking changes and we are not adding to the complexity of the codebase. consumers of the library can use the existing `Card` component and extend it with new variants.
  - We can add more variants in the future without breaking changes.
  - This approach make it easier to maintain the codebase and add new variants.
  - it will save a lot of development time and effort.

## Metric Card

Metric card is designed to prominently display key performance indicators, statistics, and measurable data points. They provide merchants with at-a-glance visibility into important business metrics through a structured, scannable format. This card should be used wherever we need to show metrics/data points

### Design

- [Figma - Metric Card](https://www.figma.com/design/yKBlpifyZvi28APkmlY5Td/-Research--Cards--v2-?node-id=1448-6614&m=dev)

### API

```jsx
import { Card ,CardHeader , CardHeaderLeading , CardHeaderTrailing, CardHeaderBadge , CardHeaderLink ,CardHeaderButton } from '@razorpay/blade/components';

<Card>
  <CardHeader>
    <CardHeaderLeading
      title="Header Title"
      subtitle="Header Subtitle"
      slot={<CardHeaderBox> 
       <Amount/>
       <Text> ferferf </Text>
      </CardHeaderBox>}
      />
    <CardHeaderTrailing
     visual={isMobile ? <CardHeaderBadge/> :  <CardHeaderLink>} />
   </CardHeader>
   <CardBody>
   //content
   </CardBody>
   <CardFooter>
   //footer
   </CardFooter>
</Card>
```

## Typescript Types

```typescript
type CardHeaderLeading = {
  slot?: React.ReactNode;
};
```


