import Signal0BarIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<Signal0BarIcon />', () => {
  it('should render Signal0BarIcon', () => {
    const renderTree = renderWithTheme(
      <Signal0BarIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
