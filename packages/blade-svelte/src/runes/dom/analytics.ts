/** The `data-analytics-*` attributes among a component's props. */
export type AnalyticsAttributes = Record<`data-analytics-${string}`, string | number | boolean>;

/**
 * The `data-analytics-*` attributes a component was given, for its root
 * element, as React's `makeAnalyticsAttribute`. Everything else is dropped.
 */
export function analyticsAttributes(props: Record<string, unknown>): AnalyticsAttributes {
  const attributes: AnalyticsAttributes = {};
  for (const key of Object.keys(props)) {
    if (key.startsWith('data-analytics-')) {
      attributes[key as `data-analytics-${string}`] = props[key] as string;
    }
  }
  return attributes;
}
