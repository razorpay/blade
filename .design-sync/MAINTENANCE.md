# Design Sync Maintenance Guide

## Quick Cleanup (After Each Sync Session)

Remove temporary build artifacts while keeping source files:

```bash
# From repo root
rm -rf .ds-sync/
rm -rf ds-bundle/

# Verify cleanup
git status --short
# Should only show .design-sync/ changes (if any updates were made)
```

## Update Previews for New Components

When adding previews for additional components:

### 1. Add Component to List
Edit `.design-sync/core-components.md` and add the new component name.

### 2. Author Preview File
Create `.design-sync/previews/NewComponent.tsx`:

```tsx
import React from 'react';
import { NewComponent } from '@razorpay/blade/components';

export const Default = () => (
  <NewComponent prop="value">Content</NewComponent>
);

export const Variant = () => (
  <NewComponent variant="secondary">Content</NewComponent>
);
```

### 3. Download Converter Scripts (First Time Only)
If you deleted `.ds-sync/` after previous session:

```bash
# You'll need to re-download the design-sync converter scripts
# Check .design-sync/NOTES.md "Setup" section for original download method
# Or ask for the scripts to be re-staged
```

**Alternative**: Keep `.ds-sync/` locally but gitignored (recommended for frequent updates).

### 4. Rebuild Component
```bash
node .ds-sync/lib/preview-rebuild.mjs \
  --config .design-sync/config.json \
  --node-modules packages/blade/node_modules \
  --out ds-bundle \
  --components NewComponent
```

### 5. Visual Review
```bash
# Start server (if not already running)
node .ds-sync/storybook/http-serve.mjs ./ds-bundle

# Open in browser
# http://127.0.0.1:<port>/components/<group>/NewComponent/NewComponent.html
```

### 6. Grade Against Rubric
Check preview meets criteria:
- ✅ **Styled**: DS tokens visible (not browser defaults)
- ✅ **Complete**: No missing compositions or warnings
- ✅ **Plausible**: Realistic Razorpay domain content

### 7. Commit to Branch
```bash
git checkout design-sync/claude-design-previews
git add .design-sync/previews/NewComponent.tsx
git add .design-sync/core-components.md
git commit -m "feat(design-sync): Add NewComponent preview"
git push
```

## Full Rebuild (All Components)

If you need to rebuild all 29 components (e.g., after Blade version upgrade):

```bash
# Rebuild all previews
node .ds-sync/lib/preview-rebuild.mjs \
  --config .design-sync/config.json \
  --node-modules packages/blade/node_modules \
  --out ds-bundle \
  --components $(cat .design-sync/core-components.md | grep "^-" | sed 's/^- //' | tr '\n' ',' | sed 's/,$//')

# Or rebuild everything from scratch
cd .ds-sync
node package-build.mjs \
  --config ../.design-sync/config.json \
  --node-modules ../packages/blade/node_modules \
  --entry ../packages/blade/components.js \
  --out ../ds-bundle
```

## Upload New Bundle to Claude Design

After rebuilding:

1. **Re-upload bundle**: Upload `ds-bundle/` to the same Claude Design project
2. **Incremental or full**: Claude Design should detect changed components
3. **Verify**: Spot-check updated components in Claude Design

## Keeping Converter Scripts Between Sessions

**Option 1: Keep .ds-sync locally (gitignored)**
```bash
# Don't delete .ds-sync/ after sessions
# .gitignore already excludes it from git
# Faster for future updates (no re-download needed)
```

**Option 2: Archive and restore**
```bash
# After session, archive for later
tar -czf design-sync-tools.tar.gz .ds-sync/

# Before next session, restore
tar -xzf design-sync-tools.tar.gz

# Add to .gitignore
echo "design-sync-tools.tar.gz" >> .gitignore
```

**Option 3: Re-download each time**
```bash
# Delete after each session, re-download when needed
# Cleanest but requires re-setup
```

**Recommendation**: Use Option 1 (keep .ds-sync locally, gitignored).

## Troubleshooting

### "Cannot find module" errors during rebuild
**Cause**: `.ds-sync/` was deleted  
**Fix**: Re-download converter scripts or restore from archive

### "Preview not found" during rebuild
**Cause**: Preview file missing or wrong location  
**Fix**: Ensure preview is in `.design-sync/previews/ComponentName.tsx`

### Component renders blank in HTML
**Cause**: Missing parent context or incorrect composition  
**Fix**: Check `.design-sync/NOTES.md` for composition patterns, refer to component stories

### Build succeeds but visual looks wrong
**Cause**: Missing props or incorrect variant  
**Fix**: Compare against component `.d.ts` types and story examples

## File Organization

### Keep These (committed to git)
```
.design-sync/
├── config.json              # Build configuration
├── NOTES.md                 # Patterns and learnings
├── RESUME.md                # Session history
├── core-components.md       # Component list
├── previews/                # Preview source files (29 files)
│   ├── Button.tsx
│   ├── TextInput.tsx
│   └── ...
└── MAINTENANCE.md           # This file
```

### Delete These After Session (gitignored)
```
.ds-sync/                    # Converter scripts (200KB)
├── package-build.mjs
├── package-validate.mjs
└── lib/preview-rebuild.mjs

ds-bundle/                   # Build output (7+ MB)
├── _ds_bundle.js
├── components/
└── _screenshots/
```

### Modified During Session (revert after)
```
packages/blade/.storybook/react/main.ts  # May have temporary patches
packages/blade/package.json              # Should be reverted (CRITICAL)
```

## Version Compatibility

**Blade version used**: 12.107.1  
**Converter version**: design-sync non-storybook converter (2026-06-19)

If Blade is upgraded significantly:
1. Test rebuild with existing previews
2. Check for breaking API changes in components
3. Update affected preview files
4. Document version compatibility in NOTES.md

## Questions?

Refer to:
- `.design-sync/NOTES.md` - Component patterns and composition rules
- `.design-sync/RESUME.md` - Session workflow and commands
- `.design-sync/READY-FOR-UPLOAD.md` - Upload process
- `.design-sync/BRANCH-STRATEGY.md` - Git workflow

---

**Last Updated**: 2026-06-19  
**Maintainer**: Blade team
