import CommandIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CommandIcon />', () => {
  it('should render CommandIcon', () => {
    const renderTree = renderWithTheme(
      <CommandIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
