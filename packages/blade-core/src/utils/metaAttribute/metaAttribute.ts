import { MetaConstants } from './metaConstants';

const metaAttribute = ({
  name,
  testID,
}: {
  name?: string;
  testID?: string;
}): {
  'data-blade-component'?: string;
  'data-testid'?: string;
} => {
  return {
    ...(name ? { [`data-${MetaConstants.Component}`]: name } : {}),
    ...(testID ? { [`data-testid`]: testID } : {}),
  };
};

export { metaAttribute };
