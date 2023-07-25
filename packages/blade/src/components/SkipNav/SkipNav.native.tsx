import type { StringChildrenType } from '~utils/types';

type SkipNavLinkProps = {
  id?: string;
  children?: StringChildrenType;
};

const SkipNavLink = (_props: SkipNavLinkProps): void | never => {
  if (__DEV__) {
    throw new Error('[Blade: SkipNav]: SkipNavLink is not available on React Native');
  }
};

const SkipNavContent = (_props: SkipNavLinkProps): void | never => {
  if (__DEV__) {
    throw new Error('[Blade: SkipNav]: SkipNavContent is not available on React Native');
  }
};

export { SkipNavLink, SkipNavContent };
