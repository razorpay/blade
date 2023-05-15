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
    ...(testID ? { testID } : {}),
  };
};

export { metaAttribute };
