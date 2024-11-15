import Battery100PercentIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<Battery100PercentIcon />', () => {
  it('should render Battery100PercentIcon', () => {
    const renderTree = renderWithTheme(
      <Battery100PercentIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
