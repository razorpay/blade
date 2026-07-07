// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './segmentedControl.module.css';

export const getSegmentedControlTemplateClasses = (): Record<string, string> => ({
  container: styles.container,
  containerSizeSmall: styles.containerSizeSmall,
  containerSizeMedium: styles.containerSizeMedium,
  containerSizeLarge: styles.containerSizeLarge,
  field: styles.field,
  fieldTop: styles.fieldTop,
  fieldLeft: styles.fieldLeft,
  item: styles.item,
  itemSelected: styles.itemSelected,
  itemSizeSmall: styles.itemSizeSmall,
  itemSizeMedium: styles.itemSizeMedium,
  itemSizeLarge: styles.itemSizeLarge,
  itemText: styles.itemText,
  itemTextSizeSmall: styles.itemTextSizeSmall,
  itemTextSizeMedium: styles.itemTextSizeMedium,
  itemTextSizeLarge: styles.itemTextSizeLarge,
  itemTextNormal: styles.itemTextNormal,
  itemTextMuted: styles.itemTextMuted,
  itemTextDisabled: styles.itemTextDisabled,
  indicator: styles.indicator,
  indicatorAnimating: styles.indicatorAnimating,
  indicatorInstant: styles.indicatorInstant,
  indicatorRadiusSmall: styles.indicatorRadiusSmall,
  indicatorRadiusMediumToken: styles.indicatorRadiusMediumToken,
});
