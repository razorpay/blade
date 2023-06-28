import PhoneIncomingIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PhoneIncomingIcon />', () => {
  it('should render PhoneIncomingIcon', () => {
    const { container } = renderWithTheme(
      <PhoneIncomingIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
