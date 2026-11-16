/**
 * Writes the PR bundle size report to the GitHub Actions job summary.
 *
 * Replaces the Danger PR comment: the razorpay org IP allow list refuses GitHub API calls
 * from GitHub-hosted runners (403 since 12 Nov 2026), and posting a comment needs one.
 * This script makes no GitHub API calls.
 *
 * Usage: node scripts/writeBundleSizeSummary.js [...changed files]
 */
const fs = require('fs');
const generateBundleDiff = require('./generateBundleDiff');

const COMPONENTS_INDEX_FILE = 'packages/blade/src/components/index.ts';

const main = async () => {
  const changedFiles = process.argv.slice(2);
  const { diffTable } = await generateBundleDiff();

  let markdown = '';

  if (diffTable) {
    markdown += `
## Bundle Size Report

<details>
<summary> Updated Components </summary>

${diffTable}

</details>

`;
  } else {
    markdown += '## Bundle Size Report\n\nNo bundle size changes.\n';
  }

  if (changedFiles.includes(COMPONENTS_INDEX_FILE)) {
    markdown += `
## Component Status Update Needed

🔔 Changes detected in \`components/index.ts\`. Please remember to:
1. Update the component status in \`src/utils/storybook/componentStatusData.ts\`
2. Add appropriate status, release version, and description for any new components
3. Update existing component information if needed

This helps keep our documentation up to date! 📚
`;
  }

  console.log(markdown);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
