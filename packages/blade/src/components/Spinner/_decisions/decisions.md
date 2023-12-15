# Spinner <!-- omit in toc -->

A spinner is an element with a looping animation that indicates loading is in process.

<img src="./spinner-thumbnail.png" width="150" />

## Design

- [Figma - Spinner](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=14825%3A203592)

## BaseSpinner

A BaseSpinner will contain some extra props like `intent`. This will not be exposed to the consumer and will only be used for internal components.

### API

| Prop               | Type                                                      | Default     | Description                                           | Required |
| ------------------ | --------------------------------------------------------- | ----------- | ----------------------------------------------------- | -------- |
| accessibilityLabel | `string`                                                  | `undefined` | The accessibility label (aria-label) for the spinner. | ✅       |
| intent             | `positive`,`negative`, `notice`, `information`, `neutral` | `undefined` | The intent of the spinner to be rendered.             |          |
| contrast           | `low`, `high`                                             | `low`       | The contrast of the spinner to be rendered.           |          |
| size               | `small`, `medium`, `large`                                | `medium`    | The size of the spinner to be rendered.               |          |
| label              | `string`                                                  | `undefined` | The label of the spinner to be rendered.              |          |
| labelPosition      | `right`, `bottom`                                         | `right`     | The position of the rendered label.                   |          |

## Spinner

A wrapper around Spinner which will be exposed to the consumer to be used as a Spinner. This component will not allow passing `intent` to the Spinner.

### API

| Prop               | Type                       | Default     | Description                                           | Required |
| ------------------ | -------------------------- | ----------- | ----------------------------------------------------- | -------- |
| accessibilityLabel | `string`                   | `"Loading"` | The accessibility label (aria-label) for the spinner. |
| contrast           | `low`, `high`              | `low`       | The contrast of the spinner to be rendered.           |          |
| size               | `small`, `medium`, `large` | `medium`    | The size of the spinner to be rendered.               |          |
| label              | `string`                   | `undefined` | The label of the spinner to be rendered.              |          |
| labelPosition      | `right`, `bottom`          | `right`     | The position of the rendered label.                   |          |

### Sample Usage

```jsx
import { Spinner } from '@razorpay/components';

<Spinner contrast="high" size="large" accessibilityLabel="Loading" />;
```

### Accessibility

- We'll accept a prop `accessibilityLabel` which will be passed on as `aria-label` for web & `accessibilityLabel` for native to aide screen readers
- By default the value of `accessibilityLabel` will be `Loading` and can be overwritten with something more meaningful by the consumer
- We will also set `aria-live` as `assertive` to inform a user with a screen-reader that something is loading

## Open Questions

- ~Should we set `aria-role` as `alert` for accessibility? [Carbon DS](https://carbondesignsystem.com/components/loading/accessibility#how-it-works) does this as well.~ We'll be setting the `aria-role` as `progressbar`

## References

- [Reshaped](https://reshaped.so/content/docs/components/loader)
- [Polaris](https://polaris.shopify.com/components/spinner)
- [Chakra](https://chakra-ui.com/docs/components/spinner/usage/)
- [Maltine](https://mantine.dev/core/loader/)
- [Primer](https://primer.style/react/Spinner)
- [Carbon](https://carbondesignsystem.com/components/loading/usage/)
- [Atlassian](https://atlassian.design/components/spinner)
