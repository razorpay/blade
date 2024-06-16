import SunsetIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SunsetIcon />', () => {
  it('should render SunsetIcon', () => {
    const renderTree = renderWithTheme(
      <SunsetIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
