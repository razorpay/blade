import RTBShieldIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<RTBShieldIcon />', () => {
  it('should render RTBShieldIcon', () => {
    const { container } = renderWithTheme(
      <RTBShieldIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
