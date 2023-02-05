# Amount <!-- omit in toc -->

A amount component is a UI element that displays and formal various currency values in a specified format.

<img  src="./amount-thumbnail.png"  width="380" />

## Design

- [Figma - Amount](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=28012%3A580578&t=3peAz8A2n2Gw4WMl-1)

## API

| Prop | Type | Default | Description | Required |

|---|---|---|---|---|

| children | `string` | `undefined` | The label to be rendered within the badge. | ✅ |

| intent | `default`, `positive`,`negative`, `notice`, `information`, `blue` | `default` | The variant of the badge to be rendered. | |

| contrast | `low`, `high` | `low` The contrast of the badge to be rendered. | |

| fontWeight | `bold`, `regular` | `bold` The weight of the amount to be rendered. | |

| hasDecimals | `true`, `false` | `true` The amount has or can have numerical in decimals . | |

| hasTextPostfix | `true`, `false` | `true` Text postfix to be used such . | |

| size | `3XL`, `2XL` ,`XL` ,`Large`, `Medium` , `Small` | `3XL` The size of the badge to be rendered. | |

| isStyled | `true`, `false` | `true` Highlight the main amount. | |

| screenSize | `Desktop`, `Movbile` The font weight of the badge's font. | |

### Sample Usage

```jsx
import { Amount } from '@razorpay/components';

<Amount
  size="2XL"
  isStyled="true"
  fontWeight="regular"
  hasDecimals="true"
  hasTextPostfix="true"
  intent="information"
  contrast="high"
>
  1000.27
</Amount>;
```

## Open Questions

#### Dev

- Should we call it `variant` or `intent`?

- Should we separate the amount with commas based on the Indian currency format?

- What should be the default `intent`? Kept it as `default` for now, but `neutral` seems more apt.

- Scope of A11y?

#### Design

- Do we need to support more currency types?

## Discussions

## References

- [Ant](https://ant.design/components/input)

- [Primeng](https://primeng.org/inputnumber)

- [Blueprint](https://blueprintjs.com/docs/#core/components/file-input)

- [Backbase](https://designsystem.backbase.com/v1/components/amount/web)

- [Mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)

- [Salesforce](https://developer.salesforce.com/docs/component-library/bundle/ui:inputCurrency)

- [Dribbble](https://dribbble.com/tags/money_components)

- [Pega](https://design.pega.com/design/currency/)
-
