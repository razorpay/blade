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
      .c0.c0.c0.c0.c0 {
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
      .c0.c0.c0.c0.c0 {
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
        [Error: [Blade: Box]: Oops! Currently you can only use \`transparent\`, \`surface.background.*\`, \`overlay.*\` and \`brand.*\` tokens with backgroundColor property but we received \`red\` instead.

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
      <Box backgroundColor={{ base: 'surface.background.cloud.intense', l: undefined }}>
        I am Visible
      </Box>,
    );
    expect(container).toMatchInlineSnapshot(`
      .c0.c0.c0.c0.c0 {
        background-color: hsla(200,61%,20%,1);
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
      <Box backgroundColor={{ base: 'surface.background.cloud.intense', l: 'transparent' }}>
        I am Visible
      </Box>,
    );
    expect(container).toMatchInlineSnapshot(`
      .c0.c0.c0.c0.c0 {
        background-color: hsla(200,61%,20%,1);
      }

      @media screen and (min-width:1024px) {
        .c0.c0.c0.c0.c0 {
          background-color: hsla(0,0%,100%,0);
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

  it('should accept id prop', () => {
    const text = 'Box id';
    const id = 'my-id';
    const { getByText } = renderWithTheme(<Box id={id}>{text}</Box>);
    expect(getByText(text)).toHaveAttribute('id', id);
  });

  // https://github.com/razorpay/blade/issues/1624
  it('should apply borderBottomColor prop to border bottom only', () => {
    const { container } = renderWithTheme(
      <Box borderBottomColor="surface.border.gray.normal">I am Visible</Box>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should apply borderColor prop to all borders', () => {
    const { container } = renderWithTheme(
      <Box borderColor="surface.border.gray.normal">I am Visible</Box>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should support passing data-analytics  attributes', () => {
    const { container } = renderWithTheme(<Box data-analytics-name="demo" />);
    expect(container).toMatchSnapshot();
  });
  it('should support passing data-analytics  attributes', () => {
    const { container } = renderWithTheme(<Box data-analytics-name="section" as="section" />);
    expect(container).toMatchSnapshot();
  });
});
