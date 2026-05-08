import type { StringChildrenType } from '~utils/types';
import { Text } from '~components/Typography';
import { logger } from '~utils/logger';

type SkipNavLinkProps = {
  id?: string;
  children?: StringChildrenType;
};

const SkipNavLink = (_props: SkipNavLinkProps): React.ReactElement => {
  logger({
    type: 'warn',
    moduleName: 'SkipNav',
    message: 'SkipNavLink is not available on React Native',
  });
  return <Text>SkipNavLink is not available on React Native</Text>;
};

const SkipNavContent = (_props: SkipNavLinkProps): React.ReactElement => {
  logger({
    type: 'warn',
    moduleName: 'SkipNav',
    message: 'SkipNavContent is not available on React Native',
  });
  return <Text>SkipNavContent is not available on React Native</Text>;
};

export { SkipNavLink, SkipNavContent };
