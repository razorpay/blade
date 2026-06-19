# Design Sync Branch Strategy

## Overview

The design-sync work for Claude Design integration is maintained on a **separate branch** rather than merged directly to master. This provides:

- **Independent iteration** - Update previews without affecting main Blade development
- **Team visibility** - Clear separation makes it easy to track design-sync changes
- **Optional review** - Can create PRs for team review if desired
- **Clean history** - Design-sync commits don't clutter main branch history
- **Easy updates** - Future preview updates can be committed to the same branch

## Branch Name

```
design-sync/claude-design-previews
```

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

### Initial Setup (One-time)
```bash
# Create and switch to design-sync branch
git checkout -b design-sync/claude-design-previews

# Stage durable files
git add .design-sync/

# Commit
git commit -m "feat(design-sync): Add Claude Design previews for 29 core components"

# Push to remote
git push -u origin design-sync/claude-design-previews
```

### Future Updates
```bash
# Switch to design-sync branch
git checkout design-sync/claude-design-previews

# Make changes to previews
# Edit .design-sync/previews/Button.tsx (example)

# Rebuild affected components
node .ds-sync/lib/preview-rebuild.mjs \
  --config .design-sync/config.json \
  --node-modules packages/blade/node_modules \
  --out ds-bundle \
  --components Button

# Test changes via server
# http://127.0.0.1:53239/components/general/Button/Button.html

# Commit changes
git add .design-sync/previews/Button.tsx
git commit -m "feat(design-sync): Update Button preview with new variants"

# Push updates
git push
```

### Merging to Master (If Desired)

The design-sync branch can remain separate indefinitely, or be merged to master if desired:

```bash
# From master branch
git checkout master
git merge design-sync/claude-design-previews

# Resolve any conflicts
# Push to master
git push origin master
```

**Recommendation**: Keep as separate branch unless design-sync previews become part of official Blade build pipeline.

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

**Why separate branch?**
- Design-sync is infrastructure work, not a Blade feature
- Previews may change frequently as Claude Design evolves
- No impact on published npm package
- Easier to experiment without affecting main development
- Can be deleted/recreated if needed

**Why not gitignore?**
- Preview files (.design-sync/previews/*.tsx) are source code worth versioning
- Documentation (NOTES.md, etc.) has value for future contributors
- Want history of how previews evolved over time

**Why not monorepo package?**
- Design-sync is build tooling, not a published package
- Doesn't need package.json, dependencies, or npm scripts
- Simpler as flat directory structure
- Matches design-sync tool's expected layout

---

**Created**: 2026-06-19  
**Status**: Active (awaiting initial branch creation)  
**Maintainer**: Refer to Blade team ownership
