import PlusIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PlusIcon />', () => {
  it('should render PlusIcon', () => {
    const { container } = renderWithTheme(
      <PlusIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
