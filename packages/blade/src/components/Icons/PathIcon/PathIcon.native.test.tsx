import PathIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PathIcon />', () => {
  it('should render PathIcon', () => {
    const renderTree = renderWithTheme(
      <PathIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
