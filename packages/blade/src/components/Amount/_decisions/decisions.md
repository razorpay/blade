# Amount <!-- omit in toc -->

Amount component is a UI element that displays and formats various currency values in a specified format.

<img  src="./amount-thumbnail.png"  width="380" />

## Design

- [Figma - Amount](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=28012%3A580578&t=3peAz8A2n2Gw4WMl-1)

## API

| Prop                | Type                                                       | Default     | Description                                                                    | Required |
| ------------------- | ---------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------ | -------- |
| children            | `number`                                                   | `undefined` | The value to be rendered within the component                                  | ✅       |
| variant             | `positive`, `negative`, `notice`, `information`, `blue`    | `undefined` | The variant of the amount to be rendered                                       |          |
| contrast            | `low`, `high`                                              | `low`       | The contrast of the amount to be rendered                                      |          |
| fontWeight          | `bold`, `regular`                                          | `bold`      | The weight of the amount to be rendered                                        |          |
| hasDecimals         | `true`, `false`                                            | `true`      | Indicates whether the amount has or can have decimals                          |          |
| showCurrencySuffix  | `true`, `false`                                            | `false`     | Indicates whether a text suffix should be used                                 |          |
| size                | `3xlarge`, `2xlarge`, `xlarge`, `large`, `medium`, `small` | `3xlarge`   | The size of the amount to be rendered                                          |          |
| isAmountHighlighted | `true`, `false`                                            | `true`      | Highlight the main amount by making the prefix symbol and decimal digits small |          |

### Sample Usage

```jsx
import { Amount } from '@razorpay/components';

<Amount
  size="2xlarge"
  isAmountHighlighted={true}
  fontWeight="regular"
  hasDecimals={true}
  showCurrencySuffix={false}
  variant="information"
  contrast="high"
>
  1000.27
</Amount>;
```

## Open Questions

#### Dev

- Should we call it `variant` or `intent`, `isStyled` or something more apt?
- Should we separate the amount with commas based on the Indian currency format?
- What should be the default `intent`? Kept it as `default` for now, but `neutral` seems more apt.
- We currently use amount value in paise in backend, so how should we convert it to rupee here?
- Scope of A11y?

#### Design

- Do we need to support more currency types?

## Discussions

### Should we separate the amount with commas based on the Indian currency format?

- For now, we will be supporting only INR. Going forward we will add more currencies. One of the major problems right now is we use ₹ and INR interchangeably. But in Malaysia we only have RM and there is no symbol associated with it. Hence we are staying away from this. Will solve this once the use-case arrives.

## References

- [Ant](https://ant.design/components/input)
- [Primeng](https://primeng.org/inputnumber)
- [Blueprint](https://blueprintjs.com/docs/#core/components/file-input)
- [Backbase](https://designsystem.backbase.com/v1/components/amount/web)
- [Mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [Salesforce](https://developer.salesforce.com/docs/component-library/bundle/ui:inputCurrency)
- [Dribbble](https://dribbble.com/tags/money_components)
- [Pega](https://design.pega.com/design/currency/)
