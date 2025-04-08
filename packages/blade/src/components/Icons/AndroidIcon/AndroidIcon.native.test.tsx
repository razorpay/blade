import AndroidIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AndroidIcon />', () => {
  it('should render AndroidIcon', () => {
    const renderTree = renderWithTheme(
      <AndroidIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
