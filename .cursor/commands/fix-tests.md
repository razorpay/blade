# Fix Tests

Fix failing tests and ensure all tests pass after component changes.

## Usage

```
/fix-tests <ComponentName>
```

**Example:**
```
/fix-tests Popover
/fix-tests Button
```

## Instructions

### Step 1: Run Tests and Identify Failures

1. **Locate test files**:
   - Path: `packages/blade/src/components/<ComponentName>/__tests__/`
   - Test file: `<ComponentName>.web.test.tsx` or `<ComponentName>.ssr.test.tsx`

2. **Run tests to see what fails**:
   - Review test failures and understand what broke
   - Determine if failures are due to intentional changes or bugs

3. **Fix or update tests**:
   - Update snapshots if visual/structural changes were intentional
   - Fix test logic if API changed
   - Add new tests for new features or props
   - Ensure test coverage is maintained

### Step 2: Run Unit Tests

```bash
# Run all tests (web + native)
yarn test

# Or run only web tests
cd packages/blade && yarn test:react

# Or run only native tests  
cd packages/blade && yarn test:react-native
```

**Note:** Tests run in sharded mode in CI. Locally they run all together.

### Step 3: Fix Failing Tests

If tests fail after your changes:

1. **Review the failure** - Check if it's a legitimate issue or needs updating

2. **Update snapshots** - If visual/structural changes are intentional:
   ```bash
   cd packages/blade && yarn test:react --updateSnapshot
   ```

3. **Fix test logic** - Update test files in `__tests__/` folder if needed

4. **Re-run tests** - Verify all tests pass before proceeding

### Step 4: Run Linting and Type Checks

```bash
# Run lint checks
yarn lint:blade

# Run TypeScript checks  
cd packages/blade && yarn typecheck
```

Fix any linter errors or type issues before creating the PR.

## Test Writing Guidelines

- **Follow existing patterns**: Look at other component tests for consistency
- **Test behavior, not implementation**: Focus on what the component does, not how
- **Use meaningful test descriptions**: Clearly describe what each test is checking
- **Test user interactions**: Use `@testing-library/react` for user-centric tests
- **Test accessibility**: Ensure proper ARIA attributes and keyboard navigation
- **Keep tests isolated**: Each test should be independent and not rely on others

## Example Test Structure

```typescript
import { Popover } from '../';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Popover />', () => {
  it('should render popover with trigger', () => {
    const { container } = renderWithTheme(
      <Popover content="Hello">
        <Button>Click me</Button>
      </Popover>
    );
    expect(container).toMatchSnapshot();
  });

  it('should open popover on trigger click', async () => {
    const { getByRole, getByText } = renderWithTheme(
      <Popover content="Hello">
        <Button>Click me</Button>
      </Popover>
    );
    
    await userEvent.click(getByRole('button'));
    expect(getByText('Hello')).toBeInTheDocument();
  });
});
```
