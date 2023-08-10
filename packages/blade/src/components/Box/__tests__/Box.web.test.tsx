import React from 'react';
import userEvent from '@testing-library/user-event';
import { Box } from '../Box';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Text } from '~components/Typography';

describe('<Box />', () => {
  it('should render Box component with supported styles', () => {
    const { container } = renderWithTheme(
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

      <div>
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
    const { container } = renderWithTheme(
      <Box display="block" as="footer">
        Footer test!
      </Box>,
    );
    expect(container).toMatchInlineSnapshot(`
      .c0 {
        display: block;
      }

      <div>
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
      renderWithTheme(
        <Box
          // @ts-expect-error: Intentional to test bad flow
          backgroundColor="red"
        />,
      );
    } catch (err: unknown) {
      expect(err).toMatchInlineSnapshot(`
        [Error: [Blade: Box]: Oops! Currently you can only use \`transparent\`, \`surface.background.*\`, and \`brand.*\` tokens with backgroundColor property but we received \`red\` instead.

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
      renderWithTheme(
        <Box
          // @ts-expect-error: Intentional to test bad flow
          as="button"
        />,
      );
    } catch (err: unknown) {
      expect(err).toMatchInlineSnapshot(
        `[Error: [Blade: Box]: Invalid \`as\` prop value - button. Only div, section, footer, header, main, aside, nav, span, label are valid values]`,
      );
    }
    console.error = tempConsoleError;
  });

  // https://github.com/razorpay/blade/issues/1480
  it('should not throw error and render properly with undefined backgroundColor', () => {
    const { container } = renderWithTheme(
      <Box backgroundColor={{ base: 'brand.primary.300', l: undefined }}>I am Visible</Box>,
    );
    expect(container).toMatchInlineSnapshot(`
      .c0 {
        background-color: hsla(218,89%,51%,0.09);
      }

      <div>
        <div
          class="c0"
          data-blade-component="box"
        >
          I am Visible
        </div>
      </div>
    `);
  });

  it('should accept "transparent" value for backgroundColor', () => {
    const { container } = renderWithTheme(
      <Box backgroundColor={{ base: 'brand.primary.300', l: 'transparent' }}>I am Visible</Box>,
    );
    expect(container).toMatchInlineSnapshot(`
      .c0 {
        background-color: hsla(218,89%,51%,0.09);
      }

      @media screen and (min-width:1024px) {
        .c0 {
          background-color: transparent;
        }
      }

      <div>
        <div
          class="c0"
          data-blade-component="box"
        >
          I am Visible
        </div>
      </div>
    `);
  });

  it('should support ref on Box', async () => {
    const user = userEvent.setup();
    const boxClickHandler = jest.fn();

    const BoxWithRef = (): React.ReactElement => {
      const ref = React.useRef<HTMLDivElement>(null);

      React.useEffect(() => {
        ref.current?.addEventListener('click', boxClickHandler);
      }, []);

      return (
        <Box ref={ref} marginTop="500px">
          <Text>lower box</Text>
        </Box>
      );
    };

    const { getByText } = renderWithTheme(<BoxWithRef />);
    expect(boxClickHandler).not.toBeCalled();
    await user.click(getByText('lower box'));
    expect(boxClickHandler).toBeCalled();
  });

  it('should support onMouse* callbacks', async () => {
    const user = userEvent.setup();
    const onMouseOverCallback = jest.fn();
    const onMouseEnterCallback = jest.fn();
    const onMouseLeaveCallback = jest.fn();

    const { getByText } = renderWithTheme(
      <Box
        onMouseOver={onMouseOverCallback}
        onMouseEnter={onMouseEnterCallback}
        onMouseLeave={onMouseLeaveCallback}
      >
        <Text>Hoverable Text</Text>
      </Box>,
    );

    expect(onMouseOverCallback).not.toBeCalled();
    expect(onMouseEnterCallback).not.toBeCalled();
    await user.hover(getByText('Hoverable Text'));
    expect(onMouseOverCallback).toBeCalled();
    expect(onMouseEnterCallback).toBeCalled();
    expect(onMouseLeaveCallback).not.toBeCalled();
    await user.unhover(getByText('Hoverable Text'));
    expect(onMouseLeaveCallback).toBeCalled();
  });
});
