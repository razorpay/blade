const { danger, markdown } = require('danger');

const showBundleSizeDiff = async () => {
  // eslint-disable-next-line import/extensions
  const { default: generateBundleDiff } = await import('./scripts/generateBundleDiff.js');
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
