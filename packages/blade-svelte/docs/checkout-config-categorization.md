# Standard Checkout Configurability — Categorization & blade-svelte Mapping

## 1. Overview

This document categorizes the "Standard Checkout" customization/configurability spec (the LHS/RHS mapping sheet) into logical, engineering-meaningful boundaries, and maps each configurable property to the Blade Svelte component(s) that would expose that configurability. The premise is that all UI components needed for checkout are already migrated in the `blade-svelte` package; the goal here is to identify where configurability (theming, props, tokens) already exists and where new props / theme hooks are required to enable it. Component/prop claims below were verified against the actual source in `packages/blade-svelte/src/components` and the theme API in `packages/blade-core/src/tokens`.

## 2. Logical boundaries

The sheet ships three meta-groups (Foundation, Sections, Features). Those are useful for a config UI, but they mix concerns that are implemented very differently in a component system (a global token vs. a single component prop vs. an app-level flag). For a configurability/theming engine, the config splits more cleanly along **how a value is applied at runtime**:

- **Boundary A — Global Theme & Foundation Tokens.** Values that are set once and cascade to every component: brand/primary color, corner-radius scale, typography (family/size/color), spacing/padding, icon treatment, global background. In blade-svelte these are (or should be) driven by `createTheme(...)` + `BladeProvider`, not by per-component props. This is the highest-leverage boundary — one token change restyles the whole checkout.
- **Boundary B — Section Component Config.** Per-section visible/hidden, layout, copy, and local style overrides for the six visible regions: Header, Price Summary, Customer Details, Message Banner, Payment Panel, Footer. These map to concrete components (`AppBar`, `Card`, `AnnouncementBanner`, `Accordion`, `Button`, `Amount`, etc.) and to props on those components.
- **Boundary C — Transition / Flow Screens.** The interstitial screens (Success, Retry, Payment Processing, Cancel, Exit). These are composed surfaces (usually inside a `BottomSheet`/`Card`) with copy, background, an illustration/animation, and CTAs. They share the same primitives but have distinct gaps (no animation/Lottie or illustration primitive exists in blade-svelte).
- **Boundary D — Feature Flags / Behavioral Toggles.** Global enable/disable switches that change behavior, not the visual contract of a component (Saved Instruments, Customer Data collection, Quick Buy, Timers & Expiry, Retry Settings, Screen Toggles, UX Features). These are **config-plane / application-plane** concerns — they gate whether a component renders or how the flow behaves. blade-svelte does not (and should not) own these; the config UI that sets them may itself use `Switch`, `Checkbox`, `TextInput`, etc.

Rationale: Boundaries A–C are where blade-svelte must expose configurability (tokens or props). Boundary D deliberately has no component-prop mapping — flagging it separately prevents us from inventing "toggle" props on presentational components that should just be conditionally rendered by the host app.

### Components verified as available in blade-svelte

Typography (`Text`, `Heading`, `Code`, `BaseText`), `Button`/`IconButton`, `Link`, `Amount`, `Badge`, `Counter`, `Divider`, `Skeleton`, `Spinner`, `Alert`, `AnnouncementBanner`, `TrustBadge`, `Card` (+ `CardHeader*`/`CardBody`/`CardFooter*`), `Accordion`, `Collapsible`, `BottomSheet`, `AppBar` (+ `AppBarLeading`/`AppBarActions`), `Tabs`, `SegmentedControl`, `Chip`/`ChipGroup`, `Checkbox`/`CheckboxGroup`, `Radio`/`RadioGroup`, `Switch`, `ActionList` (+ items), `Avatar`/`AvatarGroup`, `Breadcrumb`, `Tooltip`, `Toast`, `Icons`, inputs (`TextInput`, `SearchInput`, `PasswordInput`, `OTPInput`, `PhoneNumberInput`, `InputGroup`), and `BladeProvider`. Global theming is via `createTheme({ brandColor, borderRadius })` + `bladeTheme` from `@razorpay/blade-core/tokens`.

There is **no** dedicated `Header`, `Footer`, `PriceSummary`, `TransitionScreen`, `Lottie`/`Animation`, or `Illustration` component — those regions are compositions of the primitives above.

---

## 3. Boundary → blade-svelte component mapping

Legend for "Supported": **Yes** = a prop/token exists today; **Partial** = partially expressible (named tokens/enums but not the full requested range, or via composition); **No** = no prop/token, needs new API. "Is Currently Supported" mirrors the sheet's own flag where present.

