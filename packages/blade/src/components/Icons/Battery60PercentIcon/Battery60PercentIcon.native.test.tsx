import Battery60PercentIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<Battery60PercentIcon />', () => {
  it('should render Battery60PercentIcon', () => {
    const renderTree = renderWithTheme(
      <Battery60PercentIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
