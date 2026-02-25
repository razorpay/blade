# ChatMessage Thumbnail Preview API Decision

`ChatMessage` supports a stacked thumbnail preview above message content.
This API keeps existing URL-only integrations easy, while allowing richer metadata (`id`, `url`, `alt`) for accessibility and analytics.
The thumbnail experience remains presentational inside `ChatMessage`.

## Scope

- `thumbnails`
- `onThumbnailClick`
- `messageType` deprecation

## Design

- [Figma - ChatMessage Thumbnail Preview](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/branch/QjSexUED296OBCwWwhYKQE/Blade-DSL?node-id=117092-5019&m=dev)

## API

```tsx
import { ChatMessage } from '@razorpay/blade/components';

<ChatMessage
  thumbnails={[
    'https://example.com/a.jpg',
    { id: 'img-2', url: 'https://example.com/b.jpg', alt: 'Receipt screenshot' },
    { id: 'img-3', url: 'https://example.com/c.jpg', alt: 'Error state screenshot' },
    'https://example.com/d.jpg',
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
  id: string;
  url: string;
  alt: string;
};

type ChatMessageThumbnailProps = {
  /**
   * Thumbnail previews rendered above the message in a stacked layout.
   * Supports URL strings for backward compatibility and object items for richer metadata.
   * Up to first 3 thumbnails are visibly stacked; remaining count is shown as `+N`.
   */
  thumbnails?: Array<string | ThumbnailItem>;

  /**
   * Called when a visible thumbnail preview is clicked.
   * Returns index from original thumbnails array and the resolved clicked URL.
   */
  onThumbnailClick?: ({ index, thumbnail }: { index: number; thumbnail: string }) => void;

  /**
   * Deprecated. This prop is no longer used for thumbnail preview behavior or bubble rendering.
   * Keep temporarily for backward compatibility and remove in next major release.
   */
  messageType?: 'self' | 'other';

};
```

## Examples

```tsx
// URL-only thumbnails
<ChatMessage
  thumbnails={[
    'https://example.com/a.jpg',
    'https://example.com/b.jpg',
    'https://example.com/c.jpg',
    'https://example.com/d.jpg',
  ]}
/>

// Mixed thumbnails with metadata
<ChatMessage
  thumbnails={[
    'https://example.com/a.jpg',
    { id: 'img-2', url: 'https://example.com/b.jpg', alt: 'Receipt screenshot' },
    { id: 'img-3', url: 'https://example.com/c.jpg', alt: 'Error state screenshot' },
    'https://example.com/d.jpg',
  ]}
  onThumbnailClick={({ index, thumbnail }) => {
    openImageViewer({ startAt: index, src: thumbnail });
  }}
>
  Here are the screenshots from the user.
</ChatMessage>
```

## Behaviors and Decision Notes

- Keep `thumbnails` flexible as `Array<string | { id; url; alt }>`:
  - preserves easy migration for existing URL-only payloads
  - supports better a11y via per-item `alt`
  - supports stable analytics/tracking through `id`
- Keep callback payload as `{ index, thumbnail }`:
  - index helps open full galleries with stable ordering
  - thumbnail is always a resolved URL, avoiding array/object branching in consumer code
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

### Rich Thumbnail Object API

```ts
type ThumbnailItem = {
  id: string;
  url: string;
  alt: string;
};
```

- Pros
  - Better a11y control through explicit `alt`
  - Better analytics/tracking through stable `id`
  - Clearer semantics with `url` key
- Cons
  - More verbose than URL-only arrays

### URL-only Thumbnail API

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
  - Support both in one API: `Array<string | ThumbnailItem>`.

### Naming Alternatives for `thumbnails`

```ts
type ChatMessageThumbnailProps = {
  mediaPreviews?: string[];
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
- String thumbnails use generated fallback alt text by stack order.
- Object thumbnails use provided `alt` text for domain-specific accessibility.

## Open Questions

- Do we want to rename `thumbnails` to `mediaPreviews` ?
- Is thumbnail naming correct?
- Should overflow label customization be promoted from alternative to main API?
- Should `thumbnailOverflowLabel` allow richer output (for example `ReactNode`) in a future revision?

## References

- [Stream Chat - Attachment Previews in Message Input](https://getstream.io/chat/docs/sdk/react/guides/message-input/attachment_previews/)