### Boundary A — Global Theme & Foundation Tokens

| Config Property | Config Type | Maps to blade-svelte | Prop / token that enables it | Supported | Notes / Gap |
| --- | --- | --- | --- | --- | --- |
| Background — page background colour | color picker | `BladeProvider` / surface token; `Box`/`div` | theme `surface.background.*`; no arbitrary hex API | Partial | Token-level. Arbitrary hex needs a theme surface override; `createTheme` only takes `brandColor`+`borderRadius`. |
| Background — header colour | color picker | `AppBar` | `backgroundColor` (5 surface tokens only) | Partial | Token-level, limited set; no arbitrary hex. |
| Side graphics show/hide, style, motion | toggle / enum / asset upload | none (app-level asset slot) | — | No | Not a component prop; host renders the graphic. Motion/Lottie has no primitive. |
| Container / layout (boxed vs edge-to-edge) | enum | `Card` vs plain `Box` | composition (`Card` for boxed) | Partial | Choice is layout composition, not a single prop. |
| Corner radius — cards / buttons / icon containers | slider (min–max) | Global token via `createTheme` | `createTheme({ borderRadius: { medium, large, ... } })` | Partial | **Token-level, global.** Overrides the radius scale (`none`/`2xsmall`/`xsmall`/`small`/`medium`/`large`/`xlarge`/`2xlarge`/`max`). A free px slider maps only by writing a numeric token; not per-surface. `Card` itself only accepts `medium\|large\|xlarge`. |
| Padding (global) | enum / slider | Spacing tokens; `Card.padding` | `spacing.*` styled props; `Card.padding` (`0/3/4/5/7` only) | Partial | Sheet marks "no". Card padding is a restricted enum, not a slider. |
| Typography — font size | slider / enum | `Text`/`Heading`/`Amount` `size`; theme `typography.fonts.size` | `size` (named), theme size scale | Partial | Named sizes only (`xsmall…2xlarge`). No arbitrary px slider; `createTheme` doesn't expose the size scale. |
| Typography — font style (family) + custom upload | enum / upload | `BaseText.fontFamily`; theme `typography.fonts.family` | `fontFamily` (BaseText only); no theme font API | No | `Text`/`Heading` public props do **not** expose `fontFamily`; `createTheme` has no font-family override / custom @font-face registration. |
| Typography — font color (Section header / Label / Body / Link) | color picker (derived from Primary) | `Text`/`Heading` `color`; theme | `color` (token), brand-derived via `createTheme({ brandColor })` | Partial | Token-level. Primary-derived colors come free from `brandColor`; arbitrary per-role hex is not a token. |
| Input field style — box vs bottom-line | enum | `TextInput` (+ other inputs) | none | No | No `variant`/`inputStyle` prop; only box style exists. |
| Icons — style (outline / solid / dual) | enum | `Icons` | none (outline set only) | No | Icon components accept only `color` + `size`. Sheet notes "Blade only supports outline". |
| Icons — stroke width | slider | `Icons` | none | No | No `strokeWidth` prop. |
| Icons — color | color picker | `Icons` | `color` (token enum) | Partial | Token-level color only; no arbitrary hex. |
| Language — default selection | dropdown | app-level (`ActionList`/`SegmentedControl` in UI) | — | No | Behavioral/locale; not a checkout-component style prop. |

### Boundary B — Section Component Config

#### Header

| Config Property | Config Type | Maps to blade-svelte | Prop / token | Supported | Notes / Gap |
| --- | --- | --- | --- | --- | --- |
| Logo preference (logo / logo+name / name / watermark) | enum | `AppBarLeading` | `logo` (snippet) + `title` | Partial | Combinations are composition; "watermark upload" is an app asset. |
| Logo corner radius | slider (0–100) | `Avatar` (if logo via Avatar) / logo container | `Avatar.variant` (`circle`/`square`) | No | No arbitrary radius on `Avatar`; only circle/square. |
| Display name position (centered / left) | enum | `AppBarLeading` | none | No | No alignment prop; trust badge is expected to follow name. |
| Display name typography (color / weight / style / size) | color / enum / slider | `Text`/`Heading` | `color`, `weight`, `size` | Partial | Named tokens; custom font family + arbitrary size are gaps (see Boundary A typography). |
| Razorpay trust mark show/hide | toggle | `TrustBadge` / `AppBarLeading.trustBadgeVariant` | conditional render | Yes | Show/hide is app-level render; component exists. |
| Account icon — style (line/filled) | enum | `Avatar` / `IconButton` + `Icons` | icon choice | No | Icon style variants unsupported (outline only). |
| Account icon — size (S/M/L) | enum | `Avatar` / `IconButton` | `size` | Partial | Named `size` maps loosely to S/M/L. |
| Account icon — container radius | slider (0–100) | `Avatar` / `IconButton` | none | No | No arbitrary container radius. |
| Header background colour | color picker | `AppBar` | `backgroundColor` (token) | Partial | Token-level, limited set. |

