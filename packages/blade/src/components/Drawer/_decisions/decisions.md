# Drawer

A drawer is a panel that slides in mostly from the right side of the screen over the existing content in the viewport. It helps in providing additional details or context and can also be used to promote product features or new products.

<img width="500px" src="./2024-02-07-20-04-07.png" alt="Drawer Figma Skeleton">

## Design

- [Drawer - Figma Design](https://www.figma.com/file/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=78667%3A66663&mode=dev)

## Proposed API

```jsx
<Drawer
  isOpen={}
  onDismiss={() => {}}
  showOverlay
>
  <DrawerHeader
    title=""
    subtitle=""
    leading={<StarIcon  />}
    titleSuffix={<Badge></Badge>}
    trailing={
      <Button icon={DownloadIcon} />
    }
  />
  <DrawerBody>
    <Slot />
  </DrawerBody>
<Drawer>
```

<details>
<summary><b>Full Usage Example</b></summary>

```jsx
const MyCuteDrawer = () => {
  const [showDrawer, setShowDrawer] = React.useState(false);
  return (
    <Box>
      <Button onClick={() => setShowDrawer(true)}>Open Drawer</Button>
      <Drawer
        isOpen={showDrawer}
        onDismiss={() => {
          setShowDrawer(false);
        }}
      >
        <DrawerHeader
          title="Announcements"
        />
        <DrawerBody>
          <FTXAnnouncement />
          <RazorpayOnePromotions />
          <CatPictures />
        </DrawerBody>
      <Drawer>
    </Box>
  )
}

```

</details>

### Props

```ts
type DrawerProps = {
  /**
   * Controlled state of drawer open or not
   */
  isOpen: boolean;

  /**
   * Dismiss handler
   */
  onDismiss: () => void;

  /**
   * Show or hide overlay.
   *
   * Also decides if clicking outside on overlay closes the drawer or not
   */
  showOverlay?: boolean;

  /**
   * Initial focus reference element
   */
  initialFocusRef?: React.MutableRefObject<any>;

  /**
   * children node.
   *
   * Supports DrawerHeader and DrawerBody
   */
  children: React.ReactNode;

  /**
   * Override z-index of Drawer.
   *
   * @default 1002
   */
  zIndex?: number;

  /**
   *  Accessibility label for the drawer
   */
  accessibilityLabel?: string;
};

type DrawerHeaderProps = {
  /**
   * Title of the Drawer
   */
  title: string;

  /**
   * Subtitle of the Drawer
   */
  subtitle?: string;

  /**
   * Leading element
   *
   * Icon or Asset
   */
  leading?: ReactNode;

  /**
   * Title suffix element
   *
   * Badge
   */
  titleSuffix?: ReactNode;

  /**
   * Title trailing element
   *
   * Link, Button[]
   */
  trailing?: ReactNode;
};
```

_No alternate APIs were considered because Drawer is closer to Modal on overall meaning and API perspective so made sense to go with API that is closer to Modal, also all DS Drawer components I referenced have similar API_

## Drawer Stacking

- Only 2 Drawers can be stacked on top of each other
- 2nd Drawer always has overlay independent of `showOverlay` prop
- 1st Drawer peeks from behind with 16px gap when 2nd Drawer is opened

## Accessibility

- **Aria Attributes:** Drawer will have `aria-modal="true"` and `role="dialog"` and will be treated as modal for voiceover users.
- **Focus Handling:** Ensure Close Icon and Back Icon is focussable
- **Keyboard Handling:** Pressing `ESC` should close the drawer

Will work in a similar manner as [Ant Design - Drawer](https://ant.design/components/drawer)

## References

- https://atlassian.design/components/drawer/examples
- https://ant.design/components/drawer

## Open Questions

- **Design:** Should 2nd Drawer have back button or should it continue to have close button ([Context](https://github.com/razorpay/blade/pull/2009#discussion_r1487305755))
  - We won't have back button anymore. We will have 1st Drawer peek from behind
- **Dev:** Should there be a prop for dismissing component on outside click. E.g. `shouldDismissOnOutsideClick` or should we handle it as part of controlled component (with the UX that confirmation modal is always shown irrespective of whether its outside click or close button click)
  - We won't have new prop. This can be achieved with controlled component
- **Dev:** Should we build components like `DrawerHeaderIcon`, `DrawerHeaderAsset` (similar to `ActionListItemIcon`, `CardHeaderIcon`) or should rely on consumer to pass correct sizes and colors without building additional wrappers (similar to `DropdownHeader`, `ModalHeader`, `BottomSheetHeader`)? ([Discussion](https://razorpay.slack.com/archives/G01B3LQ9H0W/p1707822018408929))
  - We won't build new components. We will follow what we follow on ModalHeader, BottomSheetHeader, etc
