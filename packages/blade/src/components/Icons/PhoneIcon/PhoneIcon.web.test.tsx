import PhoneIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<PhoneIcon />', () => {
  it('should render PhoneIcon', () => {
    const { container } = renderWithTheme(
      <PhoneIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
