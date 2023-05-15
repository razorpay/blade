import { Text } from 'react-native';
import { Box } from '../Box';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Box />', () => {
  it('should render Box component with supported styles', () => {
    const { toJSON } = renderWithTheme(
      <Box
        display="flex"
        padding="spacing.0"
        // @ts-expect-error: Intentional to test bad flow
        borderRadius="small"
      >
        {/** Using React Native's text instead of our Text component to keep snapshots small. Our Text component is tested separately anyways */}
        <Text>children test!</Text>
      </Box>,
    );
    expect(toJSON()).toMatchInlineSnapshot(`
      <View
        data-blade-component="box"
        display="flex"
        style={
          Array [
            Object {
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
      expect(err).toMatchInlineSnapshot(`
        [Error: [Blade - Box]: Oops! Currently you can only use \`surface.background.*\` tokens with backgroundColor property but we received \`red\` instead.

         Do you have a usecase of using other values? Create an issue on https://github.com/razorpay/blade repo to let us know and we can discuss ✨]
      `);
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
        `[Error: [Blade - Box]: \`as\` prop is not supported on React Native]`,
      );
    }
    console.error = tempConsoleError;
  });
});
