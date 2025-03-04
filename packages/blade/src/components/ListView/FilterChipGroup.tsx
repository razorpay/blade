import type { FilterChipProps } from './types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';

const FilterChipGroup = ({ testID, children, ...rest }: FilterChipProps): React.ReactElement => {
  return (
    <BaseBox
      {...metaAttribute({ name: MetaConstants.ListView, testID })}
      {...makeAnalyticsAttribute(rest)}
      display="flex"
      padding="spacing.4"
      gap="spacing.3"
      backgroundColor="surface.background.gray.intense"
      borderTop="1px solid"
      borderTopColor="surface.border.gray.muted"
    >
      {children}
    </BaseBox>
  );
};

export { FilterChipGroup };
