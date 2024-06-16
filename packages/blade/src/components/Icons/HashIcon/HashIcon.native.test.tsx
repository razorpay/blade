import HashIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<HashIcon />', () => {
  it('should render HashIcon', () => {
    const renderTree = renderWithTheme(
      <HashIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
