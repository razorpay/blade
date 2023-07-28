import React from 'react';
import { Text } from 'react-native';
import { Box } from '../Box';
import type { BoxRefType } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<Box />', () => {
  it('should render Box component with supported styles', () => {
    const { toJSON } = renderWithTheme(
      <Box
        display="flex"
        padding="spacing.0"
        // @ts-expect-error: Intentional to test bad flow
        fontWeight="bold"
      >
        {/** Using React Native's text instead of our Text component to keep snapshots small. Our Text component is tested separately anyways */}
        <Text>children test!</Text>
      </Box>,
    );
    expect(toJSON()).toMatchInlineSnapshot(`
      <View
        style={
          {
            "flex": 1,
          }
        }
      >
        <View
          data-blade-component="box"
          display="flex"
          style={
            [
              {
                "display": "flex",
                "paddingBottom": 0,
                "paddingLeft": 0,
                "paddingRight": 0,
                "paddingTop": 0,
              },
            ]
          }
        >
          <Text>
            children test!
          </Text>
        </View>
      </View>
    `);
  });

  it('should throw error for unsupport values', () => {
    // React Native also prints errors on console. Just ignoring that to not show error in console while running tests
    const tempConsoleError = console.error;
    console.error = jest.fn();
    try {
      renderWithTheme(
        <Box
          // @ts-expect-error: Intentional to test bad flow
          backgroundColor="red"
        />,
      );
    } catch (err: unknown) {
      expect(err).toMatchInlineSnapshot(
        `[Error: An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.]`,
      );
    }
    console.error = tempConsoleError;
  });

  it('should throw error for unsupport as prop values', () => {
    // React Native also prints errors on console. Just ignoring that to not show error in console while running tests
    const tempConsoleError = console.error;
    console.error = jest.fn();
    try {
      renderWithTheme(<Box as="section" />);
    } catch (err: unknown) {
      expect(err).toMatchInlineSnapshot(
        `[Error: An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.]`,
      );
    }
    console.error = tempConsoleError;
  });

  it('should support ref on Box', () => {
    const refHasFocusProp = jest.fn();

    const BoxWithRef = (): React.ReactElement => {
      const ref = React.useRef<BoxRefType>(null);

      React.useEffect(() => {
        refHasFocusProp(Boolean(ref.current?.focus));
      }, []);

      return (
        <Box ref={ref} marginTop="500px">
          <Text>lower box</Text>
        </Box>
      );
    };

    renderWithTheme(<BoxWithRef />);
    // we just check if the ref value has focus prop to make sure it's not null and has appropriate values loaded
    expect(refHasFocusProp).toBeCalledWith(true);
  });
});
