// Asynchronous function to generate the bundle size difference report
const generateBundleDiff = async () => {
  // Array to store the base bundle size statistics
  let baseBundleSizeStats = [];
  // Get the base bundle size report from the master branch
  const baseBundleStatsURL =
    process.env.BASE_BUNDLE_SIZE_STATS_URL ||
    'https://raw.githubusercontent.com/razorpay/blade/master/packages/blade/baseBundleSizeStats.json';
  const response = await fetch(baseBundleStatsURL);

  // Parse the JSON response if the request is successful
  if (response.status === 200) {
    baseBundleSizeStats = await response.json();
  }

  // Import the current bundle size statistics from the PR
  // eslint-disable-next-line import/extensions
  const currentBundleSizeStats = require('../PRBundleSizeStats.json');
  // Initialize the bundle difference array with current bundle stats
  let bundleDiff = currentBundleSizeStats;

  // Filter the components that don't have the same size in the base and current bundle
  if (baseBundleSizeStats.length > 0) {
    bundleDiff = baseBundleSizeStats.filter(
      ({ size: baseSize }) =>
        !currentBundleSizeStats.some(({ size: currentSize }) => currentSize === baseSize),
    );
  }

  // If there is no difference, return null
  if (bundleDiff.length === 0) {
    return { diffTable: null };
  }

  // Calculate the size differences and create a formatted diff table
  bundleDiff.forEach((component) => {
    const currentComponent = currentBundleSizeStats.find((stat) => stat.name === component.name);
    const baseComponent = baseBundleSizeStats.find((stat) => stat.name === component.name);

    if (baseComponent && !currentComponent) {
      // Component removed in the PR
      component.diffSize = -baseComponent.size / 1000;
      component.baseSize = baseComponent.size / 1000;
      component.prSize = 0;
      component.isSizeIncreased = false;
    } else if (!baseComponent && currentComponent) {
      // Component added in the PR
      component.diffSize = currentComponent.size / 1000;
      component.baseSize = 0;
      component.prSize = currentComponent.size / 1000;
      component.isSizeIncreased = true;
    } else {
      // Component size changed in the PR
      component.diffSize = (currentComponent.size - baseComponent.size) / 1000;
      component.baseSize = baseComponent.size / 1000;
      component.prSize = currentComponent.size / 1000;
      component.isSizeIncreased = component.diffSize > 0;
    }
  });

  // Generate a Markdown table for the bundle size differences
  const diffTable = `
  | Status | Component | Base Size (kb) | Current Size (kb) | Diff |
  | --- | --- | --- | --- | --- |
  ${bundleDiff
    .map(
      ({ name, baseSize, prSize, diffSize, isSizeIncreased }) =>
        `| ${isSizeIncreased ? '🔴' : '🟢'} | ${name} | ${baseSize} | ${prSize} | ${
          isSizeIncreased ? `+${diffSize}` : diffSize
        } kb |`,
    )
    .join('\n')}
  `;

  return { diffTable };
};

module.exports = generateBundleDiff;
