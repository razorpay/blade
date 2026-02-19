import type { ListViewProps } from './types';
import { ListViewProvider } from './ListViewContext';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';

const ListView = ({ testID, children, ...rest }: ListViewProps): React.ReactElement => {
  return (
    <ListViewProvider value={{ isInsideListView: true }}>
      <BaseBox
        {...metaAttribute({ name: MetaConstants.ListView, testID })}
        {...makeAnalyticsAttribute(rest)}
      >
        {children}
      </BaseBox>
    </ListViewProvider>
  );
};

export { ListView };
