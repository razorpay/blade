import { Box } from '../Box';
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';
import { castWebType } from '~utils';

describe('<Box />', () => {
  it('should render Box component with supported styles', () => {
    const { container } = renderWithSSR(
      <Box
        display="flex"
        padding="spacing.0"
        // @ts-expect-error: Intentional to test bad flow
        borderRadius="small"
      >
        children test!
      </Box>,
    );
    expect(container).toMatchInlineSnapshot(`
      <div
        data-reactroot=""
        id="root"
      >
        <div
          class="BaseBoxweb__BaseBox-sc-1icfu8j-0 cVhZTX"
          data-blade-component="box"
          display="flex"
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
      <div
        data-reactroot=""
        id="root"
      >
        <footer
          class="BaseBoxweb__BaseBox-sc-1icfu8j-0 gxRbfF"
          data-blade-component="box"
          display="block"
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
        [Error: [Blade - Box]: Oops! Currently you can only use \`surface.background.*\` tokens with backgroundColor property but we received \`red\` instead.

         Do you have a usecase of using other values? Create an issue on https://github.com/razorpay/blade repo to let us know and we can discuss ✨]
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
      expect(err).toMatchInlineSnapshot(
        `[Error: [Blade - Box]: Invalid \`as\` prop value - button. Only div, section, footer, header, main, aside, nav, span are valid values]`,
      );
    }
    console.error = tempConsoleError;
  });
});
