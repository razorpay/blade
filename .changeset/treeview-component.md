---
'@razorpay/blade': minor
---

feat(TreeView): add TreeView component

Adds a new `TreeView` component for displaying hierarchical/nested data with:
- Expand/collapse nodes
- Single and multiple selection support
- Controlled and uncontrolled modes for both selection and expansion
- Keyboard navigation (Enter, Space, ArrowRight, ArrowLeft)
- ARIA tree/treeitem roles for accessibility
- Optional icon and trailing slot per node
- Disabled state support

**Usage:**
```jsx
<TreeView selectionType="single" onSelectionChange={({ selectedIds }) => console.log(selectedIds)}>
  <TreeViewItem id="src" label="src" icon={FolderIcon}>
    <TreeViewItem id="button" label="Button.tsx" icon={FileTextIcon} />
  </TreeViewItem>
  <TreeViewItem id="readme" label="README.md" icon={FileTextIcon} />
</TreeView>
```
