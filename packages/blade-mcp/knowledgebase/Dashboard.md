## Component Name

Dashboard

## Description

The Dashboard pattern is designed for displaying a dashboard layout with a sidebar, avatar menu, and a main content area.

## Example

Here's a rough layout of the dashboard. Refer to component docs of SideNav, TopNav, Breadcrump and Box for more details.

```tsx
<Box display="flex" flexDirection="row" height="100%">
  <BladeTopNav />
  <Box display="flex" flexDirection="column">
    <BladeSideNav />
    <Box flex="1" overflowY="auto">
      <BladeBreadcrumb />
      <Box as="section">main content area</Box>
    </Box>
  </Box>
</Box>
```
