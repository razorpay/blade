import ApertureIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ApertureIcon />', () => {
  it('should render ApertureIcon', () => {
    const renderTree = renderWithTheme(
      <ApertureIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
