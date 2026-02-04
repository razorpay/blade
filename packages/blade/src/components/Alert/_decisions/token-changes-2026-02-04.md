# Alert Component - Token Changes

**Date:** 2026-02-04  
**Figma URL:** https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=73292-71669&m=dev  
**Component:** Alert

---

## Summary

This document outlines the design token changes identified between the old Alert design and the new Figma design update.

---

## Token Changes Overview

| Category | Token Path | Old Value | New Value | Status |
|----------|------------|-----------|-----------|--------|
| Border | `feedback.border.[color].subtle` | Applied on subtle variants | Not applied | **Removed** |
| Border Radius | `border.radius.medium` | `12px` | `12px` | Unchanged |
| Background (Subtle) | `feedback.background.[color].subtle` | Light tinted bg | Light tinted bg | Unchanged |
| Background (Intense) | `feedback.background.[color].intense` | Solid colored bg | Solid colored bg | Unchanged |
| Text Color (Subtle) | `surface.text.gray.subtle` | Gray text | Gray text | Unchanged |
| Text Color (Intense) | `surface.text.staticWhite.normal` | White text | White text | Unchanged |
| Icon Color (Subtle) | `feedback.icon.[color].intense` | Colored icon | Colored icon | Unchanged |
| Icon Color (Intense) | `surface.icon.staticWhite.normal` | White icon | White icon | Unchanged |
| Padding | `spacing.4` | `12px` | `12px` | Unchanged |

---

## Detailed Changes

### 1. Border Removal (Subtle Variants)

**Change Type:** Removal

**Old Design:**
- Subtle variants had a visible colored border matching the intent color
- Border used `feedback.border.[color].subtle` token

**New Design:**
- No border on subtle variants
- Only background color differentiation

**Code Location:** `packages/blade/src/components/Alert/styles.ts`

**Current Implementation (Already Correct):**
```typescript
// No border property is applied - matches new design
return {
  background: theme.colors.feedback.background[color][emphasis],
  padding: makeSpace(theme.spacing[4]),
  borderRadius: makeBorderSize(
    isFullWidth ? theme.border.radius.none : theme.border.radius.medium,
  ),
  // ... no border property
};
```

**Action Required:** None - current implementation already matches new design

---

### 2. Background Tokens

**Change Type:** No Change

| Intent | Emphasis | Token | Usage |
|--------|----------|-------|-------|
| positive | subtle | `feedback.background.positive.subtle` | Light green background |
| positive | intense | `feedback.background.positive.intense` | Solid green background |
| negative | subtle | `feedback.background.negative.subtle` | Light red background |
| negative | intense | `feedback.background.negative.intense` | Solid red background |
| notice | subtle | `feedback.background.notice.subtle` | Light yellow/orange background |
| notice | intense | `feedback.background.notice.intense` | Solid yellow/orange background |
| information | subtle | `feedback.background.information.subtle` | Light blue background |
| information | intense | `feedback.background.information.intense` | Solid blue background |
| neutral | subtle | `feedback.background.neutral.subtle` | Light gray background |
| neutral | intense | `feedback.background.neutral.intense` | Solid gray background |

**Code Location:** `packages/blade/src/components/Alert/styles.ts` (line 15)

---

### 3. Text Color Tokens

**Change Type:** No Change

| Emphasis | Token | Description |
|----------|-------|-------------|
| subtle | `surface.text.gray.subtle` | Dark gray text on light backgrounds |
| intense | `surface.text.staticWhite.normal` | White text on solid colored backgrounds |

**Code Location:** `packages/blade/src/components/Alert/Alert.tsx` (lines 197-198)

```typescript
const textColor =
  emphasis === 'intense' ? 'surface.text.staticWhite.normal' : 'surface.text.gray.subtle';
```

---

### 4. Icon Color Tokens

**Change Type:** No Change

| Emphasis | Token | Description |
|----------|-------|-------------|
| subtle | `feedback.icon.[color].intense` | Colored icon matching intent |
| intense | `surface.icon.staticWhite.normal` | White icon on solid backgrounds |

**Code Location:** `packages/blade/src/components/Alert/Alert.tsx` (lines 186-193)

```typescript
<Icon
  color={
    emphasis === 'intense'
      ? 'surface.icon.staticWhite.normal'
      : `feedback.icon.${color}.${emphasis === 'subtle' ? 'intense' : 'subtle'}`
  }
  size="medium"
/>
```

---

### 5. Button/Action Tokens

**Change Type:** No Change

| Element | Emphasis | Token/Prop | Description |
|---------|----------|------------|-------------|
| Primary Button | subtle | `color={color}` variant="secondary" | Outlined button with intent color |
| Primary Button | intense | `color="white"` variant="secondary" | White outlined button |
| Secondary Link | subtle | `color={color}` | Link with intent color |
| Secondary Link | intense | `color="white"` | White link |

**Code Location:** `packages/blade/src/components/Alert/Alert.tsx` (lines 220-228, 252-258)

---

### 6. Spacing Tokens

**Change Type:** No Change

| Property | Token | Value | Location |
|----------|-------|-------|----------|
| Container Padding | `spacing.4` | 12px | StyledAlert |
| Icon-to-Content Gap | `spacing.3` / `spacing.4` | 8px / 12px | BaseBox paddingLeft |
| Title-to-Description Gap | `spacing.2` | 4px | Title marginBottom |
| Actions Margin Top | `spacing.4` | 12px | actionsVertical |
| Primary-Secondary Gap | `spacing.5` | 16px | primaryAction marginRight |

---

### 7. Size Tokens

**Change Type:** No Change

| Property | Token/Value | Description |
|----------|-------------|-------------|
| Max Width | `584px` (size[584]) | Default max width for non-full-width alerts |
| Icon Size | `medium` | Standard icon size |
| Close Button Size | `large` | IconButton size for dismiss |

---

## Visual Comparison

### Old Design (Screenshot Reference)
- Subtle variants: Light background **WITH** colored border
- Intense variants: Solid background with highlighted "Alert" badge in title
- Full-width variant: Horizontal layout, borderless

### New Design (Figma)
- Subtle variants: Light background **WITHOUT** border
- Intense variants: Solid background, plain title text
- Full-width variant: Horizontal layout, borderless (unchanged)

---

## Migration Notes

### For Consumers
No breaking changes - the component API remains the same.

### For Maintainers
1. The current implementation already matches the new design (no borders applied)
2. If borders were ever added, they should be removed to match Figma
3. Test snapshots may need updating if visual tests capture border differences

---

## Files Affected

| File | Change Required |
|------|-----------------|
| `Alert.tsx` | None |
| `styles.ts` | None |
| `types.ts` | None |
| `__tests__/*.snap` | May need update if visually different |

---

## Verification Checklist

- [ ] Compare subtle variant backgrounds with Figma
- [ ] Verify no border is rendered on subtle variants
- [ ] Check intense variant backgrounds match Figma
- [ ] Verify text colors contrast correctly
- [ ] Test all 5 color intents (positive, negative, notice, information, neutral)
- [ ] Test both emphasis levels (subtle, intense)
- [ ] Verify full-width variant layout
- [ ] Run visual regression tests

---

## References

- **Figma Design:** https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=73292-71669&m=dev
- **Component Docs:** `packages/blade/src/components/Alert/_decisions/decisions.md`
- **Storybook:** `http://localhost:9009/?path=/docs/components-alert--docs`
