import SharpCornerIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SharpCornerIcon />', () => {
  it('should render SharpCornerIcon', () => {
    const renderTree = renderWithTheme(
      <SharpCornerIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
