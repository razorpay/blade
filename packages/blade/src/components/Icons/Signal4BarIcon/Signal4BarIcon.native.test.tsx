import Signal4BarIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<Signal4BarIcon />', () => {
  it('should render Signal4BarIcon', () => {
    const renderTree = renderWithTheme(
      <Signal4BarIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
