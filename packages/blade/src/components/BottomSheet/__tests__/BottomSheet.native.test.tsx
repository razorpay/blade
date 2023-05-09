/* eslint-disable no-global-assign */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { BottomSheet, BottomSheetHeader, BottomSheetFooter } from '../BottomSheet';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';
import { Button } from '~components/Button';
import { Badge } from '~components/Badge';
import { Counter } from '~components/Counter';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<BottomSheet />', () => {
  test('should render Header/Footer/Body properly', () => {
    const Example = (): React.ReactElement => {
      return (
        <BottomSheet isOpen={true}>
          <BottomSheetHeader
            title="Address Details"
            subtitle="Saving addresses will improve your checkout experience"
            trailing={<Badge variant="positive">Action Needed</Badge>}
            titleSuffix={<Counter intent="positive" value={2} />}
          />
          {/* Can't render BottomSheetBody because https://github.com/gorhom/react-native-bottom-sheet/issues/11#issuecomment-1283588472 */}
          {/* <BottomSheetBody>
            <Text>BottomSheet body</Text>
          </BottomSheetBody> */}
          <BottomSheetFooter>
            <Button isFullWidth variant="secondary">
              Remove address
            </Button>
          </BottomSheetFooter>
        </BottomSheet>
      );
    };
    const { toJSON } = renderWithTheme(<Example />);
    expect(toJSON()).toMatchSnapshot();
  });

  test('BottomSheetHeader trailing should not allow any random component', () => {
    const Example = (): React.ReactElement => {
      return (
        <BottomSheet isOpen={true}>
          <BottomSheetHeader title="Address" trailing={<p>random element</p>} />
        </BottomSheet>
      );
    };
    expect(() => renderWithTheme(<Example />)).toThrow(
      '[Blade BottomSheetHeader]: Only one of `Button, Badge, Link, Text` component is accepted as trailing',
    );
  });

  test('BottomSheetHeader trailing should warn about prop overrides', () => {
    jest.spyOn(console, 'warn').mockImplementation();

    const Example = (): React.ReactElement => {
      return (
        <BottomSheet isOpen={true}>
          <BottomSheetHeader title="Address" trailing={<Badge size="large">Hello</Badge>} />
        </BottomSheet>
      );
    };
    renderWithTheme(<Example />);

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        '[Blade BottomSheetHeader]: Do not pass "size" to "Badge" while inside BottomSheetHeader trailing, because we override it.',
      ),
    );
  });
});
