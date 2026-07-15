import dangerModule from 'danger';
// eslint-disable-next-line import/extensions
import generateBundleDiff from './scripts/generateBundleDiff.js';

const { danger, markdown } = dangerModule;

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
