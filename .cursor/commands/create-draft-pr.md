# Create Draft PR

Create a draft pull request with your changes.

## Usage

```
/create-draft-pr <ComponentName> <brief-description>
```

**Example:**
```
/create-draft-pr Popover update design tokens and add new placement
/create-draft-pr Button add new variant and fix padding
```

## Instructions

### Step 1: Commit Your Changes

```bash
# Stage all changes
git add .

# Commit with a conventional commit message
git commit -m "feat(<ComponentName>): <brief description>"
```

**Important:** Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

**Commit Prefixes:**
- `feat:` - New feature or enhancement
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test updates
- `chore:` - Build/tooling changes

**Examples:**
- `feat(Popover): add new placement options`
- `fix(Button): correct padding in small variant`
- `docs(Tooltip): update knowledgebase with new props`

### Step 2: Push and Create Draft PR

```bash
# Push branch to remote
git push -u origin HEAD

# Create draft PR using gh cli with spark as base
gh pr create --base spark --draft --title "feat(<ComponentName>): <brief description>" --body "$(cat <<'EOF'
## Summary
- Updated <ComponentName> with latest Figma designs
- Added/Modified [list specific changes]

## Changes
- Updated design tokens for spacing/colors
- Added new props: [list new props if any]
- Updated knowledgebase documentation
- Updated stories

## Visual Verification
[Add screenshots from Storybook if helpful]

## Testing
- ✅ All unit tests passing
- ✅ Visual verification in Storybook
- ✅ Linting and type checks passing

## Related
Figma: [link to Figma design]
EOF
)"
```

### Step 3: PR Title Requirements

- Must follow Conventional Commits specification
- Will be checked by `blade-pr-title-check` GitHub action
- Format: `type(scope): description`
- Example: `feat(Popover): update design tokens and add new placement`

### Step 4: Mark as Ready When Checks Pass

The PR is created as a **draft** by default. Once all checks pass and you've verified everything, mark it as ready for review:

```bash
gh pr ready
```

### Step 5: Verify PR Checks

After creating the PR, verify:
- ✅ PR title check passes
- ✅ Lint and validation checks pass
- ✅ Unit tests pass
- ✅ Type checks pass

If any checks fail, push fixes to the same branch to update the PR:

```bash
# Make fixes
git add .
git commit -m "fix: address PR feedback"
git push
```

## PR Body Template

When creating the PR, include:

1. **Summary** - High-level overview of changes
2. **Changes** - Detailed list of what was modified
3. **Visual Verification** - Screenshots or videos of the component
4. **Testing** - Checklist of testing done
5. **Related** - Links to Figma designs, issues, or related PRs

## Tips

- Keep PR title concise but descriptive
- Include screenshots for visual changes
- Link to Figma designs in the PR body
- Ensure all tests pass before marking as ready
- Request reviews from design system team members
