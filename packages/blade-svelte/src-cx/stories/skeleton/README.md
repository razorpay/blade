# Skeleton

A placeholder for content that is still loading. It has no behaviour, so no
behaviour model is behind it: the whole component
(`packages/blade/components/skeleton/Skeleton.svelte`) is style-only and nothing of it
is in the core.

| Prop | Notes |
| --- | --- |
| `class` | The skeleton has no box of its own: give it one here (`h-4 w-32`, `w-10 h-10 rounded-max`) |
| `testID` | As everywhere |

A skeleton is always hidden from assistive tech: the region that is loading
announces it, not each bone.
