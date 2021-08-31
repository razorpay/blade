import pickBy from './pickBy';
import identity from './identity';

export default ({ testID, accessibilityLabel }) =>
  pickBy({ accessibilityLabel, testID, accessible: !!accessibilityLabel }, identity);
