import UpiFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<UpiFilledIcon />', () => {
  it('should render UpiFilledIcon', () => {
    const renderTree = renderWithTheme(
      <UpiFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
