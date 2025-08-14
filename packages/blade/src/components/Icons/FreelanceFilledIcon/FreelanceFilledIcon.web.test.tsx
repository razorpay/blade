import FreelanceFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FreelanceFilledIcon />', () => {
  it('should render FreelanceFilledIcon', () => {
    const { container } = renderWithTheme(
      <FreelanceFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
