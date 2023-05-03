import { MetaConstants } from './metaConstants';

const metaAttribute = ({
  testID,
  name,
}: {
  name?: string;
  testID?: string;
}): Record<string, string> => {
  return {
    ...(name ? { [`data-${MetaConstants.Component}`]: name } : {}),
    ...(name ? { [`data-component-from`]: 'blade' } : {}),
    ...(testID ? { testID } : {}),
  };
};

export { metaAttribute };
