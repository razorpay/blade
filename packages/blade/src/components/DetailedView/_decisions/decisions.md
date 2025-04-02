# Detailed View Pattern API Decision

> [!NOTE]
>
> Questions like what is pattern, why are we building these patterns, and scope of pattern are answered in [pattern-terminology.md](https://github.com/razorpay/blade/blob/e58edf015d2062bd51374c5a7024a85adc13f636/packages/blade/src/components/ListView/_decisions/pattern-terminology.md)

Detailed View Pattern is UI pattern in Razorpay which is used to display detailed information about merchant, some row item from table, or extended information.

## API

> **Note**
>
> Unlike ListView, there aren't enough reasons to create Layout component for DetailedView. More about this is discussed in [pattern-terminology.md](https://github.com/razorpay/blade/blob/e58edf015d2062bd51374c5a7024a85adc13f636/packages/blade/src/components/ListView/_decisions/pattern-terminology.md)

```jsx
// Table Code
<TableRow onClick={() => setIsDrawerOpen(true)} />
// Table Code

<Drawer isOpen={isDrawerOpen}>
  <DrawerHeader>{/* Custom header */}</DrawerHeader>
  <DrawerBody>
  </DrawerBody>
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

### Collapsible StepGroup Enhancement

```jsx
<StepGroup>
  <StepItem />
  <StepItem />
  <Collapsible>
    <CollapsibleLink>Toggle timeline</CollapsibleLink>
    <CollapsibleBody>
      <StepItem />
      <StepItem />
    </CollapsibleBody>
  </Collapsible>
</StepGroup>
```

## Accessibility

- Should continue to follow accessibility of its individual items like Drawer, StepGroup, etc

## Open Questions

- ### Naming `QuickView` vs `DetailedView`

  We're going with DetailedView because its more familiar name. Name on dev-side is irrelevant because we don't have layout component in detailed view

## References

--
