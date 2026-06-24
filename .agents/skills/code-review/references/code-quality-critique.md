# Code Quality

Review the diff as a senior engineer. Surface only real, actionable issues — skip style nits and subjective preferences.

Look for:

- **Bugs and logic errors** — incorrect conditions, off-by-one, wrong operator, missing early return
- **Edge cases** — null/undefined handling, empty arrays, zero values, concurrent calls
- **Performance** — unnecessary re-renders, missing memoization, expensive operations in hot paths
- **Security** — XSS, injection, unsafe use of `dangerouslySetInnerHTML`, unvalidated input
- **Maintainability** — overly complex logic that could be simplified, missing invariant comments where the WHY is non-obvious

For each issue report: file, line, severity (`critical` / `major` / `minor`), what the problem is, and how to fix it.
