import type { ListViewFilterProps } from './types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';

const ListViewFilter = ({
  testID,
  children,
  quickFilter,
  onSearchChange,
  ...rest
}: ListViewFilterProps): React.ReactElement => {
  return (
    <BaseBox
      {...metaAttribute({ name: MetaConstants.ListViewFilter, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      {quickFilter}
      <BaseBox> Place Holder for filters</BaseBox>
    </BaseBox>
  );
};

export { ListViewFilter };
