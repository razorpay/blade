# Menu

<img alt="Menu Overview Image" src="overview.png" width="300px" />

## Usage

```jsx
<Menu>
  <Button>Open Menu</Button>
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

## Questions you might have

## Menu vs Dropdown

### Challenges of adding this to Dropdown

Before we get into API Decisions, you're probably wondering why Menu is a different component than our existing Dropdown.

We started Dropdown with SelectInput and AutoComplete-like usecases (basically Combobox usecases), so Dropdown includes all the code that's needed for selection, typeahead, arrow navigations, AutoComplete's filtering, etc.

Since our usecases of Menu were simple and small, we added triggers like DropdownButton, DropdownLink to also handle some of the menu cases inside our existing Dropdown.

But as we move into the next set of Menu usecases, we see the complexity of Menu increasing exponentially. Adding these usecases to Dropdown would mean- bloating dropdown with more unrelated code and bundle-size, ending up with inifinite edge cases, complex keyboard navigations for consumers, and bunch of if-else conditions internally to handle 2 very different usecases.

### Two Different Usecases

Normally you would see design-systems having 2 components. 1 for SelectInput, AutoComplete, etc and 2nd for Menu, ContextMenu, ActionMenu, etc

Examples

- [Primer SelectPanel](https://primer.style/components/selectpanel/react/alpha), [Primer ActionMenu](https://primer.style/components/action-menu/react/beta), [Primer ActionList]()
- [Ariakit Select](https://ariakit.org/components/select), [Ariakit Combobox](https://ariakit.org/components/combobox), [Ariakit Menu](https://ariakit.org/components/menu)

Going forward, our Dropdown component will continue to cover SelectInput, AutoComplete, etc usecases where selections are happening.

And Menu will cover usecases which trigger certain actions, has complex interactive / non-interactive things inside the Overlay, requires submenus, custom triggers, etc.

![alt text](image.png)
