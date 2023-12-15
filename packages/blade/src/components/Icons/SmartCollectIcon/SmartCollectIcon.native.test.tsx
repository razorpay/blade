import SmartCollectIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SmartCollectIcon />', () => {
  it('should render SmartCollectIcon', () => {
    const renderTree = renderWithTheme(
      <SmartCollectIcon color="feedback.icon.gray.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
