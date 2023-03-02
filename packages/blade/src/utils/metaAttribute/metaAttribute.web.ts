import { MetaConstants } from './metaConstants';

const metaAttribute = ({ name }: { name?: string; testID?: string }): Record<string, string> => {
  return {
    ...(name ? { [`data-${MetaConstants.Component}`]: name } : {}),
  };
};

export { metaAttribute };
