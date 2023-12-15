import CheckSquareIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CheckSquareIcon />', () => {
  it('should render CheckSquareIcon', () => {
    const { container } = renderWithTheme(
      <CheckSquareIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
