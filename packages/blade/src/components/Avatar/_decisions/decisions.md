# Avatar

An avatar component is a standardized visual representation of a user or entity. This reusable element, often manifesting as a profile picture, icon, or initials, facilitates user recognition and streamlines interface navigation.

This document serves as an overview of the API for the `Avatar` component.

<img width="50%" alt="Avatar Thumbnail" src="https://github.com/razorpay/blade/assets/46647141/6e89d932-602f-435f-9519-c46a41ddb4d5" />

<img width="50%" alt="AvatarGroup Thumbnail" src="https://github.com/razorpay/blade/assets/46647141/e54260e8-7f8c-4343-b5f9-8b332d65161f" />

## Design

- [Explore the design in Figma: Avatar](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=88229-1518352&mode=design&t=Gp3eolSGw8SybZkM-11)

## API

The `Avatar` & `AvatarGroup` components would have the following props:

```ts
type AvatarGroupProps = {
  /**
   * Children elements representing the avatars to stack.
   */
  children: React.ReactNode;
  /**
   * The size of each avatar within the group. Propagates to all avatars.
   * @default "xsmall"
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  /**
   * The maximum number of avatars to display before truncating.
   */
  maxCount?: number;
  testID?: string;
};

type AvatarProps = {
  /**
   * The size of the avatar.
   * @default "xsmall"
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  /**
   * The visual variant of the avatar.
   * @default "circle"
   */
  variant?: 'circle' | 'square';
  /**
   * The color theme of the avatar.
   * @default "neutral"
   */
  color?: 'primary' | 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
  /**
   * Custom icon component to use as the avatar.
   */
  icon?: IconComponent;
  /**
   * The name of the avatar, used to generate initials.
   * If src has loaded, the name will be used as the alt attribute of the img. If src is not loaded, the name will be used to create the initials.
   */
  name?: string;
  /**
   * Custom image source for an image avatar.
   */
  src?: string;
  /**
   * The `alt` attribute for the `img` element
   */
  alt?: string;
  /**
   * The `srcSet` attribute for the `img` element, useful for responsive images.
   */
  srcSet?: string;
  /**
   * CORS settings attributes
   */
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  /**
   * Defines which referrer is sent when fetching the resource.
   */
  referrerPolicy?: HTMLAttributeReferrerPolicy;
  /**
   * Automatically renders button with `a` tag with `href` on web
   */
  href?: ButtonProps['href'];
  /**
   * anchor target attribute
   *
   * Should only be used alongside `href`
   */
  target?: ButtonProps['target'];
  /**
   * anchor rel attribute
   *
   * Should only be used alongside `href`
   */
  rel?: ButtonProps['rel'];
  /**
   * Click handler for the avatar.
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  testID?: string;
};
```

## Usage

### Image Avatars

```tsx
<Avatar name="Remy Sharp" src="/static/images/avatar/1.jpg" />
<Avatar name="Travis Howard" src="/static/images/avatar/2.jpg" />
<Avatar name="Cindy Baker" src="/static/images/avatar/3.jpg" />
```

#### Avatar Fallbacks

If there is an error loading the src of the avatar, there will be 2 fallbacks:

- If there's a `name` prop, we use it to generate the initials.
  - Avatar will always have 2 letters as initials.
  - `Rama Krushna Behra` - `RB`
  - `Nitin` - `NI`
  - `Anurag Hazra` - `AH`
- If there's no `name` prop, we use a default avatar.

    <img width="50%" alt="Default Fallback Avatars" src="https://github.com/razorpay/blade/assets/46647141/6382a20f-2624-4671-aaf1-c2ef94bcc2bd">

### Letter avatars

By default, we will merge the first characters of first & last word in the `name`` prop.

```tsx
<Avatar color="primary" name="Nitin Kumar" />
<Avatar color="positive" name="Anurag" />
<Avatar color="negative" name="Saurabh Daware" />
```

### Icon Avatars

`Avatars` containing icons can be created by using the `icon` prop.

```tsx
<Avatar color="primary" icon={SearchIcon} />
<Avatar color="primary" icon={TransactionIcon} />
```

### Avatar Group

`AvatarGroup` can be used to stack multiple avatars together.

```tsx
import { Avatar, AvatarGroup } from '@razorpay/blade/components';

const App = () => (
  <AvatarGroup maxCount={3} size="medium">
    <Avatar color="primary" name="Nitin Kumar" />
    <Avatar color="positive" name="Anurag" />
    <Avatar color="negative" name="Saurabh Daware" />
    <Avatar color="information" name="Rama Krushna" />
    <Avatar color="notice" name="Sachin Tendulkar" />
  </AvatarGroup>
);
```

## Accessibility

- Use the `alt` prop to include alternative text for screen readers.
- Don't use a tooltip with an avatar when it's non-interactive. The tooltip won't work for keyboard users and screen readers.

## Open questions

NA.
