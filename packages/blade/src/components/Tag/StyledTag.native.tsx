import type { BaseBoxProps } from '~components/Box/BaseBox';
import BaseBox from '~components/Box/BaseBox';

const StyledTag = (props: BaseBoxProps): React.ReactElement => {
  return (
    <BaseBox display="flex" flexDirection="row" flexWrap="nowrap" alignSelf="center" {...props} />
  );
};

export { StyledTag };
