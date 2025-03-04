import type { ListViewProps } from './types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import BaseBox from '~components/Box/BaseBox';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';

const ListView = ({ testID, children, ...rest }: ListViewProps): React.ReactElement => {
  return (
    <BaseBox
      {...metaAttribute({ name: MetaConstants.ListView, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </BaseBox>
  );
};

export { ListView };
