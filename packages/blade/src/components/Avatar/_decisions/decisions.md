# Avatar

Used to represent users or things, supporting the display of images, icons, or characters.

This document serves as an overview of the API for the `SearchInput` component.

<img src="./searchinput-thumbnail.png" width="50%" alt="Thumbnail" />

<img src="./searchinput-dropdown.png" width="50%" alt="Input with results in dropdown" />

## Design

- [Explore the design in Figma: SearchInput](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=85072%3A160345&mode=design&t=Pv93G8LK6OtL4wwk-1)

## Anatomy

<img src="./searchinput-anatomy.png" width="50%" alt="Anatomy" />

## API

The `Avatar` & `AvatarGroup` components would have the following props:

```ts
type AvatarGroupProps = {
  /**
   * The avatars to stack.
   */
  children: React.ReactNode;
  /**
   * The size of the avatar
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /**
   * The color of the avatar
   */
  color?: 'primary' | 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
  /**
   * The maximum number of avatars to be displayed
   */
  maxAvatars?: number;
  /**
   * The total number of avatars. Used for calculating the number of extra avatars.
   */
  totalAvatars: number;
};

type AvatarProps = {
  /**
   * The children of the avatar
   */
  children?: StringChildrenType;
  /**
   * The size of the avatar
   */
  size?: 'xsmall' | 'small' | 'medium' | 'large';
  /**
   * The color of the avatar
   */
  color?: 'primary' | 'positive' | 'negative' | 'notice' | 'information' | 'neutral';
  /**
   * Custom icon type for an icon avatar
   */
  icon?: React.ReactNode;
  /**
   * Custom image source for an image avatar
   */
  src?: string;
  /**
   * The `srcSet` attribute for the `img` element. Use this attribute for responsive image display.
   */
  srcSet?: string;
};
```

## Usage

### Image Avatars

```tsx
<Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
<Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
<Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
```

### Letter avatars

`Avatars` containing simple characters can be created by passing a string as children.

```tsx
<Avatar color="primary">H</Avatar>
<Avatar color="positive">N</Avatar>
<Avatar color="information">OP</Avatar>
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
  <AvatarGroup maxAvatars={3} totalAvatars={5} size="medium">
    <Avatar color="primary">N</Avatar>
    <Avatar color="positive">I</Avatar>
    <Avatar color="negative">T</Avatar>
    <Avatar color="information">I</Avatar>
    <Avatar color="notice">N</Avatar>
  </AvatarGroup>
);
```

## Accessibility

- Use the `alt` prop to include alternative text for screen readers.
- Don't use a tooltip with an avatar when it's non-interactive. The tooltip won't work for keyboard users and screen readers.

## Open questions

NA.
