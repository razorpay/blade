# Avatar

Used to represent users or things, supporting the display of images, icons, or characters.

This document serves as an overview of the API for the `Avatar` component.

<img src="./avatar-thumbnail.png" width="50%" alt="Thumbnail" />

## Design

- [Explore the design in Figma: Avatar](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=88229-1518352&mode=design&t=Gp3eolSGw8SybZkM-11)

## Anatomy

<img src="./avatar-anatomy.png" width="50%" alt="Anatomy" />

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
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /**
   * The color theme of the avatars within the group. Propagates to all avatars.
   */
  color?: 'primary' | 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
  /**
   * The maximum number of avatars to display before truncating.
   */
  maxAvatars?: number;
};

type AvatarProps = {
  /**
   * The content or children of the avatar.
   */
  children?: StringChildrenType;
  /**
   * The size of the avatar.
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /**
   * The visual variant of the avatar.
   */
  variant?: 'rounded' | 'square';
  /**
   * The color theme of the avatar.
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
   * The `srcSet` attribute for the `img` element, useful for responsive images.
   */
  srcSet?: string;
  /**
   * The `alt` attribute for the `img` element
   */
  alt?: string;
  /**
   * CORS settings attributes
   */
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
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
  onClick?: Platform.Select<{
    native: (event: GestureResponderEvent) => void;
    web: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }>;
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
- If there's no `name` prop, we use a default avatar.

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
  <AvatarGroup maxAvatars={3} size="medium">
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
