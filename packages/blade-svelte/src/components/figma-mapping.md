# Figma tokens as Uno classes

The Figma designs use Blade's colour tokens. A token is a path,
`category.property.…rest`, for example `surface.background.gray.subtle`.
`uno.config.ts` (package root) turns every token into a class:

1. Choose the class prefix from the property:

   | Property   | Class prefix | CSS property       |
   |------------|--------------|--------------------|
   | background | `bg-`        | `background-color` |
   | text       | `text-`      | `color`            |
   | border     | `border-`    | `border-color`     |
   | border     | `outline-`   | `outline-color`    |
   | icon       | `icon-`      | `color`            |

   Tokens with no property segment, like the top-level `transparent`, are
   skipped, as are the `data` category and deprecated `popup` tokens.
2. Drop the property itself. The prefix already says it.
3. Keep the category and every other segment, joined with hyphens in
   kebab-case. A `default` state stays.

Examples:

| Figma token                              | Class                                     |
|------------------------------------------|-------------------------------------------|
| `surface.background.gray.subtle`         | `bg-surface-gray-subtle`                  |
| `interactive.background.gray.default`    | `bg-interactive-gray-default`             |
| `interactive.border.gray.default`        | `border-interactive-gray-default`         |
| `surface.text.gray.muted`                | `text-surface-gray-muted`                 |
| `feedback.background.neutral.subtle`     | `bg-feedback-neutral-subtle`              |
| `surface.text.staticWhite.muted`         | `text-surface-static-white-muted`         |
| `surface.text.onSea.onSubtle`            | `text-surface-on-sea-subtle`              |
| `interactive.background.primary.default` | `bg-interactive-primary-default`          |
| `interactive.border.primary.highlighted` | `border-interactive-primary-highlighted`   |
| `feedback.text.positive.intense`         | `text-feedback-positive-intense`          |
| `surface.border.primary.muted`           | `outline-surface-primary-muted`           |

Each colour class reads the token's variable, falling back to Blade's
standard theme's light-mode value (the neutral theme's for the few tokens the
standard theme leaves `transparent`): an app themes Blade, a merchant's brand
included, by setting the variables.
