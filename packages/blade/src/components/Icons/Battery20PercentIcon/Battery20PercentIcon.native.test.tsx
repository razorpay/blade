import Battery20PercentIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<Battery20PercentIcon />', () => {
  it('should render Battery20PercentIcon', () => {
    const renderTree = renderWithTheme(
      <Battery20PercentIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
