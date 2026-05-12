// NOTE: rendering tests for the full <DatePicker /> aren't included here
// because @gorhom/bottom-sheet's ScrollableComponent requires a native ref
// (a `nativeTag`) at mount time, which react-test-renderer doesn't provide.
// The pattern for mocking @gorhom/bottom-sheet in unit tests will land
// alongside the BottomSheet test suite refresh. Until then, the trigger
// view and date-helpers can be exercised via the storybook test stories
// (`DatePicker.test.stories.tsx`) which run inside a real RN runtime.
//
// This stub serves as a placeholder + sanity check that the module
// imports without crashing.

import { DatePicker } from '../DatePicker.native';

describe('<DatePicker /> (native)', () => {
  it('module exports the DatePicker component', () => {
    expect(DatePicker).toBeDefined();
    expect(typeof DatePicker).toBe('function');
  });
});
