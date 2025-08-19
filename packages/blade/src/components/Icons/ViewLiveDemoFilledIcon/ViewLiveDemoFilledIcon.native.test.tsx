import ViewLiveDemoFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ViewLiveDemoFilledIcon />', () => {
  it('should render ViewLiveDemoFilledIcon', () => {
    const renderTree = renderWithTheme(
      <ViewLiveDemoFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