#### Price Summary

| Config Property | Config Type | Maps to blade-svelte | Prop / token | Supported | Notes / Gap |
| --- | --- | --- | --- | --- | --- |
| Price summary show/hide | toggle | `Card` region | conditional render | Yes | App-level render. |
| Background (derivative of Primary) | color | `Card` `variant="theme"` | `backgroundColor` (`CardBackgroundColor` tokens) | Partial | Token-level; primary-derived via `brandColor`. Not arbitrary hex. |
| Copy / verbiage | free text | `Text`/`Heading` | `children` | Yes | Text content. |
| Layout options (compact / standard) | enum | `Card` | none | No | No density/layout prop on `Card`. |
| Background style (opaque / tinted / transparent) | enum | `Card` | none | No | Sheet flags V2, "dependent on configurability of Blade Card". Confirmed gap. |
| Typography (size / weight / color) | enum / color | `Text`/`Heading`/`Amount` | `size`, `weight`, `color` | Partial | Named tokens; custom font/arbitrary size are Boundary-A gaps. |

#### Customer Details

| Config Property | Config Type | Maps to blade-svelte | Prop / token | Supported | Notes / Gap |
| --- | --- | --- | --- | --- | --- |
| Customer details show/hide | toggle | `Card` region | conditional render | Yes | App-level. |
| Identifier — phone (lock) / email (show/hide) | enum | `TextInput`/`PhoneNumberInput` | `isDisabled` (lock); conditional render | Partial | Lock ≈ `isDisabled`/read-only; show/hide is app-level. |
| Background | color | `Card` `variant="theme"` | `backgroundColor` (token) | Partial | Same as Price Summary. |
| Copy / verbiage | text | `Text` | `children` | Yes | — |
| Layout options (compact / standard / expanded) | enum | `Card` | none | No | No density prop. |
| Background style (opaque / tinted / transparent) | enum | `Card` | none | No | Same Card gap. |
| Typography (size / weight / color) | enum / color | `Text`/`Heading` | `size`, `weight`, `color` | Partial | See Boundary A. |

#### Message Banner

| Config Property | Config Type | Maps to blade-svelte | Prop / token | Supported | Notes / Gap |
| --- | --- | --- | --- | --- | --- |
| Message banner show/hide | toggle | `AnnouncementBanner` (or `Alert`) | conditional render | Yes | App-level render. |
| Background colour | color | `AnnouncementBanner` | none | No | No `backgroundColor`/`color` prop; `Alert` only has an enum `color`, not custom. |
| Text colour | color | `AnnouncementBanner` | none | No | No text color prop. |
| Verbiage (max 60 chars) | text | `AnnouncementBanner` | `children` | Yes | — |
| Font size (standard / small / big) | enum | `AnnouncementBanner` | none | No | No font-size prop. |
| Font weight (regular / medium / bold) | enum | `AnnouncementBanner` | none | No | No font-weight prop. |
| Banner icon (custom upload) | enum / upload | `AnnouncementBanner.icon` | `icon` (IconComponent) | Partial | Accepts a Blade icon component, not an arbitrary uploaded raster. |

#### Payment Panel

