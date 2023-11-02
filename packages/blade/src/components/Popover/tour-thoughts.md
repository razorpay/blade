## Composition API

Giving consumers this [POC](https://codesandbox.io/s/popover-guided-tour-g2r8hw) and letting them compose their own Tour flows with the blade popover on the surface seems like a good idea, though it has few major drawbacks:

### **Not possible to collocate the tour flows.**

The tour flow & the popover's content for each flow will not always be in the same JSX tree nor will it be in the same file. This makes it hard to maintain and reason about the whole tour flow.

For example, just taking an example of this [Tour flow in Dashboard](https://github.com/razorpay/dashboard/blob/44a954660b0d851cd5fedf48b44d85731e5c48ea/web/js/merchantLA/containers/MerchantTour/index.js):

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
  title="Tour title"
  placement="bottom"
  // this is the first step in the tour flow
  isOpen={activeStep == 0}
  onOpenChange={handleClose}
  content={<Text>Hello World</Text>}
  footer={
    <TourFooter
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
- Consumers will have to manually maintain the `totalSteps` count for the tour flow, they will have no idea how many steps are there in the tour flow, they will have to manually count the steps and update the `totalSteps` prop in the `TourFooter` component.

### **How will we have two different tour flows in the same page?**

Let's say we have two flows in a page

- Global app level tour (A tour for the whole app, sidebar, search, header etc)
- And another for say, PaymentLinks page.

To have two different tours, the consumer will have to maintain states for `activeStep` and `domNodes` and `totalSteps` for each tour flow.

```jsx
// In AppRoot.tsx
const [appTourActiveState, setAppTourActiveState] = useState(0);
const [appTourDomNodes, setAppTourDomNodes] = useState([]);
const [appTourTotalSteps, setAppTourTotalSteps] = useState(0);
const [appTourMask, setAppTourMask] = useState({ x, y, w, h });

// In PaymentLinks.tsx
const [paymentTourActiveState, setPaymentTourActiveState] = useState(0);
const [paymentTourDomNodes, setPaymentTourDomNodes] = useState([]);
const [paymentTourTotalSteps, setPaymentTourTotalSteps] = useState(0);
const [paymentTourMask, setpaymentTourMask] = useState({ x, y, w, h });
```

This will get extremely messy and tedious to maintain.

Not just maintaining the state, 

- Consumer will have to ensure to pass correct state / props to the `Popover` component which are spread across different files.


### Segmentation / Lack of control

Now, let's say in design, we made some design changes to the SpotlightPopover how will we backport those changes in the consumer's codebase? 

We will have to ask consumers to modify their code to use the new design, which is not ideal and lead to further segmentation of the design system.


### Conclusion

Now with all the above points, I think it's better if we think of exposing a Tour component which will maintain the state/logic/steps/flows for consumers with a clean API. 

Something similar to [`react/tour`](https://reactour.vercel.app/tour) API.

This will also mean we can maintain a consistency between web & native API. Otherwise consumers will have vastly different abstraction for web & native. 
