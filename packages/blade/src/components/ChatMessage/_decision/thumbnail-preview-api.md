# ChatMessage Thumbnail Preview API Decision

`ChatMessage` supports a stacked thumbnail preview above message content.
This API uses structured thumbnail objects (`id`, `url`, `alt`) for accessibility, analytics, and stable item identity.
The thumbnail experience remains presentational inside `ChatMessage`.

## Scope

- `thumbnails`
- `onThumbnailClick`
- `messageType` deprecation

## Design

- [Figma - ChatMessage Thumbnail Preview](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/branch/QjSexUED296OBCwWwhYKQE/Blade-DSL?node-id=117092-5019&m=dev)

Reference visual (stacked thumbnail preview with overflow `+2`):

![ChatMessage stacked thumbnail preview](./chatMessage-thumbnail-stack-preview.png)

## API

```tsx
import { ChatMessage } from '@razorpay/blade/components';

<ChatMessage
  thumbnails={[
    { id: 'img-1', url: 'https://example.com/a.jpg', alt: 'Payment chat screenshot 1' },
    { id: 'img-2', url: 'https://example.com/b.jpg', alt: 'Receipt screenshot' },
    { id: 'img-3', url: 'https://example.com/c.jpg', alt: 'Error state screenshot' },
    { id: 'img-4', url: 'https://example.com/d.jpg', alt: 'Payment chat screenshot 4' },
  ]}
  onThumbnailClick={({ index, thumbnail }) => {
    openImageViewer({ startAt: index, src: thumbnail });
  }}
>
  Here are the screenshots from the user.
</ChatMessage>
```

### Props

#### `ChatMessage`

```ts
type ThumbnailItem = {
  id?: string;
  url: string;
  alt?: string;
};

type ChatMessageThumbnailProps = {
  /**
   * Thumbnail previews rendered above the message in a stacked layout.
   * Up to first 3 thumbnails are visibly stacked; remaining count is shown as `+N`.
   */
  thumbnails?: ThumbnailItem[];

  /**
   * Called when a visible thumbnail preview is clicked.
   */
  onThumbnailClick?: () => void;

  /**
   * Deprecated. This prop is no longer used for thumbnail preview behavior or bubble rendering.
   * Keep temporarily for backward compatibility and remove in next major release.
   */
  messageType?: 'default' | 'last';

};
```

## Examples

```tsx
// Thumbnail objects
<ChatMessage
  thumbnails={[
    { id: 'img-1', url: 'https://example.com/a.jpg', alt: 'Payment chat screenshot 1' },
    { id: 'img-2', url: 'https://example.com/b.jpg', alt: 'Receipt screenshot' },
    { id: 'img-3', url: 'https://example.com/c.jpg', alt: 'Error state screenshot' },
    { id: 'img-4', url: 'https://example.com/d.jpg', alt: 'Payment chat screenshot 4' },
  ]}
  onThumbnailClick={() => {
    openImageViewer();
  }}
>
  Here are the screenshots from the user.
</ChatMessage>
```

## Behaviors and Decision Notes

- Keep `thumbnails` as object-only `ThumbnailItem[]`:
  - enforces explicit per-item `alt` for better accessibility
  - provides stable analytics/tracking through `id`
  - keeps shape predictable for integrations and future extensions
- `onThumbnailClick` is a simple no-argument callback:
  - consumers handle index/src tracking themselves if needed
- Thumbnail rendering remains presentational:
  - first 3 items in stacked preview
  - overflow represented as `+N`
  - layout/styling stays internal to `ChatMessage`
- Deprecate `messageType`:
  - `messageType` is no longer used for thumbnail preview behavior or bubble rendering
  - continue accepting it temporarily as deprecated for backward compatibility
  - remove in next major release after migration window
  - We use to use this prop for changing styles of chat message bubble for last message. now we have same styles for all messages.

## Alternatives Considered

### Rich Thumbnail Object API (Current)

