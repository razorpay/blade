# Design Sync Branch Strategy

## Overview

The design-sync work for Claude Design integration is **merged into master**. This provides:

- **Always available** - `.design-sync/` files present on every checkout of master
- **No branch switching** - Update previews directly from master branch
- **Team visibility** - Everyone can discover, use, and contribute to previews
- **Single source of truth** - No branch divergence or stale preview issues
- **Gitignore protection** - Build artifacts automatically excluded on all checkouts
- **Small footprint** - Only ~50KB of source files (not 7MB build output)

## Development Branch (Initial Work)

Initial authoring was done on:
```
design-sync/claude-design-previews
```

This branch will be merged to master and can be deleted afterward.

## What Lives on This Branch

### Committed Files (durable state)
- `.design-sync/config.json` - Build configuration
- `.design-sync/NOTES.md` - Authoring learnings and patterns
- `.design-sync/core-components.md` - Component list
- `.design-sync/RESUME.md` - Session status
- `.design-sync/READY-FOR-UPLOAD.md` - Upload instructions
- `.design-sync/PHASE3-SUMMARY.md` - Phase 3 results
- `.design-sync/BRANCH-STRATEGY.md` - This file
- `.design-sync/previews/*.tsx` - 29 preview files (source of truth)

### Ignored Files (not committed)
- `.ds-sync/` - Temporary converter scripts
- `ds-bundle/` - Generated bundle artifacts
- `.design-sync/learnings/` - Merged into NOTES.md, deleted

## Workflow

### ✅ Merged to Master

Design-sync files are now part of master. Future updates follow standard workflow:

```bash
# Work on master or create feature branch
git checkout master

# Make changes to previews
vim .design-sync/previews/Button.tsx

# Rebuild affected components
node .ds-sync/lib/preview-rebuild.mjs \
  --config .design-sync/config.json \
  --node-modules packages/blade/node_modules \
  --out ds-bundle \
  --components Button

# Test changes via server
node .ds-sync/storybook/http-serve.mjs ./ds-bundle
# http://127.0.0.1:<port>/components/general/Button/Button.html

# Commit changes
git add .design-sync/previews/Button.tsx
git commit -m "feat(design-sync): Update Button preview with new variants"

# Push to master (or create PR for review)
git push origin master
```

### Feature Branch Workflow (Optional)

For larger updates, use feature branches:

```bash
# Create feature branch from master
git checkout -b feat/update-form-previews

# Make changes, rebuild, test
vim .design-sync/previews/TextInput.tsx
# ... rebuild and test ...

# Commit and push
git commit -am "feat(design-sync): Update form component previews"
git push -u origin feat/update-form-previews

# Create PR to master
gh pr create --base master --title "Update form previews"

# After merge, delete feature branch
git branch -d feat/update-form-previews
```

## Pull Request Workflow (Optional)

If team review is desired:

```bash
gh pr create \
  --title "feat(design-sync): Claude Design previews for 29 core components" \
  --body "$(cat .design-sync/READY-FOR-UPLOAD.md)" \
  --base master \
  --head design-sync/claude-design-previews
```

Review checklist for PR:
- [ ] All 29 preview files present
- [ ] NOTES.md documents patterns and learnings
- [ ] No temporary files committed (.ds-sync/, ds-bundle/)
- [ ] package.json not modified (workaround was reverted)
- [ ] Visual review via served HTML shows all components render correctly

## CI/CD Considerations

If the branch is kept long-term:

**Option 1: Exclude from CI**
- Add branch filter to skip design-sync builds in CI
- Saves CI resources since design-sync doesn't affect published package

**Option 2: Minimal CI**
- Run only linting/formatting checks
- Skip full test suite since previews don't affect Blade runtime

**Option 3: Design-sync specific CI**
- Add workflow to rebuild bundle and validate on push
- Ensures preview changes don't break build

## Migration Path

If Claude Design integration becomes official:

1. **Merge to master** - Bring design-sync files into main branch
2. **Update build pipeline** - Add design-sync bundle generation to release workflow
3. **Document in README** - Add design-sync section to main README
4. **Archive branch** - Delete `design-sync/claude-design-previews` after merge

Until then, keep as separate branch for independent iteration.

## Rationale

**Why merge to master?**
- **Discoverability** - Team members can find and use design-sync on master
- **No branch switching** - Update previews without checkout dance
- **Gitignore works everywhere** - Build artifacts excluded on all checkouts
- **Single source of truth** - No stale previews or branch divergence
- **Small footprint** - Only ~50KB source files (build output gitignored)
- **Future-proof** - Easy to automate in CI/CD from master

**Why not separate branch?**
- Creates friction: must remember to switch branches for updates
- Gitignore rules missing on master unless cherry-picked
- Team members on master won't have access to previews
- Risk of branch divergence if master evolves independently

**Why not gitignore everything?**
- Preview files (.design-sync/previews/*.tsx) are source code worth versioning
- Documentation (NOTES.md, etc.) has value for future contributors
- Want history of how previews evolved over time
- Config (config.json) needed for reproducible builds

**Why not monorepo package?**
- Design-sync is build tooling, not a published package
- Doesn't need package.json, dependencies, or npm scripts
- Simpler as flat directory structure
- Matches design-sync tool's expected layout

---

**Created**: 2026-06-19  
**Status**: Active (awaiting initial branch creation)  
**Maintainer**: Refer to Blade team ownership
