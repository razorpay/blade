/* eslint-disable @typescript-eslint/no-explicit-any */
import { throwBladeError } from '~utils/logger';

type RollingTextProps = {
  texts: string[];
  children?: (text: string) => React.ReactNode;
  onIndexChange?: (index: number) => void;
  cycleDuration?: number;
  showShimmer?: boolean;
};

const RollingText = (_props: RollingTextProps): React.ReactElement => {
  throwBladeError({
    message: 'RollingText is not yet implemented for native',
    moduleName: 'RollingText',
  });

  return <></>;
};

export type { RollingTextProps };
export { RollingText };
