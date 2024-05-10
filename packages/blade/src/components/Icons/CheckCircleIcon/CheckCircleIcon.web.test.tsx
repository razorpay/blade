import CheckCircleIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CheckCircleIcon />', () => {
  it('should render CheckCircleIcon', () => {
    const { container } = renderWithTheme(
      <CheckCircleIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
