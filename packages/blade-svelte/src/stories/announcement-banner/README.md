# AnnouncementBanner

A one-line message across the top of a page or section (an offer, a
notice), from Blade DSL's Announcement Banner (Figma). It's a labelled
region (`role="region"`, named "Announcement" by default) with no actions
of its own; the message may hold an inline `Link`.

```svelte
<AnnouncementBanner icon={OffersIcon}>
  Zero setup fees on UPI payments this month
</AnnouncementBanner>
```

| Prop | Notes |
| --- | --- |
| `children` | The message. Keep it short: it's one line, cut off with an ellipsis (and its full text as a tooltip) when it doesn't fit |
| `icon` | Optional, before the message, 16px in the text colour |
| `alignment` | `center` (default) or `left` |
| `accessibilityLabel` | Names the region; default "Announcement" |
| `class`, `testID` | As everywhere |

## Look (Figma)

The subtle gray surface (`surface.background.gray.subtle`), 8px above and
below and 16px at the sides, the icon 4px before the message. The message
is Body/SmallMedium: 12/18, medium, no letter-spacing, in
`surface.text.gray.subtle`.

React's version switches to a dark treatment under a dark colour scheme;
cx has no dark theme yet, so there's only the light one.
