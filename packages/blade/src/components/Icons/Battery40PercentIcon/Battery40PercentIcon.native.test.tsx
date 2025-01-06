import Battery40PercentIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<Battery40PercentIcon />', () => {
  it('should render Battery40PercentIcon', () => {
    const renderTree = renderWithTheme(
      <Battery40PercentIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
