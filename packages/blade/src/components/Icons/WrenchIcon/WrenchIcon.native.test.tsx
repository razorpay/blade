import WrenchIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<WrenchIcon />', () => {
  it('should render WrenchIcon', () => {
    const renderTree = renderWithTheme(
      <WrenchIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