| Config Property | Config Type | Maps to blade-svelte | Prop / token | Supported | Notes / Gap |
| --- | --- | --- | --- | --- | --- |
| Available Offers — verbiage | text | `Text`/`Badge` | `children` | Yes | — |
| Available Offers — behavior (scrollable / wrap) | toggle | `ChipGroup`/`Box` | none | No | No layout/overflow behavior prop. |
| Available Offers — method icon show/hide | toggle | `Chip`/`ActionListItem` | conditional | Partial | App-level render. |
| Available Offers — background colour | color | `Card`/`Box` | token only | Partial | Token-level. |
| Recommended section show/hide | toggle | `Card`/`ActionList` region | conditional render | Yes | App-level. |
| Recommended — label colour | color | `Badge`/`Text` | `color` (token) | Partial | Token-level; no arbitrary hex. Sheet marks "N". |
| Recommended — icon size (24/32/40) | enum | `Avatar`/`Icons` | `size` | Partial | Named sizes; exact px mapping approximate. |
| Recommended — row height (44/52/60) | enum | `ActionListItem`/`Card` | none | No | No row-height/density prop. |
| Recommended — no. of instruments (2–5) | number | app-level (data slice) | — | No | Data/behavior, not a style prop. |
| Recommended / APO — card border style (outlined / shadow / borderless) | enum | `Card` | `variant` (`primary`/`secondary`/`theme`) | No | Variants don't map to outlined/shadow/borderless; no `borderStyle` prop. |
| Recommended / APO — card corner radius | slider | `Card` / theme | `Card.borderRadius` (3 tokens) + `createTheme` | Partial | Token-level; not a free slider. |
| All Payment Options — grid (2×2 / 4×1 / 4×2) | enum | `Box`/`ActionList` grid | none | No | No grid-layout prop; composition. |
| All Payment Options — expanded method | enum | `Accordion` | `defaultExpandedIndex`/`expandedIndex` | Yes | Controls which item is open. |
| All Payment Options — accordion card border style | enum | `Accordion` | `variant` (`filled`/`transparent`), `hasGrayBody` | Partial | Two variants only; no outlined/shadow/borderless. |
| All Payment Options — banner background colour | color | `Alert`/`Box` | token / enum color | Partial | Token-level. |
| Bottom Trust Banner — show/hide | toggle | `TrustBadge` | conditional render | Yes | Component exists. |
| Bottom Trust Banner — T&C link (lock) | — | `Link` | `href` | Partial | Lock is behavioral. |

#### Footer

| Config Property | Config Type | Maps to blade-svelte | Prop / token | Supported | Notes / Gap |
| --- | --- | --- | --- | --- | --- |
| Footer size (medium / large) | enum | none (composition) + `Button.size` | `Button.size` | Partial | No Footer component; size via composition/button size. |
| Footer style (price+plain CTA / full-width CTA+amount) | enum | composition | layout | Partial | Composition of `Amount` + `Button`. |
| Footer background colour | color | `Box` | none (arbitrary hex) | No | Token-level surface only. |
| Footer top border (thin / medium / shadow / none) | enum | `Divider` | `thickness` (`thinner/thin/thick/thicker`), `dividerStyle` | Partial | thin/medium ≈ thickness; **shadow not supported** (only `solid`/`dashed`); none = don't render. |
| Amount display show/hide | toggle | `Amount` | conditional render | Yes | App-level. |
| Amount font size (S/M/L) | slider/enum | `Amount.size` | `size` (`small/medium/large/xlarge`) | Partial | Named sizes; no free slider. |
| Amount font style (custom font) | enum/upload | `Amount` | none | No | No `fontFamily`; inherits theme font (Boundary A gap). |
| Amount font weight (regular/semibold/bold) | enum | `Amount.weight` | `weight` | Partial | `display`/`body` allow `regular/medium/semibold`; **`bold` unavailable**. |
| Amount font color | color | `Amount.color` | `color` (token) | Partial | Token-level; no arbitrary hex. |
| Currency symbol show/hide | toggle | `Amount` | `currencyIndicator`, `suffix` | Partial | Can switch symbol↔code or drop decimals; cannot fully hide the currency indicator. |
| Amount verbiage ("View Details") | text | `Link`/`Text` | `children` | Yes | — |
| CTA — verbiage (Pay Now / custom, max 16) | text | `Button` | `children` | Yes | — |
| CTA — background colour | color | `Button` | `color` (enum) / theme `brandColor` | Partial | `color` is a fixed enum; arbitrary CTA hex only via global `brandColor`. No per-button hex. |
| CTA — text colour | color | `Button` | none (derived) | No | Foreground derived from variant/color; no `textColor` prop. |
| CTA — stroke colour | color | `Button` | none | No | No `borderColor` prop. |
| CTA — stroke width | slider | `Button` | none | No | No `borderWidth` prop. |
| CTA — shape / corner radius | slider | `Button` / theme | `createTheme({ borderRadius })` (global) | Partial | Token-level, global; no per-button `borderRadius`. |
| CTA — button width (full / half) | enum | `Button.isFullWidth` | `isFullWidth` | Partial | Full = `true`; "half" needs a wrapping container width. |
| Disabled CTA — label / bg / text / stroke color / stroke width / font style / weight | text / color / slider / enum | `Button` (`isDisabled`) | `isDisabled` only | No | Disabled visuals are theme-derived; none of the disabled-state colors/stroke/label are configurable props. |

