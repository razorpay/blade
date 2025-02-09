import EngageIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<EngageIcon />', () => {
  it('should render EngageIcon', () => {
    const renderTree = renderWithTheme(
      <EngageIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
