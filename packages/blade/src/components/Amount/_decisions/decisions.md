# Amount <!-- omit in toc -->

Amount component is a UI element that displays and formats various currency values in a specified format.

<img  src="./amount-thumbnail.png"  width="380" />

## Design

- [Figma - Amount](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=28012%3A580578&t=3peAz8A2n2Gw4WMl-1)

## API

| Prop          | Type                                                                                           | Default           | Description                                                                                                                                                                                         | Required |
| ------------- | ---------------------------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| value         | `number`                                                                                       | `undefined`       | The value to be rendered within the component                                                                                                                                                       | ✅       |
| intent        | `positive`, `negative`, `notice`, `information` ,`neutral`                                     | `undefined`       | The intent of the amount to be rendered                                                                                                                                                             |
| prefix        | `currency-symbol`, `currency-code`                                                             | `currency-symbol` | The type of prefix to be shown                                                                                                                                                                      |          |
| suffix        | `none`, `decimals` , `humanize`                                                                | `decimals`        | The type of suffix to be displayed with the currency value, (none, decimals, and humanize) that respectively indicate no suffix, the number of decimal places, and the scale of the currency value. |          |
| size          | `title-medium`, `title-small`, `heading-large` , `heading-small`, `body-medium` , `body-small` | `heading-small`   | The size of the amount to be rendered in sync with the title heading and body sizes                                                                                                                 |          |
| isAffixSubtle | `true`, `false`                                                                                | `true`            | Makes the prefix symbol and decimal digits small and faded                                                                                                                                          |          |

### Sample Usage

```jsx
import { Amount } from '@razorpay/components';

<Amount
  suffix="decimals"
  size="title-medium"
  isAffixSubtle={true}
  intent="information"
  prefix="currency-symbol"
  value={1000}
/>;
```

## Open Questions

#### Dev

- ~~Should we call it `variant` or `intent`, `isStyled` or something more apt?~~
- ~~Should we separate the amount with commas based on the Indian currency format?~~
- ~~What should be the default `intent`? Kept it as `default` for now, but `neutral` seems more apt.~~
- ~~We currently use amount value in paise in backend, so how should we convert it to rupee here?~~
- ~~We currently use amount value in paise in backend, so how should we convert it to rupee here?~~
- ~~How do we sync the sizes with the different typography~~
- ~~Scope of A11y?~~

#### Design

- ~~Do we need to support more currency types?~~

## Discussions

### Do we need to support more currency types?

- We concluded to have 'INR' as a primary currency for now, and enable other currencies in further versions.

### How do we sync the sizes with the different typography?

- After consideration we finalized to use this format variant-fontSize-fontWeight. This will make sure that we are in sync with different typography and not come under impossible states.

### Should we call `isSuffixPrefixHighlighted` or `isHighlighted` or `isAffixSubtle`, considering when this value is true the value will be highligted and not the affix.

- After careful consideration, we decided to name this property `isAffixSubtle`. This decision was reached based on the fact that the property controls the behavior of the affix, which in turn affects the visual appearance of the prefix and decimal digits. By setting this property to 'true', the affix will appear smaller and more faded.

### Should we have a seperate prop for decimals and another for affix symbols?

- We initially considered using two different props, but then realized that only one of them would be shown at a time. So in that case, we decided to use a single prop called 'suffix'. We ultimately settled on using a prop with three possible values: 'none', 'decimals', and 'humanize'.

### Should we call `weight` or `fontWeight`?

- We decided to call it `weight` as this represents the weight of the amount component with the affix changing accordingly. This also follows the same convention as other components.
- Eventually we removed this prop as size prop will give weight too

### Should we separate the amount with commas based on the Indian currency format?

- For now, we will be supporting only INR. Going forward we will add more currencies. One of the major problems right now is we use ₹ and INR interchangeably. But in Malaysia we only have RM and there is no symbol associated with it. Hence we are staying away from this. Will solve this once the use-case arrives.

### Scope of A11y?

- Accessibility considerations for a currency component would include assigning it the role of text, and using an aria-label attribute with a value such as 'Total value in INR: ₹1,23,456' to provide a label for the component.

## References

- [Ant](https://ant.design/components/input)
- [Primeng](https://primeng.org/inputnumber)
- [Backbase](https://designsystem.backbase.com/v1/components/amount/web)
- [Mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [Salesforce](https://developer.salesforce.com/docs/component-library/bundle/ui:inputCurrency)
- [Dribbble](https://dribbble.com/tags/money_components)
- [Pega](https://design.pega.com/design/currency/)