### Boundary C — Transition / Flow Screens (Success / Retry / Payment Processing / Cancel / Exit)

| Config Property | Config Type | Maps to blade-svelte | Prop / token | Supported | Notes / Gap |
| --- | --- | --- | --- | --- | --- |
| Screen container | — | `BottomSheet` + `Card`/`Box` | composition | Yes | Primitives exist. |
| Title / Sub-title / CTA labels (copy) | text | `Heading`/`Text`/`Button` | `children` | Yes | Copy is fully expressible. |
| Primary / Secondary CTA | — | `Button` | `variant`, `onClick` | Yes | Two buttons. |
| Background color | color | `Card`/`Box` | token only | No | Arbitrary hex not supported. |
| Success/processing animation (default) | enum | none | — | No | No animation/Lottie primitive in blade-svelte. `Spinner` covers "processing" spinner only. |
| Custom Lottie upload | upload | none | — | No | No Lottie player component. |
| Icon / Illustration (default + custom upload) | enum / upload | `Icons` (default only) | icon component | No | No `Illustration` primitive; custom raster upload unsupported. |
| Retry method count / order | multi-select / reorder | app-level + `Checkbox`/`ActionList` | data | No | Behavioral/data config, not a style prop. |

### Boundary D — Feature Flags / Behavioral Toggles (no component-style mapping)

These are application/config-plane toggles. They gate rendering/behavior; they are **not** style props on a blade-svelte component. The config UI that sets them may use `Switch`, `Checkbox`, `TextInput` (seconds), `ActionList`, etc.

| Feature (sheet) | Type | blade-svelte relevance |
| --- | --- | --- |
| Saved Instruments — Save Cards checkbox; Show Saved Cards/VPAs | toggle / JFYI | Conditional render of `Checkbox`/saved-instrument list; not a prop. |
| Customer Data — collect email; Mandate Summary; default language | toggle / enum | Conditional render / locale; behavioral. |
| Quick Buy widget | toggle | App-level enable/disable. |
| Timers & Expiry — expiry timer; countdown (seconds) | toggle / integer | Behavioral; UI shows a `Text`/`Counter`-style timer. |
| Retry Settings — retry payment; count; method count/order | toggle / integer / list | Behavioral/data. |
| Screen Toggles — exit page enable/disable | toggle | Gates Boundary-C exit screen. |
| UX Features — Native OTP; Show Outage Message; UPI QR on mWeb | none / toggle | Behavioral; some non-editable (JFYI). |

---

## 4. Configurability gap analysis (grouped by component)

The properties below are **not** expressible with the current blade-svelte props/API and need new props or theme hooks. This is the actionable backlog to "enable configurability".

### `createTheme` / `BladeProvider` (global theme) — highest leverage
- **Custom font family + custom @font-face upload.** `createTheme` accepts only `brandColor` and `borderRadius`. Need a `fontFamily` override (and a way to register uploaded fonts) so the "Font Style dropdown + custom" spec cascades. Affects Typography, Amount, Button, everywhere.
- **Arbitrary surface/background colors.** Only the primary palette is derived (from `brandColor`). Page/section/banner/footer "colour picker" values need a broader surface-token override API (or accept raw hex on the relevant components).
- **Typography size scale override.** No friendly API to shift the size scale; only named sizes exist. Needed for "Font Size slider".

### `Icons`
- `style` (outline / solid / dual), `strokeWidth`, and arbitrary `color` (hex). Today only `color` (token) + `size`. Sheet itself notes "Blade only supports outline" — this is a whole-icon-set gap, not just a prop.

### `Button` (CTA + disabled CTA)
- Arbitrary `backgroundColor`, `textColor`, `borderColor` (stroke), `borderWidth` (stroke width), per-button `borderRadius`.
- Disabled-state overrides: `disabledLabel`, disabled `backgroundColor`/`textColor`/`borderColor`/`borderWidth`/font weight/style.
- "Half width" convenience (only `isFullWidth` boolean exists today).
- Note: `color` is a fixed enum (`primary`/`white`/`positive`/…); brand color is the only route to a custom CTA color today, and it is global.

### `Card` (Price Summary, Customer Details, Payment widgets)
- `borderStyle` / variant for **outlined / shadow / borderless** (current `variant` is `primary`/`secondary`/`theme`).
- Layout **density** (compact / standard / expanded).
- **Background style** opaque / tinted / transparent (explicitly flagged V2 in the sheet).
- Free `borderRadius` beyond the 3 tokens (`medium`/`large`/`xlarge`) if per-card radius (not global token) is required.
- Arbitrary `backgroundColor` hex (today: limited `CardBackgroundColor` tokens on `variant="theme"`).

