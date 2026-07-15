const { danger, markdown } = require('danger');
const generateBundleDiff = require('./scripts/generateBundleDiff');

let markdownMessage = '';

const showBundleSizeDiff = async () => {
  const { diffTable } = await generateBundleDiff(danger);

  if (diffTable) {
    markdownMessage = `
## Blade Svelte Bundle Size Report

<details>
<summary> Updated Components </summary>

${diffTable}

</details>

`;
  }
};

showBundleSizeDiff();

// Only post markdown if we have a message
if (markdownMessage.trim()) {
  markdown(markdownMessage);
}
