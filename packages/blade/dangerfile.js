const { danger, markdown } = require('danger');
const generateBundleDiff = require('./scripts/generateBundleDiff');

const showBundleSizeDiff = async () => {
  const { diffTable } = await generateBundleDiff(danger);

  if (diffTable) {
    markdown(`
  ## Bundle Size Report

  <details>
  <summary> Updated Components </summary>

  ${diffTable}

  </details>
  
  `);
  } else {
    markdown(`
  ## Bundle Size Report

  No bundle size changes detected.
  `);
  }
};

showBundleSizeDiff();
