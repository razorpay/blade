---
description: Guidelines and patterns for adding React Native support (.native.tsx) to Blade components that currently only have web implementations.
---

# Blade React Native Migration — Critical Rules

> Include this file at the start of every agent prompt.

## Architecture

- Mirror the web component's file split: if web has `StyledX.web.tsx`, create `StyledX.native.tsx`
- Shared logic stays in unsuffixed files (`.tsx` / `.ts`) — NEVER duplicate it
- Platform-specific rendering goes in `.native.tsx` files
- Style computation functions (`getStyledX.ts`, `*Tokens.ts`) are SHARED — import directly
- Types in `types.ts` use `Platform.Select<{web: ..., native: ...}>` for platform-divergent types
- Native tests go in `__tests__/Component.native.test.tsx`
- If a file has no suffix but is web-only (uses `styled-components`, HTML elements): rename to `.web.tsx` first, then create `.native.tsx`

## Element Mapping (HTML to React Native)

| HTML/Web | React Native | Notes |
|----------|-------------|-------|
| `<div>` | `<View>` | Or use `BaseBox` (already cross-platform) |
| `<span>` (text) | `<Text>` | RN crashes without Text wrapper for strings |
| `<button>` | `<Pressable>` | NOT TouchableOpacity (deprecated) |
| `<input>` | `<TextInput>` | From react-native |
| `<a href>` | `<Pressable>` + `Linking.openURL()` | |
| `<img>` | `<Image>` | `source={{ uri }}` not `src` |
| `<svg>` | `react-native-svg` components | |
| `<ul>/<ol>` | `<FlatList>` or mapped `<View>` | |
| `<label>` | `<Text>` | Wrap label text |
| `<select>` | Custom picker or `ActionList` | No native HTML select |

## Styling Rules

- Use `styled-components/native`: `import styled from 'styled-components/native'`
- Styled components wrap RN primitives: `styled(View)`, `styled(Pressable)`, `styled(Animated.View)`
- Style values are NUMBERS for dimensions: `width: 24` not `width: '24px'`
- Use `useTheme()` from `~components/BladeProvider` for runtime token access
- Use `getIn(theme, 'path.to.token')` for deep token lookups
- Use `useStyledProps(props)` for handling styled prop overrides (margin, padding, etc.)
- `flexDirection` defaults to `'column'` in RN (not `'row'` like web CSS)
- Repeated inline items must stay inside the phone viewport. Use `flexWrap: 'wrap'` on row/group containers unless the component is explicitly designed for horizontal scrolling.
- When labels can be long, combine `flexShrink: 1`, `numberOfLines`, or wrapping with explicit row constraints so trailing items do not get pushed off-screen.

## Unsupported CSS Properties (remove or replace)

| Web CSS | Native Replacement | Notes |
|---------|-------------------|-------|
| `boxShadow` (inset) | Remove entirely | Not parseable by css-to-react-native |
| `boxShadow` (outer) | iOS: `shadow*` props, Android: `elevation` | Use `castElevation()` utility |
| `transition: all Xms` | `react-native-reanimated` | `withTiming`, `withSpring` |
| CSS `@keyframes` | `react-native-reanimated` | `useAnimatedStyle` loops |
| `:hover` | `onPressIn`/`onPressOut` or remove | No hover on touch devices |
| `:focus` | `onFocus`/`onBlur` | Limited to inputs |
| `::before` / `::after` | Additional `<View>` elements | Pseudo-elements don't exist |
| `cursor` | Remove | Not applicable |
| `width: fit-content` | Remove or `alignSelf: 'flex-start'` | |
| `overflow: hidden` + `borderRadius` | Keep, but explicit on both parent AND child for Android | Android clipping quirk |
| `outline` | Remove or use border | |
| `text-overflow: ellipsis` | `numberOfLines={1}` on `<Text>` | |
| CSS Grid | Flexbox only | No grid in RN |
| `position: fixed` | `position: 'absolute'` | No fixed positioning in RN |
| `z-index` | Works but limited scope | Only applies to siblings |
| `calc()` | Pre-compute or use JS | No CSS calc |

## Animation Pattern (react-native-reanimated)

```tsx
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
  Easing,
} from 'react-native-reanimated';
import getIn from '~utils/lodashButBetter/get';
import { useTheme } from '~components/BladeProvider';

const AnimatedX = ({ isActive, children }) => {
  const { theme } = useTheme();
  const progress = useSharedValue(isActive ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(isActive ? 1 : 0, {
      duration: getIn(theme.motion, 'duration.moderate'),
      easing: Easing.bezier(...getIn(theme.motion, 'easing.standard.effective')),
    });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.95 + progress.value * 0.05 }],
  }));

  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};
```

