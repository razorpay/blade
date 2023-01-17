import SmartCollectIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<SmartCollectIcon />', () => {
  it('should render SmartCollectIcon', () => {
    const renderTree = renderWithTheme(
      <SmartCollectIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