```ts
type ThumbnailItem = {
  id?: string; // optional: enables analytics/tracking when provided
  url: string;
  alt?: string; // optional: enables per-item accessibility context when provided
};
```

- Pros
  - Better a11y control through explicit `alt`
  - Better analytics/tracking through stable `id`
  - Clearer semantics with `url` key

### URL-only Thumbnail API (Not Adopted)

```ts
thumbnails?: string[];
```

- Pros
  - Minimal API surface
  - Fastest to adopt for existing integrations
- Cons
  - No item-level alt text for domain-specific accessibility
  - No stable item id for analytics and tracking
- Recommendation
  - Do not adopt. Keep object-only API for consistency and accessibility guarantees.

### Naming Alternatives for `thumbnails`

```ts
type ChatMessageThumbnailProps = {
  mediaPreviews?: ThumbnailItem[];
  onMediaPreviewClick?: ({ index, src }: { index: number; src: string }) => void;
};
```

- Candidate names
  - `mediaPreviews`: Better future-proofing (not limited to image semantics)
  - `previewImages`: Clearer than thumbnails, still image-specific
  - `messageAttachments`: Best when this should represent domain-level attachments
  - `attachmentPreviewList`: Inspired by Stream naming; better for composer/attachment contexts than message bubble content
- Recommendation
  - Keep `thumbnails` for now to match existing behavior and visual language.
  - If we expect videos/files soon, prefer `mediaPreviews` in next iteration.
  - Avoid `attachmentPreviewList` for this prop because it sounds like a component/API surface, not a data prop.

### Callback Payload Alternatives (`onThumbnailClick`)

```ts
// Option A: full payload (current)
onThumbnailClick?: ({ index, thumbnail }: { index: number; thumbnail: string }) => void;

// Option B: index only
onThumbnailClick?: (index: number) => void;

// Option C: src only
onThumbnailClick?: (thumbnail: string) => void;
```

- Option A (`{ index, thumbnail }`) pros
  - Handles both "open by index" and "open by src" use-cases
  - Avoids extra lookups in consumer code
  - More resilient for analytics/event logging
- Option A cons
  - Slightly more verbose callback signature
- Option B (`index`) pros
  - Minimal API, easiest to document
- Option B cons
  - Consumers must do lookup for src
  - Less useful when list is transformed/normalized
- Option C (`thumbnail`) pros
  - Good for direct open-by-url flows
- Option C cons
  - Loses stable position context for galleries
- Recommendation
  - Keep object payload. It is the most flexible and avoids future breaking changes.
  - If needed, we can add a helper in examples to ignore unused keys:
    `onThumbnailClick={({ thumbnail }) => openImage(thumbnail)}`.

### Overflow Label Customization (`thumbnailOverflowLabel`) (Alternative)

```ts
// Option A: formatter callback
thumbnailOverflowLabel?: ({ hiddenCount }: { hiddenCount: number }) => string;

// Option B: fixed string
thumbnailOverflowText?: string;
```

- Option A (formatter callback) pros
  - Supports dynamic labels based on hidden count
  - Enables localization/pluralization in consumer space
  - Keeps internal stacked UI contract stable
- Option A cons
  - Slightly more verbose than fixed text
- Option B (fixed string) pros
  - Very simple API for static copy
- Option B cons
  - Cannot represent count-driven copy without losing context
  - Less suitable for pluralization/localization patterns
- Recommendation
  - Keep this as an alternative for now until product copy/localization requirements are clearer.

## Accessibility

- Interactive thumbnail cards are rendered only when `onThumbnailClick` is provided.
- Thumbnails use provided `alt` text for domain-specific accessibility.

## Open Questions

- Do we want to rename `thumbnails` to `mediaPreviews` ?
- Is thumbnail naming correct?
- Should overflow label customization be promoted from alternative to main API?
- Should `thumbnailOverflowLabel` allow richer output (for example `ReactNode`) in a future revision?

## References

- [Stream Chat - Attachment Previews in Message Input](https://getstream.io/chat/docs/sdk/react/guides/message-input/attachment_previews/)
