import PhoneOffIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PhoneOffIcon />', () => {
  it('should render PhoneOffIcon', () => {
    const { container } = renderWithTheme(
      <PhoneOffIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
