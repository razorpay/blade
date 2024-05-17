import SunIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SunIcon />', () => {
  it('should render SunIcon', () => {
    const renderTree = renderWithTheme(
      <SunIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
