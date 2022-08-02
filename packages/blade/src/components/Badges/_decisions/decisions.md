# Badge <!-- omit in toc -->
Badges are used to show small amount of color coded metadata, which are ideal for getting users attention.

<img src="./badge-thumbnail.png" width="380" />

## Design
- [Figma - Badge](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade---Payment-Light?node-id=8110%3A417)


## API

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| variant | `positive`,`negative`, `notice`, `information`, `neutral` | No | `neutral` | The variant of the badge to be rendered. |
| contrast | `low`, `high` | No | `low` | The contrast of the badge to be rendered. |
| size | `medium`, `small` | No | `medium` | The size of the badge to be rendered. |
| children | `string` | **Yes** | undefined | The label to be rendered within the badge. |
| icon | `Icon` | No | undefined | The Blade `Icon` component to be rendered for the badge. |
| labelStyle | `italic`, `normal` | No | `normal` | The font style of the badge's label. |
| labelWeight | `bold`, `regular` | No | `regular` | The font weight of the badge's label. |

### Sample Usage
```jsx
import { Badge } from '@razorpay/components';

<Badge 
  variant='positive'
  contrast='high'
  icon={InfoIcon} 
  size='large' 
  labelStyle='italic' 
  labelWeight='bold'
>
  New
</Badge>
```

## Open Questions
#### Dev
- Should the label be automatically capitalized when `labelWeight` is `bold`
- Should we call it `labelWeight`, `labelStyle` or `fontWeight`, `fontStyle` or `textWeight`, `textStyle`?
- Should we call it `variant` or `intent`?
- What should be the default `variant`? Kept it as `neutral` for now since it seems more _neutral_ and appropriate
- Scope of A11y?
  - NA

#### Design
- Do we need badges where the text can overflow? Ref: [Mantine Badge](https://mantine.dev/core/badge/#full-width-and-overflow)
- Do we need to support icon only badges?
- Should we auto-capitalize label when `labelWeight` is bold?