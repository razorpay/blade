# LightBox

LightBox is a full-screen overlay component for viewing media items — images, videos, documents, or any custom content — in an immersive gallery experience. It provides prev/next navigation and a thumbnail strip for quick item access. It is typically used in KYC document review, media galleries, and product image viewers.

<img width="500" alt="image" src="https://github.com/user-attachments/assets/d2a13e39-0102-4a2c-984b-8a074e65d1db" />

## Design

- [Figma - LightBox](#) <!-- TODO: Add Figma link -->

## API

```jsx
import { LightBox, LightBoxBody, LightBoxItem } from '@razorpay/blade/components';

const [isOpen, setIsOpen] = useState(false);
const [activeIndex, setActiveIndex] = useState(0);

<LightBox
  isOpen={isOpen}
  onDismiss={() => setIsOpen(false)}
  activeIndex={activeIndex}
  onIndexChange={({ index }) => setActiveIndex(index)}
>
  <LightBoxBody>
    {/* Image mode: renders <img> internally, src auto-used as thumbnail */}
    <LightBoxItem src="/aadhar.jpg" alt="Aadhar Card" />
    <LightBoxItem src="/pan.jpg" alt="PAN Card" />

    {/* Custom mode: consumer owns rendering, thumbnail required for strip */}
    <LightBoxItem thumbnail="/video-thumb.jpg" alt="Introduction Video">
      <video src="/intro.mp4" controls />
    </LightBoxItem>

    <LightBoxItem thumbnail="/doc-thumb.jpg" alt="Agreement PDF">
      <Preview>
        <PreviewBody>
          <iframe src="/agreement.pdf" title="Agreement" />
        </PreviewBody>
      </Preview>
    </LightBoxItem>
  </LightBoxBody>
</LightBox>;
```

<details>
  <summary>Alternate APIs</summary>

### Alternate API 1 — Data-driven (images only)

A single-component API where items are passed as an array of config objects. LightBox renders `<img>` tags internally. This is simpler for pure image galleries but limited to images only.

```jsx
<LightBox
  isOpen={isOpen}
  onDismiss={() => setIsOpen(false)}
  items={[
    { src: '/aadhar.jpg', alt: 'Aadhar Card' },
    { src: '/pan.jpg', alt: 'PAN Card', thumbnail: '/pan-thumb.jpg' },
  ]}
  activeIndex={activeIndex}
  onIndexChange={({ index }) => setActiveIndex(index)}
/>
```

- Pros
  - Near-zero boilerplate for pure image galleries
  - Familiar pattern (similar to Ant Design's `Image.PreviewGroup items` and `yet-another-react-lightbox`)
- Cons
  - Images only — no path to render video, PDF, or custom content without a `type`/`render` escape hatch
  - Mixing image and custom content in one array requires a discriminated union on `items` items which adds complexity

</details>

### Props

#### LightBox

```typescript
type LightBoxProps = {
  /**
   * Controls whether the LightBox overlay is visible.
   */
  isOpen: boolean;

  /**
   * Called when the user dismisses the LightBox — via the close button, Escape key, or backdrop click.
   */
  onDismiss: () => void;

  /**
   * Index of the currently active item (controlled).
   * Use alongside `onIndexChange` to manage state externally.
   */
  activeIndex?: number;

  /**
   * Index of the item to show when LightBox first opens (uncontrolled).
   * @default 0
   */
  defaultActiveIndex?: number;

  /**
   * Called when the active item changes via navigation arrows, thumbnail click, or keyboard.
   */
  onIndexChange?: (value: { index: number }) => void;

  /**
   * Accessibility label for the LightBox dialog.
   * @default "Media viewer"
   */
  accessibilityLabel?: string;

  /**
   * Accepts only `LightBoxBody`.
   */
  children: React.ReactNode;
};
```

#### LightBoxBody

```typescript
type LightBoxBodyProps = {
  /**
   * Accepts only `LightBoxItem` components.
   */
  children: React.ReactNode;
};
```

#### LightBoxItem

`LightBoxItem` operates in two modes determined by which props are provided:

- **Image mode** — pass `src` (and optionally `alt`). LightBox renders `<img>` internally and automatically uses `src` as the thumbnail image. Use `thumbnail` to override the thumbnail.
- **Custom mode** — pass `children` alongside `thumbnail`. Consumer fully controls rendering (video, iframe, Preview, etc.). `thumbnail` is required so the thumbnail strip has an image to show.

```typescript
type LightBoxItemProps =
  | {
      /**
       * Image URL. LightBox renders an `<img>` element using this src.
       * The same URL is used for the thumbnail strip unless `thumbnail` is provided.
       */
      src: string;

      /**
       * Alt text for the image, also used as the accessible label for its thumbnail.
       */
      alt?: string;

      /**
       * Optional thumbnail image URL override. Defaults to `src`.
       */
      thumbnail?: string;

      children?: never;
    }
  | {
      /**
       * Thumbnail image URL for the thumbnail strip.
       * Required when `children` is provided, since LightBox cannot auto-derive a thumbnail
       * from arbitrary content.
       */
      thumbnail: string;

      /**
       * Accessible label for the thumbnail in the strip (e.g. "Introduction Video").
       */
      alt?: string;

      /**
       * Custom content to render as the main slide — video, iframe, Preview component, etc.
       * When provided, LightBox does not render any internal `<img>`.
       */
      children: React.ReactNode;

      src?: never;
    };
```

## Examples

### Image gallery

A basic KYC document gallery where all items are images. `activeIndex` and `onIndexChange` make it fully controlled.

```jsx
const [isOpen, setIsOpen] = useState(false);
const [activeIndex, setActiveIndex] = useState(0);

const documents = [
  { src: '/aadhar-front.jpg', alt: 'Aadhar Card (Front)' },
  { src: '/aadhar-back.jpg', alt: 'Aadhar Card (Back)' },
  { src: '/pan.jpg', alt: 'PAN Card' },
];

<LightBox
  isOpen={isOpen}
  onDismiss={() => setIsOpen(false)}
  activeIndex={activeIndex}
  onIndexChange={({ index }) => setActiveIndex(index)}
>
  <LightBoxBody>
    {documents.map((doc) => (
      <LightBoxItem key={doc.src} src={doc.src} alt={doc.alt} />
    ))}
  </LightBoxBody>
</LightBox>;
```

### Mixed content (images + video + PDF)

When some items are not images, use the custom mode with `children` + `thumbnail`. Use Blade's `Preview` component for zoomable document/image rendering.

```jsx
<LightBox
  isOpen={isOpen}
  onDismiss={() => setIsOpen(false)}
  activeIndex={activeIndex}
  onIndexChange={({ index }) => setActiveIndex(index)}
>
  <LightBoxBody>
    {/* Standard image */}
    <LightBoxItem src="/aadhar.jpg" alt="Aadhar Card" />

    {/* Video with a poster as thumbnail */}
    <LightBoxItem thumbnail="/video-poster.jpg" alt="Onboarding Video">
      <video src="/onboarding.mp4" controls style={{ maxHeight: '80vh' }} />
    </LightBoxItem>

    {/* PDF — wrapped in Preview for zoom/pan controls */}
    <LightBoxItem thumbnail="/pdf-preview.jpg" alt="Agreement PDF">
      <Preview>
        <PreviewBody>
          <iframe
            src="/agreement.pdf"
            title="Agreement"
            style={{ width: '100%', height: '80vh', border: 'none' }}
          />
        </PreviewBody>
      </Preview>
    </LightBoxItem>
  </LightBoxBody>
</LightBox>
```

### Uncontrolled (default starting index)

When you don't need to track the active index externally, use `defaultActiveIndex` and omit `activeIndex`/`onIndexChange`. LightBox manages navigation state internally.

```jsx
<LightBox isOpen={isOpen} onDismiss={() => setIsOpen(false)} defaultActiveIndex={2}>
  <LightBoxBody>
    <LightBoxItem src="/doc1.jpg" alt="Document 1" />
    <LightBoxItem src="/doc2.jpg" alt="Document 2" />
    <LightBoxItem src="/doc3.jpg" alt="Document 3" />
  </LightBoxBody>
</LightBox>
```

## Behaviors

### Opening and closing

- LightBox is always **controlled** via `isOpen` — the consumer manages open/closed state.
- The overlay can be dismissed via: the close button (top-right), the Escape key, or a click on the backdrop.
- All three paths call `onDismiss`.

### Navigation

- Prev/next arrow buttons are rendered by LightBox on the left and right edges of the overlay.
- Keyboard left/right arrow keys navigate between items.
- Clicking a thumbnail in the strip jumps directly to that item.
- At the first item, the Previous button is disabled. At the last item, the Next button is disabled (no wrap-around by default).

### Thumbnail strip

- Always shown at the bottom of the overlay.
- Thumbnails are derived from `src` for image items, or from `thumbnail` for custom items.
- The active thumbnail is visually highlighted.
- The strip scrolls horizontally when there are more items than fit in the viewport.

### Active item state

- **Controlled**: provide both `activeIndex` and `onIndexChange`. LightBox calls `onIndexChange` when navigation occurs; consumer updates state.
- **Uncontrolled**: provide `defaultActiveIndex` (or omit for default `0`). LightBox owns navigation state internally.

### Body scroll lock

- While the LightBox is open, body scroll is locked to prevent the page from scrolling beneath the overlay.

## Accessibility

- Follows the Modal and Carousel accessibility guidelines.

## Open Questions

- Can there be any Header in the LightBox?
- Name Decisions:
  - **LightBox** (Commonly used. Although its primarily used for photos and videos and not so commonly used for documents. yet-another-react-lightbox uses this name and provides custom rendered as well though)
  - **FilePreview**
  - **MediaViewer** (Sounds more intuitive although very rarely used in other DS for some reason. Also, MediaViewerItem doesn't have that vibe that LightBoxItem has)

## References

- [Ant Design — Image.PreviewGroup](https://ant.design/components/image)
- [Yet Another React Lightbox](https://yet-another-react-lightbox.com/documentation)
- [IBM Carbon — LightboxMediaViewer](https://www.ibm.com/standards/carbon/web-components/?path=/story/components-lightbox-media-viewer--default)
- [Blade Preview component](../../Preview/Preview.web.tsx)
