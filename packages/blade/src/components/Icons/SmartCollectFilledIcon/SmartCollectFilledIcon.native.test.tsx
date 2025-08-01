import SmartCollectFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SmartCollectFilledIcon />', () => {
  it('should render SmartCollectFilledIcon', () => {
    const renderTree = renderWithTheme(
      <SmartCollectFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
