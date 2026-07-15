const { danger, markdown } = require('danger');
const generateBundleDiff = require('./scripts/generateBundleDiff');

const showBundleSizeDiff = async () => {
  const { diffTable } = await generateBundleDiff(danger);

  if (diffTable) {
    const markdownMessage = `
## Blade Svelte Bundle Size Report

<details>
<summary> Updated Components </summary>

${diffTable}

</details>

`;
    markdown(markdownMessage);
  }
};

showBundleSizeDiff();
