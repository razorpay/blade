type SkipNavLinkProps = {
  id?: string;
  children?: string;
};

const SkipNavLink = (_props: SkipNavLinkProps): never => {
  throw new Error('[Blade: SkipNav]: SkipNavLink is not available on React Native');
};

const SkipNavContent = (_props: SkipNavLinkProps): never => {
  throw new Error('[Blade: SkipNav]: SkipNavContent is not available on React Native');
};

export { SkipNavLink, SkipNavContent };
