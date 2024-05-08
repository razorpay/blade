import AnchorIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AnchorIcon />', () => {
  it('should render AnchorIcon', () => {
    const renderTree = renderWithTheme(
      <AnchorIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
