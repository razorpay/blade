import { Box } from '../Box';
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';

describe('<Box />', () => {
  it('should render Box component with supported styles', () => {
    const { container } = renderWithSSR(
      <Box
        display="flex"
        padding="spacing.0"
        // @ts-expect-error: Intentional to test bad flow
        borderRadius="small"
      />,
    );
    expect(container).toMatchInlineSnapshot(`
      <div
        data-reactroot=""
        id="root"
      >
        <div
          class="BaseBoxweb__BaseBox-sc-1icfu8j-0 cVhZTX"
          data-blade-component="Box"
          display="flex"
        />
      </div>
    `);
  });

  it('should throw error for unsupport values', () => {
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
  });
});
