import FreelanceIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FreelanceIcon />', () => {
  it('should render FreelanceIcon', () => {
    const { container } = renderWithTheme(
      <FreelanceIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
