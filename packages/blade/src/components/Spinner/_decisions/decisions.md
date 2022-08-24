# Spinner <!-- omit in toc -->
A spinner is an element with a looping animation that indicates loading is in process.

<img src="./spinner-thumbnail.png" width="150" />

## Design
- [Figma - Spinner](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=14825%3A203592)


## BaseSpinner
A BaseSpinner will contain some extra props like `intent`. This will not be exposed to the consumer and will only be used for internal components.

### API

| Prop | Type | Default | Description | Required |
|---|---|---|---|---|
| intent | `positive`,`negative`, `notice`, `information`, `neutral` | `neutral` | The intent of the spinner to be rendered. |  |
| contrast | `low`, `high` | `low` | The contrast of the spinner to be rendered. |  |
| size | `small`, `medium`, `large` | `medium` | The size of the spinner to be rendered. |  |
| accessibilityLabel | `string` | `undefined` | The accessibility label (aria-label) for the spinner. |


## Spinner
A wrapper around Spinner which will be exposed to the consumer to be used as a Spinner. This component will not allow passing `intent` to the Spinner.

### API

| Prop | Type | Default | Description | Required |
|---|---|---|---|---|
| contrast | `low`, `high` | `low` | The contrast of the spinner to be rendered. |  |
| size | `small`, `medium`, `large` | `medium` | The size of the spinner to be rendered. |  |
| accessibilityLabel | `string` | `undefined` | The accessibility label (aria-label) for the spinner. |

### Sample Usage
```jsx
import { Spinner } from '@razorpay/components';

<Spinner
  contrast='high'
  size='large' 
  accessibilityLabel='Loading'
/>
```

## References
- [Reshaped](https://reshaped.so/content/docs/components/loader)
- [Polaris](https://polaris.shopify.com/components/spinner)
- [Chakra](https://chakra-ui.com/docs/components/spinner/usage/)
- [Maltine](https://mantine.dev/core/loader/)
- [Primer](https://primer.style/react/Spinner)
- [Carbon](https://carbondesignsystem.com/components/loading/usage/)
- [Atlassian](https://atlassian.design/components/spinner)