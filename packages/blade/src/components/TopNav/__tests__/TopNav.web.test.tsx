import { TopNavExample } from './TopNavExample';
import renderWithTheme from '~utils/testing/renderWithTheme';
import assertAccessible from '~utils/testing/assertAccessible';

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
});
