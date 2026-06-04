Example Output Format (do add emojis as well for better readability):

<OutputFormat>
## PR #1234 Review

### 📝 Summary

This PR adds a new Button variant and updates the DatePicker component.

### 📊 CI Status

Render **all** checks from `ci_checks` in this table (passing and failing alike):

| Check                | Status | Job URL                                                              |
| -------------------- | ------ | -------------------------------------------------------------------- |
| Run Tests            | ✅     | [Job URL](https://github.com/razorpay/blade/actions/runs/1234567890) |
| Validate Source Code | ❌     | [Job URL](https://github.com/razorpay/blade/actions/runs/1234567890) |
| Storybook Publish    | ✅     | [Job URL](https://github.com/razorpay/blade/actions/runs/1234567890) |

Status emoji mapping: SUCCESS → ✅, SKIPPED → ⏭️, CANCELLED → ⚠️, PENDING → ⏳, FAILURE → ❌

#### CI Issues (only for non-SUCCESS / non-SKIPPED checks)

- {name of the failing check}
  - {description of the issue / failure_reason}

### 💅 UI Review Findings

| Feature / Flow   | Working as Expected    |
| ---------------- | ---------------------- |
| Feature / Flow 1 | ✅                     |
| Feature / Flow 2 | ❌ (issue description) |

### 🧑‍💻 Code Review Findings

- 1. [Issue 1]
- 2. [Issue 2]

### 📚 Storybook Preview

[https://61c19ee8d3d282003ac1d81c-abcdef.chromatic.com/](https://61c19ee8d3d282003ac1d81c-abcdef.chromatic.com/)

</OutputFormat>
