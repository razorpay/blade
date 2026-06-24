# Quick Start - Next Session

## 🎯 Mission
Author rich previews for 29 core components, then upload to Claude Design.

## ⚡ Fastest Path

```bash
cd /Users/saurav.rastogi/Downloads/saurav/RZP/development/blade

# 1. Read the resume
cat .design-sync/RESUME.md

# 2. Start with Button preview
# Author: .design-sync/previews/Button.tsx
# Examples in: packages/blade/src/components/Button/Button/Button.stories.tsx

# 3. Rebuild just Button
cd .ds-sync && node lib/preview-rebuild.mjs --config ../.design-sync/config.json --node-modules ../packages/blade/node_modules --out ../ds-bundle --components Button

# 4. Capture & grade
node package-capture.mjs --out ../ds-bundle --components Button

# 5. View the sheet
open ../ds-bundle/_screenshots/review/general__Button.png

# 6. Repeat for TextInput & Alert (calibration trio)

# 7. Fan out remaining 26 to subagents
```

## 📋 Core 29 Components
Button, TextInput, TextArea, Checkbox, Radio, Dropdown, SearchInput, PasswordInput, Alert, Badge, Spinner, ProgressBar, Card, Box, Divider, Tabs, Modal, Link, Breadcrumb, BottomNav, TopNav, Table, Avatar, Amount, List, Accordion, Tooltip, Popover, Menu

## ⚠️ Critical Reminders
1. **Revert package.json** before final commit (root `types` field is temporary)
2. **Subagents use scoped commands** only (never full rebuild)
3. **Grade every cell** before moving to next component
4. **Merge learnings** before upload

## 📊 Current State
✅ 666 components bundled (7.1MB)  
✅ 663/666 render cleanly  
⏳ 29 previews to author  
⏳ 3 issues to fix  
⏳ Upload to Claude Design
