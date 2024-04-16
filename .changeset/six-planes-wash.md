---
"@razorpay/blade": minor
---

feat: add `circular` variant for the `ProgressBar` component

#### Changes

- The `"meter"` & `"progress"` values for the `variant` prop are deprecated in favor of the new `type?: "meter" | "progress"` prop.
- The `variant` prop now accepts `"linear"` & `"circular"` values.
- **Usage:**

  ```js
    <ProgressBar variant="circular" value={20}> label="Label" />
  ```

#### Migration with Codemod

- The codemod will automatically update the `ProgressBar` component. Execute the codemod on the file/directory that needs to be migrated for the page via the following command:

    > Need help? Check out [jscodeshift docs](https://github.com/facebook/jscodeshift) for CLI usage tips.

    ```sh
    npx jscodeshift ./PATH_TO_YOUR_DIR --extensions=tsx,ts,jsx,js -t ./node_modules/@razorpay/blade/codemods/migrate-progressbar/transformers/index.ts --ignore-pattern="**/node_modules/**"
    ```

- There might be some situations where the codemod falls short, If you encounter errors, refer the following examples to migrate the component manually:

  ```diff
  - <ProgressBar value={20}> label="Label" />
  + <ProgressBar type="progress" value={20}> label="Label" />

  - <ProgressBar variant="progress" value={20}> label="Label" />
  + <ProgressBar type="progress" variant="linear" value={20}> label="Label" />

  - <ProgressBar variant="meter" value={20}> label="Label" />
  + <ProgressBar type="meter" variant="linear" value={20}> label="Label" />
  ```



