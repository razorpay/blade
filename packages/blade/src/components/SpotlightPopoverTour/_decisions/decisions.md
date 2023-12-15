# SpotlightPopover API Decisions <!-- omit in toc -->

The SpotlightPopover component is used to provide context as well as enable users to take certain actions on it. These are used to highlight a new feature or provide a guided tour to a new user.

<img src="./assets/tour-thumbnail.png" width="380" alt="Tooltip Thumbnail" />

- [Design](#design)
- [Features](#features)
- [Components](#components)
- [Basic Usage Structure](#basic-usage-structure)
- [API](#api)
  - [`SpotlightPopover` API](#tour-api)
  - [`SpotlightPopoverStep` API](#tourstep-api)
  - [`SpotlightPopoverFooter` API](#tourfooter-api)
- [Usage](#usage)
- [Motion](#motion)
- [Open Questions And Technical Challenges](#open-questions-and-technical-challenges)
- [React Native Specifics](#react-native-specifics)
- [Multiple SpotlightPopover Flows](#multiple-tour-flows)
  - [Approach-1: Prefix `id` to avoid conflicts](#approach-1-prefix-id-to-avoid-conflicts)
  - [Approach-2: Use `SpotlightPopoverStep` to avoid conflicts](#approach-2-use-tourstep-to-avoid-conflicts)
  - [Technical Challenge in React Native](#technical-challenge-in-react-native)
- [API Design Challenges](#api-design-challenges)
  - [Approach: Let Consumer Compose `Popover`](#approach-let-consumer-compose-popover)
    - [**1. Not possible to collocate the tour flows.**](#1-not-possible-to-collocate-the-tour-flows)
    - [**2. How will we have two different tour flows in the same page?**](#2-how-will-we-have-two-different-tour-flows-in-the-same-page)
    - [3. Segmentation / Lack of control](#3-segmentation--lack-of-control)
    - [4. Not possible to maintain a consistent API / Implementation between web \& native](#4-not-possible-to-maintain-a-consistent-api--implementation-between-web--native)
    - [Conclusion](#conclusion)
- [MoMs](#moms)
- [References](#references)

## Design

[Figma Link](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=63871%3A13263&mode=dev) to all variants of the SpotlightPopover component

## Features

- [x] **SpotlightPopover:** A guided tour with multiple steps
- [x] **Masking:** Mask the rest of the page except the highlighted element.

## Components

- **SpotlightPopover:** A guided tour with multiple steps
- **SpotlightPopoverStep:** An enhancer component which is used to wrap the element that needs to be highlighted with an unique identifier.
- **SpotlightPopoverFooter:** An opt in component which you can use to compose footer which has predefined button placements with consistent spacing as defined in figma.

## Basic Usage Structure

With SpotlightPopover component, you can specify an array of steps with a `name` prop for each step, and then use the `SpotlightPopoverStep` component to wrap the element that needs to be highlighted with the same `name` prop.

The SpotlightPopover component internally handles everything for your

- Masking of the highlighted component
- Internal state management of `activeStep`
- Navigation between steps

> Check the full example on [Usage](#usage) section below

```jsx
const steps = [
  {
    name: 'step-1',
    title: 'Step 1',
    content: () => <Text>Some content for step 1</Text>,
    footer: (props) => <SpotlightPopoverFooter {...props} actions={{}} />,
  },
  // ...more steps
];

<SpotlightPopover steps={steps}>
  // ... more jsx
  <SpotlightPopoverStep name="step-1">
    <Box>I'll be highlighted</Box>
  </SpotlightPopoverStep>
</SpotlightPopover>;
```

## API

### `SpotlightPopover` API

The `SpotlightPopover` component is used to render a guided tour with multiple steps.
Each tour `step` will have a subset of props from the `Popover` component, with extra props for the tour related logic.

> Check the Popover API Decisions [here](https://github.com/razorpay/blade/blob/master/packages/blade/src/components/Popover/_decisions/decisions.md)

```jsx
// Step will have similar props as the Popover component, With extra SpotlightPopover related props.
type Step = {
  /**
   * Unique identifier for the tour step
   */
  name: string;
  /**
   * Content of the Popover
   */
  content: ({ gotToNext, goToPrev, stopTour, activeStep, totalSteps }) => React.ReactNode;
  /**
   * Footer content
   */
  footer?: ({ gotToNext, goToPrev, stopTour, activeStep, totalSteps }) => React.ReactNode;
  /**
   * Popover title
   */
  title?: string;
  /**
   * Leading content placed before the title
   *
   * Can be any blade icon or asset.
   */
  titleLeading?: React.ReactNode;
  /**
   * Placement of Popover
   * @default "top"
   */
  placement?: UseFloatingOptions['placement'];
}

type SpotlightPopoverProps = {
  /**
   * Array of steps to be rendered
   *
   * The order of the steps will be the order in which they are rendered depending on the `activeStep` prop
   */
  steps: Step[];
  /**
   * Whether the tour is visible or not
   */
  isOpen: boolean;
  /**
   * Callback when the tour is opened or closed
   */
  onOpenChange: ({ isOpen: boolean }) => void;
  /**
   * Callback which fires `stopTour` is called from `steps` render prop.
   */
  onFinish: () => void;
  /**
   * Callback when the active step changes
   */
  onStepChange?: (step: number) => void;
  /**
   * Active step to be rendered
   */
  activeStep: number;
}
```

### `SpotlightPopoverStep` API

SpotlightPopoverStep is an enhancer component which is used to wrap the element that needs to be highlighted with a specific unique identifier.

This component is needed because:

- in react-native there is no `id` prop or `getElementById` platform API.
- We don't expose `id` for every blade component, currently only Box does.

But to keep the API consistent between web & native, we will also expose this component for web.

> Note: on web, this component doesn't attach an `id` to the DOM element, instead it uses `ref` to collect the DOM element and save it to the state inside the `SpotlightPopover` component, See below [discussions](#react-native-specifics) to know more about this approach.

```jsx
type SpotlightPopoverStepProps = {
  /**
   * Unique identifier/name for the tour step
   *
   * This should be the same as the `name` prop of the element inside the `steps` array of the `SpotlightPopover` component
   */
  name: string
  /**
   * React children with a single child which exposes a ref
   */
  children: React.ReactNode;
};
```

Note that, in order for SpotlightPopoverStep to work properly it needs access to it's children ref, so the children should expose a ref.

### `SpotlightPopoverFooter` API

SpotlightPopoverFooter is an opt in component which you can use to compose footer which has predefined button placements with consistent spacing as defined in figma.

You can either use this (recommended) or compose your own footer component as per your product usecase.

It'll have similar API like Alert's `actions`, and will have subset of props from the `Button` component.

```jsx
type SpotlightPopoverFooterAction = {
  text?: string,
  variant?: 'primary' | 'secondary' | 'tertiary',
  icon?: IconComponent,
  iconPosition?: 'left' | 'right',
  isDisabled?: boolean,
  isLoading?: boolean,
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void,
};

type SpotlightPopoverFooterProps = {
  activeStep: number,
  totalSteps: number,
  actions: {
    primary?: SpotlightPopoverFooterAction,
    secondary?: SpotlightPopoverFooterAction,
  },
};
```

## Usage

```jsx
import { SpotlightPopover, SpotlightPopoverFooter } from '@razorpay/blade/components';
import type { SpotlightPopoverSteps } from '@razorpay/blade/components';

const Footer = ({ activeStep, totalSteps, goToNext, goToPrevious, stopTour }) => {
  const isLast = activeStep === totalSteps - 1;
  const isFirst = activeStep === 0;
  return (
    <SpotlightPopoverFooter
      activeStep={activeStep}
      totalSteps={totalSteps}
      actions={{
        primary: isLast ? { text: 'Done', onClick: stopTour } : { text: 'Next', onClick: goToNext },
        secondary: isFirst ? undefined : { text: 'Prev', onClick: goToPrevious },
      }}
    />
  );
};

const steps: SpotlightPopoverSteps = [
  {
    name: 'step-1',
    title: 'Step 1',
    content: ({ activeStep }) => <Text>Some content {activeStep}</Text>,
    footer: Footer,
  },
  {
    name: 'step-2',
    title: 'Step 2',
    content: ({ activeStep }) => <Text>Some content {activeStep}</Text>,
    footer: Footer,
  },
  {
    name: 'step-3',
    title: 'Step 3',
    content: ({ gotToNext, activeStep }) => (
      <Box>
        <Text>Some content {activeStep}</Text>
        <Button onClick={gotToNext}>Next</Button>
      </Box>
    ),
    footer: Footer,
  },
];

const App = () => {
  const [IsOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const handleOpenChange = ({ isOpen }) => {
    setIsOpen(isOpen);
    // reset the active step so if the user opens the tour again,
    // it starts from the first step
    setActiveStep(0);
  };

  const handleFinish = () => {
    // do something when the tour is finished
    // ie: send an analytic event
    // or: close the tour
    // or: reset the active step
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
    // do something with the step
    // ie: send an analytic event
  };

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Show SpotlightPopover</Button>
      <SpotlightPopover
        steps={steps}
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        onFinish={handleFinish}
        onStepChange={handleStepChange}
        activeStep={activeStep}
      >
        <DashboardPage />
      </SpotlightPopover>
    </Box>
  );
};

// In some other file: DashboardPage.tsx
const DashboardPage = () => {
  return (
    <Box>
      <SpotlightPopoverStep name="step-1">
        <Button>Click me</Button>
      </SpotlightPopoverStep>

      <Box>
        <SpotlightPopoverStep name="step-2">
          <Text>Some content</Text>
        </SpotlightPopoverStep>
      </Box>

      <Card>
        <CardBody>
          <SpotlightPopoverStep name="step-3">
            <Box>
              <Text>Some content</Text>
              <Text>Some content</Text>
              <Text>Some content</Text>
            </Box>
          </SpotlightPopoverStep>
        </CardBody>
      </Card>
    </Box>
  );
};
```

## Motion

Check/Provide feedback for the motion for SpotlightPopover component [here](https://razorpay.slack.com/archives/C0274H7QRC1/p1697520879941439)

https://github.com/razorpay/blade/assets/35374649/5830c059-fbd6-461e-915c-e3a98e930735

---

---

> NOTE: The below sections are discussions, decisions & challenges we faced while designing the API for the `SpotlightPopover` component.
> If you are interested in diving deeper into the rabbit hole, you can read the below sections, or else you can skip them.

## Open Questions And Technical Challenges

## React Native Specifics

On react-native there is 2 differences in the API compared to web:

1. `SpotlightPopoverStep` component is needed.
2. `SpotlightPopover` component needs to wrap the whole app

**1. `SpotlightPopoverStep` Component is needed:**

As highlighted earlier in the [API](#api) section, the `SpotlightPopoverStep` component is a `react-native` only enhancer component, which is used to wrap the element that needs to be highlighted with a specific unique identifier.

Another thing to note is that, the wrapped component needs to expose it's `ref` so that the `SpotlightPopoverStep` component can collect the `ref` and save it to the state inside the `SpotlightPopover` component.

The usage example will look something like this:

```jsx
// ... SpotlightPopover related components (their API stay mostly the same)

// In some other file: DashboardPage.tsx
const DashboardPage = () => {
  return (
    <Box>
      <SpotlightPopoverStep id="step-1">
        <Button>Click me</Button>
      </SpotlightPopoverStep>
      <Box>
        <SpotlightPopoverStep id="step-2">
          <Box padding="spacing.5">
            <Text>Some content</Text>
          </Box>
        </SpotlightPopoverStep>
      </Box>

      <Card>
        <CardBody>
          <SpotlightPopoverStep id="step-3">
            <Box id="step-3">
              <Text>Some content</Text>
              <Text>Some content</Text>
              <Text>Some content</Text>
            </Box>
          </SpotlightPopoverStep>
        </CardBody>
      </Card>
    </Box>
  );
};
```

This component is needed because in react-native there is no `id` prop or `getElementById` platform API like web which can be used to simply query the element and highlight it.

Now the open question is:

1. Should we have this API difference between web & native?

**A few points to consider:**

- This is absolutely needed on `react-native`
- Technically we can also expose this component for `web` too and make the API surface same, although it will largely be useless because on web we can simply use the `id` prop to query the element and highlight it.

The `web` implementation will look like this:

```jsx
const SpotlightPopoverStep = ({ id, children }) => {
  return React.cloneElement(child, { id });
};
```

There's also a downside to this approach on web:

- Imagine if consumer wraps the `SpotlightPopoverStep` with an `id` to a component which doesn't even accept the `id` prop, consumer won't get any type errors and `id` won't get passed to the DOM.

```jsx
// No type error :( this is a footgun for consumers
<SpotlightPopoverStep id="step-1">
  <ThisComponentDoesntAccceptIdProp />
</SpotlightPopoverStep>

// Proper type error :)
<ThisComponentDoesntAccceptIdProp id="step-1" />
// ^ Property 'id' does not exist on type
```

**Conclusion:**

After discussing about the API differences between RN & Web,

Kamlesh suggested few ways to directly use the `ref` and letting consumer attach the ref to the components, but that had few issues concerning complexity & overhead for consumers.

And on the web, there was a problem that even though simply adding `id` could work, not all our components had `id` prop. That means consumers will have to wrap everything with a `Box`.

- We decided **not** to go with the `id` approach on web, and instead go with the same implementation as the [react-native POC](https://github.com/razorpay/blade/compare/master...anu/tour-rn-poc#diff-4fe985a90d9ce955346ffc61e152a98272f4d02e044111d30241eb63c8fcf1b1R168-R183), where we keep track of refs of the elements via the `SpotlightPopoverStep` component.
  - Pros:
    - API is now same on both RN & Web
    - No need to wrap everything with Box, consumers can use the SpotlightPopoverStep enhancer component.
    - Simplified implementation, since now we don't need to maintain two types of implementation 1 for native (with refs) 1 for web (with ids).

**2. SpotlightPopover needs to wrap the whole app:**

The `SpotlightPopover` component needs to wrap the whole app, because the `SpotlightPopoverStep` needs to collect the `ref` of the element that needs to be highlighted and save it to the state inside the `SpotlightPopover` component.

Check the POC implementation that we did for react-native [here](https://github.com/razorpay/blade/compare/master...anu/tour-rn-poc#diff-4fe985a90d9ce955346ffc61e152a98272f4d02e044111d30241eb63c8fcf1b1R168-R183)

**Conclusion:**

- Now that we decided to go with the `SpotlightPopoverStep` approach on both web & native, we will have to wrap the whole app with the `SpotlightPopover` component on both web & native.

## Multiple SpotlightPopover Flows

In a given product, there can be multiple tour flows, for example:

- Global app level tour (A tour for the whole app, sidebar, search, header etc)
- And another for example: PaymentLinks page.

Now, the open question is:

1. How will we have two different tour flows in the same page?

This is possible with the current API, but consumers will have to prefix their `id` props manually to avoid conflicts.

### Approach-1: Prefix `id` to avoid conflicts

It will look like this:

```jsx

import { SpotlightPopover } from '@razorpay/blade/components';
import type { SpotlightPopoverSteps } from '@razorpay/blade/components';

const globalSteps: SpotlightPopoverSteps = [
  {
    id: 'global-step-1',
    title: 'Step 1',
    content: // ...
  },
  {
    id: 'step-2',
    title: 'Step 2',
    content: // ...
  },
];

const paymentLinkSteps: SpotlightPopoverSteps = [
  {
    id: 'paymentlink-step-1',
    title: 'Step 1',
    content: // ...
  },
  {
    id: 'paymentlink-step-2',
    title: 'Step 2',
    content: // ...
  },
];

const App = () => {
  return (
    <Box>
      <SpotlightPopover
        steps={globalSteps}
      />
       <SpotlightPopover
        steps={paymentLinksSteps}
      />
    </Box>
  );
};

// file: DashboardPage.tsx
const DashboardPage = () => {
  return (
    <Box>
      <Button id="global-step-1">Click me</Button>
      <Box id="global-step-2" padding="spacing.5">
        <Text>Some content</Text>
      </Box>
    </Box>
  );
};

// file: PaymentLinks.tsx
const PaymentLinksPage = () => {
  return (
    <Box>
      <Button id="paymentlink-step-1">Click me</Button>
      <Box id="paymentlink-step-2" padding="spacing.5">
        <Text>Some content</Text>
      </Box>
    </Box>
  );
};
```

### Approach-2: Use `SpotlightPopoverStep` to avoid conflicts

Now with this approach the `SpotlightPopoverStep` component becomes a bit more useful on web too.

What we can do is add a key prop to the `SpotlightPopoverStep` component, and use that key to automatically prefix the `id` prop.

[rn-tourguide](https://github.com/xcarpentier/rn-tourguide?tab=readme-ov-file#using-multiple-tours) uses a similar approach.

```jsx
// No need to prefix the ids manually in steps array.

<SpotlightPopover tourKey="global" steps={globalSteps} />;
<SpotlightPopover tourKey="paymentlinks" steps={paymentLinksSteps} />;

// file: DashboardPage.tsx
<SpotlightPopoverStep tourKey="global" id="step-1">
  <Button>Click me</Button>
</SpotlightPopoverStep>;

// file: PaymentLinks.tsx
<SpotlightPopoverStep tourKey="paymentlinks" id="step-1">
  <Button>Click me</Button>
</SpotlightPopoverStep>;
```

### Technical Challenge in React Native

As mentioned earlier in the [React Native Specifics](#react-native-specifics) section, the `SpotlightPopover` component needs to wrap the whole app. But this means that we can't have multiple `SpotlightPopover` components in the same page because they will need to nest each other and the React.Context will only get the value from the nearest provider ([demo](https://codesandbox.io/s/multiple-react-context-nf7qjv?file=/src/App.tsx)).

```jsx
<SpotlightPopover tourKey="global">
  <SpotlightPopover tourKey="payments">
    <Example1 /> // this will get all the states from the `payments` tour
    <Example2 /> // this will also get all the states from the `payments` tour
  </SpotlightPopover>
</SpotlightPopover>
```

Trying to solve this will create a complexities, and will make the API more complex.

[rn-tourguide](https://github.com/xcarpentier/rn-tourguide/blob/master/src/hooks/useSpotlightPopoverGuideController.tsx) solves this by using custom event emitters and pushes events for each `tourKey` instead of relying solely on `React.Context`

**Conclusion:**

Given the complexity of solving this, we decided that:

- Consumers can wrap the `<SpotlightPopover />` component closer to the module they need the tour for, instead of wrapping the whole `App` in a single tour. And we will also document this on the storybook.
- There may not be that many cases for multiple tour flows in the same page

## API Design Challenges

> You can skip this section if you are not interested in the API design challenges we faced.
> This is just for the blade team's future reference.

Initially we discussed if we can let consumers use the existing `Popover` to compose the own `SpotlightPopover` component / flows.

### Approach: Let Consumer Compose `Popover`

We did a [POC](https://codesandbox.io/s/popover-guided-tour-g2r8hw) for web, and discussed if letting consumers compose their own tour flows with the `Popover` component can be a viable solution.

But, after thinking it through, We found it has a few major downsides:

1. Not possible to collocate the tour flows.
2. How will we have two different tour flows in the same page?
3. Segmentation / Lack of control
4. Not possible to maintain a consistent API between web & native

#### **1. Not possible to collocate the tour flows.**

The tour flow & the popover's content for each flow will not always be in the same JSX tree nor will it be in the same file. This makes it hard to maintain and reason about the whole tour flow.

For example, just taking an example of this [SpotlightPopover flow in Dashboard](https://github.com/razorpay/dashboard/blob/44a954660b0d851cd5fedf48b44d85731e5c48ea/web/js/merchantLA/containers/MerchantSpotlightPopover/index.js):

The content of the popover is in separate files:

- [dashboard/web/js/merchant/containers/Home
  /Desktop.js](https://github.com/razorpay/dashboard/blob/44a954660b0d851cd5fedf48b44d85731e5c48ea/web/js/merchant/containers/Home/Desktop.js#L789)
- [dashboard/web/js/merchant/containers/Home/KeyMetrics
  /Panel.js](https://github.com/razorpay/dashboard/blob/44a954660b0d851cd5fedf48b44d85731e5c48ea/web/js/merchant/containers/Home/KeyMetrics/Panel.js#L393)
- [dashboard/web/js/merchant/containers/Home/Traffic
  /index.js](https://github.com/razorpay/dashboard/blob/44a954660b0d851cd5fedf48b44d85731e5c48ea/web/js/merchant/containers/Home/Traffic/index.js#L328)
- [dashboard/web/js/merchant/components/HeaderNav
  /index.js](https://github.com/razorpay/dashboard/blob/44a954660b0d851cd5fedf48b44d85731e5c48ea/web/js/merchant/components/HeaderNav/index.js#L295)
- **4 more files....... 🤯**

Now imagine adding this much code in the middle of these files to make the tour flow work:

```jsx
<Popover
  title="SpotlightPopover title"
  placement="bottom"
  // this is the first step in the tour flow
  isOpen={activeStep == 0}
  onOpenChange={handleClose}
  content={<Text>Hello World</Text>}
  footer={
    <SpotlightPopoverFooter
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      totalSteps={domNodes.current.length}
    />
  }
>
  <SomRandomeDashboardDiv
    ref={(ref) => {
      // this is the first step in the tour flow
      domNodes.current[0] = ref as HTMLElement;
    }}
  >
    ..... lots of jsx ....
  </SomeRandomDashboardDiv>
</Popover>
```

And not just adding the JSX, the consumer will also have to ensure that:

- The `activeStep === 0` logic is properly set and manually maintain the "which step count is this jsx for?" logic in different different files.
- The `domNodes` array is updated with the correct ref for each step, with the correct **index** (domNodes.current[0])
- Consumers will have to manually maintain the `totalSteps` count for the tour flow, they will have no idea how many steps are there in the tour flow, they will have to manually count the steps and update the `totalSteps` prop in the `SpotlightPopoverFooter` component.

This is a lot of code to add in the middle of the existing codebase, and it will be extremely hard to maintain and reason about the whole tour flow.
And this is not something a product engineer should be maintaining or worry about.

#### **2. How will we have two different tour flows in the same page?**

Let's say we have two flows in a page

- Global app level tour (A tour for the whole app, sidebar, search, header etc)
- And another for say, PaymentLinks page.

To have two different tours, the consumer will have to maintain states for `activeStep` and `domNodes` and `totalSteps` for each tour flow.

```jsx
// In AppRoot.tsx
const [appSpotlightPopoverActiveState, setAppSpotlightPopoverActiveState] = useState(0);
const [appSpotlightPopoverDomNodes, setAppSpotlightPopoverDomNodes] = useState([]);
const [appSpotlightPopoverTotalSteps, setAppSpotlightPopoverTotalSteps] = useState(0);
const [appSpotlightPopoverMask, setAppSpotlightPopoverMask] = useState({ x, y, w, h });

// In PaymentLinks.tsx
const [paymentSpotlightPopoverActiveState, setPaymentSpotlightPopoverActiveState] = useState(0);
const [paymentSpotlightPopoverDomNodes, setPaymentSpotlightPopoverDomNodes] = useState([]);
const [paymentSpotlightPopoverTotalSteps, setPaymentSpotlightPopoverTotalSteps] = useState(0);
const [paymentSpotlightPopoverMask, setpaymentSpotlightPopoverMask] = useState({ x, y, w, h });
```

This will get extremely messy and tedious to maintain.

Not just maintaining the state,

- Consumer will have to ensure to pass correct state / props to the `Popover` component which are spread across different files.

#### 3. Segmentation / Lack of control

Now, let's say in design, we made some changes to the `SpotlightPopover` how will we backport those changes in the consumer's codebase?

We will have to ask consumers to modify their code to use the new design, which is not ideal and will lead to further segmentation of the design system.

#### 4. Not possible to maintain a consistent API / Implementation between web & native

Finally, react-native projects will have to have a vastly different API for their tour flows.

We did a [POC for react-native](https://github.com/razorpay/blade/compare/master...anu/tour-rn-poc#diff-4fe985a90d9ce955346ffc61e152a98272f4d02e044111d30241eb63c8fcf1b1R332-R401) to see if it's possible to compose the existing `Popover` component to create a tour flow, but turns out there are a lot of challenges in doing so.

- While on [web](https://codesandbox.io/s/popover-guided-tour-g2r8hw) it was still possible to chain multiple `Popover` components to create a tour flow, on react-native it's not possible because on RN iOS it's not possible to have [multiple `Modal`](https://github.com/react-native-modal/react-native-modal/issues/30) components open at the same time.
- Consumers will have to take a different approach to get the Mask working on react-native, because there is no `id` prop or `getElementById` platform API like web which can be used to simply query the element and highlight it.

#### Conclusion

Now with all the above points, We decided that it's better if we expose a `SpotlightPopover` component which will maintain the state/logic/steps/flows for consumers with a clean and simple API.

This will also mean we can maintain an optimal consistency between web & native API. Otherwise consumers will have vastly different abstraction for web & native.

## MoMs

**SpotlightPopover Component MoM**
**Participants:** @Anurag Hazra @kamlesh @chaitanya @Saurabh
**Date:** 6th Nov, 2023

**Discussion Points**

1. Letting consumers compose their own tour flows - Giving context to kamlesh
2. API difference between web & native
3. ReactNative Implementation challenges
4. Challenges with supporting multiple tour flows
5. SpotlightPopover footer component flexibility discussion
6. Discussed about scoping out few things

**1. Letting consumers compose their own tour flows - Giving context to kamlesh**

Gave context to kamlesh on the discussion that me, abinash, chaitanya & saurabh already did on the challenges & issues with letting consumers compose Popover to create flows.

**2. API difference between web & native**

Discussed about the API differences between RN & Web (Check the API Doc for more info)
On react-native we cannot have id so we approached a ref based solution which meant we needed to expose a react-native specific component SpotlightPopoverStep to consumers so we can keep track of ids & refs.

Kamlesh suggested few ways to directly use the ref and letting consumer attach the ref to the components, but that had few issues concerning complexity & overhead for consumers.

Even on the web, there was a problem that even though simply adding id could work, not all our components had id prop. That means consumers will have to wrap everything with a Box.

**Conclusion:**

- We decided to not go with the id approach and instead go with the same implementation as the react-native POC, where we keep track of refs of the elements via the SpotlightPopoverStep component.

**Pros:**

- API is now same on both RN & Web
- No need to wrap everything with Box, consumers can use the SpotlightPopoverStep enhancer component.
- Simplified implementation, since now we don't need to maintain two types of implementation 1 for native (with refs) 1 for web (with ids).

**3. ReactNative Implementation challenges**

Discussed few ReactNative specific challenges:

- iOS not having support for [multiple modals](https://github.com/react-native-modal/react-native-modal/issues/30) thus consumers can't compose popovers
- Can't use `id` on RN, even if we add a custom prop there is no way to query react-native elements like we do in web via `document.getElementById`

**4. Challenges with supporting multiple tour flows**

Discussed issues multiple tour flows:

Gave some context on the issues with multiple tour flows, and now that even on web we are going ahead with SpotlightPopoverStep component this will also be an issue on web also, so simply prefixing the id with some string wont work.

Discussed the issues with React context API.

**Conclusion:**

- Consumers can wrap the `<SpotlightPopover />` component closer to the module they need the tour for, instead of wrapping the whole App in a single tour. And we will also document this on the storybook.
- There may not be that many cases for multiple tour flows in the same page

**5. SpotlightPopover footer component flexibility discussion**

Discussed about if we should make the Footer a prop based more rigid API or keep it as JSX which will be more flexible.

Also discussed how will we pass the necessary states or functions like activeStep, totalSteps, goToNext to the Footer / Content components.

**Conclusion:**

- Decided that it's best if we keep it as flexible, since even on design there are many variants and combinations of buttons which can be a bit tricky to do with a more rigid prop based API

**6. Discussed about scoping out few things**

Also discussed if we can cut scope for now, since I'm going OOO from 11th, it won't be possible to finish both web & native, reviews, re-iteration, tests, storybook, docs etc.

**Conclusion:**

- We are scoping out RN implementation for now
- We will try to be a bit proactive and do early reviews of web implementation and see if we can atleast finalise major things before Friday.

## References

Our POCs:

- [SpotlightPopover Web POC](https://github.com/razorpay/blade/compare/master...anu/tour-poc#diff-4fe985a90d9ce955346ffc61e152a98272f4d02e044111d30241eb63c8fcf1b1R198)
- [SpotlightPopover RN POC](https://github.com/razorpay/blade/compare/master...anu/tour-rn-poc#diff-4fe985a90d9ce955346ffc61e152a98272f4d02e044111d30241eb63c8fcf1b1R203)

References:

- Dashboard's [SpotlightPopover](https://github.com/razorpay/dashboard/blob/44a954660b0d851cd5fedf48b44d85731e5c48ea/web/js/merchantLA/containers/MerchantSpotlightPopover/index.js) component
- https://github.com/stackbuilders/react-native-spotlight-tour
- https://github.com/elrumordelaluz/reactour
- https://github.com/xcarpentier/rn-tourguide
