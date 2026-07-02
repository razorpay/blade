import RTBShieldIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<RTBShieldIcon />', () => {
  it('should render RTBShieldIcon', () => {
    const renderTree = renderWithTheme(
      <RTBShieldIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
