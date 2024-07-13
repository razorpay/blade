// Asynchronous function to generate the bundle size difference report
const generateBundleDiff = async () => {
  // Array to store the base bundle size statistics
  let baseBundleSizeStats = [];
  // Get the base bundle size report from the master branch
  const baseBundleStatsURL =
    process.env.BASE_BUNDLE_SIZE_STATS_URL ||
    'https://raw.githubusercontent.com/razorpay/blade/bundle-size-stats/packages/blade/baseBundleSizeStats.json';
  const response = await fetch(baseBundleStatsURL);

  // Parse the JSON response if the request is successful
  if (response.status === 200) {
    baseBundleSizeStats = await response.json();
  }

  // Import the current bundle size statistics from the PR
  // eslint-disable-next-line import/extensions
  const currentBundleSizeStats = require('../prBundleSizeStats.json');
  // Initialize the bundle difference array with current bundle stats
  let bundleDiff = currentBundleSizeStats;

  // Filter the components that don't have the same size in the base and current bundle
  if (baseBundleSizeStats.length > 0) {
    bundleDiff = currentBundleSizeStats.filter(
      ({ size: currentSize, name: currentName }) =>
        !baseBundleSizeStats.some(
          ({ size: baseSize, name: baseName }) =>
            currentSize === baseSize && currentName === baseName,
        ),
    );
  }

  // If there is no difference, return null
  if (bundleDiff.length === 0) {
    return { diffTable: null };
  }

  // Calculate the size differences and create a formatted diff table
  bundleDiff.forEach((component) => {
    if (component.name === 'Base') {
      return;
    }

    const currentComponent = currentBundleSizeStats.find((stat) => stat.name === component.name);
    const baseComponent = baseBundleSizeStats.find((stat) => stat.name === component.name);
    // Calculate the empty project size, including all dependencies, and subtract it from the component bundle size
    // This adjustment is crucial to obtain more accurate results, mitigating size differences due to additional dependencies in the project
    const emptyProjectSize =
      currentBundleSizeStats.find((stat) => stat.name === 'Base').size / 1000;
    const currentComponentSize = currentComponent
      ? currentComponent.size / 1000 - emptyProjectSize
      : 0;
    const baseComponentSize = baseComponent ? baseComponent.size / 1000 - emptyProjectSize : 0;

    if (baseComponent && !currentComponent) {
      // Component removed in the PR
      component.diffSize = -baseComponentSize;
      component.baseSize = baseComponentSize;
      component.prSize = 0;
      component.isSizeIncreased = false;
    } else if (!baseComponent && currentComponent) {
      // Component added in the PR
      component.diffSize = currentComponentSize;
      component.baseSize = 0;
      component.prSize = currentComponentSize;
      component.isSizeIncreased = true;
    } else {
      // Component size changed in the PR
      component.diffSize = currentComponentSize - baseComponentSize;
      component.baseSize = baseComponentSize;
      component.prSize = currentComponentSize;
      component.isSizeIncreased = component.diffSize > 0;
    }
  });

  // Generate a Markdown table for the bundle size differences
  const diffTable = `
  | Status | Component | Base Size (kb) | Current Size (kb) | Diff |
  | --- | --- | --- | --- | --- |
  ${bundleDiff
    .filter(({ name }) => name !== 'Base')
    .map(
      ({ name, baseSize, prSize, diffSize, isSizeIncreased }) =>
        `| ${isSizeIncreased ? '⬆' : '⬇'} | ${name} | ${baseSize.toFixed(3)} | ${prSize.toFixed(
          3,
        )} | ${isSizeIncreased ? `+${diffSize.toFixed(3)}` : diffSize.toFixed(3)} KB |`,
    )
    .join('\n')}
  `;

  return { diffTable };
};

module.exports = generateBundleDiff;
