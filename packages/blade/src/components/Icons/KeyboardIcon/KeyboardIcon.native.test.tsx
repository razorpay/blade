import KeyboardIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<KeyboardIcon />', () => {
  it('should render KeyboardIcon', () => {
    const renderTree = renderWithTheme(
      <KeyboardIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
