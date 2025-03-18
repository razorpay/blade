# Detailed View Pattern API Decision

> [!NOTE]
>
> Questions like what is pattern, why are we building these patterns, and scope of pattern are answered in [pattern-terminology.md](https://github.com/razorpay/blade/blob/e58edf015d2062bd51374c5a7024a85adc13f636/packages/blade/src/components/ListView/_decisions/pattern-terminology.md)

Detailed View Pattern is UI pattern in Razorpay which is used to display detailed information about merchant, some row item from table, or extended information.

## API

> **Note**
>
> Unlike ListView, there aren't enough reasons to create Layout component for DetailedView. More about this is discussed in

```jsx
// Table Code
<TableRow onClick={() => setIsDrawerOpen(true)} />
// Table Code

<Drawer isOpen={isDrawerOpen}>
  {/* Custom Blade Components */}
</Drawer>

```

## Enhancements / Components

- Enhancements:
  - Drawer
  - Collapsible StepGroup

### Drawer Enhancements

```jsx
<Drawer>
  <DrawerHeader>{/* Custom Drawer Header */}</DrawerHeader>
  <DrawerBody></DrawerBody>
  <DrawerFooter></DrawerFooter>
</Drawer>
```

## Accessibility

- All interactive items like Filters, Search, Button should be focussable
- Dropdown's keyboard navigation should continue to work the same way for FilterChip as it does for other triggers like Select

## Open Questions

- ### Naming `QuickView` vs `DetailedView`

## References

--
