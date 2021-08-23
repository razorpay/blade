import pickBy from './pickBy';
import identity from './identity';

export default ({ testID, accessibilityLabel }) =>
  pickBy({ 'aria-label': accessibilityLabel, 'data-testid': testID }, identity);
