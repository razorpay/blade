# ChatMessage Thumbnail Preview API Decision

This document captures API decisions for thumbnail preview behavior in `ChatMessage`.
The goal is to support a simple, implementable API for stacked media previews without overfitting to one product flow.

## Scope

- `thumbnails`
- `onThumbnailClick`
- `messageType` deprecation

## Proposed API

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
};
```

## Example

```tsx
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

## Decision Notes

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
- Recommendation
  - Keep `thumbnails` for now to match existing behavior and visual language.
  - If we expect videos/files soon, prefer `mediaPreviews` in next iteration.

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
  - Keep args object. It is the most flexible and avoids future breaking changes.
  - If needed, we can add a helper in examples to ignore unused keys:
    `onThumbnailClick={({ thumbnail }) => openImage(thumbnail)}`.

## Accessibility Notes

- Interactive thumbnail cards are rendered only when `onThumbnailClick` is provided.
- String thumbnails use generated fallback alt text by stack order.
- Object thumbnails use provided `alt` text for domain-specific accessibility.

## Open Questions

- Do we want to rename `thumbnails` to `mediaPreviews` ?
- Is thumbnail naming correct?
