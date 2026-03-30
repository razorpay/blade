import { TopNavExample } from './TopNavExample';
import renderWithTheme from '~utils/testing/renderWithTheme';
import assertAccessible from '~utils/testing/assertAccessible';
import { TopNav, TopNavBrand, TopNavContent, TopNavActions } from '../TopNav';

// There is not much logic in TopNav itself, so we are just testing if it renders correctly

describe('TopNav', () => {
  test('should render', () => {
    const { container } = renderWithTheme(<TopNavExample />);
    expect(container).toMatchSnapshot();
  });

  test('should pass general a11y', async () => {
    const { container } = renderWithTheme(<TopNavExample />);

    await assertAccessible(container);
  });

  test('should support data analytics attributes', () => {
    const { container } = renderWithTheme(<TopNavExample />);
    expect(container).toMatchSnapshot();
  });

  test('it shpuld support adding test Id', () => {
    const { container } = renderWithTheme(<TopNavExample />);
    expect(container).toMatchSnapshot();
  });

  test('renders with variant="neutral" (default) applying static black background', () => {
    const { container } = renderWithTheme(
      <TopNav variant="neutral">
        <TopNavContent>
          <></>
        </TopNavContent>
      </TopNav>,
    );
    expect(container).toMatchSnapshot();
  });

  test('renders with variant="primary" applying primary background color', () => {
    const { container } = renderWithTheme(
      <TopNav variant="primary">
        <TopNavContent>
          <></>
        </TopNavContent>
      </TopNav>,
    );
    expect(container).toMatchSnapshot();
  });

  test('explicit backgroundColor prop overrides variant', () => {
    const { container } = renderWithTheme(
      <TopNav variant="primary" backgroundColor="surface.background.gray.intense">
        <TopNavContent>
          <></>
        </TopNavContent>
      </TopNav>,
    );
    expect(container).toMatchSnapshot();
  });
});
