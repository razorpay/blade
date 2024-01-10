import PhoneMissedIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PhoneMissedIcon />', () => {
  it('should render PhoneMissedIcon', () => {
    const { container } = renderWithTheme(
      <PhoneMissedIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
