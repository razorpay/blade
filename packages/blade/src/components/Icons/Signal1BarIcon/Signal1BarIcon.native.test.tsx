import Signal1BarIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<Signal1BarIcon />', () => {
  it('should render Signal1BarIcon', () => {
    const renderTree = renderWithTheme(
      <Signal1BarIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