### `AnnouncementBanner` (Message Banner)
- `backgroundColor`, text `color`, `fontSize`, `fontWeight`, and custom (raster) banner icon. Today only `children`, `alignment`, `icon` (Blade icon component), `accessibilityLabel`. (`Alert` is close but its `color` is a fixed enum, still no custom hex/size/weight.)

### `Amount` (Footer amount display)
- Ability to fully **hide the currency indicator** (today `currencyIndicator` only switches symbol↔code; `suffix:'none'` only drops decimals).
- `fontFamily` (custom font) and `bold` weight for `display`/`body` types.
- Arbitrary color (today token-based `color` only).

### `Text` / `Heading`
- Expose `fontFamily` on the public API (only `BaseText` has it) and support arbitrary font size (slider) + arbitrary hex color. Today: named `size`, subset `weight`, token `color`.

### `Avatar` (logo / account icon container)
- Arbitrary corner radius (logo/icon "container radius" slider 0–100). Today only `variant: circle | square`.
- Icon `style` (line / filled) — depends on the `Icons` gap above.

### `Divider` (Footer top border)
- `shadow` border style (today `dividerStyle` is `solid | dashed` only). "medium" maps loosely to `thickness`.

### `AppBar` (Header)
- Display-name **alignment** (centered / left).
- Arbitrary background hex (today `backgroundColor` is a 5-token enum).

### `TextInput` (and other inputs)
- `variant` / `inputStyle` for **bottom-line** vs box style. Today box style only.

### Missing components (composition gaps, not prop gaps)
- No `Footer`, `Header`, or `PriceSummary` container component — these regions are hand-composed. A configurable `Footer` (size/style/border/bg + amount + CTA) would centralize many Footer rows above.
- No **animation / Lottie** primitive and no **Illustration** primitive — blocks the Transition-screen animation/illustration/custom-upload config entirely (`Spinner` only covers the processing spinner).
- No layout primitive with a `grid` preset for the "2×2 / 4×1 / 4×2" payment-option grid or offer "scrollable/wrap" behavior.

---

## 5. Assumptions & open questions

- **"Show/Hide" toggles are app-level.** I treated per-section visibility (Price Summary, Customer Details, Recommended, Trust Banner, Amount display, etc.) as conditional rendering by the host app, not as a prop to add to the component. If the design system is expected to own a `isVisible`/`hidden` prop convention, that changes several "Yes" rows.
- **"Derivative of Primary Color" == `brandColor`.** I assumed Price Summary / Customer Details backgrounds and the primary-derived font colors are produced by `createTheme({ brandColor })` and its generated palette (`interactive`/`surface` primary tokens), not by arbitrary per-element hex. Confirm whether merchants can pick truly arbitrary hex per element (which is a much larger token/override effort).
- **Corner radius is global by design.** `createTheme` overrides the radius *scale*, so "Cards", "Buttons", and "Icon containers" radii are not independently sliderable today. Open question: do we want per-surface radius props, or is one global scale acceptable (sheet says "This should happen for all the widgets and not for individual level" for card border/radius, which supports global)?
- **Icon set is outline-only.** The solid/dual styles and stroke-width control require shipping additional icon variants, not just a prop — confirmed by the sheet's own note. Scope/effort is large.
- **No Lottie/animation/illustration primitives exist.** Transition-screen animations, custom Lottie upload, and custom illustrations are unsupported today; these likely need new components or an asset-slot pattern rather than props on existing components.
- **Font size "slider (min–max)".** blade-svelte exposes named sizes only. Assumed we either (a) map slider stops to named tokens, or (b) extend the theme size scale. Which one is the product intent?
- **Footer/Header have no dedicated components.** Mapping assumes composition of `AppBar`/`Box`/`Amount`/`Button`/`Divider`. If a configurable `Footer`/`Header` component is desired, that's net-new.
- **Blank cells in the sheet** (`Is Currently Supported`, `Effort` for many Section/Feature rows) were left as inferred "Partial/No" based on the actual component API; where the sheet explicitly said `yes/no/partial` I used that.
- The sheet's `Config Type` column is occasionally mis-labeled (e.g. a "color" row typed as `enum`, a "text" row typed as `color`); I mapped by the property's real intent, not the literal cell.
