import AppleIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<AppleIcon />', () => {
  it('should render AppleIcon', () => {
    const { container } = renderWithTheme(
      <AppleIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
