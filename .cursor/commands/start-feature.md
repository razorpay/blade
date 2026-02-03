# Start Feature Branch

Create a new feature branch from the base branch with proper naming conventions.

## Usage

```
/start-feature <feature-name>
```

**Example:**
```
/start-feature update-popover
/start-feature add-tooltip-placement
```

## Instructions

1. **Checkout and update base branch**:
   ```bash
   git checkout spark
   git pull origin spark
   ```

2. **Create and checkout new branch**:
   ```bash
   git checkout -b feat/<feature-name>
   ```

## Branch Naming Convention

Use the format: `feat/<feature-name>`

**Examples:**
- `feat/update-popover`
- `feat/add-button-variant`
- `feat/fix-tooltip-position`

**Prefixes:**
- `feat/` - New feature or enhancement
- `fix/` - Bug fix
- `docs/` - Documentation only
- `refactor/` - Code refactoring
- `test/` - Test updates
- `chore/` - Build/tooling changes