## Event Handling

| Web Event | Native Event | Type Change |
|-----------|-------------|-------------|
| `onClick` | `onPress` | `MouseEvent` → `GestureResponderEvent` |
| `onMouseEnter` | Remove (or `onPressIn` for press feedback) | N/A on touch |
| `onMouseLeave` | Remove (or `onPressOut`) | N/A on touch |
| `onFocus` / `onBlur` | Same | Works on TextInput |
| `onChange` (input) | `onChangeText` | Receives `string`, not event |
| `onKeyDown` | `onSubmitEditing` or remove | No keyboard events |
| `onScroll` | `onScroll` | Same, via ScrollView |

## Platform Type Pattern

```typescript
// In types.ts — Platform.Select for divergent types
import type { Platform } from '~utils';

type ComponentProps = {
  onClick?: Platform.Select<{
    web: (event: React.MouseEvent<HTMLElement>) => void;
    native: (event: GestureResponderEvent) => void;
  }>;
};

// In .native.tsx — use castNativeType for safe prop casting
import { castNativeType } from '~utils';
```

## Blade Components Available on Native (DO NOT reimplement)

These already work cross-platform — import directly:
- Box, BaseBox, View primitives
- Text, Heading, Display, Code (typography)
- Button, IconButton, Link
- TextInput, PasswordInput, OTPInput, SearchInput, TextArea
- Checkbox, Radio, Switch
- Badge, Counter, Indicator, Tag, Chip
- Card, Divider, Accordion
- Spinner, ProgressBar, Alert
- Amount, List, Table
- Modal, BottomSheet, Tooltip, Popover
- Tabs, BottomNav, Carousel
- Avatar, AvatarGroup
- Icons (all from `@razorpay/blade/components`)

## Native Dependencies (common)

| Package | Use Case |
|---------|----------|
| `react-native-reanimated` | All animations |
| `react-native-gesture-handler` | Complex gestures (pan, swipe, long press) |
| `react-native-svg` | SVG rendering |
| `@floating-ui/react-native` | Tooltip/Popover/Dropdown positioning |
| `react-native-pager-view` | Swipeable tab content |
| `@gorhom/bottom-sheet` | Bottom sheet overlays |
| `@gorhom/portal` | Portals for overlays |

## Testing Pattern

```tsx
import { ComponentName } from '../ComponentName';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<ComponentName />', () => {
  it('should render with default props', () => {
    const { toJSON } = renderWithTheme(<ComponentName>Label</ComponentName>);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should handle press', () => {
    const onPress = jest.fn();
    const { getByRole } = renderWithTheme(
      <ComponentName onClick={onPress}>Click</ComponentName>
    );
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

## Key Commands

| Task | Command |
|------|---------|
| Native typecheck | `cd packages/blade && yarn types:typecheck:native` |
| Native tests (all) | `cd packages/blade && yarn test:react-native` |
| Native tests (one) | `cd packages/blade && yarn test:react-native {Name}` |
| Update snapshots | `cd packages/blade && yarn test:react-native {Name} -u` |
| Build native | `cd packages/blade && FRAMEWORK=REACT_NATIVE yarn build` |

## Known Platform Gotchas (from past sessions)

| Issue | Platform | Fix |
|-------|----------|-----|
| Text not vertically centered in small containers | iOS | Add `paddingBottom: 0.5` or adjust `lineHeight` |
| Border-radius overflow (white bleed on selected state) | Android | Explicit `overflow: 'hidden'` on BOTH parent and child |
| Inline chips/tags/buttons cut off at screen edge | Both | Add `flexWrap: 'wrap'` to every row/group layer, pass wrap props through nested selector groups, or use intentional horizontal scroll only when API/design requires it |
| Switch slider stuck in middle | Both | Verify `interpolate` output range matches full track width |
| Tabs indicator wrong position | Both | Ensure `onLayout` width measurements update state correctly |
| Tooltip/Popover positioning off | Android | Check `@floating-ui/react-native` y-offset includes status bar height |
| styled-components document error | Both | Ensure `styled-components/native` import, not `styled-components` |

## Key References

- Existing native patterns: `packages/blade/src/components/Button/BaseButton/StyledBaseButton.native.tsx`
- Animation reference: `packages/blade/src/components/Switch/AnimatedThumb.native.tsx`
- Test utility: `packages/blade/src/utils/testing/renderWithTheme.native.tsx`
- Platform types: `packages/blade/src/utils/platform/platform.all.ts`
- Theme access: `useTheme()` from `~components/BladeProvider`
- Stub pattern: grep for `throwBladeError` in `.native.tsx` files
