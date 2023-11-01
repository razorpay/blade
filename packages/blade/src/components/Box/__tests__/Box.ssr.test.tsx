import { Box } from '../Box';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { castWebType } from '~utils';

describe('<Box />', () => {
  it('should render Box component with supported styles', () => {
    const { container } = renderWithSSR(
      <Box
        display="flex"
        padding="spacing.0"
        // @ts-expect-error: Intentional to test bad flow
        fontWeight="bold"
      >
        children test!
      </Box>,
    );
    expect(container).toMatchInlineSnapshot(`
      .c0 {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        padding: 0px;
      }

      <div
        id="root"
      >
        <div
          class="c0"
          data-blade-component="box"
        >
          children test!
        </div>
      </div>
    `);
  });

  it('should render Box as footer tag', () => {
    const { container } = renderWithSSR(
      <Box display={castWebType('block')} as="footer">
        Footer test!
      </Box>,
    );
    expect(container).toMatchInlineSnapshot(`
      .c0 {
        display: block;
      }

      <div
        id="root"
      >
        <footer
          class="c0"
          data-blade-component="box"
        >
          Footer test!
        </footer>
      </div>
    `);
  });

  it('should throw error for unsupport values', () => {
    // Ignoring error from console to not show it while running tests
    const tempConsoleError = console.error;
    console.error = jest.fn();
    try {
      renderWithSSR(
        <Box
          // @ts-expect-error: Intentional to test bad flow
          backgroundColor="red"
        />,
      );
    } catch (err: unknown) {
      expect(err).toMatchInlineSnapshot(`
        [Error: The above error occurred in the <Box> component:

            at backgroundColor (/Users/anurag.hazra/Documents/razorpay/projects/blade/packages/blade/src/components/Box/Box.tsx:222:13)
            at children (/Users/anurag.hazra/Documents/razorpay/projects/blade/packages/blade/src/components/BottomSheet/BottomSheetStack.tsx:26:3)
            at outerTheme (/Users/anurag.hazra/Documents/razorpay/projects/blade/packages/blade/node_modules/styled-components/src/models/ThemeProvider.js:25:31)
            at FloatingDelayGroup (/Users/anurag.hazra/Documents/razorpay/projects/blade/packages/blade/node_modules/@floating-ui/react/dist/floating-ui.react.umd.js:1241:7)
            at themeTokens (/Users/anurag.hazra/Documents/razorpay/projects/blade/packages/blade/src/components/BladeProvider/BladeProvider.web.tsx:12:3)
            at App

        Consider adding an error boundary to your tree to customize error handling behavior.
        Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.]
      `);
    }
    console.error = tempConsoleError;
  });

  it('should throw error for unsupport as prop', () => {
    // Ignoring error from console to not show it while running tests
    const tempConsoleError = console.error;
    console.error = jest.fn();
    try {
      renderWithSSR(
        <Box
          // @ts-expect-error: Intentional to test bad flow
          as="button"
        />,
      );
    } catch (err: unknown) {
      expect(err).toMatchInlineSnapshot(`
        [Error: The above error occurred in the <Box> component:

            at backgroundColor (/Users/anurag.hazra/Documents/razorpay/projects/blade/packages/blade/src/components/Box/Box.tsx:222:13)
            at children (/Users/anurag.hazra/Documents/razorpay/projects/blade/packages/blade/src/components/BottomSheet/BottomSheetStack.tsx:26:3)
            at outerTheme (/Users/anurag.hazra/Documents/razorpay/projects/blade/packages/blade/node_modules/styled-components/src/models/ThemeProvider.js:25:31)
            at FloatingDelayGroup (/Users/anurag.hazra/Documents/razorpay/projects/blade/packages/blade/node_modules/@floating-ui/react/dist/floating-ui.react.umd.js:1241:7)
            at themeTokens (/Users/anurag.hazra/Documents/razorpay/projects/blade/packages/blade/src/components/BladeProvider/BladeProvider.web.tsx:12:3)
            at App

        Consider adding an error boundary to your tree to customize error handling behavior.
        Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.]
      `);
    }
    console.error = tempConsoleError;
  });
});
