# Preview

## Description

The Preview component is a versatile file preview component that provides a container for displaying various types of content with zoom and drag capabilities. It consists of three main subcomponents: PreviewHeader, PreviewBody, and PreviewFooter. The component supports features like zooming, dragging, full-screen mode, and customizable headers and footers. It's particularly useful for displaying images, PDFs, and other content that requires interactive viewing capabilities.

## TypeScript Types

Below are the TypeScript types that define the props for the Preview component and its subcomponents. These types are essential for understanding what props each component accepts and how to use them effectively.

```typescript
type PreviewProps = {
  /**
   * The children of the Preview component.
   */
  children: React.ReactElement | React.ReactElement[];
  /**
   * The function to call when the full screen button is clicked.
   */
  onFullScreen?: () => void;
  /**
   * Whether the drag and zoom is disabled.
   */
  isDragAndZoomDisabled?: boolean;
  /**
   * The initial zoom of the Preview component.
   */
  defaultZoom?: number;
  /**
   * The function to call when the zoom changes.
   */
  onZoomChange?: (newZoom: number) => void;
  /**
   * The function to call when the drag changes.
   */
  onDragChange?: (position: { x: number; y: number }) => void;
  /**
   * The step of the zoom.
   */
  zoomScaleStep?: number;
  /**
   * The smallest zoom the Preview allows. Zooming out stops here and the Zoom Out button is disabled.
   *
   * @default 0.1
   */
  minZoom?: number;
  /**
   * The largest zoom the Preview allows. Zooming in stops here and the Zoom In button is disabled.
   *
   * @default 8
   */
  maxZoom?: number;
};

type PreviewHeaderProps = {
  /**
   * The title of the PreviewHeader component.
   */
  title?: string;
  /**
   * The trailing of the PreviewHeader component.
   */
  trailing?: React.ReactElement | React.ReactElement[];
};

type PreviewBodyProps = {
  /**
   * The children of the PreviewBody component.
   */
  children: React.ReactElement;
  /**
   * Makes the body fill the preview frame and centres its child. Use it to fit content to the
   * frame: give the child `max-width: 100%` and `max-height: 100%` (and `object-fit: contain` for images).
   *
   * Children's percentage heights resolve against the frame when this is set, so an
   * `<img width="100%" height="100%" />` stretches to the frame's shape.
   *
   * @default false
   */
  shouldFillFrame?: boolean;
};

type PreviewFooterProps = {
  /**
   * The trailing of the PreviewFooter component.
   */
  trailing?: React.ReactElement;
  /**
   * Whether to show the zoom percentage.
   */
  showZoomPercentage?: boolean;
};
```

## Usage Guidelines

**Do**

- Use `Preview` for inline content viewing with zoom, pan, and pinch interactions (images, PDFs).
- Compose with `PreviewHeader`, `PreviewBody`, and `PreviewFooter` for structured layout with controls.
- Use `onZoomChange` and `onDragChange` callbacks for tracking user interactions.
- Use `isDragAndZoomDisabled` for static preview mode without interactions.
- Use `minZoom` and `maxZoom` to limit zoom. The footer's Zoom Out and Zoom In buttons disable themselves at these limits, so don't disable or remount them yourself.
- To fit content to the frame, set `shouldFillFrame` on `PreviewBody`, give the child `max-width: 100%` and `max-height: 100%` (with `object-fit: contain` for images), and set `minZoom={1}` so users can't shrink it below the frame.
- Don't combine `shouldFillFrame` with `<img width="100%" height="100%">`: the image stretches to the frame's shape. Use `max-width`/`max-height` instead.
- Use inside `LightBox` (custom mode) for gallery items that need zoom/pan.

**Don't**

- Don't use `Preview` for multi-item gallery navigation — use `LightBox` instead.
- Don't expect built-in zoom controls — compose custom buttons in `PreviewFooter` trailing slot.
- Don't use `Preview` as a PDF renderer — it's a wrapper only; use libraries like `react-pdf` for rendering.
- Don't use `Preview` for simple image display without interaction — a plain `<img>` suffices.

## Example

Here are comprehensive examples showing different use cases of the Preview component:

### Basic Image Preview

```tsx
import { Preview, PreviewHeader, PreviewBody, PreviewFooter } from '@razorpay/blade/components';

function ImagePreview() {
  return (
    <Preview>
      <PreviewHeader title="Image Preview" />
      <PreviewBody>
        <img width="100%" height="100%" src="https://example.com/image.jpg" alt="Preview image" />
      </PreviewBody>
      <PreviewFooter showZoomPercentage={true} />
    </Preview>
  );
}
```

### PDF Preview with Navigation

```tsx
import { Preview, PreviewHeader, PreviewBody, PreviewFooter } from '@razorpay/blade/components';
import { Document, Page } from 'react-pdf';
import { Button } from '@razorpay/blade/components';
import { ArrowLeftIcon, ArrowRightIcon } from '@razorpay/blade/components';
import { useState } from 'react';

function PDFPreview() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Preview defaultZoom={1.5} onZoomChange={(zoom) => console.log('Zoom level:', zoom)}>
      <PreviewHeader title="PDF Document" trailing={<Button>Download</Button>} />
      <PreviewBody>
        <Document file="https://example.com/document.pdf">
          <Page pageNumber={currentPage} width={800} height={700} />
        </Document>
      </PreviewBody>
      <PreviewFooter
        showZoomPercentage={true}
        trailing={
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Button
              icon={ArrowLeftIcon}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              variant="tertiary"
              aria-label="Previous page"
              isDisabled={currentPage <= 1}
            />
            <span>Page {currentPage}</span>
            <Button
              icon={ArrowRightIcon}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              variant="tertiary"
              aria-label="Next page"
            />
          </div>
        }
      />
    </Preview>
  );
}
```

### Fit to Frame with Zoom Limits

```tsx
import {
  Box,
  Preview,
  PreviewHeader,
  PreviewBody,
  PreviewFooter,
} from '@razorpay/blade/components';

function FitToFramePreview() {
  return (
    <Box height="500px">
      <Preview minZoom={1} maxZoom={3}>
        <PreviewHeader title="Invoice" />
        <PreviewBody shouldFillFrame={true}>
          <img
            src="https://example.com/invoice.png"
            alt="Invoice"
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
          />
        </PreviewBody>
        <PreviewFooter showZoomPercentage={true} />
      </Preview>
    </Box>
  );
}
```

### Disabled Drag and Zoom Preview

```tsx
import { Preview, PreviewHeader, PreviewBody } from '@razorpay/blade/components';

function StaticPreview() {
  return (
    <Preview isDragAndZoomDisabled={true}>
      <PreviewHeader title="Static Preview" />
      <PreviewBody>
        <img
          width="100%"
          height="100%"
          src="https://example.com/image.jpg"
          alt="Static preview image"
        />
      </PreviewBody>
    </Preview>
  );
}
```
