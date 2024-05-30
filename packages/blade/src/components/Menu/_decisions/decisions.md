# Menu

```jsx
<Menu title="Edit">
  <Button>Hi</Button>
  <MenuOverlay>
    <Box display="flex" paddingY="spacing.4" gap="spacing.2">
      <Avatar name="Saurabh Daware" />
      <Text>Saurabh Daware</Text>
    </Box>
    <MenuItem title="Undo" onClick={() => console.log('Undo')} />
    <MenuItem title="Redo" disabled />
    <MenuItem title="Cut" />
    <Menu>
      <MenuItem title="Copy" />
      <MenuOverlay>
        <MenuItem title="Text" />
        <MenuItem title="Video" />
        <MenuItem title="Audio" />
      </MenuOverlay>
    </Menu>
    <Menu>
      <MenuItem title="Share" />
      <MenuOverlay>
        <MenuItem title="Text" />
        <MenuItem title="Video" />
        <MenuItem title="Audio" />
      </MenuOverlay>
    </Menu>
    <Button>Apply</Button>
  </MenuOverlay>
</Menu>
```
