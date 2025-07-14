const { danger, markdown } = require('danger');
const generateBundleDiff = require('./scripts/generateBundleDiff');

let markdownMessage = '';

const showBundleSizeDiff = async () => {
  const { diffTable } = await generateBundleDiff(danger);

  if (diffTable) {
    markdownMessage = `
  ## Bundle Size Report

  <details>
  <summary> Updated Components </summary>

  ${diffTable}

  </details>
  
  `;
  } else {
    markdownMessage = `
  ## Bundle Size Report

  No bundle size changes detected.
  `;
  }
};

// Check if components/index.ts was modified
const checkComponentsIndexChanges = () => {
  const componentsIndexFile = 'src/components/index.ts';
  const hasComponentsIndexChanged = danger.git.modified_files.includes(componentsIndexFile);
  console.log(hasComponentsIndexChanged);

  if (hasComponentsIndexChanged) {
    markdownMessage += `

## Component Status Update Needed

🔔 Changes detected in \`components/index.ts\`. Please remember to:
1. Update the component status in \`src/utils/storybook/componentStatusData.ts\`
2. Add appropriate status, release version, and description for any new components
3. Update existing component information if needed

This helps keep our documentation up to date! 📚
    `;
  }
};

showBundleSizeDiff();
checkComponentsIndexChanges();
markdown(markdownMessage);
