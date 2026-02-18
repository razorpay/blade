import type { ListViewProps } from './types';
import { StyledListView } from './StyledListView';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';

const ListView = ({ testID, children, ...rest }: ListViewProps): React.ReactElement => {
  return (
    <StyledListView
      {...metaAttribute({ name: MetaConstants.ListView, testID })}
      {...makeAnalyticsAttribute(rest)}
    >
      {children}
    </StyledListView>
  );
};

export { ListView };
