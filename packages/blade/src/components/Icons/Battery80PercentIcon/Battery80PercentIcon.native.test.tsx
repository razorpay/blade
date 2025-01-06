import Battery80PercentIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<Battery80PercentIcon />', () => {
  it('should render Battery80PercentIcon', () => {
    const renderTree = renderWithTheme(
      <Battery80PercentIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
