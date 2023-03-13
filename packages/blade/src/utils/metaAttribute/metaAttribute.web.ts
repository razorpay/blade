import { MetaConstants } from './metaConstants';

const metaAttribute = ({
  name,
  testID,
}: {
  name?: string;
  testID?: string;
}): Record<string, string> => {
  return {
    ...(name ? { [`data-${MetaConstants.Component}`]: name } : {}),
    ...(testID ? { [`data-testid`]: testID } : {}),
  };
};

export { metaAttribute };
