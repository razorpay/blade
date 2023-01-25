import PhoneCallIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<PhoneCallIcon />', () => {
  it('should render PhoneCallIcon', () => {
    const { container } = renderWithTheme(
      <PhoneCallIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
