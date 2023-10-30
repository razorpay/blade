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
<<<<<<< HEAD
          class="c0"
=======
          class="BaseBox-bmPWx kSojPu"
>>>>>>> e424fbce (feat: increase CSS specificity of components)
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
<<<<<<< HEAD
          class="c0"
=======
          class="BaseBox-bmPWx iygCpc"
>>>>>>> e424fbce (feat: increase CSS specificity of components)
          data-blade-component="box"
        >
          Footer test!
        </footer>
      </div>
    `);
  });
});
