import UpiIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<UpiIcon />', () => {
  it('should render UpiIcon', () => {
    const renderTree = renderWithTheme(
      <UpiIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
