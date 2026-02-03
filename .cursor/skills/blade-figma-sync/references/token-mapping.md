# Figma to Blade Token Mapping

## Color Tokens

### Interactive Colors
| Figma Variable | Blade Token |
|----------------|-------------|
| `color/action/icon/primary/default` | `colors.interactive.icon.primary.normal` |
| `color/action/icon/primary/hover` | `colors.interactive.icon.primary.hover` |
| `color/action/icon/primary/focus` | `colors.interactive.icon.primary.focus` |
| `color/action/icon/primary/disabled` | `colors.interactive.icon.primary.disabled` |
| `color/action/text/primary/default` | `colors.interactive.text.primary.normal` |
| `color/action/text/primary/hover` | `colors.interactive.text.primary.hover` |
| `color/action/text/link/default` | `colors.interactive.text.primary.normal` |
| `color/action/text/link/hover` | `colors.interactive.text.primary.hover` |
| `color/action/text/link/focus` | `colors.interactive.text.primary.focus` |
| `color/action/text/link/visited` | `colors.interactive.text.primary.normal` |

### Feedback Colors
| Figma Variable | Blade Token |
|----------------|-------------|
| `color/feedback/text/negative/*` | `colors.feedback.text.negative.*` |
| `color/feedback/text/positive/*` | `colors.feedback.text.positive.*` |
| `color/feedback/text/notice/*` | `colors.feedback.text.notice.*` |
| `color/feedback/text/information/*` | `colors.feedback.text.information.*` |
| `color/feedback/text/neutral/*` | `colors.feedback.text.neutral.*` |

### Surface Colors
| Figma Variable | Blade Token |
|----------------|-------------|
| `color/surface/background/gray/*` | `colors.surface.background.gray.*` |
| `color/surface/border/*` | `colors.surface.border.*` |

## Spacing Tokens

| Figma Value | Blade Token |
|-------------|-------------|
| 0px | `spacing.0` |
| 2px | `spacing.1` |
| 4px | `spacing.2` |
| 8px | `spacing.3` |
| 12px | `spacing.4` |
| 16px | `spacing.5` |
| 20px | `spacing.6` |
| 24px | `spacing.7` |
| 32px | `spacing.8` |
| 40px | `spacing.9` |
| 48px | `spacing.10` |
| 56px | `spacing.11` |

## Typography Tokens

### Font Sizes
| Figma Style | Blade Size |
|-------------|------------|
| 12px | `small` |
| 14px | `medium` |
| 16px | `large` |

### Line Heights
| Figma Value | Blade Token |
|-------------|-------------|
| 16px | `lineHeights.s` |
| 20px | `lineHeights.m` |
| 24px | `lineHeights.l` |

### Font Weights
| Figma Style | Blade Token |
|-------------|-------------|
| Regular (400) | `fontWeights.regular` |
| Medium (500) | `fontWeights.medium` |
| Semibold (600) | `fontWeights.semibold` |
| Bold (700) | `fontWeights.bold` |

## Icon Sizing

| Figma Size | Blade Size Prop |
|------------|-----------------|
| 12px | `xsmall` |
| 16px | `small` |
| 20px | `medium` |
| 24px | `large` |

## Component-Specific Mappings

### Link Component
| Figma Property | Blade Prop |
|----------------|------------|
| Size: Small | `size="small"` |
| Size: Medium | `size="medium"` |
| Color: Primary | `color="primary"` |
| Color: White | `color="white"` |
| Color: Neutral | `color="neutral"` |
| Color: Negative | `color="negative"` |
| Color: Positive | `color="positive"` |
| State: Disabled | `isDisabled={true}` |
| Variant: Anchor | `variant="anchor"` |
| Variant: Button | `variant="button"` |
| Icon Position: Left | `iconPosition="left"` |
| Icon Position: Right | `iconPosition="right"` |

### Button Component
| Figma Property | Blade Prop |
|----------------|------------|
| Size: XSmall | `size="xsmall"` |
| Size: Small | `size="small"` |
| Size: Medium | `size="medium"` |
| Size: Large | `size="large"` |
| Variant: Primary | `variant="primary"` |
| Variant: Secondary | `variant="secondary"` |
| Variant: Tertiary | `variant="tertiary"` |
