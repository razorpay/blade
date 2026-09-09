// NOTE: rendering tests for the full <TimePicker /> aren't included here
// because @gorhom/bottom-sheet's ScrollableComponent requires a native ref
// (a `nativeTag`) at mount time, which react-test-renderer doesn't provide —
// mounting the picker (which always mounts a closed BottomSheet) crashes.
// The trigger view and wheel interactions are covered by the fully-testable
// `SpinWheel.native.test.tsx` and by the storybook test stories
// (`TimePicker.test.stories.tsx`) which run inside a real RN runtime.
//
// This mirrors `DatePicker.native.test.tsx` and serves as a sanity check that
// the module imports without crashing.

import { TimePicker } from '../TimePicker.native';

describe('<TimePicker /> (native)', () => {
  it('module exports the TimePicker component', () => {
    expect(TimePicker).toBeDefined();
    expect(typeof TimePicker).toBe('function');
  });
});
