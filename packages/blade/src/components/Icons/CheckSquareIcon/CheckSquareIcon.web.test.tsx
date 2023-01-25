import CheckSquareIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<CheckSquareIcon />', () => {
  it('should render CheckSquareIcon', () => {
    const { container } = renderWithTheme(
      <CheckSquareIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
