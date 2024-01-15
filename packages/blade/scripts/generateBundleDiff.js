const generateBundleDiff = async () => {
  let baseBundleSizeStats = [];
  // Get the base bundle size report from the master branch
  const baseBundleStatsURL =
    process.env.BASE_BUNDLE_SIZE_STATS_URL ||
    'https://raw.githubusercontent.com/razorpay/blade/master/packages/blade/baseBundleSizeStats.json';
  const response = await fetch(baseBundleStatsURL);

  if (response.status === 200) {
    baseBundleSizeStats = await response.json();
  }

  // eslint-disable-next-line import/extensions
  const currentBundleSizeStats = require('../PRBundleSizeStats.json');
  let bundleDiff = currentBundleSizeStats;

  if (baseBundleSizeStats.length > 0) {
    bundleDiff = baseBundleSizeStats.filter(
      ({ size: baseSize }) =>
        !currentBundleSizeStats.some(({ size: currentSize }) => currentSize === baseSize),
    );
  }

  if (bundleDiff.length === 0) {
    return { diffTable: null };
  }

  bundleDiff.forEach((component) => {
    const currentComponent = currentBundleSizeStats.find((stat) => stat.name === component.name);
    const baseComponent = baseBundleSizeStats.find((stat) => stat.name === component.name);

    if (baseComponent && !currentComponent) {
      component.diffSize = -baseComponent.size / 1000;
      component.baseSize = baseComponent.size / 1000;
      component.prSize = 0;
      component.isSizeIncreased = false;
    } else if (!baseComponent && currentComponent) {
      component.diffSize = currentComponent.size / 1000;
      component.baseSize = 0;
      component.prSize = currentComponent.size / 1000;
      component.isSizeIncreased = true;
    } else {
      component.diffSize = (currentComponent.size - baseComponent.size) / 1000;
      component.baseSize = baseComponent.size / 1000;
      component.prSize = currentComponent.size / 1000;
      component.isSizeIncreased = component.diffSize > 0;
    }
  });

  const diffTable = `
  | Status | Component | Base Size (kb) | Current Size (kb) | Diff |
  | --- | --- | --- | --- | --- |
  ${bundleDiff
    .map(
      ({ name, baseSize, prSize, diffSize, isSizeIncreased }) =>
        `| ${isSizeIncreased ? '🚫' : '✅'} | ${name} | ${baseSize} | ${prSize} | ${
          isSizeIncreased ? `+${diffSize}` : diffSize
        } kb |`,
    )
    .join('\n')}
  `;

  return { diffTable };
};

module.exports = generateBundleDiff;
