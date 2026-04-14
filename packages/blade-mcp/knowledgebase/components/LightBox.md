## Component Name

LightBox

## Description

LightBox is a full-screen media viewer for immersive browsing of images and custom-rendered content. It is controlled through open state and active index APIs, and supports keyboard/backdrop dismissal patterns. The component is composed using `LightBox`, `LightBoxBody`, and `LightBoxItem` to build a navigable gallery with thumbnails. It supports both simple image slides and advanced custom slides such as PDF or video content via `children`.

## Important Constraints

- `LightBox` is designed to be composed with `LightBoxBody` as its child container.
- `LightBoxBody` is designed to consume `LightBoxItem` children; non-`LightBoxItem` children are ignored while building slides.
- `LightBoxItem` uses a strict union: image mode requires `src` and disallows `children`.
- `LightBoxItem` custom-content mode requires `thumbnail` + `children` and disallows `src`.
- `LightBox` requires `isOpen` and `onDismiss`; gallery navigation state should be managed via `activeIndex`/`onIndexChange` (controlled) or `defaultActiveIndex` (uncontrolled).

## TypeScript Types

The following public type declarations are the props accepted by `LightBox` and its subcomponents (`LightBoxBody`, `LightBoxItem`). Keep these as the source of truth when composing the full LightBox API.

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

type LightBoxBodyProps = {
  /**
   * Accepts only `LightBoxItem` components.
   */
  children: React.ReactNode;
};

type LightBoxItemProps =
  | {
      /**
       * Image URL. LightBox renders an `<img>` element using this src.
       * The same URL is used for the thumbnail strip unless `thumbnail` is provided.
       */
      src: string;

      /**
       * Alt text for the image.
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
       * Required when `children` is provided.
       */
      thumbnail: string;

      /**
       * Accessible label for the thumbnail in the strip.
       */
      alt?: string;

      /**
       * Custom content to render as the main slide — video, iframe, Preview component, etc.
       */
      children: React.ReactNode;

      src?: never;
    };
```

## Example

### Controlled Image Gallery

This example shows a controlled LightBox with explicit `activeIndex`, `onIndexChange`, and `accessibilityLabel`, while using image-mode `LightBoxItem` entries.

```tsx
import { useState } from 'react';
import { Box, Button, LightBox, LightBoxBody, LightBoxItem } from '@razorpay/blade/components';

const IMAGES = [
  { src: 'https://picsum.photos/seed/lightbox-doc-1/1200/800', alt: 'Invoice summary page' },
  { src: 'https://picsum.photos/seed/lightbox-doc-2/1200/800', alt: 'Payment receipt page' },
  { src: 'https://picsum.photos/seed/lightbox-doc-3/1200/800', alt: 'Settlement confirmation page' },
];

function ControlledLightBoxExample(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Box>
      <Box display="flex" gap="spacing.3" flexWrap="wrap">
        {IMAGES.map((image, index) => (
          <Button
            key={image.src}
            onClick={() => {
              setActiveIndex(index);
              setIsOpen(true);
            }}
          >
            View media {index + 1}
          </Button>
        ))}
      </Box>

      <LightBox
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        activeIndex={activeIndex}
        onIndexChange={({ index }) => setActiveIndex(index)}
        accessibilityLabel="Transaction media viewer"
      >
        <LightBoxBody>
          {IMAGES.map((image) => (
            <LightBoxItem key={image.src} src={image.src} alt={image.alt} />
          ))}
        </LightBoxBody>
      </LightBox>
    </Box>
  );
}
```

### Mixed Media Gallery (Image + PDF + Video)

This example combines image-mode and custom-content-mode `LightBoxItem` entries, including required `thumbnail` for custom slides and accessible media controls.

```tsx
import { useState } from 'react';
import {
  Box,
  Button,
  LightBox,
  LightBoxBody,
  LightBoxItem,
  Preview,
  PreviewBody,
  Text,
} from '@razorpay/blade/components';

const PDF_URL = 'https://cdn.razorpay.com/traditional-banks-vs-razorpayx.pdf';
const VIDEO_URL = 'https://www.w3schools.com/html/mov_bbb.mp4';

function MixedMediaLightBoxExample(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box>
      <Button onClick={() => setIsOpen(true)}>Open mixed gallery</Button>

      <LightBox
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        defaultActiveIndex={1}
        accessibilityLabel="Marketing assets and document viewer"
      >
        <LightBoxBody>
          <LightBoxItem
            src="https://picsum.photos/seed/lightbox-cover/1200/800"
            alt="Campaign cover image"
          />

          <LightBoxItem thumbnail="https://picsum.photos/seed/lightbox-pdf-thumb/400/300" alt="Pricing PDF">
            <Preview>
              <PreviewBody>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width="100%"
                  minHeight="320px"
                  backgroundColor="surface.background.gray.subtle"
                >
                  <Text>Open PDF document: {PDF_URL}</Text>
                </Box>
              </PreviewBody>
            </Preview>
          </LightBoxItem>

          <LightBoxItem thumbnail="https://picsum.photos/seed/lightbox-video-thumb/400/300" alt="Product demo video">
            <Box width="100%" maxWidth="960px">
              <video controls width="100%">
                <source src={VIDEO_URL} type="video/mp4" />
                <track
                  kind="captions"
                  srcLang="en"
                  label="English captions"
                  src="data:text/vtt,WEBVTT"
                />
                Your browser does not support the video tag.
              </video>
            </Box>
          </LightBoxItem>
        </LightBoxBody>
      </LightBox>
    </Box>
  );
}
```
