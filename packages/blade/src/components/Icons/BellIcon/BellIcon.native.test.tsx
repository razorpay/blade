import BellIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<BellIcon />', () => {
  it('should render BellIcon', () => {
    const renderTree = renderWithTheme(
      <BellIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
