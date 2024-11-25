import type { DataAnalyticsAttribute } from '~utils/types';

const makeAnalyticsAttribute = (props: Record<string, unknown>): DataAnalyticsAttribute => {
  return Object.entries(props)
    .filter(([key]) => key.startsWith('data-analytics-'))
    .reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value as string,
      }),
      {} as DataAnalyticsAttribute,
    );
};

export { makeAnalyticsAttribute };
