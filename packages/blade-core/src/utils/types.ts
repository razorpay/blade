/**
 *
 * When combined with union, this type utility will give you autocomplete of union while still supporting any string value as input
 *
 * ### Usage
 *
 * ```ts
 * type ThemeName = 'themeOne' | 'themeTwo' | StringWithAutocomplete;
 * ```
 *
 * This will show themeOne and themeTwo in autocomplete but also allow any other string as value.
 *
 * More details - https://github.com/razorpay/blade/pull/1031/commits/86b6ee0facf45e7556739efcbfa5396b11b1b3c9#r1121298293
 * Related TS Issue - https://github.com/microsoft/TypeScript/issues/29729
 *
 */
type StringWithAutocomplete = string & Record<never, never>;

type DataAnalyticsKey = `data-analytics-${string}`;

/**
 * This type is used to add data-analytics attributes to components.
 * This is used to track user interactions on the components.
 * The key is always `data-analytics-` followed by the attribute name.
 * eg: `data-analytics-action="click"`
 * eg: `data-analytics-section="header"`
 */
type DataAnalyticsAttribute = {
  [key: DataAnalyticsKey]: string;
};

export type { StringWithAutocomplete, DataAnalyticsAttribute };
